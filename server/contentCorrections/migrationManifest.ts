import { basename, dirname, resolve } from "path";
import type { ContentCorrectionMigration } from "./postgresMigrations";

export const CONTENT_CORRECTION_MIGRATION_FILES = ["001_content_corrections.sql"] as const;

export type MigrationFileReader = (absolutePath: string) => Promise<string>;

function migrationIdFromFile(fileName: string): string {
  if (!/^\d{3}_[a-z0-9_]+\.sql$/.test(fileName)) {
    throw new Error("INVALID_CORRECTION_MIGRATION_FILE");
  }
  return fileName.slice(0, -4);
}

export async function loadContentCorrectionMigrationManifest(
  migrationsDirectory: string,
  readTextFile: MigrationFileReader,
): Promise<ContentCorrectionMigration[]> {
  const root = resolve(migrationsDirectory);
  const migrations: ContentCorrectionMigration[] = [];

  for (const fileName of CONTENT_CORRECTION_MIGRATION_FILES) {
    if (basename(fileName) !== fileName) throw new Error("INVALID_CORRECTION_MIGRATION_FILE");

    const absolutePath = resolve(root, fileName);
    if (dirname(absolutePath) !== root) throw new Error("CORRECTION_MIGRATION_PATH_ESCAPE");

    const sql = (await readTextFile(absolutePath)).trim();
    if (!sql) throw new Error("INVALID_CORRECTION_MIGRATION_SQL");

    migrations.push({ id: migrationIdFromFile(fileName), sql });
  }

  return migrations;
}
