/** Fail closed when draft editorial mantra text leaks into normal browser release assets. */
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("../dist/public/", import.meta.url);
const preview = process.env.VITE_MANTRA_CANDIDATES === "review";
const markers = [
  "subrahmaNyaShaDakSharamantraH2",
  "Candidate texts — not yet approved for production publication",
  "An invocation of Murugan by his Saravana name.",
];

async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await inspect(path);
      continue;
    }
    if (!entry.isFile() || !/\\.(?:js|html|css|json|map)$/.test(entry.name)) continue;
    const shortPath = relative(root.pathname, path);
    if (/^Mantras-[^/]+\\.js$/i.test(entry.name)) {
      throw new Error(`Unapproved mantra reader chunk included in release: ${shortPath}`);
    }
    const contents = await readFile(path, "utf8");
    for (const marker of markers) {
      if (contents.includes(marker)) {
        throw new Error(`Unapproved mantra candidate text found in release: ${shortPath}`);
      }
    }
  }
}

if (preview) {
  console.log("Editorial candidate browser-preview build: release isolation assertion not applicable.");
} else {
  await inspect(root.pathname);
  console.log("PASS: normal browser release assets exclude known unpublished mantra markers and reader chunk.");
}
