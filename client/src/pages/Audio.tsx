/**
 * DivyaNexus Audio: browser speech provides an immediately usable listening aid while
 * remaining clearly distinguished from reviewed human recitation or pronunciation recordings.
 */
import { useEffect, useMemo, useState } from "react";
import { AudioLines, BookOpenText, ChevronRight, CirclePause, Headphones, ListMusic, Play, Sparkles, Square, Volume2 } from "lucide-react";
import { Link } from "wouter";
import { ASSETS } from "@/data/content";

const listeningRooms = [
  {
    id: "dawn",
    label: "Dawn study",
    tamil: "வைகறை வாசிப்பு",
    detail: "A calm bilingual orientation for beginning a study session.",
    tamilSpeech: "வணக்கம். திவ்யநெக்சஸ் வைகறை வாசிப்புக்கு வரவேற்கிறது. இன்று ஒரு சிறிய பகுதியை மெதுவாக வாசித்து அதன் ஆதாரத்தையும் பொருளையும் ஆராயுங்கள்.",
    englishSpeech: "Welcome to the DivyaNexus dawn study. Read one short passage slowly, then explore its source and meaning.",
    accent: "saffron",
  },
  {
    id: "pronunciation",
    label: "Tamil reading guide",
    tamil: "தமிழ் வாசிப்பு வழிகாட்டி",
    detail: "Browser-generated Tamil speech for accessibility and reading support. It is not a reviewed human pronunciation recording.",
    tamilSpeech: "தமிழ் சொற்களை தெளிவாகவும் மெதுவாகவும் வாசிக்க முயலுங்கள். எழுத்தையும் பொருளையும் ஒன்றாகப் பார்த்து பயிற்சி செய்யுங்கள்.",
    englishSpeech: "Use this browser-generated voice only as a reading aid. A reviewed human pronunciation recording has not yet been published.",
    accent: "sky",
  },
  {
    id: "temple",
    label: "Temple pathways",
    tamil: "கோவில் பயணம்",
    detail: "A bilingual orientation before exploring temple history, worship traditions, travel context and source notes.",
    tamilSpeech: "கோவில் பயணத்தைத் தொடங்குவதற்கு முன் அதன் வரலாறு, வழிபாட்டு மரபு, பயணத் தகவல் மற்றும் ஆதாரக் குறிப்புகளைப் பாருங்கள்.",
    englishSpeech: "Before beginning a temple pathway, review its history, worship tradition, travel context and source notes.",
    accent: "gold",
  },
] as const;

type RoomId = (typeof listeningRooms)[number]["id"];
type SpeechLanguage = "ta-IN" | "en-GB";

