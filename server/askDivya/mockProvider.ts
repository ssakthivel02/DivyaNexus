import type { AskDivyaProvider, AskDivyaProviderInput, AskDivyaProviderOutput } from "./provider";

export class AskDivyaStagingMockProvider implements AskDivyaProvider {
  readonly id = "staging-mock-v1";

  async generate(input: AskDivyaProviderInput, signal: AbortSignal): Promise<AskDivyaProviderOutput> {
    if (signal.aborted) {
      const error = new Error("ABORTED");
      error.name = "AbortError";
      throw error;
    }

    const primary = input.context[0];
    if (!primary) {
      return {
        answer: "No reviewed staging context was available.",
        uncertainty: "Staging mock provider only responds from reviewed DivyaNexus context.",
        nextStudyRecordIds: [],
      };
    }

    const answer = input.language === "ta"
      ? `STAGING MOCK: ${primary.title} பற்றிய இந்த விளக்கம் பரிசோதனைக்காக மட்டும் உருவாக்கப்பட்டது. ${primary.explanation}`
      : `STAGING MOCK: This test-only explanation is grounded in ${primary.title}. ${primary.explanation}`;

    return {
      answer,
      uncertainty: "STAGING MOCK ONLY — no live AI provider was called.",
      nextStudyRecordIds: input.context.slice(0, 3).map((record) => record.recordId),
    };
  }
}
