import { copyFile, mkdir, readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { STATIC_APP_ROUTES } from "../client/src/config/routes.ts";
import { deityRecords } from "../client/src/features/deities/index.ts";

const root = process.cwd();
const output = resolve(root, "dist/public");
const shellPath = resolve(output, "index.html");
const expectedRelease = "stage-b-wave4";

function safeOutputDirectory(route: string) {
  const segments = route
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      if (!/^[a-z0-9-]+$/i.test(segment)) throw new Error(`Unsafe route segment: ${segment}`);
      return segment;
    });

  const directory = resolve(output, ...segments);
  if (directory !== output && !directory.startsWith(`${output}${sep}`)) {
    throw new Error(`Route escaped deploy output: ${route}`);
  }
  return directory;
}

const shell = await readFile(shellPath, "utf8");
if (!shell.includes(`data-divyanexus-version="${expectedRelease}"`)) {
  throw new Error(`Build shell does not identify ${expectedRelease}`);
}

const routes = new Set<string>([
  ...STATIC_APP_ROUTES.map((route) => route.path),
  ...deityRecords.map((record) => `/deities/${record.slug}`),
]);

routes.delete("/");

for (const route of [...routes].sort()) {
  const directory = safeOutputDirectory(route);
  await mkdir(directory, { recursive: true });
  await copyFile(shellPath, resolve(directory, "index.html"));
}

console.log(`Materialized ${routes.size} GitHub Pages direct routes from the verified React shell.`);
