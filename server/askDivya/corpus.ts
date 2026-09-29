import { records, type ContentCategory, type KnowledgeRecord } from "../../client/src/data/content";
import type { AskDivyaCitation } from "./contract";

export type AskDivyaCorpusRecord = KnowledgeRecord;

export const ASK_DIVYA_COVERAGE_CATEGORIES = [
  "Scripture",
  "Deity",
  "Temple",
  "Rishi",
  "Festival",
  "Glossary",
  "Guidance",
  "Learning",
] as const satisfies readonly ContentCategory[];

export interface AskDivyaCorpusCoverage {
  totalEligibleRecords: number;
  byCategory: Record<ContentCategory, number>;
  coveredCategories: ContentCategory[];
  unavailableCategories: ContentCategory[];
}

export function getAskDivyaCorpus(): AskDivyaCorpusRecord[] {
  return records.filter((record) => record.reviewStatus === "Editorial overview");
}

export function getAskDivyaCorpusCoverage(): AskDivyaCorpusCoverage {
  const byCategory: Record<ContentCategory, number> = {
    Scripture: 0,
    Deity: 0,
    Temple: 0,
    Rishi: 0,
    Festival: 0,
    Glossary: 0,
    Guidance: 0,
    Learning: 0,
  };
  const corpus = getAskDivyaCorpus();

  corpus.forEach((record) => {
    byCategory[record.category] += 1;
  });

  return {
    totalEligibleRecords: corpus.length,
    byCategory,
    coveredCategories: ASK_DIVYA_COVERAGE_CATEGORIES.filter((category) => byCategory[category] > 0),
    unavailableCategories: ASK_DIVYA_COVERAGE_CATEGORIES.filter((category) => byCategory[category] === 0),
  };
}

export function findAskDivyaCorpusRecord(id: string): AskDivyaCorpusRecord | undefined {
  return getAskDivyaCorpus().find((record) => record.id === id);
}

export function buildAskDivyaCitation(record: AskDivyaCorpusRecord): AskDivyaCitation {
  return {
    recordId: record.id,
    label: record.title,
    route: `${record.route}?record=${encodeURIComponent(record.id)}`,
    source: record.source,
    reference: record.reference,
    context: record.category,
    tradition: record.source,
    contentLayer: "modern-educational-explanation",
    reviewStatus: record.reviewStatus,
  };
}
