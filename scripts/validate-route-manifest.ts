import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { APP_ROUTES, DIRECT_ROUTE_SAMPLES, SITEMAP_ROUTES } from "../client/src/config/routes.ts";
import { DIVYANEXUS_RELEASE } from "../client/src/config/release.ts";

const root = process.cwd();
const appSource = readFileSync(resolve(root, "client/src/App.tsx"), "utf8");
const sitemap = readFileSync(resolve(root, "client/public/sitemap.xml"), "utf8");
const failures: string[] = [];

const paths = APP_ROUTES.map((route) => route.path);
const duplicates = paths.filter((path, index) => paths.indexOf(path) !== index);
if (duplicates.length) failures.push(`Duplicate route paths: ${[...new Set(duplicates)].join(", ")}`);

for (const route of APP_ROUTES) {
  if (!appSource.includes(`path="${route.path}"`)) failures.push(`App router is missing ${route.path}`);
}

for (const route of SITEMAP_ROUTES) {
  const canonical = route.path === "/" ? `${DIVYANEXUS_RELEASE.domain}/` : `${DIVYANEXUS_RELEASE.domain}${route.path}`;
  if (!sitemap.includes(`<loc>${canonical}</loc>`)) failures.push(`Sitemap is missing ${canonical}`);
}

for (const sample of DIRECT_ROUTE_SAMPLES) {
  const canonical = `${DIVYANEXUS_RELEASE.domain}${sample}`;
  if (!sitemap.includes(`<loc>${canonical}</loc>`)) failures.push(`Sitemap is missing direct route sample ${canonical}`);
}

if (!APP_ROUTES.some((route) => route.path === "/status" && route.smoke)) {
  failures.push("/status must remain part of the production smoke contract");
}

if (failures.length) {
  console.error("Route-manifest validation failed:\n- " + failures.join("\n- "));
  process.exit(1);
}

console.log(`Route-manifest validation passed for ${APP_ROUTES.length} application routes.`);
