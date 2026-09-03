import { expect, test } from "@playwright/test";

async function openNexus(page: import("@playwright/test").Page) {
  await page.goto("/nexus", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
  await expect(page.locator("#main-content")).toBeVisible();
}

test.describe("DivyaNexus Wave 10 Knowledge Nexus", () => {
  test("renders the connected discovery surface with truthful integrity evidence", async ({ page }) => {
    await openNexus(page);

    await expect(page).toHaveTitle("Knowledge Nexus — Connected Discovery — DivyaNexus");
    await expect(page.getByRole("heading", { name: "One intelligent doorway into the whole DivyaNexus universe." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Choose a constellation" })).toBeVisible();
    await expect(page.getByLabel("Knowledge integrity console")).toContainText("Generated-source impersonation");
    await expect(page.getByLabel("Knowledge integrity console")).toContainText("BLOCKED");
    await expect(page.getByText(/Counts reflect the current repository dataset/)).toBeVisible();
  });

  test("connects the six Wave 10 gateways to registered product routes", async ({ page }) => {
    await openNexus(page);

    for (const target of ["/scriptures", "/deities", "/temples", "/life-guidance", "/audio", "/ask-divya"]) {
      await expect(page.locator(`a[href="${target}"]`).first()).toBeVisible();
    }
  });

  test("is reachable from the global universe navigation", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
    const universe = page.getByRole("button", { name: /Universe/ });
    await universe.click();
    await page.getByRole("menuitem", { name: /Knowledge Nexus/ }).click();
    await expect(page).toHaveURL(/\/nexus$/);
    await expect(page.getByRole("heading", { name: "One intelligent doorway into the whole DivyaNexus universe." })).toBeVisible();
  });

  test("preserves mobile layout without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openNexus(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await expect(page.locator(".nexus-grid")).toBeVisible();
  });

  test("publishes indexable canonical metadata for the new route", async ({ page }) => {
    await openNexus(page);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index,follow");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://divyanexus.omsaravanabhava.org/nexus");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /connected DivyaNexus discovery surface/);
  });
});