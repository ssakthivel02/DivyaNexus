/**
 * DivyaNexus audio provides user-initiated synthetic speech for accessible study.
 * It never labels a device voice as a reviewed human recitation.
 */
import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { AudioLines, BookOpenText, ChevronRight, Headphones, Languages, ShieldCheck, Sparkles, Volume2 } from "lucide-react";
import { Link } from "wouter";
import { SpeechControls, type SpeechItem } from "@/components/SpeechControls";
import { ASSETS } from "@/data/content";
import { verifiedScriptureRecords } from "@/data/verifiedScripture";

const listeningRooms = [
  {
    id: "agni",
    recordId: "rig-veda-1-1-1",
    route: "/rig-veda",
    label: "Agni opening verse",
    tamil: "அக்னி தொடக்க மந்திரம்",
    detail: "Hear the verified source text, transliteration, Tamil translation, or English translation using a voice installed on this device.",
    accent: "saffron",
  },
  {
    id: "pusan",
    recordId: "rig-veda-1-42",
    route: "/rig-veda",
    label: "Pūṣan path verse",
    tamil: "பூஷன் வழிகாட்டும் மந்திரம்",
    detail: "Compare the original text with a readable transliteration and bilingual editorial translation.",
    accent: "sky",
  },
  {
    id: "gita",
    recordId: "gita-2-47",
    route: "/bhagavad-gita",
    label: "Gita action verse",
    tamil: "கீதை செயல் வழிகாட்டல்",
    detail: "Listen to the verified Sanskrit text and the clearly labelled Tamil and English editorial translations.",
    accent: "gold",
  },
] as const;

function buildSpeechItems(recordId: string): SpeechItem[] {
  const record = verifiedScriptureRecords[recordId];
  if (!record) return [];

  return [
    {
      id: `${record.id}-tamil`,
      label: "Tamil meaning",
      tamilLabel: "தமிழ் பொருள்",
      text: record.tamilTranslation,
      lang: "ta-IN",
      rate: 0.82,
      sourceLabel: `${record.title} · DivyaNexus Tamil editorial translation`,
    },
    {
      id: `${record.id}-sanskrit`,
      label: "Sanskrit text",
      tamilLabel: "சமஸ்கிருத மூலம்",
      text: record.originalText,
      lang: "sa-IN",
      rate: 0.72,
      sourceLabel: `${record.title} · verified primary text; accents not preserved by device speech`,
    },
    {
      id: `${record.id}-iast`,
      label: "IAST transliteration",
      tamilLabel: "ஒலிப்பெயர்ப்பு",
      text: record.transliteration,
      lang: "en-GB",
      rate: 0.7,
      sourceLabel: `${record.title} · readable Latin transliteration`,
    },
    {
      id: `${record.id}-english`,
      label: "English meaning",
      tamilLabel: "ஆங்கில பொருள்",
      text: record.englishTranslation,
      lang: "en-GB",
      rate: 0.88,
      sourceLabel: `${record.title} · DivyaNexus English editorial translation`,
    },
  ];
}

