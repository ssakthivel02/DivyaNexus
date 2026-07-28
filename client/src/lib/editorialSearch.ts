import { editorialRecords, type EditorialCollection, type EditorialRecord } from "@/data/editorial";

function normalize(value: string) {
  return value
    .normalize("NFKD")
    .toLocaleLowerCase("en-GB")
    .replace(/[\u0300-\u036f]/g, "")
    // Use an explicit punctuation set so Tamil and other Unicode letters remain searchable
    // without requiring an ES6 Unicode-property regular-expression target.
    .replace(/[\s.,/#!$%^&*;:{}=_~()"'?<>|@+\-]+/g, " ")
    .trim();
}

function searchableText(record: EditorialRecord) {
  return normalize([
    record.title,
    record.tamilTitle,
    record.collection,
    record.summary,
    record.tamilSummary,
    record.focus,
    ...record.keywords,
  ].join(" "));
}

export function searchEditorialRecords(query: string, collection: EditorialCollection | "All" = "All") {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  return editorialRecords
    .filter((record) => collection === "All" || record.collection === collection)
    .map((record) => {
      const haystack = searchableText(record);
      const matchedTerms = terms.filter((term) => haystack.includes(term));
      const exactTitle = normalize(record.title) === normalizedQuery || normalize(record.tamilTitle) === normalizedQuery;
      const keywordMatch = record.keywords.some((keyword) => normalize(keyword) === normalizedQuery);
      return {
        record,
        score: matchedTerms.length * 10 + (exactTitle ? 20 : 0) + (keywordMatch ? 12 : 0),
      };
    })
    .filter((result) => result.score > 0)
    .sort((left, right) => right.score - left.score || left.record.title.localeCompare(right.record.title))
    .map((result) => result.record);
}
