import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const root = process.cwd();
const original = resolve(root, "scripts/apply-wave8-source-patches.mjs");
const fixed = resolve(root, "scripts/apply-wave8-source-patches-fixed.mjs");
const wrapper = resolve(root, "scripts/run-wave8-patcher.mjs");
const failureEvidence = resolve(root, "WAVE8_PATCH_FAILURE.txt");

let source = readFileSync(original, "utf8");
source = source
  .replaceAll('\\`${record.id}', '\\`\\${record.id}')
  .replaceAll('\\`${displayTitle}', '\\`\\${displayTitle}');

for (const workflowPath of [
  ".github/workflows/production-smoke.yml",
  ".github/workflows/pull-request-validation.yml",
  ".github/workflows/deploy-react-app.yml",
  ".github/workflows/nightly-quality.yml",
]) {
  const escaped = workflowPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const block = new RegExp(`\\n\\{\\n  const path = "${escaped}";[\\s\\S]*?\\n\\}\\n`, "m");
  source = source.replace(block, "\n");
}

source = source.replace(
  'unlinkSync(resolve(root, ".github/workflows/apply-wave8-source-patches.yml"));\n',
  "",
);

writeFileSync(fixed, source);
await import(`${pathToFileURL(fixed).href}?run=${Date.now()}`);

if (existsSync(fixed)) unlinkSync(fixed);
if (existsSync(failureEvidence)) unlinkSync(failureEvidence);
if (existsSync(wrapper)) unlinkSync(wrapper);
