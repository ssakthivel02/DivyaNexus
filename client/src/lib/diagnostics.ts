import { DIVYANEXUS_RELEASE } from "@/config/release";

export type RuntimeDiagnostics = {
  releaseMarker: string;
  releaseMarkerMatches: boolean;
  rootMarker: string;
  rootMarkerMatches: boolean;
  online: boolean;
  serviceWorkerSupported: boolean;
  serviceWorkerControlled: boolean;
  localStorageAvailable: boolean;
  secureContext: boolean;
  origin: string;
  checkedAt: string;
};

function canUseLocalStorage() {
  try {
    const key = "divyanexus.diagnostics";
    window.localStorage.setItem(key, "ok");
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function collectRuntimeDiagnostics(): RuntimeDiagnostics {
  const releaseMarker = document
    .querySelector<HTMLMetaElement>('meta[name="divyanexus-release"]')
    ?.content.trim() ?? "missing";
  const rootMarker = document.getElementById("root")?.dataset.divyanexusVersion ?? "missing";

  return {
    releaseMarker,
    releaseMarkerMatches: releaseMarker === DIVYANEXUS_RELEASE.id,
    rootMarker,
    rootMarkerMatches: rootMarker === DIVYANEXUS_RELEASE.id,
    online: navigator.onLine,
    serviceWorkerSupported: "serviceWorker" in navigator,
    serviceWorkerControlled: Boolean(navigator.serviceWorker?.controller),
    localStorageAvailable: canUseLocalStorage(),
    secureContext: window.isSecureContext,
    origin: window.location.origin,
    checkedAt: new Date().toISOString(),
  };
}

export function markApplicationReady() {
  document.documentElement.dataset.divyanexusBoot = "ready";
  document.documentElement.dataset.divyanexusRelease = DIVYANEXUS_RELEASE.id;
}
