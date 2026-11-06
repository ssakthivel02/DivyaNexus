import { createHash } from "crypto";
import { describe, expect, it } from "vitest";
import { runContentCorrectionMigrations } from "../../server/contentCorrections/postgresMigrations";
import type { SqlExecutor, SqlQueryResult, TransactionalSqlExecutor } from "../../server/contentCorrections/postgresStore";

class FakeExecutor implements TransactionalSqlExecutor {
  queries: Array<{ text: string; values?: readonly unknown[] }> = [];
  existing: Array<{ id: string; checksum: string }> = [];
  transactions = 0;

  async query<Row = unknown>(text: string, values?: readonly unknown[]): Promise<SqlQueryResult<Row>> {
    this.queries.push({ text, values });
    if (text.includes("SELECT id, checksum")) {
      return { rows: this.existing as Row[], rowCount: this.existing.length };
    }
    return { rows: [], rowCount: 0 };
  }

  async transaction<T>(work: (tx: SqlExecutor) => Promise<T>): Promise<T> {
    this.transactions += 1;
    return await work(this);
  }
}

const migrations = [
  { id: "001_content_corrections", sql: "CREATE TABLE content_corrections(id text);" },
  { id: "002_more_indexes", sql: "CREATE INDEX content_corrections_id_idx ON content_corrections(id);" },
] as const;

function hash(sql: string): string {
  return createHash("sha256").update(sql.trim(), "utf8").digest("hex");
}

describe("runContentCorrectionMigrations", () => {
  it("applies pending migrations in one transaction and records checksums", async () => {
    const executor = new FakeExecutor();
    const result = await runContentCorrectionMigrations(executor, migrations);

    expect(result).toEqual({
      applied: ["001_content_corrections", "002_more_indexes"],
      skipped: [],
    });
    expect(executor.transactions).toBe(1);
    expect(executor.queries[0]).toEqual({
      text: "SELECT pg_advisory_xact_lock($1, $2)",
      values: [1146504537, 1129270851],
    });
    expect(executor.queries.some((query) => query.text === migrations[0].sql)).toBe(true);
    expect(executor.queries.some((query) => query.text === migrations[1].sql)).toBe(true);
    const inserts = executor.queries.filter((query) => query.text.includes("INSERT INTO content_correction_schema_migrations"));
    expect(inserts).toHaveLength(2);
    expect(inserts[0].values).toEqual([migrations[0].id, hash(migrations[0].sql)]);
  });

  it("skips an already-applied migration when its checksum matches", async () => {
    const executor = new FakeExecutor();
    executor.existing = [{ id: migrations[0].id, checksum: hash(migrations[0].sql) }];

    const result = await runContentCorrectionMigrations(executor, migrations);
    expect(result).toEqual({
      applied: ["002_more_indexes"],
      skipped: ["001_content_corrections"],
    });
    expect(executor.queries.filter((query) => query.text === migrations[0].sql)).toHaveLength(0);
  });

  it("fails closed when an applied migration checksum drifts", async () => {
    const executor = new FakeExecutor();
    executor.existing = [{ id: migrations[0].id, checksum: "0".repeat(64) }];

    await expect(runContentCorrectionMigrations(executor, migrations)).rejects.toThrow(
      "CORRECTION_MIGRATION_CHECKSUM_MISMATCH",
    );
  });

  it("fails closed when the database contains an unknown applied migration", async () => {
    const executor = new FakeExecutor();
    executor.existing = [{ id: "999_unknown", checksum: "0".repeat(64) }];

    await expect(runContentCorrectionMigrations(executor, migrations)).rejects.toThrow(
      "UNKNOWN_APPLIED_CORRECTION_MIGRATION",
    );
  });

  it("rejects duplicate or out-of-order migration sets before transaction work", async () => {
    const duplicate = new FakeExecutor();
    await expect(
      runContentCorrectionMigrations(duplicate, [migrations[0], migrations[0]]),
    ).rejects.toThrow("DUPLICATE_CORRECTION_MIGRATION_ID");
    expect(duplicate.transactions).toBe(0);

    const unordered = new FakeExecutor();
    await expect(
      runContentCorrectionMigrations(unordered, [migrations[1], migrations[0]]),
    ).rejects.toThrow("CORRECTION_MIGRATIONS_OUT_OF_ORDER");
    expect(unordered.transactions).toBe(0);
  });

  it("rejects empty and malformed migrations before touching storage", async () => {
    const empty = new FakeExecutor();
    await expect(runContentCorrectionMigrations(empty, [])).rejects.toThrow("CORRECTION_MIGRATIONS_REQUIRED");
    expect(empty.transactions).toBe(0);

    const malformed = new FakeExecutor();
    await expect(
      runContentCorrectionMigrations(malformed, [{ id: "bad id", sql: "SELECT 1" }]),
    ).rejects.toThrow("INVALID_CORRECTION_MIGRATION_ID");
    expect(malformed.transactions).toBe(0);
  });
});
