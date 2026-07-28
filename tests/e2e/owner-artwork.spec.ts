import { expect, test, type Page } from "@playwright/test";

// The service worker deliberately precaches the owner artwork. Blocking it in this
// focused suite allows the network-failure fallback path to be tested deterministically.
test.use({ serviceWorkers: "block" });

async function openHome(page: Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
  await expect(page.locator("#main-content")).toBeVisible();
  await expect(page.locator('[data-owner-artwork="active"]')).toBeVisible();
}

test.describe("owner-selected DivyaNexus portal vision", () => {
  test("renders the repository-owned WebP without cropping", async ({ page }) => {
    const failedImages: string[] = [];
    page.on("response", (response) => {
      if (response.request().resourceType() === "image" && response.status() >= 400) failedImages.push(`${response.status()} ${response.url()}`);
    });

    await openHome(page);
    const image = page.locator(".portal-artwork__visual img");
    await expect(image).toHaveAttribute("src", "/assets/divyanexus/owner-selected-vision.webp");
    await expect(image).toHaveAttribute("alt", /moonlit Shiva knowledge homepage/i);
    await expect(image).toHaveJSProperty("complete", true);

    const evidence = await image.evaluate((element: HTMLImageElement) => ({
      width: element.naturalWidth,
      height: element.naturalHeight,
      objectFit: getComputedStyle(element).objectFit,
    }));
    expect(evidence.width).toBeGreaterThanOrEqual(1200);
    expect(evidence.height).toBeGreaterThanOrEqual(675);
    expect(evidence.objectFit).toBe("contain");
    expect(failedImages).toEqual([]);
  });

  test("exposes bilingual context and useful actions", async ({ page }) => {
    await openHome(page);
    const panel = page.locator('[data-owner-artwork="active"]');
    await expect(panel.getByRole("heading", { name: "A portal vision for timeless guidance" })).toBeVisible();
    await expect(panel.getByText("காலத்தைத் தாண்டும் ஞானத்திற்கான திவ்யநெக்சஸ் காட்சி")).toBeVisible();
    await expect(panel.getByRole("link", { name: /Explore the live portal/ })).toHaveAttribute("href", "/explore");
    await expect(panel.getByRole("link", { name: /View full visual/ })).toHaveAttribute("href", "/assets/divyanexus/owner-selected-vision.webp");
    await expect(panel).toContainText("displayed without cropping");
  });

  for (const viewport of [
    { width: 320, height: 800 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ]) {
    test(`remains readable without horizontal overflow at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await openHome(page);
      const panel = page.locator('[data-owner-artwork="active"]');
      await expect(panel).toBeVisible();
      const dimensions = await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
      }));
      expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
    });
  }

  test("falls back to a local portal image when the selected asset fails", async ({ page }) => {
    await page.route("**/assets/divyanexus/owner-selected-vision.webp", (route) => route.fulfill({ status: 404, body: "missing" }));
    await openHome(page);
    const image = page.locator(".portal-artwork__visual img");
    await expect(image).toHaveAttribute("src", "/assets/divyanexus/hero-moonlit-horizon.webp");
    await expect(page.getByText(/showing its safe local fallback/i)).toBeVisible();
  });
});
