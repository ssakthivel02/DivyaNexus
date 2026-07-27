export interface DeityEditorialCard {
  title: string;
  tamil: string;
  detail: string;
  source: string;
}

/**
 * Starter-level deity orientation cards.
 *
 * These summaries deliberately avoid verse quotations, historical dating, temple claims,
 * and school-specific theology until record-level source review is complete.
 */
export const deityEditorialCards: readonly DeityEditorialCard[] = [
  {
    title: "Shiva",
    tamil: "சிவன்",
    detail:
      "An editorial doorway into names, forms, symbolism, worship traditions, and the many textual contexts associated with Shiva.",
    source: "Editorial overview — primary and traditional sources pending record-level review",
  },
  {
    title: "Parvati",
    tamil: "பார்வதி",
    detail:
      "A respectful orientation to Parvati across family, devotional, symbolic, and regional traditions without collapsing them into one account.",
    source: "Editorial overview — primary and traditional sources pending record-level review",
  },
  {
    title: "Vishnu",
    tamil: "விஷ்ணு",
    detail:
      "A source-aware starting point for Vishnu, associated forms, devotional traditions, and related textual pathways.",
    source: "Editorial overview — primary and traditional sources pending record-level review",
  },
  {
    title: "Lakshmi",
    tamil: "லட்சுமி",
    detail:
      "An introductory study card for Lakshmi, symbolic themes, household devotion, festival context, and related sources.",
    source: "Editorial overview — primary and traditional sources pending record-level review",
  },
  {
    title: "Ganesha",
    tamil: "விநாயகர்",
    detail:
      "A learning doorway into Ganesha, common iconographic features, worship context, names, and related traditions.",
    source: "Editorial overview — primary and traditional sources pending record-level review",
  },
  {
    title: "Murugan",
    tamil: "முருகன்",
    detail:
      "A Tamil-first orientation to Murugan across names, symbols, devotional literature, pilgrimage memory, and regional practice.",
    source: "Editorial overview — Tamil and pan-Indian sources pending record-level review",
  },
  {
    title: "Saraswati",
    tamil: "சரஸ்வதி",
    detail:
      "A study card for Saraswati in learning, speech, music, symbolism, and educational traditions.",
    source: "Editorial overview — primary and traditional sources pending record-level review",
  },
  {
    title: "Rama",
    tamil: "ராமர்",
    detail:
      "An entry point into Rama through epic, devotional, ethical, literary, and regional retelling contexts.",
    source: "Editorial overview — edition and tradition-specific sources pending review",
  },
  {
    title: "Krishna",
    tamil: "கிருஷ்ணர்",
    detail:
      "A carefully bounded introduction to Krishna across epic, devotional, philosophical, and regional traditions.",
    source: "Editorial overview — edition and tradition-specific sources pending review",
  },
  {
    title: "Nataraja",
    tamil: "நடராஜர்",
    detail:
      "A focused orientation to the Nataraja form, visual symbolism, temple context, artistic interpretation, and source questions.",
    source: "Editorial overview — iconographic and textual sources pending record-level review",
  },
] as const;
