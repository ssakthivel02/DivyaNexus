import { describe, expect, it, vi } from "vitest";
import { resolve } from "path";
import {
  CONTENT_CORRECTION_MIGRATION_FILES,
  loadContentCorrectionMigrationManifest,
} from "../../server/contentCorrections/migrationManifest";

describe("content correction migration manifest readiness", () => {
  it("loads the fixed checked-in manifest in deterministic order", async () => {
    const root = "/app/server/contentCorrections/migrations";
    const readTextFile = vi.fn(async (absolutePath: string) => {
      expect(absolutePath).toBe(resolve(root, "001_content_corrections.sql"));
      return "  CREATE TABLE example (id text);  ";
    });

    await expect(loadContentCorrectionMigrationManifest(root, readTextFile)).resolves.toEqual([
      { id: "001_content_corrections", sql: "CREATE TABLE example (id text);" },
    ]);
    expect(readTextFile).toHaveBeenCalledTimes(CONTENT_CORRECTION_MIGRATION_FILES.length);
  });

  it("rejects an empty checked-in migration", async () => {
    await expect(
      loadContentCorrectionMigrationManifest("/app/migrations", async () => "   "),
    ).rejects.toThrow("INVALID_CORRECTION_MIGRATION_SQL");
  });

  it("propagates file read failures without substituting fallback SQL", async () => {
    await expect(
      loadContentCorrectionMigrationManifest("/app/migrations", async () => {
        throw new Error("ENOENT");
      }),
    ).rejects.toThrow("ENOENT");
  });

  it("does not discover or execute unlisted migration files", async () => {
    const seen: string[] = [];
    await loadContentCorrectionMigrationManifest("/app/migrations", async (absolutePath) => {
      seen.push(absolutePath);
      return "SELECT 1;";
    });

    expect(seen).toEqual([resolve("/app/migrations", "001_content_corrections.sql")]);
    expect(seen.some((path) => path.includes("002_unreviewed.sql"))).toBe(false);
  });
});
