import { describe, expect, it, vi } from "vitest";
import {
  PostgresContentCorrectionQueueStore,
  type SqlExecutor,
  type SqlQueryResult,
  type TransactionalSqlExecutor,
} from "../../server/contentCorrections/postgresStore";
import type { ContentCorrectionRecord } from "../../server/contentCorrections/contract";

function result<Row>(rows: Row[] = [], rowCount = rows.length): SqlQueryResult<Row> {
  return { rows, rowCount };
}

describe("PostgresContentCorrectionQueueStore", () => {
  it("uses parameterized SQL for enqueue and lookup", async () => {
    const query = vi.fn(async () => result());
    const sql: TransactionalSqlExecutor = {
      query,
      transaction: async (work) => await work({ query }),
    };
    const store = new PostgresContentCorrectionQueueStore(sql);
    const record: ContentCorrectionRecord = {
      id: "correction-1",
      category: "unsupported-claim",
      concern: "Needs source review",
      pageUrl: "/sources",
      status: "submitted",
      submittedAt: "2026-09-30T12:00:00.000Z",
    };

    await store.enqueue(record);

    expect(query).toHaveBeenCalledWith(
      expect.stringContaining("VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)"),
      [
        "correction-1",
        "unsupported-claim",
        "Needs source review",
        "/sources",
        null,
        null,
        null,
        null,
        "submitted",
        "2026-09-30T12:00:00.000Z",
      ],
    );
    expect(String(query.mock.calls[0][0])).not.toContain("Needs source review");
  });

  it("maps database rows back to the correction contract", async () => {
    const query = vi.fn(async () => result([{
      id: "correction-2",
      category: "citation-mismatch",
      concern: "Wrong citation",
      page_url: null,
      record_id: "record-2",
      ask_divya_request_id: null,
      questioned_text: null,
      evidence: null,
      status: "triage",
      submitted_at: new Date("2026-09-30T12:00:00.000Z"),
    }]));
    const sql: TransactionalSqlExecutor = {
      query,
      transaction: async (work) => await work({ query }),
    };

    await expect(new PostgresContentCorrectionQueueStore(sql).getById("correction-2")).resolves.toEqual({
      id: "correction-2",
      category: "citation-mismatch",
      concern: "Wrong citation",
      recordId: "record-2",
      status: "triage",
      submittedAt: "2026-09-30T12:00:00.000Z",
    });
  });

  it("uses optimistic status matching for transitions", async () => {
    const query = vi.fn(async () => result([], 0));
    const sql: TransactionalSqlExecutor = {
      query,
      transaction: async (work) => await work({ query }),
    };
    const store = new PostgresContentCorrectionQueueStore(sql);

    await expect(store.transitionStatus("correction-3", "triage", "source-review")).resolves.toBeNull();
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining("WHERE id = $1 AND status = $2"),
      ["correction-3", "triage", "source-review"],
    );
  });

  it("commits delete and metadata-only audit through one transaction boundary", async () => {
    const txQuery = vi.fn(async (text: string) => {
      if (text.includes("DELETE FROM content_corrections")) return result([{ id: "correction-4" }], 1);
      return result([], 1);
    });
    const transaction = vi.fn(async (work: (tx: SqlExecutor) => Promise<boolean>) => await work({ query: txQuery }));
    const sql: TransactionalSqlExecutor = {
      query: vi.fn(async () => result()),
      transaction,
    };
    const store = new PostgresContentCorrectionQueueStore(sql);

    await expect(store.deleteWithAudit("correction-4", "resolved", {
      id: "audit-4",
      correctionId: "correction-4",
      action: "deleted",
      occurredAt: "2026-09-30T12:01:00.000Z",
      previousStatus: "resolved",
      actorRef: "editorial-session-4",
    })).resolves.toBe(true);

    expect(transaction).toHaveBeenCalledTimes(1);
    expect(txQuery).toHaveBeenCalledTimes(2);
    expect(txQuery.mock.calls[1][0]).toContain("content_correction_deletion_audit");
    expect(txQuery.mock.calls[1][1]).toEqual([
      "audit-4",
      "correction-4",
      "deleted",
      "2026-09-30T12:01:00.000Z",
      "resolved",
      "editorial-session-4",
    ]);
  });

  it("does not create an audit row when optimistic deletion loses the race", async () => {
    const txQuery = vi.fn(async () => result([], 0));
    const sql: TransactionalSqlExecutor = {
      query: vi.fn(async () => result()),
      transaction: async (work) => await work({ query: txQuery }),
    };
    const store = new PostgresContentCorrectionQueueStore(sql);

    await expect(store.deleteWithAudit("correction-5", "triage", {
      id: "audit-5",
      correctionId: "correction-5",
      action: "deleted",
      occurredAt: "2026-09-30T12:02:00.000Z",
      previousStatus: "triage",
      actorRef: "editorial-session-5",
    })).resolves.toBe(false);
    expect(txQuery).toHaveBeenCalledTimes(1);
  });
});
