"use client";
import { useState } from "react";
import { InlineProse, Prose } from "./Prose";

// The lesson opener. A tiny snippet, a guess, then the payoff — before any
// explanation exists to lean on. Guessing wrong first primes you to actually
// read the explanation that follows, so this step deliberately doesn't score
// anything: there is no wrong answer, only a reveal.
export function HookStep({
  prompt,
  code,
  answer,
  accept,
  reveal,
  onAttempt,
}: {
  prompt?: string;
  code: string;
  answer: string;
  accept?: string[];
  reveal: string;
  onAttempt: (ok: boolean) => void;
}) {
  const [guess, setGuess] = useState("");
  const [committed, setCommitted] = useState(false);

  const norm = (s: string) => s.trim().replace(/\s+/g, " ");
  const right = [answer, ...(accept ?? [])].some((c) => norm(c) === norm(guess));

  const commit = () => {
    setCommitted(true);
    onAttempt(true); // the guess is the point; being wrong costs nothing
  };

  return (
    <div className="space-y-4">
      <p className="text-ink-200">
        {prompt ?? "No explanation yet — just have a guess. What does this print?"}
      </p>

      <pre className="rounded-xl border border-ink-700 bg-ink-950 p-4 mono text-[13.5px] text-ink-100 overflow-x-auto scrollbar-thin whitespace-pre">
        {code.replace(/\n$/, "")}
      </pre>

      {!committed ? (
        <div className="space-y-3">
          <input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && guess.trim() && commit()}
            placeholder="your guess…"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2 mono text-[13.5px] text-ink-100 outline-none focus:border-ink-500"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={commit}
              disabled={!guess.trim()}
              className="px-4 py-2 rounded-lg bg-ink-100 text-ink-950 text-sm font-medium hover:bg-white transition disabled:opacity-30"
            >
              Lock it in
            </button>
            <button
              onClick={commit}
              className="text-sm text-ink-400 hover:text-ink-100 transition"
            >
              No idea — just show me
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="rounded-lg border border-ink-700 bg-ink-900/60 p-3">
              <div className="text-[11px] uppercase tracking-wider text-ink-500 mb-1">
                You said
              </div>
              <div className="mono text-[13px] text-ink-200 break-words">
                {guess.trim() || "—"}
              </div>
            </div>
            <div className="rounded-lg border border-good/40 bg-good/10 p-3">
              <div className="text-[11px] uppercase tracking-wider text-ink-500 mb-1">
                It prints
              </div>
              <pre className="mono text-[13px] text-ink-100 whitespace-pre-wrap">{answer}</pre>
            </div>
          </div>

          <p className="text-sm text-ink-400">
            {right
              ? "Spot on — so you already have the instinct. The rest of this lesson is about why."
              : "That's the interesting bit. Here's what's going on:"}
          </p>

          <div className="rounded-lg border border-ink-700 bg-ink-900/60 p-4">
            <Prose text={reveal} />
          </div>
        </div>
      )}
    </div>
  );
}
