"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Nav } from "@/components/Nav";
import { allCards, dueCards, grade, mastery, upsertCard } from "@/lib/srs";
import { allLessons } from "@/lib/curriculum";
import type { Lesson, Step } from "@/lib/curriculum/types";
import { Runner } from "@/components/Runner";
import { Prose } from "@/components/Prose";

// A review "item" is a testable step (predict/fix/write/mcq) chosen from a lesson
// whose SRS concept is due. We interleave across topics/languages.
type Item = { concept: string; lesson: Lesson; step: Step };

function buildDueItems(): Item[] {
  const dueIds = new Set(dueCards().map((c) => c.id));
  const items: Item[] = [];
  for (const l of allLessons) {
    const covers = l.concepts.some((c) => dueIds.has(c));
    if (!covers) continue;
    const testable = l.steps.filter((s) =>
      s.kind === "predict" || s.kind === "fix" || s.kind === "write" || s.kind === "mcq"
    );
    if (testable.length === 0) continue;
    const step = testable[Math.floor(Math.random() * testable.length)];
    items.push({ concept: l.concepts[0], lesson: l, step });
  }
  // interleave — shuffle
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

export default function ReviewPage() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const [items, setItems] = useState<Item[]>([]);
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (hydrated) setItems(buildDueItems());
  }, [hydrated]);

  const cards = hydrated ? allCards() : [];
  const dueTotal = hydrated ? dueCards().length : 0;
  const seen = cards.length;
  const avgMastery = seen === 0 ? 0 : Math.round((cards.reduce((s, c) => s + mastery(c), 0) / seen) * 100);

  const item = items[idx];

  const submit = (ok: boolean) => {
    setAnswered(true);
    setCorrect(ok);
    if (item) {
      const card = { ...(cards.find((c) => c.id === item.concept) ?? { id: item.concept, ease: 2.5, interval: 0, reps: 0, due: Date.now(), lapses: 0 }) };
      upsertCard(grade(card, ok ? 4 : 3));
    }
  };
  const next = () => {
    setAnswered(false);
    setCorrect(null);
    setIdx((i) => i + 1);
  };

  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-20">
        <header className="flex items-baseline justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink-400">spaced repetition</p>
            <h1 className="mt-2 text-3xl font-bold text-ink-100">Review — interleaved</h1>
            <p className="text-ink-400 mt-1 text-sm">
              Concepts you've seen return here on schedule. Mixed topics, mixed languages.
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold text-ink-100">{dueTotal}</div>
            <div className="text-xs text-ink-400 uppercase tracking-wider">due now</div>
            <div className="text-xs text-ink-500 mt-1">avg mastery {avgMastery}%</div>
          </div>
        </header>

        {!hydrated ? (
          <div className="text-ink-400">Loading…</div>
        ) : items.length === 0 ? (
          <EmptyReview />
        ) : idx >= items.length ? (
          <div className="rounded-2xl border border-ink-800 bg-ink-900/50 p-8 text-center">
            <div className="text-4xl">🎯</div>
            <h2 className="mt-4 text-2xl font-semibold text-ink-100">Session complete</h2>
            <p className="text-ink-300 mt-2">
              You reviewed {items.length} item{items.length === 1 ? "" : "s"}. Come back tomorrow —
              cards you struggled with will be back sooner.
            </p>
            <Link
              href="/"
              className="inline-block mt-6 px-5 py-2.5 rounded-lg bg-ink-100 text-ink-950 font-medium hover:bg-white transition"
            >
              Back to dashboard
            </Link>
          </div>
        ) : item ? (
          <div className="rounded-2xl border border-ink-800 bg-ink-900/40 p-6">
            <div className="flex items-center gap-2 text-xs mb-3">
              <span
                className={`px-2 py-0.5 rounded ${
                  item.lesson.track === "python" ? "bg-py/20 text-py" : "bg-js/20 text-js"
                }`}
              >
                {item.lesson.track === "python" ? "Python" : "JavaScript"}
              </span>
              <span className="text-ink-500">from lesson: {item.lesson.title}</span>
              <span className="ml-auto text-ink-500">
                item {idx + 1} of {items.length}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-ink-100">{item.step.title}</h2>
            <div className="mt-4">
              <ReviewStep step={item.step} track={item.lesson.track} onResult={submit} />
            </div>
            {answered && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm">
                  {correct ? (
                    <span className="text-good">✓ good — next review is further out</span>
                  ) : (
                    <span className="text-warm">△ marked as harder — you'll see this sooner</span>
                  )}
                </div>
                <button
                  onClick={next}
                  className="px-5 py-2 rounded-lg bg-ink-100 text-ink-950 font-medium hover:bg-white transition"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        ) : null}

        <section className="mt-10">
          <h3 className="text-sm font-semibold text-ink-300 uppercase tracking-wider mb-3">
            All concepts you've seen ({seen})
          </h3>
          <div className="grid gap-2">
            {cards
              .slice()
              .sort((a, b) => a.due - b.due)
              .map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 rounded-lg border border-ink-800 bg-ink-900/40 px-4 py-2 text-sm"
                >
                  <span className="mono text-xs text-ink-400 w-40 truncate">{c.id}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-ink-800 overflow-hidden">
                    <div
                      className="h-full bg-py"
                      style={{ width: `${Math.round(mastery(c) * 100)}%` }}
                    />
                  </div>
                  <span className="text-ink-400 text-xs w-20 text-right">
                    {c.due <= Date.now() ? "due now" : formatDue(c.due)}
                  </span>
                </div>
              ))}
            {seen === 0 && (
              <div className="text-ink-400 text-sm">
                Start a lesson — concepts will appear here as you learn them.
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

function EmptyReview() {
  return (
    <div className="rounded-2xl border border-ink-800 bg-ink-900/50 p-8 text-center">
      <div className="text-4xl">🌱</div>
      <h2 className="mt-4 text-2xl font-semibold text-ink-100">Nothing due yet</h2>
      <p className="text-ink-300 mt-2">
        Complete a few lesson steps to seed your review queue. New concepts appear here after ~1 day.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/learn/python"
          className="px-4 py-2 rounded-lg bg-py text-ink-950 font-medium hover:brightness-110 transition"
        >
          Start Python
        </Link>
        <Link
          href="/learn/javascript"
          className="px-4 py-2 rounded-lg bg-js text-ink-950 font-medium hover:brightness-110 transition"
        >
          Start JavaScript
        </Link>
      </div>
    </div>
  );
}

function formatDue(ts: number) {
  const days = Math.round((ts - Date.now()) / 86_400_000);
  if (days < 1) return "today";
  if (days === 1) return "1d";
  if (days < 30) return `${days}d`;
  const m = Math.round(days / 30);
  return `${m}mo`;
}

function ReviewStep({
  step,
  track,
  onResult,
}: {
  step: Step;
  track: "python" | "javascript";
  onResult: (ok: boolean) => void;
}) {
  if (step.kind === "predict") {
    return (
      <div className="space-y-3">
        <p className="text-ink-300 text-sm">What does this print?</p>
        <div className="rounded-xl border border-ink-800 bg-ink-950 p-3 mono text-[13px] whitespace-pre-wrap">
          {step.code}
        </div>
        <PredictBox answer={step.answer} onResult={onResult} />
      </div>
    );
  }
  if (step.kind === "fix") {
    return (
      <div className="space-y-3">
        <p className="text-ink-300 text-sm">Fix the bug so output matches expected.</p>
        <Runner initial={step.buggy} track={track} expected={step.expected} onResult={(r) => onResult(r.ok)} />
      </div>
    );
  }
  if (step.kind === "write") {
    return (
      <div className="space-y-3">
        <p className="text-ink-200 text-sm">{step.prompt}</p>
        <Runner initial={step.starter} track={track} expected={step.expected} onResult={(r) => onResult(r.ok)} />
      </div>
    );
  }
  if (step.kind === "mcq") {
    return <McqReview step={step} onResult={onResult} />;
  }
  return <Prose text={"Nothing to test here."} />;
}

function PredictBox({ answer, onResult }: { answer: string; onResult: (ok: boolean) => void }) {
  const [text, setText] = useState("");
  const [checked, setChecked] = useState<null | boolean>(null);
  const norm = (s: string) => s.replace(/\r\n/g, "\n").trim();
  return (
    <div className="space-y-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="w-full rounded-lg bg-ink-900 border border-ink-700 focus:border-ink-500 focus:outline-none p-3 mono text-[13px]"
        placeholder="type the exact output…"
      />
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            const ok = norm(text) === norm(answer);
            setChecked(ok);
            onResult(ok);
          }}
          className="px-4 py-2 rounded-lg bg-ink-100 text-ink-950 text-sm font-medium hover:bg-white transition"
        >
          Check
        </button>
        {checked === true && <span className="text-good text-sm">✓</span>}
        {checked === false && (
          <span className="text-bad text-sm">
            expected: <span className="mono">{answer}</span>
          </span>
        )}
      </div>
    </div>
  );
}

