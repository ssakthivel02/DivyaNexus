import { test, expect } from "@playwright/test";

test.describe("Mantra library — browser-local japa", () => {
  test("mobile count, lower goal, undo, reload and confirmed reset preserve the correct state", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/mantras");
    await expect(page.getByRole("heading", { name: /Mantra Library/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Om Saravanabhava", exact: true })).toBeVisible();
    const count = page.locator(".mantra-library__count");
    const tap = page.getByRole("button", { name: "+1 · Count one chant", exact: true });
    const goal = page.getByLabel("Target count", { exact: true });
    const undo = page.getByRole("button", { name: "Undo", exact: true });
    const reset = page.getByRole("button", { name: "Reset this mantra", exact: true });
    await expect(count).toHaveText(/0\s*\/\s*108/);
    for (let i = 0; i < 13; i++) await tap.click();
    await expect(count).toHaveText(/13\s*\/\s*108/);
    await goal.selectOption("11");
    await expect(count).toHaveText(/13\s*\/\s*11/);
    await expect(tap).toBeDisabled();
    await undo.click();
    await expect(count).toHaveText(/12\s*\/\s*11/);

    await expect.poll(async () => page.evaluate(() => {
      const stored = localStorage.getItem("divyanexus.japa.v1");
      return stored ? JSON.parse(stored).counts["murugan-saravanabhava"] : null;
    })).toBe(12);
    await page.reload();
    await expect(count).toHaveText(/12\s*\/\s*11/);
    await goal.selectOption("108");
    await expect(tap).toBeEnabled();

    page.once("dialog", (dialog) => dialog.dismiss());
    await reset.click();
    await expect(count).toHaveText(/12\s*\/\s*108/);
    page.once("dialog", (dialog) => dialog.accept());
    await reset.click();
    await expect(count).toHaveText(/0\s*\/\s*108/);
  });

  test("Tamil search, distinct mantra counters and source-review label", async ({ page }) => {
    await page.goto("/mantras");
    const search = page.getByLabel("Search name or mantra (English / தமிழ்)");
    const tap = page.getByRole("button", { name: "+1 · Count one chant", exact: true });
    const count = page.locator(".mantra-library__count");
    await tap.click();
    await search.fill("நமசிவாய");
    const shiva = page.getByRole("button", { name: /Om Namah Shivaya/ });
    await expect(shiva).toBeVisible();
    await shiva.click();
    await expect(count).toHaveText(/0\s*\/\s*108/);
    await tap.click();
    await tap.click();
    await expect(count).toHaveText(/2\s*\/\s*108/);
    await expect(page.getByText("Source lead linked · human review pending", { exact: true })).toBeVisible();
    await search.fill("சரவணபவ");
    await page.getByRole("button", { name: /Om Saravanabhava/ }).click();
    await expect(count).toHaveText(/1\s*\/\s*108/);
    await expect(page.getByText("Candidate texts — not yet approved for production publication", { exact: false })).toBeVisible();
  });
});
