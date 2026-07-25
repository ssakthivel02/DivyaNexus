/**
 * Divine Observatory Cinema: source-aware reader controls are placed inside an illuminated archive stage.
 * This reader retains visible edition gaps instead of producing unverified scripture text or attribution.
 */
import { useEffect, useState } from "react";
import { Bookmark, Check, ChevronLeft, ChevronRight, Copy, Headphones, MessageCircleQuestion, Minus, Plus, Share2, Stars } from "lucide-react";
import { Link } from "wouter";
import { ASSETS, records, type KnowledgeRecord } from "@/data/content";
import { getBookmarks, getPreference, recordHistory, setPreference, toggleBookmark } from "@/lib/localLibrary";

const readerSets: Record<string, { title: string; tamil: string; description: string; records: KnowledgeRecord[]; scene: string }> = {
  "bhagavad-gita": { title: "Bhagavad Gita", tamil: "பகவத் கீதை", description: "A bounded reader for cited starter records, translation context, and carefully labelled reflection.", records: records.filter((record) => record.source === "Bhagavad Gita"), scene: "A dialogue across duty and discernment" },
  "rig-veda": { title: "Rig Veda", tamil: "ரிக் வேதம்", description: "A source-aware study shelf for starter references, hymn context, and future edition provenance.", records: records.filter((record) => record.source === "Rig Veda"), scene: "A threshold to a larger textual universe" },
  upanishads: { title: "Upanishads", tamil: "உபநிஷத்துகள்", description: "A reader beginning with text diversity, inquiry, and transparent limits around an unfinished corpus.", records: records.filter((record) => record.source === "Upanishads"), scene: "Inquiry before conclusion" },
  scriptures: { title: "Scriptures", tamil: "சாஸ்திரங்கள்", description: "A cross-text entry into cited learning records rather than an undifferentiated scripture feed.", records: records.filter((record) => record.category === "Scripture"), scene: "Many texts, clearly distinguished" },
};

