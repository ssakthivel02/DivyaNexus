import { APP_ROUTES } from "../client/src/config/routes.ts";
import { editorialCollections, editorialRecords, getEditorialCoverage } from "../client/src/data/editorial/index.ts";
import { ownerSelectedArtwork } from "../client/src/data/portalArtwork.ts";

const failures: string[] = [];
const ids = new Set<string>();
const routes = new Set(APP_ROUTES.map((route) => route.path));
const collectionNames = new Set(editorialCollections.map((collection) => collection.collection));
const tamilPattern = /[\u0B80-\u0BFF]/;

for (const record of editorialRecords) {
  if (ids.has(record.id)) failures.push(`Duplicate editorial record id: ${record.id}`);
  ids.add(record.id);

  if (!/^[a-z0-9-]+$/.test(record.id)) failures.push(`Unsafe editorial record id: ${record.id}`);
  if (!collectionNames.has(record.collection)) failures.push(`${record.id} uses unknown collection ${record.collection}`);
  if (!routes.has(record.route)) failures.push(`${record.id} uses unregistered route ${record.route}`);
  if (!tamilPattern.test(record.tamilTitle)) failures.push(`${record.id} is missing a Tamil title`);
  if (!tamilPattern.test(record.tamilSummary)) failures.push(`${record.id} is missing a Tamil summary`);
  if (record.keywords.length < 5) failures.push(`${record.id} requires at least five search keywords`);
  if (record.summary.length < 70) failures.push(`${record.id} summary is too thin`);
  if (record.sourceBoundary.length < 50) failures.push(`${record.id} source boundary is too thin`);
  if (!record.route.startsWith("/")) failures.push(`${record.id} route must be absolute`);
}

for (const collection of editorialCollections) {
  const count = editorialRecords.filter((record) => record.collection === collection.collection).length;
  if (count < 6) failures.push(`${collection.collection} requires at least six editorial records`);
  if (!routes.has(collection.route)) failures.push(`${collection.collection} uses unregistered route ${collection.route}`);
}

const coverage = getEditorialCoverage();
if (coverage.total !== editorialRecords.length) failures.push("Coverage total does not match editorial record count");
if (coverage.collections !== editorialCollections.length) failures.push("Coverage collection count does not match registry");
if (coverage.statuses["Ready for guided learning"] < 10) failures.push("Guided-learning coverage is below the Wave 5 minimum");
if (coverage.statuses["Needs source review"] < 5) failures.push("Source-review visibility is below the Wave 5 minimum");

if (!ownerSelectedArtwork.sourceReference.startsWith("https://chatgpt.com/s/")) {
  failures.push("Owner-selected artwork reference is missing or unexpected");
}
if (!ownerSelectedArtwork.readyForProduction && ownerSelectedArtwork.assetPath !== null) {
  failures.push("Pending artwork must not expose a production asset path");
}
if (ownerSelectedArtwork.readyForProduction && !ownerSelectedArtwork.assetPath) {
  failures.push("Production artwork requires an asset path");
}

if (failures.length) {
  console.error("Editorial registry validation failed:\n- " + failures.join("\n- "));
  process.exit(1);
}

console.log(
  `Editorial registry validation passed: ${editorialRecords.length} records across ${editorialCollections.length} collections.`,
);
