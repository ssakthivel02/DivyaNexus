import { festivalEditorialRecords } from "./festivals";
import { glossaryEditorialRecords } from "./glossary";
import { guidanceEditorialRecords } from "./guidance";
import { kidsEditorialRecords } from "./kids";
import { learningEditorialRecords } from "./learning";
import { rishiEditorialRecords } from "./rishis";
import type { EditorialCollection, EditorialCollectionSummary, EditorialRecord, EditorialStatus } from "./types";

export type { EditorialCollection, EditorialCollectionSummary, EditorialRecord, EditorialStatus } from "./types";

export const editorialRecords: readonly EditorialRecord[] = [
  ...rishiEditorialRecords,
  ...festivalEditorialRecords,
  ...glossaryEditorialRecords,
  ...guidanceEditorialRecords,
  ...learningEditorialRecords,
  ...kidsEditorialRecords,
];

export const editorialCollections: readonly EditorialCollectionSummary[] = [
  { collection: "Rishi", route: "/rishis", label: "Rishis & lineages", tamilLabel: "ரிஷிகள் மற்றும் மரபுகள்", description: "Attribution, textual setting, lineage memory, and uncertainty kept visibly separate." },
  { collection: "Festival", route: "/festivals", label: "Festival pathways", tamilLabel: "திருவிழா பாதைகள்", description: "Regional practice, calendar context, family memory, and current facts treated carefully." },
  { collection: "Glossary", route: "/glossary", label: "Bilingual glossary", tamilLabel: "இருமொழிச் சொற்களஞ்சியம்", description: "Context-sensitive terms without false one-word equivalence." },
  { collection: "Guidance", route: "/life-guidance", label: "Bounded reflection", tamilLabel: "எல்லையுள்ள சிந்தனை", description: "Educational prompts that do not diagnose, prescribe, or promise outcomes." },
  { collection: "Learning", route: "/learning", label: "Learning pathways", tamilLabel: "கற்றல் பாதைகள்", description: "Pressure-free sequences for source literacy, context, and bilingual study." },
  { collection: "Kids", route: "/kids", label: "Family-safe learning", tamilLabel: "குடும்ப பாதுகாப்பான கற்றல்", description: "Shared curiosity without child-data collection or unrestricted chat." },
] as const;

export function getEditorialRecordsByCollection(collection: EditorialCollection) {
  return editorialRecords.filter((record) => record.collection === collection);
}

export function getEditorialCoverage() {
  const statuses = editorialRecords.reduce<Record<EditorialStatus, number>>(
    (coverage, record) => {
      coverage[record.status] += 1;
      return coverage;
    },
    {
      "Editorial orientation": 0,
      "Needs source review": 0,
      "Ready for guided learning": 0,
    },
  );

  return {
    total: editorialRecords.length,
    collections: editorialCollections.length,
    statuses,
  };
}
