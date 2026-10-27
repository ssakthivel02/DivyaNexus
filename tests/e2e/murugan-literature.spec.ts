import { expect, test } from "@playwright/test";

test.describe("Murugan Tamil library publication boundaries", () => {
  test("shows only reviewed works as readable and never links users to external text sites", async ({ page }) => {
    await page.goto("/murugan-literature");
    await expect(page.getByRole("heading", { name: "முருகன் தமிழ் இலக்கிய நூலகம்" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "மூல உரை சரிபார்ப்பு நடைபெறுகிறது" })).toBeVisible();
    await expect(page.locator("main [role=\"status\"]").toContainText("0 சரிபார்க்கப்பட்ட");
    await expect(page.getByRole("heading", { name: "சரிபார்ப்புக்காகக் காத்திருக்கும் நூல்கள்" })).toBeVisible();
    await expect(page.getByText("கந்தர் அனுபூதி — சரிபார்ப்பு நிலுவையில்")).toBeVisible();
    await expect(page.getByText("திருப்புகழ் — சரிபார்ப்பு நிலுவையில்")).toBeVisible();
    await expect(page.locator('main a[href^="http"]')).toHaveCount(0);
  });

  test("keeps search keyboard accessible and avoids horizontal overflow on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/murugan-literature");
    const search = page.getByRole("searchbox", { name: "தமிழ் நூல்கள் மற்றும் பாடல்களில் தேடுக" });
    await search.focus();
    await expect(search).toBeFocused();
    await search.fill("திருப்புகழ்");
    await expect(search).toHaveValue("திருப்புகழ்");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });
});
