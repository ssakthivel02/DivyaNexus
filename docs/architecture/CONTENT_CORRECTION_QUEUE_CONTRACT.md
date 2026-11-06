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
- deterministic tests for validation, record creation, lookup, retention readiness, trusted status-transition authorization readiness, deletion/audit readiness, abuse-control admission readiness and fail-closed storage behavior.

## Privacy and trust

The initial contract deliberately does not add reporter name, email, account identifiers, medical data, financial data, or other unnecessary personal fields. A future authenticated workflow may add identity linkage only after its privacy, retention, access-control, abuse, deletion and audit requirements are reviewed.

Retention is intentionally **not assigned a default duration** in this contract. Any durable deployment must supply an explicit reviewed `retentionMs` policy. The queue store must expose `purgeBefore(cutoffIso)`, and the service derives the cutoff from that explicit policy. Invalid policy values, storage failures, and invalid purge results fail closed.

A numeric retention value used in unit tests is test data only and is not a production recommendation or policy decision.

Status-transition authorization is also provider-neutral and fail closed. A future trusted server-side layer may pass a bounded opaque `actorRef` into `transitionStatus(...)`; an injected `transitionAuthorizer` must explicitly approve the requested next status before the store is called. The actor reference is authorization context only and is not added to the correction record by this contract.

The store transition uses the record's current status as an expected value. A null result is treated as a conflict rather than silently overwriting a concurrent editorial update. This contract does not define staff roles, credentials, session semantics, or an authentication provider; those remain deployment decisions requiring separate review.

## Abuse-control admission readiness

Future public correction intake must not call the unrestricted internal `submit(...)` path directly. The readiness contract provides `submitGuarded(...)`, which:

- validates and normalizes the correction report first;
- requires an injected `submissionAdmissionPolicy`;
- passes only the bounded normalized correction input to that policy;
- requires the policy to return strict `true` before storage is called; and
- fails closed when the policy is missing, denies the submission, or throws.

The admission contract intentionally does **not** define or persist an IP address, device fingerprint, email address, account ID, cookie/session ID, or rate-limit key. A future runtime may bind the injected admission policy to separately reviewed request-scoped abuse controls, but those identifiers and their retention/privacy rules remain outside this queue contract.

The normalized report passed to the policy is frozen for the duration of the decision. Rejected or failed admission decisions do not call `enqueue(...)` and therefore do not create a correction record through the guarded path.

This slice does not choose thresholds, rate windows, CAPTCHA/challenge providers, reputation services, moderation vendors, or storage for counters. Those are deployment decisions requiring separate review.

## Deletion and audit readiness

Deletion is deliberately modeled as a separate privileged operation. `deleteCorrection(...)` requires:

- a bounded trusted actor reference;
- an injected `deletionAuthorizer` that must explicitly approve the deletion;
- the correction record to exist at the status that was just reviewed by the service; and
- an injected store capability named `deleteWithAudit(...)`.

The store capability is intentionally atomic from the service contract's point of view: the future durable adapter must delete the correction and commit its audit event together, or do neither. The service does **not** perform a delete first and then attempt a best-effort audit write afterward.

The deletion audit event is immutable and intentionally metadata-only. It contains:

- audit event ID;
- correction ID;
- action (`deleted`);
- occurrence timestamp;
- previous correction status; and
- the bounded opaque trusted actor reference used for authorization.

It does **not** copy the correction concern, questioned text, evidence, page URL, source record ID, Ask Divya prompt/answer text, reporter identity, account identifiers, or other report payload into the audit event.

Missing deletion authorization, denied authorization, missing atomic store capability, optimistic-status conflict, invalid store result, invalid generated audit ID, or storage failure all fail closed. This readiness contract does not itself choose where audit events are stored, how long they are retained, who may read them, or what legal/compliance retention policy applies.

## Not included

This change does not:

- provision a database, queue, KV store, audit database, abuse counter store, or third-party service;
- expose a new public HTTP endpoint;
- change the current contact-path behavior;
- claim durable persistence or public ticket tracking;
- choose a production retention duration for correction records or audit events;
- choose abuse thresholds, rate windows, challenge/CAPTCHA behavior, or moderation/reputation provider;
- define or persist IP/device/account/session identifiers for abuse control;
- schedule or automatically execute retention cleanup;
- define staff/editorial identities or role taxonomy;
- select or activate an authentication provider;
- expose status transitions or deletion to an untrusted/public caller;
- persist the trusted actor reference on correction records;
- define public audit-log visibility;
- select or activate an AI provider;
- change devotional/source records or their review status.

A later persistence/runtime slice must choose a durable store, approve production retention durations for both correction records and audit metadata, define staff/editorial identities and access-control policy, bind the injected authorizers to a separately reviewed trusted authentication layer, define audit-log access and deletion/legal-hold behavior, bind guarded submission to reviewed runtime abuse controls, and qualify runtime/deployment behavior before the UI can say reports are automatically queued, trackable, or deletable.
