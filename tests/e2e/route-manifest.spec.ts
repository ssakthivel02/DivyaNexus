import { expect, test } from "@playwright/test";
import { DIRECT_ROUTE_SAMPLES, PRODUCTION_SMOKE_ROUTES } from "../../client/src/config/routes";

async function expectApplicationRoute(page: import("@playwright/test").Page, route: string) {
  const response = await page.goto(route, { waitUntil: "domcontentloaded" });
  expect(response?.status(), `Unexpected status for ${route}`).toBeLessThan(400);
  await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
  await expect(page.locator("#main-content")).toBeVisible();
  await expect(page.getByText("Page Not Found", { exact: true })).toHaveCount(0);
}

test.describe("route manifest browser contract", () => {
  for (const route of PRODUCTION_SMOKE_ROUTES) {
    test(`${route.path} renders as a production smoke route`, async ({ page }) => {
      await expectApplicationRoute(page, route.path);
    });
  }

  for (const route of DIRECT_ROUTE_SAMPLES) {
    test(`${route} renders as a direct dynamic-route sample`, async ({ page }) => {
      await expectApplicationRoute(page, route);
    });
  }
});
