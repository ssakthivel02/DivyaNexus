import { expect, test, type Page } from "@playwright/test";

async function openRoute(page: Page, route: string) {
  const response = await page.goto(route, { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBeLessThan(400);
  await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
  await expect(page.locator("#main-content")).toBeVisible();
}

test.describe("readability and audio Wave 8", () => {
  test("owner-selected visual is promoted into the active homepage hero", async ({ page }) => {
    await openRoute(page, "/");
    const activeHero = page.locator(".cinema-hero__image.is-active");
    await expect(activeHero).toBeVisible();
    const evidence = await activeHero.evaluate((element) => {
      const image = element as HTMLImageElement;
      const style = getComputedStyle(image);
      return {
        renderedContent: style.content,
        filter: style.filter,
        width: image.getBoundingClientRect().width,
        height: image.getBoundingClientRect().height,
      };
    });
    expect(evidence.renderedContent).toContain("owner-selected-vision.webp");
    expect(evidence.filter).toContain("brightness");
    expect(evidence.width).toBeGreaterThan(500);
    expect(evidence.height).toBeGreaterThan(300);
  });

  test("Tamil scripture text uses a readable font size and contrast", async ({ page }) => {
    await openRoute(page, "/rig-veda?record=rig-veda-1-42");
    const tamilText = page.locator('[lang="ta"]').filter({ hasText: /பூஷ/ }).first();
    await expect(tamilText).toBeVisible();
    const evidence = await tamilText.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        fontSize: Number.parseFloat(style.fontSize),
        lineHeight: Number.parseFloat(style.lineHeight),
        color: style.color,
        fontFamily: style.fontFamily,
      };
    });
    expect(evidence.fontSize).toBeGreaterThanOrEqual(16);
    expect(evidence.lineHeight).toBeGreaterThanOrEqual(26);
    expect(evidence.fontFamily).toMatch(/Noto Sans Tamil|Noto Serif Tamil/i);
    expect(evidence.color).not.toBe("rgb(157, 163, 192)");
  });

  test("audio page provides working user-initiated browser speech controls and transcript", async ({ page }) => {
    await page.addInitScript(() => {
      class MockUtterance {
        text: string;
        lang = "";
        rate = 1;
        pitch = 1;
        volume = 1;
        onstart: (() => void) | null = null;
        onend: (() => void) | null = null;
        onerror: (() => void) | null = null;
        constructor(text: string) { this.text = text; }
      }
      Object.defineProperty(window, "SpeechSynthesisUtterance", { value: MockUtterance, configurable: true });
      Object.defineProperty(window, "speechSynthesis", {
        configurable: true,
        value: {
          cancel() {},
          speak(utterance: MockUtterance) {
            utterance.onstart?.();
            window.setTimeout(() => utterance.onend?.(), 80);
          },
        },
      });
    });

    await openRoute(page, "/audio");
    await expect(page.getByRole("heading", { name: /Listen, read and understand/i })).toBeVisible();
    await expect(page.getByText(/browser-generated Tamil or English speech/i)).toBeVisible();
    await expect(page.locator(".audio-wave8__transcript [lang='ta']")).toBeVisible();

    const playButton = page.getByRole("button", { name: "Play reading aid" });
    await expect(playButton).toBeEnabled();
    await playButton.click();
    await expect(page.getByRole("status").filter({ hasText: /Playing Tamil browser-generated speech/ })).toBeVisible();
    await expect(page.getByRole("status").filter({ hasText: /Playback completed/ })).toBeVisible({ timeout: 2_000 });

    await page.getByRole("button", { name: "English" }).click();
    await expect(page.locator(".audio-wave8__transcript [lang='en']")).toContainText("Welcome to the DivyaNexus dawn study");
  });

  for (const viewport of [
    { width: 320, height: 800 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ]) {
    test(`audio and Tamil layouts avoid horizontal overflow at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      for (const route of ["/audio", "/rig-veda?record=rig-veda-1-42"]) {
        await openRoute(page, route);
        const dimensions = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
      }
    });
  }
});
