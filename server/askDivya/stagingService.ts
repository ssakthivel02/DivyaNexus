import { validateAskDivyaRequest } from "./contract";
import { AskDivyaRuntime } from "./runtime";
import { AskDivyaStagingMockProvider } from "./mockProvider";

export interface AskDivyaStagingHealth {
  ok: true;
  stage: "gate-c-prep";
  provider: "staging-mock-v1";
  liveProviderEnabled: false;
}

export interface AskDivyaStagingService {
  health(): AskDivyaStagingHealth;
  ask(input: unknown, clientKey?: string): Promise<unknown>;
}

export function createAskDivyaStagingService(): AskDivyaStagingService {
  const runtime = new AskDivyaRuntime({
    provider: new AskDivyaStagingMockProvider(),
    timeoutMs: 2_000,
    failureThreshold: 2,
    cooldownMs: 5_000,
  });

  return {
    health() {
      return {
        ok: true,
        stage: "gate-c-prep",
        provider: "staging-mock-v1",
        liveProviderEnabled: false,
      };
    },

    async ask(input: unknown, clientKey = "anonymous") {
      try {
        const request = validateAskDivyaRequest(input);
        return await runtime.execute(request, clientKey);
      } catch (error) {
        return {
          ok: false,
          code: error instanceof Error ? error.message : "INVALID_REQUEST",
          message: "Invalid Ask Divya staging request.",
        };
      }
    },
  };
}
