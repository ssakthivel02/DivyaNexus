/** Celestial Manuscript Atelier: the precise symbolic mark is a luminous knowledge orbit. */
import { ASSETS } from "@/data/content";
import { Link } from "wouter";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand-mark" aria-label="Shiva home">
      <img src={ASSETS.mark} alt="" aria-hidden="true" className="brand-mark__glyph" />
      {!compact && (
        <span className="brand-mark__type" aria-label="Shiva">
          <span>SHIVA</span><strong>KNOWLEDGE</strong>
          <small lang="ta">சிவம் · வேத அறிவு</small>
        </span>
      )}
    </Link>
  );
}
