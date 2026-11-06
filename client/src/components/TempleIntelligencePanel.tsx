import { Building2, CheckCircle2, CircleAlert, ExternalLink, Landmark, ShieldCheck } from "lucide-react";
import {
  templeConditionLabel,
  templeIntelligenceRecords,
  templeVerificationLabel,
} from "@/data/templeIntelligence";
import "@/temple-intelligence-wave10.css";

function supportStatus(value: string | null) {
  return value ? "Official link registered" : "Official link not yet verified";
}

export function TempleIntelligencePanel() {
  return (
    <section className="temple-intelligence" aria-labelledby="temple-intelligence-title">
      <div className="temple-intelligence__intro">
        <p className="scene-kicker"><ShieldCheck size={14} aria-hidden="true" />Temple Intelligence</p>
        <h2 id="temple-intelligence-title">See what is known, what is historical, and what still needs verification.</h2>
        <p>
          This gateway separates editorial temple learning from current operating facts. Timings, access,
          condition, governance, official websites, visitor information, and donation links remain withheld
          until a reviewed source is registered for a specific site.
        </p>
      </div>

      <div className="temple-intelligence__grid">
        {templeIntelligenceRecords.map((record) => {
          const supportLinks = [
            ["Official website", record.officialSupport.officialWebsite],
            ["Visitor information", record.officialSupport.visitorInfoUrl],
            ["Official donation", record.officialSupport.donationUrl],
          ] as const;
          return (
            <article className="temple-intelligence__card" key={record.id} data-verification={record.verification}>
              <div className="temple-intelligence__card-head">
                <span><Landmark size={16} aria-hidden="true" />{record.focus}</span>
                <strong>{templeVerificationLabel(record)}</strong>
              </div>
              <h3>{record.title}<span lang="ta">{record.tamilTitle}</span></h3>
              <div className="temple-intelligence__signals" aria-label={`${record.title} verification signals`}>
                <p><CheckCircle2 size={15} aria-hidden="true" /><span>Condition</span><strong>{templeConditionLabel(record)}</strong></p>
                <p><Building2 size={15} aria-hidden="true" /><span>Governance</span><strong>{record.governance.verified && record.governance.authorityName ? record.governance.authorityName : "Authority not yet verified"}</strong></p>
              </div>
              <p className="temple-intelligence__note"><CircleAlert size={15} aria-hidden="true" />{record.verificationNote}</p>
              <div className="temple-intelligence__support" aria-label={`${record.title} official support status`}>
                {supportLinks.map(([label, value]) => value ? (
                  <a key={label} href={value} rel="noreferrer" target="_blank">{label}<ExternalLink size={13} aria-hidden="true" /></a>
                ) : (
                  <span key={label}><small>{label}</small>{supportStatus(value)}</span>
                ))}
              </div>
            </article>
          );
        })}
      </div>

      <p className="temple-intelligence__boundary" role="note">
        A missing official link is not a broken feature. It is an explicit evidence state: DivyaNexus will not invent or infer an authority, donation destination, visitor rule, timing, price, or current condition.
      </p>
    </section>
  );
}
