import { ArrowRight, Compass, Home, Search, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";
import { ASSETS } from "@/data/content";

const suggestions = [
  { title: "Explore the universe", detail: "Browse all well-marked knowledge pathways.", href: "/explore", icon: Compass },
  { title: "Search the collection", detail: "Try Tamil, English or transliteration.", href: "/search", icon: Search },
  { title: "Ask Divya", detail: "Open the bounded local guidance pathway.", href: "/ask-divya", icon: Sparkles },
] as const;

export default function NotFound() {
  const [location] = useLocation();

  return (
    <main id="main-content" className="page-main not-found-wave6">
      <img src={ASSETS.heroArchive} alt="A quiet illuminated archive beyond a dark celestial threshold" />
      <div className="not-found-wave6__veil" />
      <section className="not-found-wave6__content">
        <p className="scene-kicker">404 · Unmarked path</p>
        <p lang="ta" className="not-found-wave6__tamil">இந்தப் பாதை இன்னும் குறிக்கப்படவில்லை</p>
        <h1>The requested path is outside the current archive.</h1>
        <p>The address may be incomplete, retired or not yet part of the reviewed DivyaNexus route collection. No substitute content has been invented for it.</p>
        <code>{location}</code>
        <Link href="/" className="button button--primary"><Home size={17} aria-hidden="true" />Return home</Link>
      </section>
      <section className="not-found-wave6__routes" aria-label="Suggested recovery routes">
        {suggestions.map(({ title, detail, href, icon: Icon }) => (
          <Link key={href} href={href}>
            <Icon size={20} aria-hidden="true" />
            <div><strong>{title}</strong><span>{detail}</span></div>
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        ))}
      </section>
    </main>
  );
}
