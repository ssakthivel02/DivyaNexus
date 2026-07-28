import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = resolve(root, "client/public");
const manifestPath = resolve(publicRoot, "manifest.webmanifest");
const serviceWorkerPath = resolve(publicRoot, "sw.js");
const offlinePath = resolve(publicRoot, "offline.html");
const mainPath = resolve(root, "client/src/main.tsx");
const failures = [];

for (const path of [manifestPath, serviceWorkerPath, offlinePath, mainPath]) {
  if (!existsSync(path)) failures.push(`Missing required PWA file: ${path}`);
}

let manifest;
try {
  manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
} catch (error) {
  failures.push(`manifest.webmanifest is not valid JSON: ${error instanceof Error ? error.message : error}`);
}

if (manifest) {
  for (const field of ["id", "name", "short_name", "description", "start_url", "scope", "display", "background_color", "theme_color"]) {
    if (!manifest[field]) failures.push(`manifest.webmanifest is missing ${field}`);
  }
  if (!Array.isArray(manifest.icons) || manifest.icons.length < 2) failures.push("manifest.webmanifest must expose at least two icons");
  if (!Array.isArray(manifest.shortcuts) || manifest.shortcuts.length < 4) failures.push("manifest.webmanifest must expose at least four useful shortcuts");
  for (const icon of manifest.icons ?? []) {
    const src = String(icon.src ?? "").replace(/^\.\//, "");
    if (!src || !existsSync(resolve(publicRoot, src))) failures.push(`Manifest icon is missing from public assets: ${icon.src}`);
  }
  const shortcutUrls = new Set((manifest.shortcuts ?? []).map((shortcut) => shortcut.url));
  for (const required of ["./search", "./ask-divya", "./scriptures", "./library"]) {
    if (!shortcutUrls.has(required)) failures.push(`Manifest shortcut is missing ${required}`);
  }
}

if (existsSync(serviceWorkerPath)) {
  const serviceWorker = readFileSync(serviceWorkerPath, "utf8");
  for (const marker of ["divyanexus-stage-b-wave8-v1", "owner-selected-vision.webp", "offline.html", "SKIP_WAITING", "request.mode === \"navigate\""]) {
    if (!serviceWorker.includes(marker)) failures.push(`Service worker is missing reliability marker: ${marker}`);
  }
  if (serviceWorker.includes("api-divyanexus") || serviceWorker.includes("/api/")) {
    failures.push("Service worker must not cache API or account traffic");
  }
}

if (existsSync(offlinePath)) {
  const offline = readFileSync(offlinePath, "utf8");
  for (const marker of ["Offline — DivyaNexus", "noindex,nofollow", "This path is not cached yet."]) {
    if (!offline.includes(marker)) failures.push(`Offline fallback is missing expected marker: ${marker}`);
  }
}

if (existsSync(mainPath)) {
  const main = readFileSync(mainPath, "utf8");
  if (!main.includes("navigator.serviceWorker.register")) failures.push("Application entry does not register the service worker");
  if (!main.includes("divyanexusUpdate")) failures.push("Application entry does not expose service-worker update evidence");
}

if (failures.length) {
  console.error("PWA validation failed:\n- " + failures.join("\n- "));
  process.exit(1);
}

console.log(`PWA validation passed with ${manifest.icons.length} icons and ${manifest.shortcuts.length} shortcuts.`);
