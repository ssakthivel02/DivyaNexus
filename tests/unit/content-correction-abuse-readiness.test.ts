import { describe, expect, it, vi } from "vitest";
import {
  ContentCorrectionService,
  type ContentCorrectionQueueStore,
} from "../../server/contentCorrections/contract";

function storeWithEnqueue(enqueue = vi.fn()) : ContentCorrectionQueueStore {
  return {
    enqueue,
    getById: () => null,
    purgeBefore: () => 0,
    transitionStatus: () => null,
  };
}

const validInput = {
  category: "ask-divya-response" as const,
  concern: " The visible answer appears inconsistent with its citation. ",
  pageUrl: " /ask-divya ",
  askDivyaRequestId: " ask-123 ",
};

describe("content correction abuse-control readiness", () => {
  it("fails closed when guarded submission has no admission policy", async () => {
    const enqueue = vi.fn();
    const service = new ContentCorrectionService({ store: storeWithEnqueue(enqueue) });

    await expect(service.submitGuarded(validInput)).rejects.toThrow("CORRECTION_ABUSE_CONTROL_REQUIRED");
    expect(enqueue).not.toHaveBeenCalled();
  });

  it("does not enqueue when the injected admission policy denies the normalized report", async () => {
    const enqueue = vi.fn();
    const submissionAdmissionPolicy = vi.fn(() => false);
    const service = new ContentCorrectionService({
      store: storeWithEnqueue(enqueue),
      submissionAdmissionPolicy,
    });

    await expect(service.submitGuarded(validInput)).rejects.toThrow("CORRECTION_SUBMISSION_REJECTED");
    expect(submissionAdmissionPolicy).toHaveBeenCalledWith({
      input: {
        category: "ask-divya-response",
        concern: "The visible answer appears inconsistent with its citation.",
        pageUrl: "/ask-divya",
        askDivyaRequestId: "ask-123",
      },
    });
    expect(enqueue).not.toHaveBeenCalled();
  });

  it("enqueues only after strict admission and exposes no caller identity fields to the policy", async () => {
    const enqueue = vi.fn();
    const submissionAdmissionPolicy = vi.fn(({ input }) => {
      expect(Object.isFrozen(input)).toBe(true);
      expect(input).not.toHaveProperty("ipAddress");
      expect(input).not.toHaveProperty("email");
      expect(input).not.toHaveProperty("accountId");
      expect(input).not.toHaveProperty("deviceId");
      return true;
    });
    const service = new ContentCorrectionService({
      store: storeWithEnqueue(enqueue),
      submissionAdmissionPolicy,
      idFactory: () => "correction-guarded-001",
      now: () => new Date("2026-09-30T10:30:00.000Z"),
    });

    await expect(service.submitGuarded(validInput)).resolves.toEqual({
      id: "correction-guarded-001",
      status: "submitted",
      submittedAt: "2026-09-30T10:30:00.000Z",
      category: "ask-divya-response",
      concern: "The visible answer appears inconsistent with its citation.",
      pageUrl: "/ask-divya",
      askDivyaRequestId: "ask-123",
    });
    expect(submissionAdmissionPolicy).toHaveBeenCalledTimes(1);
    expect(enqueue).toHaveBeenCalledTimes(1);
  });

  it("fails closed when the admission policy itself fails", async () => {
    const enqueue = vi.fn();
    const service = new ContentCorrectionService({
      store: storeWithEnqueue(enqueue),
      submissionAdmissionPolicy: () => { throw new Error("ADMISSION_BACKEND_UNAVAILABLE"); },
    });

    await expect(service.submitGuarded(validInput)).rejects.toThrow("ADMISSION_BACKEND_UNAVAILABLE");
    expect(enqueue).not.toHaveBeenCalled();
  });
});
