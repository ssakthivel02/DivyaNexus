import { APP_ROUTES, DIRECT_ROUTE_SAMPLES, SITEMAP_ROUTES } from "../client/src/config/routes.ts";
import { canonicalForLocation, resolveRouteMeta, routeMetaByPath } from "../client/src/config/routeMeta.ts";
import { DIVYANEXUS_RELEASE } from "../client/src/config/release.ts";

const failures: string[] = [];
const staticRoutes = APP_ROUTES.filter((route) => !route.dynamic);

for (const route of staticRoutes) {
  const meta = routeMetaByPath[route.path];
  if (!meta) {
    failures.push(`Missing metadata for ${route.path}`);
    continue;
  }
  if (!meta.title.includes("DivyaNexus")) failures.push(`${route.path} title must include DivyaNexus`);
  if (meta.description.length < 40 || meta.description.length > 220) {
    failures.push(`${route.path} description length ${meta.description.length} is outside 40–220 characters`);
  }
  if (!meta.label.trim()) failures.push(`${route.path} is missing an announcement label`);
  if (!meta.schemaType) failures.push(`${route.path} is missing a schema type`);
}

for (const route of SITEMAP_ROUTES) {
  const meta = routeMetaByPath[route.path];
  if (meta?.robots?.startsWith("noindex")) failures.push(`Sitemap route ${route.path} must remain indexable`);
  const canonical = canonicalForLocation(route.path);
  if (!canonical.startsWith(DIVYANEXUS_RELEASE.domain)) failures.push(`${route.path} canonical is outside the production domain`);
}

for (const alias of ["/ask", "/guidance"]) {
  if (routeMetaByPath[alias]?.robots !== "noindex,follow") failures.push(`${alias} alias must be noindex,follow`);
}

const indexedTitles = SITEMAP_ROUTES.map((route) => routeMetaByPath[route.path]?.title).filter(Boolean);
const duplicateTitles = indexedTitles.filter((title, index) => indexedTitles.indexOf(title) !== index);
if (duplicateTitles.length) failures.push(`Indexed route titles must be unique: ${[...new Set(duplicateTitles)].join(", ")}`);

for (const sample of DIRECT_ROUTE_SAMPLES) {
  const meta = resolveRouteMeta(sample);
  if (!meta.title.includes("DivyaNexus") || meta.label === "Page not found") {
    failures.push(`Dynamic route metadata did not resolve for ${sample}`);
  }
}

if (failures.length) {
  console.error("Route metadata validation failed:\n- " + failures.join("\n- "));
  process.exit(1);
}

console.log(`Route metadata validation passed for ${staticRoutes.length} static routes and ${DIRECT_ROUTE_SAMPLES.length} dynamic samples.`);
