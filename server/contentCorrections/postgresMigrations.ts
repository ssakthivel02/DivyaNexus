import { createHash } from "crypto";
import type { SqlExecutor, TransactionalSqlExecutor } from "./postgresStore";

const MIGRATION_ID_PATTERN = /^\d{3}_[a-z0-9_]+$/;
const MIGRATION_TABLE = "content_correction_schema_migrations";
const ADVISORY_LOCK_KEYS = [1146504537, 1129270851] as const;

export interface ContentCorrectionMigration {
  id: string;
  sql: string;
}

export interface ContentCorrectionMigrationRunResult {
  applied: string[];
  skipped: string[];
}

function normalizeMigration(migration: ContentCorrectionMigration): ContentCorrectionMigration {
  const id = migration.id.trim();
  const sql = migration.sql.trim();
  if (!MIGRATION_ID_PATTERN.test(id) || id.length > 100) throw new Error("INVALID_CORRECTION_MIGRATION_ID");
  if (!sql) throw new Error("INVALID_CORRECTION_MIGRATION_SQL");
  return { id, sql };
}

function checksum(sql: string): string {
  return createHash("sha256").update(sql, "utf8").digest("hex");
}

function validateMigrationSet(migrations: readonly ContentCorrectionMigration[]): ContentCorrectionMigration[] {
  if (migrations.length === 0) throw new Error("CORRECTION_MIGRATIONS_REQUIRED");
  const normalized = migrations.map(normalizeMigration);
  const ids = normalized.map((migration) => migration.id);
  if (new Set(ids).size !== ids.length) throw new Error("DUPLICATE_CORRECTION_MIGRATION_ID");
  const sorted = [...ids].sort((a, b) => a.localeCompare(b));
  if (ids.some((id, index) => id !== sorted[index])) throw new Error("CORRECTION_MIGRATIONS_OUT_OF_ORDER");
  return normalized;
}

async function ensureMigrationTable(tx: SqlExecutor): Promise<void> {
  await tx.query(`CREATE TABLE IF NOT EXISTS ${MIGRATION_TABLE} (
    id varchar(100) PRIMARY KEY,
    checksum char(64) NOT NULL,
    applied_at timestamptz NOT NULL DEFAULT now()
  )`);
}

export async function runContentCorrectionMigrations(
  executor: TransactionalSqlExecutor,
  migrations: readonly ContentCorrectionMigration[],
): Promise<ContentCorrectionMigrationRunResult> {
  const normalized = validateMigrationSet(migrations);

  return await executor.transaction(async (tx) => {
    await tx.query("SELECT pg_advisory_xact_lock($1, $2)", ADVISORY_LOCK_KEYS);
    await ensureMigrationTable(tx);

    const existing = await tx.query<{ id: string; checksum: string }>(
      `SELECT id, checksum FROM ${MIGRATION_TABLE} ORDER BY id`,
    );
    const known = new Map(normalized.map((migration) => [migration.id, migration]));
    for (const row of existing.rows) {
      if (!known.has(row.id)) throw new Error("UNKNOWN_APPLIED_CORRECTION_MIGRATION");
    }

    const existingById = new Map(existing.rows.map((row) => [row.id, row.checksum]));
    const applied: string[] = [];
    const skipped: string[] = [];

    for (const migration of normalized) {
      const expectedChecksum = checksum(migration.sql);
      const recordedChecksum = existingById.get(migration.id);
      if (recordedChecksum !== undefined) {
        if (recordedChecksum !== expectedChecksum) throw new Error("CORRECTION_MIGRATION_CHECKSUM_MISMATCH");
        skipped.push(migration.id);
        continue;
      }

      await tx.query(migration.sql);
      await tx.query(
        `INSERT INTO ${MIGRATION_TABLE} (id, checksum) VALUES ($1, $2)`,
        [migration.id, expectedChecksum],
      );
      applied.push(migration.id);
    }

    return { applied, skipped };
  });
}
