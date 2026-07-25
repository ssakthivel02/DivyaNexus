import { expect, test, type Page } from "@playwright/test";

const validRoutes = [
  "/",
  "/explore",
  "/ask-divya",
  "/ask",
  "/search",
  "/scriptures",
  "/bhagavad-gita",
  "/rig-veda",
  "/upanishads",
  "/deities",
  "/temples",
  "/rishis",
  "/festivals",
  "/glossary",
  "/life-guidance",
  "/guidance",
  "/learning",
  "/kids",
  "/audio",
  "/library",
  "/about",
  "/sources",
  "/privacy",
  "/terms",
  "/delete-account",
  "/delete-data",
  "/disclaimer",
  "/contact",
] as const;

async function openAppRoute(page: Page, route: string) {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  const response = await page.goto(route, { waitUntil: "domcontentloaded" });
  expect(response, `No navigation response for ${route}`).not.toBeNull();
  expect(response?.status(), `Unexpected HTTP status for ${route}`).toBeLessThan(400);

  await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
  await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText("Page Not Found", { exact: true })).toHaveCount(0);
  expect(pageErrors, `Runtime errors on ${route}`).toEqual([]);
}

test.describe("DivyaNexus production smoke coverage", () => {
  test("homepage renders the Stage B cinematic experience", async ({ page }) => {
    const failedImages: string[] = [];
    page.on("response", (response) => {
      if (response.request().resourceType() === "image" && response.status() >= 400) {
        failedImages.push(`${response.status()} ${response.url()}`);
      }
    });

    await openAppRoute(page, "/");
    await expect(page.getByRole("heading", { name: /A universe of wisdom/i })).toBeVisible();
    await expect(page.getByRole("button", { name: "Ask Divya" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Explore the universe/i })).toBeVisible();
    expect(failedImages).toEqual([]);
  });

  for (const route of validRoutes) {
    test(`valid route ${route} renders without the loading-screen defect`, async ({ page }) => {
      await openAppRoute(page, route);
      await page.reload({ waitUntil: "domcontentloaded" });
      await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
      await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
      await expect(page.getByText("Page Not Found", { exact: true })).toHaveCount(0);
    });
  }

  test("desktop navigation and browser history work", async ({ page }) => {
    await openAppRoute(page, "/");
    await page.getByRole("link", { name: "Scriptures", exact: true }).click();
    await expect(page).toHaveURL(/\/scriptures$/);
    await expect(page.locator("#main-content")).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await page.goForward();
    await expect(page).toHaveURL(/\/scriptures$/);
  });

  test("mobile navigation opens, closes and navigates", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await openAppRoute(page, "/");

    const menuButton = page.getByRole("button", { name: "Open navigation menu" });
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#mobile-navigation")).toHaveClass(/is-open/);

    await page.locator("#mobile-navigation").getByRole("link", { name: "Explore all" }).click();
    await expect(page).toHaveURL(/\/explore$/);
    await expect(page.locator("#mobile-navigation")).not.toHaveClass(/is-open/);
  });

  test("theme preference persists across reload", async ({ page }) => {
    await openAppRoute(page, "/");
    const themeButton = page.getByRole("button", { name: /Switch to dawn theme/i });
    await themeButton.click();
    await expect(page.locator("html")).toHaveClass(/dawn/);
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveClass(/dawn/);
  });

  const supportedSearches = [
    ["dharma", "Dharma"],
    ["தர்மம்", "Dharma"],
    ["peace", "A reflection on peace"],
    ["அமைதி", "A reflection on peace"],
    ["amaithi", "A reflection on peace"],
    ["wisdom", "Introduction to the Upanishads"],
    ["ஞானம்", "Introduction to the Upanishads"],
    ["gnanam", "Introduction to the Upanishads"],
  ] as const;

  for (const [query, expectedTitle] of supportedSearches) {
    test(`multilingual search returns a valid record for ${query}`, async ({ page }) => {
      await openAppRoute(page, "/search");
      const input = page.getByRole("textbox", { name: "Search knowledge records" });
      await input.fill(query);
      await page.getByRole("button", { name: "Search", exact: true }).click();

      const result = page.getByRole("link").filter({ hasText: expectedTitle }).first();
      await expect(result).toBeVisible();
      await result.click();
      await expect(page.locator("#main-content")).toBeVisible();
      await expect(page.getByText("Page Not Found", { exact: true })).toHaveCount(0);
    });
  }

  test("unsupported deity query shows honest no-result guidance", async ({ page }) => {
    await openAppRoute(page, "/search");
    const input = page.getByRole("textbox", { name: "Search knowledge records" });
    await input.fill("Shiva");
    await page.getByRole("button", { name: "Search", exact: true }).click();
    await expect(page.getByRole("heading", { name: "No direct record has surfaced yet." })).toBeVisible();
  });

  test("Ask Divya produces a transparently bounded local response", async ({ page }) => {
    await openAppRoute(page, "/ask-divya");
    await expect(page.getByText(/LOCAL GUIDE/i)).toBeVisible();

    const input = page.getByRole("textbox", { name: "Your question for Ask Divya" });
    await input.fill("What is dharma?");
    await page.getByRole("button", { name: "Send question" }).click();

    await expect(page.getByRole("heading", { name: "A source-aware reflection on duty" })).toBeVisible();
    await expect(page.getByText(/Generated explanation/i)).toBeVisible();
    await expect(page.getByText(/Content boundary:/i)).toBeVisible();
  });

  for (const viewport of [
    { width: 320, height: 800 },
    { width: 375, height: 812 },
    { width: 390, height: 844 },
    { width: 430, height: 932 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ]) {
    test(`homepage has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await openAppRoute(page, "/");
      const dimensions = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
    });
  }

  test("accessibility baseline exposes landmarks, labels and keyboard focus", async ({ page }) => {
    await openAppRoute(page, "/");
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Open global search" })).toBeVisible();

    await page.keyboard.press("Tab");
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName ?? "");
    expect(focusedTag).not.toBe("");
    expect(focusedTag).not.toBe("BODY");
  });
});
