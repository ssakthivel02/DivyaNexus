import { useCallback, useEffect, useMemo, useState } from "react";
import { CirclePause, Gauge, Languages, Play, RotateCcw, Square, Volume2 } from "lucide-react";
import { useSpeechSynthesis, type SpeechRequest, type SpeechState } from "@/hooks/useSpeechSynthesis";
import {
  clampSpeechRate,
  readSpeechPreferences,
  writeSpeechPreferences,
  type SpeechPreferences,
} from "@/lib/speechPreferences";

export type SpeechItem = SpeechRequest & {
  id: string;
  label: string;
  tamilLabel?: string;
  sourceLabel?: string;
};

const stateLabels: Record<SpeechState, string> = {
  unsupported: "Not supported",
  loading: "Loading voices",
  ready: "Ready",
  speaking: "Speaking",
  paused: "Paused",
  stopped: "Stopped",
  ended: "Completed",
  error: "Unavailable",
};

export function SpeechControls({
  items,
  title = "Listen with a device voice",
  compact = false,
}: {
  items: SpeechItem[];
  title?: string;
  compact?: boolean;
}) {
  const firstItem = items[0];
  const [preferences, setPreferences] = useState(readSpeechPreferences);
  const [selectedId, setSelectedId] = useState(() => {
    return items.some((item) => item.id === preferences.selectedItemId)
      ? preferences.selectedItemId
      : firstItem?.id ?? "";
  });
  const speech = useSpeechSynthesis();
  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) ?? firstItem,
    [firstItem, items, selectedId],
  );
  const preferredRate = selected?.rate ?? 0.88;
  const [rate, setRate] = useState(() => clampSpeechRate(
    selected ? preferences.rates[selected.id] ?? preferredRate : preferredRate,
    preferredRate,
  ));

  const persist = useCallback((updater: (current: SpeechPreferences) => SpeechPreferences) => {
    setPreferences((current) => writeSpeechPreferences(updater(current)));
  }, []);

  useEffect(() => {
    if (items.some((item) => item.id === selectedId)) return;
    const nextId = items[0]?.id ?? "";
    speech.reset();
    setSelectedId(nextId);
    persist((current) => ({ ...current, selectedItemId: nextId }));
  }, [items, persist, selectedId, speech.reset]);

  useEffect(() => {
    if (!selected) return;
    setRate(clampSpeechRate(preferences.rates[selected.id] ?? preferredRate, preferredRate));
    speech.reset();
  }, [preferredRate, preferences.rates, selected?.id, speech.reset]);

  if (!selected) return null;

  const matchingVoices = speech.voicesForLanguage(selected.lang);
  const selectedVoiceURI = preferences.voices[selected.lang] ?? "";
  const selectedVoice = matchingVoices.find((voice) => voice.voiceURI === selectedVoiceURI);
  const hasMatchingVoice = matchingVoices.length > 0;
  const voiceStatus = !speech.supported
    ? "This browser does not expose speech synthesis. The transcript remains fully available."
    : speech.voicesLoading
      ? "The browser voice list is loading."
      : speech.activeVoice
        ? `Voice: ${speech.activeVoice}`
        : selectedVoice
          ? `Selected voice: ${selectedVoice.name}.`
          : hasMatchingVoice
            ? `${matchingVoices.length} matching ${selected.lang} voice${matchingVoices.length === 1 ? " is" : "s are"} available.`
            : `No matching ${selected.lang} voice was reported; the browser may use a fallback voice.`;

  const play = () => speech.speak({
    text: selected.text,
    lang: selected.lang,
    rate,
    pitch: selected.pitch,
    voiceURI: selectedVoiceURI || undefined,
  });

  const selectItem = (item: SpeechItem) => {
    speech.reset();
    setSelectedId(item.id);
    const nextRate = clampSpeechRate(preferences.rates[item.id] ?? item.rate ?? 0.88, item.rate ?? 0.88);
    setRate(nextRate);
    persist((current) => ({ ...current, selectedItemId: item.id }));
  };

  const updateRate = (nextValue: number) => {
    const nextRate = clampSpeechRate(nextValue, preferredRate);
    setRate(nextRate);
    persist((current) => ({ ...current, rates: { ...current.rates, [selected.id]: nextRate } }));
  };

  const updateVoice = (voiceURI: string) => {
    speech.reset();
    persist((current) => ({
      ...current,
      voices: { ...current.voices, [selected.lang]: voiceURI },
    }));
  };

  const playbackBusy = speech.state === "speaking" || speech.state === "paused";
  const playDisabled = !speech.supported || speech.voicesLoading || playbackBusy;

  return (
    <section
      className={`speech-controls ${compact ? "speech-controls--compact" : ""}`}
      aria-label={title}
      aria-busy={speech.voicesLoading}
      data-speech-state={speech.state}
    >
      <div className="speech-controls__heading">
        <div>
          <p className="scene-kicker"><Languages size={14} aria-hidden="true" />On-device speech</p>
          <h3>{title}</h3>
        </div>
        <span className={`speech-controls__status is-${speech.state}`} role="status" aria-live="polite" aria-atomic="true">
          {stateLabels[speech.state]}
        </span>
      </div>

      <div className="speech-controls__languages" role="radiogroup" aria-label="Choose text and language">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={item.id === selected.id}
            className={item.id === selected.id ? "is-active" : ""}
            onClick={() => selectItem(item)}
          >
            <strong>{item.label}</strong>
            {item.tamilLabel && <span lang="ta">{item.tamilLabel}</span>}
          </button>
        ))}
      </div>

      <div className="speech-controls__transcript" lang={selected.lang.startsWith("ta") ? "ta" : selected.lang.startsWith("sa") ? "sa" : "en"}>
        <span>{selected.sourceLabel ?? "Selected text"}</span>
        <p>{selected.text}</p>
      </div>

      {matchingVoices.length > 1 && (
        <label className="speech-controls__voice-select">
          <span><Volume2 size={15} aria-hidden="true" />Device voice</span>
          <select value={selectedVoiceURI} onChange={(event) => updateVoice(event.target.value)}>
            <option value="">Automatic matching voice</option>
            {matchingVoices.map((voice) => (
              <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name} · {voice.lang}{voice.default ? " · default" : ""}</option>
            ))}
          </select>
        </label>
      )}

      {!speech.supported && (
        <p className="speech-controls__unsupported" role="note">
          Audio is unavailable in this browser. You can still read, copy, and study the complete visible transcript.
        </p>
      )}

      <div className="speech-controls__actions">
        <button type="button" className="button button--primary" onClick={play} disabled={playDisabled}>
          <Play size={16} aria-hidden="true" />{speech.state === "ended" || speech.state === "stopped" ? "Play again" : "Play"}
        </button>
        {speech.state === "speaking" ? (
          <button type="button" className="button" onClick={speech.pause}><CirclePause size={16} aria-hidden="true" />Pause</button>
        ) : speech.state === "paused" ? (
          <button type="button" className="button" onClick={speech.resume}><Play size={16} aria-hidden="true" />Resume</button>
        ) : null}
        <button type="button" className="button" onClick={speech.stop} disabled={!playbackBusy}><Square size={15} aria-hidden="true" />Stop</button>
        <button type="button" className="button button--quiet" onClick={() => updateRate(preferredRate)}><RotateCcw size={15} aria-hidden="true" />Reset speed</button>
      </div>

      <label className="speech-controls__rate">
        <span><Gauge size={15} aria-hidden="true" />Reading speed <strong>{rate.toFixed(2)}×</strong></span>
        <input
          type="range"
          min="0.55"
          max="1.2"
          step="0.01"
          value={rate}
          aria-label={`Reading speed for ${selected.label}`}
          aria-valuetext={`${rate.toFixed(2)} times normal speed`}
          onChange={(event) => updateRate(Number(event.target.value))}
        />
      </label>

      <p className="speech-controls__boundary">
        No autoplay. This is synthetic speech generated by the voice installed on this device. It is not a reviewed human recitation and does not preserve Vedic accents.
      </p>
      <p className="speech-controls__voice">{voiceStatus}</p>
      {speech.error && <p className="speech-controls__error" role="alert">{speech.error}</p>}
    </section>
  );
}
