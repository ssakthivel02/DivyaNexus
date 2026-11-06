import { ArrowLeft, BookOpenText, ShieldCheck, Stars } from "lucide-react";
import { Link } from "wouter";
import { ASSETS } from "@/data/content";
import type { DeityRecord } from "@/features/deities";

export function DeityHero({ record }: { record: DeityRecord }) {
  return (
    <section className="deity-detail-hero" aria-labelledby="deity-title">
      <img src={ASSETS.deity} alt="Sacred-symbol tableau in warm temple light" fetchPriority="high" />
      <div className="deity-detail-hero__veil" />
      <div className="deity-detail-hero__inner">
        <Link href="/deities" className="deity-back-link">
          <ArrowLeft size={16} aria-hidden="true" /> All deity pathways
        </Link>
        <p className="scene-kicker"><Stars size={14} aria-hidden="true" />Deity encyclopedia · editorial orientation</p>
        <p className="deity-detail-hero__tamil" lang="ta">{record.tamilName}</p>
        <h1 id="deity-title">{record.name}</h1>
        <p className="deity-detail-hero__strapline">{record.strapline}</p>
        <p className="deity-detail-hero__tamil-summary" lang="ta">{record.tamilStrapline}</p>
        <div className="deity-detail-hero__status">
          <span><ShieldCheck size={15} aria-hidden="true" />{record.editorialStatus}</span>
          <span><BookOpenText size={15} aria-hidden="true" />Confidence: {record.confidence}</span>
          <span>Reviewed {record.reviewedDate}</span>
        </div>
      </div>
    </section>
  );
}
