import { expect, test } from "@playwright/test";

async function openCollectionStatus(page: import("@playwright/test").Page) {
  const response = await page.goto("/collection-status", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBeLessThan(400);
  await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
  await expect(page.locator("#main-content")).toBeVisible();
}

test.describe("collection transparency", () => {
  test("shows all expanded collections and review labels", async ({ page }) => {
    await openCollectionStatus(page);
    await expect(page.getByRole("heading", { name: "Depth without hiding the review boundary." })).toBeVisible();
    await expect(page.locator(".collection-status-card")).toHaveCount(6);
    await expect(page.getByText("Rishis & lineages", { exact: true })).toBeVisible();
    await expect(page.getByText("Festival pathways", { exact: true })).toBeVisible();
    await expect(page.getByText("Bilingual glossary", { exact: true })).toBeVisible();
    await expect(page.getByText("Ready for guided learning", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Needs source review", { exact: true }).first()).toBeVisible();
  });

  for (const viewport of [
    { width: 320, height: 800 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
  ]) {
    test(`has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await openCollectionStatus(page);
      const dimensions = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
    });
  }
});
