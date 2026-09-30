import type { AskDivyaRequest } from "./contract";
import type {
  AskDivyaModerationResult,
  AskDivyaQuotaTier,
  AskDivyaRateLimitResult,
  AskDivyaRateLimiter,
} from "./runtime";

const TEN_MINUTES_MS = 10 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_MAX_TRACKED_CLIENTS = 5_000;

interface CounterWindow {
  startedAt: number;
  count: number;
}

interface ClientCounters {
  short: CounterWindow;
  daily: CounterWindow;
}

interface QuotaPolicy {
  shortLimit: number;
  dailyLimit: number;
}

export interface StagingRateLimiterOptions {
  now?: () => number;
  shortLimit?: number;
  shortWindowMs?: number;
  dailyLimit?: number;
  dailyWindowMs?: number;
  signedInShortLimit?: number;
  signedInDailyLimit?: number;
  maxTrackedClients?: number;
}

export function createAskDivyaStagingRateLimiter(options: StagingRateLimiterOptions = {}): AskDivyaRateLimiter {
  const now = options.now ?? Date.now;
  const anonymousPolicy: QuotaPolicy = {
    shortLimit: options.shortLimit ?? 8,
    dailyLimit: options.dailyLimit ?? 30,
  };
  const signedInPolicy: QuotaPolicy = {
    shortLimit: options.signedInShortLimit ?? 20,
    dailyLimit: options.signedInDailyLimit ?? 100,
  };
  const shortWindowMs = options.shortWindowMs ?? TEN_MINUTES_MS;
  const dailyWindowMs = options.dailyWindowMs ?? ONE_DAY_MS;
  const maxTrackedClients = options.maxTrackedClients ?? DEFAULT_MAX_TRACKED_CLIENTS;
  const counters = new Map<string, ClientCounters>();

  if (!Number.isInteger(maxTrackedClients) || maxTrackedClients < 1) {
    throw new Error("maxTrackedClients must be a positive integer");
  }

  function pruneExpiredClients(current: number): number | undefined {
    let earliestExpiry: number | undefined;

    counters.forEach((client, key) => {
      const expiresAt = client.daily.startedAt + dailyWindowMs;
      if (current >= expiresAt) {
        counters.delete(key);
        return;
      }

      if (earliestExpiry === undefined || expiresAt < earliestExpiry) {
        earliestExpiry = expiresAt;
      }
    });

    return earliestExpiry;
  }

  return ({ clientKey, quotaTier }: { clientKey: string; quotaTier: AskDivyaQuotaTier }): AskDivyaRateLimitResult => {
    const current = now();
    const policy = quotaTier === "signed-in" ? signedInPolicy : anonymousPolicy;
    const counterKey = `${quotaTier}:${clientKey}`;
    let existing = counters.get(counterKey);

    if (!existing && counters.size >= maxTrackedClients) {
      const earliestExpiry = pruneExpiredClients(current);
      existing = counters.get(counterKey);

      if (!existing && counters.size >= maxTrackedClients) {
        return {
          allowed: false,
          retryAfterMs: Math.max(1, (earliestExpiry ?? current + shortWindowMs) - current),
        };
      }
    }

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

    if (client.short.count >= policy.shortLimit) {
      return {
        allowed: false,
        retryAfterMs: Math.max(1, shortWindowMs - (current - client.short.startedAt)),
      };
    }
    if (client.daily.count >= policy.dailyLimit) {
      return {
        allowed: false,
        retryAfterMs: Math.max(1, dailyWindowMs - (current - client.daily.startedAt)),
      };
    }

    client.short.count += 1;
    client.daily.count += 1;
    counters.set(counterKey, client);
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
