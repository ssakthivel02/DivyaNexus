# Ask Divya staging: proxy/client-identity acceptance

**Status:** evidence preparation only; no production or staging configuration change.

## Current code boundary

At `main` baseline `406385c31ed7496602b5577328fe132baa310636`, `server/index.ts` supplies `req.ip || "anonymous"` to `createAskDivyaStagingService().ask()`. This identity is used by the process-local rate limiter and one-active-request concurrency guard. No explicit Express `trust proxy` configuration is in that file.

The characterization tests in `tests/unit/askDivyaProxyIdentityBoundary.test.ts` establish Express behavior locally:
- With default proxy trust disabled, different forwarded headers do not change `req.ip` over the same direct socket.
- Trusting one hop causes `req.ip` to reflect the last forwarded address in a local test.
- Trusting a forwarded header is unsafe when clients can reach an untrusted hop directly or spoof that header.

**These tests do not prove Render's actual ingress topology or whether it sanitizes forwarded headers.**

## Verified Render control-plane inventory (read-only, 2026-11-06)

This inventory was obtained from the **existing** Render service and deployment records; no new service, deploy, restart, network probe or configuration change was performed.

| Field | Observed value |
| --- | --- |
| Render workspace | `My Workspace` (`tea-danue82jnfac739th8lg`) |
| Service | `divyanexus-ask-staging` (`srv-dar87aid0e5s73bs1bf0`) |
| Service URL | `https://divyanexus-ask-staging.onrender.com` |
| Source repo / configured branch | `ssakthivel02/DivyaNexus` / `main` |
| Auto-deploy / PR previews | Off / off |
| Service state | Not suspended; maintenance mode disabled |
| Instances / region | 1 / Singapore |
| Render IP allow-list | `0.0.0.0/0` (world-accessible at service layer; not proof of application authorization) |
| Latest live deploy ID | `dep-datnra6gekts73biptng` |
| Latest live deployed commit | `f70c08e684e21ef46bec646de4f71c54d48cdb51` |
| Live deploy completed | 2026-09-29T08:59:31.927107Z |
| Deploy trigger | API |

**Interpretation:** the staging service is on a **September 29** deployment, not this draft PR's current head `bc50dd13aa6d93451dfa81ee2bf5661f3f8590fa` or the current main baseline listed above. CI for a branch does not attest to the deployed binary. These control-plane values do **not** establish which forwarded headers Render strips or trusts, the observed `req.ip`, actual request-rate bucket isolation, or runtime security under multiple client networks. No proxy trust configuration change is authorized from this inventory alone.

**Remaining gate:** obtain authorized, privacy-preserving ingress evidence tied to this exact live deploy ID. If runtime changes are subsequently proposed, reconcile main, PR head and deployment identities first and obtain explicit staging-owner approval before any rollout.

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
