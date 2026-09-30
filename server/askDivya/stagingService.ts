import type { AskDivyaErrorCode } from "./contract";
import { validateAskDivyaRequest } from "./contract";
import type { AskDivyaQuotaTier, AskDivyaRuntimeResult } from "./runtime";
import { AskDivyaRuntime } from "./runtime";
import { AskDivyaStagingMockProvider } from "./mockProvider";
import {
  AskDivyaClientConcurrencyGuard,
  createAskDivyaStagingRateLimiter,
  moderateAskDivyaStagingRequest,
} from "./stagingSafety";

export interface AskDivyaStagingHealth {
  ok: true;
  stage: "gate-c-prep";
  provider: "staging-mock-v1";
  liveProviderEnabled: false;
}

export type AskDivyaStagingResult =
  | AskDivyaRuntimeResult
  | {
      ok: false;
      code: AskDivyaErrorCode;
      message: string;
      retryAfterMs?: number;
    };

export interface AskDivyaTrustedRequestContext {
  clientKey: string;
  quotaTier: AskDivyaQuotaTier;
}

export interface AskDivyaStagingService {
  health(): AskDivyaStagingHealth;
  ask(input: unknown, clientKey?: string): Promise<AskDivyaStagingResult>;
  askTrusted(input: unknown, context: AskDivyaTrustedRequestContext): Promise<AskDivyaStagingResult>;
}

const VALIDATION_ERROR_CODES = new Set<string>([
  "INVALID_REQUEST",
  "UNSUPPORTED_LANGUAGE",
  "UNSUPPORTED_MODE",
  "UNKNOWN_CONTEXT_RECORD",
  "INSUFFICIENT_REVIEWED_CORPUS",
]);

function validationErrorCode(error: unknown): AskDivyaErrorCode {
  if (error instanceof Error && VALIDATION_ERROR_CODES.has(error.message)) {
    return error.message as AskDivyaErrorCode;
  }
  return "INVALID_REQUEST";
}

export function statusForAskDivyaResult(result: AskDivyaStagingResult): number {
  if (result.ok) return 200;

  switch (result.code) {
    case "RATE_LIMITED":
      return 429;
    case "BUDGET_EXCEEDED":
    case "PROVIDER_UNAVAILABLE":
      return 503;
    case "BLOCKED":
    case "INSUFFICIENT_REVIEWED_CORPUS":
      return 422;
    case "INVALID_REQUEST":
    case "UNSUPPORTED_LANGUAGE":
    case "UNSUPPORTED_MODE":
    case "UNKNOWN_CONTEXT_RECORD":
    default:
      return 400;
  }
}

export function createAskDivyaStagingService(): AskDivyaStagingService {
  const concurrency = new AskDivyaClientConcurrencyGuard();
  const runtime = new AskDivyaRuntime({
    provider: new AskDivyaStagingMockProvider(),
    moderator: moderateAskDivyaStagingRequest,
    rateLimiter: createAskDivyaStagingRateLimiter(),
    timeoutMs: 2_000,
    failureThreshold: 2,
    cooldownMs: 5_000,
  });

  async function executeWithTrustedContext(
    input: unknown,
    context: AskDivyaTrustedRequestContext,
  ): Promise<AskDivyaStagingResult> {
    let acquired = false;
    try {
      const request = validateAskDivyaRequest(input);
      acquired = concurrency.tryAcquire(context.clientKey);
      if (!acquired) {
        return {
          ok: false,
          code: "RATE_LIMITED",
          message: "Another Ask Divya request is already active for this client.",
          retryAfterMs: 1000,
        };
      }
      return await runtime.execute(request, context.clientKey, context.quotaTier);
    } catch (error) {
      return {
        ok: false,
        code: validationErrorCode(error),
        message: "Invalid Ask Divya staging request.",
      };
    } finally {
      if (acquired) concurrency.release(context.clientKey);
    }
  }

  return {
    health() {
      return {
        ok: true,
        stage: "gate-c-prep",
        provider: "staging-mock-v1",
        liveProviderEnabled: false,
      };
    },

    ask(input: unknown, clientKey = "anonymous") {
      return executeWithTrustedContext(input, { clientKey, quotaTier: "anonymous" });
    },

    askTrusted(input: unknown, context: AskDivyaTrustedRequestContext) {
      return executeWithTrustedContext(input, context);
    },
  };
}
