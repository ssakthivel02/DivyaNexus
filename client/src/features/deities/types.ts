export type DeityConfidence = "HIGH" | "MEDIUM" | "EDITORIAL-REVIEW";

export type DeitySourceCategory =
  | "Museum reference"
  | "Scholarly overview"
  | "Primary-text pathway"
  | "Traditional context";

export interface DeitySourceReference {
  id: string;
  title: string;
  organisation: string;
  url: string;
  category: DeitySourceCategory;
  note: string;
}

export interface DeityFact {
  label: string;
  value: string;
  tamilValue?: string;
}

export interface DeityRecord {
  slug: string;
  name: string;
  tamilName: string;
  transliterations: readonly string[];
  strapline: string;
  tamilStrapline: string;
  summary: string;
  tamilSummary: string;
  traditions: readonly string[];
  forms: readonly string[];
  iconography: readonly DeityFact[];
  relationships: readonly DeityFact[];
  associatedTexts: readonly string[];
  observanceContext: readonly string[];
  studyQuestions: readonly string[];
  relatedSlugs: readonly string[];
  sourceIds: readonly string[];
  confidence: DeityConfidence;
  editorialStatus: "Reviewed orientation" | "Requires specialist review";
  reviewedDate: string;
}
