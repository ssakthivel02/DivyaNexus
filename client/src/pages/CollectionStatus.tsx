import { ArrowRight, BookOpenCheck, CircleEllipsis, Layers3, SearchCheck, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { EditorialStatusBadge } from "@/components/EditorialStatusBadge";
import { editorialCollections, getEditorialCoverage, getEditorialRecordsByCollection } from "@/data/editorial";

export default function CollectionStatus() {
  const coverage = getEditorialCoverage();
  return (
    <main id="main-content" className="page-main collection-status-page">
      <section className="collection-status-hero">
        <div>
          <p className="scene-kicker"><ShieldCheck size={14} aria-hidden="true" />Collection transparency</p>
          <p lang="ta">எது தயாராக உள்ளது, எது மதிப்பாய்வில் உள்ளது</p>
          <h1>Depth without hiding the review boundary.</h1>
          <p>
            DivyaNexus now exposes every expanded editorial pathway by collection and status. The counts below describe local portal records—not the size of the traditions themselves.
          </p>
        </div>
        <div className="collection-status-hero__metrics" aria-label="Collection summary">
          <article><Layers3 size={20} aria-hidden="true" /><strong>{coverage.collections}</strong><span>collections</span></article>
          <article><BookOpenCheck size={20} aria-hidden="true" /><strong>{coverage.total}</strong><span>records</span></article>
          <article><SearchCheck size={20} aria-hidden="true" /><strong>{coverage.statuses["Ready for guided learning"]}</strong><span>guided-learning ready</span></article>
          <article><CircleEllipsis size={20} aria-hidden="true" /><strong>{coverage.statuses["Needs source review"]}</strong><span>need source review</span></article>
        </div>
      </section>

      <section className="collection-status-note">
        <ShieldCheck size={18} aria-hidden="true" />
        <div>
          <strong>What these labels mean</strong>
          <p><b>Ready for guided learning</b> means the bounded editorial pathway is suitable for portal use. It does not mean every underlying tradition, source edition, or historical claim has been fully reviewed.</p>
        </div>
      </section>

      <section className="collection-status-grid" aria-label="Editorial collections">
        {editorialCollections.map((collection) => {
          const records = getEditorialRecordsByCollection(collection.collection);
          return (
            <article key={collection.collection} className="collection-status-card">
              <div className="collection-status-card__head">
                <div><p>{collection.collection}</p><h2>{collection.label}</h2><span lang="ta">{collection.tamilLabel}</span></div>
                <strong>{records.length}</strong>
              </div>
              <p>{collection.description}</p>
              <div className="collection-status-card__records">
                {records.map((record) => (
                  <div key={record.id}>
                    <div><h3>{record.title}</h3><span lang="ta">{record.tamilTitle}</span></div>
                    <EditorialStatusBadge status={record.status} />
                    <p>{record.focus}</p>
                  </div>
                ))}
              </div>
              <Link href={collection.route}>Open collection <ArrowRight size={15} aria-hidden="true" /></Link>
            </article>
          );
        })}
      </section>

      <section className="collection-status-boundaries">
        <div><p className="scene-kicker">Review discipline</p><h2>Expansion does not remove uncertainty.</h2></div>
        <div>
          <p>Records avoid current dates, travel details, ritual instructions, health claims, guaranteed benefits, and universalising language when those points are not verified.</p>
          <div className="cinema-hero__actions"><Link className="button button--primary" href="/sources">Read source method <ArrowRight size={15} aria-hidden="true" /></Link><Link className="button button--glass" href="/search">Search all records <ArrowRight size={15} aria-hidden="true" /></Link></div>
        </div>
      </section>
    </main>
  );
}
