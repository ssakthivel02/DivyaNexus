import { randomUUID } from "crypto";
import { ASK_DIVYA_MAX_ANSWER_WORDS } from "./contract";
import type { AskDivyaRequest, AskDivyaResponse } from "./contract";
import { retrieveAskDivyaContext } from "./retrieval";
import type { AskDivyaProvider, AskDivyaProviderInput, AskDivyaProviderUsage } from "./provider";
import { ProviderUnavailableError } from "./provider";

export interface AskDivyaModerationResult {
  allowed: boolean;
  reason?: string;
}

export type AskDivyaModerator = (request: AskDivyaRequest) => Promise<AskDivyaModerationResult> | AskDivyaModerationResult;

export type AskDivyaQuotaTier = "anonymous" | "signed-in";

export interface AskDivyaRateLimitContext {
  clientKey: string;
  quotaTier: AskDivyaQuotaTier;
}

export interface AskDivyaRateLimitResult {
  allowed: boolean;
  retryAfterMs?: number;
}

export type AskDivyaRateLimiter = (context: AskDivyaRateLimitContext) => Promise<AskDivyaRateLimitResult> | AskDivyaRateLimitResult;

export interface AskDivyaBudgetContext {
  providerId: string;
  clientKey: string;
  requestId: string;
  language: AskDivyaRequest["language"];
  mode: AskDivyaRequest["mode"];
  contextRecordCount: number;
}

export interface AskDivyaBudgetResult {
  allowed: boolean;
  retryAfterMs?: number;
}

export type AskDivyaBudgetGuard = (context: AskDivyaBudgetContext) => Promise<AskDivyaBudgetResult> | AskDivyaBudgetResult;

export interface AskDivyaUsageEvent extends AskDivyaBudgetContext {
  usage: AskDivyaProviderUsage;
}

export type AskDivyaUsageRecorder = (event: AskDivyaUsageEvent) => Promise<void> | void;

export interface AskDivyaRuntimeOptions {
  provider: AskDivyaProvider;
  moderator?: AskDivyaModerator;
  rateLimiter?: AskDivyaRateLimiter;
  budgetGuard?: AskDivyaBudgetGuard;
  usageRecorder?: AskDivyaUsageRecorder;
  timeoutMs?: number;
  failureThreshold?: number;
  cooldownMs?: number;
  now?: () => number;
  requestIdFactory?: () => string;
}

export type AskDivyaRuntimeResult =
  | { ok: true; response: AskDivyaResponse }
  | {
      ok: false;
      code: "BLOCKED" | "RATE_LIMITED" | "BUDGET_EXCEEDED" | "INSUFFICIENT_REVIEWED_CORPUS" | "PROVIDER_UNAVAILABLE";
      message: string;
      retryAfterMs?: number;
    };

