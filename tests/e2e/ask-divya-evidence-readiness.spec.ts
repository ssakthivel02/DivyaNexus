import { expect, test } from "@playwright/test";

test("Ask Divya local guide shows evidence provenance and uncertainty", async ({ page }) => {
  const response = await page.goto("/ask-divya", { waitUntil: "domcontentloaded" });
  expect(response).not.toBeNull();
  expect(response?.status()).toBeLessThan(400);

  await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText("LOCAL GUIDE", { exact: true })).toBeVisible();
  await expect(page.getByText("STAGE B", { exact: true })).toBeVisible();

  await page.locator(".ask-prompt-grid button").first().click();

  await expect(page.getByRole("article").filter({ hasText: "Layer 01 · Source signals" })).toBeVisible();
  await expect(page.getByText(/Review · (Editorial overview|Starter record — source edition to be linked)/).first()).toBeVisible();
  await expect(page.getByText("Evidence · modern educational explanation").first()).toBeVisible();

  const uncertainty = page.getByTestId("ask-local-uncertainty");
  await expect(uncertainty).toBeVisible();
  await expect(uncertainty).toContainText("Uncertainty:");
  await expect(uncertainty).toContainText("does not claim a verified canonical quotation");
  await expect(uncertainty).toContainText("reviewed translation");

  await expect(page.getByRole("link", { name: /Report content issue/i })).toBeVisible();
});
