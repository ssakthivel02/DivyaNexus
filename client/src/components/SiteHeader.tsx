/**
 * Divine Observatory Cinema: the header is a compact identity bar with a clear universe menu.
 * Desktop receives subtle hover depth; mobile uses a touch-first disclosure menu.
 */
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown, Compass, Menu, Moon, Search, Sparkles, Sun, X } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

type Props = { theme: "night" | "dawn"; onToggleTheme: () => void; onSearch: () => void; onAsk: () => void };

const primaryLinks = [
  ["Scriptures", "/scriptures"],
  ["Ask Divya", "/ask-divya"],
  ["Temples", "/temples"],
  ["Learning", "/learning"],
] as const;

const universeLinks = [
  ["Explore all", "A living index of knowledge pathways", "/explore"],
  ["Deity universe", "Symbols, stories, and traditions", "/deities"],
  ["Life guidance", "Questions for the road ahead", "/life-guidance"],
  ["Kids universe", "Shared learning for young minds", "/kids"],
] as const;

export function SiteHeader({ theme, onToggleTheme, onSearch, onAsk }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [universeOpen, setUniverseOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 24);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  const closeMenu = () => { setMenuOpen(false); setUniverseOpen(false); };
  const isActive = (href: string) => href === "/" ? location === href : location.startsWith(href);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="site-header__inner">
        <BrandMark />
        <nav className="site-header__nav" aria-label="Primary navigation">
          <div className="header-universe" onMouseEnter={() => setUniverseOpen(true)} onMouseLeave={() => setUniverseOpen(false)}>
            <button className={`header-nav-link ${universeOpen ? "is-open" : ""}`} onClick={() => setUniverseOpen((open) => !open)} aria-expanded={universeOpen} aria-haspopup="menu">Universe <ChevronDown size={14} aria-hidden="true" /></button>
            <div className={`universe-menu ${universeOpen ? "is-open" : ""}`} role="menu">
              <p>Choose a path into the archive</p>
              {universeLinks.map(([label, detail, href], index) => <Link key={href} href={href} className={`universe-menu__link universe-menu__link--${index + 1}`} role="menuitem" onClick={closeMenu}><span>0{index + 1}</span><div><strong>{label}</strong><small>{detail}</small></div></Link>)}
            </div>
          </div>
          {primaryLinks.map(([label, href]) => <Link key={href} href={href} className={isActive(href) ? "is-active" : ""}>{label}</Link>)}
          <Link href="/kids" className={isActive("/kids") ? "is-active" : ""}>Kids</Link>
        </nav>
        <div className="site-header__actions">
          <button className="icon-button header-search" onClick={onSearch} aria-label="Open global search" title="Search (Ctrl+K)"><Search size={17} aria-hidden="true" /><span>Search</span><kbd>⌘K</kbd></button>
          <button className="icon-button theme-button" onClick={onToggleTheme} aria-label={`Switch to ${theme === "night" ? "dawn" : "night"} theme`} title="Change color theme">{theme === "night" ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}</button>
          <button onClick={onAsk} className="ask-button"><Sparkles size={15} aria-hidden="true" />Ask Divya</button>
          <button className="mobile-menu-button icon-button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label="Open navigation menu">{menuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}</button>
        </div>
      </div>
      <div id="mobile-navigation" className={`mobile-navigation ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <p className="mobile-navigation__label"><Compass size={14} aria-hidden="true" />Find your path</p>
        {[...universeLinks.map(([label, , href]) => [label, href] as const), ...primaryLinks, ["Kids", "/kids"] as const, ["Audio", "/audio"] as const, ["My library", "/library"] as const].map(([label, href]) => <Link key={href} href={href} onClick={closeMenu}>{label}</Link>)}
        <button onClick={() => { closeMenu(); onSearch(); }}><Search size={16} aria-hidden="true" />Search the archive</button>
      </div>
    </header>
  );
}
