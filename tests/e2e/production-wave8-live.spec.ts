import { expect, test, type Page } from "@playwright/test";

const expectedRelease = "stage-b-wave8";

async function installSpeechMock(page: Page) {
  await page.addInitScript(() => {
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
    const voices = [
      { name: "Tamil Production Test Voice", lang: "ta-IN", localService: true, default: true, voiceURI: "ta-live" },
      { name: "Sanskrit Production Test Voice", lang: "sa-IN", localService: true, default: false, voiceURI: "sa-live" },
      { name: "English Production Test Voice", lang: "en-GB", localService: true, default: false, voiceURI: "en-live" },
    ] as SpeechSynthesisVoice[];
    let speaking = false;
    let paused = false;
    let active: MockUtterance | null = null;
    const speech = {
      get speaking() { return speaking; },
      get paused() { return paused; },
      get pending() { return false; },
      getVoices: () => voices,
      speak: (utterance: MockUtterance) => { active = utterance; speaking = true; paused = false; utterance.onstart?.(); },
      cancel: () => { speaking = false; paused = false; active = null; },
      pause: () => { if (active) { paused = true; active.onpause?.(); } },
      resume: () => { if (active) { paused = false; active.onresume?.(); } },
      addEventListener: () => {},
      removeEventListener: () => {},
    };
    Object.defineProperty(window, "SpeechSynthesisUtterance", { configurable: true, value: MockUtterance });
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: speech });
  });
}

async function openLive(page: Page, route: string) {
  const response = await page.goto(`${route}${route.includes("?") ? "&" : "?"}live-evidence=${Date.now()}`, { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBeLessThan(400);
  await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 20_000 });
  await expect(page.locator("#root")).toHaveAttribute("data-divyanexus-version", expectedRelease);
  await expect(page.locator("html")).toHaveAttribute("data-divyanexus-boot", "ready");
  await expect(page.locator("#main-content")).toBeVisible();
}

test("live homepage renders the owner-selected artwork exactly once", async ({ page }) => {
  await openLive(page, "/");
  const panel = page.locator('[data-owner-artwork="active"]');
  await expect(panel).toHaveCount(1);
  await panel.scrollIntoViewIfNeeded();
  await expect(panel).toBeVisible();
  await expect(panel.getByRole("heading", { name: "A portal vision for timeless guidance" })).toBeVisible();
  const image = panel.locator("img");
  await expect(image).toHaveAttribute("src", "/assets/divyanexus/owner-selected-vision.webp");
  await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth >= 1200)).toBeTruthy();
  expect(await image.evaluate((element) => getComputedStyle(element).filter)).toContain("brightness");
});

test("live audio route exposes multilingual user-controlled playback", async ({ page }) => {
  await installSpeechMock(page);
  await openLive(page, "/audio");
  await expect(page.getByRole("heading", { name: /Read, listen, and compare/ })).toBeVisible();
  const controls = page.locator(".speech-controls").first();
  for (const label of ["Tamil meaning", "Sanskrit text", "IAST transliteration", "English meaning"]) {
    await expect(controls.getByRole("radio", { name: new RegExp(label) })).toBeVisible();
  }
  await expect(controls.getByRole("status")).toHaveText("Ready");
  await controls.getByRole("button", { name: "Play", exact: true }).click();
  await expect(controls.getByRole("status")).toHaveText("Speaking");
  await controls.getByRole("button", { name: "Stop" }).click();
  await expect(controls.getByRole("status")).toHaveText("Ready");
  await expect(controls).toContainText("No autoplay");
});

test("live Rig Veda reader exposes readable Tamil, word notes and embedded speech", async ({ page }) => {
  await installSpeechMock(page);
  await openLive(page, "/rig-veda?record=rig-veda-1-42");
  await expect(page.getByRole("heading", { name: "Rig Veda 1.42.1 · Pūṣan", exact: true })).toBeVisible();
  const tamil = page.locator(".reader-language-panel--tamil .reader-translation");
  await expect(tamil).toBeVisible();
  const style = await tamil.evaluate((element) => {
    const computed = getComputedStyle(element);
    return { family: computed.fontFamily, size: parseFloat(computed.fontSize), lineHeight: parseFloat(computed.lineHeight) };
  });
  expect(style.family).toContain("Noto Sans Tamil");
  expect(style.size).toBeGreaterThanOrEqual(18);
  expect(style.lineHeight).toBeGreaterThan(style.size * 1.65);
  await expect(page.locator(".reader-word-note__tamil")).toHaveCount(3);
  await page.getByRole("button", { name: "தமிழ் மட்டும்" }).click();
  await expect(page.locator(".reader-language-panel--english")).toBeHidden();
  await expect(page.locator("#reader-audio .speech-controls")).toBeVisible();
});

test("live Bhagavad Gita reader and direct route are healthy", async ({ page }) => {
  await installSpeechMock(page);
  await openLive(page, "/bhagavad-gita?record=gita-2-47");
  await expect(page.getByRole("heading", { name: "Bhagavad Gita 2.47", exact: true })).toBeVisible();
  await expect(page.locator(".reader-language-panel--tamil .reader-translation")).toContainText("உனக்குரிய உரிமை செயலில் மட்டுமே");
  await expect(page.locator("#reader-audio .speech-controls")).toBeVisible();
});

test("live Wave 8 routes have no horizontal overflow on a 390px phone", async ({ page }) => {
  await installSpeechMock(page);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/", "/audio", "/rig-veda?record=rig-veda-1-42", "/bhagavad-gita?record=gita-2-47"]) {
    await openLive(page, route);
    const width = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    expect(width.scroll, route).toBeLessThanOrEqual(width.client + 1);
  }
});
