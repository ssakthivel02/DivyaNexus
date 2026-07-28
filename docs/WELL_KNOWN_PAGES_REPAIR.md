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

The file and `.nojekyll` both existed in `dist/public`. The GitHub Pages upload action excludes hidden files and hidden directories unless `include-hidden-files: true` is explicitly enabled. Consequently, `.nojekyll` and `.well-known/security.txt` were omitted from the deployable Pages artifact.

## Repair

The deployment workflow now configures:

```yaml
- uses: actions/upload-pages-artifact@v4
  with:
    path: ./dist/public
    include-hidden-files: true
```

This publishes the reviewed hidden assets together with the rest of the static application.

## Preventive controls

The build-artifact validator requires:

- `.nojekyll`
- `.well-known/security.txt`

The source-boundary validator also requires:

- `actions/upload-pages-artifact@v4`;
- `include-hidden-files: true`;
- the source `.nojekyll` marker;
- the source security disclosure file.

A future pull request cannot pass the source and artifact gates if the files exist locally but the deployment configuration would omit them.

## Completion criteria

- Pull-request build and Playwright checks pass.
- GitHub Pages deployment succeeds.
- `/.well-known/security.txt` returns HTTP 200.
- The endpoint contains the canonical DivyaNexus disclosure URL.
- Complete production smoke succeeds.
