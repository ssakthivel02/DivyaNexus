export type KnowledgeRelationKind = "study-next" | "context" | "concept" | "practice";

export type KnowledgeRelation = {
  id: string;
  from: string;
  to: string;
  kind: KnowledgeRelationKind;
  label: string;
  tamilLabel: string;
  rationale: string;
};

/**
 * Wave 10 relationship graph.
 * These links are navigation/editorial relationships between existing DivyaNexus
 * pathways. They are not claims of scriptural equivalence, historical causality,
 * doctrinal identity, or verified quotation provenance.
 */
export const knowledgeRelations: readonly KnowledgeRelation[] = [
  {
    id: "gita-duty-to-dharma",
    from: "gita-2-47",
    to: "glossary-dharma",
    kind: "concept",
    label: "Study the concept of dharma",
    tamilLabel: "தர்மக் கருத்தை ஆராயுங்கள்",
    rationale: "A useful editorial next step when studying action and duty is to inspect how the term dharma changes by context.",
  },
  {
    id: "gita-order-to-dharma",
    from: "gita-4-7",
    to: "glossary-dharma",
    kind: "concept",
    label: "Open the dharma glossary pathway",
    tamilLabel: "தர்ம அகராதிப் பாதையைத் திறக்கவும்",
    rationale: "This connects two existing learning records without asserting one fixed translation or interpretation.",
  },
  {
    id: "rig-agni-to-scriptures",
    from: "rig-veda-1-1-1",
    to: "/scriptures",
    kind: "study-next",
    label: "Continue through scripture pathways",
    tamilLabel: "சாஸ்திரப் பயணத்தைத் தொடருங்கள்",
    rationale: "Moves from a starter Rig Veda record to the wider scripture library while preserving source-edition limits.",
  },
  {
    id: "rig-pusan-to-temples",
    from: "rig-veda-1-42",
    to: "/temples",
    kind: "context",
    label: "Explore sacred geography carefully",
    tamilLabel: "புனித புவியியலை ஆராயுங்கள்",
    rationale: "Provides a thematic navigation bridge around path and journey; it does not claim a direct textual link to a specific temple.",
  },
  {
    id: "rig-surya-to-learning",
    from: "rig-veda-1-50",
    to: "/learning",
    kind: "practice",
    label: "Build a disciplined study path",
    tamilLabel: "ஒழுக்கமான கற்றல் பாதையை அமைக்கவும்",
    rationale: "Connects the editorial themes of attention and discipline to a pressure-free learning pathway.",
  },
  {
    id: "upanishads-to-glossary",
    from: "upanishads-introduction",
    to: "/glossary",
    kind: "study-next",
    label: "Clarify key concepts",
    tamilLabel: "முக்கிய கருத்துகளைத் தெளிவுபடுத்துங்கள்",
    rationale: "Encourages concept-by-concept study instead of collapsing diverse Upanishadic traditions into a single summary.",
  },
  {
    id: "peace-to-guidance",
    from: "guidance-peace",
    to: "/life-guidance",
    kind: "practice",
    label: "Continue reflective guidance",
    tamilLabel: "சிந்தனை வழிகாட்டலைத் தொடருங்கள்",
    rationale: "Keeps the experience within educational reflection and avoids promises of outcomes or professional advice.",
  },
] as const;

export function relationsFor(sourceId: string) {
  return knowledgeRelations.filter((relation) => relation.from === sourceId);
}
