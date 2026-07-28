import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = resolve(process.cwd());
const scanRoots = [resolve(root, "client/src"), resolve(root, "client/public")];
const indexPath = resolve(root, "client/index.html");
const deploymentWorkflowPath = resolve(root, ".github/workflows/deploy-react-app.yml");
const expectedRelease = "stage-b-wave4";
const forbiddenPatterns = [
  "manus-storage",
  "__manus__",
  "BUILT_IN_FORGE",
  "filebin.net",
  "%VITE_ANALYTICS_",
  "Ancient Wisdom. Modern Intelligence.",
];

function collectFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? collectFiles(path) : [path];
  });
}

const failures = [];
for (const file of scanRoots.flatMap(collectFiles)) {
  if (!/\.(?:html|js|mjs|cjs|jsx|ts|tsx|css|json|xml|txt|webmanifest)$/i.test(file)) continue;
  const content = readFileSync(file, "utf8");
  for (const pattern of forbiddenPatterns) {
    if (content.includes(pattern)) failures.push(`${relative(root, file)} contains forbidden production marker: ${pattern}`);
  }
}

if (!existsSync(indexPath)) failures.push("client/index.html is missing");
else {
  const index = readFileSync(indexPath, "utf8");
  if (!index.includes(`meta name="divyanexus-release" content="${expectedRelease}"`)) {
    failures.push(`client/index.html does not declare release ${expectedRelease}`);
  }
  if (!index.includes(`data-divyanexus-version="${expectedRelease}"`)) {
    failures.push(`client/index.html does not expose root release ${expectedRelease}`);
  }
}

if (!existsSync(deploymentWorkflowPath)) failures.push("Pages deployment workflow is missing");
else {
  const workflow = readFileSync(deploymentWorkflowPath, "utf8");
  if (!workflow.includes("uses: actions/upload-pages-artifact@v4")) {
    failures.push("Pages deployment must use actions/upload-pages-artifact@v4");
  }
  if (!workflow.includes("include-hidden-files: true")) {
    failures.push("Pages deployment must include hidden files so .nojekyll and .well-known are published");
  }
}

if (existsSync(resolve(root, "client/public/__manus__"))) failures.push("client/public/__manus__ must not exist");
if (!existsSync(resolve(root, "client/public/.nojekyll"))) failures.push("client/public/.nojekyll must exist");
if (!existsSync(resolve(root, "client/public/.well-known/security.txt"))) failures.push("client/public/.well-known/security.txt must exist");

if (failures.length) {
  console.error("Source-boundary validation failed:\n- " + failures.join("\n- "));
  process.exit(1);
}

console.log(`Source-boundary validation passed for ${expectedRelease}.`);
