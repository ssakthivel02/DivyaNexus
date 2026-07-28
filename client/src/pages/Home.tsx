/**
 * Divine Observatory Cinema: the homepage is a cinematic procession of distinct visual scenes.
 * It favors original visual storytelling, source-aware actions, and touch-safe interactions.
 */
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpenText,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Compass,
  Headphones,
  Languages,
  Map,
  Pause,
  Play,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Stars,
  WifiOff,
} from "lucide-react";
import { Link } from "wouter";
import { ASSETS, knowledgeCategories, learningPaths, lifeNeeds, records } from "@/data/content";
import { deityEditorialCards } from "@/data/deityEditorial";
import { homePathways, popularSearches, trustSignals } from "@/data/homeExperience";
import { getBookmarks, toggleBookmark } from "@/lib/localLibrary";
import { Reveal } from "@/components/Reveal";
import { PortalArtworkPanel } from "@/components/PortalArtworkPanel";
import "@/home-wave2.css";

type HomeProps = { onAsk: () => void; onSearch: () => void };

const heroFrames = [
  {
    image: ASSETS.hero,
    eyebrow: "Tamil-first · Source-aware · Offline-friendly",
    tamil: "வேத ஞானத்தின் தெய்வீக உலகை ஆராயுங்கள்",
    title: <>A universe of wisdom, <em>made living.</em></>,
    description:
      "Explore Vedic knowledge through luminous stories, accessible learning paths, and a clearly bounded AI guide—each journey designed to bring a question closer to its context.",
    label: "The observatory archive",
  },
  {
    image: ASSETS.heroDawn,
    eyebrow: "A pathway from curiosity to context",
    tamil: "ஒரு கேள்வியிலிருந்து ஒரு பாதைக்கு",
    title: <>Every question opens a <em>new horizon.</em></>,
    description:
      "Move between scripture, temples, culture, and lived reflection without losing the distinction between source, interpretation, and a gentle next step.",
    label: "The dawn pathway",
  },
  {
    image: ASSETS.heroArchive,
    eyebrow: "A living cultural learning space",
    tamil: "படிக்கவும், புரிந்துகொள்ளவும், பகிரவும்",
    title: <>Read the source. Feel the <em>continuity.</em></>,
    description:
      "DivyaNexus brings together bilingual discovery, cultural learning, and transparent digital guidance in an experience built for returning learners.",
    label: "The living archive",
  },
  {
    image: ASSETS.ask,
    eyebrow: "Guided local knowledge · Clearly labelled",
    tamil: "கேள்வியை சிந்தனையுள்ள பாதையாக மாற்றுங்கள்",
    title: <>Let a question become a <em>considered path.</em></>,
    description:
      "Begin with a question, discover related records, and keep primary text, editorial translation, interpretation, and generated reflection visibly separate.",
    label: "The guidance lantern",
  },
] as const;

const heroPathways = [homePathways[0], homePathways[2], homePathways[4], homePathways[5]];

const categoryArtwork: Record<string, string> = {
  "/scriptures": ASSETS.scripture,
  "/deities": ASSETS.deity,
  "/temples": ASSETS.temple,
  "/life-guidance": ASSETS.guidance,
  "/learning": ASSETS.learning,
  "/kids": ASSETS.kids,
};

const trustIcons = [Languages, ShieldCheck, WifiOff, Stars] as const;

