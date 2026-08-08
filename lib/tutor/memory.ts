"use client";

// Long-term memory: short notes about the learner that persist across
// sessions and are injected into every tutor system prompt, regardless of
// how long (or how recently cleared) the chat history is. This is what lets
// the tutor "remember" things like "already solid on closures, go easy on
// hints there" weeks later, even after the chat transcript has been cleared.

const KEY = "codeforge.tutor.memory.v1";
const MAX_CHARS = 4000; // keeps prompt cost/latency bounded

export function loadMemory(): string {
  if (typeof localStorage === "undefined") return "";
  return localStorage.getItem(KEY) ?? "";
}

export function saveMemory(text: string) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, text.slice(0, MAX_CHARS));
}

export function appendMemory(note: string): string {
  const current = loadMemory();
  const stamp = new Date().toISOString().slice(0, 10);
  const next = (current ? current + "\n" : "") + `[${stamp}] ${note}`.trim();
  const trimmed = next.length > MAX_CHARS ? next.slice(next.length - MAX_CHARS) : next;
  saveMemory(trimmed);
  return trimmed;
}

export function clearMemory() {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(KEY);
}
