"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { allLessons, tracks } from "@/lib/curriculum";
import { allCards, dueCards, mastery } from "@/lib/srs";
import { allLessons as progressLessons, getStreak, getXp } from "@/lib/progress";

export default function Home() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const [_, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  const done = hydrated ? progressLessons().filter((l) => l.completedAt).length : 0;
  const started = hydrated ? progressLessons().filter((l) => l.startedAt && !l.completedAt).length : 0;
  const due = hydrated ? dueCards().length : 0;
  const xp = hydrated ? getXp() : 0;
  const streak = hydrated ? getStreak() : 0;
  const cards = hydrated ? allCards() : [];
  const avgMastery =
    cards.length === 0
      ? 0
      : Math.round((cards.reduce((s, c) => s + mastery(c), 0) / cards.length) * 100);

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-20">
        <header className="grid-bg -mx-4 sm:-mx-6 px-4 sm:px-6 pt-8 sm:pt-10 pb-10 sm:pb-14 mb-8 sm:mb-10 border-b border-ink-800">
          <div className="max-w-4xl">
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-ink-400">
              built on the science of how coding actually sticks
            </p>
            <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink-100 leading-tight">
              Learn <span className="text-py">Python</span> and{" "}
              <span className="text-js">JavaScript</span> — for real.
            </h1>
            <p className="mt-3 sm:mt-4 text-ink-300 text-base sm:text-lg max-w-2xl">
              A hands-on lab, not a passive course. Every concept is a runnable example, a
              predict-the-output, a bug-fix, a from-scratch build — reinforced by spaced repetition
              so it doesn't slip away.
            </p>
            <div className="mt-5 sm:mt-6 flex flex-wrap gap-2 sm:gap-3">
              <Link
                href="/learn/python/py.01.variables/"
                className="px-5 py-2.5 rounded-lg bg-py text-ink-950 font-medium hover:brightness-110 active:brightness-95 transition"
              >
                Start Python
              </Link>
              <Link
                href="/learn/javascript/js.01.variables/"
                className="px-5 py-2.5 rounded-lg bg-js text-ink-950 font-medium hover:brightness-110 active:brightness-95 transition"
              >
                Start JavaScript
              </Link>
              {due > 0 && (
                <Link
                  href="/review/"
                  className="px-5 py-2.5 rounded-lg border border-ink-700 hover:border-ink-500 active:bg-ink-800 text-ink-100 transition"
                >
                  {due} due for review →
                </Link>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
          <Stat label="Lessons complete" value={`${done} / ${allLessons.length}`} accent="text-good" />
          <Stat label="In progress" value={started} accent="text-warm" />
          <Stat label="Concepts mastered" value={`${avgMastery}%`} accent="text-py" />
          <Stat label="Streak" value={`${streak}d`} accent="text-js" sub={`${xp} XP`} />
        </div>

        <section className="grid md:grid-cols-2 gap-4 mb-10">
          {tracks().map((t) => (
            <Link
              key={t.id}
              href={`/learn/${t.id}/`}
              className="group rounded-2xl border border-ink-800 bg-ink-900/50 p-6 hover:border-ink-600 transition"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-10 h-10 rounded-lg grid place-items-center font-black text-ink-950 ${
                    t.id === "python" ? "bg-py" : "bg-js"
                  }`}
                >
                  {t.id === "python" ? "Py" : "Js"}
                </span>
                <div>
                  <h3 className="font-semibold text-ink-100">{t.label}</h3>
                  <p className="text-sm text-ink-400">{t.count} interactive lessons</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-ink-300 leading-relaxed">
                {t.id === "python" ? (
                  <>Fundamentals → f-strings → pattern matching → async → PEP 695 generics.</>
                ) : (
                  <>let/const → array methods → closures → promises → Object.groupBy.</>
                )}
              </div>
              <div className="mt-4 text-sm text-ink-400 group-hover:text-ink-100 transition">
                Enter track →
              </div>
            </Link>
          ))}
        </section>

        <section className="rounded-2xl border border-ink-800 bg-ink-900/40 p-6">
          <h3 className="font-semibold text-ink-100 mb-3">Why this app works — the research</h3>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-sm text-ink-300">
            <Bullet>
              <b className="text-ink-100">Active recall</b> — you produce output, don't just read it.
              Consistently outperforms re-reading by 50%+ (Karpicke &amp; Blunt, 2011).
            </Bullet>
            <Bullet>
              <b className="text-ink-100">Spaced repetition</b> — concepts return at growing intervals
              matched to your recall (SM-2 algorithm).
            </Bullet>
            <Bullet>
              <b className="text-ink-100">Interleaving</b> — review mixes topics so you learn to
              choose the right tool, not just recognize a pattern.
            </Bullet>
            <Bullet>
              <b className="text-ink-100">Immediate feedback</b> — code runs in the browser (Python
              via Pyodide, JS in a sandboxed iframe), so wrong beliefs get corrected on the spot.
            </Bullet>
            <Bullet>
              <b className="text-ink-100">Elaboration</b> — you're prompted to explain each concept in
              your own words. Explaining is a stress-test for understanding.
            </Bullet>
            <Bullet>
              <b className="text-ink-100">Project transfer</b> — end-to-end builds force you to compose
              skills, not just execute isolated ones.
            </Bullet>
          </div>
        </section>
      </main>
    </>
  );
}

function Stat({
  label,
  value,
  accent,
  sub,
}: {
  label: string;
  value: string | number;
  accent?: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-ink-800 bg-ink-900/40 p-4">
      <div className="text-xs text-ink-400 uppercase tracking-wider">{label}</div>
      <div className={`mt-1 text-2xl font-semibold ${accent ?? "text-ink-100"}`}>{value}</div>
      {sub && <div className="text-xs text-ink-500 mt-0.5">{sub}</div>}
    </div>
  );
}
function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-ink-500 mt-2 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
