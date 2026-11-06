import { expect, test } from "@playwright/test";

const directories = [
  { route: "/rishis", heading: "Learn the context around a name.", records: 6 },
  { route: "/festivals", heading: "Observe the diversity within observance.", records: 6 },
  { route: "/glossary", heading: "Words change with their context.", records: 8 },
  { route: "/life-guidance", heading: "Reflection without guarantees.", records: 6 },
  { route: "/learning", heading: "Move slowly enough to understand.", records: 6 },
  { route: "/kids", heading: "Gentle curiosity, clear boundaries.", records: 6 },
] as const;

test.describe("expanded editorial directories", () => {
  for (const directory of directories) {
    test(`${directory.route} exposes reviewed pathway cards`, async ({ page }) => {
      const response = await page.goto(directory.route, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBeLessThan(400);
      await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
      await expect(page.getByRole("heading", { name: directory.heading })).toBeVisible();
      await expect(page.locator(".directory-trail-card")).toHaveCount(directory.records);
      await expect(page.getByText("In preparation", { exact: true })).toHaveCount(0);
      await expect(page.locator(".directory-trail-card .editorial-status-badge")).toHaveCount(directory.records);
    });
  }
});
