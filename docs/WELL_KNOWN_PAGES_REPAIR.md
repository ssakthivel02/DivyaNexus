# GitHub Pages Well-Known Endpoint Repair

Date: 28 July 2026

## Evidence

Editorial Depth Wave 5 deployed successfully to commit `45783b9eee59645df45b88aa1b8c24cb2f7a9f48`.

Production verification passed:

- release and deployed commit identity;
- health JSON;
- linked JavaScript and CSS assets;
- direct application routes, including `/collection-status`;
- robots and sitemap retrieval.

The final operational endpoint check failed because production returned:

```text
404 /.well-known/security.txt
```

The source files and build output contained both `.nojekyll` and `.well-known/security.txt`. A later deployment also configured `include-hidden-files: true`, but inspection of the actual `github-pages` workflow artifact still showed that both hidden paths were absent. Therefore the previous setting was not accepted as sufficient production evidence.

## Deterministic repair

The deployment now packages the exact contents of `dist/public` into the Pages-compatible `artifact.tar` itself:

```bash
tar \
  --dereference \
  --hard-dereference \
  --directory dist/public \
  -cvf "$RUNNER_TEMP/artifact.tar" \
  .
```

Before upload, the workflow inspects the tar index and requires:

```text
./.nojekyll
./.well-known/security.txt
./collection-status/index.html
./release.json
```

The verified tar is then uploaded as the workflow artifact named `github-pages` through `actions/upload-artifact@v4`. GitHub Pages deploys that exact tar instead of asking another action to discover the directory contents.

## Preventive controls

The build-artifact validator requires:

- `.nojekyll`;
- `.well-known/security.txt`;
- critical direct-route shells, including `/collection-status`;
- the expected release markers.

The source-boundary validator requires:

- deterministic tar creation from `dist/public`;
- tar-index checks for `.nojekyll` and `.well-known/security.txt`;
- upload through `actions/upload-artifact@v4`;
- artifact name `github-pages`;
- artifact path `${{ runner.temp }}/artifact.tar`;
- absence of `actions/upload-pages-artifact`, preventing a return to unverified hidden-file filtering.

A pull request cannot pass the source gate when the packaging workflow does not prove that the operational hidden files are inside the exact deployable tar.

## Completion criteria

- Pull-request static validation succeeds.
- Complete Playwright browser validation succeeds.
- GitHub Pages build and deployment succeed.
- The downloaded `github-pages` artifact contains both hidden paths.
- `/.well-known/security.txt` returns HTTP 200.
- The endpoint contains the canonical DivyaNexus disclosure URL.
- Complete production smoke succeeds.
