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

The final operational endpoint check failed because GitHub Pages returned:

```text
404 /.well-known/security.txt
```

The file existed in the built artifact, but Pages applied Jekyll-style filtering to the dot-prefixed `.well-known` directory.

## Repair

`client/public/.nojekyll` is now included in the deployed artifact. This instructs GitHub Pages to publish the static artifact without Jekyll filtering, allowing `.well-known/security.txt` to remain available.

## Preventive control

The build-artifact validator now requires both:

- `.nojekyll`
- `.well-known/security.txt`

A future build cannot pass the deployable-artifact gate when either file is missing.

## Completion criteria

- Pull-request build and Playwright checks pass.
- GitHub Pages deployment succeeds.
- `/.well-known/security.txt` returns HTTP 200.
- The endpoint contains the canonical DivyaNexus disclosure URL.
- Complete production smoke succeeds.
