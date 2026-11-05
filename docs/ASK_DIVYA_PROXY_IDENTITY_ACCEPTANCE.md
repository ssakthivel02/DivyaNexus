# Ask Divya staging: proxy/client-identity acceptance

**Status:** evidence preparation only; no production or staging configuration change.

## Current code boundary

At `main` baseline `406385c31ed7496602b5577328fe132baa310636`, `server/index.ts` supplies `req.ip || "anonymous"` to `createAskDivyaStagingService().ask()`. This identity is used by the process-local rate limiter and one-active-request concurrency guard. No explicit Express `trust proxy` configuration is in that file.

The characterization tests in `tests/unit/askDivyaProxyIdentityBoundary.test.ts` establish Express behavior locally:
- With default proxy trust disabled, different forwarded headers do not change `req.ip` over the same direct socket.
- Trusting one hop causes `req.ip` to reflect the last forwarded address in a local test.
- Trusting a forwarded header is unsafe when clients can reach an untrusted hop directly or spoof that header.

**These tests do not prove Render's actual ingress topology or whether it sanitizes forwarded headers.**

## Non-mutating Render acceptance matrix

1. Confirm the existing Render service identity `divyanexus-ask-staging`, its deployed SHA and auto-deploy setting. Do not create a duplicate service.
2. Establish what address Express sees on the live staging route **without logging raw user IPs or prompts**. Prefer a short-lived access-controlled diagnostic that returns redacted identity class/consistency observations, not complete addresses.
3. Compare requests from two independent client networks. Confirm whether the current limiter buckets are distinct while staying within reasonable request volume.
4. Verify whether the ingress strips/replaces untrusted `X-Forwarded-For` and whether the last trusted hop can be safely identified.
5. Test same-client concurrency and a second independent client; do not infer client uniqueness from a single workstation.
6. Test restart behavior as a separate limitation. Current in-memory counters reset; do not claim global or restart-durable enforcement.
7. If production will have more than one process/instance, define a shared limiter backend and abuse policy rather than treating process-local counters as sufficient.
8. Record system under test, exact deploy ID/SHA, date, route, approved test identities, redacted observations, PASS/FAIL and rollback decision.

## Remediation decision gate

Choose a client-identity strategy only after verifying the real ingress boundary:
- Trust a verified proxy address or tightly specified hop count **only** where direct ingress bypass and forwarded-header spoofing are blocked.
- Fail closed if the client identity is unavailable. Do not use caller-controlled arbitrary headers as a trusted key.
- Protect user privacy in logs and telemetry.
- Keep mock-only staging, provider-off policy and production `LOCAL GUIDE / STAGE B` unchanged.
- Coordinate ownership in issue #4 before editing runtime behavior.

This document is an acceptance plan, **not approval** to redeploy or activate paid providers.
