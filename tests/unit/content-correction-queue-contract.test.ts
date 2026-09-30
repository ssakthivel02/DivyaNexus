import { describe, expect, it, vi } from "vitest";
import {
  ContentCorrectionService,
  validateContentCorrectionInput,
  type ContentCorrectionQueueStore,
  type ContentCorrectionRecord,
} from "../../server/contentCorrections/contract";

function memoryStore() {
  const records = new Map<string, ContentCorrectionRecord>();
  const store: ContentCorrectionQueueStore = {
    enqueue(record) {
      records.set(record.id, record);
    },
    getById(id) {
      return records.get(id) ?? null;
    },
  };
  return { records, store };
}

describe("content correction queue contract", () => {
  it("requires a bounded concern and at least one reproducible target", () => {
    expect(() => validateContentCorrectionInput({
      category: "citation-mismatch",
      concern: "The citation label points to the wrong record.",
    })).toThrow("CORRECTION_TARGET_REQUIRED");

    expect(validateContentCorrectionInput({
      category: "citation-mismatch",
      concern: " The citation label points to the wrong record. ",
      recordId: " glossary-dharma ",
    })).toEqual({
      category: "citation-mismatch",
      concern: "The citation label points to the wrong record.",
      recordId: "glossary-dharma",
    });
  });

  it("rejects unknown categories and oversized free text", () => {
    expect(() => validateContentCorrectionInput({
      category: "oracle-error",
      concern: "Unsupported category",
      pageUrl: "/ask-divya",
    })).toThrow("INVALID_CORRECTION_CATEGORY");

    expect(() => validateContentCorrectionInput({
      category: "other",
      concern: "x".repeat(2_001),
      pageUrl: "/sources",
    })).toThrow("INVALID_CORRECTION_REPORT");
  });

  it("creates a deterministic submitted record only through an injected queue store", async () => {
    const { records, store } = memoryStore();
    const service = new ContentCorrectionService({
      store,
      idFactory: () => "correction-test-001",
      now: () => new Date("2026-09-30T08:00:00.000Z"),
    });

    const result = await service.submit({
      category: "ask-divya-response",
      concern: "The explanation appears inconsistent with the visible citation.",
      pageUrl: "/ask-divya",
      askDivyaRequestId: "ask-example",
      questionedText: "Example generated explanation",
      evidence: "Please compare with the cited reviewed record.",
    });

    expect(result).toEqual({
      id: "correction-test-001",
      status: "submitted",
      submittedAt: "2026-09-30T08:00:00.000Z",
      category: "ask-divya-response",
      concern: "The explanation appears inconsistent with the visible citation.",
      pageUrl: "/ask-divya",
      askDivyaRequestId: "ask-example",
      questionedText: "Example generated explanation",
      evidence: "Please compare with the cited reviewed record.",
    });
    expect(records.get("correction-test-001")).toEqual(result);
    expect(await service.get(" correction-test-001 ")).toEqual(result);
  });

  it("does not silently invent persistence when the injected store fails", async () => {
    const enqueue = vi.fn(() => { throw new Error("STORE_UNAVAILABLE"); });
    const service = new ContentCorrectionService({
      store: { enqueue, getById: () => null },
      idFactory: () => "correction-test-002",
    });

    await expect(service.submit({
      category: "unsupported-claim",
      concern: "This claim needs source review.",
      pageUrl: "/sources",
    })).rejects.toThrow("STORE_UNAVAILABLE");
    expect(enqueue).toHaveBeenCalledTimes(1);
  });
});
