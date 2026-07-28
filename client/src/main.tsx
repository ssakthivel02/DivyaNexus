import { createRoot } from "react-dom/client";
import App from "./App";
import { markApplicationReady } from "./lib/diagnostics";
import "./index.css";
import "./production-wave4.css";
import "./editorial-wave5.css";

createRoot(document.getElementById("root")!).render(<App />);
markApplicationReady();

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    const base = import.meta.env.BASE_URL;
    navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).catch(() => {
      document.documentElement.dataset.divyanexusServiceWorker = "registration-failed";
      // Offline enhancement is optional; the accessible web experience remains available online.
    });
  });
}
