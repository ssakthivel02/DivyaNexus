/**
 * Celestial Manuscript Atelier: source-aware starter content with clear limits.
 * This file intentionally contains no unverified scripture quotations.
 */

export type ContentCategory =
  | "Scripture"
  | "Deity"
  | "Temple"
  | "Rishi"
  | "Festival"
  | "Glossary"
  | "Guidance"
  | "Learning";

export interface KnowledgeRecord {
  id: string;
  title: string;
  tamilTitle: string;
  category: ContentCategory;
  source: string;
  reference: string;
  transliteration?: string;
  tamilMeaning: string;
  englishMeaning: string;
  explanation: string;
  keywords: string[];
  route: string;
  reviewStatus: "Starter record — source edition to be linked" | "Editorial overview";
}

/**
 * Divine Observatory Cinema asset map: original visuals are deliberately assigned to
 * distinct storytelling roles so the interface does not repeat a single image as a placeholder.
 */
export const ASSETS = {
  hero: "/manus-storage/moonlit-horizon_e5a7c73b.jpg",
  heroDawn: "/manus-storage/temple-dusk_828c9d35.jpeg",
  heroArchive: "/manus-storage/candle-book_c0883233.jpg",
  wisdom: "/manus-storage/manuscript-lamp_800d9e16.jpeg",
  ask: "/manus-storage/lantern-dawn_0b991971.jpg",
  scripture: "/manus-storage/manuscript-lamp-alt_5746f554.jpeg",
  temple: "/manus-storage/temple-brihadeeswarar_62a83c09.jpeg",
  deity: "/manus-storage/diya-dark_e7b5cff7.jpeg",
  learning: "/manus-storage/starry-trees_a80666f5.jpeg",
  guidance: "/manus-storage/blue-night-sky_d04bf899.jpeg",
  kids: "/manus-storage/diya-reflection_837b3f59.jpeg",
  audio: "/manus-storage/oil-lamp-ambient_0981f290.jpg",
  mark: "/manus-storage/divyanexus-brand-mark_a86a6f68.png",
} as const;

