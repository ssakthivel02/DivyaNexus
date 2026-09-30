# Content Correction Migration Manifest Readiness

This readiness slice defines how reviewed PostgreSQL migration SQL is selected and loaded before it is handed to the checksum-tracked migration runner.

## Included

- A fixed, ordered manifest of reviewed migration filenames.
- Path confinement: each manifest entry must be a basename inside the configured migration directory.
- UTF-8 text is supplied through an injected reader.
- Migration SQL is trimmed and must be non-empty.
- The migration ID is derived from the reviewed filename and handed to the existing migration runner.
- Files that merely exist in the directory are **not** auto-discovered or executed.

## Security / governance boundary

The manifest is intentionally explicit. Adding a migration requires a repository change and normal PR/CI review; dropping an arbitrary `.sql` file into a runtime directory must not cause execution.

This slice does not connect to PostgreSQL, create a database, install a driver, execute migrations, read deployment secrets, or modify Render/Aiven. It does not activate public correction intake, status tracking, authentication, staff identity, retention policy, or AI providers.

## Activation still requires

1. A separately approved dedicated DivyaNexus PostgreSQL service. The SakthiAI database must not be reused.
2. A reviewed PostgreSQL driver dependency and runtime wiring.
3. Deployment-secret injection for `DATABASE_URL` and `PROJECT_CA_CERT`.
4. Packaging of the reviewed migration SQL files into the controlled runtime/deployment artifact.
5. Controlled execution of the migration runner against the dedicated DivyaNexus database.
6. Production retention, trusted authorization, abuse-control binding, and deployment qualification before any public correction queue/tracking claim.
