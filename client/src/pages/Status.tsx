import { useEffect, useState } from "react";
import { CheckCircle2, Cloud, Database, ExternalLink, RefreshCw, ShieldCheck, Wifi, WifiOff } from "lucide-react";
import { Link } from "wouter";
import { DIVYANEXUS_RELEASE } from "@/config/release";
import { PRODUCTION_SMOKE_ROUTES } from "@/config/routes";
import { collectRuntimeDiagnostics, type RuntimeDiagnostics } from "@/lib/diagnostics";

function StatusChip({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`status-chip ${ok ? "is-ok" : "is-warning"}`}>
      {ok ? <CheckCircle2 size={15} aria-hidden="true" /> : <WifiOff size={15} aria-hidden="true" />}
      {label}
    </span>
  );
}

export default function Status() {
  const [diagnostics, setDiagnostics] = useState<RuntimeDiagnostics | null>(null);

  const refresh = () => setDiagnostics(collectRuntimeDiagnostics());

  useEffect(() => {
    refresh();
    window.addEventListener("online", refresh);
    window.addEventListener("offline", refresh);
    return () => {
      window.removeEventListener("online", refresh);
      window.removeEventListener("offline", refresh);
    };
  }, []);

  return (
    <main id="main-content" className="page-main status-page">
      <section className="status-hero">
        <div>
          <p className="scene-kicker"><ShieldCheck size={14} aria-hidden="true" />Production evidence</p>
          <p lang="ta">வெளிப்படையான வெளியீட்டு நிலை</p>
          <h1>Release status without hidden assumptions.</h1>
          <p>
            This page reports browser-visible evidence only. It does not claim that every network, device,
            cache, or third-party service is healthy.
          </p>
        </div>
        <div className="status-hero__release" aria-label="Current release contract">
          <span>Current contract</span>
          <strong>{DIVYANEXUS_RELEASE.id}</strong>
          <small>{DIVYANEXUS_RELEASE.name}</small>
          <small>Reviewed {DIVYANEXUS_RELEASE.reviewedDate}</small>
        </div>
      </section>

      <section className="status-workspace" aria-live="polite">
        <div className="status-workspace__heading">
          <div>
            <p className="scene-kicker"><Cloud size={14} aria-hidden="true" />Runtime checks</p>
            <h2>Evidence from this browser session</h2>
          </div>
          <button type="button" className="button button--compact" onClick={refresh}>
            <RefreshCw size={15} aria-hidden="true" />Refresh checks
          </button>
        </div>

        {diagnostics && (
          <>
            <div className="status-chip-row">
              <StatusChip ok={diagnostics.releaseMarkerMatches} label="HTML release marker" />
              <StatusChip ok={diagnostics.rootMarkerMatches} label="React root marker" />
              <StatusChip ok={diagnostics.online} label={diagnostics.online ? "Browser online" : "Browser offline"} />
              <StatusChip ok={diagnostics.localStorageAvailable} label="Local library storage" />
              <StatusChip ok={diagnostics.secureContext} label="Secure browser context" />
            </div>

            <div className="status-evidence-grid">
              <article>
                <Wifi size={20} aria-hidden="true" />
                <span>Origin</span>
                <strong>{diagnostics.origin}</strong>
                <p>Current browser origin, not a DNS or global availability guarantee.</p>
              </article>
              <article>
                <Database size={20} aria-hidden="true" />
                <span>Browser-local data</span>
                <strong>{diagnostics.localStorageAvailable ? "Available" : "Unavailable"}</strong>
                <p>Bookmarks, history, preferences, and notes remain local unless a feature explicitly says otherwise.</p>
              </article>
              <article>
                <ShieldCheck size={20} aria-hidden="true" />
                <span>Release markers</span>
                <strong>{diagnostics.releaseMarker} / {diagnostics.rootMarker}</strong>
                <p>Both markers must match the release contract for the current shell.</p>
              </article>
              <article>
                <Cloud size={20} aria-hidden="true" />
                <span>Service worker</span>
                <strong>{diagnostics.serviceWorkerSupported ? (diagnostics.serviceWorkerControlled ? "Controlling" : "Supported") : "Unsupported"}</strong>
                <p>Offline support is an enhancement; the core site must remain usable online without it.</p>
              </article>
            </div>
          </>
        )}

        <div className="status-contract-grid">
          <section>
            <p className="scene-kicker">Production smoke scope</p>
            <h2>Routes checked after deployment</h2>
            <ul>
              {PRODUCTION_SMOKE_ROUTES.map((route) => (
                <li key={route.path}><Link href={route.path}>{route.label}<ExternalLink size={13} aria-hidden="true" /></Link></li>
              ))}
            </ul>
          </section>
          <section>
            <p className="scene-kicker">Machine-readable evidence</p>
            <h2>Public verification endpoints</h2>
            <div className="status-endpoint-list">
              <a href={DIVYANEXUS_RELEASE.healthPath} target="_blank" rel="noreferrer">health.json <ExternalLink size={14} aria-hidden="true" /></a>
              <a href={DIVYANEXUS_RELEASE.releaseEvidencePath} target="_blank" rel="noreferrer">release.json <ExternalLink size={14} aria-hidden="true" /></a>
              <a href="/sitemap.xml" target="_blank" rel="noreferrer">sitemap.xml <ExternalLink size={14} aria-hidden="true" /></a>
              <a href="/.well-known/security.txt" target="_blank" rel="noreferrer">security.txt <ExternalLink size={14} aria-hidden="true" /></a>
            </div>
            <p className="status-boundary">
              `release.json` is generated during deployment and includes the deployed commit. A missing or mismatched file is a release-evidence failure.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
