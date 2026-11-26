import { describe, expect, it } from "vitest";
import { japaGoals, MANTRA_EDITORIAL_STATUS, mantraRecords, stepJapaCount } from "../../client/src/data/mantras";
import { mantraIds } from "../../client/src/data/mantraCatalog";

describe("DivyaNexus high-priority mantra candidate set", () => {
  it("preserves unique IDs, readable Tamil, transliteration, and descriptions", () => {
    expect(mantraRecords.length).toBeGreaterThanOrEqual(12);
    expect(new Set(mantraRecords.map((item) => item.id)).size).toBe(mantraRecords.length);
    expect(mantraIds).toEqual(mantraRecords.map((item) => item.id));
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

describe("Japa counter regression and source triage", () => {
  it("counts a full round without exceeding the goal", () => {
    let count = 0;
    for (let i = 0; i < 110; i++) count = stepJapaCount(count, 108, 1);
    expect(count).toBe(108);
    expect(stepJapaCount(count, 108, -1)).toBe(107);
    expect(stepJapaCount(0, 108, -1)).toBe(0);
  });
  it("preserves actual repetitions when the target is reduced", () => {
    expect(stepJapaCount(80, 21, 1)).toBe(80);
    expect(stepJapaCount(80, 21, -1)).toBe(79);
    expect(stepJapaCount(79, 108, 1)).toBe(80);
  });
  it("retains all 19 unique staged entries and the tradition-specific source", () => {
    expect(mantraRecords).toHaveLength(19);
    expect(mantraRecords.filter((item) => item.evidenceStatus === "linked-reference").length).toBeGreaterThanOrEqual(14);
    const records = new Map(mantraRecords.map((item) => [item.id, item]));
    expect(records.get("krishna-mahamantra")?.sourceUrl).toBe("https://iskcon.org/meditation/");
    expect(records.get("peace-asato")?.sourceUrl).toBe("https://heritage.iitk.ac.in/BRU/1.3.28");
    for (const id of ["murugan-skanda-sharanam", "murugan-shanmuga-sharanam", "murugan-sharanam"]) {
      expect(records.get(id)?.sourceUrl).toBe("https://omsaravanabhava.org/murugan-mantras.html");
    }
  });
});

