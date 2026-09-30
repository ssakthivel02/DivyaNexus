import { describe, expect, it, vi } from "vitest";
import { prepareContentCorrectionMigrationExecution } from "../../server/contentCorrections/migrationOrchestration";
import type {
  SqlQueryResult,
  TransactionalSqlExecutor,
} from "../../server/contentCorrections/postgresStore";

function createExecutor(trace: Array<{ text: string; values?: readonly unknown[] }>): TransactionalSqlExecutor {
  return {
    async query(): Promise<SqlQueryResult> {
      throw new Error("OUTSIDE_TRANSACTION_QUERY_NOT_EXPECTED");
    },
    async transaction<T>(work: (tx: { query<Row = unknown>(text: string, values?: readonly unknown[]): Promise<SqlQueryResult<Row>> }) => Promise<T>): Promise<T> {
      return await work({
        async query<Row = unknown>(text: string, values?: readonly unknown[]): Promise<SqlQueryResult<Row>> {
          trace.push({ text, values });
          if (text.includes("SELECT id, checksum")) {
            return { rows: [] as Row[], rowCount: 0 };
          }
          return { rows: [] as Row[], rowCount: 0 };
        },
      });
    },
  };
}

describe("content correction migration orchestration readiness", () => {
  it("prepares the reviewed manifest without touching a database", async () => {
    const readTextFile = vi.fn(async (path: string) => {
      expect(path.endsWith("001_content_corrections.sql")).toBe(true);
      return "CREATE TABLE example(id integer);";
    });

    const prepared = await prepareContentCorrectionMigrationExecution({
      migrationsDirectory: "/reviewed/migrations",
      readTextFile,
    });

    expect(prepared.ids).toEqual(["001_content_corrections"]);
    expect(Object.isFrozen(prepared.ids)).toBe(true);
    expect(readTextFile).toHaveBeenCalledTimes(1);
  });

  it("fails closed when execution approval is absent", async () => {
    const prepared = await prepareContentCorrectionMigrationExecution({
      migrationsDirectory: "/reviewed/migrations",
      readTextFile: async () => "CREATE TABLE example(id integer);",
    });
    const transaction = vi.fn();
    const executor = {
      query: vi.fn(),
      transaction,
    } as unknown as TransactionalSqlExecutor;

    await expect(prepared.execute(executor, {})).rejects.toThrow(
      "CORRECTION_MIGRATION_EXECUTION_APPROVAL_REQUIRED",
    );
    expect(transaction).not.toHaveBeenCalled();
  });

  it("composes reviewed loading with the checksum-locked migration runner only after approval", async () => {
    const trace: Array<{ text: string; values?: readonly unknown[] }> = [];
    const prepared = await prepareContentCorrectionMigrationExecution({
      migrationsDirectory: "/reviewed/migrations",
      readTextFile: async () => "CREATE TABLE example(id integer);",
    });

    const result = await prepared.execute(createExecutor(trace), { approved: true });

    expect(result).toEqual({ applied: ["001_content_corrections"], skipped: [] });
    expect(trace.some((entry) => entry.text.includes("pg_advisory_xact_lock"))).toBe(true);
    expect(trace.some((entry) => entry.text === "CREATE TABLE example(id integer);")).toBe(true);
    const insert = trace.find((entry) => entry.text.includes("INSERT INTO content_correction_schema_migrations"));
    expect(insert?.values?.[0]).toBe("001_content_corrections");
    expect(insert?.values?.[1]).toMatch(/^[a-f0-9]{64}$/);
  });

  it("propagates manifest loading failures before an executor can be used", async () => {
    await expect(
      prepareContentCorrectionMigrationExecution({
        migrationsDirectory: "/reviewed/migrations",
        readTextFile: async () => {
          throw new Error("READ_FAILED");
        },
      }),
    ).rejects.toThrow("READ_FAILED");
  });
});