export const records: KnowledgeRecord[] = [
  {
    id: "rig-veda-1-1-1",
    title: "Rig Veda 1.1.1 · Agni",
    tamilTitle: "ரிக் வேதம் 1.1.1 · அக்னி",
    category: "Scripture",
    source: "Rig Veda",
    reference: "Mandala 1, Sukta 1, Mantra 1",
    transliteration: "Agni — a traditional Vedic name associated with the sacred fire principle.",
    tamilMeaning: "தொடக்கம், தெளிவு, ஆற்றல் மற்றும் அழைப்பைப் பற்றிய தொடக்கக் கற்றல் பதிவாகும்.",
    englishMeaning: "A starter record about beginning, clarity, energy, and invocation.",
    explanation:
      "This local starter record introduces a frequently studied opening reference. It is not a replacement for a reviewed edition, recitation, or traditional commentary.",
    keywords: ["agni", "beginning", "clarity", "energy", "தொடக்கம்", "தெளிவு", "gnanam", "jnana"],
    route: "/rig-veda",
    reviewStatus: "Starter record — source edition to be linked",
  },
  {
    id: "rig-veda-1-42",
    title: "Rig Veda 1.42 · Pusan",
    tamilTitle: "ரிக் வேதம் 1.42 · பூஷன்",
    category: "Scripture",
    source: "Rig Veda",
    reference: "Mandala 1, Sukta 42",
    tamilMeaning: "பாதை, பயணம், வழிகாட்டல் மற்றும் தடைகளை ஆராயும் தொடக்கப் பதிவு.",
    englishMeaning: "A starter record about path, travel, guidance, and navigating obstacles.",
    explanation:
      "The record names a traditional reference for guided study. It should not be read as a promise of protection, travel safety, or any particular outcome.",
    keywords: ["path", "travel", "guidance", "pusan", "வழி", "வழிகாட்டல்", "பயணம்", "protection"],
    route: "/rig-veda",
    reviewStatus: "Starter record — source edition to be linked",
  },
  {
    id: "rig-veda-1-50",
    title: "Rig Veda 1.50 · Surya",
    tamilTitle: "ரிக் வேதம் 1.50 · சூர்யா",
    category: "Scripture",
    source: "Rig Veda",
    reference: "Mandala 1, Sukta 50",
    tamilMeaning: "ஒளி, தெளிவு, ஒழுக்கம் மற்றும் விழிப்புணர்வைப் பற்றிய தொடக்கக் கற்றல் பதிவு.",
    englishMeaning: "A starter record concerning light, clarity, discipline, and illumination.",
    explanation:
      "One educational approach is to use this reference as a prompt to reflect on attention and daily discipline, while consulting an edition and teacher for deeper study.",
    keywords: ["surya", "light", "discipline", "clarity", "focus", "ஒளி", "ஒழுக்கம்", "கவனம்"],
    route: "/rig-veda",
    reviewStatus: "Starter record — source edition to be linked",
  },
  {
    id: "gita-2-47",
    title: "Bhagavad Gita 2.47",
    tamilTitle: "பகவத் கீதை 2.47",
    category: "Scripture",
    source: "Bhagavad Gita",
    reference: "Chapter 2, Verse 47",
    tamilMeaning: "செயல், கடமை மற்றும் முடிவில் பற்றில்லாமை பற்றிய கற்றல் குறிப்பு.",
    englishMeaning: "A teaching commonly studied in relation to action, duty, and non-attachment to results.",
    explanation:
      "According to the cited text, this passage is often introduced when discussing thoughtful effort. A qualified teacher can help distinguish translation choices from later interpretation.",
    keywords: ["gita", "dharma", "duty", "work", "action", "kadami", "கடமை", "தர்மம்", "வேலை"],
    route: "/bhagavad-gita",
    reviewStatus: "Starter record — source edition to be linked",
  },
  {
    id: "gita-4-7",
    title: "Bhagavad Gita 4.7",
    tamilTitle: "பகவத் கீதை 4.7",
    category: "Scripture",
    source: "Bhagavad Gita",
    reference: "Chapter 4, Verse 7",
    tamilMeaning: "தர்மம் மற்றும் ஒழுங்கின் மீள்நிலையைப் பற்றிய தொடக்கக் கற்றல் பதிவு.",
    englishMeaning: "A starter record connected with dharma and the restoration of order.",
    explanation:
      "This is a study lead, not a deterministic claim about events. It may encourage reflection on values, responsibility, and how traditions frame ethical order.",
    keywords: ["dharma", "order", "responsibility", "duty", "தர்மம்", "ஒழுங்கு", "கடமை"],
    route: "/bhagavad-gita",
    reviewStatus: "Starter record — source edition to be linked",
  },
  {
    id: "upanishads-introduction",
    title: "Introduction to the Upanishads",
    tamilTitle: "உபநிஷத்துகளுக்கான அறிமுகம்",
    category: "Scripture",
    source: "Upanishads",
    reference: "Learning overview",
    tamilMeaning: "வினா, சுயஆராய்ச்சி மற்றும் ஆசிரியர்-மாணவர் உரையாடலின் மரபை அறிமுகப்படுத்தும் கற்றல் பாதை.",
    englishMeaning: "A learning overview of inquiry, self-reflection, and teacher–student dialogue in the Upanishadic tradition.",
    explanation:
      "The Upanishads are a diverse body of texts. This overview intentionally avoids collapsing different texts, schools, and translation traditions into one claim.",
    keywords: ["upanishad", "self", "inquiry", "wisdom", "ஞானம்", "gnanam", "jnana", "ஆராய்ச்சி"],
    route: "/upanishads",
    reviewStatus: "Editorial overview",
  },
  {
    id: "glossary-dharma",
    title: "Dharma",
    tamilTitle: "தர்மம்",
    category: "Glossary",
    source: "DivyaNexus glossary",
    reference: "Context-sensitive concept",
    transliteration: "dharma",
    tamilMeaning: "சூழல், மரபு மற்றும் உரையாடலுக்கு ஏற்ப கடமை, ஒழுங்கு, நெறி அல்லது தாங்கும் கொள்கை எனப் புரிந்துகொள்ளப்படும் சொல்.",
    englishMeaning: "A context-sensitive term often rendered as duty, order, ethics, or that which sustains.",
    explanation:
      "One translation rarely fits every setting. Source-first study asks which text, speaker, and interpretive tradition are in view.",
    keywords: ["dharma", "தர்மம்", "duty", "ethics", "kadami", "கடமை"],
    route: "/glossary",
    reviewStatus: "Editorial overview",
  },
  {
    id: "guidance-peace",
    title: "A reflection on peace",
    tamilTitle: "அமைதியைப் பற்றிய சிந்தனை",
    category: "Guidance",
    source: "DivyaNexus reflective guide",
    reference: "Source-linked starter prompt",
    tamilMeaning: "அமைதி என்பது உடனடி விளைவு அல்ல; கவனம், ஓய்வு, உறவுகள் மற்றும் சிந்தனை குறித்து மெதுவாக ஆராய ஒரு அழைப்பு.",
    englishMeaning: "Peace is not promised as an instant outcome; this is an invitation to reflect on attention, rest, relationships, and study.",
    explanation:
      "For distress that feels overwhelming or urgent, seek appropriate professional or community support. This experience provides educational reflection, not medical care.",
    keywords: ["peace", "amaithi", "அமைதி", "calm", "fear", "கவலை"],
    route: "/life-guidance",
    reviewStatus: "Editorial overview",
  },
];

