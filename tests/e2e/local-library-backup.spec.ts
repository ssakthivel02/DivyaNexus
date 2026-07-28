import { expect, test } from "@playwright/test";

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

    await expect(page.getByRole("status")).toContainText("Local data restored");
    await expect(page.getByText("Imported study question", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: /Bhagavad Gita 2.47/ })).toBeVisible();
    await expect(page.getByRole("link", { name: "dharma" })).toBeVisible();

    await page.getByRole("button", { name: "Delete note Imported study question" }).click();
    await expect(page.getByRole("status")).toContainText("Local note deleted");
    await expect(page.getByText("Imported study question", { exact: true })).toHaveCount(0);
  });

  test("rejects malformed backup content without changing the library", async ({ page }) => {
    await openLibrary(page);
    await page.locator('input[type="file"]').setInputFiles({
      name: "broken.json",
      mimeType: "application/json",
      buffer: Buffer.from("{not-valid-json"),
    });
    await expect(page.getByRole("status")).toHaveText("The selected file is not valid JSON.");
    await expect(page.locator(".library-cinema__stat").nth(0)).toContainText("0");
    await expect(page.locator(".library-cinema__stat").nth(3)).toContainText("0");
  });
});
