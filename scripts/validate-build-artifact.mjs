import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = resolve(process.cwd());
const output = resolve(root, "dist/public");
const expectedRelease = "stage-b-wave8";
const requiredFiles = [
  "index.html", "manifest.webmanifest", "sw.js", "offline.html", "health.json", "robots.txt", "sitemap.xml", ".nojekyll", ".well-known/security.txt",
  "assets/divyanexus/owner-selected-vision.webp", "scriptures/index.html", "rig-veda/index.html", "bhagavad-gita/index.html", "audio/index.html",
  "deities/index.html", "deities/murugan/index.html", "ask-divya/index.html", "life-guidance/index.html", "collection-status/index.html",
  "library/index.html", "sources/index.html", "privacy/index.html", "status/index.html",
];
const directRouteShells = requiredFiles.filter((file) => file.endsWith("/index.html"));
const forbiddenPatterns = ["manus-storage", "__manus__", "BUILT_IN_FORGE", "filebin.net", "%VITE_ANALYTICS_", "Ancient Wisdom. Modern Intelligence."];
const unresolvedPlaceholderPatterns = [/%BASE_URL%/, /%PUBLIC_URL%/, /%VITE_[A-Z0-9_]+%/];
const failures = [];

if (!existsSync(output)) failures.push("dist/public does not exist; run pnpm run build first");
for (const file of requiredFiles) if (!existsSync(resolve(output, file))) failures.push(`Missing deployable file: ${file}`);

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
  for (const pattern of forbiddenPatterns) if (content.includes(pattern)) failures.push(`${relative(output, file)} contains forbidden production marker: ${pattern}`);
  for (const pattern of unresolvedPlaceholderPatterns) if (pattern.test(content)) failures.push(`${relative(output, file)} contains unresolved build placeholder ${pattern}`);
}

const indexPath = resolve(output, "index.html");
if (existsSync(indexPath)) {
  const index = readFileSync(indexPath, "utf8");
  if (!index.includes(`content="${expectedRelease}"`)) failures.push(`index.html does not declare ${expectedRelease}`);
  if (!index.includes(`data-divyanexus-version="${expectedRelease}"`)) failures.push(`index.html root marker does not declare ${expectedRelease}`);
}

const healthPath = resolve(output, "health.json");
if (existsSync(healthPath) && !readFileSync(healthPath, "utf8").includes(`"release": "${expectedRelease}"`)) failures.push(`health.json does not declare ${expectedRelease}`);

for (const file of directRouteShells) {
  const path = resolve(output, file);
  if (!existsSync(path)) continue;
  const content = readFileSync(path, "utf8");
  if (!content.includes(`data-divyanexus-version="${expectedRelease}"`)) failures.push(`${file} is not the verified ${expectedRelease} application shell`);
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
