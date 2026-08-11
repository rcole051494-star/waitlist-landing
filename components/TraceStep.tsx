"use client";
import { useState } from "react";
import type { TraceLine } from "@/lib/curriculum/types";
import { Prose, InlineProse } from "./Prose";

// A worked example the learner steps through one line at a time, seeing what
// each line does and what the program's state looks like afterwards. Studying
// a fully worked example before attempting a problem is one of the
// best-evidenced ways to teach a procedure to a novice.
export function TraceStep({
  intro,
  code,
  lines,
  takeaway,
}: {
  intro?: string;
  code: string;
  lines: TraceLine[];
  takeaway?: string;
}) {
  const [current, setCurrent] = useState(0);
  const atEnd = current >= lines.length - 1;
  const codeLines = code.replace(/\n$/, "").split("\n");

  // Highlight the code line(s) matching the current trace entry.
  const activeCode = lines[current]?.code ?? "";
  // Some trace entries quote an intermediate result rather than a program
  // line; those declare highlight: false and light nothing up.
  const activeSet =
    lines[current]?.highlight === false
      ? new Set<string>()
      : new Set(activeCode.split("\n").map((l) => l.trim()).filter(Boolean));

  return (
    <div className="space-y-4">
      {intro && <Prose text={intro} />}

      <div className="rounded-xl surface-code overflow-hidden">
        <div className="px-3 py-1.5 bg-ink-800/60 text-[11px] uppercase tracking-wider text-ink-400">
          The program
        </div>
        <pre className="p-3 mono text-[13px] overflow-x-auto scrollbar-thin">
          {codeLines.map((l, i) => {
            const isActive = l.trim() !== "" && activeSet.has(l.trim());
            return (
              <div
                key={i}
                className={`px-1 -mx-1 rounded transition-colors ${
                  isActive ? "bg-py/20 text-ink-100" : "text-ink-400"
                }`}
              >
                <span className="inline-block w-6 select-none text-ink-600 text-right mr-3">
                  {i + 1}
                </span>
                {l || " "}
              </div>
            );
          })}
        </pre>
      </div>

      <div className="rounded-xl glass p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] uppercase tracking-wider text-ink-400">
            Step {current + 1} of {lines.length}
          </span>
          <div className="flex-1 h-1 rounded-full bg-ink-800 overflow-hidden">
            <div
              className="h-full bg-py transition-all"
              style={{ width: `${((current + 1) / lines.length) * 100}%` }}
            />
          </div>
        </div>

        <pre className="mono text-[13px] text-ink-100 bg-ink-950 rounded-lg px-3 py-2 overflow-x-auto scrollbar-thin whitespace-pre">
          {lines[current].code}
        </pre>

        <p className="mt-3 text-ink-200 leading-relaxed text-[14.5px]">
          <InlineProse text={lines[current].what} />
        </p>

        {lines[current].state && (
          <div className="mt-3 flex items-start gap-2 text-sm">
            <span className="text-[11px] uppercase tracking-wider text-ink-500 mt-0.5 shrink-0">
              Now
            </span>
            <code className="mono text-[13px] text-good bg-good/10 border border-good/25 rounded px-2 py-1">
              {lines[current].state}
            </code>
          </div>
        )}

        {lines[current].output && (
          <div className="mt-2 flex items-start gap-2 text-sm">
            <span className="text-[11px] uppercase tracking-wider text-ink-500 mt-0.5 shrink-0">
              Prints
            </span>
            <code className="mono text-[13px] text-ink-100 bg-ink-950 border border-ink-700 rounded px-2 py-1 whitespace-pre">
              {lines[current].output}
            </code>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="px-3 py-1.5 rounded-lg text-sm text-ink-300 hover:text-ink-100 hover:bg-ink-800 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          <button
            onClick={() => setCurrent((c) => Math.min(lines.length - 1, c + 1))}
            disabled={atEnd}
            className="px-4 py-1.5 rounded-lg text-sm font-medium bg-ink-100 text-ink-950 hover:bg-white transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next line →
          </button>
        </div>
      </div>

      {takeaway && atEnd && (
        <div className="rounded-lg border border-py/40 bg-py/10 p-3 text-sm text-ink-100 leading-relaxed">
          <span className="text-py font-medium">Takeaway: </span>
          {takeaway}
        </div>
      )}
    </div>
  );
}
