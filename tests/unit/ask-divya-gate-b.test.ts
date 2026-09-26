import { describe, expect, it, vi } from "vitest";
import type { AskDivyaProvider } from "../../server/askDivya/provider";
import { AskDivyaRuntime } from "../../server/askDivya/runtime";

const request = {
  question: "What does dharma mean?",
  language: "en" as const,
  mode: "simple" as const,
  contextRecordIds: ["glossary-dharma"],
};

function provider(generate: AskDivyaProvider["generate"]): AskDivyaProvider {
  return { id: "mock-provider", generate };
}

describe("Ask Divya Gate B guarded runtime", () => {
  it("returns provider output with only Gate A citations and boundaries", async () => {
    const mockProvider = provider(async (input) => ({
      answer: `Dharma study context: ${input.context[0]?.title ?? "reviewed context"}`,
      uncertainty: "Educational explanation from reviewed repository context.",
    }));
    const runtime = new AskDivyaRuntime({
      provider: mockProvider,
      now: () => 1000,
      requestIdFactory: () => "ask-test-1000",
    });

    const result = await runtime.execute(request, "client-a");

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.response.requestId).toBe("ask-test-1000");
    expect(result.response.citations).toHaveLength(1);
    expect(result.response.citations[0]?.recordId).toBe("glossary-dharma");
    expect(result.response.citations[0]?.reviewStatus).toBe("Editorial overview");
    expect(result.response.boundaries).toEqual({
      generatedExplanation: true,
      notScriptureQuotationUnlessCited: true,
      professionalAdvice: false,
    });
  });

  it("blocks before provider execution when moderation denies a request", async () => {
    const generate = vi.fn(async () => ({ answer: "should not run" }));
    const runtime = new AskDivyaRuntime({
      provider: provider(generate),
      moderator: () => ({ allowed: false, reason: "Blocked by safety policy." }),
    });

    const result = await runtime.execute(request);

    expect(result).toEqual({ ok: false, code: "BLOCKED", message: "Blocked by safety policy." });
    expect(generate).not.toHaveBeenCalled();
  });

  it("blocks before provider execution when rate limited", async () => {
    const generate = vi.fn(async () => ({ answer: "should not run" }));
    const runtime = new AskDivyaRuntime({
      provider: provider(generate),
      rateLimiter: () => ({ allowed: false, retryAfterMs: 2500 }),
    });

    const result = await runtime.execute(request, "client-rate-limited");

    expect(result).toEqual({
      ok: false,
      code: "RATE_LIMITED",
      message: "Too many requests. Please try again later.",
      retryAfterMs: 2500,
    });
    expect(generate).not.toHaveBeenCalled();
  });

  it("opens the circuit after repeated provider failures and resets after cooldown", async () => {
    let now = 10_000;
    const generate = vi.fn(async () => {
      throw new Error("provider down");
    });
    const runtime = new AskDivyaRuntime({
      provider: provider(generate),
      failureThreshold: 2,
      cooldownMs: 1000,
      now: () => now,
    });

    expect((await runtime.execute(request)).ok).toBe(false);
    expect((await runtime.execute(request)).ok).toBe(false);
    const openResult = await runtime.execute(request);
    expect(openResult).toEqual({
      ok: false,
      code: "PROVIDER_UNAVAILABLE",
      message: "Ask Divya live generation is temporarily unavailable.",
    });
    expect(generate).toHaveBeenCalledTimes(2);

    now += 1001;
    await runtime.execute(request);
    expect(generate).toHaveBeenCalledTimes(3);
  });

  it("returns a timeout fallback without exposing provider internals", async () => {
    vi.useFakeTimers();
    try {
      const runtime = new AskDivyaRuntime({
        provider: provider((_input, signal) => new Promise((_resolve, reject) => {
          signal.addEventListener("abort", () => {
            const error = new Error("private upstream timeout details");
            error.name = "AbortError";
            reject(error);
          });
        })),
        timeoutMs: 25,
      });

      const pending = runtime.execute(request);
      await vi.advanceTimersByTimeAsync(30);
      const result = await pending;

      expect(result).toEqual({
        ok: false,
        code: "PROVIDER_UNAVAILABLE",
        message: "Ask Divya live generation timed out.",
      });
    } finally {
      vi.useRealTimers();
    }
  });

  it("enforces timeout even when a provider ignores AbortSignal", async () => {
    vi.useFakeTimers();
    try {
      const runtime = new AskDivyaRuntime({
        provider: provider(() => new Promise(() => undefined)),
        timeoutMs: 25,
      });

      const pending = runtime.execute(request);
      await vi.advanceTimersByTimeAsync(30);
      const result = await pending;

      expect(result).toEqual({
        ok: false,
        code: "PROVIDER_UNAVAILABLE",
        message: "Ask Divya live generation timed out.",
      });
    } finally {
      vi.useRealTimers();
    }
  });
});
