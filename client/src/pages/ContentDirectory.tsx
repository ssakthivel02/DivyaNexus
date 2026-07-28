/**
 * Divine Observatory Cinema: topic directories use a distinct visual threshold and a varied discovery rail.
 * Content remains explicitly starter-level where editions, dates, or local practice have not been verified.
 */
import { useState } from "react";
import { ArrowRight, BookOpenText, CheckCircle2, Compass, Sparkles, Stars } from "lucide-react";
import { Link } from "wouter";
import { ASSETS, learningPaths, temples } from "@/data/content";
import { deityEditorialCards as deities } from "@/data/deityEditorial";
import { getEditorialRecordsByCollection, type EditorialCollection, type EditorialStatus } from "@/data/editorial";
import { EditorialStatusBadge } from "@/components/EditorialStatusBadge";
import { Reveal } from "@/components/Reveal";

type DirectoryKind = "deities" | "temples" | "rishis" | "festivals" | "glossary" | "life-guidance" | "learning" | "kids";
type Card = { title: string; tamil: string; detail: string; tag?: string; source?: string; status?: EditorialStatus };
type Details = { eyebrow: string; title: string; tamil: string; description: string; image: string; alt: string; note: string; scene: string; action: string; cards: readonly Card[] };
type ImmersionOption = { title: string; tamil: string; detail: string; cue: string };

function editorialCards(collection: EditorialCollection): Card[] {
  return getEditorialRecordsByCollection(collection).map((record) => ({
    title: record.title,
    tamil: record.tamilTitle,
    detail: record.summary,
    tag: record.focus,
    status: record.status,
  }));
}

const immersionSets: Partial<Record<DirectoryKind, { eyebrow: string; title: string; description: string; action: string; items: ImmersionOption[] }>> = {
  "life-guidance": { eyebrow: "Reflection constellation", title: "Choose what you are carrying today.", description: "This reflection tool does not predict, diagnose, or promise outcomes. It simply opens a well-marked direction for thoughtful study.", action: "Open a bounded Ask Divya prompt", items: getEditorialRecordsByCollection("Guidance").map((record) => ({ title: record.title, tamil: record.tamilTitle, detail: record.summary, cue: record.focus })) },
  learning: { eyebrow: "Study pathway", title: "Select a pace, not a leaderboard.", description: "The journeys below are browser-local starter paths. There are no streaks or pressure mechanics in this stage.", action: "Start this learning path", items: getEditorialRecordsByCollection("Learning").map((record) => ({ title: record.title, tamil: record.tamilTitle, detail: record.summary, cue: record.focus })) },
  kids: { eyebrow: "Family pathway", title: "Choose a family-safe doorway.", description: "These pathways are designed for shared learning and do not collect child data or enable unrestricted child chat.", action: "Explore the safe preview", items: getEditorialRecordsByCollection("Kids").map((record) => ({ title: record.title, tamil: record.tamilTitle, detail: record.summary, cue: record.focus })) },
  deities: { eyebrow: "Context constellation", title: "Ten foundational doorways, held with care.", description: "Select an editorial overview to keep symbols, source context, and learning links in view rather than collapsing tradition into a single claim.", action: "Open editorial context", items: deities.map((deity) => ({ title: deity.title, tamil: deity.tamil, detail: deity.detail, cue: deity.source || "Context" })) },
  temples: { eyebrow: "Regional observatory", title: "Move through place without inventing travel facts.", description: "This starter atlas is for architecture, practice, and memory. Current access, pricing, and local timings are intentionally not supplied without verification.", action: "Trace this study route", items: temples.map((temple) => ({ title: temple.title, tamil: temple.tamil, detail: temple.detail, cue: temple.tag || "Journey" })) },
  rishis: { eyebrow: "Lineage observatory", title: "Read a name through its sources.", description: "Attribution, textual setting, lineage memory, and later reception remain visibly separate.", action: "Review rishi pathways", items: getEditorialRecordsByCollection("Rishi").map((record) => ({ title: record.title, tamil: record.tamilTitle, detail: record.summary, cue: record.focus })) },
  festivals: { eyebrow: "Festival observatory", title: "Region, season, and memory in context.", description: "Dates and local practice are not universalised; every pathway keeps variation visible.", action: "Review festival pathways", items: getEditorialRecordsByCollection("Festival").map((record) => ({ title: record.title, tamil: record.tamilTitle, detail: record.summary, cue: record.focus })) },
  glossary: { eyebrow: "Word observatory", title: "One term can hold many contexts.", description: "Tamil, English, textual setting, and tradition remain visible instead of forcing false one-word equivalence.", action: "Explore glossary pathways", items: getEditorialRecordsByCollection("Glossary").map((record) => ({ title: record.title, tamil: record.tamilTitle, detail: record.summary, cue: record.focus })) },
};

