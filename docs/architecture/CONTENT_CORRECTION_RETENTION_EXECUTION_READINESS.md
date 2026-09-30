# Content Correction Retention Execution Readiness

This slice prepares deterministic retention enforcement without activating it in any runtime.

## What is included

- UTC cutoff calculation from an already-approved `ContentCorrectionRetentionPolicy`.
- A coordinator that previews the cutoff without touching persistence.
- Explicit fail-closed execution approval (`{ approved: true }`) before `purgeBefore` can be called.
- Validation that the store returns a non-negative safe integer purge count.
- Deterministic unit tests for preview, denied execution, approved purge invocation, cutoff calculation, and invalid results.

## What is deliberately not included

- No scheduler, timer, cron job, background worker, or automatic purge loop.
- No production retention duration is selected or implied.
- No PostgreSQL driver, connection, query, migration, Aiven, or Render change.
- No server wiring or public correction endpoint.
- No auth/staff identity binding, legal-hold policy, or audit-reader policy.
- No live provider or Ask Divya provider change.

The caller remains responsible for supplying an explicitly approved production retention duration and for deciding when a retention run is allowed. Runtime scheduling and operational policy remain separate deployment decisions.
