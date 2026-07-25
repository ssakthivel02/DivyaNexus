/**
 * Divine Observatory Cinema: Ask Divya is a guided reflection studio, not a generic chat box.
 * Every answer visibly separates source signals, interpretation, generated explanation, and a next study path.
 */
import { useMemo, useState } from "react";
import { ArrowRight, ArrowUp, BookOpenCheck, CheckCircle2, CircleHelp, Languages, MessageCircleQuestion, Scale, Sparkles, Stars } from "lucide-react";
import { Link } from "wouter";
import { ASSETS, askPrompts, guidanceResponses, records, type KnowledgeRecord } from "@/data/content";

const modes = [
  { label: "Simple explanation", detail: "Clear, careful orientation", Icon: MessageCircleQuestion },
  { label: "Scholar lens", detail: "Context and distinction first", Icon: BookOpenCheck },
  { label: "Tamil explanation", detail: "Tamil-forward reading support", Icon: Languages },
  { label: "Child-friendly", detail: "Gentle language for shared learning", Icon: Sparkles },
  { label: "Compare teachings", detail: "Notice difference without flattening", Icon: Scale },
  { label: "Practical reflection", detail: "A question for daily life", Icon: CheckCircle2 },
] as const;

export default function AskDivya() {
  const contextualRecord = new URLSearchParams(window.location.search).get("context");
  const [mode, setMode] = useState<(typeof modes)[number]["label"]>("Simple explanation");
  const [question, setQuestion] = useState(() => contextualRecord ? "Help me understand this study record in context." : "");
  const [submitted, setSubmitted] = useState("");
  const response = useMemo(() => {
    const normalized = submitted.toLocaleLowerCase();
    return guidanceResponses.find((item) => item.match.some((term) => normalized.includes(term.toLocaleLowerCase()))) ?? {
      title: "A careful way to begin",
      response: "This local guide can help you locate related starter records and frame a question with care. It does not offer a final interpretation or replace a qualified teacher. Identify the text, translation, and context you would like to explore next.",
      records: ["glossary-dharma", "upanishads-introduction"],
    };
  }, [submitted]);
  const sourceRecords = response.records.map((id) => records.find((record) => record.id === id)).filter((record): record is KnowledgeRecord => Boolean(record));
  const selectedMode = modes.find((item) => item.label === mode) ?? modes[0];
  const submit = () => { if (question.trim()) { setSubmitted(question.trim()); setQuestion(""); } };

  return (
    <main id="main-content" className="page-main ask-cinema">
      <section className="ask-cinema-hero">
        <img src={ASSETS.ask} alt="Luminous knowledge core with orbiting light fragments" fetchPriority="high" />
        <div className="ask-cinema-hero__veil" />
        <div className="ask-cinema-hero__rings" aria-hidden="true" />
        <div className="ask-cinema-hero__inner">
          <p className="scene-kicker"><Stars size={14} aria-hidden="true" />Guided reflection studio</p>
          <p className="ask-cinema-hero__tamil" lang="ta">கவனமான கேள்வி, தெளிவான பாதை</p>
          <h1>Ask with care. <em>Explore deeper.</em></h1>
          <p>Ask Divya helps you begin a source-aware study thread in Tamil or English. It labels what is a starter record, what is a generated explanation, and what remains open for further reading.</p>
          <div className="ask-cinema-hero__signals"><span><BookOpenCheck size={14} aria-hidden="true" />Source links visible</span><span><Sparkles size={14} aria-hidden="true" />Generated reflection labelled</span><span><CircleHelp size={14} aria-hidden="true" />No certainty claims</span></div>
        </div>
      </section>

      <section className="ask-studio" aria-label="Ask Divya studio">
        <aside className="ask-mode-rail" aria-label="Choose an explanation mode">
          <div className="ask-mode-rail__intro"><p className="scene-kicker">Choose a lens</p><h2>The question stays yours.</h2><p>A lens changes the shape of the explanation—not the status of the source material.</p></div>
          <div className="ask-mode-rail__options">
            {modes.map(({ label, detail, Icon }, index) => <button key={label} className={mode === label ? "is-active" : ""} onClick={() => setMode(label)}><span>0{index + 1}</span><Icon size={18} aria-hidden="true" /><div><strong>{label}</strong><small>{detail}</small></div></button>)}
          </div>
          <Link className="ask-mode-rail__method" href="/sources"><BookOpenCheck size={16} aria-hidden="true" />How source layers work <ArrowRight size={15} aria-hidden="true" /></Link>
        </aside>

        <section className="ask-conversation-stage" aria-label="Ask Divya conversation">
          <header className="ask-conversation-stage__head"><div><p className="scene-kicker">Current lens</p><h2>{selectedMode.label}</h2><p>{selectedMode.detail}</p></div><div className="ask-conversation-stage__stamp"><Sparkles size={17} aria-hidden="true" /><span>LOCAL GUIDE<br />STAGE B</span></div></header>
          <div className="ask-conversation-stage__body">
            {!submitted ? <div className="ask-empty-state"><div className="ask-empty-state__orb"><Sparkles size={25} aria-hidden="true" /></div><p className="scene-kicker">Start a thread</p><h3>What would you like to understand?</h3><p>Choose a study prompt or write a question. Divya will begin from the small, transparent local starter library currently available in this experience.</p><div className="ask-prompt-grid">{askPrompts.slice(0, 4).map((prompt, index) => <button key={prompt} onClick={() => { setQuestion(prompt); setSubmitted(prompt); }}><span>0{index + 1}</span>{prompt}<ArrowRight size={15} aria-hidden="true" /></button>)}</div></div> : <>
              <article className="ask-user-question"><p className="ask-layer-label">Your question</p><p>{submitted}</p></article>
              <article className="ask-response-card">
                <div className="ask-response-card__title"><div><p className="ask-layer-label"><Sparkles size={13} aria-hidden="true" />Generated explanation · {mode}</p><h3>{response.title}</h3></div><span>Layer 03</span></div>
                <p>{response.response}</p>
              </article>
              <div className="ask-response-layers" aria-label="Response layers">
                <article><p className="ask-layer-label"><BookOpenCheck size={13} aria-hidden="true" />Layer 01 · Source signals</p><div className="ask-source-links">{sourceRecords.map((record) => <Link key={record.id} href={`${record.route}?record=${record.id}`}><span>{record.source}</span><strong>{record.title}</strong><small>{record.reference}</small><ArrowRight size={15} aria-hidden="true" /></Link>)}</div></article>
                <article><p className="ask-layer-label"><Scale size={13} aria-hidden="true" />Layer 02 · Interpretation boundary</p><p>These starter records are educational context. They are not being presented as a verified edition, a complete commentary tradition, or a universal conclusion.</p></article>
                <article><p className="ask-layer-label"><span className="ask-layer-compass" aria-hidden="true">✦</span>Layer 04 · Next learning path</p><Link href="/learning" className="ask-next-path">Continue with a pressure-free study path <ArrowRight size={15} aria-hidden="true" /></Link></article>
              </div>
              <div className="ask-boundary"><strong>Content boundary:</strong> Divya’s explanation is generated from a bounded local guide. It is not scripture quotation, a formal translation, professional advice, or a substitute for a qualified teacher.</div>
            </>}
          </div>
          <div className="ask-composer-cinema"><textarea value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") submit(); }} placeholder="Ask about a passage, a concept, or a reflection…" aria-label="Your question for Ask Divya" /><button className="button button--primary button--glow" onClick={submit} disabled={!question.trim()} aria-label="Send question"><ArrowUp size={17} aria-hidden="true" /><span>Ask Divya</span></button></div>
          <p className="ask-composer-cinema__hint">Press ⌘/Ctrl + Enter to send. Choose source links to continue outside the generated explanation.</p>
        </section>
      </section>
    </main>
  );
}
