import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const read = (path) => readFileSync(resolve(root, path), "utf8");
const failures = [];

const app = read("client/src/App.tsx");
const page = read("client/src/pages/KnowledgeNexus.tsx");
const css = read("client/src/knowledge-nexus.css");
const provenanceCss = read("client/src/knowledge-provenance.css");
const routes = read("client/src/config/routes.ts");
const meta = read("client/src/config/routeMeta.ts");
const header = read("client/src/components/SiteHeader.tsx");
const sitemap = read("client/public/sitemap.xml");
const relations = read("client/src/data/knowledgeRelations.ts");
const provenance = read("client/src/data/provenance.ts");
const provenanceSearch = read("client/src/lib/provenanceSearch.ts");
const browserTest = read("tests/e2e/knowledge-nexus-wave10.spec.ts");
const relationTest = read("tests/unit/knowledge-relations-wave10.test.ts");
const provenanceTest = read("tests/unit/provenance-wave10.test.ts");

const requireText = (source, text, label) => {
  if (!source.includes(text)) failures.push(`${label} is missing ${JSON.stringify(text)}`);
};

requireText(app, 'path="/nexus"', "App router");
requireText(app, 'import("@/pages/KnowledgeNexus")', "lazy route");
requireText(routes, '{ path: "/nexus", label: "Knowledge Nexus", section: "core", sitemap: true, smoke: true }', "route registry");
requireText(meta, '"/nexus": {', "route metadata");
requireText(meta, 'title: "Knowledge Nexus — Connected Discovery — DivyaNexus"', "route metadata");
requireText(header, '["Knowledge Nexus", "A connected high-tech doorway into the whole archive", "/nexus"]', "global navigation");
requireText(sitemap, "https://divyanexus.omsaravanabhava.org/nexus", "sitemap");

for (const route of ["/scriptures", "/deities", "/temples", "/life-guidance", "/audio", "/ask-divya"]) {
  requireText(page, `href: "${route}"`, "Knowledge Nexus gateway map");
}

for (const boundary of [
  "Primary source and editorial interpretation remain visibly distinct.",
  "No generated answer is allowed to impersonate a verified scripture quotation.",
  "Counts reflect the current repository dataset; they are not presented as collection-completeness claims.",
  "They are not claims of scriptural equivalence, historical causality, doctrinal identity, or verified quotation provenance.",
]) {
  requireText(boundary.includes("scriptural equivalence") ? relations : page, boundary, "Knowledge Nexus truth boundary");
}

for (const relationKind of ["study-next", "context", "concept", "practice"]) {
  requireText(relations, relationKind, "relationship model");
}
requireText(page, "Evidence-aware relationships", "relationship graph surface");
requireText(page, "Editorial relationship edges", "integrity console graph count");
requireText(relationTest, "rejects dangling record relationships", "relationship unit contract");
requireText(relationTest, "requires unique relationship ids", "relationship unit contract");
requireText(relationTest, "keeps rationale and Tamil labels explicit", "relationship unit contract");

for (const evidenceState of ["primary-reference", "editorial-source-needed", "editorial-overview"]) {
  requireText(provenance, evidenceState, "provenance evidence model");
}
requireText(provenance, 'reviewState: "source-edition-needed"', "provenance review boundary");
requireText(provenanceSearch, "matchScore + evidenceScore", "bounded provenance ranking");
requireText(page, "Provenance ledger", "provenance UI surface");
requireText(page, "Source editions still needed", "integrity console provenance count");
requireText(page, "No current Wave 10 record is labelled “Primary reference linked”", "provenance truth boundary");
requireText(provenanceCss, ".nexus-provenance", "provenance responsive styling");
requireText(provenanceTest, "keeps evidence levels ordered without claiming unlinked primary evidence", "provenance unit contract");
requireText(provenanceTest, "ranks only matching records and uses provenance as a bounded boost", "provenance ranking contract");

requireText(css, "@media(max-width:640px)", "mobile layout contract");
requireText(css, "@media(prefers-reduced-motion:reduce)", "reduced-motion contract");
requireText(css, ".nexus-relation", "relationship graph styling");
requireText(browserTest, "preserves mobile layout without horizontal overflow", "browser contract");
requireText(browserTest, "publishes indexable canonical metadata for the new route", "browser contract");

if (/auto(play|start)/i.test(page)) failures.push("Knowledge Nexus page must not introduce autoplay or autostart behaviour");
if (/strength:\s*"primary-reference"/.test(provenance)) failures.push("Wave 10 must not claim a primary-reference provenance object until a reviewed source edition is actually registered");

if (failures.length) {
  console.error("Wave 10 Knowledge Nexus validation failed:\n- " + failures.join("\n- "));
  process.exit(1);
}

console.log("Wave 10 Knowledge Nexus validation passed.");
