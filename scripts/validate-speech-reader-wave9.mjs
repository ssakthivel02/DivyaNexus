import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const files = {
  hook: resolve(root, "client/src/hooks/useSpeechSynthesis.ts"),
  controls: resolve(root, "client/src/components/SpeechControls.tsx"),
  preferences: resolve(root, "client/src/lib/speechPreferences.ts"),
  library: resolve(root, "client/src/lib/localLibrary.ts"),
  audio: resolve(root, "client/src/pages/Audio.tsx"),
  reader: resolve(root, "client/src/pages/ScriptureReader.tsx"),
  scripture: resolve(root, "client/src/data/verifiedScripture.ts"),
  css: resolve(root, "client/src/speech-reader-wave9.css"),
  main: resolve(root, "client/src/main.tsx"),
  unit: resolve(root, "tests/unit/speechPreferences.test.ts"),
  browser: resolve(root, "tests/e2e/speech-reader-wave9.spec.ts"),
  package: resolve(root, "package.json"),
};

const failures = [];
for (const [label, path] of Object.entries(files)) {
  if (!existsSync(path)) failures.push(`Missing Wave 9 ${label} file: ${path}`);
}
const text = Object.fromEntries(Object.entries(files).map(([label, path]) => [label, existsSync(path) ? readFileSync(path, "utf8") : ""]));

for (const state of ["unsupported", "loading", "ready", "speaking", "paused", "stopped", "ended", "error"]) {
  if (!text.hook.includes(`\"${state}\"`)) failures.push(`Speech hook is missing explicit state: ${state}`);
}
for (const marker of ["voiceschanged", "generationRef", "lastStartRef", "voiceURI", "selectSpeechVoice", "speechSynthesis.cancel", "onpause", "onresume", "onend", "onerror"]) {
  if (!text.hook.includes(marker)) failures.push(`Speech hook is missing lifecycle control: ${marker}`);
}

for (const marker of ["readSpeechPreferences", "writeSpeechPreferences", "Device voice", "Automatic matching voice", "speech-controls__unsupported", "aria-atomic", "aria-busy", "No autoplay", "visible transcript"]) {
  if (!text.controls.includes(marker)) failures.push(`Speech controls are missing Wave 9 marker: ${marker}`);
}
for (const marker of ["SPEECH_PREFERENCES_VERSION", "sanitiseSpeechPreferences", "clampSpeechRate", "ta-IN", "en-GB", "sa-IN"]) {
  if (!text.preferences.includes(marker)) failures.push(`Speech preference schema is missing marker: ${marker}`);
}

for (const marker of ["aria-orientation=\"vertical\"", "tabIndex={activeRoom === room.id ? 0 : -1}", "ArrowRight", "ArrowLeft", "Home", "End", "role=\"tabpanel\"", "aria-labelledby"]) {
  if (!text.audio.includes(marker)) failures.push(`Audio tablist is missing keyboard/accessibility marker: ${marker}`);
}
for (const marker of ["readReaderLanguage", "readerLanguage", "setPreference(\"readerLanguage\"", "history.replaceState", "data-reader-language", "aria-current"]) {
  if (!text.reader.includes(marker)) failures.push(`Reader is missing persistence/navigation marker: ${marker}`);
}
for (const marker of ["SPEECH_PREFERENCES_STORAGE_KEY", "speechPreferences: readSpeechPreferences()", "readerLanguage", "version: 2"]) {
  if (!text.library.includes(marker)) failures.push(`Local-data lifecycle is missing marker: ${marker}`);
}

const tamilWordNotes = (text.scripture.match(/tamilMeaning:/g) ?? []).length;
if (tamilWordNotes < 16) failures.push(`Every current verified word note needs Tamil meaning; found ${tamilWordNotes}, expected at least 16`);

for (const marker of ["speech-controls__voice-select", "speech-controls__unsupported", "data-speech-state", "prefers-reduced-motion", "audio-cinema__waves span"]) {
  if (!text.css.includes(marker)) failures.push(`Wave 9 CSS is missing marker: ${marker}`);
}
if (!text.main.includes('import "./speech-reader-wave9.css"')) failures.push("Wave 9 CSS is not loaded by main.tsx");
if (!text.package.includes('"test:unit": "vitest run tests/unit"')) failures.push("package.json is missing the deterministic unit test command");
for (const marker of ["rejects unknown schema versions", "clamps rates", "normalises finite rates"]) {
  if (!text.unit.includes(marker)) failures.push(`Unit tests are missing case: ${marker}`);
}

const runtimeSources = [text.audio, text.controls, text.hook].join("\n");
if (/<(?:audio|video)\b[^>]*\bautoplay\b/i.test(runtimeSources) || /\.autoplay\s*=/.test(runtimeSources)) {
  failures.push("Wave 9 must not implement autoplay");
}
if (/reviewed human recitation[^\n]{0,40}(?:is|as)\s+(?:available|provided)/i.test(runtimeSources)) {
  failures.push("Wave 9 contains a misleading reviewed-recitation availability claim");
}

if (failures.length) {
  console.error("Speech/reader Wave 9 validation failed:\n- " + failures.join("\n- "));
  process.exit(1);
}

console.log(`Speech/reader Wave 9 validation passed: 30 controls, ${tamilWordNotes} Tamil word-note meanings, no autoplay, keyboard tablist, validated preferences and explicit speech lifecycle states.`);