export const lifeNeeds = [
  { name: "Peace", tamil: "அமைதி", icon: "◌", query: "peace", note: "Traditionally associated with reflection on equanimity, attention, and rest." },
  { name: "Courage", tamil: "தைரியம்", icon: "↗", query: "courage", note: "Traditionally associated with reflection on steadiness and purposeful action." },
  { name: "Duty", tamil: "கடமை", icon: "⌁", query: "duty", note: "Traditionally associated with reflection on responsibility and context." },
  { name: "Focus", tamil: "கவனம்", icon: "◎", query: "focus", note: "Traditionally associated with reflection on attention and disciplined study." },
  { name: "Wisdom", tamil: "ஞானம்", icon: "✦", query: "wisdom", note: "Traditionally associated with inquiry, dialogue, and patient learning." },
  { name: "Family", tamil: "குடும்பம்", icon: "◒", query: "family", note: "Traditionally associated with care, responsibility, and relationship." },
  { name: "Work", tamil: "வேலை", icon: "▱", query: "work", note: "Traditionally associated with thoughtful effort and duty." },
  { name: "Relationships", tamil: "உறவுகள்", icon: "∞", query: "relationships", note: "Traditionally associated with truthful communication and consideration." },
  { name: "Devotion", tamil: "பக்தி", icon: "✧", query: "devotion", note: "Traditionally associated with remembrance, practice, and humility." },
  { name: "Self-discipline", tamil: "சுய ஒழுக்கம்", icon: "△", query: "discipline", note: "Traditionally associated with steady practice rather than quick results." },
] as const;

export const knowledgeCategories = [
  { title: "Rig Veda", tamil: "ரிக் வேதம்", detail: "Hymns, context, and source-aware study leads.", route: "/rig-veda", motif: "01" },
  { title: "Bhagavad Gita", tamil: "பகவத் கீதை", detail: "A structured reader for teaching, translation, and reflection.", route: "/bhagavad-gita", motif: "02" },
  { title: "Upanishads", tamil: "உபநிஷத்துகள்", detail: "Inquiry-led pathways across diverse philosophical texts.", route: "/upanishads", motif: "03" },
  { title: "Deities", tamil: "தெய்வங்கள்", detail: "Identity, symbolism, worship context, and related sources.", route: "/deities", motif: "04" },
  { title: "Temples", tamil: "திருக்கோவில்கள்", detail: "Architecture, tradition, and history without unverified visitor claims.", route: "/temples", motif: "05" },
  { title: "Rishis", tamil: "ரிஷிகள்", detail: "Teacher lineages and literary context for guided learning.", route: "/rishis", motif: "06" },
  { title: "Festivals", tamil: "திருவிழாக்கள்", detail: "Seasonal observance context and changing regional traditions.", route: "/festivals", motif: "07" },
  { title: "Glossary", tamil: "சொற்களஞ்சியம்", detail: "Terms with context rather than single-word certainty.", route: "/glossary", motif: "08" },
  { title: "Life Guidance", tamil: "வாழ்க்கை வழிகாட்டல்", detail: "Source-linked prompts for careful reflection.", route: "/life-guidance", motif: "09" },
  { title: "Learning Paths", tamil: "கற்றல் பாதைகள்", detail: "Measured routes from first question to deeper study.", route: "/learning", motif: "10" },
] as const;

