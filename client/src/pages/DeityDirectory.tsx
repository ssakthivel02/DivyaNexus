import { useMemo, useState } from "react";
import { ArrowRight, Search, ShieldCheck, Sparkles, X } from "lucide-react";
import { Link } from "wouter";
import { ASSETS } from "@/data/content";
import { deityRecords, searchDeityRecords } from "@/features/deities";
import "@/deity-wave3.css";

const traditions = ["All", "Shaiva", "Vaishnava", "Goddess", "Tamil", "Learning"] as const;

export default function DeityDirectory() {
  const initial = new URLSearchParams(window.location.search).get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const [tradition, setTradition] = useState<(typeof traditions)[number]>("All");

  const results = useMemo(() => {
    const searched = searchDeityRecords(query);
    if (tradition === "All") return searched;
    const needle = tradition.toLocaleLowerCase("en-GB");
    return searched.filter((record) => record.traditions.some((item) => item.toLocaleLowerCase("en-GB").includes(needle)));
  }, [query, tradition]);

  return (
    <main id="main-content" className="page-main deity-directory">
      <section className="deity-directory-hero">
        <img src={ASSETS.deity} alt="Sacred-symbol tableau in warm temple light" fetchPriority="high" />
        <div className="deity-directory-hero__veil" />
        <div className="deity-directory-hero__inner">
          <p className="scene-kicker"><Sparkles size={14} aria-hidden="true" />Deity encyclopedia · Wave 3</p>
          <p lang="ta">தெய்வ மரபுகளை மரியாதையுடனும் ஆதார விழிப்புணர்வுடனும் ஆராயுங்கள்</p>
          <h1>Ten doorways. <em>No flattened tradition.</em></h1>
          <p>
            Search Tamil, English, and common transliterations. Each record separates broad orientation, iconography, relationships, textual pathways, observance context, and source limits.
          </p>
          <div className="deity-directory-hero__evidence">
            <span><strong>{deityRecords.length}</strong> reviewed orientations</span>
            <span><ShieldCheck size={15} aria-hidden="true" />Visible confidence and sources</span>
            <span>Tamil + English + transliteration</span>
          </div>
        </div>
      </section>

      <section className="deity-directory-workspace" aria-label="Search and filter deity records">
        <div className="deity-directory-search">
          <Search size={19} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search deity records"
            placeholder="Shiva, சிவன், Sivan, Murugan, விநாயகர்…"
          />
          {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear deity search"><X size={16} /></button>}
        </div>
        <div className="deity-directory-filters" aria-label="Filter by broad tradition">
          {traditions.map((item) => (
            <button key={item} onClick={() => setTradition(item)} aria-pressed={tradition === item} className={tradition === item ? "is-active" : ""}>
              {item}
            </button>
          ))}
        </div>
        <div className="deity-directory-heading">
          <p className="scene-kicker">Current collection</p>
          <h2>{results.length} {results.length === 1 ? "record" : "records"}</h2>
          <p>Editorial orientation is not a replacement for primary-text study, temple instruction, or specialist theological review.</p>
        </div>

        {results.length ? (
          <div className="deity-directory-grid">
            {results.map((record, index) => (
              <Link href={`/deities/${record.slug}`} key={record.slug} className="deity-directory-card">
                <span className="deity-directory-card__number">{String(index + 1).padStart(2, "0")}</span>
                <p lang="ta">{record.tamilName}</p>
                <h2>{record.name}</h2>
                <small>{record.transliterations.slice(0, 3).join(" · ")}</small>
                <p>{record.strapline}</p>
                <div><span>{record.confidence}</span><span>{record.editorialStatus}</span></div>
                <b>Open encyclopedia record <ArrowRight size={15} aria-hidden="true" /></b>
              </Link>
            ))}
          </div>
        ) : (
          <div className="deity-directory-empty" role="status">
            <Search size={24} aria-hidden="true" />
            <h2>No reviewed deity record matches this search.</h2>
            <p>Try Shiva, Parvati, Vishnu, Murugan, Ganesha, Nataraja, or a Tamil/transliteration form.</p>
            <button onClick={() => { setQuery(""); setTradition("All"); }}>Show all records</button>
          </div>
        )}
      </section>
    </main>
  );
}
