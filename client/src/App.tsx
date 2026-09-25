/**
 * DivyaNexus — Celestial Manuscript Atelier.
 * Every route stays within one editorial shell so navigation, search, accessibility,
 * the local audio state, and explicit content boundaries remain consistent.
 */
import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Router, Switch, useLocation } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { AudioMiniPlayer } from "@/components/AudioMiniPlayer";
import { CollectionCoverage } from "@/components/CollectionCoverage";
import { DocumentMeta } from "@/components/DocumentMeta";
import { RouteExperience } from "@/components/RouteExperience";
import { SearchOverlay } from "@/components/SearchOverlay";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getPreference, setPreference } from "@/lib/localLibrary";
const About = lazy(() => import("@/pages/About"));
const AskDivya = lazy(() => import("@/pages/AskDivya"));
const Audio = lazy(() => import("@/pages/Audio"));
const CollectionStatus = lazy(() => import("@/pages/CollectionStatus"));
const Contact = lazy(() => import("@/pages/Contact"));
const ContentDirectory = lazy(() => import("@/pages/ContentDirectory"));
const DeityDetail = lazy(() => import("@/pages/DeityDetail"));
const DeityDirectory = lazy(() => import("@/pages/DeityDirectory"));
const Explore = lazy(() => import("@/pages/Explore"));
const Home = lazy(() => import("@/pages/Home"));
const KnowledgeNexus = lazy(() => import("@/pages/KnowledgeNexus"));
const LegalPage = lazy(() => import("@/pages/LegalPage"));
const Library = lazy(() => import("@/pages/Library"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const ScriptureReader = lazy(() => import("@/pages/ScriptureReader"));
const SearchPage = lazy(() => import("@/pages/SearchPage"));
const Status = lazy(() => import("@/pages/Status"));

function RestoreLegacyPath() {
  const [location, setLocation] = useLocation();
  useEffect(() => {
    const legacyPath = new URLSearchParams(window.location.search).get("path");
    if (legacyPath && legacyPath.startsWith("/")) setLocation(legacyPath, { replace: true });
  }, [location, setLocation]);
  return null;
}

function AppRoutes({ onAsk, onSearch }: { onAsk: () => void; onSearch: () => void }) {
  return (
    <Switch>
      <Route path="/">{() => <Home onAsk={onAsk} onSearch={onSearch} />}</Route>
      <Route path="/nexus" component={KnowledgeNexus} />
      <Route path="/explore">{() => <Explore onSearch={onSearch} />}</Route>
      <Route path="/ask-divya" component={AskDivya} />
      <Route path="/ask" component={AskDivya} />
      <Route path="/search" component={SearchPage} />
      <Route path="/scriptures">{() => <ScriptureReader kind="scriptures" />}</Route>
      <Route path="/bhagavad-gita">{() => <ScriptureReader kind="bhagavad-gita" />}</Route>
      <Route path="/rig-veda">{() => <ScriptureReader kind="rig-veda" />}</Route>
      <Route path="/upanishads">{() => <ScriptureReader kind="upanishads" />}</Route>
      <Route path="/deities/:slug">{(params) => <DeityDetail slug={params?.slug ?? ""} />}</Route>
      <Route path="/deities" component={DeityDirectory} />
      <Route path="/temples">{() => <ContentDirectory kind="temples" />}</Route>
      <Route path="/rishis">{() => <ContentDirectory kind="rishis" />}</Route>
      <Route path="/festivals">{() => <ContentDirectory kind="festivals" />}</Route>
      <Route path="/glossary">{() => <ContentDirectory kind="glossary" />}</Route>
      <Route path="/life-guidance">{() => <ContentDirectory kind="life-guidance" />}</Route>
      <Route path="/guidance">{() => <ContentDirectory kind="life-guidance" />}</Route>
      <Route path="/learning">{() => <ContentDirectory kind="learning" />}</Route>
      <Route path="/kids">{() => <ContentDirectory kind="kids" />}</Route>
      <Route path="/collection-status" component={CollectionStatus} />
      <Route path="/audio" component={Audio} />
      <Route path="/library" component={Library} />
      <Route path="/about" component={About} />
      <Route path="/sources">{() => <LegalPage page="sources" />}</Route>
      <Route path="/privacy">{() => <LegalPage page="privacy" />}</Route>
      <Route path="/terms">{() => <LegalPage page="terms" />}</Route>
      <Route path="/delete-account">{() => <LegalPage page="delete-account" />}</Route>
      <Route path="/delete-data">{() => <LegalPage page="delete-data" />}</Route>
      <Route path="/disclaimer">{() => <LegalPage page="disclaimer" />}</Route>
      <Route path="/contact" component={Contact} />
      <Route path="/status" component={Status} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppShell() {
  const [location, setLocation] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState<"night" | "dawn">(() => getPreference("theme", "night") === "dawn" ? "dawn" : "night");
  useEffect(() => {
    document.documentElement.classList.toggle("dawn", theme === "dawn");
    setPreference("theme", theme);
  }, [theme]);
  const openAsk = () => setLocation("/ask-divya");
  return (
    <TooltipProvider>
      <DocumentMeta />
      <RouteExperience />
      <RestoreLegacyPath />
      <div className="site-shell">
        <SiteHeader theme={theme} onToggleTheme={() => setTheme((current) => current === "night" ? "dawn" : "night")} onSearch={() => setSearchOpen(true)} onAsk={openAsk} />
        <div className="page-shell"><Suspense fallback={<div className="route-loading" role="status"><span />Opening a study path…</div>}><AppRoutes onAsk={openAsk} onSearch={() => setSearchOpen(true)} /></Suspense></div>
        {location === "/" && <CollectionCoverage />}
        <SiteFooter />
        <AudioMiniPlayer />
      </div>
      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
      <Toaster />
    </TooltipProvider>
  );
}

export default function App() {
  const base = import.meta.env.BASE_URL === "/" ? "" : import.meta.env.BASE_URL.replace(/\/$/, "");
  return (
    <AppErrorBoundary>
      <Router base={base}>
        <AppShell />
      </Router>
    </AppErrorBoundary>
  );
}