export default function Home({ onAsk, onSearch }: HomeProps) {
  const daily = records.find((record) => record.id === "gita-2-47") ?? records[0];
  const [bookmarked, setBookmarked] = useState(() => getBookmarks().includes(daily.id));
  const [shareStatus, setShareStatus] = useState("");
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const frame = heroFrames[heroIndex];

  useEffect(() => {
    if (heroPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setInterval(
      () => setHeroIndex((index) => (index + 1) % heroFrames.length),
      9000,
    );
    return () => window.clearInterval(timer);
  }, [heroPaused]);

  const changeHero = (direction: 1 | -1) =>
    setHeroIndex((index) => (index + direction + heroFrames.length) % heroFrames.length);

  const shareWisdom = async () => {
    const text = `${daily.title} — ${daily.englishMeaning} DivyaNexus: source-aware learning.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "DivyaNexus Daily Wisdom", text, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(text);
      }
      setShareStatus("Shared or copied");
    } catch {
      setShareStatus("Sharing was cancelled");
    }
    window.setTimeout(() => setShareStatus(""), 2400);
  };

  return (
    <>
      <section className="cinema-hero" aria-labelledby="hero-title" data-home-wave="2">
        {heroFrames.map((item, index) => (
          <img
            key={item.label}
            src={item.image}
            className={`cinema-hero__image ${index === heroIndex ? "is-active" : ""}`}
            alt=""
            aria-hidden={index !== heroIndex}
            fetchPriority={index === 0 ? "high" : "auto"}
          />
        ))}
        <div className="cinema-hero__veil" />
        <div className="cinema-hero__stars" aria-hidden="true" />
        <div className="cinema-hero__threshold" aria-hidden="true" />
        <div className="cinema-hero__inner">
          <div className="cinema-hero__copy">
            <p className="scene-kicker"><Stars size={14} aria-hidden="true" />{frame.eyebrow}</p>
            <p className="cinema-hero__tamil" lang="ta">{frame.tamil}</p>
            <h1 id="hero-title">{frame.title}</h1>
            <p className="cinema-hero__description">{frame.description}</p>

            <button className="cinema-hero__search-launch" type="button" onClick={onSearch}>
              <Search size={18} aria-hidden="true" />
              <span>Search scriptures, deities, temples, and life questions</span>
              <kbd>⌘K</kbd>
            </button>

            <div className="cinema-hero__search-chips" aria-label="Popular searches">
              {popularSearches.map((item) => (
                <Link key={item.label} href={`/search?q=${encodeURIComponent(item.query)}`}>{item.label}</Link>
              ))}
            </div>

            <div className="cinema-hero__actions">
              <button className="button button--primary button--glow" onClick={onAsk}><Sparkles size={17} aria-hidden="true" />Ask Divya</button>
              <Link className="button button--glass" href="/explore"><Compass size={17} aria-hidden="true" />Explore the universe</Link><a className="button button--glass" href="#owner-portal-vision"><Stars size={17} aria-hidden="true" />View portal vision</a>
            </div>
            <div className="cinema-hero__source-line"><span />A vivid learning experience, with primary sources, editorial translation, and generated reflection visibly distinguished.</div>
          </div>

          <aside className="cinema-path-panel" aria-label="Choose a path into the archive">
            <div className="cinema-path-panel__head">
              <span>Choose a path into the archive</span>
              <strong aria-live="polite">0{heroIndex + 1} / 0{heroFrames.length}</strong>
            </div>
            <nav className="cinema-path-panel__links">
              {heroPathways.map((pathway, index) => (
                <Link href={pathway.href} key={pathway.title}>
                  <span>0{index + 1}</span>
                  <div>
                    <strong>{pathway.title}</strong>
                    <small lang="ta">{pathway.tamil}</small>
                    <p>{pathway.detail}</p>
                  </div>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              ))}
            </nav>
            <Link className="cinema-path-panel__all" href="/explore">View all pathways <ArrowRight size={16} aria-hidden="true" /></Link>
            <div className="cinema-path-panel__scene-controls" aria-label="Hero scene controls">
              <button aria-label="Previous hero scene" onClick={() => changeHero(-1)}><ChevronLeft size={18} aria-hidden="true" /></button>
              <div className="cinema-hero__dots" aria-label="Select hero scene">
                {heroFrames.map((item, index) => (
                  <button
                    key={item.label}
                    aria-label={`Show ${item.label}`}
                    aria-pressed={index === heroIndex}
                    className={index === heroIndex ? "is-active" : ""}
                    onClick={() => setHeroIndex(index)}
                  />
                ))}
              </div>
              <button
                aria-label={heroPaused ? "Resume automatic hero scenes" : "Pause automatic hero scenes"}
                aria-pressed={heroPaused}
                onClick={() => setHeroPaused((value) => !value)}
              >
                {heroPaused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
              </button>
              <button aria-label="Next hero scene" onClick={() => changeHero(1)}><ChevronRight size={18} aria-hidden="true" /></button>
            </div>
            <p className="cinema-path-panel__scene-label" aria-live="polite">{frame.label}</p>
          </aside>
        </div>
      </section>

      <main id="main-content" className="cinema-main">
        <section className="cinema-intro-band" aria-label="Start exploring">
          <p>One living universe. Many ways in.</p>
          <div>
            <button onClick={onSearch}><Search size={16} aria-hidden="true" />Find a source</button>
            <Link href="/scriptures"><BookOpenText size={16} aria-hidden="true" />Enter the library</Link>
            <Link href="/temples"><Map size={16} aria-hidden="true" />Follow a temple route</Link>
          </div>
        </section>

        <section className="home-trust-ribbon" aria-label="DivyaNexus experience principles">
          {trustSignals.map((signal, index) => {
            const Icon = trustIcons[index];
            return (
              <div key={signal.label}>
                <Icon size={20} aria-hidden="true" />
                <p><strong>{signal.label}</strong><span lang="ta">{signal.tamil}</span><small>{signal.detail}</small></p>
              </div>
            );
          })}
        </section>

        <section className="home-evidence-strip" aria-label="Current collection status">
          <div><strong>{records.filter((record) => record.category === "Scripture").length}</strong><span>source-aware scripture records</span></div>
          <div><strong>{deityEditorialCards.length}</strong><span>deity orientation pathways</span></div>
          <div><strong>{knowledgeCategories.length}</strong><span>knowledge destinations</span></div>
          <div><strong>{heroFrames.length}</strong><span>cinematic hero scenes</span></div>
        </section>

        <PortalArtworkPanel />

        <section className="cinema-section cinema-section--wisdom" aria-labelledby="daily-wisdom-title">
          <Reveal className="cinema-wisdom">
            <div className="cinema-wisdom__art"><img src={ASSETS.wisdom} alt="Palm-leaf manuscript, lamp, and delicate star-map projection" loading="lazy" /><span className="art-source-pin">Today’s study lead</span></div>
            <div className="cinema-wisdom__content">
              <p className="scene-kicker"><Stars size={14} aria-hidden="true" />Daily wisdom</p>
              <p className="cinema-wisdom__tamil" lang="ta">இன்றைய ஞானம்</p>
              <h2 id="daily-wisdom-title">A quiet verse can be the start of a larger view.</h2>
              <div className="cinema-wisdom__record">
                <p className="record-source">{daily.source} · {daily.reference}</p>
                <h3>{daily.title}</h3>
                <p lang="ta">{daily.tamilMeaning}</p>
                <p>{daily.englishMeaning}</p>
              </div>
              <div className="cinema-wisdom__actions">
                <Link className="button button--compact" href={`${daily.route}?record=${daily.id}`}><BookOpenText size={15} aria-hidden="true" />Read source</Link>
                <Link className="button button--compact" href="/audio"><Headphones size={15} aria-hidden="true" />Listen later</Link>
                <button className="button button--compact" onClick={onAsk}><CircleHelp size={15} aria-hidden="true" />Ask for context</button>
                <button className="button button--compact" onClick={() => setBookmarked(toggleBookmark(daily.id).includes(daily.id))}>{bookmarked ? <Check size={15} aria-hidden="true" /> : <Bookmark size={15} aria-hidden="true" />}{bookmarked ? "Saved" : "Save locally"}</button>
                <button className="button button--icon" onClick={shareWisdom} aria-label="Share daily wisdom"><Share2 size={15} aria-hidden="true" /></button>
              </div>
              {shareStatus && <p className="status-note" role="status">{shareStatus}</p>}
            </div>
          </Reveal>
        </section>

        <section className="cinema-section cinema-section--ask" aria-labelledby="ask-preview-title">
          <Reveal className="ask-gateway">
            <div className="ask-gateway__copy">
              <p className="scene-kicker"><Sparkles size={14} aria-hidden="true" />A new kind of spiritual guidance</p>
              <p className="ask-gateway__tamil" lang="ta">கேள்வியை ஒரு பாதையாக மாற்றுங்கள்</p>
              <h2 id="ask-preview-title">Ask Divya. Explore deeper.</h2>
              <p>Bring a question about an idea, a verse, a festival, or everyday reflection. Divya responds with a visible distinction between primary text, editorial translation, interpretation, generated explanation, and prompts for further learning.</p>
              <div className="ask-gateway__prompts" aria-label="Suggested Ask Divya prompts">
                {["What is dharma in everyday life?", "Where can I begin with the Gita?", "Tell me about a temple journey"].map((prompt) => <button key={prompt} onClick={onAsk}>{prompt}<ArrowRight size={15} aria-hidden="true" /></button>)}
              </div>
              <div className="cinema-hero__actions"><button className="button button--primary button--glow" onClick={onAsk}><Sparkles size={17} aria-hidden="true" />Open Ask Divya</button><button className="button button--glass" onClick={onSearch}><Search size={17} aria-hidden="true" />Search a source first</button></div>
            </div>
            <div className="ask-gateway__art"><img src={ASSETS.ask} alt="Luminous knowledge core surrounded by orbiting light fragments" loading="lazy" /><div className="ask-gateway__ring" aria-hidden="true" /><span className="art-source-pin">Source-aware response layers</span></div>
          </Reveal>
        </section>

        <section className="cinema-section cinema-section--guidance" aria-labelledby="guidance-title">
          <Reveal className="guidance-scene">
            <img src={ASSETS.guidance} alt="Constellation wheel above a twilight horizon" loading="lazy" />
            <div className="guidance-scene__veil" />
            <div className="guidance-scene__copy">
              <p className="scene-kicker"><Compass size={14} aria-hidden="true" />Guidance for the road ahead</p>
              <h2 id="guidance-title">Choose a life question. Follow a considered path.</h2>
              <p>Explore themes traditionally associated with reflection, responsibility, relationships, learning, and meaning—without promises of particular outcomes.</p>
              <div className="guidance-scene__paths">
                {lifeNeeds.slice(0, 5).map((need, index) => <Link key={need.name} href={`/search?q=${encodeURIComponent(need.query)}`}><span>0{index + 1}</span>{need.name}<ArrowRight size={15} aria-hidden="true" /></Link>)}
              </div>
            </div>
          </Reveal>
        </section>

        <section className="cinema-section cinema-section--universe" aria-labelledby="universe-title">
          <div className="cinema-section-head"><div><p className="scene-kicker"><Stars size={14} aria-hidden="true" />Explore the universe</p><h2 id="universe-title">Stories, sources, places, and pathways.</h2></div><Link href="/explore" className="circle-link" aria-label="Explore all knowledge pathways"><ArrowRight size={21} aria-hidden="true" /></Link></div>
          <div className="universe-cards">
            {knowledgeCategories.map((category, index) => <Link key={category.route} href={category.route} className={`universe-card universe-card--${index + 1}`}>
              <img src={categoryArtwork[category.route] ?? ASSETS.heroArchive} alt="" loading="lazy" />
              <div className="universe-card__veil" />
              <div className="universe-card__content"><span>0{index + 1}</span><h3>{category.title}</h3><p lang="ta">{category.tamil}</p><small>{category.detail}</small><b>Enter path <ArrowRight size={14} aria-hidden="true" /></b></div>
            </Link>)}
          </div>
        </section>

        <section className="cinema-section cinema-section--scripture" aria-labelledby="scriptures-title">
          <Reveal className="scripture-stage">
            <div className="scripture-stage__intro"><p className="scene-kicker"><BookOpenText size={14} aria-hidden="true" />Scripture universe</p><h2 id="scriptures-title">Enter the library through a living constellation.</h2><p>Begin with verified Sanskrit passages, readable transliteration, bilingual editorial translations, visible source provenance, and clearly separated reflection.</p><Link href="/scriptures" className="button button--glass">Browse scriptures <ArrowRight size={16} aria-hidden="true" /></Link></div>
            <div className="scripture-stage__art"><img src={ASSETS.scripture} alt="Illuminated manuscript bundles arranged in a celestial archive" loading="lazy" /></div>
          </Reveal>
          <div className="scripture-rail" aria-label="Featured scripture entries">
            {records.filter((record) => record.category === "Scripture").slice(0, 5).map((record, index) => <Link key={record.id} href={`${record.route}?record=${record.id}`} className="scripture-rail__item"><span>0{index + 1}</span><p>{record.source}</p><h3>{record.title}</h3><small>{record.reference}</small><ArrowRight size={16} aria-hidden="true" /></Link>)}
          </div>
        </section>

        <section className="cinema-section cinema-section--journeys" aria-labelledby="journeys-title">
          <div className="journey-grid">
            <Reveal className="journey-card journey-card--temple"><img src={ASSETS.temple} alt="Temple silhouette reflected in a tank at dawn" loading="lazy" /><div><p className="scene-kicker"><Map size={14} aria-hidden="true" />Temple journeys</p><h2 id="journeys-title">Follow places through memory, architecture, and context.</h2><Link href="/temples" className="button button--glass">Explore temples <ArrowRight size={16} aria-hidden="true" /></Link></div></Reveal>
            <Reveal className="journey-card journey-card--deity"><img src={ASSETS.deity} alt="Illuminated sacred symbol tableau in a temple-relief style" loading="lazy" /><div><p className="scene-kicker"><Stars size={14} aria-hidden="true" />Deity universe</p><h3>Ten foundational pathways—symbols, stories, and traditions approached with care.</h3><Link href="/deities" className="inline-arrow">Discover deities <ArrowRight size={16} aria-hidden="true" /></Link></div></Reveal>
          </div>
        </section>

        <section className="cinema-section cinema-section--learning" aria-labelledby="learning-title">
          <Reveal className="learning-stage">
            <div className="learning-stage__art"><img src={ASSETS.learning} alt="Learner following a manuscript and constellation pathway" loading="lazy" /><span className="art-source-pin">Learn at a human pace</span></div>
            <div className="learning-stage__content"><p className="scene-kicker"><Compass size={14} aria-hidden="true" />Learning pathways</p><h2 id="learning-title">A new beginning every day.</h2><p>Short sequences turn curiosity into a calmer study rhythm. No pressure loops, no false completion signals—only an inviting next step.</p><div className="learning-stage__list">{learningPaths.slice(0, 3).map((path, index) => <Link key={path.title} href={path.route}><span>0{index + 1}</span><div><strong>{path.title}</strong><small>{path.detail}</small></div><ArrowRight size={17} aria-hidden="true" /></Link>)}</div><Link href="/learning" className="button button--primary">See learning paths <ArrowRight size={16} aria-hidden="true" /></Link></div>
          </Reveal>
        </section>

        <section className="cinema-section cinema-section--family" aria-labelledby="family-title">
          <div className="family-grid">
            <Reveal className="family-card family-card--kids"><img src={ASSETS.kids} alt="Children sharing an illuminated folio in a warm storybook scene" loading="lazy" /><div><p className="scene-kicker">Kids universe</p><h2 id="family-title">Big stories for curious minds.</h2><p>Bright story routes, values-led prompts, and respectful cultural learning for shared discovery.</p><Link href="/kids" className="button button--glass">Explore kids <ArrowRight size={16} aria-hidden="true" /></Link></div></Reveal>
            <Reveal className="family-card family-card--audio"><img src={ASSETS.audio} alt="Lamp and resonant vessel with soft arcs of golden sound" loading="lazy" /><div><p className="scene-kicker">Audio experiences</p><h3>Pause, listen, and return when a reviewed recording is ready.</h3><Link href="/audio" className="inline-arrow"><Play size={15} aria-hidden="true" />Open audio <ArrowRight size={16} aria-hidden="true" /></Link></div></Reveal>
          </div>
        </section>

        <section className="cinema-section cinema-section--threshold" aria-labelledby="threshold-title">
          <Reveal className="final-threshold"><img src={ASSETS.heroDawn} alt="" loading="lazy" /><div className="final-threshold__veil" /><div><p className="scene-kicker"><Stars size={14} aria-hidden="true" />Begin your journey</p><h2 id="threshold-title">Let the next question lead somewhere meaningful.</h2><p>Build a personal local library, return to an unfinished thread, or begin with a source that feels close to home.</p><div className="cinema-hero__actions"><button className="button button--primary button--glow" onClick={onAsk}><Sparkles size={17} aria-hidden="true" />Begin with Ask Divya</button><Link className="button button--glass" href="/library">Open my library <ArrowRight size={16} aria-hidden="true" /></Link></div></div></Reveal>
        </section>
      </main>
    </>
  );
}
