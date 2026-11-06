import { expect, test } from "@playwright/test";

async function expectEditorialResult(page: import("@playwright/test").Page, query: string, heading: string) {
  const response = await page.goto(`/search?q=${encodeURIComponent(query)}`, { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBeLessThan(400);
  await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
  await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  await expect(page.locator(".editorial-status-badge").first()).toBeVisible();
}

test.describe("expanded editorial search", () => {
  test("finds a rishi pathway by English transliteration", async ({ page }) => {
    await expectEditorialResult(page, "agastya", "Agastya · Source-aware orientation");
  });

  test("finds a Tamil rishi alias", async ({ page }) => {
    await expectEditorialResult(page, "அகத்தியர்", "Agastya · Source-aware orientation");
  });

  test("finds a festival pathway", async ({ page }) => {
    await expectEditorialResult(page, "Deepavali", "Deepavali · Regional context");
  });

  test("finds a glossary pathway", async ({ page }) => {
    await expectEditorialResult(page, "karma", "Karma");
  });

  test("finds a family-safe pathway", async ({ page }) => {
    await expectEditorialResult(page, "symbol", "Symbol spotting · Look before naming");
  });
});
