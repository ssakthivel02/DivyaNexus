# Content correction persistence runtime assembly readiness

This slice prepares a dependency-injected assembly boundary for future durable content-correction persistence.

## What it does

`assembleContentCorrectionPersistenceRuntime(...)` composes the already-reviewed pieces:

- persistence activation configuration parsing;
- PostgreSQL TLS configuration;
- transactional SQL executor construction;
- `PostgresContentCorrectionQueueStore` creation;
- deployment-supplied retention policy;
- explicit close lifecycle.

Disabled mode returns `{ enabled: false }` and does not require a PostgreSQL driver constructor.

Enabled mode fails closed with `POSTGRES_POOL_CONSTRUCTOR_REQUIRED` unless an approved caller explicitly injects a compatible pool constructor.

Assembly itself does not run a SQL query or acquire a database connection. The pool constructor may allocate a local client/pool object, but network/database work only begins when a later caller invokes the executor/store.

## Still not activated

This change does **not**:

- add `pg` or another PostgreSQL driver dependency;
- wire persistence into `server/index.ts`;
- create or modify an Aiven/Render service;
- inject real deployment secrets;
- execute migrations;
- expose public correction intake/status/delete endpoints;
- choose the production retention duration;
- bind trusted staff/editorial identity or authorization;
- configure runtime abuse-control thresholds;
- change Ask Divya's AI provider.

The existing SakthiAI PostgreSQL service must never be reused for DivyaNexus data.

## Activation gates that remain

Production activation still requires, separately and explicitly:

1. an approved dedicated DivyaNexus PostgreSQL service;
2. an approved PostgreSQL driver/runtime dependency;
3. deployment-secret injection for the dedicated database and CA;
4. controlled migration execution against that database;
5. an explicit production retention duration;
6. trusted staff/editorial authorization and abuse-control binding;
7. deliberate server/runtime wiring;
8. deployment, browser, accessibility, and security qualification.
