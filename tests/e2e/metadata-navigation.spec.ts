import { expect, test } from "@playwright/test";

async function waitForRoute(page: import("@playwright/test").Page) {
  await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
  await expect(page.locator("#main-content")).toBeVisible();
}

test.describe("quality wave metadata and navigation", () => {
  test("indexed routes expose unique metadata canonical and structured data", async ({ page }) => {
    await page.goto("/glossary", { waitUntil: "domcontentloaded" });
    await waitForRoute(page);

    await expect(page).toHaveTitle("Bilingual Vedic and Cultural Glossary — DivyaNexus");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Tamil and English glossary records/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index,follow");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://divyanexus.omsaravanabhava.org/glossary");
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", "https://divyanexus.omsaravanabhava.org/glossary");

    const structuredData = await page.locator("#divyanexus-route-structured-data").textContent();
    const parsed = JSON.parse(structuredData ?? "{}");
    expect(parsed["@type"]).toBe("CollectionPage");
    expect(parsed.url).toBe("https://divyanexus.omsaravanabhava.org/glossary");
    expect(parsed.isPartOf.inLanguage).toEqual(["en", "ta"]);
  });

  test("client navigation announces and focuses the new main region", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForRoute(page);
    await page.getByRole("link", { name: "Enter the library" }).click();
    await expect(page).toHaveURL(/\/scriptures$/);
    await waitForRoute(page);
    await expect(page).toHaveTitle("Scripture Learning Library — DivyaNexus");
    await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe("main-content");
    await expect(page.locator(".route-announcer")).toHaveText("Scriptures page loaded");
  });

  test("offline status is explicit without claiming complete offline coverage", async ({ page, context }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForRoute(page);
    await context.setOffline(true);
    await page.evaluate(() => window.dispatchEvent(new Event("offline")));
    await expect(page.getByText("You are offline. Previously opened pages and cached assets may still be available.")).toBeVisible();
    await context.setOffline(false);
    await page.evaluate(() => window.dispatchEvent(new Event("online")));
    await expect(page.locator(".network-status-banner")).toHaveCount(0);
  });

  test("unknown routes are noindex and provide useful recovery paths", async ({ page }) => {
    await page.goto("/this-path-is-not-registered", { waitUntil: "domcontentloaded" });
    await waitForRoute(page);
    await expect(page.getByRole("heading", { name: "The requested path is outside the current archive." })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex,follow");
    const recovery = page.getByRole("region", { name: "Suggested recovery routes" });
    await expect(recovery.getByRole("link", { name: /Explore the universe/ })).toBeVisible();
    await expect(recovery.getByRole("link", { name: /Search the collection/ })).toBeVisible();
    await expect(recovery.getByRole("link", { name: /Ask Divya/ })).toBeVisible();
  });
});
