import { ArrowRight, BookOpenCheck, Layers3, SearchCheck } from "lucide-react";
import { Link } from "wouter";
import { editorialCollections, getEditorialCoverage } from "@/data/editorial";

export function CollectionCoverage() {
  const coverage = getEditorialCoverage();
  return (
    <section className="collection-coverage" aria-labelledby="collection-coverage-title">
      <div className="collection-coverage__intro">
        <p className="scene-kicker"><Layers3 size={14} aria-hidden="true" />Editorial depth wave</p>
        <p lang="ta">தொகுப்பின் வளர்ச்சி வெளிப்படையாக</p>
        <h2 id="collection-coverage-title">More pathways, with review status still visible.</h2>
        <p>The expanded collection adds orientation, guided-learning, and source-review records without presenting starter material as a complete encyclopedia.</p>
        <Link className="button button--glass" href="/collection-status">Review collection status <ArrowRight size={16} aria-hidden="true" /></Link>
      </div>
      <div className="collection-coverage__metrics" aria-label="Editorial collection metrics">
        <article><strong>{coverage.total}</strong><span>editorial records</span><BookOpenCheck size={20} aria-hidden="true" /></article>
        <article><strong>{coverage.collections}</strong><span>expanded collections</span><Layers3 size={20} aria-hidden="true" /></article>
        <article><strong>{coverage.statuses["Ready for guided learning"]}</strong><span>guided-learning ready</span><SearchCheck size={20} aria-hidden="true" /></article>
        <article><strong>{coverage.statuses["Needs source review"]}</strong><span>records needing review</span><Layers3 size={20} aria-hidden="true" /></article>
      </div>
      <div className="collection-coverage__rail">
        {editorialCollections.map((collection) => (
          <Link href={collection.route} key={collection.collection}>
            <strong>{collection.label}</strong>
            <span lang="ta">{collection.tamilLabel}</span>
            <small>{collection.description}</small>
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  );
}
