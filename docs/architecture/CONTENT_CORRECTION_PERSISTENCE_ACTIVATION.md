# Content-correction persistence activation readiness

This slice defines only the fail-closed configuration boundary for a future durable content-correction runtime.

## Activation contract

Persistence is disabled unless `CONTENT_CORRECTION_PERSISTENCE_ENABLED` is exactly `true` (ignoring surrounding whitespace). Missing, empty, or explicit `false` values keep persistence disabled. Any other value is rejected as ambiguous.

When persistence is explicitly enabled, all of the following deployment-supplied values are mandatory:

- `DATABASE_URL`
- `PROJECT_CA_CERT` (base64-encoded PEM CA certificate)
- `CONTENT_CORRECTION_RETENTION_MS` (positive safe integer milliseconds)

The parser reuses the existing PostgreSQL TLS validation, including removal of URL `sslmode` so the deployment-supplied CA remains the explicit trust anchor. It also reuses the existing retention-policy validator. There is intentionally no default production retention duration.

## Explicit non-goals

This code does **not**:

- create or modify any Aiven service;
- connect to PostgreSQL;
- add the `pg` driver or an ORM;
- read deployment secrets from Render;
- wire persistence into `server/index.ts`;
- run migrations;
- expose a public correction intake/status/delete endpoint;
- choose a production retention policy;
- define staff/editorial identity or authorization;
- define runtime abuse-control thresholds;
- activate any AI provider.

The existing SakthiAI PostgreSQL service must not be reused for DivyaNexus data.

## Remaining activation gates

Runtime activation remains blocked until a dedicated DivyaNexus PostgreSQL service is explicitly approved, the real PostgreSQL driver and deployment secret injection are reviewed, migrations are executed through the approved migration path, the production retention duration is explicitly selected, trusted staff/editorial authorization is bound, runtime abuse controls are defined, and deployment/browser/security qualification succeeds.
