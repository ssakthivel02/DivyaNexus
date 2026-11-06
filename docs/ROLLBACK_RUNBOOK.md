# DivyaNexus Rollback Runbook

## When to roll back

Use rollback when the current production release causes a material regression that cannot be corrected safely within the incident window, including:

- application shell fails to load;
- direct routes return 404 or stale HTML;
- linked JavaScript or CSS assets are unavailable;
- release markers or deployed commit evidence do not match;
- a privacy, security, or data-boundary regression is confirmed;
- critical navigation, search, scripture, deity, or legal routes are unusable.

## Safe rollback procedure

1. Identify the last verified production merge commit.
2. Create a dedicated rollback branch from current `main`.
3. Revert the faulty merge commit; do not rewrite `main` history.
4. Run the complete pull-request quality gates, including direct-route materialization.
5. Open a rollback pull request that names the faulty and target commits.
6. Merge only after TypeScript, build, static validation, and Playwright are green.
7. Watch the Pages deployment and production verification workflows.
8. Confirm `/release.json` identifies the rollback merge commit.
9. Confirm `/status`, direct routes, and linked assets are healthy.
10. Record the root cause and required forward-fix work.

## Commands

```bash
git switch main
git pull --ff-only
git switch -c rollback/divyanexus-<incident-id>
git revert -m 1 <faulty-merge-commit>
pnpm install --frozen-lockfile
pnpm run check
node scripts/validate-source-boundaries.mjs
pnpm exec tsx scripts/validate-route-manifest.ts
pnpm run build
pnpm exec tsx scripts/materialize-pages-routes.ts
node scripts/validate-build-artifact.mjs
pnpm exec playwright test
git push -u origin rollback/divyanexus-<incident-id>
```

## Do not

- force-push `main`;
- delete evidence from the failed release;
- bypass production verification because the rollback build succeeded;
- mix unrelated feature changes into the rollback;
- claim recovery before the custom domain serves the rollback release and commit evidence.

## Recovery completion

Rollback is complete when:

- the deployment workflow is green;
- production verification is green;
- the release and root markers match;
- `release.json` matches the rollback merge commit;
- critical direct routes return HTTP 200 with the current shell;
- linked assets pass;
- the incident record contains cause, impact, action, and follow-up owner.
