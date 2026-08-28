export const DIVYANEXUS_RELEASE = {
  id: "legacy-shiva-cutover",
  name: "Shiva Legacy Knowledge Cutover",
  title: "Shiva — Vedic Knowledge & Learning",
  domain: "https://shiva.omsaravanabhava.org",
  reviewedDate: "28 August 2026",
  healthPath: "/health.json",
  releaseEvidencePath: "/release.json",
} as const;

export type DivyaNexusRelease = typeof DIVYANEXUS_RELEASE;
