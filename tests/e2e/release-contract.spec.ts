import { expect, test } from "@playwright/test";

const release = "stage-b-wave8";

test.describe("DivyaNexus release contract", () => {
  test("application shell exposes matching release and ready markers", async ({ page }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
    await expect(page.locator('meta[name="divyanexus-release"]')).toHaveAttribute("content", release);
    await expect(page.locator("#root")).toHaveAttribute("data-divyanexus-version", release);
    await expect(page.locator("html")).toHaveAttribute("data-divyanexus-boot", "ready");
    await expect(page.locator("html")).toHaveAttribute("data-divyanexus-release", release);
  });

  test("public health contract identifies Wave 8 capabilities", async ({ request }) => {
    const response = await request.get("/health.json");
    expect(response.ok()).toBeTruthy();
    const payload = await response.json();
    expect(payload.status).toBe("ok");
    expect(payload.release).toBe(release);
    expect(payload.scope).toBe("static application shell");
    expect(payload.capabilities).toEqual(expect.arrayContaining([
      "owner-selected artwork",
      "Tamil-readable scripture reader",
      "multilingual synthetic speech",
      "offline shell",
    ]));
  });

  test("robots and sitemap publish canonical discovery evidence", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBeTruthy();
    expect(await robots.text()).toContain("https://divyanexus.omsaravanabhava.org/sitemap.xml");
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    const xml = await sitemap.text();
    expect(xml).toContain("https://divyanexus.omsaravanabhava.org/status");
    expect(xml).toContain("https://divyanexus.omsaravanabhava.org/deities/murugan");
  });
});
