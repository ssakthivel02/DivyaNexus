import { validateContentCorrectionRetentionPolicy, type ContentCorrectionRetentionPolicy } from "./contract";
import { buildPostgresTlsConfig } from "./postgresClient";

export interface ContentCorrectionPersistenceEnvironment {
  CONTENT_CORRECTION_PERSISTENCE_ENABLED?: string;
  CONTENT_CORRECTION_RETENTION_MS?: string;
  DATABASE_URL?: string;
  PROJECT_CA_CERT?: string;
}

export type ContentCorrectionPersistenceActivationConfig =
  | { enabled: false }
  | {
      enabled: true;
      postgres: ReturnType<typeof buildPostgresTlsConfig>;
      retentionPolicy: ContentCorrectionRetentionPolicy;
    };

function parseActivationFlag(value: string | undefined): boolean {
  const normalized = value?.trim();
  if (!normalized || normalized === "false") return false;
  if (normalized === "true") return true;
  throw new Error("INVALID_CORRECTION_PERSISTENCE_ENABLED");
}

function parseRetentionMs(value: string | undefined): ContentCorrectionRetentionPolicy {
  const normalized = value?.trim();
  if (!normalized || !/^\d+$/.test(normalized)) {
    throw new Error("CORRECTION_RETENTION_MS_REQUIRED");
  }

  const retentionMs = Number(normalized);
  try {
    return validateContentCorrectionRetentionPolicy({ retentionMs });
  } catch {
    throw new Error("INVALID_CORRECTION_RETENTION_MS");
  }
}

export function parseContentCorrectionPersistenceActivationConfig(
  env: ContentCorrectionPersistenceEnvironment,
): ContentCorrectionPersistenceActivationConfig {
  if (!parseActivationFlag(env.CONTENT_CORRECTION_PERSISTENCE_ENABLED)) {
    return { enabled: false };
  }

  return {
    enabled: true,
    postgres: buildPostgresTlsConfig({
      DATABASE_URL: env.DATABASE_URL,
      PROJECT_CA_CERT: env.PROJECT_CA_CERT,
    }),
    retentionPolicy: parseRetentionMs(env.CONTENT_CORRECTION_RETENTION_MS),
  };
}
