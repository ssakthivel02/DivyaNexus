import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

const LEARNING_PROGRESS_KEY = "divyanexus.learningJourneys.v1";

async function openLibrary(page: import("@playwright/test").Page) {
  await page.goto("/library", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
  await expect(page.getByRole("heading", { name: /Keep a quiet margin for study/ })).toBeVisible();
}

test.describe("browser-local library backup", () => {
  test("restores supported data and permits individual note deletion", async ({ page }) => {
    await openLibrary(page);

    const payload = {
      format: "divyanexus-local-library",
      version: 1,
      bookmarks: ["gita-2-47"],
      history: ["rig-veda-1-1-1"],
      savedSearches: ["dharma"],
      notes: [
        {
          id: "wave6-note",
          recordId: "gita-2-47",
          title: "Imported study question",
          body: "Compare action and attachment after reading the cited verse.",
          updatedAt: "2026-07-28T12:00:00.000Z",
        },
      ],
      preferences: { theme: "night", ignoredField: "not imported" },
    };

    await page.locator('input[type="file"]').setInputFiles({
      name: "divyanexus-local-data.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(payload)),
    });

    const libraryStatus = page.locator(".library-cinema__status");
    await expect(libraryStatus).toContainText("Local data restored");
    await expect(page.getByText("Imported study question", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: /Bhagavad Gita 2.47/ })).toBeVisible();
    await expect(page.getByRole("link", { name: "dharma" })).toBeVisible();

    await page.getByRole("button", { name: "Delete note Imported study question" }).click();
    await expect(libraryStatus).toContainText("Local note deleted");
    await expect(page.getByText("Imported study question", { exact: true })).toHaveCount(0);
  });

  test("backs up, sanitises, preserves legacy compatibility and clears learning progress", async ({ page }) => {
    await openLibrary(page);

    const payload = {
      format: "divyanexus-local-library",
      version: 3,
      bookmarks: [],
      history: [],
      savedSearches: [],
      notes: [],
      learningProgress: {
        "gita-context": ["step-1", "step-1", "", "step-2", 42],
        "invalid-journey": "not-an-array",
      },
    };

    await page.locator('input[type="file"]').setInputFiles({
      name: "divyanexus-local-data-v3.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(payload)),
    });
    await expect(page.locator(".library-cinema__status")).toContainText("Local data restored");

    await expect.poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}"), LEARNING_PROGRESS_KEY)).toEqual({
      "gita-context": ["step-1", "step-2"],
    });

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export local data" }).click();
    const download = await downloadPromise;
    const downloadPath = await download.path();
    expect(downloadPath).not.toBeNull();
    const exported = JSON.parse(await readFile(downloadPath!, "utf8"));
    expect(exported.version).toBe(3);
    expect(exported.learningProgress).toEqual({ "gita-context": ["step-1", "step-2"] });

    await page.evaluate((key) => localStorage.setItem(key, JSON.stringify({ "gita-context": ["legacy-kept"] })), LEARNING_PROGRESS_KEY);
    await page.locator('input[type="file"]').setInputFiles({
      name: "divyanexus-local-data-v2.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify({
        format: "divyanexus-local-library",
        version: 2,
        bookmarks: [],
        history: [],
        savedSearches: [],
        notes: [],
      })),
    });
    expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}"), LEARNING_PROGRESS_KEY)).toEqual({
      "gita-context": ["legacy-kept"],
    });

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Clear local data" }).click();
    await expect(page.locator(".library-cinema__status")).toHaveText("Browser-local study data cleared");
    expect(await page.evaluate((key) => localStorage.getItem(key), LEARNING_PROGRESS_KEY)).toBeNull();
  });

  test("rejects malformed backup content without changing the library", async ({ page }) => {
    await openLibrary(page);
    await page.locator('input[type="file"]').setInputFiles({
      name: "broken.json",
      mimeType: "application/json",
      buffer: Buffer.from("{not-valid-json"),
    });
    await expect(page.locator(".library-cinema__status")).toHaveText("The selected file is not valid JSON.");
    await expect(page.locator(".library-cinema__stat").nth(0)).toContainText("0");
    await expect(page.locator(".library-cinema__stat").nth(3)).toContainText("0");
  });
  test("rejects foreign and unsupported backup envelopes without changing local data", async ({ page }) => {
    await openLibrary(page);
    const keys = ["divyanexus.bookmarks", "divyanexus.theme", "divyanexus.japa.v1"];
    const baseline = [JSON.stringify(["gita-2-47"]), "day", JSON.stringify({
      selectedId: "murugan-saravanabhava", goal: 108, counts: { "murugan-saravanabhava": 37 },
    })];
    await page.evaluate(({ keys, baseline }) => {
      keys.forEach((key, index) => localStorage.setItem(key, baseline[index]));
    }, { keys, baseline });

    const invalid = [
      { format: "another-product", version: 3, preferences: { theme: "night" } },
      { format: "divyanexus-local-library", version: 999, bookmarks: ["untrusted"] },
      { format: "divyanexus-local-library", bookmarks: ["untrusted"] },
      { format: "divyanexus-local-library", version: "3", bookmarks: ["untrusted"] },
      { format: "divyanexus-local-library", version: 1.5, bookmarks: ["untrusted"] },
    ];
    for (const [index, payload] of invalid.entries()) {
      await page.locator('input[type="file"]').setInputFiles({
        name: `bad-backup-${index}.json`, mimeType: "application/json",
        buffer: Buffer.from(JSON.stringify(payload)),
      });
      await expect(page.locator(".library-cinema__status")).toContainText(
        /not a DivyaNexus local-data backup|Unsupported DivyaNexus backup version/,
      );
      const actual = await page.evaluate((names) => names.map((name) => localStorage.getItem(name)), keys);
      expect(actual).toEqual(baseline);
    }
  });

  test("exports, merges, and clears chanting progress without double counting", async ({ page }) => {
    const key = "divyanexus.japa.v1";
    await openLibrary(page);
    await page.evaluate((storageKey) => localStorage.setItem(storageKey, JSON.stringify({
      selectedId: "murugan-saravanabhava", goal: 108, counts: { "murugan-saravanabhava": 80 },
    })), key);

    const payload = { format: "divyanexus-local-library", version: 3, japaProgress: {
      selectedId: "shiva-panchakshara", goal: 21, counts: {
        "murugan-saravanabhava": 21, "shiva-panchakshara": 12, "unknown-id": 50, "hanuman-namah": 1009,
      },
    }};
    await page.locator('input[type="file"]').setInputFiles({
      name: "japa-backup.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(payload)),
    });
    await expect(page.locator(".library-cinema__status")).toContainText("Local data restored");
    const expected = { selectedId: "murugan-saravanabhava", goal: 108,
      counts: { "murugan-saravanabhava": 80, "shiva-panchakshara": 12 } };
    await expect.poll(() => page.evaluate((storageKey) => JSON.parse(localStorage.getItem(storageKey) ?? "null"), key)).toEqual(expected);

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export local data" }).click();
    const exportedPath = await (await downloadPromise).path();
    expect(exportedPath).not.toBeNull();
    expect(JSON.parse(await readFile(exportedPath!, "utf8")).japaProgress).toEqual(expected);

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Clear local data" }).click();
    await expect(page.locator(".library-cinema__status")).toHaveText("Browser-local study data cleared");
    expect(await page.evaluate((storageKey) => localStorage.getItem(storageKey), key)).toBeNull();
  });

  test("restoring an older note ID never overwrites a newer local note or duplicates imports", async ({ page }) => {
    await openLibrary(page);
    const original = {
      id: "collision-note-1", recordId: "gita-2-47", title: "Latest local reflection",
      body: "Newer local wording that must survive restore.", updatedAt: "2026-11-23T10:00:00.000Z",
    };
    const prior = {
      id: "collision-note-1", recordId: "gita-2-47", title: "Recovered older reflection",
      body: "Older backup wording must also be preserved.", updatedAt: "2026-11-10T10:00:00.000Z",
    };
    const restore = async (name: string, notes: typeof original[]) => {
      await page.locator('input[type="file"]').setInputFiles({
        name, mimeType: "application/json",
        buffer: Buffer.from(JSON.stringify({ format: "divyanexus-local-library", version: 3, notes })),
      });
      await expect(page.locator(".library-cinema__status")).toContainText("Local data restored");
    };
    await restore("initial-notes.json", [original]);
    await expect(page.getByText(original.title, { exact: true })).toHaveCount(1);
    await restore("older-notes.json", [prior]);
    await expect(page.getByText(original.title, { exact: true })).toHaveCount(1);
    await expect(page.getByText(prior.title, { exact: true })).toHaveCount(1);
    await restore("older-notes.json", [prior]);
    await expect(page.getByText(prior.title, { exact: true })).toHaveCount(1);
    await expect(page.locator(".library-cinema__status")).toContainText("0 imported notes");

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export local data" }).click();
    const download = await downloadPromise;
    const path = await download.path();
    expect(path).not.toBeNull();
    const exported = JSON.parse(await readFile(path!, "utf8"));
    expect(exported.notes).toHaveLength(2);
    expect(exported.notes.find((note: typeof original) => note.id === original.id)).toMatchObject(original);
    expect(exported.notes.find((note: typeof original) => note.title === prior.title)).toMatchObject({
      title: prior.title, body: prior.body, updatedAt: prior.updatedAt,
    });
    expect(exported.notes.find((note: typeof original) => note.title === prior.title)?.id).not.toBe(original.id);
  });

});
