import { describe, expect, it } from "vitest";
import {
  clampSpeechRate,
  DEFAULT_SPEECH_PREFERENCES,
  sanitiseSpeechPreferences,
  SPEECH_PREFERENCES_VERSION,
} from "../../client/src/lib/speechPreferences";

describe("speech preference validation", () => {
  it("rejects unknown schema versions", () => {
    expect(sanitiseSpeechPreferences({ version: 999, selectedItemId: "unsafe" })).toEqual(DEFAULT_SPEECH_PREFERENCES);
  });

  it("clamps rates and keeps only supported language voice identifiers", () => {
    const result = sanitiseSpeechPreferences({
      version: SPEECH_PREFERENCES_VERSION,
      selectedItemId: "  rig-veda-1-1-1-tamil  ",
      rates: {
        "rig-veda-1-1-1-tamil": 4,
        "rig-veda-1-1-1-english": 0.1,
        invalid: "not-a-number",
      },
      voices: {
        "ta-IN": " tamil-local-voice ",
        "en-GB": "english-local-voice",
        "fr-FR": "must-not-survive",
      },
    });

    expect(result.selectedItemId).toBe("rig-veda-1-1-1-tamil");
    expect(result.rates["rig-veda-1-1-1-tamil"]).toBe(1.2);
    expect(result.rates["rig-veda-1-1-1-english"]).toBe(0.55);
    expect(result.rates.invalid).toBe(0.88);
    expect(result.voices).toEqual({
      "ta-IN": "tamil-local-voice",
      "en-GB": "english-local-voice",
    });
  });

  it("normalises finite rates to two decimal places", () => {
    expect(clampSpeechRate(0.8234)).toBe(0.82);
    expect(clampSpeechRate(1.199)).toBe(1.2);
    expect(clampSpeechRate(Number.NaN, 0.72)).toBe(0.72);
  });
});
