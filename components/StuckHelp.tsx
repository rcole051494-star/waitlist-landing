"use client";
import { InlineProse } from "./Prose";
import { useState } from "react";

// Progressive help for an exercise. Hints reveal one at a time so the learner
// gets the smallest nudge that unsticks them, rather than the whole answer at
// once. The full solution stays behind an extra confirm — seeing a solution
// you didn't struggle for is much weaker learning than earning it, but being
// permanently stuck with no way out is worse.
export function StuckHelp({
  hints,
  solution,
  solutionWhy,
  language,
}: {
  hints?: string[];
  solution?: string;
  solutionWhy?: string;
  language?: "python" | "javascript";
}) {
  const [revealed, setRevealed] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const list = hints ?? [];
  const hasMoreHints = revealed < list.length;

  if (list.length === 0 && !solution) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        {hasMoreHints && (
          <button
            onClick={() => setRevealed((n) => n + 1)}
            className="text-sm text-warm hover:brightness-125 transition"
          >
            {revealed === 0
              ? "💡 Stuck? Get a hint"
              : `💡 Still stuck? Hint ${revealed + 1} of ${list.length}`}
          </button>
        )}
        {!hasMoreHints && solution && !showSolution && (
          <button
            onClick={() => setShowSolution(true)}
            className="text-sm text-ink-400 hover:text-ink-100 transition"
          >
            🔓 Show me the solution
          </button>
        )}
      </div>

      {list.slice(0, revealed).map((h, i) => (
        <div
          key={i}
          className="text-sm text-ink-200 border-l-2 border-warm pl-3 py-1 bg-warm/5 rounded-r"
        >
          <span className="text-warm text-xs font-medium mr-1.5">Hint {i + 1}:</span>
          <InlineProse text={h} />
        </div>
      ))}

      {showSolution && solution && (
        <div className="rounded-lg border border-ink-700 bg-ink-950 overflow-hidden">
          <div className="px-3 py-1.5 bg-ink-800 text-[11px] uppercase tracking-wider text-ink-300">
            Solution
          </div>
          <pre className="p-3 mono text-[13px] text-ink-100 overflow-x-auto scrollbar-thin whitespace-pre">
            {solution}
          </pre>
          {solutionWhy && (
            <div className="px-3 py-2.5 border-t border-ink-800 text-sm text-ink-200 leading-relaxed">
              <InlineProse text={solutionWhy} />
            </div>
          )}
          <div className="px-3 pb-3 text-[11px] text-ink-500">
            Type it out yourself rather than pasting — the typing is where it sticks.
          </div>
        </div>
      )}
    </div>
  );
}
