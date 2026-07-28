import { createRoot } from "react-dom/client";
import App from "./App";
import { markApplicationReady } from "./lib/diagnostics";
import "./index.css";
import "./production-wave4.css";
import "./editorial-wave5.css";
import "./quality-wave6.css";
import "./owner-artwork-wave7.css";
import "./readability-wave8.css";
import "./readability-wave8-hardening.css";

createRoot(document.getElementById("root")!).render(<App />);
markApplicationReady();

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    const base = import.meta.env.BASE_URL;
    navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).then((registration) => {
      document.documentElement.dataset.divyanexusServiceWorker = "registered";
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        worker?.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            document.documentElement.dataset.divyanexusUpdate = "available";
          }
        });
      });
    }).catch(() => {
      document.documentElement.dataset.divyanexusServiceWorker = "registration-failed";
      // Offline enhancement is optional; the accessible web experience remains available online.
    });
  });
}
