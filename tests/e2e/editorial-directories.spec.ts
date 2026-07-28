import { expect, test } from "@playwright/test";

const directories = [
  { route: "/rishis", heading: "Learn the context around a name." },
  { route: "/festivals", heading: "Observe the diversity within observance." },
  { route: "/glossary", heading: "Words change with their context." },
  { route: "/life-guidance", heading: "Reflection without guarantees." },
  { route: "/learning", heading: "Move slowly enough to understand." },
  { route: "/kids", heading: "Gentle curiosity, clear boundaries." },
] as const;

test.describe("expanded editorial directories", () => {
  for (const directory of directories) {
    test(`${directory.route} exposes reviewed pathway cards`, async ({ page }) => {
      const response = await page.goto(directory.route, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBeLessThan(400);
      await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
      await expect(page.getByRole("heading", { name: directory.heading })).toBeVisible();
      await expect(page.locator(".directory-trail-card")).toHaveCount(6);
      await expect(page.getByText("In preparation", { exact: true })).toHaveCount(0);
      await expect(page.locator(".directory-trail-card .editorial-status-badge")).toHaveCount(6);
    });
  }
});
