"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Lesson, Step } from "@/lib/curriculum/types";
import { Prose } from "./Prose";
import { Runner } from "./Runner";
import { getLesson, upsertLesson, markStarted, markCompleted } from "@/lib/progress";
import { getCard, grade, upsertCard } from "@/lib/srs";
import { findLesson, lessonsForTrack } from "@/lib/curriculum";

export function LessonViewer({ lesson }: { lesson: Lesson }) {
  const [state, setState] = useState(() => getLesson(lesson.id));
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});

  useEffect(() => {
    markStarted(lesson.id);
  }, [lesson.id]);

  const step = lesson.steps[Math.min(state.stepIndex, lesson.steps.length - 1)];
  const percent = Math.round(((state.stepIndex + 1) / lesson.steps.length) * 100);
  const track = lesson.track;
  const trackLabel = track === "python" ? "Python" : "JavaScript";
  const trackAccent = track === "python" ? "text-py" : "text-js";
  const trackDot = track === "python" ? "bg-py" : "bg-js";

  const persist = (updater: (s: typeof state) => typeof state) => {
    setState((s) => {
      const next = updater(s);
      upsertLesson(next);
      return next;
    });
  };

  const goToStep = (idx: number) => persist((s) => ({ ...s, stepIndex: idx }));

  const markAttempt = (stepId: string, correct: boolean) => {
    persist((s) => ({
      ...s,
      attempts: { ...s.attempts, [stepId]: (s.attempts[stepId] ?? 0) + 1 },
      correct: { ...s.correct, [stepId]: correct || s.correct[stepId] === true },
    }));
    // Update SRS cards for the concepts this lesson covers, weighted by attempts
    for (const cid of lesson.concepts) {
      const card = getCard(cid);
      const g = correct ? (state.attempts[stepId] ? 4 : 5) : 3;
      upsertCard(grade(card, g as 3 | 4 | 5));
    }
  };

  const complete = () => {
    persist((s) => ({ ...s, stepIndex: lesson.steps.length - 1 }));
    markCompleted(lesson.id);
  };

  const nextLessonId = useMemo(() => {
    const list = lessonsForTrack(track);
    const idx = list.findIndex((l) => l.id === lesson.id);
    return list[idx + 1]?.id;
  }, [lesson.id, track]);

  const stepDot = (i: number) => {
    const done = i < state.stepIndex;
    const active = i === state.stepIndex;
    return `w-2.5 h-2.5 rounded-full transition ${
      done ? "bg-good" : active ? `${trackDot}` : "bg-ink-600"
    }`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] gap-6">
      {/* Sidebar */}
      <aside className="lg:sticky lg:top-20 self-start rounded-2xl border border-ink-800 bg-ink-900/60 p-4">
        <Link
          href={`/learn/${track}/`}
          className="text-xs uppercase tracking-wider text-ink-400 hover:text-ink-100 transition"
        >
          ← {trackLabel} track
        </Link>
        <h3 className="mt-2 text-sm font-semibold text-ink-100">
          Lesson {lesson.index}: {lesson.title}
        </h3>
        <p className="mt-1 text-xs text-ink-400 hidden lg:block">{lesson.summary}</p>
        <div className="mt-4 h-1.5 rounded-full bg-ink-800 overflow-hidden">
          <div
            className={`h-full ${track === "python" ? "bg-py" : "bg-js"}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="mt-2 text-[11px] text-ink-400">{percent}% through lesson</div>
        {/* Mobile: horizontal step scroller */}
        <div className="lg:hidden mt-4 -mx-4 px-4 overflow-x-auto scrollbar-thin">
          <div className="flex gap-2 pb-2">
            {lesson.steps.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goToStep(i)}
                className={`shrink-0 flex items-center gap-2 rounded-full px-3 py-1.5 border text-xs whitespace-nowrap transition ${
                  i === state.stepIndex
                    ? `${track === "python" ? "bg-py/15 border-py" : "bg-js/15 border-js"} text-ink-100`
                    : i < state.stepIndex
                    ? "bg-good/10 border-good/50 text-good"
                    : "bg-ink-900 border-ink-700 text-ink-300"
                }`}
              >
                <span>{i + 1}</span>
                <span className="opacity-80">{kindLabel(s.kind)}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Desktop: vertical step list */}
        <ul className="hidden lg:block mt-5 space-y-2">
          {lesson.steps.map((s, i) => (
            <li key={s.id}>
              <button
                onClick={() => goToStep(i)}
                className={`w-full text-left flex items-start gap-2 rounded-md px-2 py-1.5 hover:bg-ink-800 transition ${
                  i === state.stepIndex ? "bg-ink-800" : ""
                }`}
              >
                <span className={`${stepDot(i)} mt-1.5 shrink-0`} />
                <span className="text-xs">
                  <span className="text-ink-300">{kindLabel(s.kind)}</span>
                  <span className="text-ink-100 block leading-tight">{s.title}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main */}
      <section className="min-w-0">
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs uppercase tracking-wider ${trackAccent}`}>
            {kindLabel(step.kind)}
          </span>
          <span className="text-xs text-ink-500">
            step {state.stepIndex + 1} / {lesson.steps.length}
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-ink-100 mb-4">{step.title}</h1>
        <StepBody
          step={step}
          track={track}
          hintOpen={!!showHint[step.id]}
          onHint={() => setShowHint((h) => ({ ...h, [step.id]: true }))}
          onAttempt={(ok) => markAttempt(step.id, ok)}
          state={state}
          setState={setState}
          upsertLesson={upsertLesson}
        />

        <div className="mt-8 flex items-center justify-between">
          <button
            disabled={state.stepIndex === 0}
            onClick={() => goToStep(Math.max(0, state.stepIndex - 1))}
            className="px-4 py-2 rounded-lg text-ink-300 hover:text-ink-100 hover:bg-ink-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          {state.stepIndex < lesson.steps.length - 1 ? (
            <button
              onClick={() => goToStep(state.stepIndex + 1)}
              className={`px-5 py-2 rounded-lg font-medium bg-ink-100 text-ink-950 hover:bg-white transition`}
            >
              Next step →
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={complete}
                className="px-5 py-2 rounded-lg font-medium bg-good/90 hover:bg-good text-ink-950 transition"
              >
                Mark complete ✓
              </button>
              {nextLessonId && (
                <Link
                  href={`/learn/${track}/${nextLessonId}/`}
                  onClick={() => markCompleted(lesson.id)}
                  className="px-5 py-2 rounded-lg font-medium bg-ink-100 text-ink-950 hover:bg-white transition"
                >
                  Next lesson →
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function kindLabel(kind: Step["kind"]) {
  return (
    {
      read: "concept",
      example: "example",
      predict: "predict the output",
      fix: "fix the bug",
      write: "write from scratch",
      explain: "explain in your own words",
      mcq: "quick check",
    }[kind] ?? kind
  );
}

function StepBody({
  step,
  track,
  hintOpen,
  onHint,
  onAttempt,
  state,
  setState,
  upsertLesson,
}: {
  step: Step;
  track: "python" | "javascript";
  hintOpen: boolean;
  onHint: () => void;
  onAttempt: (ok: boolean) => void;
  state: ReturnType<typeof getLesson>;
  setState: React.Dispatch<React.SetStateAction<ReturnType<typeof getLesson>>>;
  upsertLesson: (l: ReturnType<typeof getLesson>) => void;
}) {
  if (step.kind === "read") return <Prose text={step.body} />;

  if (step.kind === "example") {
    return (
      <div className="space-y-3">
        {step.note && <p className="text-ink-300 text-sm">{step.note}</p>}
        <Runner initial={step.code} track={track} runLabel="Run this example" onResult={() => onAttempt(true)} />
        <p className="text-xs text-ink-400">
          Tweak the code above — try changing a value and re-running. Learning by messing with real code is the point.
        </p>
      </div>
    );
  }

  if (step.kind === "predict") {
    const [answer, setAnswer] = usePersistedField(state, setState, upsertLesson, step.id);
    const [checked, setChecked] = useState<null | boolean>(null);
    const normalize = (s: string) => s.replace(/\r\n/g, "\n").trim();
    const doCheck = () => {
      const ok = normalize(answer || "") === normalize(step.answer);
      setChecked(ok);
      onAttempt(ok);
    };
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-ink-800 bg-ink-950 p-3 mono text-[13px] whitespace-pre-wrap">
          {step.code}
        </div>
        <label className="block text-sm text-ink-300">
          What does this print? (be exact — whitespace + newlines matter)
        </label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={4}
          className="w-full rounded-lg bg-ink-900 border border-ink-700 focus:border-ink-500 focus:outline-none p-3 mono text-[13px]"
          placeholder="type the exact output…"
        />
        <div className="flex items-center gap-3">
          <button
            onClick={doCheck}
            className="px-4 py-2 rounded-lg bg-ink-100 text-ink-950 text-sm font-medium hover:bg-white transition"
          >
            Check answer
          </button>
          {step.hint && (
            <button onClick={onHint} className="text-sm text-ink-400 hover:text-ink-100 transition">
              {hintOpen ? "hint shown ↓" : "show hint"}
            </button>
          )}
          {checked === true && <span className="text-good text-sm">✓ correct</span>}
          {checked === false && <span className="text-bad text-sm">✗ not quite — try running it below</span>}
        </div>
        {hintOpen && step.hint && (
          <div className="text-sm text-ink-300 border-l-2 border-warm pl-3">💡 {step.hint}</div>
        )}
        {checked === false && (
          <div className="pt-2">
            <p className="text-xs text-ink-400 mb-2">Run it here to see what happens:</p>
            <Runner initial={step.code} track={track} expected={step.answer} runLabel="Run" />
          </div>
        )}
      </div>
    );
  }

  if (step.kind === "fix") {
    return (
      <div className="space-y-3">
        <p className="text-ink-300">Fix the code so its output matches the expected output below.</p>
        <Runner
          initial={step.buggy}
          track={track}
          expected={step.expected}
          onResult={(r) => onAttempt(r.ok)}
        />
        {step.hint && (
          <div className="flex items-center gap-3">
            <button onClick={onHint} className="text-sm text-ink-400 hover:text-ink-100 transition">
              {hintOpen ? "hint shown ↓" : "show hint"}
            </button>
          </div>
        )}
        {hintOpen && step.hint && (
          <div className="text-sm text-ink-300 border-l-2 border-warm pl-3">💡 {step.hint}</div>
        )}
      </div>
    );
  }

  if (step.kind === "write") {
    return (
      <div className="space-y-3">
        <p className="text-ink-200">{step.prompt}</p>
        <Runner
          initial={step.starter}
          track={track}
          expected={step.expected}
          onResult={(r) => onAttempt(r.ok)}
        />
        {step.hint && (
          <div className="flex items-center gap-3">
            <button onClick={onHint} className="text-sm text-ink-400 hover:text-ink-100 transition">
              {hintOpen ? "hint shown ↓" : "show hint"}
            </button>
          </div>
        )}
        {hintOpen && step.hint && (
          <div className="text-sm text-ink-300 border-l-2 border-warm pl-3">💡 {step.hint}</div>
        )}
      </div>
    );
  }

  if (step.kind === "explain") {
    const [answer, setAnswer] = usePersistedField(state, setState, upsertLesson, step.id);
    const min = step.minWords ?? 10;
    const wordCount = (answer || "").trim().split(/\s+/).filter(Boolean).length;
    const ok = wordCount >= min;
    return (
      <div className="space-y-3">
        <p className="text-ink-200">{step.prompt}</p>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={5}
          className="w-full rounded-lg bg-ink-900 border border-ink-700 focus:border-ink-500 focus:outline-none p-3"
          placeholder={`Write at least ${min} words explaining it to yourself…`}
        />
        <div className="flex items-center gap-3">
          <span className={`text-sm ${ok ? "text-good" : "text-ink-400"}`}>
            {wordCount} / {min} words {ok ? "✓" : ""}
          </span>
          <button
            onClick={() => onAttempt(ok)}
            disabled={!ok}
            className="px-4 py-2 rounded-lg bg-ink-100 text-ink-950 text-sm font-medium hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Log this reflection
          </button>
        </div>
        <p className="text-xs text-ink-400">
          Explaining aloud (or in writing) is one of the highest-yield learning acts you can do.
        </p>
      </div>
    );
  }

  if (step.kind === "mcq") {
    return <Mcq step={step} onAttempt={onAttempt} />;
  }
  return null;
}

function Mcq({
  step,
  onAttempt,
}: {
  step: Extract<Step, { kind: "mcq" }>;
  onAttempt: (ok: boolean) => void;
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
              <span className="mono text-xs text-ink-500 mr-2">{String.fromCharCode(65 + i)}.</span>
              <span className="text-ink-100">{opt}</span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (pick === null) return;
            setChecked(true);
            onAttempt(pick === step.correctIndex);
          }}
          disabled={pick === null}
          className="px-4 py-2 rounded-lg bg-ink-100 text-ink-950 text-sm font-medium hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Check answer
        </button>
        {checked && pick === step.correctIndex && <span className="text-good text-sm">✓ correct</span>}
        {checked && pick !== step.correctIndex && (
          <span className="text-bad text-sm">
            ✗ correct answer: {String.fromCharCode(65 + step.correctIndex)}
          </span>
        )}
      </div>
      {checked && step.why && (
        <div className="text-sm text-ink-300 border-l-2 border-ink-500 pl-3">{step.why}</div>
      )}
    </div>
  );
}

function usePersistedField(
  state: ReturnType<typeof getLesson>,
  setState: React.Dispatch<React.SetStateAction<ReturnType<typeof getLesson>>>,
  upsert: (l: ReturnType<typeof getLesson>) => void,
  fieldId: string
): [string, (v: string) => void] {
  const value = state.freeText[fieldId] ?? "";
  const set = (v: string) => {
    setState((s) => {
      const next = { ...s, freeText: { ...s.freeText, [fieldId]: v } };
      upsert(next);
      return next;
    });
  };
  return [value, set];
}
