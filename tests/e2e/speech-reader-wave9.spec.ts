import { expect, test, type Page } from "@playwright/test";

type MockVoice = { name: string; lang: string; voiceURI: string; default?: boolean };

type SpeechMockOptions = {
  supported?: boolean;
  initialVoices?: MockVoice[];
  delayedVoices?: MockVoice[];
};

async function installSpeechMock(page: Page, options: SpeechMockOptions = {}) {
  await page.addInitScript((configuration) => {
    if (configuration.supported === false) {
      Object.defineProperty(window, "speechSynthesis", { configurable: true, value: undefined });
      Object.defineProperty(window, "SpeechSynthesisUtterance", { configurable: true, value: undefined });
      return;
    }

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

    const toSpeechVoice = (voice: MockVoice) => ({
      name: voice.name,
      lang: voice.lang,
      voiceURI: voice.voiceURI,
      default: Boolean(voice.default),
      localService: true,
    }) as SpeechSynthesisVoice;

    let voices = (configuration.initialVoices ?? [
      { name: "Tamil Voice A", lang: "ta-IN", voiceURI: "ta-a", default: true },
      { name: "Tamil Voice B", lang: "ta-IN", voiceURI: "ta-b" },
      { name: "English Voice", lang: "en-GB", voiceURI: "en-a" },
      { name: "Sanskrit Voice", lang: "sa-IN", voiceURI: "sa-a" },
    ]).map(toSpeechVoice);
    const delayed = (configuration.delayedVoices ?? []).map(toSpeechVoice);
    const voiceListeners = new Set<() => void>();
    let active: MockUtterance | null = null;
    let speaking = false;
    let paused = false;
    let speakCount = 0;
    let cancelCount = 0;

    const speech = {
      get speaking() { return speaking; },
      get paused() { return paused; },
      get pending() { return false; },
      getVoices: () => voices,
      speak: (utterance: MockUtterance) => {
        active = utterance;
        speaking = true;
        paused = false;
        speakCount += 1;
        utterance.onstart?.();
      },
      cancel: () => {
        cancelCount += 1;
        active = null;
        speaking = false;
        paused = false;
      },
      pause: () => {
        if (!active) return;
        paused = true;
        active.onpause?.();
      },
      resume: () => {
        if (!active) return;
        paused = false;
        active.onresume?.();
      },
      addEventListener: (name: string, listener: () => void) => {
        if (name === "voiceschanged") voiceListeners.add(listener);
      },
      removeEventListener: (name: string, listener: () => void) => {
        if (name === "voiceschanged") voiceListeners.delete(listener);
      },
    };

    Object.defineProperty(window, "SpeechSynthesisUtterance", { configurable: true, value: MockUtterance });
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: speech });
    Object.defineProperty(window, "__speechMock", {
      configurable: true,
      value: {
        releaseVoices: () => {
          voices = delayed;
          voiceListeners.forEach((listener) => listener());
        },
        counts: () => ({ speakCount, cancelCount }),
      },
    });
  }, options);
}

async function openRoute(page: Page, route: string) {
  const response = await page.goto(route, { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBeLessThan(400);
  await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
  await expect(page.locator("#main-content")).toBeVisible();
}

test("audio room tabs support arrow, Home and End keyboard navigation", async ({ page }) => {
  await installSpeechMock(page);
  await openRoute(page, "/audio");
  const tabs = page.getByRole("tab");
  await tabs.nth(0).focus();
  await page.keyboard.press("End");
  await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
  await expect(tabs.nth(2)).toBeFocused();
  await page.keyboard.press("Home");
  await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowDown");
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
});

test("voice and speed choices persist through a reload", async ({ page }) => {
  await installSpeechMock(page);
  await openRoute(page, "/audio");
  const controls = page.locator(".speech-controls").first();
  await controls.getByLabel("Device voice").selectOption("ta-b");
  await controls.getByRole("slider").fill("0.95");
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
  await expect(page.locator(".speech-controls").first().getByLabel("Device voice")).toHaveValue("ta-b");
  await expect(page.locator(".speech-controls").first().getByRole("slider")).toHaveValue("0.95");
});

test("unsupported browsers show transcript-first guidance", async ({ page }) => {
  await installSpeechMock(page, { supported: false });
  await openRoute(page, "/audio");
  const controls = page.locator(".speech-controls").first();
  await expect(controls.locator(".speech-controls__unsupported")).toContainText("Audio is unavailable");
  await expect(controls.getByRole("button", { name: "Play", exact: true })).toBeDisabled();
  await expect(controls.locator(".speech-controls__transcript")).toBeVisible();
  await expect(controls.getByRole("status")).toHaveText("Not supported");
});

test("delayed browser voices are discovered through voiceschanged", async ({ page }) => {
  await installSpeechMock(page, {
    initialVoices: [],
    delayedVoices: [
      { name: "Delayed Tamil A", lang: "ta-IN", voiceURI: "delayed-ta-a", default: true },
      { name: "Delayed Tamil B", lang: "ta-IN", voiceURI: "delayed-ta-b" },
    ],
  });
  await openRoute(page, "/audio");
  await expect(page.locator(".speech-controls__voice").first()).toContainText("No matching ta-IN voice");
  await page.evaluate(() => (window as typeof window & { __speechMock: { releaseVoices: () => void } }).__speechMock.releaseVoices());
  await expect(page.locator(".speech-controls").first().getByLabel("Device voice")).toBeVisible();
});

test("changing rooms cancels active speech and prevents overlap", async ({ page }) => {
  await installSpeechMock(page);
  await openRoute(page, "/audio");
  const controls = page.locator(".speech-controls").first();
  await controls.getByRole("button", { name: "Play", exact: true }).click();
  const before = await page.evaluate(() => (window as typeof window & { __speechMock: { counts: () => { cancelCount: number } } }).__speechMock.counts().cancelCount);
  await page.getByRole("tab", { name: /Gita action verse/ }).click();
  const after = await page.evaluate(() => (window as typeof window & { __speechMock: { counts: () => { cancelCount: number } } }).__speechMock.counts().cancelCount);
  expect(after).toBeGreaterThan(before);
  await expect(page.locator("[data-active-room='gita']")).toBeVisible();
});

test("reader language and selected record survive navigation and reload", async ({ page }) => {
  await installSpeechMock(page);
  await openRoute(page, "/rig-veda?record=rig-veda-1-1-1");
  await page.getByRole("button", { name: /Next/ }).click();
  await expect(page).toHaveURL(/record=rig-veda-1-42/);
  await page.getByRole("button", { name: "தமிழ் மட்டும்" }).click();
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
  await expect(page.locator(".reader-language-panel--tamil").first()).toBeVisible();
  await expect(page.locator(".reader-language-panel--english").first()).toBeHidden();
  await expect(page.locator("#main-content")).toHaveAttribute("data-reader-language", "tamil");
});

test("Wave 9 controls avoid horizontal overflow on a 320px viewport", async ({ page }) => {
  await installSpeechMock(page);
  await page.setViewportSize({ width: 320, height: 800 });
  for (const route of ["/audio", "/rig-veda?record=rig-veda-1-1-1"]) {
    await openRoute(page, route);
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.scrollWidth, route).toBeLessThanOrEqual(dimensions.clientWidth + 1);
  }
});