export default function ScriptureReader({ kind }: { kind: keyof typeof readerSets }) {
  const set = readerSets[kind];
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("record");
  const initialIndex = Math.max(0, set.records.findIndex((record) => record.id === requested));
  const [index, setIndex] = useState(initialIndex);
  const [showCommentary, setShowCommentary] = useState(true);
  const [fontScale, setFontScale] = useState(Number(getPreference("fontSize", "1")) || 1);
  const record = set.records[index] ?? set.records[0];
  const [saved, setSaved] = useState(() => record ? getBookmarks().includes(record.id) : false);
  useEffect(() => { if (record) { recordHistory(record.id); setSaved(getBookmarks().includes(record.id)); } }, [record?.id]);
  if (!record) return <main id="main-content" className="page-main"><section className="page-hero"><h1>Study record in preparation.</h1><p>This collection needs a reviewed source edition before it can safely display a reader record.</p></section></main>;
  const changeScale = (next: number) => { const value = Math.min(1.25, Math.max(.87, next)); setFontScale(value); setPreference("fontSize", String(value)); };
  const copyReference = async () => { await navigator.clipboard.writeText(`${record.source}, ${record.reference}`); };
  const share = async () => { const text = `${record.title} · ${record.source} · ${record.reference}`; if (navigator.share) await navigator.share({ title: record.title, text, url: window.location.href }); else await navigator.clipboard.writeText(text); };
  return <main id="main-content" className="page-main reader-cinema">
    <section className="reader-cinema-hero">
      <img src={ASSETS.scripture} alt="Illuminated manuscript archive beneath a quiet star field" fetchPriority="high" />
      <div className="reader-cinema-hero__veil" /><div className="reader-cinema-hero__glyph" aria-hidden="true">ॐ</div>
      <div className="reader-cinema-hero__inner"><p className="scene-kicker"><Stars size={14} aria-hidden="true" />Source-aware reading room</p><p className="reader-cinema-hero__crumb"><Link href="/scriptures">Scriptures</Link> / {set.title}</p><p className="reader-cinema-hero__tamil" lang="ta">{set.tamil}</p><h1>{set.title}</h1><p>{set.description}</p><div><span>{set.scene}</span><span>{record.source}</span><span>{record.reviewStatus}</span></div></div>
    </section>
    <section className="reader-cinema-body"><div className="reader-layout reader-layout--cinema"><article className="reader-console">
      <div className="reader-toolbar"><div className="reader-toolbar__group"><button className="reader-tool" onClick={() => setIndex((current) => Math.max(0, current - 1))} disabled={index === 0}><ChevronLeft size={15} aria-hidden="true" />Previous</button><button className="reader-tool" onClick={() => setIndex((current) => Math.min(set.records.length - 1, current + 1))} disabled={index === set.records.length - 1}>Next<ChevronRight size={15} aria-hidden="true" /></button></div><div className="reader-toolbar__group"><button className="reader-tool" onClick={() => changeScale(fontScale - .06)} aria-label="Decrease reader font size"><Minus size={14} aria-hidden="true" /></button><button className="reader-tool" onClick={() => changeScale(fontScale + .06)} aria-label="Increase reader font size"><Plus size={14} aria-hidden="true" /></button><button className={`reader-tool ${showCommentary ? "is-active" : ""}`} onClick={() => setShowCommentary((value) => !value)}>Commentary</button></div></div>
      <div className="reader-paper reader-paper--cinema" style={{ fontSize: `${fontScale}rem` }}><div className="reader-meta"><span className="chip">{record.source}</span><span className="chip">{record.reference}</span><span className="chip">{record.reviewStatus}</span></div><p className="reader-paper__section">Current study record</p><h1>{record.title}</h1><p className="reader-paper__tamil" lang="ta">{record.tamilTitle}</p><p className="reader-label">Original-language text · not shown until an edition is verified</p><p className="reader-scripture" lang="ta">இந்த தொடக்கப் பதிவில் சரிபார்க்கப்பட்ட பதிப்புடன் மூல மொழிப் பாடம் இன்னும் இணைக்கப்படவில்லை.</p><p className="reader-transliteration">“In this starter record, the original-language passage is awaiting a reviewed source edition.”</p><div className="reader-meaning-grid"><div><p className="reader-label">Tamil meaning · educational starter summary</p><p className="reader-translation" lang="ta">{record.tamilMeaning}</p></div><div><p className="reader-label">English meaning · educational starter summary</p><p className="reader-translation">{record.englishMeaning}</p></div></div>{showCommentary && <><p className="reader-label">AI-ready reflective explanation · clearly not scripture</p><p className="reader-commentary">{record.explanation}</p></>}<div className="reader-actions"><Link className="button" href="/audio"><Headphones size={15} aria-hidden="true" />Listen</Link><Link className="button" href={`/ask-divya?context=${encodeURIComponent(record.id)}`}><MessageCircleQuestion size={15} aria-hidden="true" />Ask Divya</Link><button className="button" onClick={() => setSaved(toggleBookmark(record.id).includes(record.id))}>{saved ? <Check size={15} aria-hidden="true" /> : <Bookmark size={15} aria-hidden="true" />}{saved ? "Saved locally" : "Bookmark"}</button><button className="button" onClick={copyReference}><Copy size={15} aria-hidden="true" />Copy reference</button><button className="button" onClick={share}><Share2 size={15} aria-hidden="true" />Share</button></div></div>
    </article><aside className="reader-sidebar reader-sidebar--cinema"><div className="reader-sidebar__panel"><p className="scene-kicker">In this collection</p><h2>Follow a record trail</h2>{set.records.map((item, itemIndex) => <button key={item.id} className={itemIndex === index ? "is-active" : ""} onClick={() => setIndex(itemIndex)}><span>0{itemIndex + 1}</span>{item.title}</button>)}</div><div className="reader-sidebar__panel"><p className="scene-kicker">Reader context</p><p className="muted" style={{ fontSize: ".74rem", margin: 0 }}>This reader intentionally shows missing-edition status. It does not mix an unverified quotation with generated explanation.</p></div></aside></div></section>
  </main>;
}
