import {
  CONTENT_CORRECTION_CATEGORIES,
  CONTENT_CORRECTION_STATUSES,
  type ContentCorrectionDeletionAuditEvent,
  type ContentCorrectionQueueStore,
  type ContentCorrectionRecord,
  type ContentCorrectionStatus,
} from "./contract";

export interface SqlQueryResult<Row = unknown> {
  rows: Row[];
  rowCount: number;
}

export interface SqlExecutor {
  query<Row = unknown>(text: string, values?: readonly unknown[]): Promise<SqlQueryResult<Row>>;
}

export interface TransactionalSqlExecutor extends SqlExecutor {
  transaction<T>(work: (tx: SqlExecutor) => Promise<T>): Promise<T>;
}

type CorrectionRow = {
  id: string;
  category: string;
  concern: string;
  page_url: string | null;
  record_id: string | null;
  ask_divya_request_id: string | null;
  questioned_text: string | null;
  evidence: string | null;
  status: string;
  submitted_at: string | Date;
};

function toIso(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error("INVALID_CORRECTION_STORE_ROW");
  return date.toISOString();
}

function mapRow(row: CorrectionRow): ContentCorrectionRecord {
  if (!CONTENT_CORRECTION_CATEGORIES.includes(row.category as ContentCorrectionRecord["category"])) {
    throw new Error("INVALID_CORRECTION_STORE_ROW");
  }
  if (!CONTENT_CORRECTION_STATUSES.includes(row.status as ContentCorrectionStatus)) {
    throw new Error("INVALID_CORRECTION_STORE_ROW");
  }

  return {
    id: row.id,
    category: row.category as ContentCorrectionRecord["category"],
    concern: row.concern,
    status: row.status as ContentCorrectionStatus,
    submittedAt: toIso(row.submitted_at),
    ...(row.page_url ? { pageUrl: row.page_url } : {}),
    ...(row.record_id ? { recordId: row.record_id } : {}),
    ...(row.ask_divya_request_id ? { askDivyaRequestId: row.ask_divya_request_id } : {}),
    ...(row.questioned_text ? { questionedText: row.questioned_text } : {}),
    ...(row.evidence ? { evidence: row.evidence } : {}),
  };
}

const RECORD_COLUMNS = `
  id, category, concern, page_url, record_id, ask_divya_request_id,
  questioned_text, evidence, status, submitted_at
`;

export class PostgresContentCorrectionQueueStore implements ContentCorrectionQueueStore {
  constructor(private readonly sql: TransactionalSqlExecutor) {}

  async enqueue(record: ContentCorrectionRecord): Promise<void> {
    await this.sql.query(
      `INSERT INTO content_corrections (
        id, category, concern, page_url, record_id, ask_divya_request_id,
        questioned_text, evidence, status, submitted_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        record.id,
        record.category,
        record.concern,
        record.pageUrl ?? null,
        record.recordId ?? null,
        record.askDivyaRequestId ?? null,
        record.questionedText ?? null,
        record.evidence ?? null,
        record.status,
        record.submittedAt,
      ],
    );
  }

  async getById(id: string): Promise<ContentCorrectionRecord | null> {
    const result = await this.sql.query<CorrectionRow>(
      `SELECT ${RECORD_COLUMNS} FROM content_corrections WHERE id = $1`,
      [id],
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  async purgeBefore(cutoffIso: string): Promise<number> {
    const result = await this.sql.query(
      `DELETE FROM content_corrections WHERE submitted_at < $1`,
      [cutoffIso],
    );
    return result.rowCount;
  }

  async transitionStatus(
    id: string,
    expectedStatus: ContentCorrectionStatus,
    nextStatus: ContentCorrectionStatus,
  ): Promise<ContentCorrectionRecord | null> {
    const result = await this.sql.query<CorrectionRow>(
      `UPDATE content_corrections
       SET status = $3
       WHERE id = $1 AND status = $2
       RETURNING ${RECORD_COLUMNS}`,
      [id, expectedStatus, nextStatus],
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  async deleteWithAudit(
    id: string,
    expectedStatus: ContentCorrectionStatus,
    event: ContentCorrectionDeletionAuditEvent,
  ): Promise<boolean> {
    return await this.sql.transaction(async (tx) => {
      const deleted = await tx.query<{ id: string }>(
        `DELETE FROM content_corrections
         WHERE id = $1 AND status = $2
         RETURNING id`,
        [id, expectedStatus],
      );
      if (deleted.rowCount !== 1) return false;

      await tx.query(
        `INSERT INTO content_correction_deletion_audit (
          id, correction_id, action, occurred_at, previous_status, actor_ref
        ) VALUES ($1,$2,$3,$4,$5,$6)`,
        [
          event.id,
          event.correctionId,
          event.action,
          event.occurredAt,
          event.previousStatus,
          event.actorRef,
        ],
      );
      return true;
    });
  }
}
