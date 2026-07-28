import { useCallback, useEffect, useMemo, useState } from "react";

export type SpeechRequest = {
  text: string;
  lang: "ta-IN" | "en-GB" | "sa-IN";
  rate?: number;
  pitch?: number;
};

export type SpeechState = "idle" | "speaking" | "paused" | "ended" | "error";

function chooseVoice(voices: SpeechSynthesisVoice[], language: SpeechRequest["lang"]) {
  const exact = voices.find((voice) => voice.lang.toLowerCase() === language.toLowerCase());
  if (exact) return exact;

  const languagePrefix = language.split("-")[0].toLowerCase();
  return voices.find((voice) => voice.lang.toLowerCase().startsWith(languagePrefix)) ?? null;
}

export function useSpeechSynthesis() {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [state, setState] = useState<SpeechState>("idle");
  const [activeVoice, setActiveVoice] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!supported) return undefined;

    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.addEventListener?.("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener?.("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setState("idle");
  }, [supported]);

  const speak = useCallback((request: SpeechRequest) => {
    if (!supported || !request.text.trim()) {
      setError("Speech is not available in this browser.");
      setState("error");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(request.text.trim());
    utterance.lang = request.lang;
    utterance.rate = Math.min(1.35, Math.max(0.55, request.rate ?? 0.9));
    utterance.pitch = Math.min(1.25, Math.max(0.75, request.pitch ?? 1));

    const selectedVoice = chooseVoice(voices, request.lang);
    if (selectedVoice) utterance.voice = selectedVoice;
    setActiveVoice(selectedVoice?.name ?? `Browser default for ${request.lang}`);
    setError("");

    utterance.onstart = () => setState("speaking");
    utterance.onpause = () => setState("paused");
    utterance.onresume = () => setState("speaking");
    utterance.onend = () => setState("ended");
    utterance.onerror = (event) => {
      if (event.error === "canceled" || event.error === "interrupted") return;
      setError(`Speech could not start: ${event.error}.`);
      setState("error");
    };

    window.speechSynthesis.speak(utterance);
  }, [supported, voices]);

  const pause = useCallback(() => {
    if (!supported || !window.speechSynthesis.speaking) return;
    window.speechSynthesis.pause();
    setState("paused");
  }, [supported]);

  const resume = useCallback(() => {
    if (!supported || !window.speechSynthesis.paused) return;
    window.speechSynthesis.resume();
    setState("speaking");
  }, [supported]);

  const availableLanguages = useMemo(() => new Set(voices.map((voice) => voice.lang.toLowerCase())), [voices]);

  return {
    supported,
    voices,
    availableLanguages,
    state,
    activeVoice,
    error,
    speak,
    pause,
    resume,
    stop,
  };
}
