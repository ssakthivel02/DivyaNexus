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
    const frame = window.requestAnimationFrame(() => {
      const main = document.getElementById("main-content");
      if (main) {
        if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
        main.focus({ preventScroll: true });
      }
      if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(frame);
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
