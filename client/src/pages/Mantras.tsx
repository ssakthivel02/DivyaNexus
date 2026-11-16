import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, RotateCcw, Search, Undo2 } from "lucide-react";
import { japaGoals, MANTRA_EDITORIAL_STATUS, mantraRecords } from "@/data/mantras";
import "./mantras.css";

const STORE_KEY = "divyanexus.japa.v1";
type JapaState = { selectedId: string; goal: number; counts: Record<string, number> };
const defaultState: JapaState = { selectedId: mantraRecords[0].id, goal: 108, counts: {} };

function readState(): JapaState {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return defaultState;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return defaultState;
    const state = parsed as Record<string, unknown>;
    const selectedId = mantraRecords.some((item) => item.id === state.selectedId)
      ? state.selectedId as string : defaultState.selectedId;
    const goal = japaGoals.find((value) => value === state.goal) ?? 108;
    const counts: Record<string, number> = {};
    if (state.counts && typeof state.counts === "object" && !Array.isArray(state.counts)) {
      const incoming = state.counts as Record<string, unknown>;
      for (const item of mantraRecords) {
        const value = incoming[item.id];
        if (typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= 1008) {
          counts[item.id] = value;
        }
      }
    }
    return { selectedId, goal, counts };
  } catch { return defaultState; }
}

