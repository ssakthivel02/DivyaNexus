import { describe, expect, it, vi } from "vitest";
import {
  buildPostgresTlsConfig,
  createPostgresTransactionalExecutor,
  type PostgresPoolClientLike,
  type PostgresPoolLike,
} from "../../server/contentCorrections/postgresClient";

const CERT = `-----BEGIN CERTIFICATE-----\nTEST\n-----END CERTIFICATE-----`;
const CERT_B64 = Buffer.from(CERT).toString("base64");

describe("postgres TLS readiness", () => {
  it("requires URL and CA and strips sslmode", () => {
    const config = buildPostgresTlsConfig({
      DATABASE_URL: "postgres://user:pass@example.test:5432/db?sslmode=require&application_name=divyanexus",
      PROJECT_CA_CERT: CERT_B64,
    });

    expect(config.connectionString).not.toContain("sslmode=");
    expect(config.connectionString).toContain("application_name=divyanexus");
    expect(config.ssl.ca).toBe(CERT);
  });

  it("fails closed for missing or malformed TLS inputs", () => {
    expect(() => buildPostgresTlsConfig({ PROJECT_CA_CERT: CERT_B64 })).toThrow("POSTGRES_DATABASE_URL_REQUIRED");
    expect(() => buildPostgresTlsConfig({ DATABASE_URL: "postgres://x/y" })).toThrow("POSTGRES_CA_CERT_REQUIRED");
    expect(() =>
      buildPostgresTlsConfig({ DATABASE_URL: "https://example.test/db", PROJECT_CA_CERT: CERT_B64 }),
    ).toThrow("INVALID_POSTGRES_DATABASE_URL");
    expect(() =>
      buildPostgresTlsConfig({ DATABASE_URL: "postgres://x/y", PROJECT_CA_CERT: Buffer.from("not a cert").toString("base64") }),
    ).toThrow("INVALID_POSTGRES_CA_CERT");
  });

  it("commits successful transactions and releases the client", async () => {
    const calls: string[] = [];
    const release = vi.fn();
    const client: PostgresPoolClientLike = {
      async query<Row = unknown>(text: string) {
        calls.push(text);
        return { rows: [] as Row[], rowCount: 0 };
      },
      release,
    };

    class Pool implements PostgresPoolLike {
      constructor(public readonly config: unknown) {}
      async query<Row = unknown>() {
        return { rows: [] as Row[], rowCount: 0 };
      }
      async connect() {
        return client;
      }
      async end() {}
    }

    const { executor } = createPostgresTransactionalExecutor(Pool, {
      DATABASE_URL: "postgres://user:pass@example.test/db",
      PROJECT_CA_CERT: CERT_B64,
    });

    const result = await executor.transaction(async (tx) => {
      await tx.query("SELECT 1");
      return "ok";
    });

    expect(result).toBe("ok");
    expect(calls).toEqual(["BEGIN", "SELECT 1", "COMMIT"]);
    expect(release).toHaveBeenCalledTimes(1);
  });

  it("rolls back failed transactions and preserves the original error", async () => {
    const calls: string[] = [];
    const release = vi.fn();
    const client: PostgresPoolClientLike = {
      async query<Row = unknown>(text: string) {
        calls.push(text);
        if (text === "SELECT broken") throw new Error("boom");
        return { rows: [] as Row[], rowCount: 0 };
      },
      release,
    };

    class Pool implements PostgresPoolLike {
      constructor(public readonly config: unknown) {}
      async query<Row = unknown>() {
        return { rows: [] as Row[], rowCount: 0 };
      }
      async connect() {
        return client;
      }
    }

    const { executor } = createPostgresTransactionalExecutor(Pool, {
      DATABASE_URL: "postgres://user:pass@example.test/db",
      PROJECT_CA_CERT: CERT_B64,
    });

    await expect(
      executor.transaction(async (tx) => {
        await tx.query("SELECT broken");
      }),
    ).rejects.toThrow("boom");

    expect(calls).toEqual(["BEGIN", "SELECT broken", "ROLLBACK"]);
    expect(release).toHaveBeenCalledTimes(1);
  });
});
