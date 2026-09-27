import { describe, expect, it } from "vitest";
import { createAskDivyaStagingService, statusForAskDivyaResult } from "../../server/askDivya/stagingService";
import {
  AskDivyaClientConcurrencyGuard,
  createAskDivyaStagingRateLimiter,
  moderateAskDivyaStagingRequest,
} from "../../server/askDivya/stagingSafety";

const safeRequest = {
  question: "What does dharma mean?",
  language: "en" as const,
  mode: "simple" as const,
  contextRecordIds: ["glossary-dharma"],
};

describe("Ask Divya Gate C operational safety", () => {
  it("enforces the anonymous short-window limit and resets after the window", async () => {
    let now = 1_000;
    const limiter = createAskDivyaStagingRateLimiter({ now: () => now });

    for (let index = 0; index < 8; index += 1) {
      expect(await limiter("client-a")).toEqual({ allowed: true });
    }

    const blocked = await limiter("client-a");
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBe(10 * 60 * 1000);

    now += 10 * 60 * 1000;
    expect(await limiter("client-a")).toEqual({ allowed: true });
  });

  it("enforces the anonymous daily limit across refreshed short windows", async () => {
    let now = 10_000;
    const limiter = createAskDivyaStagingRateLimiter({ now: () => now });

    for (let batch = 0; batch < 3; batch += 1) {
      for (let index = 0; index < 8; index += 1) {
        expect((await limiter("client-daily")).allowed).toBe(true);
      }
      now += 10 * 60 * 1000;
    }

    for (let index = 0; index < 6; index += 1) {
      expect((await limiter("client-daily")).allowed).toBe(true);
    }

    const blocked = await limiter("client-daily");
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });

  it("keeps counters isolated per client", async () => {
    const limiter = createAskDivyaStagingRateLimiter({ shortLimit: 1, dailyLimit: 2 });

    expect((await limiter("client-a")).allowed).toBe(true);
    expect((await limiter("client-a")).allowed).toBe(false);
    expect((await limiter("client-b")).allowed).toBe(true);
  });

  it("fails closed for unseen clients when the bounded tracker is full", async () => {
    let now = 1_000;
    const limiter = createAskDivyaStagingRateLimiter({
      now: () => now,
      maxTrackedClients: 2,
      dailyWindowMs: 60_000,
    });

    expect((await limiter("client-a")).allowed).toBe(true);
    now += 10_000;
    expect((await limiter("client-b")).allowed).toBe(true);

    const blocked = await limiter("client-c");
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBe(50_000);

    expect((await limiter("client-a")).allowed).toBe(true);
  });

  it("prunes stale tracked clients before admitting a new client", async () => {
    let now = 1_000;
    const limiter = createAskDivyaStagingRateLimiter({
      now: () => now,
      maxTrackedClients: 2,
      dailyWindowMs: 60_000,
    });

    expect((await limiter("client-a")).allowed).toBe(true);
    now += 10_000;
    expect((await limiter("client-b")).allowed).toBe(true);

    now = 61_000;
    expect((await limiter("client-c")).allowed).toBe(true);
    expect((await limiter("client-b")).allowed).toBe(true);
  });

  it("rejects invalid bounded-tracker capacity", () => {
    expect(() => createAskDivyaStagingRateLimiter({ maxTrackedClients: 0 })).toThrow(
      "maxTrackedClients must be a positive integer",
    );
    expect(() => createAskDivyaStagingRateLimiter({ maxTrackedClients: 1.5 })).toThrow(
      "maxTrackedClients must be a positive integer",
    );
  });

  it("blocks professional-advice and guaranteed-outcome requests while allowing educational questions", () => {
    expect(moderateAskDivyaStagingRequest(safeRequest)).toEqual({ allowed: true });

    expect(moderateAskDivyaStagingRequest({
      ...safeRequest,
      question: "Give me medical advice and prescribe a treatment.",
    })).toEqual({
      allowed: false,
      reason: "This request is outside Ask Divya's educational safety boundaries.",
    });

    expect(moderateAskDivyaStagingRequest({
      ...safeRequest,
      question: "Give me a guaranteed remedy that will certainly heal me.",
    }).allowed).toBe(false);
  });

  it("allows only one active request per client and releases deterministically", () => {
    const guard = new AskDivyaClientConcurrencyGuard();

    expect(guard.tryAcquire("client-a")).toBe(true);
    expect(guard.tryAcquire("client-a")).toBe(false);
    expect(guard.tryAcquire("client-b")).toBe(true);

    guard.release("client-a");
    expect(guard.tryAcquire("client-a")).toBe(true);
  });

  it("wires moderation into staging transport with a 422 response", async () => {
    const staging = createAskDivyaStagingService();
    const result = await staging.ask({
      ...safeRequest,
      question: "Give me financial advice with a guaranteed return.",
    }, "moderation-client");

    expect(result).toEqual({
      ok: false,
      code: "BLOCKED",
      message: "This request is outside Ask Divya's educational safety boundaries.",
    });
    expect(statusForAskDivyaResult(result)).toBe(422);
  });

  it("wires anonymous rate limiting into staging transport with a 429 response", async () => {
    const staging = createAskDivyaStagingService();

    for (let index = 0; index < 8; index += 1) {
      const allowed = await staging.ask(safeRequest, "rate-client");
      expect(allowed.ok).toBe(true);
    }

    const blocked = await staging.ask(safeRequest, "rate-client");
    expect(blocked.ok).toBe(false);
    if (blocked.ok) return;
    expect(blocked.code).toBe("RATE_LIMITED");
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
    expect(statusForAskDivyaResult(blocked)).toBe(429);
  });
});
