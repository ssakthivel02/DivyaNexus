import type { AskDivyaRequest, AskDivyaResponse } from "./contract";
import { retrieveAskDivyaContext } from "./retrieval";
import type { AskDivyaProvider, AskDivyaProviderInput } from "./provider";
import { ProviderUnavailableError } from "./provider";

export interface AskDivyaModerationResult {
  allowed: boolean;
  reason?: string;
}

export type AskDivyaModerator = (request: AskDivyaRequest) => Promise<AskDivyaModerationResult> | AskDivyaModerationResult;

export interface AskDivyaRateLimitResult {
  allowed: boolean;
  retryAfterMs?: number;
}

export type AskDivyaRateLimiter = (key: string) => Promise<AskDivyaRateLimitResult> | AskDivyaRateLimitResult;

export interface AskDivyaRuntimeOptions {
  provider: AskDivyaProvider;
  moderator?: AskDivyaModerator;
  rateLimiter?: AskDivyaRateLimiter;
  timeoutMs?: number;
  failureThreshold?: number;
  cooldownMs?: number;
  now?: () => number;
}

export type AskDivyaRuntimeResult =
  | { ok: true; response: AskDivyaResponse }
  | {
      ok: false;
      code: "BLOCKED" | "RATE_LIMITED" | "INSUFFICIENT_REVIEWED_CORPUS" | "PROVIDER_UNAVAILABLE";
      message: string;
      retryAfterMs?: number;
    };

export class AskDivyaRuntime {
  private consecutiveFailures = 0;
  private circuitOpenedAt: number | null = null;
  private readonly timeoutMs: number;
  private readonly failureThreshold: number;
  private readonly cooldownMs: number;
  private readonly now: () => number;

  constructor(private readonly options: AskDivyaRuntimeOptions) {
    this.timeoutMs = options.timeoutMs ?? 8_000;
    this.failureThreshold = options.failureThreshold ?? 3;
    this.cooldownMs = options.cooldownMs ?? 30_000;
    this.now = options.now ?? Date.now;
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

  async execute(request: AskDivyaRequest, clientKey = "anonymous"): Promise<AskDivyaRuntimeResult> {
    if (this.circuitOpen()) {
      return { ok: false, code: "PROVIDER_UNAVAILABLE", message: "Ask Divya live generation is temporarily unavailable." };
    }

    const moderation = await this.options.moderator?.(request);
    if (moderation && !moderation.allowed) {
      return { ok: false, code: "BLOCKED", message: moderation.reason ?? "This request cannot be handled by live generation." };
    }

    const rateLimit = await this.options.rateLimiter?.(clientKey);
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

    const requestId = `ask-${this.now()}`;
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
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const generated = await this.options.provider.generate(providerInput, controller.signal);
      if (!generated.answer.trim()) throw new ProviderUnavailableError("EMPTY_PROVIDER_ANSWER");
      this.recordSuccess();
      return {
        ok: true,
        response: {
          requestId,
          answer: generated.answer.trim(),
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
      clearTimeout(timer);
    }
  }
}
