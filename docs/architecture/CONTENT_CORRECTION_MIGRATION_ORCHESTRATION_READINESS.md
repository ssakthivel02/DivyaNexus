# Content Correction Migration Orchestration Readiness

This slice composes the reviewed migration manifest loader with the existing checksum-tracked PostgreSQL migration runner without activating a database connection.

## Included

- preparation loads only the fixed reviewed migration manifest
- prepared migration IDs are exposed for inspection/evidence
- loaded migration records and ID lists are frozen
- execution remains fail-closed unless the caller explicitly supplies `{ approved: true }`
- the existing transactional runner still provides advisory locking, checksum verification, unknown-migration rejection, and atomic history recording
- deterministic unit tests cover preparation, denied execution, approved composition, and loader failure propagation

## Explicitly not activated

This readiness layer does **not**:

- install or import a PostgreSQL driver
- create or modify any Aiven/Render service
- read deployment secrets or certificates directly
- connect to a database
- execute migrations from application startup
- choose a production retention duration
- expose correction intake/status endpoints
- bind staff/editorial identity or auth
- configure runtime abuse-control thresholds
- select or activate an AI provider

A future controlled activation must separately approve a dedicated DivyaNexus PostgreSQL service, driver dependency, deployment-secret injection, migration execution procedure, production retention policy, trusted authorization, abuse-control runtime binding, and deployment qualification. The SakthiAI PostgreSQL service must not be reused for DivyaNexus data.
