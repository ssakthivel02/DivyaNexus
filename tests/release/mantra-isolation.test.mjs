import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { assertMantraReleaseIsolation } from "../../scripts/assert-mantra-release-isolation.mjs";

async function withFixture(files, check) {
  const dir = await mkdtemp(join(tmpdir(), "divyanexus-release-"));
  try {
    for (const [relativePath, contents] of Object.entries(files)) {
      const location = join(dir, relativePath);
      await mkdir(join(location, ".."), { recursive: true });
      await writeFile(location, contents, "utf8");
    }
    await check(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

test("clean browser release assets pass, including nested assets", async () => {
  await withFixture({ "index.html": "<html>Public DivyaNexus</html>", "assets/app-123.js": "console.log('public')"}, async dir => {
    assert.equal(await assertMantraReleaseIsolation(dir), 2);
  });
});

test("rejects a leaked mantra reader chunk in nested browser assets", async () => {
  await withFixture({ "assets/Mantras-abc123.js": "export default {}" }, async dir => {
    await assert.rejects(assertMantraReleaseIsolation(dir), /reader chunk included in release/);
  });
});

for (const [name, marker] of [
  ["source witness", "subrahmaNyaShaDakSharamantraH2"],
  ["publication notice", "Candidate texts — not yet approved for production publication"],
  ["candidate explanation", "An invocation of Murugan by his Saravana name."],
]) {
  test(`rejects leaked ${name} in a deployed JavaScript asset`, async () => {
    await withFixture({ "assets/index-123.js": `/* ${marker} */` }, async dir => {
      await assert.rejects(assertMantraReleaseIsolation(dir), /candidate text found in release/);
    });
  });
}

test("fails closed when no deployable browser files were checked", async () => {
  await withFixture({ "README.txt": "not a deployable browser asset" }, async dir => {
    await assert.rejects(assertMantraReleaseIsolation(dir), /No deployable browser assets were inspected/);
  });
});
