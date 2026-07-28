import { ExternalLink, ShieldCheck } from "lucide-react";
import { resolveDeitySources } from "@/features/deities/sources";
import type { DeityRecord } from "@/features/deities";

export function DeitySourcePanel({ record }: { record: DeityRecord }) {
  const sources = resolveDeitySources(record.sourceIds);

  return (
    <aside className="deity-source-panel" aria-labelledby="deity-sources-title">
      <p className="scene-kicker"><ShieldCheck size={14} aria-hidden="true" />Source and editorial panel</p>
      <h2 id="deity-sources-title">What supports this orientation?</h2>
      <p>
        These links support identification, iconographic context, and broad orientation. They do not make this page a complete theological, ritual, or textual account.
      </p>
      <div className="deity-source-panel__status">
        <span>{record.editorialStatus}</span>
        <span>{record.confidence}</span>
        <span>{record.reviewedDate}</span>
      </div>
      <div className="deity-source-panel__list">
        {sources.map((source) => (
          <a key={source.id} href={source.url} target="_blank" rel="noreferrer">
            <span>{source.category}</span>
            <strong>{source.title}</strong>
            <small>{source.organisation}</small>
            <p>{source.note}</p>
            <b>Open reference <ExternalLink size={14} aria-hidden="true" /></b>
          </a>
        ))}
      </div>
      <p className="deity-source-panel__notice">
        No verse quotation is generated on this page. Primary texts, translations, local practice, and specialist theology require separate record-level review.
      </p>
    </aside>
  );
}
