/** Celestial Manuscript Atelier: editorial headings pair a source marker with generous reading space. */
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  tamil,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  tamil?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="section-heading">
      <div>
        <p className="eyebrow"><span className="eyebrow__star">✦</span>{eyebrow}</p>
        <h2>{title} {tamil && <span lang="ta">{tamil}</span>}</h2>
        {description && <p className="section-heading__description">{description}</p>}
      </div>
      {action && <div className="section-heading__action">{action}</div>}
    </header>
  );
}

