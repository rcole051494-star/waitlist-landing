"use client";

// Lightweight SM-2 spaced repetition, per-concept.
// Grade 0 = again, 3 = hard, 4 = good, 5 = easy.

export type Grade = 0 | 3 | 4 | 5;

export type SrsCard = {
  id: string; // concept id, e.g. "py.functions.args"
  ease: number; // easiness factor
  interval: number; // days until next review
  reps: number; // successful reps in a row
  due: number; // ms epoch
  lapses: number;
  lastGrade?: Grade;
  lastAt?: number;
};

const KEY = "codeforge.srs.v1";

function load(): Record<string, SrsCard> {
  if (typeof localStorage === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function save(cards: Record<string, SrsCard>) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(cards));
}

export function getCard(id: string): SrsCard {
  const all = load();
  return (
    all[id] ?? {
      id,
      ease: 2.5,
      interval: 0,
      reps: 0,
      due: Date.now(),
      lapses: 0,
    }
  );
}

export function upsertCard(card: SrsCard) {
  const all = load();
  all[card.id] = card;
  save(all);
}

export function allCards(): SrsCard[] {
  return Object.values(load());
}

export function dueCards(now = Date.now()): SrsCard[] {
  return allCards().filter((c) => c.due <= now);
}

// SM-2 update
export function grade(card: SrsCard, g: Grade): SrsCard {
  const next: SrsCard = { ...card };
  next.lastGrade = g;
  next.lastAt = Date.now();
  if (g < 3) {
    next.reps = 0;
    next.interval = 1;
    next.lapses += 1;
  } else {
    if (next.reps === 0) next.interval = 1;
    else if (next.reps === 1) next.interval = 3;
    else next.interval = Math.round(next.interval * next.ease);
    next.reps += 1;
    // SM-2 ease adjustment
    next.ease = Math.max(1.3, next.ease + (0.1 - (5 - g) * (0.08 + (5 - g) * 0.02)));
  }
  next.due = Date.now() + next.interval * 86_400_000;
  return next;
}

export function mastery(card: SrsCard): number {
  // 0..1 based on reps + ease
  const repScore = Math.min(1, card.reps / 5);
  const easeScore = Math.min(1, Math.max(0, (card.ease - 1.3) / 1.7));
  return 0.6 * repScore + 0.4 * easeScore;
}

export function resetAll() {
  if (typeof localStorage !== "undefined") localStorage.removeItem(KEY);
}
