import { describe, expect, it } from "vitest";
import { japaGoals, MANTRA_EDITORIAL_STATUS, mantraRecords } from "../../client/src/data/mantras";

describe("DivyaNexus high-priority mantra candidate set", () => {
  it("preserves unique IDs, readable Tamil, transliteration, and descriptions", () => {
    expect(mantraRecords.length).toBeGreaterThanOrEqual(12);
    expect(new Set(mantraRecords.map((item) => item.id)).size).toBe(mantraRecords.length);
    for (const mantra of mantraRecords) {
      expect(mantra.id).toMatch(/^[a-z0-9-]+$/);
      expect(mantra.title.trim().length).toBeGreaterThan(3);
      expect(mantra.tamil.trim().length).toBeGreaterThan(3);
      expect(mantra.iast.trim().length).toBeGreaterThan(3);
      expect(mantra.englishMeaning.trim().length).toBeGreaterThan(12);
      expect(mantra.tamilMeaning.trim().length).toBeGreaterThan(8);
      expect(["linked-reference", "editorial-review-needed"]).toContain(mantra.evidenceStatus);
    }
  });

  it("does not masquerade uncited invocations as source-linked scripture", () => {
    for (const mantra of mantraRecords) {
      if (mantra.evidenceStatus === "linked-reference") {
        expect(mantra.sourceUrl).toMatch(/^https:\/\//);
      } else {
        expect(mantra.sourceUrl).toBe("");
        expect(mantra.sourceLabel.toLowerCase()).toMatch(/pending|needed/);
      }
    }
    expect(MANTRA_EDITORIAL_STATUS).toMatch(/not yet approved/);
  });

  it("keeps the initial Murugan chant available and japa targets bounded", () => {
    expect(mantraRecords.some((item) => item.id === "murugan-saravanabhava" && item.tamil === "ஓம் சரவணபவ")).toBe(true);
    expect(japaGoals).toEqual([11, 21, 54, 108, 1008]);
  });

  it("keeps scriptural leads traceable at verse level", () => {
    const records = new Map(mantraRecords.map((item) => [item.id, item]));
    expect(records.get("surya-gayatri")?.sourceLabel).toContain("3.62.10");
    expect(records.get("shiva-mahamrityunjaya")?.sourceLabel).toContain("7.59.12");
    expect(records.get("peace-asato")?.sourceLabel).toContain("1.3.28");
  });
});
