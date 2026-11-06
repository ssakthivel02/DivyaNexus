# DivyaNexus GitHub Pages Direct-Route Repair

Date: 28 July 2026

## Incident evidence

Production deployment for merge commit `7c96e6252128f81ef85a5349bf504a48b3be2c64` completed successfully. Release identity, deployed commit evidence, health JSON, homepage shell, JavaScript, and CSS assets all passed production verification.

The production smoke workflow then failed on the first direct application route:

```text
404 /scriptures
```

The application worked through client-side navigation, but GitHub Pages did not have a physical document at `/scriptures`, so a direct browser request returned HTTP 404 before React routing could start.

## Repair

The build now materializes a verified `index.html` shell for every static application route and every reviewed deity detail route.

Examples:

- `dist/public/scriptures/index.html`
- `dist/public/deities/index.html`
- `dist/public/deities/murugan/index.html`
- `dist/public/ask-divya/index.html`
- `dist/public/status/index.html`

Each generated file is copied from the same verified Wave 4 root shell. The build does not create alternate page content or duplicate application logic.

## Safety controls

- Route segments must contain only letters, numbers, and hyphens.
- Output paths are checked to remain inside `dist/public`.
- The source shell must contain the expected `stage-b-wave4` marker.
- Artifact validation requires critical direct-route files.
- Critical direct-route files must contain the expected release marker.
- Pull-request, deployment, and nightly workflows all execute the same materialization step.

## Expected production result

Direct requests such as `/scriptures`, `/deities/murugan`, `/privacy`, and `/status` return HTTP 200 with the current React application shell. Client-side routing then renders the requested route normally.

## Rollback

Revert the repair merge commit. The previous `404.html` redirect behaviour remains in Git history, but it should not be treated as equivalent to a successful HTTP 200 direct route.
