import { expect, test } from "@playwright/test";

const deityRecords = [
  ["shiva", "Shiva", "சிவன்"],
  ["parvati", "Parvati", "பார்வதி"],
  ["vishnu", "Vishnu", "விஷ்ணு"],
  ["lakshmi", "Lakshmi", "லட்சுமி"],
  ["ganesha", "Ganesha", "விநாயகர்"],
  ["murugan", "Murugan", "முருகன்"],
  ["saraswati", "Saraswati", "சரஸ்வதி"],
  ["rama", "Rama", "ராமர்"],
  ["krishna", "Krishna", "கிருஷ்ணர்"],
  ["nataraja", "Nataraja", "நடராஜர்"],
] as const;

async function waitForRoute(page: import("@playwright/test").Page) {
  await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
  await expect(page.locator("#main-content")).toBeVisible();
}

test.describe("DivyaNexus deity encyclopedia wave 3", () => {
  test("directory exposes ten reviewed, navigable records", async ({ page }) => {
    const response = await page.goto("/deities", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBeLessThan(400);
    await waitForRoute(page);
    await expect(page.getByRole("heading", { name: /Ten doorways/i })).toBeVisible();
    await expect(page.locator(".deity-directory-card")).toHaveCount(10);
    await expect(page.getByText("10 reviewed orientations")).toBeVisible();
  });

  for (const [slug, name, tamil] of deityRecords) {
    test(`${name} renders bilingual orientation and provenance`, async ({ page }) => {
      const response = await page.goto(`/deities/${slug}`, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBeLessThan(400);
      await waitForRoute(page);
      await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
      await expect(page.getByText(tamil, { exact: true }).first()).toBeVisible();
      await expect(page.getByText("Bilingual orientation", { exact: true })).toBeVisible();
      await expect(page.getByRole("heading", { name: "What supports this orientation?" })).toBeVisible();
      await expect(page.getByRole("link", { name: /Open reference/ }).first()).toHaveAttribute("target", "_blank");
      await expect(page.getByText("No verse quotation is generated on this page.", { exact: false })).toBeVisible();
    });
  }

  test("bookmark persists locally and related path opens", async ({ page }) => {
    await page.goto("/deities/murugan", { waitUntil: "domcontentloaded" });
    await waitForRoute(page);
    await page.getByRole("button", { name: "Save locally" }).click();
    await expect(page.getByRole("button", { name: "Saved locally" })).toBeVisible();
    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForRoute(page);
    await expect(page.getByRole("button", { name: "Saved locally" })).toBeVisible();
    await page.getByRole("link", { name: /Shiva/ }).last().click();
    await expect(page).toHaveURL(/\/deities\/shiva/);
  });

  test("unknown deity path shows an honest fallback", async ({ page }) => {
    await page.goto("/deities/not-a-reviewed-record", { waitUntil: "domcontentloaded" });
    await waitForRoute(page);
    await expect(page.getByRole("heading", { name: "This reviewed record is not available." })).toBeVisible();
    await expect(page.getByRole("link", { name: "Return to deity directory" })).toBeVisible();
  });

  for (const viewport of [
    { width: 320, height: 800 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
  ]) {
    test(`directory has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/deities", { waitUntil: "domcontentloaded" });
      await waitForRoute(page);
      const dimensions = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
    });
  }
});
