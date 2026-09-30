import { expect, test } from "@playwright/test";

test("Ask Divya correction handoff preserves only bounded intent metadata", async ({ page }) => {
  const response = await page.goto("/content-corrections?from=ask-divya", { waitUntil: "domcontentloaded" });
  expect(response).not.toBeNull();
  expect(response?.status()).toBeLessThan(400);

  await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
  await expect(page.getByTestId("ask-divya-correction-guidance")).toBeVisible();

  const contactLink = page.getByRole("link", { name: /Open correction contact path/i });
  await expect(contactLink).toHaveAttribute("href", "/contact?intent=content-correction&from=ask-divya");
  await contactLink.click();

  await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
  await expect(page.getByTestId("correction-contact-handoff")).toContainText("This report came from Ask Divya.");

  const url = new URL(page.url());
  expect(url.pathname).toBe("/contact");
  expect(url.searchParams.get("intent")).toBe("content-correction");
  expect(url.searchParams.get("from")).toBe("ask-divya");
  expect([...url.searchParams.keys()].sort()).toEqual(["from", "intent"]);
});
