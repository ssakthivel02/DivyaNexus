import { describe, expect, it, vi } from "vitest";
import {
  ContentCorrectionService,
  type ContentCorrectionDeletionAuditEvent,
  type ContentCorrectionQueueStore,
  type ContentCorrectionRecord,
} from "../../server/contentCorrections/contract";

function deletionReadyStore(record: ContentCorrectionRecord) {
  const records = new Map<string, ContentCorrectionRecord>([[record.id, record]]);
  const auditEvents: ContentCorrectionDeletionAuditEvent[] = [];
  const store: ContentCorrectionQueueStore = {
    enqueue(next) {
      records.set(next.id, next);
    },
    getById(id) {
      return records.get(id) ?? null;
    },
    purgeBefore() {
      return 0;
    },
    transitionStatus() {
      return null;
    },
    deleteWithAudit(id, expectedStatus, event) {
      const current = records.get(id);
      if (!current || current.status !== expectedStatus) return false;
      auditEvents.push(event);
      records.delete(id);
      return true;
    },
  };
  return { records, auditEvents, store };
}

const baseRecord: ContentCorrectionRecord = {
  id: "correction-delete-001",
  status: "resolved",
  submittedAt: "2026-09-30T08:00:00.000Z",
  category: "citation-mismatch",
  concern: "The visible citation needs correction.",
  recordId: "glossary-dharma",
  questionedText: "Example text that must not enter the audit event.",
  evidence: "Example evidence that must not enter the audit event.",
};

describe("content correction deletion and audit readiness", () => {
  it("fails closed when deletion authorization is not supplied", async () => {
    const { records, auditEvents, store } = deletionReadyStore(baseRecord);
    const service = new ContentCorrectionService({ store });

    await expect(service.deleteCorrection(
      "correction-delete-001",
      { actorRef: "trusted-editorial-session" },
    )).rejects.toThrow("CORRECTION_DELETION_AUTHORIZATION_REQUIRED");

    expect(records.has("correction-delete-001")).toBe(true);
    expect(auditEvents).toHaveLength(0);
  });

  it("fails closed when an atomic delete-and-audit store capability is absent", async () => {
    const store: ContentCorrectionQueueStore = {
      enqueue: () => undefined,
      getById: () => baseRecord,
      purgeBefore: () => 0,
      transitionStatus: () => null,
    };
    const service = new ContentCorrectionService({
      store,
      deletionAuthorizer: () => true,
    });

    await expect(service.deleteCorrection(
      "correction-delete-001",
      { actorRef: "trusted-editorial-session" },
    )).rejects.toThrow("CORRECTION_ATOMIC_DELETE_AUDIT_REQUIRED");
  });

  it("authorizes deletion and emits only bounded audit metadata atomically", async () => {
    const { records, auditEvents, store } = deletionReadyStore(baseRecord);
    const deletionAuthorizer = vi.fn(() => true);
    const service = new ContentCorrectionService({
      store,
      deletionAuthorizer,
      auditEventIdFactory: () => " audit-delete-001 ",
      now: () => new Date("2026-09-30T10:30:00.000Z"),
    });

    const event = await service.deleteCorrection(
      " correction-delete-001 ",
      { actorRef: " editorial-session-42 " },
    );

    expect(event).toEqual({
      id: "audit-delete-001",
      correctionId: "correction-delete-001",
      action: "deleted",
      occurredAt: "2026-09-30T10:30:00.000Z",
      previousStatus: "resolved",
      actorRef: "editorial-session-42",
    });
    expect(Object.isFrozen(event)).toBe(true);
    expect(event).not.toHaveProperty("concern");
    expect(event).not.toHaveProperty("questionedText");
    expect(event).not.toHaveProperty("evidence");
    expect(event).not.toHaveProperty("pageUrl");
    expect(event).not.toHaveProperty("recordId");
    expect(auditEvents).toEqual([event]);
    expect(records.has("correction-delete-001")).toBe(false);
    expect(deletionAuthorizer).toHaveBeenCalledWith({
      actor: { actorRef: "editorial-session-42" },
      record: baseRecord,
    });
  });

  it("does not delete when authorization is denied", async () => {
    const { records, auditEvents, store } = deletionReadyStore(baseRecord);
    const service = new ContentCorrectionService({
      store,
      deletionAuthorizer: () => false,
    });

    await expect(service.deleteCorrection(
      "correction-delete-001",
      { actorRef: "editorial-session-42" },
    )).rejects.toThrow("CORRECTION_DELETION_FORBIDDEN");

    expect(records.has("correction-delete-001")).toBe(true);
    expect(auditEvents).toHaveLength(0);
  });

  it("fails closed on delete conflict, invalid result or store failure", async () => {
    const conflictStore: ContentCorrectionQueueStore = {
      enqueue: () => undefined,
      getById: () => baseRecord,
      purgeBefore: () => 0,
      transitionStatus: () => null,
      deleteWithAudit: () => false,
    };
    const conflicting = new ContentCorrectionService({
      store: conflictStore,
      deletionAuthorizer: () => true,
    });
    await expect(conflicting.deleteCorrection(
      "correction-delete-001",
      { actorRef: "editorial-session-42" },
    )).rejects.toThrow("CORRECTION_DELETE_CONFLICT");

    const invalidStore: ContentCorrectionQueueStore = {
      ...conflictStore,
      deleteWithAudit: (() => "yes") as unknown as ContentCorrectionQueueStore["deleteWithAudit"],
    };
    const invalid = new ContentCorrectionService({
      store: invalidStore,
      deletionAuthorizer: () => true,
    });
    await expect(invalid.deleteCorrection(
      "correction-delete-001",
      { actorRef: "editorial-session-42" },
    )).rejects.toThrow("INVALID_CORRECTION_DELETE_RESULT");

    const failingStore: ContentCorrectionQueueStore = {
      ...conflictStore,
      deleteWithAudit: () => { throw new Error("STORE_UNAVAILABLE"); },
    };
    const failing = new ContentCorrectionService({
      store: failingStore,
      deletionAuthorizer: () => true,
    });
    await expect(failing.deleteCorrection(
      "correction-delete-001",
      { actorRef: "editorial-session-42" },
    )).rejects.toThrow("STORE_UNAVAILABLE");
  });

  it("rejects an invalid generated audit event identifier before deletion", async () => {
    const { records, auditEvents, store } = deletionReadyStore(baseRecord);
    const service = new ContentCorrectionService({
      store,
      deletionAuthorizer: () => true,
      auditEventIdFactory: () => " ",
    });

    await expect(service.deleteCorrection(
      "correction-delete-001",
      { actorRef: "editorial-session-42" },
    )).rejects.toThrow("INVALID_CORRECTION_AUDIT_EVENT");

    expect(records.has("correction-delete-001")).toBe(true);
    expect(auditEvents).toHaveLength(0);
  });
});
