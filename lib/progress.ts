"use client";

const KEY = "codeforge.progress.v1";

export type LessonState = {
  id: string;
  startedAt?: number;
  completedAt?: number;
  stepIndex: number;
  attempts: Record<string, number>;
  correct: Record<string, boolean>;
  freeText: Record<string, string>;
};

type Store = {
  lessons: Record<string, LessonState>;
  streak: { last?: string; count: number };
  xp: number;
};

function load(): Store {
  if (typeof localStorage === "undefined") return { lessons: {}, streak: { count: 0 }, xp: 0 };
  try {
    return JSON.parse(localStorage.getItem(KEY) || "") || { lessons: {}, streak: { count: 0 }, xp: 0 };
  } catch {
    return { lessons: {}, streak: { count: 0 }, xp: 0 };
  }
}
function save(s: Store) {
  if (typeof localStorage !== "undefined") localStorage.setItem(KEY, JSON.stringify(s));
}

export function getLesson(id: string): LessonState {
  const s = load();
  return (
    s.lessons[id] ?? {
      id,
      stepIndex: 0,
      attempts: {},
      correct: {},
      freeText: {},
    }
  );
}
export function upsertLesson(l: LessonState) {
  const s = load();
  s.lessons[l.id] = l;
  save(s);
}

export function markStarted(id: string) {
  const l = getLesson(id);
  if (!l.startedAt) l.startedAt = Date.now();
  upsertLesson(l);
}

export function markCompleted(id: string) {
  const l = getLesson(id);
  if (!l.completedAt) {
    l.completedAt = Date.now();
    upsertLesson(l);
    addXp(20);
    bumpStreak();
  }
}

export function allLessons(): LessonState[] {
  return Object.values(load().lessons);
}

export function addXp(n: number) {
  const s = load();
  s.xp += n;
  save(s);
}
export function getXp(): number {
  return load().xp;
}

export function bumpStreak() {
  const s = load();
  const today = new Date().toISOString().slice(0, 10);
  if (s.streak.last === today) return;
  const y = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  s.streak.count = s.streak.last === y ? s.streak.count + 1 : 1;
  s.streak.last = today;
  save(s);
}
export function getStreak(): number {
  return load().streak.count;
}

export function resetAllProgress() {
  if (typeof localStorage !== "undefined") localStorage.removeItem(KEY);
}
