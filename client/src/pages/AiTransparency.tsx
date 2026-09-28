import { Link } from "wouter";
import { ArrowRight, BookOpenCheck, CircleHelp, ShieldCheck, Sparkles } from "lucide-react";

const transparencySections = [
  {
    title: "What is live today",
    body: "The public Ask Divya experience is still a browser-local Stage B guide. It uses a bounded local starter library and does not call a live AI provider from the production website.",
  },
  {
    title: "What staging proves",
    body: "An isolated server-side staging service exercises the future /api/v1/ask contract with a mock provider. Staging verifies retrieval, citations, uncertainty, moderation, rate limits and transport behavior without exposing a provider secret to the browser.",
  },
  {
    title: "How sources are treated",
    body: "DivyaNexus separates source records, editorial explanation and generated reflection. Starter records and needs-review material must not be presented as verified scripture editions, complete commentary traditions or universal conclusions.",
  },
  {
    title: "Safety boundaries",
    body: "Ask Divya is an educational knowledge assistant, not an oracle, prediction engine or remedy service. It must not invent mantras or verse numbers, guarantee outcomes, or provide medical, legal or financial advice.",
  },
  {
    title: "Privacy and operational data",
    body: "The production website keeps its current browser-local model unless a feature explicitly says otherwise. The staged server boundary is designed not to persist raw prompts containing personal information in long-term operational logs.",
  },
] as const;

export default function AiTransparency() {
  return (
    <main id="main-content" className="page-main">
      <section className="page-hero page-hero--compact">
        <p className="page-hero__crumb"><Link href="/">DivyaNexus</Link> / AI Transparency</p>
        <p className="eyebrow"><span className="eyebrow__star">✦</span>Ask Divya transparency</p>
        <h1>Know what is local, staged, generated and sourced.</h1>
        <p>This page describes the current Ask Divya boundary without implying that a live production AI provider is active.</p>
        <div className="page-hero__meta"><span className="chip">Production: local guide</span><span className="chip">Staging: mock provider only</span></div>
      </section>
      <div className="page-rule" />
      <section className="article-layout">
        <article className="article-main">
          {transparencySections.map((section) => (
            <section className="article-section" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
          <section className="article-section">
            <h2>What a future live answer must show</h2>
            <p>Before production activation, answers must keep citations and uncertainty visible, preserve source and review status, distinguish translation from transliteration and explanation, and remain inside the reviewed DivyaNexus corpus.</p>
            <div className="ask-response-layers" aria-label="Future answer transparency requirements">
              <article><p className="ask-layer-label"><BookOpenCheck size={13} aria-hidden="true" />Sources</p><p>Source IDs, citation labels, tradition or context and review status remain inspectable.</p></article>
              <article><p className="ask-layer-label"><CircleHelp size={13} aria-hidden="true" />Uncertainty</p><p>Missing or insufficient reviewed evidence must produce a clear limitation rather than a fabricated answer.</p></article>
              <article><p className="ask-layer-label"><ShieldCheck size={13} aria-hidden="true" />Safety</p><p>Moderation, bounded requests, timeouts and failure fallback stay server-side.</p></article>
            </div>
          </section>
          <div className="notice-box"><strong>Current production boundary:</strong> the public website has not been promoted to live-provider “Divya AI”. Its visible Ask Divya experience remains the local Stage B guide.</div>
          <p><Link className="inline-link" href="/ask-divya"><Sparkles size={15} aria-hidden="true" />Open Ask Divya <ArrowRight size={15} aria-hidden="true" /></Link> <Link className="inline-link" href="/content-corrections" style={{ marginLeft: "0.55rem" }}><ShieldCheck size={15} aria-hidden="true" />Report a content issue <ArrowRight size={15} aria-hidden="true" /></Link></p>
        </article>
        <aside className="article-rail"><h2>Related</h2><Link href="/sources">Sources</Link><Link href="/disclaimer">AI Disclaimer</Link><Link href="/privacy">Privacy</Link><Link href="/content-corrections">Content Corrections</Link><Link href="/status">System Status</Link></aside>
      </section>
    </main>
  );
}
