import { Compass, Languages, ListTree, Sparkles } from "lucide-react";
import type { DeityRecord } from "@/features/deities";

function ListBlock({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <section className="deity-list-block">
      <h2>{title}</h2>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </section>
  );
}

export function DeityOverview({ record }: { record: DeityRecord }) {
  return (
    <div className="deity-overview">
      <section className="deity-summary-panel">
        <p className="scene-kicker"><Languages size={14} aria-hidden="true" />Bilingual orientation</p>
        <h2>Begin with context, not a single claim.</h2>
        <div className="deity-summary-panel__grid">
          <p>{record.summary}</p>
          <p lang="ta">{record.tamilSummary}</p>
        </div>
        <div className="deity-aliases" aria-label="Names and transliterations">
          {record.transliterations.map((name) => <span key={name}>{name}</span>)}
        </div>
      </section>

      <section className="deity-facts" aria-labelledby="iconography-title">
        <div className="deity-section-heading">
          <p className="scene-kicker"><Sparkles size={14} aria-hidden="true" />Visual literacy</p>
          <h2 id="iconography-title">Iconography with its limits visible.</h2>
        </div>
        <div className="deity-facts__grid">
          {record.iconography.map((fact) => (
            <article key={fact.label}>
              <span>{fact.label}</span>
              <p>{fact.value}</p>
              {fact.tamilValue && <p lang="ta">{fact.tamilValue}</p>}
            </article>
          ))}
        </div>
      </section>

      <section className="deity-study-grid">
        <ListBlock title="Traditions" items={record.traditions} />
        <ListBlock title="Forms and pathways" items={record.forms} />
        <ListBlock title="Associated texts" items={record.associatedTexts} />
        <ListBlock title="Observance context" items={record.observanceContext} />
      </section>

      <section className="deity-relationships">
        <div className="deity-section-heading">
          <p className="scene-kicker"><ListTree size={14} aria-hidden="true" />Relational context</p>
          <h2>Family and association are record-specific.</h2>
        </div>
        <div>{record.relationships.map((fact) => <article key={fact.label}><strong>{fact.label}</strong><p>{fact.value}</p></article>)}</div>
      </section>

      <section className="deity-questions">
        <p className="scene-kicker"><Compass size={14} aria-hidden="true" />Questions for deeper study</p>
        <ol>{record.studyQuestions.map((question) => <li key={question}>{question}</li>)}</ol>
      </section>
    </div>
  );
}
