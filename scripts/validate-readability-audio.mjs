import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const css = readFileSync(resolve(root, "client/src/readability-audio-wave8.css"), "utf8");
const main = readFileSync(resolve(root, "client/src/main.tsx"), "utf8");
const audio = readFileSync(resolve(root, "client/src/pages/Audio.tsx"), "utf8");
const failures = [];

for (const marker of [
  'content: url("/assets/divyanexus/owner-selected-vision.webp")',
  '[lang="ta"]',
  'font-size: max(1rem, 16px)',
  ".audio-wave8__play",
  ".audio-wave8__transcript",
  "prefers-reduced-motion",
]) {
  if (!css.includes(marker)) failures.push(`Wave 8 CSS is missing ${marker}`);
}

if (!main.includes('import "./readability-audio-wave8.css"')) failures.push("Wave 8 CSS is not loaded by the application entry");

for (const marker of [
  "SpeechSynthesisUtterance",
  "window.speechSynthesis.speak",
  'utterance.lang = speechLanguage',
  'role="status"',
  'type="range"',
  "browser-generated speech",
  "not a reviewed human pronunciation recording",
]) {
  if (!audio.includes(marker)) failures.push(`Audio page is missing ${marker}`);
}

if (audio.includes("autoplay")) failures.push("Audio page must not introduce autoplay");
if (!audio.includes('speechLanguage === "ta-IN"')) failures.push("Tamil browser speech is not explicit");
if (!audio.includes('speechLanguage === "en-GB"')) failures.push("English browser speech is not explicit");

if (failures.length) {
  console.error("Readability/audio validation failed:\n- " + failures.join("\n- "));
  process.exit(1);
}

console.log("Readability/audio validation passed: owner hero promotion, Tamil legibility, transparent bilingual browser speech, transcript and no-autoplay controls.");
