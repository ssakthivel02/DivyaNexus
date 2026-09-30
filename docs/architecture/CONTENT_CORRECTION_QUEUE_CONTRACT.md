# Content Correction Queue Contract

This slice defines the server-side contract required for a future durable editorial correction queue without claiming that persistence already exists.

## Boundary

The public `/content-corrections` page remains accurate: reports are not yet automatically persisted, assigned a durable public ticket, or exposed through a public status endpoint.

The contract provides:

- bounded, validated correction categories and free-text fields;
- at least one reproducible target (`pageUrl`, `recordId`, or `askDivyaRequestId`);
- explicit editorial statuses from `submitted` through review/resolution states;
- a storage interface that must be injected by a separately reviewed durable implementation;
- a service that fails if storage fails rather than pretending a report was queued;
- deterministic tests for validation, record creation, lookup, retention readiness and fail-closed storage behavior.

## Privacy and trust

The initial contract deliberately does not add reporter name, email, account identifiers, medical data, financial data, or other unnecessary personal fields. A future authenticated workflow may add identity linkage only after its privacy, retention, access-control, abuse, and deletion requirements are reviewed.

Retention is intentionally **not assigned a default duration** in this contract. Any durable deployment must supply an explicit reviewed `retentionMs` policy. The queue store must expose `purgeBefore(cutoffIso)`, and the service derives the cutoff from that explicit policy. Invalid policy values, storage failures, and invalid purge results fail closed.

A numeric retention value used in unit tests is test data only and is not a production recommendation or policy decision.

## Not included

This change does not:

- provision a database, queue, KV store, or third-party service;
- expose a new public HTTP endpoint;
- change the current contact-path behavior;
- claim durable persistence or public ticket tracking;
- choose a production retention duration;
- schedule or automatically execute retention cleanup;
- define staff/editorial identities or access-control roles;
- select an authentication provider;
- select or activate an AI provider;
- change devotional/source records or their review status.

A later persistence slice must choose a durable store, approve a production retention duration, define staff/editorial access controls and deletion/audit behavior, wire an authenticated/editorial status-transition path, add abuse controls, and qualify runtime/deployment behavior before the UI can say reports are automatically queued or trackable.
