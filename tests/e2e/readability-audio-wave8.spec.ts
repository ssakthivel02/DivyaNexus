import { expect, test, type Page } from "@playwright/test";

type VoiceLanguage = "ta-IN" | "en-GB" | "sa-IN";

async function installSpeechMock(page: Page, languages: VoiceLanguage[] = ["ta-IN", "en-GB", "sa-IN"]) {
  await page.addInitScript((voiceLanguages) => {
    class MockUtterance {
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
    const names: Record<string, string> = { "ta-IN": "Tamil Test Voice", "en-GB": "English Test Voice", "sa-IN": "Sanskrit Test Voice" };
    const voices = voiceLanguages.map((lang, index) => ({ name: names[lang], lang, localService: true, default: index === 0, voiceURI: `${lang}-test` })) as SpeechSynthesisVoice[];
    let speaking = false;
    let paused = false;
    let active: MockUtterance | null = null;
    const speech = {
      get speaking() { return speaking; },
      get paused() { return paused; },
      get pending() { return false; },
      getVoices: () => voices,
      speak: (utterance: MockUtterance) => {
        active = utterance;
        speaking = true;
        paused = false;
        Object.defineProperty(window, "__lastSpeech", { configurable: true, value: utterance });
        utterance.onstart?.();
      },
      cancel: () => { speaking = false; paused = false; active = null; },
      pause: () => { if (active) { paused = true; active.onpause?.(); } },
      resume: () => { if (active) { paused = false; active.onresume?.(); } },
      addEventListener: () => {},
      removeEventListener: () => {},
    };
    Object.defineProperty(window, "SpeechSynthesisUtterance", { configurable: true, value: MockUtterance });
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: speech });
  }, languages);
}

