export interface HomePathway {
  title: string;
  tamil: string;
  detail: string;
  href: string;
}

export const homePathways: HomePathway[] = [
  {
    title: "Explore all",
    tamil: "அனைத்தையும் ஆராயுங்கள்",
    detail: "A living index of knowledge pathways",
    href: "/explore",
  },
  {
    title: "Scripture library",
    tamil: "நூல் உலகம்",
    detail: "Verified passages, translations, and sources",
    href: "/scriptures",
  },
  {
    title: "Deity universe",
    tamil: "தெய்வ உலகம்",
    detail: "Symbols, stories, and traditions in context",
    href: "/deities",
  },
  {
    title: "Temple journeys",
    tamil: "திருக்கோவில் பயணங்கள்",
    detail: "Architecture, memory, and sacred place",
    href: "/temples",
  },
  {
    title: "Life guidance",
    tamil: "வாழ்க்கை வழிகாட்டல்",
    detail: "Questions for the road ahead",
    href: "/life-guidance",
  },
  {
    title: "Kids universe",
    tamil: "குழந்தைகள் உலகம்",
    detail: "Shared learning for young minds",
    href: "/kids",
  },
];

export const popularSearches = [
  { label: "Bhagavad Gita", query: "Bhagavad Gita" },
  { label: "Rig Veda", query: "Rig Veda" },
  { label: "Dharma", query: "dharma" },
  { label: "Peace · அமைதி", query: "peace" },
  { label: "Wisdom · ஞானம்", query: "wisdom" },
] as const;

export const trustSignals = [
  {
    label: "Tamil-first",
    tamil: "தமிழ் முன்னிலை",
    detail: "English and transliteration support",
  },
  {
    label: "Source-aware",
    tamil: "ஆதார விழிப்புணர்வு",
    detail: "Primary text and reflection kept separate",
  },
  {
    label: "Local-first",
    tamil: "உள்ளூர் முன்னிலை",
    detail: "Bookmarks and preferences stay in this browser",
  },
  {
    label: "Family-friendly",
    tamil: "குடும்ப நட்பு",
    detail: "Clear boundaries for shared learning",
  },
] as const;
