/**
 * Divine Observatory Cinema: Library is an illuminated personal study archive, while all stored material remains visibly browser-local.
 * The visual language treats bookmarks, notes, and reading history as a quiet manuscript margin rather than an account dashboard.
 */
import { useEffect, useRef, useState } from "react";
import { Bookmark, Download, FileText, HardDrive, History, RotateCcw, Search, Trash2, Upload, X } from "lucide-react";
import { Link } from "wouter";
import { ASSETS, records } from "@/data/content";
import {
  clearLocalLibrary,
  deleteNote,
  exportLocalLibrary,
  getBookmarks,
  getHistory,
  getSavedSearches,
  getStorageEstimate,
  importLocalLibrary,
  listNotes,
  saveNote,
  type LocalNote,
} from "@/lib/localLibrary";

function formatBytes(value: number) {
  if (!value) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  return `${(value / 1024 ** index).toFixed(index > 1 ? 1 : 0)} ${units[index]}`;
}

export default function Library() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [searches, setSearches] = useState<string[]>([]);
  const [notes, setNotes] = useState<LocalNote[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("");
  const [storage, setStorage] = useState("Storage estimate loading…");
  const importInput = useRef<HTMLInputElement>(null);

  const refresh = async () => {
    setBookmarks(getBookmarks());
    setHistory(getHistory());
    setSearches(getSavedSearches());
    setNotes(await listNotes());
    const estimate = await getStorageEstimate();
    setStorage(estimate ? `${formatBytes(estimate.usage)} used of ${formatBytes(estimate.quota)} browser quota` : "Storage estimate unavailable in this browser");
  };

  useEffect(() => {
    refresh();
    const listener = () => refresh();
    window.addEventListener("divyanexus-library-change", listener);
    return () => window.removeEventListener("divyanexus-library-change", listener);
  }, []);

  const addNote = async () => {
    if (!title.trim() && !body.trim()) return;
    await saveNote({ recordId: "general", title: title.trim() || "Untitled note", body: body.trim() });
    setTitle("");
    setBody("");
    setStatus("Note saved in this browser");
    await refresh();
  };

  const clear = async () => {
    if (window.confirm("Clear browser-local DivyaNexus bookmarks, history, saved searches, notes, and preferences from this browser?")) {
      await clearLocalLibrary();
      setStatus("Browser-local study data cleared");
      await refresh();
    }
  };

  const restore = async (file: File | undefined) => {
    if (!file) return;
    try {
      const result = await importLocalLibrary(await file.text());
      setStatus(`Local data restored: ${result.bookmarks} bookmarks, ${result.history} history items, ${result.savedSearches} searches and ${result.notes} imported notes.`);
      await refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "The selected local-data file could not be restored.");
    } finally {
      if (importInput.current) importInput.current.value = "";
    }
  };

  const removeNote = async (noteId: string) => {
    await deleteNote(noteId);
    setStatus("Local note deleted");
    await refresh();
  };

  const titles = (ids: string[]) => ids.map((id) => records.find((record) => record.id === id)).filter(Boolean);

  return <main id="main-content" className="page-main library-cinema">
    <section className="library-cinema__hero">
      <img src={ASSETS.scripture} alt="An illuminated manuscript and study objects in a quiet archive" fetchPriority="high" />
      <div className="library-cinema__veil" />
      <div className="library-cinema__folio-lines" aria-hidden="true" />
      <div className="library-cinema__hero-copy"><p className="scene-kicker"><Bookmark size={14} aria-hidden="true" />Personal study archive</p><p lang="ta">உங்கள் உலாவியில் இருக்கும் கற்றல் தடங்கள்</p><h1>Keep a quiet <em>margin</em> for study.</h1><p>Bookmarks, reading history, searches, and notes in this Stage B website live only in this browser. They are not represented as a synchronized account.</p></div>
    </section>

    <section className="library-cinema__overview" aria-label="Local study totals">
      <div className="library-cinema__stat"><strong>{bookmarks.length}</strong><span>Saved records</span></div><div className="library-cinema__stat"><strong>{history.length}</strong><span>Reading trails</span></div><div className="library-cinema__stat"><strong>{searches.length}</strong><span>Saved searches</span></div><div className="library-cinema__stat"><strong>{notes.length}</strong><span>Local notes</span></div>
      <div className="library-cinema__actions">
        <button className="library-cinema__export" onClick={exportLocalLibrary}><Download size={16} aria-hidden="true" />Export local data</button>
        <button className="library-cinema__import" onClick={() => importInput.current?.click()}><Upload size={16} aria-hidden="true" />Restore local data</button>
        <input ref={importInput} type="file" accept="application/json,.json" className="library-cinema__file-input" aria-label="Choose DivyaNexus local data JSON" onChange={(event) => restore(event.target.files?.[0])} />
        <button className="library-cinema__clear" onClick={clear}><Trash2 size={16} aria-hidden="true" />Clear local data</button>
      </div>
      <p className="library-cinema__storage"><HardDrive size={15} aria-hidden="true" />{storage}</p>
      {status && <p className="library-cinema__status" role="status">{status}</p>}
    </section>

    <section className="library-cinema__shelves">
      <div className="library-cinema__heading"><div><p className="scene-kicker"><Bookmark size={14} aria-hidden="true" />Saved reading</p><h2>Return to a <em>well-marked</em> place.</h2></div><p>Every saved item stays on this device until you export or clear it.</p></div>
      <div className="library-cinema__shelf-grid">
        <article className="library-cinema__shelf"><header><span><Bookmark size={16} aria-hidden="true" /></span><div><p>Bookmarks</p><small>Saved reading</small></div></header>{titles(bookmarks).length ? <div className="library-cinema__record-list">{titles(bookmarks).map((record) => record && <Link key={record.id} href={`${record.route}?record=${record.id}`}><span>{record.title}</span><small>{record.englishMeaning}</small></Link>)}</div> : <div className="library-cinema__empty"><Bookmark size={22} aria-hidden="true" /><p>Nothing saved yet. Use Bookmark inside a study record to bring it here.</p></div>}</article>
        <article className="library-cinema__shelf"><header><span><History size={16} aria-hidden="true" /></span><div><p>Reading history</p><small>Recent study trails</small></div></header>{titles(history).length ? <div className="library-cinema__record-list">{titles(history).map((record) => record && <Link key={record.id} href={`${record.route}?record=${record.id}`}><span>{record.title}</span><small>{record.source} · {record.reference}</small></Link>)}</div> : <div className="library-cinema__empty"><History size={22} aria-hidden="true" /><p>Your reading trail will appear after you open a starter record.</p></div>}</article>
        <article className="library-cinema__shelf library-cinema__shelf--searches"><header><span><Search size={16} aria-hidden="true" /></span><div><p>Saved searches</p><small>Browser-local questions</small></div></header>{searches.length ? <div className="library-cinema__search-tags">{searches.map((term) => <Link key={term} href={`/search?q=${encodeURIComponent(term)}`}>{term}</Link>)}</div> : <div className="library-cinema__empty"><Search size={22} aria-hidden="true" /><p>Searches you run will gather here as private starting points.</p></div>}</article>
      </div>
    </section>

    <section className="library-cinema__notes">
      <div className="library-cinema__heading"><div><p className="scene-kicker"><FileText size={14} aria-hidden="true" />Study margin</p><h2>Leave a small <em>note</em> beside the text.</h2></div><p>Notes use IndexedDB where supported by your browser. They remain here unless you choose to export them.</p></div>
      <div className="library-cinema__notes-grid"><form className="library-cinema__composer" onSubmit={(event) => { event.preventDefault(); addNote(); }}><label>Note title<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="A question to revisit" /></label><label>Reflection<textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="A thought, source, or line to return to…" /></label><button type="submit"><FileText size={16} aria-hidden="true" />Save locally</button></form><div className="library-cinema__note-stack">{notes.length ? notes.map((note) => <article key={note.id}><button type="button" className="library-cinema__delete-note" onClick={() => removeNote(note.id)} aria-label={`Delete note ${note.title}`}><X size={15} aria-hidden="true" /></button><p>{note.title}</p><span>{note.body || "No note text."}</span><small>Updated {new Date(note.updatedAt).toLocaleString("en-GB")}</small></article>) : <div className="library-cinema__empty library-cinema__empty--notes"><FileText size={22} aria-hidden="true" /><p>No local notes yet. Begin with a small question instead of a perfect summary.</p></div>}</div></div>
    </section>

    <section className="library-cinema__integrity"><RotateCcw size={18} aria-hidden="true" /><p><strong>Backup, restore and deletion:</strong> Export creates a local JSON copy. Restore merges supported local records and ignores unknown fields. Clear local data removes only browser-local material; it does not delete a mobile-app account. For app-account requests, use <Link href="/delete-account">Delete Account</Link> or <Link href="/delete-data">Delete Data</Link>.</p></section>
  </main>;
}
