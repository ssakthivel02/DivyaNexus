import { describe, expect, it } from "vitest";
import { records } from "../../client/src/data/content";
import { evidenceStrengthOrder, provenanceObjects } from "../../client/src/data/provenance";
import { evidenceLabel, rankRecordsByProvenance } from "../../client/src/lib/provenanceSearch";

describe("Wave 10 provenance evidence model", () => {
  it("registers provenance only against known repository records", () => {
    const known = new Set(records.map((record) => record.id));
    for (const item of provenanceObjects) expect(known.has(item.recordId)).toBe(true);
  });

  it("keeps evidence levels ordered without claiming unlinked primary evidence", () => {
    expect(evidenceStrengthOrder["primary-reference"]).toBeGreaterThan(evidenceStrengthOrder["editorial-source-needed"]);
    expect(evidenceStrengthOrder["editorial-source-needed"]).toBeGreaterThan(evidenceStrengthOrder["editorial-overview"]);
    expect(provenanceObjects.some((item) => item.strength === "primary-reference")).toBe(false);
  });

  it("requires bilingual evidence notes and explicit review state", () => {
    for (const item of provenanceObjects) {
      expect(item.evidenceNote.length).toBeGreaterThan(60);
      expect(item.tamilEvidenceNote.length).toBeGreaterThan(20);
      expect(["source-edition-needed", "editorial-reviewed"]).toContain(item.reviewState);
    }
  });

  it("ranks only matching records and uses provenance as a bounded boost", () => {
    const ranked = rankRecordsByProvenance(records, "dharma");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked.every((result) => result.matchScore > 0)).toBe(true);
    expect(ranked.every((result) => result.evidenceScore <= 15)).toBe(true);
  });

  it("communicates evidence state without overstating review", () => {
    const gita = provenanceObjects.find((item) => item.recordId === "gita-2-47");
    expect(evidenceLabel(gita)).toBe("Reference present · source edition needed");
    expect(evidenceLabel(undefined)).toBe("Provenance not yet registered");
  });
});
