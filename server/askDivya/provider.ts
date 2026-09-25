import type { AskDivyaCitation, AskDivyaLanguage, AskDivyaMode } from "./contract";

export interface AskDivyaProviderInput {
  requestId: string;
  question: string;
  language: AskDivyaLanguage;
  mode: AskDivyaMode;
  citations: AskDivyaCitation[];
  context: Array<{
    recordId: string;
    title: string;
    source: string;
    reference: string;
    explanation: string;
  }>;
}

export interface AskDivyaProviderOutput {
  answer: string;
  uncertainty?: string;
  nextStudyRecordIds?: string[];
}

export interface AskDivyaProvider {
  readonly id: string;
  generate(input: AskDivyaProviderInput, signal: AbortSignal): Promise<AskDivyaProviderOutput>;
}

export class ProviderUnavailableError extends Error {
  constructor(message = "ASK_DIVYA_PROVIDER_UNAVAILABLE") {
    super(message);
    this.name = "ProviderUnavailableError";
  }
}
