import { expect, test } from "@playwright/test";

test.describe("DivyaNexus Wave 10 Temple Intelligence", () => {
  test("renders explicit verification, condition, governance, and support states", async ({ page }) => {
    await page.goto("/temples", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });

    const panel = page.locator(".temple-intelligence");
    await expect(panel.getByRole("heading", { name: "See what is known, what is historical, and what still needs verification." })).toBeVisible();
    await expect(panel.locator(".temple-intelligence__card")).toHaveCount(3);
    await expect(panel.getByText("Source review needed")).toHaveCount(3);
    await expect(panel.getByText("Authority not yet verified")).toHaveCount(3);
    await expect(panel.getByText("Official link not yet verified")).toHaveCount(9);
  });

  test("does not expose official-support links before reviewed sources exist", async ({ page }) => {
    await page.goto("/temples", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });

    const panel = page.locator(".temple-intelligence");
    await expect(panel.locator(".temple-intelligence__support a")).toHaveCount(0);
    await expect(panel.getByRole("note")).toContainText("will not invent or infer");
  });

  test("preserves the temple intelligence surface on mobile without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/temples", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".temple-intelligence")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
