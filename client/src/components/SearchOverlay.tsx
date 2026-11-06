/** Celestial Manuscript Atelier: keyboard-accessible search behaves like a focused study instrument. */
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { records, searchRecords } from "@/data/content";
import { saveSearch } from "@/lib/localLibrary";

export function SearchOverlay({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState("");
  const matches = useMemo(() => (query ? searchRecords(query).slice(0, 6) : records.slice(0, 5)), [query]);
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [onOpenChange]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="search-dialog" aria-describedby={undefined}>
        <DialogTitle className="sr-only">Search DivyaNexus</DialogTitle>
        <div className="search-dialog__input">
          <Search size={21} aria-hidden="true" />
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && query.trim()) saveSearch(query); }} placeholder="Search Tamil, English, or transliteration…" aria-label="Search Tamil, English, or transliteration" />
          <button onClick={() => onOpenChange(false)} aria-label="Close search"><X size={18} aria-hidden="true" /></button>
        </div>
        <div className="search-dialog__meta"><span>Try: அமைதி, dharma, amaithi, duty, ஜ்ஞானம்</span><kbd>ESC</kbd></div>
        <div className="search-dialog__results" aria-live="polite">
          {matches.map((record) => (
            <Link key={record.id} href={`${record.route}?record=${record.id}`} onClick={() => { if (query) saveSearch(query); onOpenChange(false); }} className="search-result">
              <span className="search-result__kind">{record.category}</span>
              <span className="search-result__content"><strong>{record.title}</strong><small lang="ta">{record.tamilTitle}</small></span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          ))}
          {!matches.length && <p className="empty-inline">No direct match yet. Try “peace”, “அமைதி”, “dharma”, or “kadami”.</p>}
        </div>
        <Link className="search-dialog__all" href={`/search?q=${encodeURIComponent(query)}`} onClick={() => { if (query) saveSearch(query); onOpenChange(false); }}>View all search results <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </DialogContent>
    </Dialog>
  );
}
