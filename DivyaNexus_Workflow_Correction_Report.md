# DivyaNexus Workflow Correction Report

## Corrected facts

- Package manager: `pnpm 10.4.1`
- Node.js: `22`
- TypeScript command: `pnpm run check`
- Production build command: `pnpm run build`
- Frontend Pages artifact: `dist/public`
- Custom domain: `divyanexus.omsaravanabhava.org`

## Files corrected

- `.github/workflows/deploy-react-app.yml`
- `.github/workflows/production-smoke.yml`

## File added

- `.github/workflows/pull-request-validation.yml`

## Important limitations

- No clean dependency installation or production build was run in this offline environment.
- The project has no confirmed `lint` or automated `test` script in `package.json`; the workflows therefore do not claim lint/test success.
- `deploy-worker.yml` was left unchanged. The website source archive does not contain the `worker/` directory, so existing Worker source in GitHub must be preserved when the archive is overlaid onto the repository.
- Import this archive into a branch created from the existing GitHub `main` branch. Do not replace or erase the entire repository working tree before preserving `worker/`, `docs/`, and other production infrastructure already in GitHub.
