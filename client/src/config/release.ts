export const DIVYANEXUS_RELEASE = {
  id: "stage-b-wave4",
  name: "Production Reliability Wave 4",
  title: "DivyaNexus — Vedic Knowledge & Learning",
  domain: "https://divyanexus.omsaravanabhava.org",
  reviewedDate: "28 July 2026",
  healthPath: "/health.json",
  releaseEvidencePath: "/release.json",
} as const;

export type DivyaNexusRelease = typeof DIVYANEXUS_RELEASE;
