# DivyaNexus — Stage B

DivyaNexus is a source-aware Vedic knowledge, learning, and devotional reflection experience built as a static React application. The project includes responsive bilingual interfaces, source-labelled scripture reader records, a local-only study library, Ask Divya starter responses, compliant legal routes, a PWA manifest, and offline app-shell caching.

## Local development

Install dependencies and start the Vite development server:

```bash
pnpm install
pnpm dev
```

Use the following commands to validate a production build:

```bash
pnpm check
pnpm build
```

## GitHub Pages build

The project supports a repository subpath through `VITE_BASE_PATH`. For a repository published at `https://<account>.github.io/DivyaNexus/`, build it with:

```bash
VITE_BASE_PATH=/DivyaNexus/ pnpm build
```

Publish the contents of `dist/public`. The supplied `404.html` returns deep links to the app shell through `?path=…`, so client-side routes such as `/bhagavad-gita` and `/privacy` remain recoverable on GitHub Pages.

## Visual asset note

This managed project references its optimized generated imagery through its `/manus-storage/` paths. Those paths are suitable for the managed deployment environment. For a **standalone GitHub Pages** publication, upload the optimized files in `/home/ubuntu/webdev-static-assets/optimized/` to a public image host or an appropriate static-assets folder and replace the `/manus-storage/` values in `client/src/data/content.ts`, `client/index.html`, and `client/public/manifest.webmanifest`. Do not commit credentials, API keys, or user data.

## Privacy posture

Bookmarks, notes, reading history, preferences, and saved searches are stored locally in the browser for this Stage B build. The PWA service worker only caches public app-shell and visual resources; it does not cache private account data or API responses.