export const deities = [
  { title: "Ganesha", tamil: "விநாயகர்", detail: "A study card for identity, symbolism, worship context, and related learning material.", source: "Editorial overview — source links pending review" },
  { title: "Saraswati", tamil: "சரஸ்வதி", detail: "A study card for learning traditions, symbolism, and related educational contexts.", source: "Editorial overview — source links pending review" },
  { title: "Vishnu", tamil: "விஷ்ணு", detail: "A study card for traditional identity, associated texts, and devotional contexts.", source: "Editorial overview — source links pending review" },
] as const;

export const temples = [
  { title: "Temple knowledge", tamil: "திருக்கோவில் அறிவு", detail: "An architectural and cultural learning collection. Current visitor information is intentionally not shown until verified.", tag: "Architecture & tradition" },
  { title: "Pilgrimage context", tamil: "யாத்திரைச் சூழல்", detail: "Explore how regional practice, history, and community care shape a site over time.", tag: "Context-first study" },
  { title: "Sacred landscape", tamil: "புனித நிலப்பரப்பு", detail: "A respectful overview of place, water, procession, and material heritage.", tag: "Cultural learning" },
] as const;

export const learningPaths = [
  { title: "Rig Veda Foundations", length: "6 reflections", detail: "A calm introduction to records, references, and study context.", route: "/rig-veda", level: "Foundational" },
  { title: "Bhagavad Gita Essentials", length: "8 reflections", detail: "Move from a cited passage to translation questions and practical reflection.", route: "/bhagavad-gita", level: "Foundational" },
  { title: "Introduction to the Upanishads", length: "5 reflections", detail: "A carefully bounded pathway into inquiry and text diversity.", route: "/upanishads", level: "Exploratory" },
  { title: "Temple Knowledge", length: "4 reflections", detail: "See tradition, architecture, and community context together.", route: "/temples", level: "Exploratory" },
] as const;

export const askPrompts = [
  "I need peace of mind",
  "How can I overcome fear?",
  "Explain dharma simply",
  "என்னால் கவலை குறைக்க முடியுமா?",
  "வேலைக்கான தன்னம்பிக்கை வேண்டும்",
  "What does the Gita teach about duty?",
];

export const guidanceResponses = [
  {
    match: ["peace", "calm", "anxiety", "fear", "அமைதி", "கவலை", "பயம்"],
    title: "A source-aware reflection on steadiness",
    response:
      "One interpretation is that a question about peace can begin with attention to what is within reach: a pause, a source-linked passage, and a conversation with a trusted person. The cited texts are not presented here as a guaranteed remedy. If anxiety or fear feels severe, consider seeking appropriate professional support.",
    records: ["guidance-peace", "rig-veda-1-50"],
  },
  {
    match: ["dharma", "duty", "work", "career", "job", "கடமை", "தர்மம்", "வேலை"],
    title: "A source-aware reflection on duty",
    response:
      "According to the cited starter records, duty is often studied as a context-sensitive question rather than a single rule. You might reflect on the role, relationship, and consequences involved before drawing a conclusion. A qualified teacher can help with deeper interpretation.",
    records: ["gita-2-47", "glossary-dharma"],
  },
  {
    match: ["focus", "study", "learning", "education", "wisdom", "கவனம்", "கல்வி", "ஞானம்"],
    title: "A source-aware reflection on learning",
    response:
      "This question may encourage reflection on steady study, careful sources, and manageable practice. DivyaNexus can help surface linked records, but it does not replace formal instruction or a qualified teacher.",
    records: ["rig-veda-1-50", "upanishads-introduction"],
  },
] as const;

