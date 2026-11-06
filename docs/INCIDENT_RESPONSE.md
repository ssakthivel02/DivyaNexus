# DivyaNexus Incident Response

## Severity model

### SEV-1 — Critical

- Production shell unavailable for most users.
- Confirmed security or privacy exposure.
- Legal, privacy, or deletion routes inaccessible during a compliance incident.
- Release artifact is corrupted or serves unauthorised code.

### SEV-2 — High

- Major routes, search, Ask Divya, scripture, or deity experiences fail.
- Custom domain serves a stale release after a completed deployment.
- Direct routes or core assets consistently fail.

### SEV-3 — Moderate

- Isolated visual, responsive, accessibility, or content-discovery regression.
- One non-critical route or local-only feature is impaired.

## First 15 minutes

1. Record UTC time, observed URL, browser, and screenshot or workflow evidence.
2. Check the deployed `/release.json` and compare its commit with `main`.
3. Check `/health.json`, `/status`, the homepage marker, and one direct route.
4. Review the latest deployment and production-verification runs.
5. Classify application, deployment, DNS/TLS, cache, or third-party scope.
6. Stop unrelated merges while SEV-1 or SEV-2 is active.

## Containment

- Roll back when the last verified release is safer than an uncertain forward fix.
- Keep the custom domain, Pages configuration, and DNS unchanged unless evidence points to them.
- Preserve failed workflow logs and artifacts.
- Do not disable release-marker or commit verification to obtain a green result.

## Communication template

```text
Incident: <title>
Severity: <SEV-1/2/3>
Started: <UTC>
User impact: <observed impact only>
Current release evidence: <release and commit>
Known scope: <application/deployment/DNS/cache/unknown>
Action in progress: <specific action>
Next update: <time>
```

## Closure criteria

- Root cause is identified or bounded with evidence.
- Corrective deployment or rollback is complete.
- Production verification is green.
- Critical routes and assets are manually sampled.
- Follow-up tests or controls are assigned.
- The incident record distinguishes facts, inference, and unresolved questions.
