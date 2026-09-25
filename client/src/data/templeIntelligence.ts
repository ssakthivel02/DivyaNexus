export type TempleVerificationState = "verified" | "source-review-needed" | "not-collected";
export type TempleConditionState = "current-condition-verified" | "historical-context-only" | "not-verified";

export type TempleIntelligenceRecord = {
  id: string;
  title: string;
  tamilTitle: string;
  focus: string;
  verification: TempleVerificationState;
  condition: TempleConditionState;
  governance: {
    authorityName: string | null;
    authorityType: "government-board" | "temple-trust" | "institution" | "unknown";
    verified: boolean;
  };
  officialSupport: {
    officialWebsite: string | null;
    donationUrl: string | null;
    visitorInfoUrl: string | null;
  };
  verificationNote: string;
};

/**
 * Wave 10 starts with schema-first temple intelligence.
 * These entries intentionally describe knowledge pathways, not real-world operating facts.
 * Timings, prices, condition, governance and support links must stay null/unverified until
 * a source-backed acquisition record passes review.
 */
export const templeIntelligenceRecords: readonly TempleIntelligenceRecord[] = [
  {
    id: "temple-knowledge",
    title: "Temple knowledge",
    tamilTitle: "திருக்கோவில் அறிவு",
    focus: "Architecture & tradition",
    verification: "source-review-needed",
    condition: "not-verified",
    governance: { authorityName: null, authorityType: "unknown", verified: false },
    officialSupport: { officialWebsite: null, donationUrl: null, visitorInfoUrl: null },
    verificationNote: "Architecture and cultural context may be explored editorially; current visitor facts require location-level source review.",
  },
  {
    id: "pilgrimage-context",
    title: "Pilgrimage context",
    tamilTitle: "யாத்திரைச் சூழல்",
    focus: "Context-first study",
    verification: "source-review-needed",
    condition: "not-verified",
    governance: { authorityName: null, authorityType: "unknown", verified: false },
    officialSupport: { officialWebsite: null, donationUrl: null, visitorInfoUrl: null },
    verificationNote: "Regional practice and pilgrimage context remain educational until a current official source is registered for a specific site.",
  },
  {
    id: "sacred-landscape",
    title: "Sacred landscape",
    tamilTitle: "புனித நிலப்பரப்பு",
    focus: "Cultural learning",
    verification: "source-review-needed",
    condition: "historical-context-only",
    governance: { authorityName: null, authorityType: "unknown", verified: false },
    officialSupport: { officialWebsite: null, donationUrl: null, visitorInfoUrl: null },
    verificationNote: "Landscape and material-heritage context can be studied without implying that present-day access, conservation condition or management has been verified.",
  },
] as const;

export function templeVerificationLabel(record: TempleIntelligenceRecord) {
  if (record.verification === "verified") return "Verified source record";
  if (record.verification === "source-review-needed") return "Source review needed";
  return "Not yet collected";
}

export function templeConditionLabel(record: TempleIntelligenceRecord) {
  if (record.condition === "current-condition-verified") return "Current condition verified";
  if (record.condition === "historical-context-only") return "Historical context only";
  return "Current condition not verified";
}
