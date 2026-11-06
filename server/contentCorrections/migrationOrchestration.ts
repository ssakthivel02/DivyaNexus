import type { TransactionalSqlExecutor } from "./postgresStore";
import {
  loadContentCorrectionMigrationManifest,
  type MigrationFileReader,
} from "./migrationManifest";
import {
  runContentCorrectionMigrations,
  type ContentCorrectionMigration,
  type ContentCorrectionMigrationRunResult,
} from "./postgresMigrations";

export interface ContentCorrectionMigrationPreparation {
  migrationsDirectory: string;
  readTextFile: MigrationFileReader;
}

export interface ContentCorrectionMigrationExecutionApproval {
  approved?: boolean;
}

export interface PreparedContentCorrectionMigrationExecution {
  readonly ids: readonly string[];
  execute(
    executor: TransactionalSqlExecutor,
    approval: ContentCorrectionMigrationExecutionApproval,
  ): Promise<ContentCorrectionMigrationRunResult>;
}

function freezeMigrations(
  migrations: readonly ContentCorrectionMigration[],
): readonly Readonly<ContentCorrectionMigration>[] {
  return Object.freeze(
    migrations.map((migration) =>
      Object.freeze({ id: migration.id, sql: migration.sql }),
    ),
  );
}

export async function prepareContentCorrectionMigrationExecution(
  preparation: ContentCorrectionMigrationPreparation,
): Promise<PreparedContentCorrectionMigrationExecution> {
  const loaded = await loadContentCorrectionMigrationManifest(
    preparation.migrationsDirectory,
    preparation.readTextFile,
  );
  const migrations = freezeMigrations(loaded);
  const ids = Object.freeze(migrations.map((migration) => migration.id));

  return Object.freeze({
    ids,
    async execute(
      executor: TransactionalSqlExecutor,
      approval: ContentCorrectionMigrationExecutionApproval,
    ): Promise<ContentCorrectionMigrationRunResult> {
      if (approval?.approved !== true) {
        throw new Error("CORRECTION_MIGRATION_EXECUTION_APPROVAL_REQUIRED");
      }
      return await runContentCorrectionMigrations(executor, migrations);
    },
  });
}
