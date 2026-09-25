export const ASK_DIVYA_LANGUAGES = ["en", "ta"] as const;
export type AskDivyaLanguage = (typeof ASK_DIVYA_LANGUAGES)[number];

export const ASK_DIVYA_MODES = [
  "simple",
  "scholar",
  "tamil",
  "child-friendly",
  "compare",
  "reflection",
] as const;
export type AskDivyaMode = (typeof ASK_DIVYA_MODES)[number];

export interface AskDivyaRequest {
  question: string;
  language: AskDivyaLanguage;
  mode: AskDivyaMode;
  contextRecordIds?: string[];
}

export interface AskDivyaCitation {
  recordId: string;
  label: string;
  route: string;
  source: string;
  reference: string;
  reviewStatus: string;
}

export interface AskDivyaBoundaries {
  generatedExplanation: true;
  notScriptureQuotationUnlessCited: true;
  professionalAdvice: false;
}

export interface AskDivyaResponse {
  requestId: string;
  answer: string;
  language: AskDivyaLanguage;
  mode: AskDivyaMode;
  citations: AskDivyaCitation[];
  boundaries: AskDivyaBoundaries;
  uncertainty: string;
  nextStudyRecordIds: string[];
}

export type AskDivyaErrorCode =
  | "INVALID_REQUEST"
  | "UNSUPPORTED_LANGUAGE"
  | "UNSUPPORTED_MODE"
  | "UNKNOWN_CONTEXT_RECORD"
  | "INSUFFICIENT_REVIEWED_CORPUS";

export interface AskDivyaErrorResponse {
  requestId?: string;
  code: AskDivyaErrorCode;
  message: string;
}

export const ASK_DIVYA_MAX_QUESTION_LENGTH = 1500;

export function validateAskDivyaRequest(input: unknown): AskDivyaRequest {
  if (!input || typeof input !== "object") throw new Error("INVALID_REQUEST");
  const value = input as Record<string, unknown>;
  const question = typeof value.question === "string" ? value.question.trim() : "";
  if (!question || question.length > ASK_DIVYA_MAX_QUESTION_LENGTH) throw new Error("INVALID_REQUEST");
  if (!ASK_DIVYA_LANGUAGES.includes(value.language as AskDivyaLanguage)) throw new Error("UNSUPPORTED_LANGUAGE");
  if (!ASK_DIVYA_MODES.includes(value.mode as AskDivyaMode)) throw new Error("UNSUPPORTED_MODE");
  const contextRecordIds = value.contextRecordIds;
  if (contextRecordIds !== undefined && (!Array.isArray(contextRecordIds) || contextRecordIds.some((item) => typeof item !== "string"))) {
    throw new Error("INVALID_REQUEST");
  }
  return {
    question,
    language: value.language as AskDivyaLanguage,
    mode: value.mode as AskDivyaMode,
    ...(contextRecordIds ? { contextRecordIds: Array.from(new Set(contextRecordIds as string[])) } : {}),
  };
}
