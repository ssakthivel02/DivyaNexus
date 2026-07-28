import { useState } from "react";
import { ArrowRight, Expand, Image as ImageIcon, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { ownerSelectedArtwork } from "@/data/portalArtwork";

export function PortalArtworkPanel() {
  const [loaded, setLoaded] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  if (!ownerSelectedArtwork.readyForProduction || !ownerSelectedArtwork.assetPath) return null;

  const displayedAsset = usingFallback ? ownerSelectedArtwork.fallbackPath : ownerSelectedArtwork.assetPath;

  return (
    <section
      className={`portal-artwork ${loaded ? "is-loaded" : "is-loading"}`}
      aria-labelledby="portal-artwork-title"
      aria-describedby="portal-artwork-description portal-artwork-note"
      data-owner-artwork="active"
    >
      <div className="portal-artwork__visual" aria-busy={!loaded}>
        <img
          src={displayedAsset}
          alt={ownerSelectedArtwork.alt}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          onLoad={() => setLoaded(true)}
          onError={() => {
            if (!usingFallback) {
              setLoaded(false);
              setUsingFallback(true);
            }
          }}
        />
        <span className="portal-artwork__badge"><Sparkles size={14} aria-hidden="true" />Owner-selected portal vision</span>
        {!loaded && <span className="portal-artwork__loading" role="status">Loading the selected visual…</span>}
      </div>

      <div className="portal-artwork__copy">
        <p className="scene-kicker"><ImageIcon size={14} aria-hidden="true" />Featured vision</p>
        <p lang="ta">{ownerSelectedArtwork.tamilTitle}</p>
        <h2 id="portal-artwork-title">{ownerSelectedArtwork.title}</h2>
        <p id="portal-artwork-description">{ownerSelectedArtwork.description}</p>
        <div className="portal-artwork__actions">
          <Link className="button button--gold" href="/explore">
            Explore the live portal <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <a className="button button--glass" href={ownerSelectedArtwork.assetPath} target="_blank" rel="noreferrer">
            View full visual <Expand size={16} aria-hidden="true" />
          </a>
        </div>
        <p id="portal-artwork-note" className="portal-artwork__note">
          This owner-approved visual is displayed without cropping. Live collection totals and available pathways remain governed by the current portal and its collection-status page.
        </p>
        {usingFallback && <p className="portal-artwork__fallback" role="status">The selected visual could not load, so the portal is showing its safe local fallback.</p>}
      </div>
    </section>
  );
}
