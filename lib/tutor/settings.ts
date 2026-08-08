"use client";
import { DEFAULT_MODELS, type Provider, type TutorSettings } from "./types";

const KEY = "codeforge.tutor.settings.v1";

export function loadSettings(): TutorSettings {
  if (typeof localStorage === "undefined") {
    return { provider: "anthropic", apiKey: "", model: DEFAULT_MODELS.anthropic };
  }
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    if (raw && typeof raw === "object") {
      return {
        provider: raw.provider === "openai" ? "openai" : "anthropic",
        apiKey: typeof raw.apiKey === "string" ? raw.apiKey : "",
        model: typeof raw.model === "string" ? raw.model : DEFAULT_MODELS[raw.provider as Provider] ?? DEFAULT_MODELS.anthropic,
      };
    }
  } catch {}
  return { provider: "anthropic", apiKey: "", model: DEFAULT_MODELS.anthropic };
}

export function saveSettings(s: TutorSettings) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function hasApiKey(): boolean {
  return loadSettings().apiKey.trim().length > 0;
}
