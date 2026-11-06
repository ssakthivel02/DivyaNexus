# PostgreSQL Content-Correction Store Readiness

This slice prepares a PostgreSQL implementation of the existing content-correction queue contract without activating a database or exposing new public runtime behavior.

## Scope

The adapter implements `ContentCorrectionQueueStore` against a minimal injected SQL executor. No PostgreSQL client library, connection string, credential, Aiven SDK, ORM, or environment variable is introduced by this slice.

The SQL is parameterized for all report values. The adapter supports:

- durable enqueue;
- lookup by correction ID;
- retention purge by explicit cutoff;
- optimistic status transitions using the expected current status; and
- atomic correction deletion plus metadata-only audit insertion through a required transaction wrapper.

`deleteWithAudit(...)` returns `false` when the expected status no longer matches. Audit insertion occurs only after a successful delete inside the same transaction callback. A real SQL executor must commit the callback as one transaction and roll it back if the callback throws.

## Schema

`server/contentCorrections/migrations/001_content_corrections.sql` defines:

- `content_corrections` with bounded fields and contract-aligned category/status checks;
- target-presence validation (`page_url`, `record_id`, or `ask_divya_request_id`);
- indexes for retention and editorial status work;
- `content_correction_deletion_audit` containing only deletion metadata; and
- audit indexes by correction ID and occurrence time.

The deletion audit table deliberately has no foreign key back to the correction row because the referenced correction is deleted while its metadata-only audit record must remain independently durable.

## Explicitly not activated

This change does not:

- create or modify an Aiven/PostgreSQL service;
- connect production, preview, Render, or local runtime to a database;
- add credentials, connection strings, secrets, or IP allowlists;
- add a PostgreSQL client dependency;
- expose a public correction submission/status/deletion endpoint;
- select a production retention duration;
- select audit retention or legal-hold policy;
- define staff identities or authentication;
- alter Ask Divya provider behavior;
- claim that correction reports are currently persisted or trackable.

## Activation gate

Runtime activation requires a separately approved dedicated DivyaNexus PostgreSQL service, a reviewed TLS/client implementation, explicit retention settings, trusted authentication/authorization binding, abuse-control binding through `submitGuarded(...)`, migration application, and deployment qualification.

The existing SakthiAI PostgreSQL service must not be reused for DivyaNexus data.
