/**
 * Divine Observatory Cinema: Audio is a ceremonial listening room, not an empty disabled player.
 * Warm lamp imagery, waveform geometry, provenance labels, and compact interactions preserve the brand's source-first ethos.
 */
import { useState } from "react";
import { AudioLines, BookOpenText, ChevronRight, CirclePause, Headphones, ListMusic, Play, Sparkles, Volume2 } from "lucide-react";
import { Link } from "wouter";
import { ASSETS } from "@/data/content";

const listeningRooms = [
  { id: "dawn", label: "Dawn study", tamil: "வைகறை வாசிப்பு", detail: "A future, source-linked sequence for a calm beginning.", accent: "saffron" },
  { id: "pronunciation", label: "Tamil pronunciation", tamil: "உச்சரிப்பு வழிகாட்டி", detail: "Planned recordings will pair a reviewed voice with visible text.", accent: "sky" },
  { id: "temple", label: "Temple pathways", tamil: "கோவில் பயணம்", detail: "Future ambience will always show its recording context and rights status.", accent: "gold" },
] as const;

export default function Audio() {
  const [activeRoom, setActiveRoom] = useState<(typeof listeningRooms)[number]["id"]>("dawn");
  const [detailOpen, setDetailOpen] = useState(false);
  const selected = listeningRooms.find((room) => room.id === activeRoom) ?? listeningRooms[0];

  return <main id="main-content" className="page-main audio-cinema">
    <section className="audio-cinema__hero">
      <img src={ASSETS.audio} alt="A warm oil lamp illuminating a quiet listening space" fetchPriority="high" />
      <div className="audio-cinema__veil" />
      <div className="audio-cinema__waves" aria-hidden="true"><span /><span /><span /><span /><span /></div>
      <div className="audio-cinema__hero-copy">
        <p className="scene-kicker"><AudioLines size={14} aria-hidden="true" />Ceremonial listening room</p>
        <p className="audio-cinema__tamil" lang="ta">ஒலிக்கு முன் அதன் ஆதாரத்தை அறியுங்கள்</p>
        <h1>Listening begins with <em>context.</em></h1>
        <p>Prepare a path for recitation, pronunciation, and reflection while keeping recording provenance, transcript status, and rights information visible before playback exists.</p>
        <div className="audio-cinema__hero-meta"><span><Headphones size={14} aria-hidden="true" />No autoplay</span><span><BookOpenText size={14} aria-hidden="true" />Source context first</span><span><Volume2 size={14} aria-hidden="true" />Compact player ready</span></div>
      </div>
    </section>

    <section className="audio-cinema__console" aria-label="Audio experience preview">
      <div className="audio-cinema__console-copy">
        <p className="scene-kicker"><Sparkles size={14} aria-hidden="true" />Choose a listening direction</p>
        <h2>A small invitation, never a blocked page.</h2>
        <p>There is no verified recording selected in this Stage B experience. Instead of presenting a large disabled player, choose a future listening room to see the preparation standard it will follow.</p>
        <div className="audio-cinema__room-list" role="tablist" aria-label="Listening directions">
          {listeningRooms.map((room, index) => <button key={room.id} role="tab" aria-selected={activeRoom === room.id} className={activeRoom === room.id ? "is-active" : ""} onClick={() => setActiveRoom(room.id)}><span>0{index + 1}</span><div><strong>{room.label}</strong><small lang="ta">{room.tamil}</small></div><ChevronRight size={16} aria-hidden="true" /></button>)}
        </div>
      </div>
      <div className="audio-cinema__deck" aria-live="polite">
        <div className="audio-cinema__deck-top"><div><p className="audio-cinema__status">Preparation view · no audio delivered</p><h3>{selected.label}</h3><p lang="ta">{selected.tamil}</p></div><span className={`audio-cinema__orb audio-cinema__orb--${selected.accent}`} aria-hidden="true"><AudioLines size={20} /></span></div>
        <div className="audio-cinema__waveform" aria-label="Future waveform preview" role="img">{Array.from({ length: 42 }, (_, index) => <i key={index} style={{ height: `${22 + ((index * 17) % 55)}%` }} />)}</div>
        <p className="audio-cinema__deck-detail">{selected.detail}</p>
        <div className="audio-cinema__deck-controls"><button className="audio-cinema__metadata-button" onClick={() => setDetailOpen((open) => !open)} aria-expanded={detailOpen}><ListMusic size={16} aria-hidden="true" />{detailOpen ? "Hide preparation" : "View preparation"}</button><button className="audio-cinema__inactive-control" aria-label="Playback is unavailable until a reviewed recording is added" title="Playback will become available only when a reviewed recording is published"><CirclePause size={17} aria-hidden="true" />No playback yet</button></div>
        {detailOpen && <div className="audio-cinema__preparation"><p><strong>Required before publication:</strong> reviewed recording, transcript, pronunciation notes, rights record, source attachment, and a non-autoplay playback setting.</p><Link href="/sources">Read the source method <ChevronRight size={14} aria-hidden="true" /></Link></div>}
      </div>
    </section>

    <section className="audio-cinema__collection" aria-labelledby="audio-collection-title">
      <div><p className="scene-kicker"><Headphones size={14} aria-hidden="true" />Prepared library</p><h2 id="audio-collection-title">A listening library built with <em>careful gaps.</em></h2></div>
      <div className="audio-cinema__collection-grid">
        <article><span>01</span><h3>Recitation context</h3><p>Every future track will identify whether it is recitation, a translation reading, commentary, or guided reflection.</p></article>
        <article><span>02</span><h3>Transcript & pronunciation</h3><p>Text, transliteration, and pronunciation cues are planned as companion layers—not decorative metadata.</p></article>
        <article><span>03</span><h3>Continue respectfully</h3><p>When audio is available, browser-local progress can resume without making devotional content autoplay.</p></article>
      </div>
    </section>
  </main>;
}
