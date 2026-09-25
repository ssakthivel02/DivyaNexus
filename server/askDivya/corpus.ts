import { records, type KnowledgeRecord } from "../../client/src/data/content";
import type { AskDivyaCitation } from "./contract";

export type AskDivyaCorpusRecord = KnowledgeRecord;

export function getAskDivyaCorpus(): AskDivyaCorpusRecord[] {
  return records.filter((record) => record.reviewStatus === "Editorial overview");
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
    reviewStatus: record.reviewStatus,
  };
}
