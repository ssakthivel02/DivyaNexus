import { randomUUID } from "crypto";

export const CONTENT_CORRECTION_CATEGORIES = [
  "source-attribution",
  "citation-mismatch",
  "transliteration",
  "translation",
  "tradition-context",
  "unsupported-claim",
  "accessibility",
  "ask-divya-response",
  "other",
] as const;

export type ContentCorrectionCategory = (typeof CONTENT_CORRECTION_CATEGORIES)[number];

export const CONTENT_CORRECTION_STATUSES = [
  "submitted",
  "triage",
  "source-review",
  "needs-review",
  "resolved",
  "closed",
] as const;

export type ContentCorrectionStatus = (typeof CONTENT_CORRECTION_STATUSES)[number];

export interface ContentCorrectionInput {
  category: ContentCorrectionCategory;
  concern: string;
  pageUrl?: string;
  recordId?: string;
  askDivyaRequestId?: string;
  questionedText?: string;
  evidence?: string;
}

export interface ContentCorrectionRecord extends ContentCorrectionInput {
  id: string;
  status: ContentCorrectionStatus;
  submittedAt: string;
}

export interface ContentCorrectionRetentionPolicy {
  retentionMs: number;
}

export interface ContentCorrectionQueueStore {
  enqueue(record: ContentCorrectionRecord): Promise<void> | void;
  getById(id: string): Promise<ContentCorrectionRecord | null> | ContentCorrectionRecord | null;
  purgeBefore(cutoffIso: string): Promise<number> | number;
}

const MAX_CONCERN_LENGTH = 2_000;
const MAX_TEXT_LENGTH = 4_000;
const MAX_EVIDENCE_LENGTH = 4_000;
const MAX_IDENTIFIER_LENGTH = 200;
const MAX_URL_LENGTH = 2_048;

function optionalText(value: unknown, maxLength: number): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") throw new Error("INVALID_CORRECTION_REPORT");
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) throw new Error("INVALID_CORRECTION_REPORT");
  return trimmed;
}

export function validateContentCorrectionInput(input: unknown): ContentCorrectionInput {
  if (!input || typeof input !== "object") throw new Error("INVALID_CORRECTION_REPORT");
  const value = input as Record<string, unknown>;
  if (!CONTENT_CORRECTION_CATEGORIES.includes(value.category as ContentCorrectionCategory)) {
    throw new Error("INVALID_CORRECTION_CATEGORY");
  }

  const concern = optionalText(value.concern, MAX_CONCERN_LENGTH);
  if (!concern) throw new Error("INVALID_CORRECTION_REPORT");

  const pageUrl = optionalText(value.pageUrl, MAX_URL_LENGTH);
  const recordId = optionalText(value.recordId, MAX_IDENTIFIER_LENGTH);
  const askDivyaRequestId = optionalText(value.askDivyaRequestId, MAX_IDENTIFIER_LENGTH);
  const questionedText = optionalText(value.questionedText, MAX_TEXT_LENGTH);
  const evidence = optionalText(value.evidence, MAX_EVIDENCE_LENGTH);

  if (!pageUrl && !recordId && !askDivyaRequestId) {
    throw new Error("CORRECTION_TARGET_REQUIRED");
  }

  return {
    category: value.category as ContentCorrectionCategory,
    concern,
    ...(pageUrl ? { pageUrl } : {}),
    ...(recordId ? { recordId } : {}),
    ...(askDivyaRequestId ? { askDivyaRequestId } : {}),
    ...(questionedText ? { questionedText } : {}),
    ...(evidence ? { evidence } : {}),
  };
}

export function validateContentCorrectionRetentionPolicy(input: unknown): ContentCorrectionRetentionPolicy {
  if (!input || typeof input !== "object") throw new Error("INVALID_CORRECTION_RETENTION_POLICY");
  const retentionMs = (input as Record<string, unknown>).retentionMs;
  if (typeof retentionMs !== "number" || !Number.isSafeInteger(retentionMs) || retentionMs <= 0) {
    throw new Error("INVALID_CORRECTION_RETENTION_POLICY");
  }
  return { retentionMs };
}

export interface ContentCorrectionServiceOptions {
  store: ContentCorrectionQueueStore;
  idFactory?: () => string;
  now?: () => Date;
}

export class ContentCorrectionService {
  private readonly idFactory: () => string;
  private readonly now: () => Date;

  constructor(private readonly options: ContentCorrectionServiceOptions) {
    this.idFactory = options.idFactory ?? (() => `correction-${randomUUID()}`);
    this.now = options.now ?? (() => new Date());
  }

  async submit(input: unknown): Promise<ContentCorrectionRecord> {
    const validated = validateContentCorrectionInput(input);
    const record: ContentCorrectionRecord = {
      ...validated,
      id: this.idFactory(),
      status: "submitted",
      submittedAt: this.now().toISOString(),
    };
    await this.options.store.enqueue(record);
    return record;
  }

  async get(id: string): Promise<ContentCorrectionRecord | null> {
    const normalized = id.trim();
    if (!normalized || normalized.length > MAX_IDENTIFIER_LENGTH) throw new Error("INVALID_CORRECTION_ID");
    return await this.options.store.getById(normalized);
  }

  async purgeExpired(policy: unknown): Promise<number> {
    const { retentionMs } = validateContentCorrectionRetentionPolicy(policy);
    const cutoff = new Date(this.now().getTime() - retentionMs);
    if (Number.isNaN(cutoff.getTime())) throw new Error("INVALID_CORRECTION_RETENTION_POLICY");

    const purged = await this.options.store.purgeBefore(cutoff.toISOString());
    if (!Number.isSafeInteger(purged) || purged < 0) throw new Error("INVALID_CORRECTION_PURGE_RESULT");
    return purged;
  }
}
