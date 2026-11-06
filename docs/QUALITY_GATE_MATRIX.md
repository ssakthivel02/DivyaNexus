# DivyaNexus Quality Gate Matrix

| Gate | Stage | Evidence | Failure action |
|---|---|---|---|
| Dependency integrity | Pull request | `pnpm install --frozen-lockfile` succeeds | Resolve lockfile or package mismatch |
| Type safety | Pull request and deployment | `pnpm run check` succeeds | Correct source typing; do not bypass |
| Production build | Pull request and deployment | `pnpm run build` emits `dist/public` | Correct build or base-path failure |
| Source portability | Pull request and deployment | `verify:source-boundaries` passes | Remove stale, placeholder, debug, or non-portable runtime references |
| Route consistency | Pull request and deployment | `verify:routes` passes | Reconcile router, manifest, and sitemap |
| Artifact contract | Pull request and deployment | `verify:build` passes | Restore required files, markers, bundles, or size boundaries |
| Browser regression | Pull request | Complete Playwright suite succeeds | Fix user-visible regression or incorrect test contract |
| Pages deployment | Post-merge | GitHub Pages deploy job succeeds | Inspect artifact, permissions, and Pages environment |
| Release identity | Production verification | HTML and React root markers match | Treat as stale or incorrect deployment |
| Commit identity | Production verification | `release.json` commit matches deployment head | Investigate stale artifact or wrong workflow run |
| Static health | Production verification | `health.json` matches release | Correct copied public artifact |
| Asset availability | Production verification | Linked JS and CSS return HTTP 200 | Correct asset path, base path, or deployment |
| Direct-route availability | Production verification | Smoke routes return current React shell | Correct SPA fallback or Pages routing |
| Security disclosure | Build and browser | `.well-known/security.txt` is present | Restore canonical disclosure guidance |
| Discoverability | Build and browser | canonical robots and sitemap are present | Correct crawl and sitemap configuration |
| Responsive baseline | Browser | 320px, 390px, 768px tests have no horizontal overflow | Correct layout before merge |

## Decision rule

A green build alone is not a production approval. Release approval requires all pull-request gates and all post-deployment gates applicable to the change.

## Evidence retention

- Pull-request checks remain attached to the exact head commit.
- Playwright reports and test results are retained as workflow artifacts.
- Deployment-generated `release.json` identifies the deployed commit and run.
- Incident and rollback records must reference exact commits and workflow runs.
