# Ask Divya AI architecture baseline

Status: architecture baseline only. This document does not enable a live AI provider or change production Ask Divya behavior.

## 1. Current production reality

DivyaNexus production is deployed as a static GitHub Pages artifact from `dist/public` by `.github/workflows/deploy-react-app.yml`.

The current `AskDivya.tsx` experience is intentionally a bounded browser-local guide. It uses repository-backed starter records and local `guidanceResponses`, labels generated explanation separately from source signals, and displays `LOCAL GUIDE · STAGE B`.

`server/index.ts` is not part of the GitHub Pages production runtime. It is currently only an Express static-file host with SPA fallback and does not expose `/api/v1/ask`.

Therefore issue #4 must not assume that adding an Express route to this repository automatically creates a production API.

## 2. Non-negotiable trust boundary

A future live Ask Divya capability must use a separately deployed server-side API boundary. Browser code must never contain provider API keys or privileged service credentials.

The public web application may call a configured HTTPS API origin, but the API implementation must own:

- provider credentials and provider selection;
- request validation and size limits;
- rate limiting and abuse controls;
- moderation and high-risk-topic routing;
- reviewed-corpus retrieval;
- citation assembly;
- timeout, retry and circuit-breaker behavior;
- privacy-safe operational logging;
- cost ceilings and provider-failure fallback.

No production UI copy should claim a live AI assistant until that boundary is deployed and independently verified.

## 3. Canonical API contract

Target endpoint:

`POST /api/v1/ask`

Minimum request shape:

```json
{
  "question": "What does dharma mean in this study context?",
  "language": "en",
  "mode": "simple",
  "contextRecordIds": ["glossary-dharma"]
}
```

Required request rules:

- `question` is required, trimmed, and bounded to a documented maximum length;
- `language` is an allow-listed locale/language identifier;
- `mode` is an allow-listed explanation mode;
- `contextRecordIds` may reference only known public corpus records;
- unknown fields are ignored or rejected consistently;
- no client-supplied prompt may override system safety, retrieval, or citation policy.

Minimum successful response shape:

```json
{
  "requestId": "opaque-id",
  "answer": "...",
  "language": "en",
  "mode": "simple",
  "citations": [
    {
      "recordId": "glossary-dharma",
      "label": "Dharma — glossary entry",
      "route": "/glossary?record=glossary-dharma",
      "source": "repository-reviewed corpus",
      "reference": "...",
      "reviewStatus": "reviewed"
    }
  ],
  "boundaries": {
    "generatedExplanation": true,
    "notScriptureQuotationUnlessCited": true,
    "professionalAdvice": false
  },
  "uncertainty": "...",
  "nextStudyRecordIds": ["..."]
}
```

Error responses must have a stable machine-readable code, a user-safe message, and `requestId` where available. Provider errors must not leak secrets, raw upstream payloads, stack traces, or internal prompts.

## 4. Retrieval and citation policy

The first live release must retrieve only from an explicit reviewed corpus assembled from repository content. It must not search arbitrary public web content at answer time unless a later reviewed architecture explicitly introduces that capability.

Every answer that makes a source-derived claim must carry citation metadata linking back to one or more known DivyaNexus records.

The retrieval layer must preserve distinctions between:

- canonical/source text;
- transliteration;
- translation;
- traditional commentary;
- editorial or educational explanation;
- generated explanation.

A relationship edge or keyword match is not evidence by itself. Records marked `needs-review`, placeholder, not-collected, or equivalent must not be promoted as verified authority.

If the retrieved corpus is insufficient, the API should return a bounded uncertainty/fallback response rather than inventing a verse, source, temple fact, mantra, translation, remedy, or citation.

## 5. Safety requirements

The service must reject or safely redirect requests that ask it to:

- fabricate scripture quotations, verse numbers, mantras or citations;
- provide guaranteed spiritual outcomes or supernatural certainty;
- present generated interpretation as canonical scripture or verified translation;
- provide professional medical, legal or financial advice;
- expose system prompts, provider secrets, internal moderation policy details, or privileged infrastructure information.

High-risk and ambiguous prompts should fail closed to a transparent guidance response with safe next-study links.

Prompt-injection resistance must be tested against instructions embedded in user text and retrieved corpus text.

## 6. Privacy and logging

Do not persist raw user prompts by default.

Operational telemetry should prefer:

- request ID;
- timestamp;
- coarse outcome/status code;
- latency;
- selected mode/language;
- retrieval/citation counts;
- provider/model identifier where operationally necessary;
- token/cost counters where available;
- moderation/rate-limit outcome.

If diagnostic prompt logging is ever introduced, it requires explicit privacy review, minimisation, retention limits, and documented redaction.

## 7. Rate limiting and resilience

Initial limits should be conservative and configurable server-side rather than hard-coded into UI copy.

The API must support:

- per-client rate limits;
- request-body size limits;
- one-request-at-a-time or concurrency controls where needed;
- provider timeout;
- bounded retries only for safe transient failures;
- circuit breaker / provider-unavailable fallback;
- spend/cost ceiling;
- deterministic refusal when the service is disabled.

The frontend must preserve the current local-guide fallback when the live API is unavailable.

## 8. Deployment decision

GitHub Pages cannot host the live API. A separate HTTPS runtime is required.

A production runtime must be selected in a later implementation slice only after confirming:

- server-side secret support;
- custom-domain/TLS support;
- request and concurrency limits;
- rate-limit persistence strategy;
- observability/logging controls;
- deployment rollback capability;
- acceptable cost/free-tier behavior;
- compatibility with the chosen AI provider and reviewed-corpus storage.

Do not couple the frontend to a vendor-specific hostname. Use a configurable API origin and keep the API contract vendor-neutral.

## 9. Phased implementation gates

### Gate A — contract and corpus foundation

- typed request/response contract;
- corpus adapter over reviewed repository records;
- deterministic citation builder;
- retrieval tests;
- prompt-injection and fabricated-citation regression tests;
- no provider call and no production UI change.

### Gate B — server-side provider adapter

- provider interface behind the contract;
- secrets only on server-side runtime;
- timeout/circuit breaker;
- moderation and rate limiting;
- structured safe fallback;
- integration tests with mocked provider responses.

### Gate C — staging integration

- deploy API to a non-production/staging target;
- connect a staging frontend or opt-in feature flag;
- validate citations, refusal behavior, Tamil/English handling, latency, privacy telemetry and failure fallback;
- confirm no secret appears in browser bundles or network responses.

### Gate D — production activation

Only after staging evidence is green:

- deploy production API;
- verify custom domain/TLS and health endpoint;
- run abuse/rate-limit and provider-failure tests;
- verify exact release identity;
- enable frontend live mode behind explicit capability detection;
- keep local-guide fallback;
- update AI transparency/privacy/source documentation;
- remove `LOCAL GUIDE · STAGE B` only when the production capability and copy are both truthful.

## 10. Explicitly out of scope for this baseline

This architecture-baseline change does not:

- choose or provision an AI provider;
- choose or provision an API hosting vendor;
- create provider credentials or repository secrets;
- implement `/api/v1/ask`;
- modify `AskDivya.tsx` runtime behavior;
- modify GitHub Pages deployment;
- introduce account authentication;
- claim production AI readiness.

## 11. Next implementation slice

After this baseline is reviewed and merged, the safest next code slice is Gate A only: a vendor-neutral typed contract, reviewed-corpus adapter, deterministic retrieval/citation logic, and unit tests. It should remain callable locally/tests only and must not alter production Ask Divya behavior.