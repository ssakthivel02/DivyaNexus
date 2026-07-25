/**
 * Divine Observatory Cinema: Search is a luminous knowledge threshold, with Tamil, English, and transliteration treated equally.
 * It stays browser-local in Stage B and shows clear boundaries rather than simulating an unavailable remote AI service.
 */
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, History, Mic, Search, Sparkles, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { ASSETS, searchRecords, type ContentCategory } from "@/data/content";
import { getSavedSearches, saveSearch } from "@/lib/localLibrary";

const categories: (ContentCategory | "All")[] = ["All", "Scripture", "Glossary", "Guidance", "Deity", "Temple", "Rishi", "Festival", "Learning"];
const suggestions = ["அமைதி", "dharma", "Bhagavad Gita", "Murugan", "temple", "gnanam"];

export default function SearchPage() {
  const [, setLocation] = useLocation();
  const initial = new URLSearchParams(window.location.search).get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const [category, setCategory] = useState<ContentCategory | "All">("All");
  const [recent, setRecent] = useState<string[]>(() => getSavedSearches());
  const [voiceNotice, setVoiceNotice] = useState(false);
  const results = useMemo(() => searchRecords(query, category), [query, category]);
  useEffect(() => {
    const refresh = () => setRecent(getSavedSearches());
    window.addEventListener("divyanexus-library-change", refresh);
    return () => window.removeEventListener("divyanexus-library-change", refresh);
  }, []);
  const runSearch = (value = query) => {
    const next = value.trim();
    if (!next) return;
    setQuery(next);
    saveSearch(next);
    setRecent(getSavedSearches());
    setLocation(`/search?q=${encodeURIComponent(next)}`);
  };

  return <main id="main-content" className="page-main search-cinema">
    <section className="search-cinema__hero">
      <img src={ASSETS.heroArchive} alt="A moonlit horizon over a star-filled celestial archive" fetchPriority="high" />
      <div className="search-cinema__veil" />
      <div className="search-cinema__rings" aria-hidden="true"><i /><i /><i /></div>
      <div className="search-cinema__hero-copy">
        <p className="scene-kicker"><Sparkles size={14} aria-hidden="true" />Universal knowledge search</p>
        <p className="search-cinema__tamil" lang="ta">சொல், ஒலி, எழுத்து வழியாகத் தேடுங்கள்</p>
        <h1>A word can open an <em>entire universe.</em></h1>
        <p>Search starter records in Tamil, English, and common transliteration aliases. Results remain local, fast, and clear about their editorial scope.</p>
      </div>
    </section>

    <section className="search-cinema__workspace" aria-label="Knowledge search">
      <form className="search-cinema__field" onSubmit={(event) => { event.preventDefault(); runSearch(); }}>
        <Search size={20} aria-hidden="true" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="அமைதி, dharma, amaithi, duty, wisdom…" aria-label="Search knowledge records" autoComplete="off" />
        {query && <button type="button" className="search-cinema__clear" onClick={() => setQuery("")} aria-label="Clear search"><X size={16} /></button>}
        <button type="submit" className="search-cinema__submit">Search</button>
      </form>
      <div className="search-cinema__utilities"><div className="search-cinema__filters" aria-label="Filter search results">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={category === item ? "is-active" : ""} aria-pressed={category === item}>{item}</button>)}</div><button className="search-cinema__voice" type="button" onClick={() => setVoiceNotice(true)}><Mic size={15} aria-hidden="true" />Voice-ready</button></div>
      {voiceNotice && <div className="search-cinema__voice-notice" role="status">Voice search is intentionally not enabled in this static release. Use Tamil, English, or transliteration input above.</div>}
      {!query && <div className="search-cinema__starting-points"><div><p className="scene-kicker"><Sparkles size={14} aria-hidden="true" />Suggested doorways</p><div className="search-cinema__chips">{suggestions.map((term) => <button key={term} onClick={() => runSearch(term)}>{term}</button>)}</div></div>{recent.length > 0 && <div><p className="scene-kicker"><History size={14} aria-hidden="true" />Your browser-local history</p><div className="search-cinema__recent">{recent.slice(0, 5).map((term) => <button key={term} onClick={() => runSearch(term)}><History size={13} aria-hidden="true" />{term}</button>)}</div></div>}</div>}
      <div className="search-cinema__results-heading"><p className="scene-kicker">Search field</p><h2>{query ? <>{results.length} {results.length === 1 ? "record" : "records"} found</> : <>Begin with a <em>question.</em></>}</h2><p>{query ? "Unicode-normalized aliases help bring Tamil, English, and transliteration together." : "Choose a suggestion, type a word, or explore the local record collection."}</p></div>
      {query && <div className="search-cinema__results">{results.map((record, index) => <Link key={record.id} href={`${record.route}?record=${record.id}`} onClick={() => saveSearch(query)} className="search-cinema__result"><span className="search-cinema__result-index">{String(index + 1).padStart(2, "0")}</span><div><p>{record.category}</p><h3>{record.title}<span lang="ta">{record.tamilTitle}</span></h3><span>{record.englishMeaning}</span></div><ArrowUpRight size={20} aria-hidden="true" /></Link>)}{!results.length && <div className="search-cinema__empty"><div><Search size={24} aria-hidden="true" /><h3>No direct record has surfaced yet.</h3><p>Try “peace”, “அமைதி”, “dharma”, “kadami”, or “gnanam”—or begin with one of the suggested doors above.</p></div><div className="search-cinema__chips">{suggestions.slice(0, 4).map((term) => <button key={term} onClick={() => runSearch(term)}>{term}</button>)}</div></div>}</div>}
    </section>
  </main>;
}