export const legalContent = {
  privacy: {
    title: "Privacy Policy",
    eyebrow: "Information and choices",
    updated: "Last updated: 3 July 2026",
    sections: [
      ["Information we may collect", "Name and email address when a person signs in using Google or email login; bookmarks, notes, reading history, learning progress and preferences; and app interactions or device identifiers needed for account, security, analytics and app functionality."],
      ["How we use information", "Information may be used to provide login, bookmarks, offline sync, learning progress, AI explanations, notifications, and app reliability."],
      ["Data sharing", "DivyaNexus does not sell personal data. Required service providers may process information for authentication, hosting, storage, analytics, AI processing, and app functionality."],
      ["Your choices", "You may request account deletion or app-data deletion through the dedicated pages. Browser-local items created in this website can also be exported or cleared from Library."],
    ],
  },
  terms: {
    title: "Terms of Use",
    eyebrow: "Educational platform terms",
    updated: "Stage B website terms",
    sections: [
      ["Educational purpose", "DivyaNexus offers cultural, educational, and devotional learning material. It does not provide medical, legal, financial, or professional advice."],
      ["Source-aware use", "Translations, interpretations, and AI-generated explanations are distinct content types. Review labels and cited references before relying on content for study."],
      ["Respectful participation", "Do not use the platform to harass others, spread harmful claims, or present generated explanations as scripture."],
    ],
  },
  disclaimer: {
    title: "AI & Content Disclaimer",
    eyebrow: "Clear content boundaries",
    updated: "Stage B website disclosure",
    sections: [
      ["What DivyaNexus is", "DivyaNexus is designed for general informational, educational, cultural, and devotional learning purposes."],
      ["What AI explanations are", "AI-ready local explanations are clearly labelled and should not be confused with scripture quotations, formal translations, scholarly consensus, or personal advice."],
      ["When to seek help", "The platform does not diagnose, predict, or guarantee outcomes. For health, legal, financial, safety, or crisis concerns, use appropriate qualified support."],
    ],
  },
  sources: {
    title: "Sources & Editorial Method",
    eyebrow: "Source integrity",
    updated: "Stage B content framework",
    sections: [
      ["What is in this starter library", "The initial collection contains clearly labelled starter records for Rig Veda references, Bhagavad Gita references, an Upanishads overview, glossary context, and reflective guidance."],
      ["What is not yet complete", "This stage does not present a complete reviewed edition, full scripture text, or exhaustive bibliography. Records identify their review status and should be expanded only with verified source editions and translation provenance."],
      ["Editorial commitment", "DivyaNexus separates quotations, translations, traditional interpretations, AI-generated explanation, and reflective guidance. It does not copy third-party commentary as if it were an original source."],
    ],
  },
  "delete-account": {
    title: "Delete Account",
    eyebrow: "Google Play compliance route",
    updated: "Account-deletion information",
    sections: [
      ["How to request deletion", "Open the DivyaNexus app, go to Profile or Settings, and select Delete Account when available. If you cannot access the app, use the Contact page and include the email address used for DivyaNexus login."],
      ["What will be deleted", "Account profile, bookmarks, notes, reading history, learning progress, and app-specific user records associated with a DivyaNexus account."],
      ["What may be retained", "Records required for security, fraud prevention, legal compliance, or backup recovery may be retained for a limited period where applicable."],
    ],
  },
  "delete-data": {
    title: "Delete Data",
    eyebrow: "Data-deletion information",
    updated: "App and browser-local data",
    sections: [
      ["Request app-data deletion", "Use the in-app deletion path when available, or contact support if you cannot access the app. Include enough information to identify the account without posting sensitive information publicly."],
      ["Browser-local data", "This website can store small preferences, bookmarks, notes, reading history, saved searches, learning progress, and audio position locally in the browser. Use Library to export or clear this local data."],
      ["Scope", "Browser-local data is not represented as synced account data. Clearing it from this browser does not by itself delete an app account."],
    ],
  },
} as const;

export function normalizeText(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u0B80-\u0BFF\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function searchRecords(query: string, category?: string) {
  const normalized = normalizeText(query);
  const tokens = normalized.split(" ").filter(Boolean);
  return records
    .filter((record) => !category || category === "All" || record.category === category)
    .map((record) => {
      const haystack = normalizeText([
        record.title,
        record.tamilTitle,
        record.source,
        record.reference,
        record.transliteration ?? "",
        record.tamilMeaning,
        record.englishMeaning,
        ...record.keywords,
      ].join(" "));
      const score = tokens.reduce((total, token) => total + (haystack.includes(token) ? token.length + 2 : 0), 0);
      return { record, score };
    })
    .filter(({ score }) => !tokens.length || score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ record }) => record);
}
