import { useMemo, useState } from "react";
import { getPublishableMuruganWorks, muruganWorks, splitMuruganReadingSections } from "@/data/muruganTamilLibrary";

/**
 * In-site Tamil devotional reader. No redirects to third-party sites and no
 * publication of unverifiable placeholder text.
 */
export default function MuruganLiterature() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [fontSize, setFontSize] = useState(22);
  const published = getPublishableMuruganWorks();
  const visible = useMemo(() => published.filter((work) =>
    [work.titleTa, work.titleEn, work.author ?? "", work.textTa].some((value) =>
      value.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
    )
  ), [published, query]);
  const selected = visible.find((work) => work.id === selectedId) ?? visible[0];
  const readingSections = selected ? splitMuruganReadingSections(selected.textTa) : [];
  const awaitingReview = muruganWorks.filter((work) => work.reviewStatus === "pending-source-review");

  return (
    <main id="main-content" className="page-main" lang="ta" style={{ maxWidth: 1040, margin: "0 auto", padding: "clamp(20px, 4vw, 52px)" }}>
      <header>
        <p className="scene-kicker">DivyaNexus · Tamil devotional literature</p>
        <h1>முருகன் தமிழ் இலக்கிய நூலகம்</h1>
        <p>சரிபார்க்கப்பட்ட மூல நூல்களை இத்தளத்திலேயே வாசிக்கலாம். வெளியிடப்படாத பாடல்கள் முழுமையானவை என்று காட்டப்படாது.</p>
      </header>

      <section aria-label="Tamil literature search" style={{ marginBlock: 28 }}>
        <label htmlFor="murugan-literature-search">தமிழ் நூல்கள் மற்றும் பாடல்களில் தேடுக</label>
        <input id="murugan-literature-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)}
          placeholder="நூல், ஆசிரியர் அல்லது பாடல் வரி" style={{ display: "block", width: "100%", padding: 12, marginTop: 8 }} />
        <p role="status">{visible.length} சரிபார்க்கப்பட்ட படைப்புகள் வாசிக்கக் கிடைக்கின்றன.</p>
      </section>

      {published.length === 0 ? (
        <section aria-labelledby="murugan-review-heading" style={{ padding: 24, border: "1px solid currentColor", borderRadius: 12 }}>
          <h2 id="murugan-review-heading">மூல உரை சரிபார்ப்பு நடைபெறுகிறது</h2>
          <p>முழுமையான தமிழ் உரை, மூலப் பதிப்பு மற்றும் வெளியீட்டு அனுமதி உறுதி செய்யப்பட்ட பின்னரே நூல்கள் இங்கே வெளியிடப்படும்.</p>
          <p>காலியான பக்கங்களோ, சரிபார்க்கப்படாத பாடல்களோ வெளியிடப்படுவதில்லை.</p>
        </section>
      ) : (
        <section aria-label="Available complete works" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 24 }}>
          <nav aria-label="Verified Tamil works">
            <h2>வாசிக்கக் கிடைக்கும் நூல்கள்</h2>
            {visible.map((work) => (
              <button key={work.id} type="button" aria-current={selected?.id === work.id ? "true" : undefined}
                onClick={() => setSelectedId(work.id)} style={{ display: "block", width: "100%", textAlign: "left", padding: 12, marginBlock: 8 }}>
                {work.titleTa}
              </button>
            ))}
            {visible.length === 0 && <p role="status">தேடலுக்கு ஏற்ற சரிபார்க்கப்பட்ட நூல் இல்லை.</p>}
          </nav>
          {selected && <article aria-label={selected.titleTa}>
            <h2>{selected.titleTa}</h2>
            <p>{selected.author ?? ""}</p>
            <label htmlFor="murugan-font-size">எழுத்து அளவு</label>
            <input id="murugan-font-size" type="range" min={18} max={36} value={fontSize}
              onChange={(event) => setFontSize(Number(event.target.value))} />
            <div aria-label="தமிழ் மூல உரை" style={{ fontSize, lineHeight: 1.95, overflowWrap: "anywhere" }}>
              {readingSections.map((section, index) => <p key={`${selected.id}-${index}`} style={{ whiteSpace: "pre-wrap", marginBlock: "1.25em" }}>{section}</p>)}
            </div>
            <footer><p>மூலப் பதிப்பு: {selected.sourceEdition}</p><p>மூல இடம்: {selected.sourceLocator}</p><p>சரிபார்த்தவர்: {selected.reviewer}</p></footer>
          </article>}
        </section>
      )}

      <section style={{ marginBlock: 36 }} aria-labelledby="murugan-catalog-heading">
        <h2 id="murugan-catalog-heading">சரிபார்ப்புக்காகக் காத்திருக்கும் நூல்கள்</h2>
        <p>இந்தப் பட்டியல் நூல்கள் ஏற்கனவே வெளியிடப்பட்டதாகக் குறிக்காது.</p>
        <ul>{awaitingReview.map((work) => <li key={work.id}>{work.titleTa} — சரிபார்ப்பு நிலுவையில்</li>)}</ul>
      </section>
    </main>
  );
}
