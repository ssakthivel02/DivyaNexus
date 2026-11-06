import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { getRelatedDeities, type DeityRecord } from "@/features/deities";

export function DeityRelated({ record }: { record: DeityRecord }) {
  const related = getRelatedDeities(record);
  if (!related.length) return null;

  return (
    <section className="deity-related" aria-labelledby="related-deities-title">
      <div className="deity-section-heading">
        <p className="scene-kicker">Related pathways</p>
        <h2 id="related-deities-title">Continue without losing context.</h2>
      </div>
      <div className="deity-related__grid">
        {related.map((item) => (
          <Link href={`/deities/${item.slug}`} key={item.slug}>
            <span lang="ta">{item.tamilName}</span>
            <strong>{item.name}</strong>
            <p>{item.strapline}</p>
            <b>Open record <ArrowRight size={15} aria-hidden="true" /></b>
          </Link>
        ))}
      </div>
    </section>
  );
}
