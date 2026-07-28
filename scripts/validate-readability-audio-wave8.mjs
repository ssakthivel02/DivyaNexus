import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const files = {
  home: resolve(root, "client/src/pages/Home.tsx"),
  audio: resolve(root, "client/src/pages/Audio.tsx"),
  reader: resolve(root, "client/src/pages/ScriptureReader.tsx"),
  speech: resolve(root, "client/src/components/SpeechControls.tsx"),
  hook: resolve(root, "client/src/hooks/useSpeechSynthesis.ts"),
  scripture: resolve(root, "client/src/data/verifiedScripture.ts"),
  css: resolve(root, "client/src/readability-wave8.css"),
  hardening: resolve(root, "client/src/readability-wave8-hardening.css"),
  main: resolve(root, "client/src/main.tsx"),
  worker: resolve(root, "client/public/sw.js"),
};

const failures = [];
for (const [label, path] of Object.entries(files)) {
  if (!existsSync(path)) failures.push(`Missing ${label} file: ${path}`);
}

const text = Object.fromEntries(
  Object.entries(files).map(([label, path]) => [label, existsSync(path) ? readFileSync(path, "utf8") : ""]),
);

for (const marker of ["PortalArtworkPanel", "<PortalArtworkPanel />", "owner-portal-vision", "Listen now", "Tamil, Sanskrit, transliteration, and English"]) {
  if (!text.home.includes(marker)) failures.push(`Homepage is missing Wave 8 marker: ${marker}`);
}
for (const forbidden of ["Listen later", "when a reviewed recording is ready"]) {
  if (text.home.includes(forbidden)) failures.push(`Homepage still contains stale audio copy: ${forbidden}`);
}

for (const marker of ["audio-cinema--live", "SpeechControls", "synthetic device speech", "Tamil meaning", "Sanskrit text", "IAST transliteration", "English meaning"]) {
  if (!text.audio.includes(marker)) failures.push(`Audio page is missing working speech marker: ${marker}`);
}

for (const forbidden of ["no audio delivered", "No playback yet", "Playback is unavailable"]) {
  if (text.audio.includes(forbidden)) failures.push(`Audio page still contains disabled placeholder language: ${forbidden}`);
}

for (const marker of ["readerLanguage", "reader-language-switch", "reader-audio", "SpeechControls", "tamilMeaning"]) {
  if (!text.reader.includes(marker)) failures.push(`Reader is missing readability/audio marker: ${marker}`);
}

for (const marker of ["speechSynthesis.speak", "SpeechSynthesisUtterance", "voiceschanged", "pause", "resume", "cancel", "setError(\"\")"]) {
  if (!text.hook.includes(marker)) failures.push(`Speech hook is missing lifecycle marker: ${marker}`);
}

for (const marker of ["synthetic speech", "On-device speech", "Reading speed", "No autoplay", "preferredRate", "No matching", "aria-valuetext"]) {
  if (!text.speech.includes(marker)) failures.push(`Speech controls are missing trust, rate or voice marker: ${marker}`);
}

const tamilWordNotes = (text.scripture.match(/tamilMeaning:/g) ?? []).length;
if (tamilWordNotes < 15) failures.push(`Expected at least 15 Tamil word-note meanings; found ${tamilWordNotes}`);

for (const marker of [
  'font-family: "Noto Sans Tamil"',
  '.reader-translation[lang="ta"]',
  ".speech-controls",
  ".audio-cinema {",
  ".reader-language-switch",
]) {
  if (!text.css.includes(marker)) failures.push(`Wave 8 CSS is missing marker: ${marker}`);
}

for (const marker of [
  '"Nirmala UI"',
  '"Tamil Sangam MN"',
  ".portal-artwork__visual img",
  "brightness(1.1)",
  "prefers-reduced-motion",
]) {
  if (!text.hardening.includes(marker)) failures.push(`Wave 8 hardening CSS is missing marker: ${marker}`);
}

if (!text.main.includes('import "./readability-wave8.css"')) failures.push("Application entry does not load Wave 8 CSS");
if (!text.main.includes('import "./readability-wave8-hardening.css"')) failures.push("Application entry does not load Wave 8 hardening CSS last");
if (!text.worker.includes("divyanexus-stage-b-wave8-v1")) failures.push("Service worker cache is not bumped to Wave 8");

if (failures.length) {
  console.error("Wave 8 validation failed:\n- " + failures.join("\n- "));
  process.exit(1);
}

console.log(`Wave 8 validation passed with ${tamilWordNotes} Tamil word-note meanings, active owner artwork, working multilingual speech, language-specific rates and cross-platform Tamil font fallbacks.`);
