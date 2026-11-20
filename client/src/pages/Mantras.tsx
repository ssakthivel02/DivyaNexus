import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, RotateCcw, Search, Undo2 } from "lucide-react";
import { japaGoals, MANTRA_EDITORIAL_STATUS, mantraRecords, stepJapaCount } from "@/data/mantras";
import "./mantras.css";

import { defaultJapaProgress, readJapaProgress, writeJapaProgress, type JapaState } from "@/lib/localJapaProgress";

export default function Mantras() {
  const [state, setState] = useState<JapaState>(() => readJapaProgress() ?? defaultJapaProgress());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [notice, setNotice] = useState("");
  const [persisted, setPersisted] = useState(true);
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
    try { writeJapaProgress(state); setPersisted(true); }
    catch { setPersisted(false); }
  }, [state]);

  const updateCount = (step: 1 | -1) => {
    setState((current) => {
      const previous = current.counts[current.selectedId] ?? 0;
      const next = stepJapaCount(previous, current.goal, step);
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
        <p className="mantra-library__review" role="note"><strong>Editorial gate:</strong> {MANTRA_EDITORIAL_STATUS}. Source links are research leads, not final approval. Tamil-script Sanskrit renderings are approximate pronunciation aids; Tamil devotional invocations retain their own language. Practices and initiation rules vary by tradition.</p>

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
              <p className="mantra-library__count" aria-live="polite">{count} <span>/ {state.goal}</span></p>
              <div className="mantra-library__progress" role="progressbar" aria-label="Chants completed" aria-valuemin={0} aria-valuemax={state.goal} aria-valuenow={Math.min(count, state.goal)}>
                <span style={{ width: `${Math.min(100, (count / state.goal) * 100)}%` }} />
              </div>
              <p className="mantra-library__counter-hint">{completed ? "Target reached. ஜப எண்ணிக்கை நிறைவு! 🙏" : `${state.goal - count} remaining`}</p>
              <button type="button" className="mantra-library__tap" disabled={completed} onClick={() => { updateCount(1); setNotice(""); }}>+1 · Count one chant</button>
              <div className="mantra-library__counter-tools">
                <button type="button" disabled={count === 0} onClick={() => { updateCount(-1); setNotice(""); }}><Undo2 size={16} aria-hidden="true" /> Undo</button>
                <button type="button" disabled={count === 0} onClick={reset}><RotateCcw size={16} aria-hidden="true" /> Reset this mantra</button>
              </div>
              {notice && <p role="status">{notice}</p>}
              <p className="mantra-library__privacy">{persisted ? "Progress is stored only in this browser." : "Browser storage is unavailable; this count is temporary and may be lost on reload."} No login, cloud sync, audio recording, or streak tracking. <Link href="/library">Back up, restore, or clear local data in My Library.</Link> Restore keeps the higher valid count per mantra; backups may contain private devotional activity, so keep them secure.</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
