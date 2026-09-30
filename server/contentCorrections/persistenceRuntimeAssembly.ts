import type { ContentCorrectionRetentionPolicy } from "./contract";
import {
  parseContentCorrectionPersistenceActivationConfig,
  type ContentCorrectionPersistenceEnvironment,
} from "./persistenceActivationConfig";
import {
  createPostgresTransactionalExecutorFromConfig,
  type PostgresPoolConstructorLike,
  type PostgresTlsConfig,
} from "./postgresClient";
import {
  PostgresContentCorrectionQueueStore,
  type TransactionalSqlExecutor,
} from "./postgresStore";

export type ContentCorrectionPersistenceRuntime =
  | { enabled: false }
  | {
      enabled: true;
      postgres: PostgresTlsConfig;
      retentionPolicy: ContentCorrectionRetentionPolicy;
      executor: TransactionalSqlExecutor;
      store: PostgresContentCorrectionQueueStore;
      close: () => Promise<void>;
    };

/**
 * Assembles the durable correction persistence components without wiring them
 * into the HTTP server, running migrations, or issuing a database query.
 *
 * Disabled mode intentionally does not require a PostgreSQL driver constructor.
 * Enabled mode fails closed until an approved caller injects one.
 */
export function assembleContentCorrectionPersistenceRuntime(
  env: ContentCorrectionPersistenceEnvironment,
  Pool?: PostgresPoolConstructorLike,
): ContentCorrectionPersistenceRuntime {
  const config = parseContentCorrectionPersistenceActivationConfig(env);
  if (!config.enabled) return { enabled: false };
  if (!Pool) throw new Error("POSTGRES_POOL_CONSTRUCTOR_REQUIRED");

  const client = createPostgresTransactionalExecutorFromConfig(Pool, config.postgres);

  return {
    enabled: true,
    postgres: config.postgres,
    retentionPolicy: config.retentionPolicy,
    executor: client.executor,
    store: new PostgresContentCorrectionQueueStore(client.executor),
    close: client.close,
  };
}
