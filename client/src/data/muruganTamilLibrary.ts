/**
 * Murugan Tamil library content contract.
 *
 * Only original, verified, publication-cleared Tamil text may be exposed as
 * published content. A title, link, HTML application shell, or reference-only
 * placeholder is NOT a book or song.
 *
 * This file does not grant permission to reproduce an external digital edition.
 */
export type MuruganWorkKind = "book" | "song-collection" | "hymn";
export type MuruganWorkDraft = {
  id: string;
  titleTa: string;
  titleEn: string;
  kind: MuruganWorkKind;
  author?: string;
  reviewStatus: "pending-source-review";
};
export type MuruganWorkPublished = Omit<MuruganWorkDraft, "reviewStatus"> & {
  reviewStatus: "published";
  textTa: string;
  sourceEdition: string;
  sourceLocator: string;
  redistributionBasis: string;
  reviewer: string;
  reviewedAt: string;
};
export type MuruganWork = MuruganWorkDraft | MuruganWorkPublished;

export const muruganWorks: readonly MuruganWork[] = [
  { id: "kandar-anubhuti", titleTa: "கந்தர் அனுபூதி", titleEn: "Kandar Anubhuti", kind: "book", author: "அருணகிரிநாதர்", reviewStatus: "pending-source-review" },
  { id: "kandar-alankaram", titleTa: "கந்தர் அலங்காரம்", titleEn: "Kandar Alankaram", kind: "book", author: "அருணகிரிநாதர்", reviewStatus: "pending-source-review" },
  { id: "kandar-andhadhi", titleTa: "கந்தர் அந்தாதி", titleEn: "Kandar Andhadhi", kind: "book", author: "அருணகிரிநாதர்", reviewStatus: "pending-source-review" },
  { id: "kandar-kalivenba", titleTa: "கந்தர் கலிவெண்பா", titleEn: "Kandar Kalivenba", kind: "book", author: "குமரகுருபரர்", reviewStatus: "pending-source-review" },
  { id: "tirumurukarruppatai", titleTa: "திருமுருகாற்றுப்படை", titleEn: "Tirumurukarruppatai", kind: "book", reviewStatus: "pending-source-review" },
  { id: "tiruppugazh", titleTa: "திருப்புகழ்", titleEn: "Tiruppugazh", kind: "song-collection", author: "அருணகிரிநாதர்", reviewStatus: "pending-source-review" },
  { id: "kanda-sashti-kavasam", titleTa: "கந்த சஷ்டி கவசம்", titleEn: "Kanda Sashti Kavasam", kind: "hymn", reviewStatus: "pending-source-review" },
  { id: "shanmuga-kavasam", titleTa: "சண்முக கவசம்", titleEn: "Shanmuga Kavasam", kind: "hymn", reviewStatus: "pending-source-review" },
  { id: "vel-virutham", titleTa: "வேல் விருத்தம்", titleEn: "Vel Virutham", kind: "hymn", reviewStatus: "pending-source-review" },
  { id: "mayil-virutham", titleTa: "மயில் விருத்தம்", titleEn: "Mayil Virutham", kind: "hymn", reviewStatus: "pending-source-review" },
  { id: "seval-virutham", titleTa: "சேவல் விருத்தம்", titleEn: "Seval Virutham", kind: "hymn", reviewStatus: "pending-source-review" },
] as const;

export function isPublishedMuruganWork(work: MuruganWork): work is MuruganWorkPublished {
  return work.reviewStatus === "published";
}

/** Only publish works with text and a complete provenance/permission record. */
export function getPublishableMuruganWorks(works: readonly MuruganWork[] = muruganWorks): MuruganWorkPublished[] {
  const published = works.filter(isPublishedMuruganWork);
  const ids = new Set<string>();
  for (const work of published) {
    if (ids.has(work.id)) throw new Error(`Duplicate Murugan work id: ${work.id}`);
    ids.add(work.id);
    if (![work.textTa, work.sourceEdition, work.sourceLocator, work.redistributionBasis, work.reviewer, work.reviewedAt].every((value) => value.trim())) {
      throw new Error(`Incomplete publication evidence: ${work.id}`);
    }
    if (!/[\u0B80-\u0BFF].test(work.textTa)) throw new Error(`Tamil source text missing: ${work.id}`);
    if (/<script\b|<html\b|<body\b/i.test(work.textTa)) throw new Error(`HTML shell cannot be published as a Tamil work: ${work.id}`);
    if (/source verification required|pending review|cross reference/i.test(work.textTa)) throw new Error(`Placeholder cannot be published: ${work.id}`);
  }
  return published;
}
