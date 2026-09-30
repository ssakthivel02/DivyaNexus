import { describe, expect, it, vi } from "vitest";
import type { AskDivyaProvider } from "../../server/askDivya/provider";
import { ASK_DIVYA_DEFAULT_TIMEOUT_MS, AskDivyaRuntime } from "../../server/askDivya/runtime";

const request = {
  question: "What does dharma mean?",
  language: "en" as const,
  mode: "simple" as const,
  contextRecordIds: ["glossary-dharma"],
};

const provider: AskDivyaProvider = {
  id: "timeout-contract-provider",
  generate: async () => ({ answer: "Grounded answer" }),
};

describe("Ask Divya runtime timeout contract", () => {
  it("keeps the provider-neutral runtime default at the documented 20-second ceiling", async () => {
    expect(ASK_DIVYA_DEFAULT_TIMEOUT_MS).toBe(20_000);

    const timeoutSpy = vi.spyOn(globalThis, "setTimeout");
    try {
      const runtime = new AskDivyaRuntime({ provider });
      const result = await runtime.execute(request);

      expect(result.ok).toBe(true);
      expect(timeoutSpy).toHaveBeenCalledWith(expect.any(Function), ASK_DIVYA_DEFAULT_TIMEOUT_MS);
    } finally {
      timeoutSpy.mockRestore();
    }
  });
});
