export type EvidenceStrength = "primary-reference" | "editorial-source-needed" | "editorial-overview";

export type ProvenanceObject = {
  recordId: string;
  sourceKind: "scripture-reference" | "editorial-overview";
  sourceLabel: string;
  reference: string;
  strength: EvidenceStrength;
  reviewState: "source-edition-needed" | "editorial-reviewed";
  evidenceNote: string;
  tamilEvidenceNote: string;
};

export const provenanceObjects: readonly ProvenanceObject[] = [
  {
    recordId: "rig-veda-1-1-1",
    sourceKind: "scripture-reference",
    sourceLabel: "Rig Veda",
    reference: "Mandala 1, Sukta 1, Mantra 1",
    strength: "editorial-source-needed",
    reviewState: "source-edition-needed",
    evidenceNote: "A precise traditional reference is present, but this starter record still requires linkage to a reviewed source edition before quotation-grade evidence can be claimed.",
    tamilEvidenceNote: "துல்லியமான பாரம்பரிய குறிப்பு உள்ளது; மேற்கோள் ஆதாரமாகக் கருதுவதற்கு முன் பரிசீலிக்கப்பட்ட மூலப் பதிப்புடன் இணைப்பு தேவை.",
  },
  {
    recordId: "rig-veda-1-42",
    sourceKind: "scripture-reference",
    sourceLabel: "Rig Veda",
    reference: "Mandala 1, Sukta 42",
    strength: "editorial-source-needed",
    reviewState: "source-edition-needed",
    evidenceNote: "The record preserves the textual location but intentionally avoids presenting browser-local explanatory copy as a verified translation or recitation source.",
    tamilEvidenceNote: "உரை இருப்பிடம் பாதுகாக்கப்படுகிறது; உள்ளூர் விளக்க உரை சரிபார்க்கப்பட்ட மொழிபெயர்ப்பு அல்லது பாராயண ஆதாரமாக காட்டப்படாது.",
  },
  {
    recordId: "rig-veda-1-50",
    sourceKind: "scripture-reference",
    sourceLabel: "Rig Veda",
    reference: "Mandala 1, Sukta 50",
    strength: "editorial-source-needed",
    reviewState: "source-edition-needed",
    evidenceNote: "This is a study lead with a canonical reference location; source-edition verification remains an explicit open requirement.",
    tamilEvidenceNote: "இது மூல இடத்தைக் காட்டும் கற்றல் வழிகாட்டி; சரிபார்க்கப்பட்ட மூலப் பதிப்பு இன்னும் வெளிப்படையான தேவையாக உள்ளது.",
  },
  {
    recordId: "gita-2-47",
    sourceKind: "scripture-reference",
    sourceLabel: "Bhagavad Gita",
    reference: "Chapter 2, Verse 47",
    strength: "editorial-source-needed",
    reviewState: "source-edition-needed",
    evidenceNote: "Chapter and verse identity are explicit; translation wording and commentary must remain distinguishable from the primary textual reference.",
    tamilEvidenceNote: "அத்தியாயம் மற்றும் சுலோக எண் தெளிவாக உள்ளது; மொழிபெயர்ப்பு மற்றும் விளக்கவுரை மூல உரைக் குறிப்பிலிருந்து தனியே காட்டப்பட வேண்டும்.",
  },
  {
    recordId: "gita-4-7",
    sourceKind: "scripture-reference",
    sourceLabel: "Bhagavad Gita",
    reference: "Chapter 4, Verse 7",
    strength: "editorial-source-needed",
    reviewState: "source-edition-needed",
    evidenceNote: "The source location is explicit while interpretation remains editorial and must not be promoted to quotation-level evidence.",
    tamilEvidenceNote: "மூல இடம் தெளிவாக உள்ளது; விளக்கம் ஆசிரியர் சார்ந்தது மற்றும் நேரடி மேற்கோள் ஆதாரமாக உயர்த்தப்படக்கூடாது.",
  },
  {
    recordId: "upanishads-introduction",
    sourceKind: "editorial-overview",
    sourceLabel: "DivyaNexus editorial overview",
    reference: "Learning overview",
    strength: "editorial-overview",
    reviewState: "editorial-reviewed",
    evidenceNote: "This record is intentionally an orientation layer across a diverse textual corpus and does not claim to quote or collapse individual Upanishads.",
    tamilEvidenceNote: "இது பல்வேறு உபநிஷத் நூல்களை அறிமுகப்படுத்தும் ஆசிரியர் வழிகாட்டி; தனிப்பட்ட நூல்களின் நேரடி மேற்கோள் எனக் கூறாது.",
  },
  {
    recordId: "glossary-dharma",
    sourceKind: "editorial-overview",
    sourceLabel: "DivyaNexus glossary",
    reference: "Context-sensitive concept",
    strength: "editorial-overview",
    reviewState: "editorial-reviewed",
    evidenceNote: "The glossary deliberately marks dharma as context-sensitive and avoids presenting one English equivalent as universally authoritative.",
    tamilEvidenceNote: "தர்மம் சூழலைச் சார்ந்த சொல் எனக் குறிக்கப்படுகிறது; ஒரே ஆங்கிலச் சொல்லை எல்லா சூழல்களுக்கும் அதிகாரப்பூர்வ அர்த்தமாகக் காட்டாது.",
  },
  {
    recordId: "guidance-peace",
    sourceKind: "editorial-overview",
    sourceLabel: "DivyaNexus reflective guide",
    reference: "Source-linked starter prompt",
    strength: "editorial-overview",
    reviewState: "editorial-reviewed",
    evidenceNote: "Reflective guidance is labelled as educational editorial material and is not evidence for guaranteed outcomes, diagnosis, treatment or professional advice.",
    tamilEvidenceNote: "சிந்தனை வழிகாட்டல் கல்வி நோக்கமுடைய ஆசிரியர் உள்ளடக்கம்; உறுதியான விளைவு, நோயறிதல், சிகிச்சை அல்லது தொழில்முறை ஆலோசனைக்கான ஆதாரம் அல்ல.",
  },
] as const;

export function getProvenanceForRecord(recordId: string) {
  return provenanceObjects.find((item) => item.recordId === recordId);
}

export const evidenceStrengthOrder: Readonly<Record<EvidenceStrength, number>> = {
  "primary-reference": 3,
  "editorial-source-needed": 2,
  "editorial-overview": 1,
};
