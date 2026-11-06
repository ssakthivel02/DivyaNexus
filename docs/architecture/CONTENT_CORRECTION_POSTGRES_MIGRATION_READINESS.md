# Content Correction PostgreSQL Migration Readiness

This slice prepares deterministic schema migration execution for the content-correction persistence lane. It does not activate a database connection or run a migration in any environment.

## Contract

`runContentCorrectionMigrations()` accepts the already prepared transactional SQL executor plus the complete ordered set of known migrations. It:

- requires canonical IDs such as `001_content_corrections`
- rejects duplicate and out-of-order definitions before storage work
- calculates SHA-256 checksums over normalized migration SQL
- acquires a PostgreSQL transaction-scoped advisory lock before schema work
- creates a private `content_correction_schema_migrations` history table when absent
- skips an already applied migration only when its recorded checksum is identical
- fails closed on checksum drift
- fails closed if the database contains an applied migration unknown to the supplied complete manifest
- applies SQL and records its checksum in the same transaction

The transaction boundary is supplied by the PostgreSQL client readiness layer, so migration failure must roll back both the schema statement and its history record.

## Activation boundary

The existing checked-in migration remains `server/contentCorrections/migrations/001_content_corrections.sql`. A future activation layer must load the exact reviewed migration files into the complete manifest; this slice deliberately does not add filesystem/runtime loading because the server bundle currently does not copy SQL assets into `dist`.

Before any real execution, all of the following remain mandatory:

1. a dedicated DivyaNexus PostgreSQL service; never reuse SakthiAI storage
2. explicit approval of any paid service
3. a real PostgreSQL driver dependency and deployment-secret injection
4. reviewed loading of the checked-in SQL migration files
5. a production retention-duration decision
6. trusted staff/editorial identity and authorization binding
7. abuse-control binding for public submission
8. migration execution in a controlled deployment step with evidence
9. post-deployment runtime and production verification

No database, Aiven service, Render service, credential, certificate, secret, endpoint, auth provider, AI provider, retention duration, or public tracking claim is created by this readiness slice.
