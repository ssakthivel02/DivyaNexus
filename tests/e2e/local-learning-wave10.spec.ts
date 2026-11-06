import { expect, test } from "@playwright/test";

async function openLearning(page: import("@playwright/test").Page) {
  await page.goto("/learning", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
  await expect(page.locator("#main-content")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Resume when you want. Nothing is due." })).toBeVisible();
}

test.describe("DivyaNexus Wave 10 local learning journeys", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => localStorage.removeItem("divyanexus.learningJourneys.v1"));
  });

  test("keeps learning pressure-free and browser-local", async ({ page }) => {
    await openLearning(page);
    await expect(page.getByText("Stored only in this browser · no account · no streaks · no rankings")).toBeVisible();
    await expect(page.locator("[data-learning-journey]")).toHaveCount(3);
    await expect(page.getByText(/does not certify mastery, religious attainment, attendance, or completion of formal study/)).toBeVisible();
  });

  test("persists and resets an optional step without an account", async ({ page }) => {
    await openLearning(page);
    const journey = page.locator('[data-learning-journey="gita-context"]');
    const toggle = journey.getByRole("button", { name: "Mark Open the cited text path complete" });
    await toggle.click();
    await expect(journey.getByText("1 of 3 marked · progress is optional")).toBeVisible();

    await page.reload({ waitUntil: "domcontentloaded" });
    const reloadedJourney = page.locator('[data-learning-journey="gita-context"]');
    await expect(reloadedJourney.getByText("1 of 3 marked · progress is optional")).toBeVisible();
    await reloadedJourney.getByRole("button", { name: "Reset this journey" }).click();
    await expect(reloadedJourney.getByText("0 of 3 marked · progress is optional")).toBeVisible();
  });

  test("preserves the learning surface on a narrow mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openLearning(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
