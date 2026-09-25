import type { AskDivyaRequest } from "./contract";
import { buildAskDivyaCitation, findAskDivyaCorpusRecord, getAskDivyaCorpus } from "./corpus";

const INJECTION_MARKERS = [
  "ignore previous instructions",
  "ignore all previous",
  "system prompt",
  "developer message",
  "reveal your prompt",
  "fabricate citation",
  "invent a verse",
];

function normalize(value: string): string {
  return value.toLocaleLowerCase().normalize("NFKC");
}

function scoreRecord(question: string, record: ReturnType<typeof getAskDivyaCorpus>[number]): number {
  const haystack = normalize([
    record.title,
    record.tamilTitle,
    record.source,
    record.reference,
    record.tamilMeaning,
    record.englishMeaning,
    record.explanation,
    ...record.keywords,
  ].join(" "));
  return normalize(question)
    .split(/\s+/)
    .filter((term) => term.length >= 2)
    .reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0);
}

export function isPromptInjectionAttempt(question: string): boolean {
  const normalized = normalize(question);
  return INJECTION_MARKERS.some((marker) => normalized.includes(marker));
}

export function retrieveAskDivyaContext(request: AskDivyaRequest, limit = 4) {
  const corpus = getAskDivyaCorpus();

  if (isPromptInjectionAttempt(request.question)) {
    return { records: [], citations: [], blocked: true as const };
  }

  const explicit = (request.contextRecordIds ?? [])
    .map(findAskDivyaCorpusRecord)
    .filter((record): record is NonNullable<typeof record> => Boolean(record));

  const ranked = corpus
    .filter((record) => !explicit.some((item) => item.id === record.id))
    .map((record) => ({ record, score: scoreRecord(request.question, record) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.record.id.localeCompare(b.record.id))
    .map((item) => item.record);

  const records = [...explicit, ...ranked].slice(0, limit);
  return {
    records,
    citations: records.map(buildAskDivyaCitation),
    blocked: false as const,
  };
}
