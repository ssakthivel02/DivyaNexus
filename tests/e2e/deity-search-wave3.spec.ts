import { expect, test } from "@playwright/test";

const queries = [
  ["Shiva", "Shiva"],
  ["சிவன்", "Shiva"],
  ["Sivan", "Shiva"],
  ["Parvathi", "Parvati"],
  ["விநாயகர்", "Ganesha"],
  ["Subrahmanya", "Murugan"],
  ["Kannan", "Krishna"],
  ["Natarajar", "Nataraja"],
] as const;

async function waitForApp(page: import("@playwright/test").Page) {
  await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
}

test.describe("deity discovery search", () => {
  for (const [query, expected] of queries) {
    test(`${query} opens ${expected} from the deity directory`, async ({ page }) => {
      await page.goto(`/deities?q=${encodeURIComponent(query)}`, { waitUntil: "domcontentloaded" });
      await waitForApp(page);
      const card = page.locator(".deity-directory-card").filter({ hasText: expected });
      await expect(card).toHaveCount(1);
      await card.click();
      await expect(page.getByRole("heading", { name: expected, exact: true })).toBeVisible();
    });
  }

  test("global search returns a direct deity encyclopedia result", async ({ page }) => {
    await page.goto(`/search?q=${encodeURIComponent("Murugan")}`, { waitUntil: "domcontentloaded" });
    await waitForApp(page);
    const result = page.locator(".search-cinema__result").filter({ hasText: "Deity encyclopedia" }).filter({ hasText: "Murugan" });
    await expect(result).toBeVisible();
    await result.click();
    await expect(page).toHaveURL(/\/deities\/murugan/);
    await expect(page.getByRole("heading", { name: "Murugan", exact: true })).toBeVisible();
  });

  test("tradition filter changes the visible collection", async ({ page }) => {
    await page.goto("/deities", { waitUntil: "domcontentloaded" });
    await waitForApp(page);
    await page.getByRole("button", { name: "Tamil", exact: true }).click();
    await expect(page.locator(".deity-directory-card")).toHaveCount(3);
    await expect(page.locator('a.deity-directory-card[href="/deities/shiva"]')).toBeVisible();
    await expect(page.locator('a.deity-directory-card[href="/deities/murugan"]')).toBeVisible();
    await expect(page.locator('a.deity-directory-card[href="/deities/nataraja"]')).toBeVisible();
    await page.getByRole("button", { name: "All", exact: true }).click();
    await expect(page.locator(".deity-directory-card")).toHaveCount(10);
  });
});
