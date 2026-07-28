import { useEffect, useState } from "react";
import { ArrowUp, WifiOff } from "lucide-react";
import { useLocation } from "wouter";
import { resolveRouteMeta } from "@/config/routeMeta";

export function RouteExperience() {
  const [location] = useLocation();
  const [online, setOnline] = useState(() => navigator.onLine);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const updateOnline = () => setOnline(navigator.onLine);
    const updateScroll = () => setShowBackToTop(window.scrollY > 720);
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
      window.removeEventListener("scroll", updateScroll);
    };
  }, []);

  useEffect(() => {
    const meta = resolveRouteMeta(location);
    setAnnouncement(`${meta.label} page loaded`);
    if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    let interval = 0;
    let frame = 0;
    let attempts = 0;
    let lastMain: HTMLElement | null = null;
    let stableChecks = 0;

    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        attempts += 1;
        const loading = document.querySelector(".route-loading");
        const main = document.getElementById("main-content");

        if (!loading && main) {
          if (main === lastMain) stableChecks += 1;
          else {
            lastMain = main;
            stableChecks = 0;
          }

          if (stableChecks >= 1) {
            if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
            frame = window.requestAnimationFrame(() => main.focus({ preventScroll: true }));
            window.clearInterval(interval);
          }
        } else {
          lastMain = null;
          stableChecks = 0;
        }

        if (attempts >= 200) window.clearInterval(interval);
      }, 50);
    }, 100);

    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
      window.cancelAnimationFrame(frame);
    };
  }, [location]);

  return (
    <>
      <p className="route-announcer" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
      {!online && (
        <div className="network-status-banner" role="status">
          <WifiOff size={16} aria-hidden="true" />
          <span>You are offline. Previously opened pages and cached assets may still be available.</span>
        </div>
      )}
      {showBackToTop && (
        <button
          type="button"
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          <ArrowUp size={18} aria-hidden="true" />
        </button>
      )}
    </>
  );
}
