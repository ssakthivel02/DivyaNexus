import { describe, expect, it } from "vitest";
import {
  templeConditionLabel,
  templeIntelligenceRecords,
  templeVerificationLabel,
} from "../../client/src/data/templeIntelligence";

describe("Wave 10 temple intelligence truth boundaries", () => {
  it("uses stable unique ids", () => {
    const ids = templeIntelligenceRecords.map((record) => record.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("does not claim verified source records without verified governance or official support", () => {
    for (const record of templeIntelligenceRecords) {
      if (record.verification !== "verified") {
        expect(templeVerificationLabel(record)).not.toBe("Verified source record");
      }
      if (!record.governance.verified) {
        expect(record.governance.authorityName).toBeNull();
      }
    }
  });

  it("does not invent official links while source review is pending", () => {
    for (const record of templeIntelligenceRecords) {
      if (record.verification !== "verified") {
        expect(record.officialSupport.officialWebsite).toBeNull();
        expect(record.officialSupport.donationUrl).toBeNull();
        expect(record.officialSupport.visitorInfoUrl).toBeNull();
      }
    }
  });

  it("keeps present-day condition distinct from historical context", () => {
    const historical = templeIntelligenceRecords.find((record) => record.condition === "historical-context-only");
    expect(historical).toBeTruthy();
    expect(templeConditionLabel(historical!)).toBe("Historical context only");

    for (const record of templeIntelligenceRecords.filter((item) => item.condition !== "current-condition-verified")) {
      expect(templeConditionLabel(record)).not.toBe("Current condition verified");
    }
  });

  it("requires a human-readable verification note on every record", () => {
    for (const record of templeIntelligenceRecords) {
      expect(record.verificationNote.trim().length).toBeGreaterThan(40);
    }
  });
});
