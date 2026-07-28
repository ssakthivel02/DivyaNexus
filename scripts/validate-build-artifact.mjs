import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = resolve(process.cwd());
const output = resolve(root, "dist/public");
const expectedRelease = "stage-b-wave4";
const requiredFiles = [
  "index.html",
  "manifest.webmanifest",
  "sw.js",
  "health.json",
  "robots.txt",
  "sitemap.xml",
  ".well-known/security.txt",
];
const forbiddenPatterns = ["manus-storage", "__manus__", "BUILT_IN_FORGE", "filebin.net", "%VITE_ANALYTICS_", "Ancient Wisdom. Modern Intelligence."];
const failures = [];

if (!existsSync(output)) failures.push("dist/public does not exist; run pnpm run build first");

for (const file of requiredFiles) {
  if (!existsSync(resolve(output, file))) failures.push(`Missing deployable file: ${file}`);
}

function collectFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? collectFiles(path) : [path];
  });
}

const files = collectFiles(output);
const textFiles = files.filter((file) => /\.(?:html|js|mjs|cjs|css|json|xml|txt|webmanifest)$/i.test(file));
for (const file of textFiles) {
  const content = readFileSync(file, "utf8");
  for (const pattern of forbiddenPatterns) {
    if (content.includes(pattern)) failures.push(`${relative(output, file)} contains forbidden production marker: ${pattern}`);
  }
  if (/%[A-Z0-9_]+%/.test(content)) failures.push(`${relative(output, file)} contains an unresolved build placeholder`);
}

const indexPath = resolve(output, "index.html");
if (existsSync(indexPath)) {
  const index = readFileSync(indexPath, "utf8");
  if (!index.includes(`content="${expectedRelease}"`)) failures.push(`index.html does not declare ${expectedRelease}`);
  if (!index.includes(`data-divyanexus-version="${expectedRelease}"`)) failures.push(`index.html root marker does not declare ${expectedRelease}`);
}

const scripts = files.filter((file) => /\.(?:js|mjs)$/i.test(file));
const styles = files.filter((file) => /\.css$/i.test(file));
if (!scripts.length) failures.push("No JavaScript bundle was emitted");
if (!styles.length) failures.push("No CSS bundle was emitted");

for (const file of [...scripts, ...styles]) {
  const size = statSync(file).size;
  if (size > 2_500_000) failures.push(`${relative(output, file)} exceeds the 2.5 MB per-file budget (${size} bytes)`);
}

if (failures.length) {
  console.error("Build-artifact validation failed:\n- " + failures.join("\n- "));
  process.exit(1);
}

const totalBytes = files.reduce((total, file) => total + statSync(file).size, 0);
console.log(`Build-artifact validation passed: ${files.length} files, ${totalBytes} bytes, release ${expectedRelease}.`);
