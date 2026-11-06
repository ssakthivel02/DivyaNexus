export type EditorialCollection =
  | "Rishi"
  | "Festival"
  | "Glossary"
  | "Guidance"
  | "Learning"
  | "Kids";

export type EditorialStatus =
  | "Editorial orientation"
  | "Needs source review"
  | "Ready for guided learning";

export type EditorialRecord = {
  id: string;
  title: string;
  tamilTitle: string;
  collection: EditorialCollection;
  route: string;
  summary: string;
  tamilSummary: string;
  focus: string;
  keywords: readonly string[];
  status: EditorialStatus;
  sourceBoundary: string;
};

export type EditorialCollectionSummary = {
  collection: EditorialCollection;
  route: string;
  label: string;
  tamilLabel: string;
  description: string;
};
