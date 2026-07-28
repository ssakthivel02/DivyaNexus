import { expect, test } from "@playwright/test";

async function installSpeechMock(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    class MockSpeechSynthesisUtterance {
      text: string;
      lang = "";
      rate = 1;
      pitch = 1;
      voice: SpeechSynthesisVoice | null = null;
      onstart: (() => void) | null = null;
      onpause: (() => void) | null = null;
      onresume: (() => void) | null = null;
      onend: (() => void) | null = null;
      onerror: ((event: { error: string }) => void) | null = null;
      constructor(text: string) { this.text = text; }
    }

    const voices = [
      { name: "Tamil Test Voice", lang: "ta-IN", localService: true, default: false, voiceURI: "ta-test" },
      { name: "English Test Voice", lang: "en-GB", localService: true, default: true, voiceURI: "en-test" },
      { name: "Sanskrit Test Voice", lang: "sa-IN", localService: true, default: false, voiceURI: "sa-test" },
    ] as SpeechSynthesisVoice[];

    let speaking = false;
    let paused = false;
    let active: MockSpeechSynthesisUtterance | null = null;
    const listeners = new Map<string, Set<() => void>>();

    const speechSynthesisMock = {
      get speaking() { return speaking; },
      get paused() { return paused; },
      get pending() { return false; },
      get onvoiceschanged() { return null; },
      set onvoiceschanged(_value: unknown) {},
      getVoices: () => voices,
      speak: (utterance: MockSpeechSynthesisUtterance) => {
        active = utterance;
        speaking = true;
        paused = false;
        utterance.onstart?.();
      },
      cancel: () => {
        speaking = false;
        paused = false;
        active = null;
      },
      pause: () => {
        if (!active) return;
        paused = true;
        speaking = true;
        active.onpause?.();
      },
      resume: () => {
        if (!active) return;
        paused = false;
        speaking = true;
        active.onresume?.();
      },
      addEventListener: (name: string, listener: () => void) => {
        const set = listeners.get(name) ?? new Set();
        set.add(listener);
        listeners.set(name, set);
      },
      removeEventListener: (name: string, listener: () => void) => listeners.get(name)?.delete(listener),
      dispatchEvent: () => true,
    };

    Object.defineProperty(window, "SpeechSynthesisUtterance", { configurable: true, value: MockSpeechSynthesisUtterance });
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: speechSynthesisMock });
  });
}

test.describe("Wave 8 visible artwork and readability", () => {
  test("owner-selected portal visual is rendered on the homepage", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const panel = page.locator('[data-owner-artwork="active"]');
    await panel.scrollIntoViewIfNeeded();
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute("id", "owner-portal-vision");
    const image = panel.locator("img");
    await expect(image).toHaveAttribute("src", "/assets/divyanexus/owner-selected-vision.webp");
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBeTruthy();
  });

  test("Tamil reader text uses a readable Tamil font and enlarged line height", async ({ page }) => {
    await page.goto("/rig-veda?record=rig-veda-1-42", { waitUntil: "domcontentloaded" });
    const tamil = page.locator(".reader-translation[lang='ta']").first();
    await expect(tamil).toBeVisible();
    const style = await tamil.evaluate((element) => {
      const computed = getComputedStyle(element);
      return { fontFamily: computed.fontFamily, fontSize: parseFloat(computed.fontSize), lineHeight: parseFloat(computed.lineHeight) };
    });
    expect(style.fontFamily).toContain("Noto Sans Tamil");
    expect(style.fontSize).toBeGreaterThanOrEqual(18);
    expect(style.lineHeight).toBeGreaterThan(style.fontSize * 1.65);
  });

  test("reader language focus switches between Tamil and English", async ({ page }) => {
    await page.goto("/rig-veda?record=rig-veda-1-42", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "தமிழ் மட்டும்" }).click();
    await expect(page.locator(".reader-language-panel--tamil").first()).toBeVisible();
    await expect(page.locator(".reader-language-panel--english").first()).toBeHidden();
    await page.getByRole("button", { name: "English only" }).click();
    await expect(page.locator(".reader-language-panel--english").first()).toBeVisible();
    await expect(page.locator(".reader-language-panel--tamil").first()).toBeHidden();
  });
});

test.describe("Wave 8 working audio", () => {
  test.beforeEach(async ({ page }) => installSpeechMock(page));

  test("audio page plays, pauses, resumes and stops synthetic speech", async ({ page }) => {
    await page.goto("/audio", { waitUntil: "domcontentloaded" });
    const controls = page.locator(".speech-controls").first();
    await expect(controls).toBeVisible();
    await controls.getByRole("button", { name: "Play", exact: true }).click();
    await expect(controls.getByRole("status")).toHaveText("Speaking");
    await controls.getByRole("button", { name: "Pause" }).click();
    await expect(controls.getByRole("status")).toHaveText("Paused");
    await controls.getByRole("button", { name: "Resume" }).click();
    await expect(controls.getByRole("status")).toHaveText("Speaking");
    await controls.getByRole("button", { name: "Stop" }).click();
    await expect(controls.getByRole("status")).toHaveText("Ready");
  });

  test("reader provides Tamil, Sanskrit, transliteration and English speech choices", async ({ page }) => {
    await page.goto("/rig-veda?record=rig-veda-1-1-1", { waitUntil: "domcontentloaded" });
    const controls = page.locator("#reader-audio .speech-controls");
    await expect(controls).toBeVisible();
    for (const label of ["Tamil meaning", "Sanskrit text", "IAST transliteration", "English meaning"]) {
      await expect(controls.getByRole("radio", { name: new RegExp(label) })).toBeVisible();
    }
    await controls.getByRole("radio", { name: /Tamil meaning/ }).click();
    await controls.getByRole("button", { name: "Play", exact: true }).click();
    await expect(controls.getByRole("status")).toHaveText("Speaking");
  });
});

for (const viewport of [
  { width: 320, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
]) {
  test(`audio and reader avoid horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    await installSpeechMock(page);
    await page.setViewportSize(viewport);
    for (const route of ["/audio", "/rig-veda?record=rig-veda-1-42"]) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const dimensions = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(dimensions.scrollWidth, route).toBeLessThanOrEqual(dimensions.clientWidth + 1);
    }
  });
}