export default function Audio() {
  const [activeRoom, setActiveRoom] = useState<RoomId>("dawn");
  const [detailOpen, setDetailOpen] = useState(true);
  const [speechLanguage, setSpeechLanguage] = useState<SpeechLanguage>("ta-IN");
  const [rate, setRate] = useState(0.82);
  const [speaking, setSpeaking] = useState(false);
  const [speechStatus, setSpeechStatus] = useState("Ready to play browser-generated speech.");
  const selected = listeningRooms.find((room) => room.id === activeRoom) ?? listeningRooms[0];
  const speechSupported = typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  const speechText = useMemo(() => speechLanguage === "ta-IN" ? selected.tamilSpeech : selected.englishSpeech, [selected, speechLanguage]);

  const stopSpeech = () => {
    if (speechSupported) window.speechSynthesis.cancel();
    setSpeaking(false);
    setSpeechStatus("Playback stopped.");
  };

  const playSpeech = () => {
    if (!speechSupported) {
      setSpeechStatus("This browser does not provide speech synthesis. The visible transcript remains available.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = speechLanguage;
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onstart = () => {
      setSpeaking(true);
      setSpeechStatus(`Playing ${speechLanguage === "ta-IN" ? "Tamil" : "English"} browser-generated speech.`);
    };
    utterance.onend = () => {
      setSpeaking(false);
      setSpeechStatus("Playback completed.");
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setSpeechStatus("Speech playback could not start. Try another installed browser voice or read the visible transcript.");
    };
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => () => {
    if (speechSupported) window.speechSynthesis.cancel();
  }, [speechSupported]);

  useEffect(() => {
    if (speaking) stopSpeech();
    setSpeechStatus("Ready to play browser-generated speech.");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRoom, speechLanguage]);

  return <main id="main-content" className="page-main audio-cinema audio-cinema--wave8">
    <section className="audio-cinema__hero">
      <img src={ASSETS.audio} alt="A warm oil lamp illuminating a quiet listening space" fetchPriority="high" />
      <div className="audio-cinema__veil" />
      <div className="audio-cinema__waves" aria-hidden="true"><span /><span /><span /><span /><span /></div>
      <div className="audio-cinema__hero-copy">
        <p className="scene-kicker"><AudioLines size={14} aria-hidden="true" />Accessible listening room</p>
        <p className="audio-cinema__tamil" lang="ta">எழுத்தைப் பார்த்து, ஒலியைக் கேட்டு, பொருளை அறியுங்கள்</p>
        <h1>Listen, read and understand—with <em>clear boundaries.</em></h1>
        <p>Use browser-generated Tamil or English speech as an accessibility and reading aid. It is not presented as verified recitation, traditional chanting or a reviewed human pronunciation recording.</p>
        <div className="audio-cinema__hero-meta"><span><Headphones size={14} aria-hidden="true" />User-initiated playback</span><span><BookOpenText size={14} aria-hidden="true" />Visible transcript</span><span><Volume2 size={14} aria-hidden="true" />Tamil and English</span></div>
      </div>
    </section>

    <section className="audio-cinema__console" aria-label="Audio reading experience">
      <div className="audio-cinema__console-copy">
        <p className="scene-kicker"><Sparkles size={14} aria-hidden="true" />Choose a listening direction</p>
        <h2>A working listening aid, without pretending it is a reviewed recording.</h2>
        <p>Select a room, choose Tamil or English, adjust the speed and start playback. The transcript remains visible for reading and verification.</p>
        <div className="audio-cinema__room-list" role="tablist" aria-label="Listening directions">
          {listeningRooms.map((room, index) => <button key={room.id} role="tab" aria-selected={activeRoom === room.id} className={activeRoom === room.id ? "is-active" : ""} onClick={() => setActiveRoom(room.id)}><span>0{index + 1}</span><div><strong>{room.label}</strong><small lang="ta">{room.tamil}</small></div><ChevronRight size={16} aria-hidden="true" /></button>)}
        </div>
      </div>

      <div className="audio-cinema__deck" aria-live="polite">
        <div className="audio-cinema__deck-top"><div><p className="audio-cinema__status">Browser speech · accessibility aid</p><h3>{selected.label}</h3><p lang="ta">{selected.tamil}</p></div><span className={`audio-cinema__orb audio-cinema__orb--${selected.accent}`} aria-hidden="true"><AudioLines size={20} /></span></div>
        <div className={`audio-cinema__waveform ${speaking ? "is-playing" : ""}`} aria-label={speaking ? "Speech playback active" : "Speech playback ready"} role="img">{Array.from({ length: 42 }, (_, index) => <i key={index} style={{ height: `${22 + ((index * 17) % 55)}%` }} />)}</div>
        <p className="audio-cinema__deck-detail">{selected.detail}</p>

        <div className="audio-wave8__language" role="group" aria-label="Speech language">
          <button type="button" className={speechLanguage === "ta-IN" ? "is-active" : ""} aria-pressed={speechLanguage === "ta-IN"} onClick={() => setSpeechLanguage("ta-IN")}>தமிழ்</button>
          <button type="button" className={speechLanguage === "en-GB" ? "is-active" : ""} aria-pressed={speechLanguage === "en-GB"} onClick={() => setSpeechLanguage("en-GB")}>English</button>
        </div>

        <label className="audio-wave8__rate">Reading speed <strong>{rate.toFixed(2)}×</strong><input type="range" min="0.6" max="1.15" step="0.05" value={rate} onChange={(event) => setRate(Number(event.target.value))} /></label>

        <div className="audio-cinema__deck-controls">
          <button className="audio-wave8__play" type="button" onClick={speaking ? stopSpeech : playSpeech} disabled={!speechSupported}>
            {speaking ? <Square size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}{speaking ? "Stop" : "Play reading aid"}
          </button>
          <button className="audio-cinema__metadata-button" onClick={() => setDetailOpen((open) => !open)} aria-expanded={detailOpen}><ListMusic size={16} aria-hidden="true" />{detailOpen ? "Hide details" : "Show details"}</button>
        </div>
        <p className="audio-wave8__status" role="status">{speechStatus}</p>

        <div className="audio-wave8__transcript">
          <p className="scene-kicker">Visible transcript</p>
          <p lang={speechLanguage === "ta-IN" ? "ta" : "en"}>{speechText}</p>
        </div>

        {detailOpen && <div className="audio-cinema__preparation"><p><strong>Important:</strong> playback uses a voice installed by your browser or operating system. Voice quality and Tamil pronunciation vary by device. Reviewed human recordings still require a named speaker, transcript, pronunciation review, rights record and source attachment.</p><Link href="/sources">Read the source method <ChevronRight size={14} aria-hidden="true" /></Link></div>}
      </div>
    </section>

    <section className="audio-cinema__collection" aria-labelledby="audio-collection-title">
      <div><p className="scene-kicker"><Headphones size={14} aria-hidden="true" />Listening standard</p><h2 id="audio-collection-title">Text, meaning and audio remain <em>separate and explicit.</em></h2></div>
      <div className="audio-cinema__collection-grid">
        <article><span>01</span><h3>Browser speech</h3><p>Available now as an accessibility aid, generated locally by the browser after the user presses Play.</p></article>
        <article><span>02</span><h3>Reviewed recordings</h3><p>Future human recordings must include transcript, pronunciation review, source context, speaker identity and rights status.</p></article>
        <article><span>03</span><h3>No autoplay</h3><p>Devotional and educational audio begins only after a deliberate user action and can be stopped immediately.</p></article>
      </div>
    </section>
  </main>;
}
