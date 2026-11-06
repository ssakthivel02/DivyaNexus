# DivyaNexus Production Runbook

## Release owner checklist

1. Confirm the pull request targets `main` and contains no unrelated project changes.
2. Confirm TypeScript, production build, static quality gates, and Playwright are green.
3. Confirm the release identifier in `client/src/config/release.ts`, `client/index.html`, `health.json`, and production-smoke workflow is identical.
4. Confirm critical direct routes exist as materialized `dist/public/<route>/index.html` shells.
5. Merge only the validated head commit.
6. Watch **Deploy DivyaNexus React App** until both build and deploy jobs succeed.
7. Watch **Verify DivyaNexus Production** until release, commit, assets, health, and direct-route checks succeed.
8. Open `/status` and compare the HTML marker, React marker, and declared release.
9. Verify `/release.json` contains the merged commit SHA.
10. Record the merge commit, deployment run, verification run, and completion time.

## Pre-merge commands

```bash
pnpm install --frozen-lockfile
pnpm run check
node scripts/validate-source-boundaries.mjs
pnpm exec tsx scripts/validate-route-manifest.ts
pnpm run build
pnpm exec tsx scripts/materialize-pages-routes.ts
node scripts/validate-build-artifact.mjs
pnpm exec playwright test
```

## Production evidence

The minimum evidence set is:

- `/` returns the current React shell.
- `/health.json` returns `status: ok` and the expected release.
- `/release.json` returns the expected release and merged commit.
- `/status` loads and reports matching release markers.
- Direct routes return HTTP 200 and the current React shell.
- Linked JavaScript and CSS assets return HTTP 200.
- The previous static homepage marker is absent.

## Direct-route sample

- `/scriptures`
- `/deities`
- `/deities/murugan`
- `/ask-divya`
- `/life-guidance`
- `/library`
- `/sources`
- `/privacy`
- `/status`

## Failure handling

Do not repeatedly merge new content into an unverified deployment. Classify the failure first:

- Build or type failure: fix source and rerun pull-request validation.
- Pages deployment failure: inspect the deployment job and artifact.
- Release mismatch: inspect `release.json`, the deployed HTML marker, and cache behaviour.
- Direct-route HTTP 404: confirm route materialization ran and inspect `dist/public/<route>/index.html`.
- Direct-route wrong content: compare its release marker with the root shell.
- Asset failure: inspect the emitted path, base path, and Pages artifact.
- DNS or TLS failure: validate the custom-domain configuration separately from the application build.

## Completion rule

A merged commit is not a completed release until post-deployment verification is green.
