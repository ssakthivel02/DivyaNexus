/** Celestial Manuscript Atelier: Contact preserves the established support path without inventing a public email address. */
import { ArrowRight, Flag, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

export default function Contact() {
  const params = new URLSearchParams(window.location.search);
  const isCorrection = params.get("intent") === "content-correction";
  const isAskDivyaCorrection = isCorrection && params.get("from") === "ask-divya";

  return (
    <main id="main-content" className="page-main">
      <section className="page-hero page-hero--compact">
        <p className="eyebrow"><span className="eyebrow__star">✦</span>Contact</p>
        <h1>Reach the DivyaNexus support path.<span lang="ta">ஆதரவு வழியை அணுகுங்கள்</span></h1>
        <p>For existing app support, use the app owner or the support email listed in the DivyaNexus Google Play Store listing. This page preserves the existing public support route without publishing an unverified address.</p>
      </section>
      {isCorrection && (
        <section className="section section--flush-top" aria-label="Content correction handoff">
          <div className="notice-box" data-testid="correction-contact-handoff">
            <strong><Flag size={15} aria-hidden="true" /> Content correction handoff:</strong>{" "}
            {isAskDivyaCorrection
              ? "This report came from Ask Divya. Include the visible citation label, the specific generated explanation segment that concerns you, and any source evidence you want reviewed."
              : "Include the exact page or record, the text or claim that concerns you, and any source evidence you want reviewed."}
            {" "}Do not include passwords, financial details, medical records, or other unnecessary personal information.
          </div>
          <p><Link className="inline-link" href={isAskDivyaCorrection ? "/content-corrections?from=ask-divya" : "/content-corrections"}>Review correction guidance <ArrowRight size={15} aria-hidden="true" /></Link></p>
        </section>
      )}
      <section className="section section--flush-top">
        <div className="feature-split">
          <div className="paper-panel">
            <ShieldCheck size={27} color="var(--saffron)" aria-hidden="true" />
            <h2 style={{ marginTop: "1rem" }}>For account or data requests</h2>
            <p className="muted">Use the dedicated pages first. They describe the app’s current request path, what may be deleted, and what may be retained for limited security or legal reasons.</p>
            <div className="hero__actions"><Link className="button button--primary" href="/delete-account">Delete Account <ArrowRight size={16} aria-hidden="true" /></Link><Link className="button" href="/delete-data">Delete Data</Link></div>
          </div>
          <div className="paper-panel">
            <p className="section-kicker">When contacting support</p>
            <h2>Include only what is needed.</h2>
            <p className="muted">If contacting support about an account you cannot access, include the email address used for the DivyaNexus login. Avoid sharing sensitive information unnecessarily. The support process may ask for enough detail to verify the request.</p>
            <Link className="button" href="/privacy">Read privacy choices <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
