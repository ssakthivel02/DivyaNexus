import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const files = {
  app: resolve(root, "client/src/App.tsx"),
  home: resolve(root, "client/src/pages/Home.tsx"),
  audio: resolve(root, "client/src/pages/Audio.tsx"),
  reader: resolve(root, "client/src/pages/ScriptureReader.tsx"),
  speech: resolve(root, "client/src/components/SpeechControls.tsx"),
  hook: resolve(root, "client/src/hooks/useSpeechSynthesis.ts"),
  artwork: resolve(root, "client/src/components/PortalArtworkPanel.tsx"),
  scripture: resolve(root, "client/src/data/verifiedScripture.ts"),
  css: resolve(root, "client/src/readability-audio-wave8.css"),
  main: resolve(root, "client/src/main.tsx"),
  worker: resolve(root, "client/public/sw.js"),
};
const failures = [];
for (const [label, path] of Object.entries(files)) if (!existsSync(path)) failures.push(`Missing ${label}: ${path}`);
const text = Object.fromEntries(Object.entries(files).map(([label, path]) => [label, existsSync(path) ? readFileSync(path, "utf8") : ""]));

for (const marker of ["PortalArtworkPanel", "<PortalArtworkPanel />", "owner-portal-vision", "Listen now", "Tamil, Sanskrit, transliteration, and English", 'data-home-wave="8"']) {
  if (!text.home.includes(marker)) failures.push(`Homepage is missing Wave 8 marker: ${marker}`);
}
for (const forbidden of ["Listen later", "when a reviewed recording is ready"]) if (text.home.includes(forbidden)) failures.push(`Homepage contains stale audio copy: ${forbidden}`);
if (text.app.includes("PortalArtworkPanel")) failures.push("App shell must not duplicate the homepage owner artwork panel");

for (const marker of ["audio-cinema--live", "SpeechControls", "synthetic device speech", "Tamil meaning", "Sanskrit text", "IAST transliteration", "English meaning", 'route: "/bhagavad-gita"']) {
  if (!text.audio.includes(marker)) failures.push(`Audio page is missing marker: ${marker}`);
}
for (const forbidden of ["no audio delivered", "No playback yet", "Playback is unavailable"]) if (text.audio.includes(forbidden)) failures.push(`Audio page contains disabled placeholder language: ${forbidden}`);
if (/<(?:audio|video)\b[^>]*\bautoplay\b/i.test(text.audio) || /\.autoplay\s*=/.test(text.audio)) failures.push("Audio page must not implement autoplay");

for (const marker of ["readerLanguage", "reader-language-switch", "reader-audio", "SpeechControls", "tamilMeaning", "Tamil + English", "தமிழ் மட்டும்", "English only", "1.45"]) {
  if (!text.reader.includes(marker)) failures.push(`Reader is missing marker: ${marker}`);
}
for (const marker of ["speechSynthesis.speak", "SpeechSynthesisUtterance", "voiceschanged", "pause", "resume", "cancel", "setError(\"\")"]) {
  if (!text.hook.includes(marker)) failures.push(`Speech hook is missing lifecycle marker: ${marker}`);
}
for (const marker of ["synthetic speech", "On-device speech", "Reading speed", "No autoplay", "preferredRate", "No matching", "aria-valuetext"]) {
  if (!text.speech.includes(marker)) failures.push(`Speech controls are missing marker: ${marker}`);
}

const tamilWordNotes = (text.scripture.match(/tamilMeaning:/g) ?? []).length;
if (tamilWordNotes < 15) failures.push(`Expected at least 15 Tamil word-note meanings; found ${tamilWordNotes}`);

for (const marker of [
  'font-family: "Noto Sans Tamil"', '"Nirmala UI"', '"Tamil Sangam MN"', '.reader-translation[lang="ta"]',
  ".reader-language-switch", ".speech-controls", ".audio-cinema--live", ".portal-artwork__visual img",
  "brightness(1.1)", "prefers-reduced-motion", "prefers-contrast: more",
]) if (!text.css.includes(marker)) failures.push(`Wave 8 CSS is missing marker: ${marker}`);

for (const marker of ['id="owner-portal-vision"', 'loading="eager"', 'fetchPriority="high"', "fallbackPath"]) {
  if (!text.artwork.includes(marker)) failures.push(`Owner artwork component is missing marker: ${marker}`);
}
if (!text.main.includes('import "./readability-audio-wave8.css"')) failures.push("Wave 8 CSS is not loaded by the application entry");
if (!text.worker.includes("divyanexus-stage-b-wave8-v1")) failures.push("Service worker cache is not Wave 8");

if (failures.length) {
  console.error("Readability/audio validation failed:\n- " + failures.join("\n- "));
  process.exit(1);
}
console.log(`Readability/audio validation passed: visible owner artwork, brighter surfaces, ${tamilWordNotes} Tamil word-note meanings, multilingual speech, transcripts, language modes and no autoplay.`);