function DirectoryImmersion({ kind }: { kind: DirectoryKind }) {
  const immersion = immersionSets[kind];
  const [active, setActive] = useState(0);
  if (!immersion) return null;
  const selected = immersion.items[active] ?? immersion.items[0];
  return <section className={`directory-immersion directory-immersion--${kind}`} aria-labelledby={`${kind}-immersion-title`}>
    <div className="directory-immersion__copy"><p className="scene-kicker"><Sparkles size={14} aria-hidden="true" />{immersion.eyebrow}</p><h2 id={`${kind}-immersion-title`}>{immersion.title}</h2><p>{immersion.description}</p><Link className="button button--glass" href={kind === "life-guidance" ? "/ask-divya" : "/collection-status"}>{immersion.action}<ArrowRight size={15} aria-hidden="true" /></Link></div>
    <div className="directory-immersion__stage">
      <div className="directory-immersion__nodes" role="tablist" aria-label={`${kind} interactive index`}>{immersion.items.map((item, index) => <button key={item.title} role="tab" aria-selected={index === active} className={index === active ? "is-active" : ""} onClick={() => setActive(index)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong><small lang="ta">{item.tamil}</small></button>)}</div>
      <article className="directory-immersion__selection" aria-live="polite"><p>{selected.cue}</p><h3>{selected.title}<span lang="ta">{selected.tamil}</span></h3><p>{selected.detail}</p><div><span>Source status visible</span><span>Local exploration</span></div></article>
    </div>
  </section>;
}

const directoryDetails: Record<DirectoryKind, Details> = {
  deities: { eyebrow: "Deity universe", title: "Symbols, stories, and reverence in context.", tamil: "மரியாதையுடன் அறியுங்கள்", description: "Approach ten foundational traditions through carefully marked editorial overview cards. Identity, symbolism, worship context, and related learning remain distinct rather than compressed into a single claim.", image: ASSETS.deity, alt: "Museum-style tableau of respectful sacred symbols in warm lamplight", scene: "A constellation of traditions", action: "Explore deity context", note: "These ten cards are editorial orientation records. Detailed citations should be added only after record-level source review.", cards: deities },
  temples: { eyebrow: "Temple journeys", title: "Architecture, practice, and place.", tamil: "கட்டிடக்கலை, மரபு, இடம்", description: "Temple learning is a journey through architecture, regional memory, and devotional practice. This starter experience intentionally does not invent travel details, current rules, or local timings.", image: ASSETS.temple, alt: "Temple silhouette and water tank at a blue-gold dawn", scene: "A route through place and memory", action: "Trace temple journeys", note: "Visitor and travel information remains absent until verified for each location.", cards: temples },
  rishis: { eyebrow: "Rishis & lineages", title: "Learn the context around a name.", tamil: "பெயருக்கு அப்பாற்பட்ட சூழல்", description: "Attribution, textual setting, lineage memory, and historical uncertainty are separated rather than compressed into one biography.", image: ASSETS.scripture, alt: "Illuminated manuscripts and constellation-like archive shelves", scene: "Lineage is more than a label", action: "Study the method", note: "These records are source-aware editorial orientations. They avoid unsupported dates, authorship claims, and merged biographies.", cards: editorialCards("Rishi") },
  festivals: { eyebrow: "Festival pathways", title: "Observe the diversity within observance.", tamil: "கடைபிடிப்பின் பல்வகைமை", description: "Festival pathways acknowledge regional practice, calendar variation, family memory, and community context rather than treating one local custom as universal.", image: ASSETS.wisdom, alt: "Palm-leaf manuscript, lamp, and gentle star-map projection", scene: "Rhythm, region, and remembrance", action: "Explore observance context", note: "Dates, travel details, fasting guidance, and local arrangements require current verification.", cards: editorialCards("Festival") },
  glossary: { eyebrow: "Glossary", title: "Words change with their context.", tamil: "சூழலோடு சொற்கள் மாறுகின்றன", description: "A bilingual glossary that resists false one-word equivalence. Source, speaker, translation choice, and tradition can each shape a term.", image: ASSETS.scripture, alt: "Illuminated manuscript shelves in a celestial archive", scene: "A word is a doorway", action: "Open glossary paths", note: "Glossary entries are editorial context, not a universal replacement for specialist translation.", cards: editorialCards("Glossary") },
  "life-guidance": { eyebrow: "Life guidance", title: "Reflection without guarantees.", tamil: "உறுதியளிக்காத சிந்தனை", description: "Use tradition as a prompt for thought, not as a replacement for care, professional advice, or certainty about the future.", image: ASSETS.guidance, alt: "Golden constellation wheel over a quiet twilight horizon", scene: "A question for the road ahead", action: "Begin a reflection", note: "These tools do not offer medical, legal, financial, or supernatural guidance.", cards: editorialCards("Guidance") },
  learning: { eyebrow: "Learning paths", title: "Move slowly enough to understand.", tamil: "புரிந்துகொள்ள மெதுவாக நகருங்கள்", description: "Short, pressure-free sequences connect a record, a source question, and a reflection. Progress remains browser-local in this stage.", image: ASSETS.learning, alt: "Learner following a manuscript and constellation pathway", scene: "A human pace, not a progress race", action: "Start a learning path", note: "No streaks, rankings, or manipulative pressure appear in this learning experience.", cards: editorialCards("Learning") },
  kids: { eyebrow: "Kids universe", title: "Gentle curiosity, clear boundaries.", tamil: "மென்மையான ஆர்வம், தெளிவான எல்லைகள்", description: "Family-safe story, vocabulary, symbol, festival, and respectful-question pathways keep adult context visible.", image: ASSETS.kids, alt: "Children sharing an illuminated folio in a warm storybook scene", scene: "Shared wonder, without pressure", action: "Open kids universe", note: "This preview does not collect child data or replace caregiver or teacher guidance.", cards: editorialCards("Kids") },
};

export default function ContentDirectory({ kind }: { kind: DirectoryKind }) {
  const data = directoryDetails[kind];
  const primaryDestination = kind === "life-guidance" ? "/ask-divya" : "/collection-status";
  return <main id="main-content" className={`page-main directory-cinema directory-cinema--${kind}`}>
    <section className="directory-hero">
      <img src={data.image} alt={data.alt} fetchPriority="high" />
      <div className="directory-hero__veil" />
      <div className="directory-hero__rings" aria-hidden="true" />
      <div className="directory-hero__inner"><p className="scene-kicker"><Stars size={14} aria-hidden="true" />{data.eyebrow}</p><p className="directory-hero__tamil" lang="ta">{data.tamil}</p><h1>{data.title}</h1><p>{data.description}</p><div className="directory-hero__meta"><span>Editorial overview</span><span>Source status visible</span><span>{data.scene}</span></div></div>
    </section>
    <section className="directory-passage"><p><Compass size={16} aria-hidden="true" />{data.scene}</p><Link href="/sources">Read the editorial method <ArrowRight size={15} aria-hidden="true" /></Link></section>
    <DirectoryImmersion kind={kind} />
    <section className="directory-contents">
      <Reveal className="directory-contents__intro"><div><p className="scene-kicker">Study leads</p><h2>Choose a <em>well-marked</em> place to begin.</h2></div><p>{data.note}</p></Reveal>
      <div className="directory-trail-grid">{data.cards.map((card, index) => <Link href={primaryDestination} key={`${card.title}-${index}`} className="directory-trail-card"><span className="directory-trail-card__number">{String(index + 1).padStart(2, "0")}</span><div><p className="directory-trail-card__kind">{card.tag || card.source || "Starter context"}</p><h3>{card.title}</h3><p lang="ta">{card.tamil}</p>{card.status && <EditorialStatusBadge status={card.status} />}</div><p className="directory-trail-card__detail">{card.detail}</p><span className="directory-trail-card__arrow">Open context <ArrowRight size={15} aria-hidden="true" /></span></Link>)}</div>
    </section>
    <section className="directory-ethos"><Reveal><div className="directory-ethos__visual"><img src={kind === "life-guidance" ? ASSETS.ask : ASSETS.heroArchive} alt="" loading="lazy" /><span>{data.action}</span></div><div className="directory-ethos__copy"><p className="scene-kicker"><BookOpenText size={14} aria-hidden="true" />What is available now</p><h2>Expanded content with its boundaries still visible.</h2><p>DivyaNexus does not present this set as a complete encyclopedia. Review status remains part of every pathway so verified material can be added without hiding provenance.</p><div className="cinema-hero__actions"><Link className="button button--primary" href="/collection-status"><CheckCircle2 size={16} aria-hidden="true" />Review collection status</Link><Link className="button button--glass" href="/ask-divya"><Sparkles size={16} aria-hidden="true" />Ask a bounded question</Link></div></div></Reveal></section>
  </main>;
}
