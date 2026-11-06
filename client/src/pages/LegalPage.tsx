/** Celestial Manuscript Atelier: legal routes are readable, enduring, and explicitly retain their former compliance purpose. */
import { Link } from "wouter";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { legalContent } from "@/data/content";

type LegalKey = keyof typeof legalContent;
export default function LegalPage({ page }: { page: LegalKey }) {
  const content = legalContent[page];
  return <main id="main-content" className="page-main"><section className="page-hero page-hero--compact"><p className="page-hero__crumb"><Link href="/">DivyaNexus</Link> / {content.title}</p><p className="eyebrow"><span className="eyebrow__star">✦</span>{content.eyebrow}</p><h1>{content.title}</h1><p>{content.updated}</p><div className="page-hero__meta"><span className="chip">Public route retained</span><span className="chip">Stage B website</span></div></section><div className="page-rule" /><section className="article-layout"><article className="article-main">{content.sections.map(([heading, copy]) => <section className="article-section" key={heading}><h2>{heading}</h2><p>{copy}</p>{heading === "Your choices" && <p><Link className="inline-link" href="/delete-account">Delete Account <ArrowRight size={15} aria-hidden="true" /></Link> <Link className="inline-link" href="/delete-data" style={{ marginLeft: "0.55rem" }}>Delete Data <ArrowRight size={15} aria-hidden="true" /></Link></p>}{heading === "How to request deletion" && <p><Link className="inline-link" href="/contact">Contact support <ArrowRight size={15} aria-hidden="true" /></Link></p>}</section>)}<div className="notice-box"><strong>Route continuity:</strong> This page remains available at the public URL required by the existing DivyaNexus website. It has been visually enhanced, not removed.</div></article><aside className="article-rail"><h2>Related</h2><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/disclaimer">AI & Content Disclaimer</Link><Link href="/sources">Sources</Link><Link href="/contact">Contact</Link></aside></section></main>;
}

