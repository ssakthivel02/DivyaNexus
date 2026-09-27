import type { AskDivyaRequest } from "./contract";
import type { AskDivyaModerationResult, AskDivyaRateLimitResult, AskDivyaRateLimiter } from "./runtime";

const TEN_MINUTES_MS = 10 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

interface CounterWindow {
  startedAt: number;
  count: number;
}

interface ClientCounters {
  short: CounterWindow;
  daily: CounterWindow;
}

export interface StagingRateLimiterOptions {
  now?: () => number;
  shortLimit?: number;
  shortWindowMs?: number;
  dailyLimit?: number;
  dailyWindowMs?: number;
}

export function createAskDivyaStagingRateLimiter(options: StagingRateLimiterOptions = {}): AskDivyaRateLimiter {
  const now = options.now ?? Date.now;
  const shortLimit = options.shortLimit ?? 8;
  const shortWindowMs = options.shortWindowMs ?? TEN_MINUTES_MS;
  const dailyLimit = options.dailyLimit ?? 30;
  const dailyWindowMs = options.dailyWindowMs ?? ONE_DAY_MS;
  const counters = new Map<string, ClientCounters>();

  return (clientKey: string): AskDivyaRateLimitResult => {
    const current = now();
    const existing = counters.get(clientKey);
    const client = existing ?? {
      short: { startedAt: current, count: 0 },
      daily: { startedAt: current, count: 0 },
    };

    if (current - client.short.startedAt >= shortWindowMs) {
      client.short = { startedAt: current, count: 0 };
    }
    if (current - client.daily.startedAt >= dailyWindowMs) {
      client.daily = { startedAt: current, count: 0 };
    }

    if (client.short.count >= shortLimit) {
      return {
        allowed: false,
        retryAfterMs: Math.max(1, shortWindowMs - (current - client.short.startedAt)),
      };
    }
    if (client.daily.count >= dailyLimit) {
      return {
        allowed: false,
        retryAfterMs: Math.max(1, dailyWindowMs - (current - client.daily.startedAt)),
      };
    }

    client.short.count += 1;
    client.daily.count += 1;
    counters.set(clientKey, client);
    return { allowed: true };
  };
}

const BLOCKED_REQUEST_PATTERNS: RegExp[] = [
  /(?:diagnose|diagnosis|prescribe|prescription|dosage|dose|treat my|cure my|medical advice)/i,
  /(?:legal advice|what should i plead|how should i sue|evade the law)/i,
  /(?:financial advice|guaranteed return|guaranteed profit|which stock should i buy)/i,
  /(?:guarantee(?:d)?\s+(?:remedy|healing|result|outcome|blessing)|certainly\s+(?:cure|heal|fix))/i,
];

export function moderateAskDivyaStagingRequest(request: AskDivyaRequest): AskDivyaModerationResult {
  const blocked = BLOCKED_REQUEST_PATTERNS.some((pattern) => pattern.test(request.question));
  if (!blocked) return { allowed: true };

  return {
    allowed: false,
    reason: "This request is outside Ask Divya's educational safety boundaries.",
  };
}

export class AskDivyaClientConcurrencyGuard {
  private readonly activeClients = new Set<string>();

  tryAcquire(clientKey: string): boolean {
    if (this.activeClients.has(clientKey)) return false;
    this.activeClients.add(clientKey);
    return true;
  }

  release(clientKey: string): void {
    this.activeClients.delete(clientKey);
  }
}
