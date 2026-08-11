"use client";
import { InlineProse } from "./Prose";
import { Bloom } from "./Bloom";
import { useEffect, useRef, useState } from "react";
import { StuckHelp } from "./StuckHelp";

// Parsons problem: the correct lines, shuffled — the learner puts them in order.
// Dragging uses pointer events so one code path covers mouse and touch. A grip
// handle carries `touch-action: none` so dragging works on phones without
// hijacking page scroll, and arrow buttons give a precise, accessible fallback.

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function ParsonsStep({
  prompt,
  solution,
  expectedOutput,
  hints,
  explanation,
  onAttempt,
}: {
  prompt: string;
  solution: string[];
  expectedOutput?: string;
  hints?: string[];
  explanation?: string;
  onAttempt: (ok: boolean) => void;
}) {
  const [order, setOrder] = useState<string[]>([]);
  const [checked, setChecked] = useState<null | boolean>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    // Shuffle until it isn't already the answer (unless there's only one line).
    let s = shuffle(solution);
    let guard = 0;
    while (solution.length > 1 && s.every((l, i) => l === solution[i]) && guard++ < 20) {
      s = shuffle(solution);
    }
    setOrder(s);
    setChecked(null);
  }, [solution]);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length || from === to) return;
    setOrder((prev) => {
      const next = prev.slice();
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
    setChecked(null);
  };

  const onPointerDown = (i: number) => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setDragIdx(i);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragIdx === null) return;
    const y = e.clientY;
    // Find the row whose vertical midpoint the pointer has crossed.
    for (let i = 0; i < itemRefs.current.length; i++) {
      const el = itemRefs.current[i];
      if (!el || i === dragIdx) continue;
      const r = el.getBoundingClientRect();
      const mid = r.top + r.height / 2;
      if ((i < dragIdx && y < mid) || (i > dragIdx && y > mid)) {
        move(dragIdx, i);
        setDragIdx(i);
        break;
      }
    }
  };

  const endDrag = () => setDragIdx(null);

  const check = () => {
    const ok = order.length === solution.length && order.every((l, i) => l === solution[i]);
    setChecked(ok);
    onAttempt(ok);
  };

  const reshuffle = () => {
    setOrder(shuffle(solution));
    setChecked(null);
  };

  return (
    <div className="space-y-4">
      <p className="text-ink-200">{prompt}</p>
      <p className="text-xs text-ink-400">
        Drag the grip <span className="mono">⠿</span> to reorder, or use the ↑ ↓ buttons.
      </p>

      <ul
        className="space-y-1.5 select-none"
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {order.map((line, i) => {
          const isDragging = dragIdx === i;
          return (
            <li
              key={`${line}-${i}`}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className={`flex items-stretch gap-2 rounded-lg border transition-shadow ${
                isDragging
                  ? "border-py bg-ink-800 shadow-glow"
                  : checked === true
                  ? "border-good/40 bg-good/5"
                  : "border-ink-700 bg-ink-900"
              }`}
            >
              <button
                onPointerDown={onPointerDown(i)}
                className="px-2 grid place-items-center text-ink-500 hover:text-ink-200 cursor-grab active:cursor-grabbing rounded-l-lg"
                style={{ touchAction: "none" }}
                aria-label={`Drag line ${i + 1}`}
              >
                ⠿
              </button>
              <pre className="flex-1 py-2 mono text-[13px] text-ink-100 overflow-x-auto scrollbar-thin whitespace-pre">
                {line}
              </pre>
              <div className="flex flex-col justify-center pr-1.5 gap-0.5">
                <button
                  onClick={() => move(i, i - 1)}
                  disabled={i === 0}
                  className="w-6 h-5 grid place-items-center rounded text-[11px] text-ink-400 hover:text-ink-100 hover:bg-ink-800 transition disabled:opacity-20"
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => move(i, i + 1)}
                  disabled={i === order.length - 1}
                  className="w-6 h-5 grid place-items-center rounded text-[11px] text-ink-400 hover:text-ink-100 hover:bg-ink-800 transition disabled:opacity-20"
                  aria-label="Move down"
                >
                  ↓
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={check}
          className="px-4 py-2 rounded-lg bg-ink-100 text-ink-950 text-sm font-medium hover:bg-white transition"
        >
          Check order
        </button>
        <button
          onClick={reshuffle}
          className="px-3 py-2 rounded-lg text-sm text-ink-400 hover:text-ink-100 hover:bg-ink-800 transition"
        >
          Shuffle again
        </button>
        {checked === true && <span className="text-good text-sm">✓ that's the right order</span>}
        {checked === false && (
          <span className="text-warm text-sm">△ not yet — read it top to bottom and see what happens too early</span>
        )}
      </div>

      {expectedOutput && (
        <details className="text-xs text-ink-400">
          <summary className="cursor-pointer hover:text-ink-200">
            What should this program print?
          </summary>
          <pre className="mt-2 rounded-lg surface-code p-3 mono text-ink-200 whitespace-pre-wrap">
            {expectedOutput}
          </pre>
        </details>
      )}

      {checked !== true && <StuckHelp hints={hints} />}

      {checked === true && explanation && (
        <Bloom tone="good" active pulse>
          <div className="rounded-lg border border-good/40 bg-good/10 p-3 text-sm text-ink-100 leading-relaxed">
            <InlineProse text={explanation} />
          </div>
        </Bloom>
      )}
    </div>
  );
}
