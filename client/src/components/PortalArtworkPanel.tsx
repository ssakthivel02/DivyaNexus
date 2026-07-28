import { ArrowRight, Image as ImageIcon, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { ownerSelectedArtwork } from "@/data/portalArtwork";

export function PortalArtworkPanel() {
  if (!ownerSelectedArtwork.readyForProduction || !ownerSelectedArtwork.assetPath) return null;

  return (
    <section className="portal-artwork" aria-labelledby="portal-artwork-title">
      <img src={ownerSelectedArtwork.assetPath} alt={ownerSelectedArtwork.alt} loading="lazy" />
      <div className="portal-artwork__veil" />
      <div className="portal-artwork__copy">
        <p className="scene-kicker"><Sparkles size={14} aria-hidden="true" />Owner-selected visual</p>
        <p lang="ta">{ownerSelectedArtwork.tamilTitle}</p>
        <h2 id="portal-artwork-title">{ownerSelectedArtwork.title}</h2>
        <p>{ownerSelectedArtwork.description}</p>
        <Link className="button button--glass" href="/explore">
          <ImageIcon size={16} aria-hidden="true" />Explore the portal <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
