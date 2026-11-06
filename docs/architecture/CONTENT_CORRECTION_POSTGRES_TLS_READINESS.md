# Content correction PostgreSQL TLS readiness

This slice prepares the correction persistence layer for a future dedicated PostgreSQL service without activating runtime persistence.

## Security boundary

A future PostgreSQL activation must provide both `DATABASE_URL` and `PROJECT_CA_CERT`. The CA is expected as base64-encoded PEM. The connection URL is validated as `postgres:`/`postgresql:` and any `sslmode` query parameter is removed before the pool is created so the explicitly supplied CA remains the TLS trust anchor.

The helper fails closed when the URL or CA is absent or invalid. It also provides `BEGIN` / `COMMIT` / `ROLLBACK` transaction semantics required by atomic delete+audit behavior.

## Deliberately not activated

This repository still does not include a PostgreSQL driver dependency or ORM, and the helper is not wired into the public runtime. No credentials, connection strings, CA certificates, IP allowlists, database migrations, retention duration, auth identity binding, or public correction API are configured by this slice.

Runtime activation requires, separately:

- an approved dedicated DivyaNexus PostgreSQL service (never the SakthiAI database),
- an approved PostgreSQL driver/runtime dependency,
- deployment-secret injection for `DATABASE_URL` and `PROJECT_CA_CERT`,
- migration execution against that dedicated service,
- explicit production retention policy,
- trusted authz and abuse-control binding,
- deployment and browser/runtime qualification.