export default function Mantras() {
  const [state, setState] = useState<JapaState>(readState);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [notice, setNotice] = useState("");
  const selected = mantraRecords.find((item) => item.id === state.selectedId) ?? mantraRecords[0];
  const count = state.counts[selected.id] ?? 0;
  const completed = count >= state.goal;
  const categories = ["All", ...Array.from(new Set(mantraRecords.map((item) => item.tradition)))];
  const visible = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return mantraRecords.filter((item) => (category === "All" || item.tradition === category) &&
      [item.title, item.tamil, item.iast, item.tradition, item.devanagari]
        .some((part) => part.toLocaleLowerCase().includes(term)));
  }, [category, query]);

  useEffect(() => {
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
    catch { /* Private browsing or full storage: counter remains usable in memory. */ }
  }, [state]);

  const updateCount = (step: number) => {
    setState((current) => {
      const previous = current.counts[current.selectedId] ?? 0;
      const next = Math.max(0, Math.min(current.goal, previous + step));
      return { ...current, counts: { ...current.counts, [current.selectedId]: next } };
    });
  };
  const reset = () => {
    if (!window.confirm("Reset the count for this mantra? This cannot be undone.")) return;
    setState((current) => ({ ...current, counts: { ...current.counts, [current.selectedId]: 0 } }));
    setNotice("This mantra's count was reset.");
  };

  return (
    <main id="main-content" className="mantra-library">
      <div className="mantra-library__inner">
        <Link href="/scriptures" className="mantra-library__back"><ArrowLeft size={16} aria-hidden="true" /> Scriptures</Link>
        <p className="scene-kicker">DIVYANEXUS / DEVOTIONAL STUDY</p>
        <h1>Mantra Library <span lang="ta">மந்திரத் தொகுப்பு</span></h1>
        <p className="mantra-library__lead">Explore {mantraRecords.length} carefully labelled mantra candidates with Tamil reading aids, transliteration, source leads, and a private one-tap japa counter.</p>
        <p className="mantra-library__review" role="note"><strong>Editorial gate:</strong> {MANTRA_EDITORIAL_STATUS}. Source links are research leads, not final approval. Tamil renderings are approximate pronunciation aids, not original Tamil compositions. Practices and initiation rules vary by tradition.</p>

        <div className="mantra-library__layout">
          <section className="mantra-library__browse" aria-label="Choose a mantra">
            <label className="mantra-library__label" htmlFor="mantra-search">Search name or mantra (English / தமிழ்)</label>
            <div className="mantra-library__search"><Search size={17} aria-hidden="true" /><input id="mantra-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Murugan, சிவா, Gayatri…" /></div>
            <label className="mantra-library__label" htmlFor="mantra-category">Tradition / deity</label>
            <select id="mantra-category" value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <p className="mantra-library__results">{visible.length} of {mantraRecords.length} mantras</p>
            <div className="mantra-library__items">
              {visible.map((item) => (
                <button type="button" key={item.id} className={item.id === selected.id ? "mantra-library__item is-selected" : "mantra-library__item"}
                  aria-pressed={item.id === selected.id}
                  onClick={() => { setState((current) => ({ ...current, selectedId: item.id })); setNotice(""); }}>
                  <span className="mantra-library__item-title">{item.title}</span>
                  <span lang="ta">{item.tamil}</span>
                  <small>{item.tradition} · {item.evidenceStatus === "linked-reference" ? "Source lead linked" : "Source review needed"}</small>
                </button>
              ))}
              {visible.length === 0 && <p role="status">No matching mantra. Try a different spelling or deity.</p>}
            </div>
          </section>

          <section className="mantra-library__detail" aria-labelledby="mantra-detail-title">
            <p className="scene-kicker">{selected.tradition} · Candidate recitation</p>
            <h2 id="mantra-detail-title">{selected.title}</h2>
            <p className="mantra-library__tamil" lang="ta">{selected.tamil}</p>
            {selected.devanagari && <p className="mantra-library__devanagari" lang="sa">{selected.devanagari}</p>}
            <p className="mantra-library__iast">{selected.iast}</p>
            <div className="mantra-library__meaning">
              <h3>Meaning · பொருள்</h3>
              <p>{selected.englishMeaning}</p>
              <p lang="ta">{selected.tamilMeaning}</p>
            </div>
            <div className="mantra-library__source">
              <strong>{selected.evidenceStatus === "linked-reference" ? "Source lead linked · human review pending" : "Traditional invocation · exact textual source pending"}</strong>
              <span>{selected.sourceLabel}</span>
              {selected.sourceUrl && <a href={selected.sourceUrl} rel="noopener noreferrer" target="_blank">Review source reference (opens a new tab)</a>}
            </div>

            <div className="mantra-library__counter" aria-labelledby="japa-counter-title">
              <h3 id="japa-counter-title">Japa counter · ஜப எண்ணிக்கை</h3>
              <p className="mantra-library__counter-hint">Recite the full selected mantra once, then tap +1. Counting is optional, not a religious requirement.</p>
              <label className="mantra-library__label" htmlFor="japa-goal">Target count</label>
              <select id="japa-goal" value={state.goal} onChange={(event) => setState((current) => ({ ...current, goal: Number(event.target.value) }))}>
                {japaGoals.map((goal) => <option key={goal} value={goal}>{goal} chants</option>)}
              </select>
              <p className="mantra-library__count" aria-live="polite">{Math.min(count, state.goal)} <span>/ {state.goal}</span></p>
              <div className="mantra-library__progress" role="progressbar" aria-label="Chants completed" aria-valuemin={0} aria-valuemax={state.goal} aria-valuenow={Math.min(count, state.goal)}>
                <span style={{ width: `${Math.min(100, (count / state.goal) * 100)}%` }} />
              </div>
              <p className="mantra-library__counter-hint">{completed ? "Target reached. வேல் வேல் முருகா! 🙏" : `${state.goal - count} remaining`}</p>
              <button type="button" className="mantra-library__tap" disabled={completed} onClick={() => { updateCount(1); setNotice(""); }}>+1 · Count one chant</button>
              <div className="mantra-library__counter-tools">
                <button type="button" disabled={count === 0} onClick={() => { updateCount(-1); setNotice(""); }}><Undo2 size={16} aria-hidden="true" /> Undo</button>
                <button type="button" disabled={count === 0} onClick={reset}><RotateCcw size={16} aria-hidden="true" /> Reset this mantra</button>
              </div>
              {notice && <p role="status">{notice}</p>}
              <p className="mantra-library__privacy">Saved only in this browser. No login, cloud sync, audio recording, or streak tracking. The local library's data-clear operation also removes this count; its existing export currently does not include it.</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