async function openRoute(page: Page, route: string) {
  const response = await page.goto(route, { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBeLessThan(400);
  await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
  await expect(page.locator("#main-content")).toBeVisible();
}

test.describe("Wave 8 owner artwork and readability", () => {
  test("owner-selected visual appears once in its intended homepage section", async ({ page }) => {
    await openRoute(page, "/");
    const panel = page.locator('[data-owner-artwork="active"]');
    await expect(panel).toHaveCount(1);
    await panel.scrollIntoViewIfNeeded();
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute("id", "owner-portal-vision");
    await expect(panel.locator("img")).toHaveAttribute("src", "/assets/divyanexus/owner-selected-vision.webp");
    await expect.poll(() => panel.locator("img").evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBeTruthy();
  });

  test("Tamil text uses a readable cross-platform stack, size and line height", async ({ page }) => {
    await openRoute(page, "/rig-veda?record=rig-veda-1-42");
    const tamil = page.locator(".reader-translation[lang='ta']").first();
    await expect(tamil).toBeVisible();
    const style = await tamil.evaluate((element) => {
      const computed = getComputedStyle(element);
      return { fontFamily: computed.fontFamily, fontSize: parseFloat(computed.fontSize), lineHeight: parseFloat(computed.lineHeight), color: computed.color };
    });
    expect(style.fontFamily).toContain("Noto Sans Tamil");
    expect(style.fontFamily).toContain("Nirmala UI");
    expect(style.fontSize).toBeGreaterThanOrEqual(18);
    expect(style.lineHeight).toBeGreaterThan(style.fontSize * 1.65);
    expect(style.color).not.toBe("rgb(157, 163, 192)");
  });

  test("reader switches between Tamil, English and bilingual modes", async ({ page }) => {
    await openRoute(page, "/rig-veda?record=rig-veda-1-42");
    await page.getByRole("button", { name: "தமிழ் மட்டும்" }).click();
    await expect(page.locator(".reader-language-panel--tamil").first()).toBeVisible();
    await expect(page.locator(".reader-language-panel--english").first()).toBeHidden();
    await page.getByRole("button", { name: "English only" }).click();
    await expect(page.locator(".reader-language-panel--tamil").first()).toBeHidden();
    await expect(page.locator(".reader-language-panel--english").first()).toBeVisible();
    await page.getByRole("button", { name: "Tamil + English" }).click();
    await expect(page.locator(".reader-language-panel--tamil").first()).toBeVisible();
    await expect(page.locator(".reader-language-panel--english").first()).toBeVisible();
  });

  test("verified word notes expose Tamil meanings", async ({ page }) => {
    await openRoute(page, "/rig-veda?record=rig-veda-1-42");
    await expect(page.locator(".reader-word-note__tamil")).toHaveCount(3);
    await expect(page.locator(".reader-word-note__tamil").first()).toContainText("வேதத் தெய்வம்");
  });
});

test.describe("Wave 8 multilingual speech", () => {
  test.beforeEach(async ({ page }) => installSpeechMock(page));

  test("audio does not autoplay and supports play, pause, resume and stop", async ({ page }) => {
    await openRoute(page, "/audio");
    const controls = page.locator(".speech-controls").first();
    await expect(controls.getByRole("status")).toHaveText("Ready");
    expect(await page.evaluate(() => "__lastSpeech" in window)).toBe(false);
    await controls.getByRole("button", { name: "Play", exact: true }).click();
    await expect(controls.getByRole("status")).toHaveText("Speaking");
    await controls.getByRole("button", { name: "Pause" }).click();
    await expect(controls.getByRole("status")).toHaveText("Paused");
    await controls.getByRole("button", { name: "Resume" }).click();
    await expect(controls.getByRole("status")).toHaveText("Speaking");
    await controls.getByRole("button", { name: "Stop" }).click();
    await expect(controls.getByRole("status")).toHaveText("Ready");
  });

  test("reader exposes Tamil, Sanskrit, transliteration and English speech with recommended rates", async ({ page }) => {
    await openRoute(page, "/rig-veda?record=rig-veda-1-1-1");
    const controls = page.locator("#reader-audio .speech-controls");
    const speed = controls.getByRole("slider");
    for (const label of ["Tamil meaning", "Sanskrit text", "IAST transliteration", "English meaning"]) await expect(controls.getByRole("radio", { name: new RegExp(label) })).toBeVisible();
    await controls.getByRole("radio", { name: /Tamil meaning/ }).click();
    await expect(speed).toHaveValue("0.82");
    await expect(controls.locator(".speech-controls__transcript")).toHaveAttribute("lang", "ta");
    await controls.getByRole("radio", { name: /Sanskrit text/ }).click();
    await expect(speed).toHaveValue("0.72");
    await expect(controls.locator(".speech-controls__voice")).toContainText("matching sa-IN voice is available");
    await controls.getByRole("button", { name: "Play", exact: true }).click();
    const utterance = await page.evaluate(() => {
      const value = (window as typeof window & { __lastSpeech?: { lang: string; rate: number; text: string } }).__lastSpeech;
      return value ? { lang: value.lang, rate: value.rate, length: value.text.length } : null;
    });
    expect(utterance).toMatchObject({ lang: "sa-IN", rate: 0.72 });
    expect(utterance?.length).toBeGreaterThan(10);
  });

  test("audio record links route each source to the correct reader", async ({ page }) => {
    await openRoute(page, "/audio");
    await expect(page.getByRole("link", { name: /Open the full reader/ })).toHaveAttribute("href", "/rig-veda?record=rig-veda-1-1-1");
    await page.getByRole("tab", { name: /Gita action verse/ }).click();
    await expect(page.getByRole("link", { name: /Open the full reader/ })).toHaveAttribute("href", "/bhagavad-gita?record=gita-2-47");
  });
});

test("speech explains fallback behaviour when a Tamil voice is unavailable", async ({ page }) => {
  await installSpeechMock(page, ["en-GB"]);
  await openRoute(page, "/audio");
  await expect(page.locator(".speech-controls__voice").first()).toContainText("No matching ta-IN voice was reported");
});

for (const viewport of [{ width: 320, height: 800 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }]) {
  test(`audio and reader avoid horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    await installSpeechMock(page);
    await page.setViewportSize(viewport);
    for (const route of ["/audio", "/rig-veda?record=rig-veda-1-42"]) {
      await openRoute(page, route);
      const dimensions = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
      expect(dimensions.scrollWidth, route).toBeLessThanOrEqual(dimensions.clientWidth + 1);
    }
  });
}
