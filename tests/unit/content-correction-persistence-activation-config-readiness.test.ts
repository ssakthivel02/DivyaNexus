import { describe, expect, it } from "vitest";
import { parseContentCorrectionPersistenceActivationConfig } from "../../server/contentCorrections/persistenceActivationConfig";

const CA_PEM = "-----BEGIN CERTIFICATE-----\nTEST-CA\n-----END CERTIFICATE-----\n";
const CA_BASE64 = Buffer.from(CA_PEM, "utf8").toString("base64");

describe("content correction persistence activation config", () => {
  it("defaults to disabled without reading persistence secrets", () => {
    expect(
      parseContentCorrectionPersistenceActivationConfig({
        DATABASE_URL: "not-a-postgres-url",
        PROJECT_CA_CERT: "not-base64",
      }),
    ).toEqual({ enabled: false });
  });

  it("accepts an explicit false flag as disabled", () => {
    expect(
      parseContentCorrectionPersistenceActivationConfig({
        CONTENT_CORRECTION_PERSISTENCE_ENABLED: " false ",
      }),
    ).toEqual({ enabled: false });
  });

  it("rejects ambiguous enablement values", () => {
    expect(() =>
      parseContentCorrectionPersistenceActivationConfig({
        CONTENT_CORRECTION_PERSISTENCE_ENABLED: "yes",
      }),
    ).toThrow("INVALID_CORRECTION_PERSISTENCE_ENABLED");
  });

  it("fails closed when enabled without the postgres URL", () => {
    expect(() =>
      parseContentCorrectionPersistenceActivationConfig({
        CONTENT_CORRECTION_PERSISTENCE_ENABLED: "true",
        CONTENT_CORRECTION_RETENTION_MS: "86400000",
        PROJECT_CA_CERT: CA_BASE64,
      }),
    ).toThrow("POSTGRES_DATABASE_URL_REQUIRED");
  });

  it("fails closed when enabled without the CA certificate", () => {
    expect(() =>
      parseContentCorrectionPersistenceActivationConfig({
        CONTENT_CORRECTION_PERSISTENCE_ENABLED: "true",
        CONTENT_CORRECTION_RETENTION_MS: "86400000",
        DATABASE_URL: "postgres://user:pass@example.test:5432/divyanexus",
      }),
    ).toThrow("POSTGRES_CA_CERT_REQUIRED");
  });

  it("requires an explicit positive integer retention duration", () => {
    expect(() =>
      parseContentCorrectionPersistenceActivationConfig({
        CONTENT_CORRECTION_PERSISTENCE_ENABLED: "true",
        CONTENT_CORRECTION_RETENTION_MS: "0",
        DATABASE_URL: "postgres://user:pass@example.test:5432/divyanexus",
        PROJECT_CA_CERT: CA_BASE64,
      }),
    ).toThrow("INVALID_CORRECTION_RETENTION_MS");
  });

  it("returns validated TLS and retention configuration when explicitly enabled", () => {
    const config = parseContentCorrectionPersistenceActivationConfig({
      CONTENT_CORRECTION_PERSISTENCE_ENABLED: "true",
      CONTENT_CORRECTION_RETENTION_MS: "86400000",
      DATABASE_URL: "postgres://user:pass@example.test:5432/divyanexus?sslmode=require&application_name=divyanexus",
      PROJECT_CA_CERT: CA_BASE64,
    });

    expect(config.enabled).toBe(true);
    if (!config.enabled) throw new Error("expected enabled config");

    expect(config.retentionPolicy).toEqual({ retentionMs: 86400000 });
    expect(config.postgres.ssl.ca).toBe(CA_PEM.trim());
    expect(config.postgres.connectionString).toContain("application_name=divyanexus");
    expect(config.postgres.connectionString).not.toContain("sslmode=");
  });
});
