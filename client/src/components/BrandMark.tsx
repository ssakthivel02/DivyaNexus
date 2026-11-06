/** Celestial Manuscript Atelier: the precise symbolic mark is a luminous, non-deity knowledge orbit. */
import { ASSETS } from "@/data/content";
import { Link } from "wouter";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand-mark" aria-label="DivyaNexus home">
      <img src={ASSETS.mark} alt="" aria-hidden="true" className="brand-mark__glyph" />
      {!compact && (
        <span className="brand-mark__type" aria-label="DivyaNexus">
          <span>Divya</span><strong>NEXUS</strong>
          <small lang="ta">திவ்ய நெக்சஸ்</small>
        </span>
      )}
    </Link>
  );
}

