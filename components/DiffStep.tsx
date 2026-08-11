"use client";
import { useState } from "react";
import { InlineProse } from "./Prose";
import { Bloom } from "./Bloom";
import { StuckHelp } from "./StuckHelp";

// Two snippets that look almost the same and behave differently. Predicting
// both forces the one idea that separates them into the open — with far less
// reading than explaining it would take.
export function DiffStep({
  prompt,
  a,
  b,
  hints,
  explanation,
  onAttempt,
}: {
  prompt?: string;
  a: { label?: string; code: string; output: string };
  b: { label?: string; code: string; output: string };
  hints?: string[];
  explanation: string;
  onAttempt: (ok: boolean) => void;
}) {
  const [guesses, setGuesses] = useState(["", ""]);
  const [checked, setChecked] = useState<null | boolean[]>(null);

  const norm = (s: string) => s.trim().replace(/\r/g, "").replace(/[ \t]+$/gm, "");
  const results = () => [norm(guesses[0]) === norm(a.output), norm(guesses[1]) === norm(b.output)];

  const check = () => {
    const r = results();
    setChecked(r);
    onAttempt(r.every(Boolean));
  };

  const panes = [
    { side: a, label: a.label ?? "A", idx: 0 },
    { side: b, label: b.label ?? "B", idx: 1 },
  ];

  return (
    <div className="space-y-4">
      <p className="text-ink-200">
        {prompt ?? "These two are almost identical. Work out what each one prints."}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {panes.map(({ side, label, idx }) => {
          const state = checked?.[idx];
          return (
            <div
              key={idx}
              className={`rounded-xl border overflow-hidden ${
                state === true
                  ? "border-good/50"
                  : state === false
                  ? "border-warm/50"
                  : "border-ink-700"
              }`}
            >
              <div className="px-3 py-1.5 bg-ink-800/60 text-[11px] uppercase tracking-wider text-ink-400">
                {label}
              </div>
              <pre className="p-3 bg-ink-950 mono text-[13px] text-ink-100 overflow-x-auto scrollbar-thin whitespace-pre">
                {side.code.replace(/\n$/, "")}
              </pre>
              <div className="p-3 border-t border-ink-800 space-y-2">
                <label className="block text-[11px] uppercase tracking-wider text-ink-500">
                  Prints
                </label>
                <textarea
                  value={guesses[idx]}
                  onChange={(e) =>
                    setGuesses((g) => (idx === 0 ? [e.target.value, g[1]] : [g[0], e.target.value]))
                  }
                  rows={Math.max(1, side.output.split("\n").length)}
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="w-full rounded-lg surface-code px-2.5 py-1.5 mono text-[13px] text-ink-100 outline-none focus:border-ink-500 resize-y"
                />
                {state === false && (
                  <div className="text-xs">
                    <span className="text-warm">not quite — </span>
                    <span className="text-ink-400">it prints </span>
                    <code className="mono text-ink-100">{side.output.replace(/\n/g, " ⏎ ")}</code>
                  </div>
                )}
                {state === true && <div className="text-xs text-good">✓ right</div>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={check}
          className="px-4 py-2 rounded-lg bg-ink-100 text-ink-950 text-sm font-medium hover:bg-white transition"
        >
          Check both
        </button>
        {checked?.every(Boolean) && <span className="text-good text-sm">✓ both right</span>}
      </div>

      {!checked?.every(Boolean) && <StuckHelp hints={hints} />}

      {checked && (
        <Bloom tone={checked.every(Boolean) ? "good" : "warm"} active pulse>
        <div className="rounded-lg glass p-4 text-sm text-ink-100 leading-relaxed">
          <span className="text-[11px] uppercase tracking-wider text-ink-500 block mb-1.5">
            The difference
          </span>
          <InlineProse text={explanation} />
        </div>
        </Bloom>
      )}
    </div>
  );
}
