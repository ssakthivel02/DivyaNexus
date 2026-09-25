# Ask Divya Gate C staging preparation

Status: staging preparation only. This change does not enable a live AI provider and does not change the GitHub Pages production frontend.

## Activation boundary

The bundled Express server exposes the staging Ask Divya routes only when:

```text
ASK_DIVYA_STAGING_ENABLED=true
```

Without that explicit flag, `/api/v1/ask` and `/api/v1/ask/health` are not mounted.

## Staging routes

- `GET /api/v1/ask/health`
- `POST /api/v1/ask`

The health response must report:

- `stage: gate-c-prep`
- `provider: staging-mock-v1`
- `liveProviderEnabled: false`

The POST route uses the Gate A request contract and the Gate B guarded runtime, including reviewed-corpus retrieval, citation preservation, prompt-injection blocking, timeout/circuit-breaker semantics and structured fallbacks.

## Provider boundary

This stage uses only `AskDivyaStagingMockProvider`.

It must not:

- import or call a live AI SDK;
- read a provider API key;
- access arbitrary web content;
- claim that its generated text is scripture or verified translation;
- change the public Ask Divya UI from `LOCAL GUIDE · STAGE B`;
- imply that Gate C production activation is complete.

Mock responses contain an explicit `STAGING MOCK` marker and uncertainty text stating that no live provider was called.

## Deployment requirements for the next Gate C slice

Before a real staging deployment is allowed, select a non-production HTTPS runtime that supports:

- server-side environment secrets;
- custom or provider TLS hostname;
- deployment rollback;
- health checks;
- request/body limits;
- controlled logs without raw prompt persistence by default;
- separation from the GitHub Pages production host.

A real provider adapter, if introduced later, must be configured only in that server-side staging runtime and must remain inaccessible from browser bundles.

## Verification checklist

For a future staging deployment, verify:

1. health reports the expected staging release and provider mode;
2. invalid requests fail safely;
3. reviewed-corpus citations are preserved;
4. prompt-injection attempts are blocked;
5. Tamil and English contract handling works;
6. provider failure and timeout preserve safe fallback behavior;
7. no credential appears in HTML, JS bundles, source maps, headers or API responses;
8. the production GitHub Pages site remains unchanged until a separate activation decision.
