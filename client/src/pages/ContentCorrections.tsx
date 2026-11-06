import { Link } from "wouter";
import { ArrowRight, Flag, ShieldCheck } from "lucide-react";

const reviewSteps = [
  ["1", "Submit", "Use the contact route and identify the exact page, record, citation or Ask Divya response that needs review."],
  ["2", "Triage", "The report is checked for enough detail to reproduce the concern and identify the relevant source material."],
  ["3", "Source review", "Editors compare the claim with reviewed source records and record whether the issue is factual, interpretive, transliteration-related or unresolved."],
  ["4", "Decision", "A correction can be published, clarification added, content marked needs-review, or the report closed with a documented reason."],
] as const;

export default function ContentCorrections() {
  const source = new URLSearchParams(window.location.search).get("from");
  const contactHref = source === "ask-divya"
    ? "/contact?intent=content-correction&from=ask-divya"
    : "/contact?intent=content-correction";

  return (
    <main id="main-content" className="page-main">
      <section className="page-hero page-hero--compact">
        <p className="page-hero__crumb"><Link href="/">DivyaNexus</Link> / Content Corrections</p>
        <p className="eyebrow"><span className="eyebrow__star">✦</span>Editorial correction intake</p>
        <h1>Report a source, citation or explanation concern.</h1>
        <p>Corrections are part of the knowledge workflow. Reports should identify the exact content and the evidence that should be reviewed.</p>
        <div className="page-hero__meta"><span className="chip">Human editorial review</span><span className="chip">No silent corrections</span></div>
      </section>
      <div className="page-rule" />
      <section className="article-layout">
        <article className="article-main">
          <section className="article-section">
            <h2>What to include</h2>
            <p>Please include the page URL or record ID, the text or claim you are questioning, the relevant source or edition if known, and a short explanation of the concern. Do not include passwords, financial information, medical records or other unnecessary personal information.</p>
            {source === "ask-divya" && <div className="notice-box" data-testid="ask-divya-correction-guidance"><strong>Ask Divya report:</strong> mention the question topic, visible citation label and the part of the generated explanation that should be reviewed. Do not paste sensitive personal data.</div>}
          </section>
          <section className="article-section">
            <h2>Editorial review path</h2>
            <div className="ask-response-layers" aria-label="Correction review stages">
              {reviewSteps.map(([number, title, body]) => <article key={number}><p className="ask-layer-label"><span aria-hidden="true">{number}</span>{title}</p><p>{body}</p></article>)}
            </div>
          </section>
          <section className="article-section">
            <h2>Current queue boundary</h2>
            <p>The public website currently provides a visible correction intake path, but it does not yet expose a persistent correction-queue backend or public ticket status. Until that infrastructure is implemented and reviewed, reports use the existing contact pathway and must not be represented as automatically queued or tracked.</p>
          </section>
          <section className="article-section">
            <h2>What can be reported</h2>
            <p>Examples include incorrect source attribution, citation mismatch, mistransliteration, misleading translation wording, flattened tradition context, invented or unsupported claims, accessibility problems, or an Ask Divya explanation that appears inconsistent with its cited record.</p>
          </section>
          <div className="notice-box"><strong>Correction principle:</strong> when reviewed evidence is insufficient, the safer outcome is to mark the content as uncertain or needs-review rather than replace one unsupported claim with another.</div>
          <p><Link className="inline-link" href={contactHref}><Flag size={15} aria-hidden="true" />Open correction contact path <ArrowRight size={15} aria-hidden="true" /></Link> <Link className="inline-link" href="/ai-transparency" style={{ marginLeft: "0.55rem" }}><ShieldCheck size={15} aria-hidden="true" />AI transparency <ArrowRight size={15} aria-hidden="true" /></Link></p>
        </article>
        <aside className="article-rail"><h2>Related</h2><Link href="/sources">Sources</Link><Link href="/ai-transparency">AI Transparency</Link><Link href="/disclaimer">AI Disclaimer</Link><Link href="/privacy">Privacy</Link><Link href={contactHref}>Contact</Link></aside>
      </section>
    </main>
  );
}
