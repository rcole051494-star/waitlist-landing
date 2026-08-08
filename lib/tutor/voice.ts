"use client";

// Push-to-talk voice for the tutor, built entirely on browser APIs — no
// extra API calls, no cost, no new dependencies. Speech-to-text uses the
// Web Speech API (Chrome/Edge desktop; unsupported in Safari and most
// WebViews, including the Capacitor Android build — the mic button hides
// itself when unavailable). Text-to-speech uses SpeechSynthesis, which has
// much broader support including most Android WebViews.

export function isSTTSupported(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition;
}

export function isTTSSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export type Recognizer = {
  start: () => void;
  stop: () => void;
  abort: () => void;
};

export function createRecognizer(handlers: {
  onInterim: (text: string) => void;
  onFinal: (text: string) => void;
  onEnd: () => void;
  onError: (message: string) => void;
}): Recognizer | null {
  const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!Ctor) {
    handlers.onError("Speech recognition isn't supported in this browser.");
    return null;
  }
  const rec = new Ctor();
  rec.continuous = false;
  rec.interimResults = true;
  rec.lang = "en-US";
  rec.maxAlternatives = 1;

  let finalTranscript = "";

  rec.onresult = (event: any) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const res = event.results[i];
      if (res.isFinal) finalTranscript += res[0].transcript;
      else interim += res[0].transcript;
    }
    handlers.onInterim((finalTranscript + interim).trim());
  };
  rec.onerror = (event: any) => {
    const msg =
      event.error === "not-allowed" || event.error === "permission-denied"
        ? "Microphone permission denied — allow mic access to use voice input."
        : event.error === "no-speech"
        ? "Didn't catch that — no speech detected."
        : `Speech recognition error: ${event.error}`;
    handlers.onError(msg);
  };
  rec.onend = () => {
    if (finalTranscript.trim()) handlers.onFinal(finalTranscript.trim());
    handlers.onEnd();
  };

  return {
    start: () => {
      finalTranscript = "";
      try {
        rec.start();
      } catch {
        // start() throws if already started — ignore, onend will fire naturally
      }
    },
    stop: () => rec.stop(),
    abort: () => rec.abort(),
  };
}

// Strips markdown so spoken replies don't include literal asterisks,
// backticks, or code-fence noise.
export function sanitizeForSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " Code shown above. ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/[_*#>]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function speak(text: string, opts?: { voiceURI?: string; rate?: number }) {
  if (!isTTSSupported()) return;
  stopSpeaking();
  const utter = new SpeechSynthesisUtterance(sanitizeForSpeech(text));
  utter.rate = opts?.rate ?? 1;
  if (opts?.voiceURI) {
    const voice = window.speechSynthesis.getVoices().find((v) => v.voiceURI === opts.voiceURI);
    if (voice) utter.voice = voice;
  }
  window.speechSynthesis.speak(utter);
}

export function stopSpeaking() {
  if (isTTSSupported()) window.speechSynthesis.cancel();
}

export function getVoices(): SpeechSynthesisVoice[] {
  if (!isTTSSupported()) return [];
  return window.speechSynthesis.getVoices();
}

// Voices load asynchronously in some browsers — call the callback once
// they're ready (or immediately if already loaded). Returns an unsubscribe fn.
export function onVoicesChanged(cb: () => void): () => void {
  if (!isTTSSupported()) return () => {};
  window.speechSynthesis.addEventListener("voiceschanged", cb);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", cb);
}
