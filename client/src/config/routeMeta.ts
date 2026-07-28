import { DIVYANEXUS_RELEASE } from "@/config/release";

export type RouteSchemaType = "WebPage" | "CollectionPage" | "SearchResultsPage" | "AboutPage" | "ContactPage" | "ProfilePage";

export type RouteMeta = {
  title: string;
  description: string;
  image?: string;
  robots?: "index,follow" | "noindex,follow";
  schemaType: RouteSchemaType;
  label: string;
};

const defaultImage = `${DIVYANEXUS_RELEASE.domain}/assets/divyanexus/hero-moonlit-horizon.webp`;

export const routeMetaByPath: Readonly<Record<string, RouteMeta>> = {
  "/": {
    title: "DivyaNexus — Vedic Knowledge & Learning",
    description: "Explore source-aware Vedic knowledge, bilingual Tamil–English learning paths, devotional reflection, temples, deities and a clearly bounded local guide.",
    schemaType: "WebPage",
    label: "Home",
  },
  "/explore": {
    title: "Explore the Knowledge Universe — DivyaNexus",
    description: "Choose a clearly marked path through scriptures, deities, temples, festivals, glossary records, learning sequences and reflective guidance.",
    schemaType: "CollectionPage",
    label: "Explore",
  },
  "/ask-divya": {
    title: "Ask Divya — Source-Aware Local Guidance",
    description: "Ask a bounded question and receive a local learning response that keeps source text, editorial translation, interpretation and generated explanation distinct.",
    schemaType: "WebPage",
    label: "Ask Divya",
  },
  "/ask": {
    title: "Ask Divya — DivyaNexus",
    description: "Open the source-aware DivyaNexus question pathway.",
    robots: "noindex,follow",
    schemaType: "WebPage",
    label: "Ask Divya alias",
  },
  "/search": {
    title: "Tamil and English Knowledge Search — DivyaNexus",
    description: "Search the local DivyaNexus collection in Tamil, English and common transliteration aliases while keeping record type and editorial status visible.",
    schemaType: "SearchResultsPage",
    label: "Search",
  },
  "/scriptures": {
    title: "Scripture Learning Library — DivyaNexus",
    description: "Begin with source-aware scripture records, readable transliteration, bilingual editorial meaning, visible references and clearly separated reflection.",
    schemaType: "CollectionPage",
    label: "Scriptures",
  },
  "/bhagavad-gita": {
    title: "Bhagavad Gita Learning Path — DivyaNexus",
    description: "Study selected Bhagavad Gita references through bilingual starter records, visible chapter and verse references, and transparent editorial boundaries.",
    schemaType: "CollectionPage",
    label: "Bhagavad Gita",
  },
  "/rig-veda": {
    title: "Rig Veda Starter Records — DivyaNexus",
    description: "Explore selected Rig Veda study leads with mandala, sukta and mantra references, bilingual orientation and explicit source-edition limits.",
    schemaType: "CollectionPage",
    label: "Rig Veda",
  },
  "/upanishads": {
    title: "Upanishad Learning Overview — DivyaNexus",
    description: "Enter a careful introductory pathway to inquiry, self-reflection and teacher–student dialogue without collapsing diverse Upanishadic texts into one claim.",
    schemaType: "CollectionPage",
    label: "Upanishads",
  },
  "/deities": {
    title: "Deity Encyclopedia Pathways — DivyaNexus",
    description: "Explore editorial orientation records for foundational deity traditions with symbolism, names, related learning and review status kept visible.",
    schemaType: "CollectionPage",
    label: "Deities",
  },
  "/temples": {
    title: "Temple Journeys and Context — DivyaNexus",
    description: "Study temple architecture, regional memory and devotional context without inventing current travel details, prices, access rules or timings.",
    schemaType: "CollectionPage",
    label: "Temples",
  },
  "/rishis": {
    title: "Rishis and Lineage Context — DivyaNexus",
    description: "Explore bilingual orientation pathways that distinguish textual attribution, lineage tradition, editorial synthesis and areas needing source review.",
    schemaType: "CollectionPage",
    label: "Rishis",
  },
  "/festivals": {
    title: "Festival Context and Regional Practice — DivyaNexus",
    description: "Learn how festival meaning, calendar variation and regional observance can differ, with current dates and ritual instructions excluded until verified.",
    schemaType: "CollectionPage",
    label: "Festivals",
  },
  "/glossary": {
    title: "Bilingual Vedic and Cultural Glossary — DivyaNexus",
    description: "Explore Tamil and English glossary records that resist false one-word equivalence and keep source, speaker, translation and tradition in view.",
    schemaType: "CollectionPage",
    label: "Glossary",
  },
  "/life-guidance": {
    title: "Reflective Life Guidance — DivyaNexus",
    description: "Use source-linked themes for reflection on peace, duty, courage, focus, wisdom and devotion without guarantees, diagnosis or professional advice.",
    schemaType: "CollectionPage",
    label: "Life Guidance",
  },
  "/guidance": {
    title: "Reflective Guidance — DivyaNexus",
    description: "Open the bounded DivyaNexus life-guidance pathway.",
    robots: "noindex,follow",
    schemaType: "WebPage",
    label: "Guidance alias",
  },
  "/learning": {
    title: "Pressure-Free Learning Paths — DivyaNexus",
    description: "Follow calm browser-local learning sequences without streak pressure, rankings or false completion signals, and keep each next step clearly marked.",
    schemaType: "CollectionPage",
    label: "Learning",
  },
  "/kids": {
    title: "Family-Safe Kids Learning — DivyaNexus",
    description: "Explore age-aware cultural learning previews for shared reading and curiosity without child data collection, unrestricted chat or pressure mechanics.",
    schemaType: "CollectionPage",
    label: "Kids",
  },
  "/collection-status": {
    title: "Collection Status and Review Boundaries — DivyaNexus",
    description: "Review what DivyaNexus currently contains, which records are editorial orientation, what still needs source review and which limits remain explicit.",
    schemaType: "CollectionPage",
    label: "Collection Status",
  },
  "/audio": {
    title: "Audio Learning Preview — DivyaNexus",
    description: "Review the DivyaNexus audio-learning boundary, local playback state and the distinction between available interface controls and reviewed recordings.",
    schemaType: "CollectionPage",
    label: "Audio",
  },
  "/library": {
    title: "Browser-Local Study Library — DivyaNexus",
    description: "Manage bookmarks, reading history, saved searches and notes that remain in this browser, with explicit export, import and deletion controls.",
    schemaType: "ProfilePage",
    label: "Local Library",
  },
  "/about": {
    title: "About DivyaNexus",
    description: "Learn the purpose, editorial method, bilingual learning approach and product boundaries behind the DivyaNexus Vedic knowledge experience.",
    schemaType: "AboutPage",
    label: "About",
  },
  "/sources": {
    title: "Sources and Editorial Method — DivyaNexus",
    description: "Review how DivyaNexus distinguishes primary text, translation, editorial overview, interpretation, generated explanation and unresolved source work.",
    schemaType: "WebPage",
    label: "Sources",
  },
  "/privacy": {
    title: "Privacy Policy — DivyaNexus",
    description: "Read how the DivyaNexus static website handles browser-local data, operational requests and the limits of account or cloud synchronisation claims.",
    schemaType: "WebPage",
    label: "Privacy",
  },
  "/terms": {
    title: "Terms of Use — DivyaNexus",
    description: "Review the educational, cultural and devotional-use terms, content boundaries, local-data limitations and acceptable use of DivyaNexus.",
    schemaType: "WebPage",
    label: "Terms",
  },
  "/delete-account": {
    title: "Delete Account Request — DivyaNexus",
    description: "Review the account-deletion request pathway and the distinction between mobile-app account requests and browser-local website data.",
    schemaType: "WebPage",
    label: "Delete Account",
  },
  "/delete-data": {
    title: "Delete Data Request — DivyaNexus",
    description: "Review the data-deletion pathway and use the local library controls for bookmarks, history, searches, preferences and notes stored in this browser.",
    schemaType: "WebPage",
    label: "Delete Data",
  },
  "/disclaimer": {
    title: "AI and Guidance Disclaimer — DivyaNexus",
    description: "Read the limits of generated explanation, devotional reflection and educational guidance, including the absence of guaranteed outcomes or professional advice.",
    schemaType: "WebPage",
    label: "AI Disclaimer",
  },
  "/contact": {
    title: "Contact and Corrections — DivyaNexus",
    description: "Use the DivyaNexus contact pathway for corrections, source suggestions, accessibility feedback, privacy requests and operational enquiries.",
    schemaType: "ContactPage",
    label: "Contact",
  },
  "/status": {
    title: "System Status and Release Evidence — DivyaNexus",
    description: "Review current DivyaNexus release identity, health evidence, production boundaries, direct-route support and public operational endpoints.",
    schemaType: "WebPage",
    label: "System Status",
  },
};

