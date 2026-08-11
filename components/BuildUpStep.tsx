"use client";
import { useMemo, useState } from "react";
import { InlineProse } from "./Prose";
import { Bloom } from "./Bloom";

type Stage = {
  line: string;
  distractors: string[];
  what: string;
  output?: string;
};

// Assemble a program a line at a time, picking each next line from a few
// candidates and watching the output grow. Every choice gets feedback
// immediately, so a wrong idea is corrected in seconds rather than at the end.
export function BuildUpStep({
  prompt,
  stages,
  explanation,
  onAttempt,
}: {
  prompt?: string;
  stages: Stage[];
  explanation?: string;
  onAttempt: (ok: boolean) => void;
}) {
  const [placed, setPlaced] = useState(0); // how many lines are locked in
  const [wrongPick, setWrongPick] = useState<string | null>(null);
  const [missteps, setMissteps] = useState(0);

  const done = placed >= stages.length;
  const stage = stages[Math.min(placed, stages.length - 1)];

  // Shuffle each stage's candidates once, deterministically per stage, so the
  // right answer isn't always in the same position but doesn't jump around
  // as the component re-renders.
  const choices = useMemo(() => {
    if (done) return [];
    const all = [stage.line, ...stage.distractors];
    return all
      .map((c, i) => ({ c, k: Math.sin((placed + 1) * 97 + i * 31) }))
      .sort((x, y) => x.k - y.k)
      .map((x) => x.c);
  }, [placed, stage, done]);

  const pick = (choice: string) => {
    if (choice === stage.line) {
      setWrongPick(null);
      const next = placed + 1;
      setPlaced(next);
      if (next >= stages.length) onAttempt(missteps === 0);
    } else {
      setWrongPick(choice);
      setMissteps((m) => m + 1);
    }
  };

  const built = stages.slice(0, placed);
  const lastOutput = [...built].reverse().find((s) => s.output)?.output;

  return (
    <div className="space-y-4">
      <p className="text-ink-200">
        {prompt ?? "Build the program one line at a time. Pick what comes next."}
      </p>

      <div className="rounded-xl surface-code overflow-hidden">
        <div className="px-3 py-1.5 bg-ink-800/60 text-[11px] uppercase tracking-wider text-ink-400 flex items-center justify-between">
          <span>The program so far</span>
          <span>
            {placed} / {stages.length} lines
          </span>
        </div>
        <pre className="p-3 mono text-[13px] overflow-x-auto scrollbar-thin whitespace-pre min-h-[3rem]">
          {built.length === 0 ? (
            <span className="text-ink-600">empty — pick the first line below</span>
          ) : (
            built.map((s, i) => (
              <div key={i} className={i === placed - 1 ? "text-ink-100" : "text-ink-400"}>
                {s.line || " "}
              </div>
            ))
          )}
        </pre>
        {lastOutput && (
          <div className="px-3 py-2 border-t border-ink-800 flex items-start gap-2">
            <span className="text-[11px] uppercase tracking-wider text-ink-500 mt-0.5 shrink-0">
              Prints
            </span>
            <pre className="mono text-[13px] text-good whitespace-pre-wrap">{lastOutput}</pre>
          </div>
        )}
      </div>

      {placed > 0 && !done && (
        <p className="text-sm text-ink-300 leading-relaxed border-l-2 border-ink-600 pl-3">
          <InlineProse text={stages[placed - 1].what} />
        </p>
      )}

      {!done ? (
        <div className="space-y-2">
          <div className="text-[11px] uppercase tracking-wider text-ink-500">
            What comes next?
          </div>
          {choices.map((c) => {
            const isWrong = wrongPick === c;
            return (
              <button
                key={c}
                onClick={() => pick(c)}
                className={`w-full text-left rounded-lg border px-3 py-2.5 mono text-[13px] transition ${
                  isWrong
                    ? "border-warm/60 bg-warm/10 text-ink-300"
                    : "border-ink-700 bg-ink-900 text-ink-100 hover:border-ink-500 hover:bg-ink-800"
                }`}
              >
                <span className="whitespace-pre">{c || "(blank line)"}</span>
                {isWrong && <span className="ml-2 text-warm text-xs mono-none">← not yet</span>}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-good text-sm">
            ✓ program complete
            {missteps === 0 ? " — first try, every line" : ` — ${missteps} wrong turn${missteps === 1 ? "" : "s"} along the way`}
          </div>
          <p className="text-sm text-ink-300 leading-relaxed border-l-2 border-ink-600 pl-3">
            <InlineProse text={stages[stages.length - 1].what} />
          </p>
          {explanation && (
            <Bloom tone="good" active pulse>
              <div className="rounded-lg border border-good/40 bg-good/10 p-3 text-sm text-ink-100 leading-relaxed">
                <InlineProse text={explanation} />
              </div>
            </Bloom>
          )}
        </div>
      )}
    </div>
  );
}
