export const SPEECH_PREFERENCES_VERSION = 1 as const;
export const SPEECH_PREFERENCES_STORAGE_KEY = "divyanexus.speechPreferences.v1";

export type SpeechLanguage = "ta-IN" | "en-GB" | "sa-IN";

export type SpeechPreferences = {
  version: typeof SPEECH_PREFERENCES_VERSION;
  selectedItemId: string;
  rates: Record<string, number>;
  voices: Partial<Record<SpeechLanguage, string>>;
};

const supportedLanguages: SpeechLanguage[] = ["ta-IN", "en-GB", "sa-IN"];

export const DEFAULT_SPEECH_PREFERENCES: SpeechPreferences = {
  version: SPEECH_PREFERENCES_VERSION,
  selectedItemId: "",
  rates: {},
  voices: {},
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cleanIdentifier(value: unknown, maximumLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maximumLength) : "";
}

export function clampSpeechRate(value: unknown, fallback = 0.88) {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(1.2, Math.max(0.55, Math.round(numeric * 100) / 100));
}

export function sanitiseSpeechPreferences(value: unknown): SpeechPreferences {
  if (!isRecord(value) || value.version !== SPEECH_PREFERENCES_VERSION) return { ...DEFAULT_SPEECH_PREFERENCES };

  const rates: Record<string, number> = {};
  if (isRecord(value.rates)) {
    for (const [rawId, rawRate] of Object.entries(value.rates)) {
      const id = cleanIdentifier(rawId, 160);
      if (id) rates[id] = clampSpeechRate(rawRate);
    }
  }

  const voices: Partial<Record<SpeechLanguage, string>> = {};
  if (isRecord(value.voices)) {
    for (const language of supportedLanguages) {
      const voiceURI = cleanIdentifier(value.voices[language], 300);
      if (voiceURI) voices[language] = voiceURI;
    }
  }

  return {
    version: SPEECH_PREFERENCES_VERSION,
    selectedItemId: cleanIdentifier(value.selectedItemId, 160),
    rates,
    voices,
  };
}

export function readSpeechPreferences(): SpeechPreferences {
  if (typeof window === "undefined") return { ...DEFAULT_SPEECH_PREFERENCES };
  try {
    const stored = window.localStorage.getItem(SPEECH_PREFERENCES_STORAGE_KEY);
    return stored ? sanitiseSpeechPreferences(JSON.parse(stored)) : { ...DEFAULT_SPEECH_PREFERENCES };
  } catch {
    return { ...DEFAULT_SPEECH_PREFERENCES };
  }
}

export function writeSpeechPreferences(value: SpeechPreferences) {
  const next = sanitiseSpeechPreferences(value);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(SPEECH_PREFERENCES_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent("divyanexus-library-change"));
    } catch {
      // Storage may be unavailable in privacy modes. Speech remains usable for the current session.
    }
  }
  return next;
}
