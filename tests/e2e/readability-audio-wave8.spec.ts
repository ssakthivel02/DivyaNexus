import { expect, test, type Page } from "@playwright/test";

type MockVoiceLanguage = "ta-IN" | "en-GB" | "sa-IN";

async function installSpeechMock(page: Page, voiceLanguages: MockVoiceLanguage[] = ["ta-IN", "en-GB", "sa-IN"]) {
  await page.addInitScript((languages) => {
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

    const voiceNames: Record<string, string> = {
      "ta-IN": "Tamil Test Voice",
      "en-GB": "English Test Voice",
      "sa-IN": "Sanskrit Test Voice",
    };
    const voices = languages.map((lang, index) => ({
      name: voiceNames[lang] ?? `${lang} Test Voice`,
      lang,
      localService: true,
      default: index === 0,
      voiceURI: `${lang}-test`,
    })) as SpeechSynthesisVoice[];

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
        Object.defineProperty(window, "__divyanexusLastUtterance", { configurable: true, value: utterance });
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
  }, voiceLanguages);
}

test.describe("Wave 8 visible artwork and readability", () => {
  test("owner-selected portal visual is rendered once, loaded and visibly brightened", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const panel = page.locator('[data-owner-artwork="active"]');
    await expect(panel).toHaveCount(1);
    await panel.scrollIntoViewIfNeeded();
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute("id", "owner-portal-vision");
    const image = panel.locator("img");
    await expect(image).toHaveAttribute("src", "/assets/divyanexus/owner-selected-vision.webp");
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBeTruthy();
    const filter = await image.evaluate((element) => getComputedStyle(element).filter);
    expect(filter).toContain("brightness");
  });

  test("Tamil reader text uses a readable cross-platform Tamil stack and enlarged line height", async ({ page }) => {
    await page.goto("/rig-veda?record=rig-veda-1-42", { waitUntil: "domcontentloaded" });
    const tamil = page.locator(".reader-translation[lang='ta']").first();
    await expect(tamil).toBeVisible();
    const style = await tamil.evaluate((element) => {
      const computed = getComputedStyle(element);
      return { fontFamily: computed.fontFamily, fontSize: parseFloat(computed.fontSize), lineHeight: parseFloat(computed.lineHeight) };
    });
    expect(style.fontFamily).toContain("Noto Sans Tamil");
    expect(style.fontFamily).toContain("Nirmala UI");
    expect(style.fontSize).toBeGreaterThanOrEqual(18);
    expect(style.lineHeight).toBeGreaterThan(style.fontSize * 1.65);
  });

  test("reader language focus switches between Tamil, English and bilingual display", async ({ page }) => {
    await page.goto("/rig-veda?record=rig-veda-1-42", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "தமிழ் மட்டும்" }).click();
    await expect(page.locator(".reader-language-panel--tamil").first()).toBeVisible();
    await expect(page.locator(".reader-language-panel--english").first()).toBeHidden();
    await page.getByRole("button", { name: "English only" }).click();
    await expect(page.locator(".reader-language-panel--english").first()).toBeVisible();
    await expect(page.locator(".reader-language-panel--tamil").first()).toBeHidden();
    await page.getByRole("button", { name: "Tamil + English" }).click();
    await expect(page.locator(".reader-language-panel--english").first()).toBeVisible();
    await expect(page.locator(".reader-language-panel--tamil").first()).toBeVisible();
  });
});

test.describe("Wave 8 working audio", () => {
  test.beforeEach(async ({ page }) => installSpeechMock(page));

  test("audio page does not autoplay and supports play, pause, resume and stop", async ({ page }) => {
    await page.goto("/audio", { waitUntil: "domcontentloaded" });
    const controls = page.locator(".speech-controls").first();
    await expect(controls).toBeVisible();
    await expect(controls.getByRole("status")).toHaveText("Ready");
    expect(await page.evaluate(() => "__divyanexusLastUtterance" in window)).toBe(false);
    await controls.getByRole("button", { name: "Play", exact: true }).click();
    await expect(controls.getByRole("status")).toHaveText("Speaking");
    await controls.getByRole("button", { name: "Pause" }).click();
    await expect(controls.getByRole("status")).toHaveText("Paused");
    await controls.getByRole("button", { name: "Resume" }).click();
    await expect(controls.getByRole("status")).toHaveText("Speaking");
    await controls.getByRole("button", { name: "Stop" }).click();
    await expect(controls.getByRole("status")).toHaveText("Ready");
  });

  test("language choices apply recommended rates, visible transcripts and matching voices", async ({ page }) => {
    await page.goto("/rig-veda?record=rig-veda-1-1-1", { waitUntil: "domcontentloaded" });
    const controls = page.locator("#reader-audio .speech-controls");
    await expect(controls).toBeVisible();
    for (const label of ["Tamil meaning", "Sanskrit text", "IAST transliteration", "English meaning"]) {
      await expect(controls.getByRole("radio", { name: new RegExp(label) })).toBeVisible();
    }

    const speed = controls.getByRole("slider");
    await controls.getByRole("radio", { name: /Tamil meaning/ }).click();
    await expect(speed).toHaveValue("0.82");
    await expect(controls.locator(".speech-controls__transcript")).toHaveAttribute("lang", "ta");

    await controls.getByRole("radio", { name: /Sanskrit text/ }).click();
    await expect(speed).toHaveValue("0.72");
    await expect(controls.locator(".speech-controls__voice")).toContainText("matching sa-IN voice is available");
    await speed.fill("1.12");
    await controls.getByRole("button", { name: "Reset speed" }).click();
    await expect(speed).toHaveValue("0.72");

    await controls.getByRole("button", { name: "Play", exact: true }).click();
    await expect(controls.getByRole("status")).toHaveText("Speaking");
    const utterance = await page.evaluate(() => {
      const current = (window as typeof window & { __divyanexusLastUtterance?: { lang: string; rate: number; text: string } }).__divyanexusLastUtterance;
      return current ? { lang: current.lang, rate: current.rate, textLength: current.text.length } : null;
    });
    expect(utterance).toMatchObject({ lang: "sa-IN", rate: 0.72 });
    expect(utterance?.textLength).toBeGreaterThan(10);
  });

  test("audio record links route Rig Veda and Gita entries to the correct reader", async ({ page }) => {
    await page.goto("/audio", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("link", { name: /Open the full reader/ })).toHaveAttribute("href", "/rig-veda?record=rig-veda-1-1-1");
    await page.getByRole("tab", { name: /Gita action verse/ }).click();
    await expect(page.getByRole("link", { name: /Open the full reader/ })).toHaveAttribute("href", "/bhagavad-gita?record=gita-2-47");
  });
});

test("speech controls explain fallback voice behaviour when Tamil voice is unavailable", async ({ page }) => {
  await installSpeechMock(page, ["en-GB"]);
  await page.goto("/audio", { waitUntil: "domcontentloaded" });
  const controls = page.locator(".speech-controls").first();
  await expect(controls.locator(".speech-controls__voice")).toContainText("No matching ta-IN voice was reported");
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