function countWords(value: string): number {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export class AskDivyaRuntime {
  private consecutiveFailures = 0;
  private circuitOpenedAt: number | null = null;
  private readonly timeoutMs: number;
  private readonly failureThreshold: number;
  private readonly cooldownMs: number;
  private readonly now: () => number;
  private readonly requestIdFactory: () => string;

  constructor(private readonly options: AskDivyaRuntimeOptions) {
    this.timeoutMs = options.timeoutMs ?? 8_000;
    this.failureThreshold = options.failureThreshold ?? 3;
    this.cooldownMs = options.cooldownMs ?? 30_000;
    this.now = options.now ?? Date.now;
    this.requestIdFactory = options.requestIdFactory ?? (() => `ask-${this.now()}-${randomUUID()}`);
  }

  private circuitOpen(): boolean {
    if (this.circuitOpenedAt === null) return false;
    if (this.now() - this.circuitOpenedAt >= this.cooldownMs) {
      this.circuitOpenedAt = null;
      this.consecutiveFailures = 0;
      return false;
    }
    return true;
  }

  private recordFailure(): void {
    this.consecutiveFailures += 1;
    if (this.consecutiveFailures >= this.failureThreshold) {
      this.circuitOpenedAt = this.now();
    }
  }

  private recordSuccess(): void {
    this.consecutiveFailures = 0;
    this.circuitOpenedAt = null;
  }

  async execute(
    request: AskDivyaRequest,
    clientKey = "anonymous",
    quotaTier: AskDivyaQuotaTier = "anonymous",
  ): Promise<AskDivyaRuntimeResult> {
    if (this.circuitOpen()) {
      return { ok: false, code: "PROVIDER_UNAVAILABLE", message: "Ask Divya live generation is temporarily unavailable." };
    }

    const moderation = await this.options.moderator?.(request);
    if (moderation && !moderation.allowed) {
      return { ok: false, code: "BLOCKED", message: moderation.reason ?? "This request cannot be handled by live generation." };
    }

    const rateLimit = await this.options.rateLimiter?.({ clientKey, quotaTier });
    if (rateLimit && !rateLimit.allowed) {
      return {
        ok: false,
        code: "RATE_LIMITED",
        message: "Too many requests. Please try again later.",
        ...(rateLimit.retryAfterMs !== undefined ? { retryAfterMs: rateLimit.retryAfterMs } : {}),
      };
    }

    const retrieved = retrieveAskDivyaContext(request);
    if (retrieved.blocked || retrieved.records.length === 0) {
      return {
        ok: false,
        code: retrieved.blocked ? "BLOCKED" : "INSUFFICIENT_REVIEWED_CORPUS",
        message: retrieved.blocked
          ? "This request cannot be handled by live generation."
          : "The reviewed DivyaNexus corpus is not sufficient to answer this safely.",
      };
    }

    const requestId = this.requestIdFactory();
    const operationalContext: AskDivyaBudgetContext = {
      providerId: this.options.provider.id,
      clientKey,
      requestId,
      language: request.language,
      mode: request.mode,
      contextRecordCount: retrieved.records.length,
    };
    const budget = await this.options.budgetGuard?.(operationalContext);
    if (budget && !budget.allowed) {
      return {
        ok: false,
        code: "BUDGET_EXCEEDED",
        message: "Ask Divya live generation is temporarily unavailable because its usage budget has been reached.",
        ...(budget.retryAfterMs !== undefined ? { retryAfterMs: budget.retryAfterMs } : {}),
      };
    }

    const providerInput: AskDivyaProviderInput = {
      requestId,
      question: request.question,
      language: request.language,
      mode: request.mode,
      citations: retrieved.citations,
      context: retrieved.records.map((record) => ({
        recordId: record.id,
        title: record.title,
        source: record.source,
        reference: record.reference,
        explanation: record.explanation,
      })),
    };

    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_resolve, reject) => {
      timer = setTimeout(() => {
        controller.abort();
        const error = new Error("ASK_DIVYA_TIMEOUT");
        error.name = "AbortError";
        reject(error);
      }, this.timeoutMs);
    });

    try {
      const generated = await Promise.race([
        this.options.provider.generate(providerInput, controller.signal),
        timeout,
      ]);
      const answer = generated.answer.trim();
      if (!answer) throw new ProviderUnavailableError("EMPTY_PROVIDER_ANSWER");
      if (countWords(answer) > ASK_DIVYA_MAX_ANSWER_WORDS) {
        throw new ProviderUnavailableError("PROVIDER_ANSWER_TOO_LONG");
      }
      if (generated.usage && this.options.usageRecorder) {
        try {
          await this.options.usageRecorder({ ...operationalContext, usage: generated.usage });
        } catch {
          // Usage reporting is operational telemetry; admission must be enforced by budgetGuard before provider execution.
        }
      }
      this.recordSuccess();
      return {
        ok: true,
        response: {
          requestId,
          answer,
          language: request.language,
          mode: request.mode,
          citations: retrieved.citations,
          boundaries: {
            generatedExplanation: true,
            notScriptureQuotationUnlessCited: true,
            professionalAdvice: false,
          },
          uncertainty: generated.uncertainty?.trim() || "Generated explanation based only on the cited reviewed DivyaNexus corpus.",
          nextStudyRecordIds: generated.nextStudyRecordIds ?? retrieved.records.slice(0, 3).map((record) => record.id),
        },
      };
    } catch (error) {
      this.recordFailure();
      return {
        ok: false,
        code: "PROVIDER_UNAVAILABLE",
        message: error instanceof Error && error.name === "AbortError"
          ? "Ask Divya live generation timed out."
          : "Ask Divya live generation is temporarily unavailable.",
      };
    } finally {
      if (timer !== undefined) clearTimeout(timer);
    }
  }
}