export const notFoundMeta: RouteMeta = {
  title: "Page Not Found — DivyaNexus",
  description: "The requested DivyaNexus route was not found. Return to the knowledge universe, search the local collection or open a well-marked learning path.",
  robots: "noindex,follow",
  schemaType: "WebPage",
  label: "Page not found",
};

function titleCaseSlug(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function resolveRouteMeta(location: string): RouteMeta {
  const path = location.split("?")[0].replace(/\/$/, "") || "/";
  const direct = routeMetaByPath[path];
  if (direct) return { ...direct, image: direct.image ?? defaultImage };
  if (path.startsWith("/deities/")) {
    const slug = decodeURIComponent(path.slice("/deities/".length));
    const name = titleCaseSlug(slug || "deity");
    return {
      title: `${name} Editorial Context — DivyaNexus`,
      description: `Explore the DivyaNexus editorial orientation pathway for ${name}, with names, symbolism, related learning and source-review boundaries kept visible.`,
      image: defaultImage,
      schemaType: "WebPage",
      label: `${name} deity context`,
    };
  }
  return { ...notFoundMeta, image: defaultImage };
}

export function canonicalForLocation(location: string) {
  const path = location.split("?")[0].replace(/\/$/, "") || "/";
  return path === "/" ? `${DIVYANEXUS_RELEASE.domain}/` : `${DIVYANEXUS_RELEASE.domain}${path}`;
}
