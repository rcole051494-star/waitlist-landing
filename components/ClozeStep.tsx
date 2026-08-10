"use client";
import { useState } from "react";
import { StuckHelp } from "./StuckHelp";

// Fill-in-the-blank over a code template. Renders the code with inline inputs
// where the {{n}} placeholders are — the scaffold between reading working code
// and writing it from nothing.

type Blank = { answer: string; accept?: string[]; width?: number };

export function ClozeStep({
  prompt,
  template,
  blanks,
  explanation,
  hints,
  onAttempt,
}: {
  prompt?: string;
  template: string;
  blanks: Blank[];
  explanation?: string;
  hints?: string[];
  onAttempt: (ok: boolean) => void;
}) {
  const [values, setValues] = useState<string[]>(() => blanks.map(() => ""));
  const [checked, setChecked] = useState<null | boolean[]>(null);

  const isCorrect = (i: number, v: string) => {
    const b = blanks[i];
    const norm = (s: string) => s.trim();
    const candidates = [b.answer, ...(b.accept ?? [])];
    return candidates.some((c) => norm(c) === norm(v));
  };

  const check = () => {
    const results = values.map((v, i) => isCorrect(i, v));
    setChecked(results);
    onAttempt(results.every(Boolean));
  };

  const allRight = checked?.every(Boolean) ?? false;

  // Split the template on placeholders so we can interleave inputs into the code.
  const parts = template.split(/(\{\{\d+\}\})/g);

  return (
    <div className="space-y-4">
      {prompt && <p className="text-ink-200">{prompt}</p>}

      <div className="rounded-xl border border-ink-800 bg-ink-950 p-3 mono text-[13px] leading-[2] overflow-x-auto scrollbar-thin">
        <pre className="whitespace-pre-wrap">
          {parts.map((part, i) => {
            const m = part.match(/^\{\{(\d+)\}\}$/);
            if (!m) return <span key={i}>{part}</span>;
            const idx = parseInt(m[1], 10);
            const state = checked?.[idx];
            return (
              <input
                key={i}
                value={values[idx] ?? ""}
                onChange={(e) => {
                  const next = values.slice();
                  next[idx] = e.target.value;
                  setValues(next);
                  setChecked(null);
                }}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                style={{ width: `${(blanks[idx]?.width ?? 8) + 1}ch` }}
                className={`inline-block mx-0.5 px-1.5 py-0.5 rounded mono text-[13px] text-center align-baseline bg-ink-900 border focus:outline-none transition ${
                  state === true
                    ? "border-good text-good"
                    : state === false
                    ? "border-bad text-bad"
                    : "border-ink-600 text-ink-100 focus:border-py"
                }`}
                placeholder="?"
              />
            );
          })}
        </pre>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={check}
          disabled={values.every((v) => !v.trim())}
          className="px-4 py-2 rounded-lg bg-ink-100 text-ink-950 text-sm font-medium hover:bg-white transition disabled:opacity-40"
        >
          Check
        </button>
        {allRight && <span className="text-good text-sm">✓ all correct</span>}
        {checked && !allRight && (
          <span className="text-warm text-sm">
            △ {checked.filter(Boolean).length} of {blanks.length} right — red ones need another look
          </span>
        )}
      </div>

      {!allRight && <StuckHelp hints={hints} />}

      {allRight && explanation && (
        <div className="rounded-lg border border-good/40 bg-good/10 p-3 text-sm text-ink-100 leading-relaxed">
          {explanation}
        </div>
      )}
    </div>
  );
}