function McqReview({
  step,
  onResult,
}: {
  step: Extract<Step, { kind: "mcq" }>;
  onResult: (ok: boolean) => void;
}) {
  const [pick, setPick] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  return (
    <div className="space-y-3">
      <p className="text-ink-200">{step.prompt}</p>
      <div className="grid gap-2">
        {step.options.map((opt, i) => {
          const isPick = pick === i;
          const isCorrect = checked && i === step.correctIndex;
          const isWrongPick = checked && isPick && i !== step.correctIndex;
          return (
            <button
              key={i}
              onClick={() => !checked && setPick(i)}
              className={`text-left px-4 py-3 rounded-lg border transition ${
                isCorrect
                  ? "border-good bg-good/10"
                  : isWrongPick
                  ? "border-bad bg-bad/10"
                  : isPick
                  ? "border-ink-400 bg-ink-800"
                  : "border-ink-800 bg-ink-900 hover:bg-ink-800"
              }`}
            >
              <span className="mono text-xs text-ink-500 mr-2">
                {String.fromCharCode(65 + i)}.
              </span>
              <span className="text-ink-100">{opt}</span>
            </button>
          );
        })}
      </div>
      <button
        disabled={pick === null || checked}
        onClick={() => {
          setChecked(true);
          onResult(pick === step.correctIndex);
        }}
        className="px-4 py-2 rounded-lg bg-ink-100 text-ink-950 text-sm font-medium hover:bg-white transition disabled:opacity-50"
      >
        Check
      </button>
    </div>
  );
}
