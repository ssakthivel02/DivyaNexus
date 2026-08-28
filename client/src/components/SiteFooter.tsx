/**
 * Shiva legacy footer: compact access to study, trust and legal routes.
 * Existing route contracts are preserved; only public-facing identity is migrated.
 */
import { Link } from "wouter";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

const footerGroups = [
  { title: "Explore", links: [["Scriptures", "/scriptures"], ["Deities", "/deities"], ["Temples", "/temples"], ["Learning", "/learning"], ["Audio", "/audio"]] },
  { title: "Study", links: [["Ask Divya", "/ask-divya"], ["Life Guidance", "/life-guidance"], ["Glossary", "/glossary"], ["Collection Status", "/collection-status"], ["Sources", "/sources"], ["About", "/about"]] },
  { title: "Support & legal", links: [["System Status", "/status"], ["Privacy", "/privacy"], ["Terms", "/terms"], ["AI Disclaimer", "/disclaimer"], ["Delete Account", "/delete-account"], ["Contact", "/contact"]] },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__topline"><span>SHIVA / VEDIC KNOWLEDGE ARCHIVE</span><span aria-hidden="true" /><Link href="/collection-status">Review collection depth <ArrowUpRight size={14} aria-hidden="true" /></Link></div>
      <div className="site-footer__grid">
        <div className="site-footer__intro"><BrandMark /><p>A bilingual Vedic knowledge space centred on Shiva while preserving study of the Vedas, Upanishads, Gita, Vishnu, Devi, temples and related traditions.</p><p className="site-footer__notice">Educational and devotional reflection only. No outcome is guaranteed.</p></div>
        {footerGroups.map((group) => <details key={group.title} className="site-footer__group" open><summary>{group.title}<ChevronDown size={16} aria-hidden="true" /></summary><div>{group.links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div></details>)}
      </div>
      <div className="site-footer__bar"><span>© 2026 Shiva</span><span lang="ta">கல்வி மற்றும் பக்தி சிந்தனைக்காக மட்டுமே.</span><span>Browser-local data remains in your browser unless a feature says otherwise.</span></div>
    </footer>
  );
}
