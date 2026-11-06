import { useEffect, useState } from "react";
import { Bookmark, Check, Copy, MessageCircleQuestion, Share2 } from "lucide-react";
import { Link } from "wouter";
import { DeityHero } from "@/components/deities/DeityHero";
import { DeityOverview } from "@/components/deities/DeityOverview";
import { DeityRelated } from "@/components/deities/DeityRelated";
import { DeitySourcePanel } from "@/components/deities/DeitySourcePanel";
import { getDeityRecord } from "@/features/deities";
import { getBookmarks, recordHistory, toggleBookmark } from "@/lib/localLibrary";
import "@/deity-wave3.css";

export default function DeityDetail({ slug }: { slug: string }) {
  const record = getDeityRecord(slug);
  const recordId = `deity:${slug}`;
  const [saved, setSaved] = useState(() => getBookmarks().includes(recordId));
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (record) recordHistory(recordId);
  }, [record, recordId]);

  if (!record) {
    return (
      <main id="main-content" className="page-main deity-missing">
        <p className="scene-kicker">Deity encyclopedia</p>
        <h1>This reviewed record is not available.</h1>
        <p>The requested path may be misspelled or may still require editorial research.</p>
        <Link href="/deities" className="button button--primary">Return to deity directory</Link>
      </main>
    );
  }

  const copyRecord = async () => {
    await navigator.clipboard.writeText(`${record.name} / ${record.tamilName}\n${record.strapline}\n${window.location.href}`);
    setStatus("Record reference copied");
    window.setTimeout(() => setStatus(""), 2200);
  };

  const shareRecord = async () => {
    const text = `${record.name} — ${record.strapline}`;
    if (navigator.share) await navigator.share({ title: `${record.name} · DivyaNexus`, text, url: window.location.href });
    else await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
    setStatus("Shared or copied");
    window.setTimeout(() => setStatus(""), 2200);
  };

  return (
    <main id="main-content" className="page-main deity-detail">
      <DeityHero record={record} />
      <section className="deity-detail-actions" aria-label="Deity record actions">
        <button onClick={() => setSaved(toggleBookmark(recordId).includes(recordId))}>
          {saved ? <Check size={16} aria-hidden="true" /> : <Bookmark size={16} aria-hidden="true" />}
          {saved ? "Saved locally" : "Save locally"}
        </button>
        <button onClick={copyRecord}><Copy size={16} aria-hidden="true" />Copy reference</button>
        <button onClick={shareRecord}><Share2 size={16} aria-hidden="true" />Share</button>
        <Link href={`/ask-divya?context=${encodeURIComponent(recordId)}`}><MessageCircleQuestion size={16} aria-hidden="true" />Ask Divya with context</Link>
        {status && <span role="status">{status}</span>}
      </section>
      <section className="deity-detail-layout">
        <DeityOverview record={record} />
        <DeitySourcePanel record={record} />
      </section>
      <DeityRelated record={record} />
    </main>
  );
}
