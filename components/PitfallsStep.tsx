"use client";
import type { Pitfall } from "@/lib/curriculum/types";
import { Prose } from "./Prose";

// Shows the mistakes a learner is about to make, before they make them.
// Seeing a wrong version next to the right one — and understanding *why*
// it's wrong — builds a sharper mental model than only ever seeing correct code.
export function PitfallsStep({ intro, items }: { intro?: string; items: Pitfall[] }) {
  return (
    <div className="space-y-4">
      {intro ? <Prose text={intro} /> : (
        <p className="text-ink-300">
          These are the mistakes almost everyone makes here. Recognising them now saves you a lot of
          confused debugging later.
        </p>
      )}

      {items.map((p, i) => (
        <div key={i} className="rounded-xl border border-ink-800 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-bad/10 border-b border-bad/25">
            <span className="text-bad text-sm">✗</span>
            <span className="text-[11px] uppercase tracking-wider text-bad">Don't do this</span>
          </div>
          <pre className="p-3 mono text-[13px] text-ink-200 bg-ink-950 overflow-x-auto scrollbar-thin whitespace-pre">
            {p.wrong}
          </pre>

          <div className="px-3 py-2.5 bg-ink-900/60 text-sm text-ink-200 leading-relaxed border-t border-ink-800">
            {p.problem}
          </div>

          {p.right && (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-good/10 border-y border-good/25">
                <span className="text-good text-sm">✓</span>
                <span className="text-[11px] uppercase tracking-wider text-good">Do this instead</span>
              </div>
              <pre className="p-3 mono text-[13px] text-ink-100 bg-ink-950 overflow-x-auto scrollbar-thin whitespace-pre">
                {p.right}
              </pre>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
