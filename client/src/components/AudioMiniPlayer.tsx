/**
 * Divine Observatory Cinema: a compact audio launcher that expands only after intent.
 * Its sheet is safe-area-aware and never pretends an unverified recording can be played.
 */
import { Link } from "wouter";
import { AudioLines, ChevronDown, ListMusic, Volume2, X } from "lucide-react";
import { useState } from "react";

export function AudioMiniPlayer() {
  const [open, setOpen] = useState(false);
  return (
    <aside className={`audio-mini-player ${open ? "is-open" : ""}`} aria-label="Audio launcher">
      <button className="audio-mini-player__handle" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="audio-mini-sheet"><AudioLines size={16} aria-hidden="true" /><span>{open ? "Close audio" : "Audio & chants"}</span><ChevronDown size={16} aria-hidden="true" /></button>
      <div id="audio-mini-sheet" className="audio-mini-player__panel" aria-hidden={!open}>
        <button className="audio-mini-player__close" onClick={() => setOpen(false)} aria-label="Close audio launcher"><X size={17} aria-hidden="true" /></button>
        <div className="audio-mini-player__orb"><Volume2 size={18} aria-hidden="true" /></div>
        <div><p className="scene-kicker">Audio experience</p><strong>Choose a reviewed recording.</strong><p>Audio never starts automatically. Select a verified source when a recording is available.</p></div>
        <Link href="/audio" className="audio-mini-player__queue" onClick={() => setOpen(false)}><ListMusic size={16} aria-hidden="true" />Open audio library</Link>
      </div>
    </aside>
  );
}
