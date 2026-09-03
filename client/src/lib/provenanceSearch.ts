import { evidenceStrengthOrder, getProvenanceForRecord, type ProvenanceObject } from "@/data/provenance";
import type { KnowledgeRecord } from "@/data/content";

export type ProvenanceRankedRecord = {
  record: KnowledgeRecord;
  provenance?: ProvenanceObject;
  matchScore: number;
  evidenceScore: number;
  totalScore: number;
};

function normalize(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase().trim();
}

function lexicalScore(record: KnowledgeRecord, query: string) {
  const q = normalize(query);
  if (!q) return 0;
  const title = normalize(`${record.title} ${record.tamilTitle}`);
  const source = normalize(`${record.source} ${record.reference}`);
  const keywords = normalize(record.keywords.join(" "));
  const body = normalize(`${record.tamilMeaning} ${record.englishMeaning} ${record.explanation}`);
  let score = 0;
  if (title === q) score += 80;
  if (title.includes(q)) score += 45;
  if (source.includes(q)) score += 30;
  if (keywords.includes(q)) score += 24;
  if (body.includes(q)) score += 10;
  return score;
}

export function rankRecordsByProvenance(records: readonly KnowledgeRecord[], query: string): ProvenanceRankedRecord[] {
  return records
    .map((record) => {
      const provenance = getProvenanceForRecord(record.id);
      const matchScore = lexicalScore(record, query);
      const evidenceScore = provenance ? evidenceStrengthOrder[provenance.strength] * 5 : 0;
      return { record, provenance, matchScore, evidenceScore, totalScore: matchScore + evidenceScore };
    })
    .filter((result) => result.matchScore > 0)
    .sort((a, b) => b.totalScore - a.totalScore || a.record.title.localeCompare(b.record.title));
}

export function evidenceLabel(provenance?: ProvenanceObject) {
  if (!provenance) return "Provenance not yet registered";
  if (provenance.strength === "primary-reference") return "Primary reference linked";
  if (provenance.strength === "editorial-source-needed") return "Reference present · source edition needed";
  return "Editorial overview";
}
