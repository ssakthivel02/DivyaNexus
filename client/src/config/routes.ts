export type AppRoute = {
  path: string;
  label: string;
  section: "core" | "study" | "library" | "legal" | "system";
  sitemap: boolean;
  smoke: boolean;
  dynamic?: boolean;
};

export const APP_ROUTES: readonly AppRoute[] = [
  { path: "/", label: "Home", section: "core", sitemap: true, smoke: true },
  { path: "/explore", label: "Explore", section: "core", sitemap: true, smoke: true },
  { path: "/ask-divya", label: "Ask Divya", section: "core", sitemap: true, smoke: true },
  { path: "/ask", label: "Ask alias", section: "core", sitemap: false, smoke: false },
  { path: "/search", label: "Search", section: "core", sitemap: true, smoke: true },
  { path: "/scriptures", label: "Scriptures", section: "study", sitemap: true, smoke: true },
  { path: "/bhagavad-gita", label: "Bhagavad Gita", section: "study", sitemap: true, smoke: true },
  { path: "/rig-veda", label: "Rig Veda", section: "study", sitemap: true, smoke: true },
  { path: "/upanishads", label: "Upanishads", section: "study", sitemap: true, smoke: true },
  { path: "/deities", label: "Deities", section: "study", sitemap: true, smoke: true },
  { path: "/deities/:slug", label: "Deity detail", section: "study", sitemap: false, smoke: false, dynamic: true },
  { path: "/temples", label: "Temples", section: "study", sitemap: true, smoke: true },
  { path: "/rishis", label: "Rishis", section: "study", sitemap: true, smoke: false },
  { path: "/festivals", label: "Festivals", section: "study", sitemap: true, smoke: false },
  { path: "/glossary", label: "Glossary", section: "study", sitemap: true, smoke: false },
  { path: "/life-guidance", label: "Life Guidance", section: "study", sitemap: true, smoke: true },
  { path: "/guidance", label: "Guidance alias", section: "study", sitemap: false, smoke: false },
  { path: "/learning", label: "Learning", section: "study", sitemap: true, smoke: false },
  { path: "/kids", label: "Kids", section: "study", sitemap: true, smoke: false },
  { path: "/collection-status", label: "Collection Status", section: "study", sitemap: true, smoke: true },
  { path: "/audio", label: "Audio", section: "library", sitemap: true, smoke: false },
  { path: "/library", label: "Local Library", section: "library", sitemap: true, smoke: true },
  { path: "/about", label: "About", section: "legal", sitemap: true, smoke: false },
  { path: "/sources", label: "Sources", section: "legal", sitemap: true, smoke: true },
  { path: "/privacy", label: "Privacy", section: "legal", sitemap: true, smoke: true },
  { path: "/terms", label: "Terms", section: "legal", sitemap: true, smoke: false },
  { path: "/delete-account", label: "Delete Account", section: "legal", sitemap: true, smoke: false },
  { path: "/delete-data", label: "Delete Data", section: "legal", sitemap: true, smoke: false },
  { path: "/disclaimer", label: "AI Disclaimer", section: "legal", sitemap: true, smoke: false },
  { path: "/contact", label: "Contact", section: "legal", sitemap: true, smoke: false },
  { path: "/status", label: "System Status", section: "system", sitemap: true, smoke: true },
] as const;

export const STATIC_APP_ROUTES = APP_ROUTES.filter((route) => !route.dynamic);
export const SITEMAP_ROUTES = APP_ROUTES.filter((route) => route.sitemap && !route.dynamic);
export const PRODUCTION_SMOKE_ROUTES = APP_ROUTES.filter((route) => route.smoke && !route.dynamic);
export const DIRECT_ROUTE_SAMPLES = ["/deities/shiva", "/deities/murugan", "/deities/nataraja"] as const;
