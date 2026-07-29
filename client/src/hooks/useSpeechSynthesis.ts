import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { clampSpeechRate, type SpeechLanguage } from "@/lib/speechPreferences";

export type SpeechRequest = {
  text: string;
  lang: SpeechLanguage;
  rate?: number;
  pitch?: number;
  voiceURI?: string;
};

export type SpeechState =
  | "unsupported"
  | "loading"
  | "ready"
  | "speaking"
  | "paused"
  | "stopped"
  | "ended"
  | "error";

export function selectSpeechVoice(
  voices: SpeechSynthesisVoice[],
  language: SpeechLanguage,
  preferredVoiceURI?: string,
) {
  if (preferredVoiceURI) {
    const preferred = voices.find((voice) => voice.voiceURI === preferredVoiceURI);
    if (preferred) return preferred;
  }

  const normalisedLanguage = language.toLowerCase();
  const exact = voices.find((voice) => voice.lang.toLowerCase() === normalisedLanguage);
  if (exact) return exact;

  const languagePrefix = language.split("-")[0].toLowerCase();
  return voices.find((voice) => voice.lang.toLowerCase().startsWith(languagePrefix)) ?? null;
}

export function useSpeechSynthesis() {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [state, setState] = useState<SpeechState>(supported ? "loading" : "unsupported");
  const [activeVoice, setActiveVoice] = useState<string>("");
  const [error, setError] = useState<string>("");
  const generationRef = useRef(0);
  const lastStartRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    if (!supported) {
      setState("unsupported");
      return () => { mountedRef.current = false; };
    }

    const settleReady = () => setState((current) => current === "speaking" || current === "paused" ? current : "ready");
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
      settleReady();
    };

    loadVoices();
    const fallbackTimer = window.setTimeout(settleReady, 900);
    window.speechSynthesis.addEventListener?.("voiceschanged", loadVoices);

    return () => {
      mountedRef.current = false;
      generationRef.current += 1;
      window.clearTimeout(fallbackTimer);
      window.speechSynthesis.removeEventListener?.("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, [supported]);

  const cancelTo = useCallback((nextState: SpeechState) => {
    generationRef.current += 1;
    if (supported) window.speechSynthesis.cancel();
    setError("");
    setActiveVoice("");
    setState(supported ? nextState : "unsupported");
  }, [supported]);

  const stop = useCallback(() => cancelTo("stopped"), [cancelTo]);
  const reset = useCallback(() => cancelTo("ready"), [cancelTo]);

  const speak = useCallback((request: SpeechRequest) => {
    if (!supported) {
      setError("Speech synthesis is not available in this browser. Use the visible transcript instead.");
      setState("unsupported");
      return false;
    }

    const text = request.text.trim();
    if (!text) {
      setError("There is no readable text selected for speech.");
      setState("error");
      return false;
    }

    const now = Date.now();
    if (now - lastStartRef.current < 220 && (state === "speaking" || state === "paused")) return false;
    lastStartRef.current = now;

    const generation = generationRef.current + 1;
    generationRef.current = generation;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = request.lang;
    utterance.rate = clampSpeechRate(request.rate ?? 0.9, 0.9);
    utterance.pitch = Math.min(1.25, Math.max(0.75, request.pitch ?? 1));

    const selectedVoice = selectSpeechVoice(voices, request.lang, request.voiceURI);
    if (selectedVoice) utterance.voice = selectedVoice;
    setActiveVoice(selectedVoice?.name ?? `Browser default for ${request.lang}`);
    setError("");
    setState("ready");

    const updateIfCurrent = (callback: () => void) => {
      if (mountedRef.current && generationRef.current === generation) callback();
    };

    utterance.onstart = () => updateIfCurrent(() => setState("speaking"));
    utterance.onpause = () => updateIfCurrent(() => setState("paused"));
    utterance.onresume = () => updateIfCurrent(() => setState("speaking"));
    utterance.onend = () => updateIfCurrent(() => setState("ended"));
    utterance.onerror = (event) => updateIfCurrent(() => {
      if (event.error === "canceled" || event.error === "interrupted") {
        setState("stopped");
        return;
      }
      setError(`Speech could not start: ${event.error}. The transcript remains available.`);
      setState("error");
    });

    window.speechSynthesis.speak(utterance);
    return true;
  }, [state, supported, voices]);

  const pause = useCallback(() => {
    if (!supported || !window.speechSynthesis.speaking || window.speechSynthesis.paused) return;
    window.speechSynthesis.pause();
    setState("paused");
  }, [supported]);

  const resume = useCallback(() => {
    if (!supported || !window.speechSynthesis.paused) return;
    window.speechSynthesis.resume();
    setState("speaking");
  }, [supported]);

  const voicesForLanguage = useCallback((language: SpeechLanguage) => {
    const prefix = language.split("-")[0].toLowerCase();
    return voices.filter((voice) => voice.lang.toLowerCase().startsWith(prefix));
  }, [voices]);

  const availableLanguages = useMemo(() => new Set(voices.map((voice) => voice.lang.toLowerCase())), [voices]);

  return {
    supported,
    voices,
    voicesLoading: supported && state === "loading",
    availableLanguages,
    state,
    activeVoice,
    error,
    speak,
    pause,
    resume,
    stop,
    reset,
    voicesForLanguage,
  };
}