export default function Audio() {
  const [activeRoom, setActiveRoom] = useState<(typeof listeningRooms)[number]["id"]>("agni");
  const roomRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selected = listeningRooms.find((room) => room.id === activeRoom) ?? listeningRooms[0];
  const record = verifiedScriptureRecords[selected.recordId];
  const speechItems = useMemo(() => buildSpeechItems(selected.recordId), [selected.recordId]);

  const activateRoom = (index: number, moveFocus = false) => {
    const normalisedIndex = (index + listeningRooms.length) % listeningRooms.length;
    setActiveRoom(listeningRooms[normalisedIndex].id);
    if (moveFocus) window.requestAnimationFrame(() => roomRefs.current[normalisedIndex]?.focus());
  };

  const handleRoomKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = index + 1;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = index - 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = listeningRooms.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    activateRoom(nextIndex, true);
  };

  return (
    <main id="main-content" className="page-main audio-cinema audio-cinema--live">
      <section className="audio-cinema__hero">
        <img src={ASSETS.audio} alt="A warm oil lamp illuminating a quiet listening space" fetchPriority="high" />
        <div className="audio-cinema__veil" />
        <div className="audio-cinema__waves" aria-hidden="true"><span /><span /><span /><span /><span /></div>
        <div className="audio-cinema__hero-copy">
          <p className="scene-kicker"><AudioLines size={14} aria-hidden="true" />Working multilingual listening room</p>
          <p className="audio-cinema__tamil" lang="ta">தமிழ், சமஸ்கிருதம், ஆங்கிலம் — கேட்டு படியுங்கள்</p>
          <h1>Read, listen, and compare <em>with context.</em></h1>
          <p>Use a browser-installed voice to hear verified text, readable transliteration, and bilingual editorial translations. Playback starts only after you press Play.</p>
          <div className="audio-cinema__hero-meta">
            <span><Headphones size={14} aria-hidden="true" />User-initiated playback</span>
            <span><BookOpenText size={14} aria-hidden="true" />Visible transcript</span>
            <span><Languages size={14} aria-hidden="true" />Tamil · Sanskrit · English</span>
          </div>
        </div>
      </section>

      <section className="audio-cinema__console" aria-label="Multilingual audio practice">
        <div className="audio-cinema__console-copy">
          <p className="scene-kicker"><Sparkles size={14} aria-hidden="true" />Choose a verified study record</p>
          <h2>A listening tool that now works.</h2>
          <p>Select a source-grounded record, choose the language layer, adjust reading speed, and start synthetic device speech. The text remains visible throughout playback.</p>
          <div className="audio-cinema__room-list" role="tablist" aria-label="Verified study records" aria-orientation="vertical">
            {listeningRooms.map((room, index) => (
              <button
                key={room.id}
                id={`audio-room-tab-${room.id}`}
                ref={(element) => { roomRefs.current[index] = element; }}
                role="tab"
                type="button"
                aria-selected={activeRoom === room.id}
                aria-controls={`audio-room-panel-${room.id}`}
                tabIndex={activeRoom === room.id ? 0 : -1}
                className={activeRoom === room.id ? "is-active" : ""}
                onClick={() => activateRoom(index)}
                onKeyDown={(event) => handleRoomKeyDown(event, index)}
              >
                <span>0{index + 1}</span>
                <div><strong>{room.label}</strong><small lang="ta">{room.tamil}</small></div>
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        <div
          id={`audio-room-panel-${selected.id}`}
          className="audio-cinema__deck audio-cinema__deck--working"
          role="tabpanel"
          aria-labelledby={`audio-room-tab-${selected.id}`}
          data-active-room={selected.id}
        >
          <div className="audio-cinema__deck-top">
            <div>
              <p className="audio-cinema__status">Available now · synthetic device speech</p>
              <h3>{selected.label}</h3>
              <p lang="ta">{selected.tamil}</p>
            </div>
            <span className={`audio-cinema__orb audio-cinema__orb--${selected.accent}`} aria-hidden="true"><Volume2 size={20} /></span>
          </div>
          <p className="audio-cinema__deck-detail">{selected.detail}</p>
          <SpeechControls items={speechItems} title={`Listen to ${record?.title ?? selected.label}`} />
          <div className="audio-cinema__source-card">
            <ShieldCheck size={18} aria-hidden="true" />
            <div>
              <strong>Source and voice boundary</strong>
              <p>The displayed primary text is verified against the linked source. The spoken sound is generated locally by the browser or operating system and is not a reviewed recitation.</p>
              <Link href={`${selected.route}?record=${selected.recordId}`}>Open the full reader <ChevronRight size={14} aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="audio-cinema__collection" aria-labelledby="audio-collection-title">
        <div>
          <p className="scene-kicker"><Headphones size={14} aria-hidden="true" />Listening standards</p>
          <h2 id="audio-collection-title">Useful audio with <em>honest labels.</em></h2>
        </div>
        <div className="audio-cinema__collection-grid">
          <article><span>01</span><h3>Transcript always visible</h3><p>Tamil, Sanskrit, transliteration, and English remain readable while the device voice speaks.</p></article>
          <article><span>02</span><h3>Playback under your control</h3><p>No autoplay. Play, pause, resume, stop, and reading-speed controls remain available.</p></article>
          <article><span>03</span><h3>No false recitation claim</h3><p>Synthetic speech supports accessibility and study; it is not presented as traditional or teacher-reviewed chanting.</p></article>
        </div>
      </section>
    </main>
  );
}
