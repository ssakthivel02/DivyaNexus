import { expect, test } from "@playwright/test";

const wave10Routes = ["/nexus", "/temples", "/learning"] as const;

async function openRoute(page: import("@playwright/test").Page, route: string) {
  await page.goto(route, { waitUntil: "domcontentloaded" });
  await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
  await expect(page.locator("#main-content")).toBeVisible();
}

test.describe("Wave 10 release closure", () => {
  for (const route of wave10Routes) {
    test(`${route} exposes stable document and accessibility landmarks`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));

      await openRoute(page, route);

      await expect(page.locator("main#main-content")).toHaveCount(1);
      await expect(page.locator("main#main-content h1")).toHaveCount(1);
      await expect(page.locator("main#main-content h1")).toBeVisible();
      await expect(page.locator('meta[name="viewport"]')).toHaveCount(1);

      const unnamedInteractive = await page.locator("a, button, input, textarea, select").evaluateAll((elements) =>
        elements.filter((element) => {
          const html = element as HTMLElement;
          if (html.getAttribute("aria-hidden") === "true") return false;
          const hidden = html.offsetParent === null;
          if (hidden) return false;
          const aria = html.getAttribute("aria-label")?.trim();
          const labelledBy = html.getAttribute("aria-labelledby")?.trim();
          const text = html.textContent?.trim();
          const title = html.getAttribute("title")?.trim();
          const alt = element instanceof HTMLInputElement ? element.getAttribute("alt")?.trim() : "";
          return !aria && !labelledBy && !text && !title && !alt;
        }).length,
      );
      expect(unnamedInteractive).toBe(0);
      expect(pageErrors).toEqual([]);
    });
  }

  test("core Wave 10 routes retain mobile layout and reduced-motion support", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });

    for (const route of wave10Routes) {
      await openRoute(page, route);
      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      }));
      expect(state.overflow).toBeLessThanOrEqual(1);
      expect(state.reducedMotion).toBe(true);
    }
  });

  test("keyboard navigation reaches an interactive control without pointer input", async ({ page }) => {
    await openRoute(page, "/nexus");
    await page.locator("body").focus();

    let reachedInteractive = false;
    for (let index = 0; index < 8; index += 1) {
      await page.keyboard.press("Tab");
      reachedInteractive = await page.evaluate(() => {
        const active = document.activeElement;
        return active instanceof HTMLAnchorElement || active instanceof HTMLButtonElement || active instanceof HTMLInputElement;
      });
      if (reachedInteractive) break;
    }

    expect(reachedInteractive).toBe(true);
  });

  test("Wave 10 remains route-lazy rather than importing Knowledge Nexus eagerly", async ({ page }) => {
    const nexusRequests: string[] = [];
    page.on("request", (request) => {
      if (/KnowledgeNexus-[^/]+\.js(?:\?|$)/.test(request.url())) nexusRequests.push(request.url());
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
    expect(nexusRequests).toEqual([]);

    await page.goto("/nexus", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "One intelligent doorway into the whole DivyaNexus universe." })).toBeVisible();
    expect(nexusRequests.length).toBeGreaterThan(0);
  });
});
