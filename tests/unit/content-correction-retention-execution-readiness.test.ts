import { describe, expect, it, vi } from "vitest";
import type {
  ContentCorrectionQueueStore,
  ContentCorrectionRecord,
  ContentCorrectionStatus,
} from "../../server/contentCorrections/contract";
import {
  calculateContentCorrectionRetentionCutoff,
  ContentCorrectionRetentionExecutionCoordinator,
} from "../../server/contentCorrections/retentionExecution";

function createStore(purgeResult = 0): ContentCorrectionQueueStore {
  return {
    enqueue: vi.fn(async (_record: ContentCorrectionRecord) => {}),
    getById: vi.fn(async (_id: string) => null),
    purgeBefore: vi.fn(async (_cutoffIso: string) => purgeResult),
    transitionStatus: vi.fn(
      async (_id: string, _expected: ContentCorrectionStatus, _next: ContentCorrectionStatus) => null,
    ),
  };
}

describe("content correction retention execution readiness", () => {
  it("calculates a deterministic UTC cutoff", () => {
    expect(
      calculateContentCorrectionRetentionCutoff(
        new Date("2026-09-30T12:00:00.000Z"),
        { retentionMs: 86_400_000 },
      ),
    ).toBe("2026-09-29T12:00:00.000Z");
  });

  it("rejects an invalid current time", () => {
    expect(() =>
      calculateContentCorrectionRetentionCutoff(new Date("invalid"), { retentionMs: 1_000 }),
    ).toThrow("INVALID_CORRECTION_RETENTION_NOW");
  });

  it("previews without touching the store", () => {
    const store = createStore();
    const coordinator = new ContentCorrectionRetentionExecutionCoordinator({
      store,
      retentionPolicy: { retentionMs: 60_000 },
      now: () => new Date("2026-09-30T12:00:00.000Z"),
    });

    expect(coordinator.previewCutoff()).toBe("2026-09-30T11:59:00.000Z");
    expect(store.purgeBefore).not.toHaveBeenCalled();
  });

  it("fails closed when execution is not explicitly approved", async () => {
    const store = createStore();
    const coordinator = new ContentCorrectionRetentionExecutionCoordinator({
      store,
      retentionPolicy: { retentionMs: 60_000 },
      now: () => new Date("2026-09-30T12:00:00.000Z"),
    });

    await expect(coordinator.execute()).rejects.toThrow(
      "CORRECTION_RETENTION_EXECUTION_NOT_APPROVED",
    );
    expect(store.purgeBefore).not.toHaveBeenCalled();
  });

  it("purges only records before the calculated cutoff after explicit approval", async () => {
    const store = createStore(3);
    const coordinator = new ContentCorrectionRetentionExecutionCoordinator({
      store,
      retentionPolicy: { retentionMs: 86_400_000 },
      now: () => new Date("2026-09-30T12:00:00.000Z"),
    });

    await expect(coordinator.execute({ approved: true })).resolves.toEqual({
      cutoffIso: "2026-09-29T12:00:00.000Z",
      purged: 3,
    });
    expect(store.purgeBefore).toHaveBeenCalledTimes(1);
    expect(store.purgeBefore).toHaveBeenCalledWith("2026-09-29T12:00:00.000Z");
  });

  it("fails closed on an invalid purge count", async () => {
    const store = createStore(-1);
    const coordinator = new ContentCorrectionRetentionExecutionCoordinator({
      store,
      retentionPolicy: { retentionMs: 60_000 },
      now: () => new Date("2026-09-30T12:00:00.000Z"),
    });

    await expect(coordinator.execute({ approved: true })).rejects.toThrow(
      "INVALID_CORRECTION_RETENTION_PURGE_RESULT",
    );
  });
});
