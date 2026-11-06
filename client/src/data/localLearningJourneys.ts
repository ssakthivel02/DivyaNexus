export type LearningJourneyStep = {
  id: string;
  title: string;
  tamilTitle: string;
  detail: string;
  route: string;
};

export type LearningJourney = {
  id: string;
  title: string;
  tamilTitle: string;
  detail: string;
  pace: string;
  steps: readonly LearningJourneyStep[];
};

export const localLearningJourneys: readonly LearningJourney[] = [
  {
    id: "gita-context",
    title: "Read the Gita with context",
    tamilTitle: "சூழலுடன் கீதையைப் படியுங்கள்",
    detail: "Move from a cited passage to translation questions and reflective application without turning one interpretation into a universal rule.",
    pace: "Self-paced · browser-local",
    steps: [
      { id: "open-gita", title: "Open the cited text path", tamilTitle: "குறிப்பிட்ட உரைப் பாதையைத் திறக்கவும்", detail: "Begin with source location before interpretation.", route: "/bhagavad-gita" },
      { id: "review-sources", title: "Review source boundaries", tamilTitle: "மூல எல்லைகளைப் பாருங்கள்", detail: "Separate textual reference, translation, commentary, and reflection.", route: "/sources" },
      { id: "reflect-duty", title: "Reflect on duty carefully", tamilTitle: "கடமை குறித்து கவனமாக சிந்திக்கவும்", detail: "Use the guidance layer as a prompt, not a command or prediction.", route: "/life-guidance" },
    ],
  },
  {
    id: "veda-foundations",
    title: "Build Vedic study foundations",
    tamilTitle: "வேதப் படிப்பின் அடித்தளத்தை அமைக்கவும்",
    detail: "Start with reference-aware records, then examine pronunciation and source limits before deeper study.",
    pace: "Self-paced · no streaks",
    steps: [
      { id: "open-rig-veda", title: "Explore Rig Veda records", tamilTitle: "ரிக் வேதப் பதிவுகளை ஆராயுங்கள்", detail: "Use record references as study leads rather than quotation-grade evidence.", route: "/rig-veda" },
      { id: "listen-carefully", title: "Use listening aids carefully", tamilTitle: "கேட்பதற்கான உதவிகளை கவனமாகப் பயன்படுத்தவும்", detail: "Browser speech is an accessibility aid, not certified recitation.", route: "/audio" },
      { id: "inspect-provenance", title: "Inspect provenance", tamilTitle: "மூலத் தகவலை சரிபார்க்கவும்", detail: "Review what is sourced, editorial, or still awaiting source-edition verification.", route: "/nexus" },
    ],
  },
  {
    id: "temple-context",
    title: "Study a temple without inventing travel facts",
    tamilTitle: "பயணத் தகவலை ஊகிக்காமல் கோவிலை அறியுங்கள்",
    detail: "Keep architecture, memory, present-day condition, governance, and visitor information as separate evidence questions.",
    pace: "Self-paced · no account required",
    steps: [
      { id: "open-temples", title: "Open Temple Intelligence", tamilTitle: "கோவில் நுண்ணறிவைத் திறக்கவும்", detail: "Start with the visible verification and governance states.", route: "/temples" },
      { id: "check-collection", title: "Check collection coverage", tamilTitle: "தொகுப்பு நிலையைப் பாருங்கள்", detail: "See what is present, missing, or awaiting review before relying on visitor facts.", route: "/collection-status" },
      { id: "review-method", title: "Review the editorial method", tamilTitle: "ஆசிரியர் முறையைப் பாருங்கள்", detail: "Understand how current facts are kept distinct from historical or cultural context.", route: "/sources" },
    ],
  },
] as const;
