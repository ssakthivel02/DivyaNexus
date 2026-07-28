# DivyaNexus Production Reliability Wave 4

Date: 28 July 2026

## Objective

Convert deployment confidence from a visual assumption into a repeatable evidence contract. This wave focuses on release identity, direct-route availability, source portability, public machine-readable evidence, operational runbooks, and browser-level regression coverage.

## Delivered controls

1. A single release contract with the identifier `stage-b-wave4`.
2. Matching release markers in HTML, the React root, and runtime diagnostics.
3. A shared application route manifest.
4. A public `/status` page that reports browser-visible evidence without claiming global uptime.
5. Static `/health.json` evidence for the deployed application shell.
6. Deployment-generated `/release.json` with the Git commit and workflow run.
7. Canonical `robots.txt`, expanded `sitemap.xml`, and `.well-known/security.txt`.
8. Source-boundary validation for stale pages, unresolved placeholders, and non-portable runtime markers.
9. Router-to-manifest and sitemap-to-manifest validation.
10. Build-artifact validation for required files, linked assets, release markers, and size boundaries.
11. Pull-request and deployment workflows that execute the same quality gates.
12. Post-deployment verification of release identity, commit evidence, assets, health, and direct routes.
13. Nightly quality validation for drift detection.
14. Playwright coverage for release markers, status evidence, route manifests, public endpoints, security guidance, and responsive overflow.

## Truth boundaries

- `health.json` confirms the deployed static shell only.
- The status page reports evidence from the current browser session.
- Service-worker support does not guarantee offline availability for every route.
- A successful deployment does not guarantee global DNS, ISP, device, or third-party availability.
- `release.json` is the authoritative deployed-commit evidence created by GitHub Actions.
- Production is not considered verified when the release marker, deployed commit, direct routes, or linked assets do not match.

## Required merge gates

- Dependency installation
- TypeScript
- Production build
- Source-boundary validation
- Route-manifest validation
- Build-artifact validation
- Complete Playwright suite

## Required post-merge gates

- GitHub Pages deployment succeeds
- `release.json` identifies the merged commit
- `health.json` identifies `stage-b-wave4`
- Homepage and direct routes return the current React shell
- Linked JavaScript and CSS assets return HTTP 200
- Previous static homepage content is rejected

## Rollback

Follow `docs/ROLLBACK_RUNBOOK.md`. Rollback is complete only after the previous release is deployed and production verification passes against the rollback target.
