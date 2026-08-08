"use client";

const KEY = "codeforge.tutor.voice.v1";

export type VoiceSettings = {
  autoSpeak: boolean;
  voiceURI: string; // "" = browser default
  rate: number; // 0.75–1.5
};

const DEFAULTS: VoiceSettings = { autoSpeak: false, voiceURI: "", rate: 1 };

export function loadVoiceSettings(): VoiceSettings {
  if (typeof localStorage === "undefined") return DEFAULTS;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    if (raw && typeof raw === "object") {
      return {
        autoSpeak: !!raw.autoSpeak,
        voiceURI: typeof raw.voiceURI === "string" ? raw.voiceURI : "",
        rate: typeof raw.rate === "number" ? raw.rate : 1,
      };
    }
  } catch {}
  return DEFAULTS;
}

export function saveVoiceSettings(s: VoiceSettings) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
}
