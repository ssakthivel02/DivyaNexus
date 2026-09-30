import type { SqlExecutor, SqlQueryResult, TransactionalSqlExecutor } from "./postgresStore";

export interface PostgresTlsEnvironment {
  DATABASE_URL?: string;
  PROJECT_CA_CERT?: string;
}

export interface PostgresPoolClientLike {
  query<Row = unknown>(text: string, values?: readonly unknown[]): Promise<{ rows: Row[]; rowCount: number | null }>;
  release(): void;
}

export interface PostgresPoolLike {
  query<Row = unknown>(text: string, values?: readonly unknown[]): Promise<{ rows: Row[]; rowCount: number | null }>;
  connect(): Promise<PostgresPoolClientLike>;
  end?(): Promise<void> | void;
}

export interface PostgresPoolConstructorLike {
  new (config: { connectionString: string; ssl: { ca: string } }): PostgresPoolLike;
}

export interface PostgresTlsConfig {
  connectionString: string;
  ssl: { ca: string };
}

function requireValue(value: string | undefined, error: string): string {
  const normalized = value?.trim();
  if (!normalized) throw new Error(error);
  return normalized;
}

function decodeProjectCa(value: string): string {
  const buffer = Buffer.from(value, "base64");
  if (buffer.length === 0) throw new Error("INVALID_POSTGRES_CA_CERT");
  const ca = buffer.toString("utf8").trim();
  if (!ca.includes("BEGIN CERTIFICATE") || !ca.includes("END CERTIFICATE")) {
    throw new Error("INVALID_POSTGRES_CA_CERT");
  }
  return ca;
}

export function buildPostgresTlsConfig(env: PostgresTlsEnvironment): PostgresTlsConfig {
  const rawUrl = requireValue(env.DATABASE_URL, "POSTGRES_DATABASE_URL_REQUIRED");
  const rawCa = requireValue(env.PROJECT_CA_CERT, "POSTGRES_CA_CERT_REQUIRED");

  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("INVALID_POSTGRES_DATABASE_URL");
  }
  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
    throw new Error("INVALID_POSTGRES_DATABASE_URL");
  }

  // pg v8 gives URL sslmode precedence over the explicit ssl object. Remove it
  // so the deployment-supplied CA is always the trust anchor.
  url.searchParams.delete("sslmode");

  return {
    connectionString: url.toString(),
    ssl: { ca: decodeProjectCa(rawCa) },
  };
}

function normalizeResult<Row>(result: { rows: Row[]; rowCount: number | null }): SqlQueryResult<Row> {
  return {
    rows: result.rows,
    rowCount: result.rowCount ?? result.rows.length,
  };
}

export function createPostgresTransactionalExecutorFromConfig(
  Pool: PostgresPoolConstructorLike,
  config: PostgresTlsConfig,
): { executor: TransactionalSqlExecutor; close: () => Promise<void> } {
  const pool = new Pool(config);

  const executor: TransactionalSqlExecutor = {
    async query<Row = unknown>(text: string, values?: readonly unknown[]): Promise<SqlQueryResult<Row>> {
      return normalizeResult(await pool.query<Row>(text, values));
    },

    async transaction<T>(work: (tx: SqlExecutor) => Promise<T>): Promise<T> {
      const client = await pool.connect();
      const tx: SqlExecutor = {
        async query<Row = unknown>(text: string, values?: readonly unknown[]): Promise<SqlQueryResult<Row>> {
          return normalizeResult(await client.query<Row>(text, values));
        },
      };

      try {
        await client.query("BEGIN");
        const value = await work(tx);
        await client.query("COMMIT");
        return value;
      } catch (error) {
        try {
          await client.query("ROLLBACK");
        } catch {
          // Preserve the original transaction failure.
        }
        throw error;
      } finally {
        client.release();
      }
    },
  };

  return {
    executor,
    close: async () => {
      if (pool.end) await pool.end();
    },
  };
}

export function createPostgresTransactionalExecutor(
  Pool: PostgresPoolConstructorLike,
  env: PostgresTlsEnvironment,
): { executor: TransactionalSqlExecutor; close: () => Promise<void> } {
  return createPostgresTransactionalExecutorFromConfig(Pool, buildPostgresTlsConfig(env));
}
