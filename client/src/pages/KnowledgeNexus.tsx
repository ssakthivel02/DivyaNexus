import { ArrowRight, BookOpenText, Compass, Database, Headphones, Map, Network, Orbit, Search, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { records } from "@/data/content";
import { knowledgeRelations } from "@/data/knowledgeRelations";
import { provenanceObjects } from "@/data/provenance";
import { evidenceLabel } from "@/lib/provenanceSearch";
import "@/knowledge-nexus.css";

const constellations = [
  { title: "Scripture", tamil: "சாஸ்திரம்", href: "/scriptures", detail: "Rig Veda, Bhagavad Gita and Upanishadic study paths", icon: BookOpenText },
  { title: "Divine traditions", tamil: "தெய்வ மரபுகள்", href: "/deities", detail: "Source-aware deity orientation and cultural context", icon: Sparkles },
  { title: "Sacred geography", tamil: "புனித புவியியல்", href: "/temples", detail: "Temple discovery designed for verified context and future intelligence", icon: Map },
  { title: "Life guidance", tamil: "வாழ்க்கை வழிகாட்டல்", href: "/life-guidance", detail: "Reflection that keeps source, interpretation and generated guidance separate", icon: Compass },
  { title: "Listen & learn", tamil: "கேட்டு கற்போம்", href: "/audio", detail: "User-controlled multilingual listening with visible transcripts", icon: Headphones },
  { title: "Ask Divya", tamil: "திவ்யாவிடம் கேளுங்கள்", href: "/ask-divya", detail: "A bounded guide that routes questions back toward inspectable knowledge", icon: Orbit },
] as const;

const principles = [
  "Primary source and editorial interpretation remain visibly distinct.",
  "Tamil-first readability is preserved alongside English discovery.",
  "No generated answer is allowed to impersonate a verified scripture quotation.",
  "The experience remains useful without account creation or autoplay.",
] as const;

function resolveTarget(target: string) {
  if (target.startsWith("/")) return { href: target, title: target.slice(1).replaceAll("-", " ") };
  const record = records.find((item) => item.id === target);
  return record ? { href: `${record.route}?record=${record.id}`, title: record.title } : { href: "/nexus", title: "Knowledge Nexus" };
}

export default function KnowledgeNexus() {
  const scriptureCount = records.filter((record) => record.category === "Scripture").length;
  const editorialCount = records.filter((record) => record.reviewStatus === "Editorial overview").length;
  const sourceEditionNeeded = provenanceObjects.filter((item) => item.reviewState === "source-edition-needed").length;
  const graphRows = knowledgeRelations.slice(0, 6).map((relation) => {
    const source = records.find((record) => record.id === relation.from);
    return { relation, source, target: resolveTarget(relation.to) };
  }).filter((row) => row.source);
  const provenanceRows = provenanceObjects.slice(0, 6).map((provenance) => ({
    provenance,
    record: records.find((record) => record.id === provenance.recordId),
  })).filter((row) => row.record);

  return (
    <main id="main-content" className="nexus-page">
      <section className="nexus-hero" aria-labelledby="nexus-title">
        <div className="nexus-hero__grid" aria-hidden="true" />
        <div className="nexus-hero__orb nexus-hero__orb--one" aria-hidden="true" />
        <div className="nexus-hero__orb nexus-hero__orb--two" aria-hidden="true" />
        <div className="nexus-hero__copy">
          <p className="nexus-kicker"><Orbit size={16} aria-hidden="true" />Wave 10 · Knowledge Nexus</p>
          <p className="nexus-tamil" lang="ta">அறிவை இணைக்கும் உயிருள்ள தெய்வீக வரைபடம்</p>
          <h1 id="nexus-title">One intelligent doorway into the whole DivyaNexus universe.</h1>
          <p>
            Move from a question to scripture, deity context, temple geography, learning and reflection without losing provenance. This is not a decorative dashboard: it is the beginning of a connected knowledge architecture.
          </p>
          <div className="nexus-hero__actions">
            <Link className="nexus-button nexus-button--primary" href="/search"><Search size={17} aria-hidden="true" />Search the nexus</Link>
            <Link className="nexus-button" href="/explore"><Compass size={17} aria-hidden="true" />Explore pathways</Link>
          </div>
        </div>

        <aside className="nexus-console" aria-label="Knowledge integrity console">
          <div className="nexus-console__head"><ShieldCheck size={18} aria-hidden="true" /><span>Integrity console</span><strong>ACTIVE</strong></div>
          <dl>
            <div><dt>Source-aware scripture records</dt><dd>{scriptureCount}</dd></div>
            <div><dt>Editorial overview records</dt><dd>{editorialCount}</dd></div>
            <div><dt>Registered provenance objects</dt><dd>{provenanceObjects.length}</dd></div>
            <div><dt>Source editions still needed</dt><dd>{sourceEditionNeeded}</dd></div>
            <div><dt>Connected knowledge gateways</dt><dd>{constellations.length}</dd></div>
            <div><dt>Editorial relationship edges</dt><dd>{knowledgeRelations.length}</dd></div>
            <div><dt>Generated-source impersonation</dt><dd>BLOCKED</dd></div>
          </dl>
          <p>Counts reflect the current repository dataset; they are not presented as collection-completeness claims.</p>
        </aside>
      </section>

      <section className="nexus-section" aria-labelledby="constellations-title">
        <div className="nexus-section__head">
          <div><p className="nexus-kicker">Connected discovery</p><h2 id="constellations-title">Choose a constellation</h2></div>
          <p>Each gateway preserves its own editorial and truth boundaries while participating in one coherent exploration system.</p>
        </div>
        <div className="nexus-grid">
          {constellations.map(({ title, tamil, href, detail, icon: Icon }, index) => (
            <Link className="nexus-card" href={href} key={title}>
              <span className="nexus-card__index">0{index + 1}</span>
              <span className="nexus-card__icon"><Icon size={20} aria-hidden="true" /></span>
              <strong>{title}</strong>
              <span lang="ta">{tamil}</span>
              <p>{detail}</p>
              <small>Enter pathway <ArrowRight size={14} aria-hidden="true" /></small>
            </Link>
          ))}
        </div>
      </section>

      <section className="nexus-section nexus-section--provenance" aria-labelledby="provenance-title">
        <div className="nexus-section__head">
          <div><p className="nexus-kicker"><Database size={15} aria-hidden="true" />Provenance ledger</p><h2 id="provenance-title">See what kind of evidence sits behind a record.</h2></div>
          <p>DivyaNexus does not convert a citation-shaped label into false authority. A reference can be present while a reviewed source edition is still explicitly missing.</p>
        </div>
        <div className="nexus-provenance" role="list" aria-label="Provenance evidence states">
          {provenanceRows.map(({ provenance, record }) => (
            <article className="nexus-provenance__item" role="listitem" key={provenance.recordId}>
              <div className="nexus-provenance__head"><span>{provenance.sourceKind}</span><strong>{evidenceLabel(provenance)}</strong></div>
              <h3>{record?.title}</h3>
              <p className="nexus-provenance__reference">{provenance.sourceLabel} · {provenance.reference}</p>
              <p>{provenance.evidenceNote}</p>
              <p lang="ta">{provenance.tamilEvidenceNote}</p>
              <Link href={`${record?.route}?record=${record?.id}`}>Inspect record <ArrowRight size={14} aria-hidden="true" /></Link>
            </article>
          ))}
        </div>
        <p className="nexus-provenance__boundary"><ShieldCheck size={15} aria-hidden="true" /> No current Wave 10 record is labelled “Primary reference linked” until a reviewed source edition is actually registered and validated.</p>
      </section>

      <section className="nexus-section nexus-section--graph" aria-labelledby="relationship-title">
        <div className="nexus-section__head">
          <div><p className="nexus-kicker"><Network size={15} aria-hidden="true" />Evidence-aware relationships</p><h2 id="relationship-title">Follow a reasoned next step.</h2></div>
          <p>These edges are transparent editorial navigation links. They do not claim doctrinal equivalence, textual causality, or hidden scriptural provenance.</p>
        </div>
        <div className="nexus-relations" role="list" aria-label="Knowledge relationship graph">
          {graphRows.map(({ relation, source, target }) => (
            <article className="nexus-relation" role="listitem" key={relation.id}>
              <div className="nexus-relation__source"><span>{source?.source}</span><strong>{source?.title}</strong></div>
              <div className="nexus-relation__edge"><span>{relation.kind}</span><ArrowRight size={18} aria-hidden="true" /></div>
              <div className="nexus-relation__target"><span lang="ta">{relation.tamilLabel}</span><strong>{relation.label}</strong><p>{relation.rationale}</p><Link href={target.href}>Open {target.title}<ArrowRight size={14} aria-hidden="true" /></Link></div>
            </article>
          ))}
        </div>
      </section>

      <section className="nexus-section nexus-section--principles" aria-labelledby="principles-title">
        <div>
          <p className="nexus-kicker"><ShieldCheck size={15} aria-hidden="true" />Non-negotiable quality contract</p>
          <h2 id="principles-title">High-tech without sacrificing trust.</h2>
          <p>A premium interface is worthless if it blurs source, translation, interpretation and generated explanation. Wave 10 keeps that separation explicit while making discovery faster and more immersive.</p>
        </div>
        <ol>
          {principles.map((principle, index) => <li key={principle}><span>0{index + 1}</span><p>{principle}</p></li>)}
        </ol>
      </section>
    </main>
  );
}
