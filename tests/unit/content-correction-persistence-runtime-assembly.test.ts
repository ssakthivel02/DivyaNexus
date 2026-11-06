import { describe, expect, it } from "vitest";
import { assembleContentCorrectionPersistenceRuntime } from "../../server/contentCorrections/persistenceRuntimeAssembly";
import type {
  PostgresPoolClientLike,
  PostgresPoolLike,
} from "../../server/contentCorrections/postgresClient";

const CERT = "-----BEGIN CERTIFICATE-----\nMIIB\n-----END CERTIFICATE-----";
const CA = Buffer.from(CERT, "utf8").toString("base64");

function enabledEnv() {
  return {
    CONTENT_CORRECTION_PERSISTENCE_ENABLED: "true",
    CONTENT_CORRECTION_RETENTION_MS: "86400000",
    DATABASE_URL: "postgresql://user:pass@example.test:5432/divyanexus?sslmode=require",
    PROJECT_CA_CERT: CA,
  };
}

describe("content correction persistence runtime assembly", () => {
  it("keeps disabled mode driver-free", () => {
    expect(assembleContentCorrectionPersistenceRuntime({})).toEqual({ enabled: false });
  });

  it("fails closed when enabled without a pool constructor", () => {
    expect(() => assembleContentCorrectionPersistenceRuntime(enabledEnv())).toThrow(
      "POSTGRES_POOL_CONSTRUCTOR_REQUIRED",
    );
  });

  it("assembles validated config, store, executor and close without issuing a query", async () => {
    const constructorConfigs: unknown[] = [];
    const queries: string[] = [];
    let ended = false;

    class FakePool implements PostgresPoolLike {
      constructor(config: { connectionString: string; ssl: { ca: string } }) {
        constructorConfigs.push(config);
      }

      async query<Row = unknown>(text: string): Promise<{ rows: Row[]; rowCount: number | null }> {
        queries.push(text);
        return { rows: [], rowCount: 0 };
      }

      async connect(): Promise<PostgresPoolClientLike> {
        throw new Error("connect should not be called during assembly");
      }

      async end(): Promise<void> {
        ended = true;
      }
    }

    const runtime = assembleContentCorrectionPersistenceRuntime(enabledEnv(), FakePool);
    expect(runtime.enabled).toBe(true);
    if (!runtime.enabled) throw new Error("expected enabled runtime");

    expect(constructorConfigs).toHaveLength(1);
    expect(constructorConfigs[0]).toMatchObject({
      connectionString: "postgresql://user:pass@example.test:5432/divyanexus",
      ssl: { ca: CERT },
    });
    expect(runtime.retentionPolicy).toEqual({ retentionMs: 86400000 });
    expect(runtime.store).toBeDefined();
    expect(runtime.executor).toBeDefined();
    expect(queries).toEqual([]);

    await runtime.close();
    expect(ended).toBe(true);
  });
});
