import { expect, test } from "@playwright/test";

async function openStatus(page: import("@playwright/test").Page) {
  const response = await page.goto("/status", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBeLessThan(400);
  await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
  await expect(page.locator("#main-content")).toBeVisible();
}

test.describe("production status page", () => {
  test("shows transparent release evidence and browser boundaries", async ({ page }) => {
    await openStatus(page);
    await expect(page.getByRole("heading", { name: "Release status without hidden assumptions." })).toBeVisible();
    await expect(page.getByText("stage-b-wave4", { exact: true })).toBeVisible();
    await expect(page.getByText("HTML release marker", { exact: true })).toBeVisible();
    await expect(page.getByText("React root marker", { exact: true })).toBeVisible();
    await expect(page.getByText("Browser-local data", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: /health\.json/i })).toHaveAttribute("href", "/health.json");
    await expect(page.getByRole("link", { name: /release\.json/i })).toHaveAttribute("href", "/release.json");
  });

  test("refresh control reruns browser-visible diagnostics", async ({ page }) => {
    await openStatus(page);
    const button = page.getByRole("button", { name: "Refresh checks" });
    await expect(button).toBeVisible();
    await button.click();
    await expect(page.getByText("Secure browser context", { exact: true })).toBeVisible();
  });

  for (const viewport of [
    { width: 320, height: 800 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
  ]) {
    test(`status evidence has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await openStatus(page);
      const dimensions = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
    });
  }
});
