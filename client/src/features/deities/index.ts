import { ganesha } from "./records/ganesha";
import { krishna } from "./records/krishna";
import { lakshmi } from "./records/lakshmi";
import { murugan } from "./records/murugan";
import { nataraja } from "./records/nataraja";
import { parvati } from "./records/parvati";
import { rama } from "./records/rama";
import { saraswati } from "./records/saraswati";
import { shiva } from "./records/shiva";
import { vishnu } from "./records/vishnu";
import type { DeityRecord } from "./types";

export const deityRecords: readonly DeityRecord[] = [
  shiva,
  parvati,
  vishnu,
  lakshmi,
  ganesha,
  murugan,
  saraswati,
  rama,
  krishna,
  nataraja,
] as const;

const deityBySlug = new Map(deityRecords.map((record) => [record.slug, record]));

export function getDeityRecord(slug: string) {
  return deityBySlug.get(slug.toLocaleLowerCase("en-GB"));
}

export function normaliseDeitySearch(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en-GB")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export function searchDeityRecords(query: string) {
  const needle = normaliseDeitySearch(query);
  if (!needle) return deityRecords;

  return deityRecords.filter((record) => {
    const searchable = normaliseDeitySearch([
      record.name,
      record.tamilName,
      ...record.transliterations,
      record.strapline,
      record.tamilStrapline,
      ...record.forms,
      ...record.traditions,
    ].join(" "));
    return searchable.includes(needle);
  });
}

export function getRelatedDeities(record: DeityRecord) {
  return record.relatedSlugs.map((slug) => getDeityRecord(slug)).filter((item): item is DeityRecord => Boolean(item));
}

export type { DeityRecord, DeitySourceReference } from "./types";
