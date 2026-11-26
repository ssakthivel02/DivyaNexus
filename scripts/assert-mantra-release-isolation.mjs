/** Fail closed when draft editorial mantra text leaks into normal browser release assets. */
import { readdir, readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const releaseRoot = fileURLToPath(new URL("../dist/public/", import.meta.url));
const markers = [
  "subrahmaNyaShaDakSharamantraH2",
  "Candidate texts — not yet approved for production publication",
  "An invocation of Murugan by his Saravana name.",
];

/** Exported to test positive and adversarial fixtures without touching deploy output. */
export async function assertMantraReleaseIsolation(root = releaseRoot) {
  let inspected = 0;
  async function inspect(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        await inspect(path);
        continue;
      }
      if (!entry.isFile() || !/\.(?:js|html|css|json|map)$/.test(entry.name)) continue;
      const shortPath = relative(root, path);
      if (/^Mantras-[^/]+\.js$/i.test(entry.name)) {
        throw new Error(`Unapproved mantra reader chunk included in release: ${shortPath}`);
      }
      inspected += 1;
      const contents = await readFile(path, "utf8");
      for (const marker of markers) {
        if (contents.includes(marker)) {
          throw new Error(`Unapproved mantra candidate text found in release: ${shortPath}`);
        }
      }
    }
  }
  await inspect(root);
  if (inspected === 0) throw new Error("No deployable browser assets were inspected.");
  return inspected;
}

// Never bypass release scanning unless this is an explicit editorial-preview build.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.env.VITE_MANTRA_CANDIDATES === "review") {
    console.log("Editorial candidate browser-preview build: release isolation assertion not applicable.");
  } else {
    const count = await assertMantraReleaseIsolation();
    console.log(`PASS: ${count} normal browser release assets exclude known unpublished mantra markers and reader chunk.`);
  }
}
