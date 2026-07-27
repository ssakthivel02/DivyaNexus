import { expect, test } from "@playwright/test";

async function openHome(page: import("@playwright/test").Page) {
  const response = await page.goto("/", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBeLessThan(400);
  await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
  await expect(page.locator("#main-content")).toBeVisible();
}

test.describe("DivyaNexus homepage experience wave 2", () => {
  test("homepage exposes the archive pathway panel from the design reference", async ({ page }) => {
    await openHome(page);

    const panel = page.getByLabel("Choose a path into the archive");
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("link", { name: /Explore all/i })).toBeVisible();
    await expect(panel.getByRole("link", { name: /Deity universe/i })).toBeVisible();
    await expect(panel.getByRole("link", { name: /Life guidance/i })).toBeVisible();
    await expect(panel.getByRole("link", { name: /Kids universe/i })).toBeVisible();
    await expect(panel.getByRole("link", { name: /View all pathways/i })).toBeVisible();
  });

  test("hero provides four scenes and accessible playback controls", async ({ page }) => {
    await openHome(page);

    await expect(page.getByRole("button", { name: /^Show / })).toHaveCount(4);
    const pause = page.getByRole("button", { name: "Pause automatic hero scenes" });
    await expect(pause).toBeVisible();
    await pause.click();
    await expect(page.getByRole("button", { name: "Resume automatic hero scenes" })).toBeVisible();

    await page.getByRole("button", { name: "Show The guidance lantern" }).click();
    await expect(page.getByRole("heading", { name: /Let a question become a considered path/i })).toBeVisible();
  });

  test("homepage search launch and popular query links are visible", async ({ page }) => {
    await openHome(page);

    await expect(page.getByRole("button", { name: /Search scriptures, deities, temples/i })).toBeVisible();
    const chips = page.locator(".cinema-hero__search-chips");
    await expect(chips.getByRole("link", { name: "Bhagavad Gita", exact: true })).toBeVisible();
    await expect(chips.getByRole("link", { name: "Rig Veda", exact: true })).toBeVisible();
    await expect(chips.getByRole("link", { name: /Peace/ })).toBeVisible();
  });

  test("homepage displays truthful collection evidence and trust signals", async ({ page }) => {
    await openHome(page);

    await expect(page.getByText("Tamil-first", { exact: true })).toBeVisible();
    await expect(page.getByText("Source-aware", { exact: true })).toBeVisible();
    await expect(page.getByText("Local-first", { exact: true })).toBeVisible();
    await expect(page.getByText("Family-friendly", { exact: true })).toBeVisible();
    await expect(page.getByText("deity orientation pathways")).toBeVisible();
    await expect(page.getByText("cinematic hero scenes")).toBeVisible();
  });

  test("active hero image uses the brighter visual treatment", async ({ page }) => {
    await openHome(page);

    const visual = await page.locator(".cinema-hero__image.is-active").evaluate((element) => {
      const style = window.getComputedStyle(element);
      return { opacity: Number(style.opacity), filter: style.filter };
    });

    expect(visual.opacity).toBeGreaterThanOrEqual(0.9);
    expect(visual.filter).toContain("brightness");
  });

  test("deity universe exposes ten foundational editorial pathways", async ({ page }) => {
    const response = await page.goto("/deities", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });

    const tabs = page.getByRole("tab");
    await expect(tabs).toHaveCount(10);
    await expect(page.getByRole("tab", { name: /Murugan/ })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Nataraja/ })).toBeVisible();
  });

  for (const viewport of [
    { width: 320, height: 800 },
    { width: 375, height: 812 },
    { width: 430, height: 932 },
    { width: 768, height: 1024 },
  ]) {
    test(`archive panel remains usable without overflow at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await openHome(page);
      await expect(page.getByLabel("Choose a path into the archive")).toBeVisible();

      const dimensions = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
    });
  }
});
