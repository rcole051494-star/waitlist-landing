"use client";
import { InlineProse } from "./Prose";
import { useEffect, useState } from "react";

// Sort items into categories. Tap an item to pick it up, tap a bucket to drop
// it — no dragging, so it behaves identically on phone and desktop. Good for
// the either/or distinctions that trip people up (mutable vs immutable,
// truthy vs falsy), where the point is committing the category to memory.

type Item = { text: string; bucket: number; why?: string };

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function CategorizeStep({
  prompt,
  buckets,
  items,
  onAttempt,
}: {
  prompt: string;
  buckets: string[];
  items: Item[];
  onAttempt: (ok: boolean) => void;
}) {
  // placement[itemIndex] = bucket index, or null while still unsorted
  const [placement, setPlacement] = useState<(number | null)[]>([]);
  const [pool, setPool] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setPlacement(items.map(() => null));
    setPool(shuffle(items.map((_, i) => i)));
    setSelected(null);
    setChecked(false);
  }, [items]);

  const place = (bucketIdx: number) => {
    if (selected === null) return;
    setPlacement((prev) => {
      const next = prev.slice();
      next[selected] = bucketIdx;
      return next;
    });
    setPool((prev) => prev.filter((i) => i !== selected));
    setSelected(null);
    setChecked(false);
  };

  const removeFromBucket = (itemIdx: number) => {
    if (checked) return;
    setPlacement((prev) => {
      const next = prev.slice();
      next[itemIdx] = null;
      return next;
    });
    setPool((prev) => (prev.includes(itemIdx) ? prev : [...prev, itemIdx]));
    setChecked(false);
  };

  const allPlaced = placement.length > 0 && placement.every((p) => p !== null);
  const check = () => {
    setChecked(true);
    onAttempt(items.every((it, i) => placement[i] === it.bucket));
  };
  const allRight = checked && items.every((it, i) => placement[i] === it.bucket);

  const reset = () => {
    setPlacement(items.map(() => null));
    setPool(shuffle(items.map((_, i) => i)));
    setSelected(null);
    setChecked(false);
  };

  return (
    <div className="space-y-4">
      <p className="text-ink-200">{prompt}</p>
      <p className="text-xs text-ink-400">Tap an item to pick it up, then tap a category to drop it in.</p>

      {/* Unsorted pool */}
      <div className="min-h-[3rem] rounded-xl border border-dashed border-ink-700 bg-ink-950/50 p-2.5 flex flex-wrap gap-2">
        {pool.length === 0 && (
          <span className="text-xs text-ink-500 self-center px-1">
            All sorted — hit Check below.
          </span>
        )}
        {pool.map((i) => (
          <button
            key={i}
            onClick={() => setSelected(selected === i ? null : i)}
            className={`mono text-[13px] px-2.5 py-1.5 rounded-lg border transition ${
              selected === i
                ? "border-py bg-py/15 text-ink-100 shadow-glow"
                : "border-ink-700 bg-ink-900 text-ink-200 hover:bg-ink-800"
            }`}
          >
            {items[i].text}
          </button>
        ))}
      </div>

      {/* Buckets */}
      <div className="grid sm:grid-cols-2 gap-3">
        {buckets.map((b, bi) => (
          <div key={bi} className="rounded-xl glass overflow-hidden">
            <button
              onClick={() => place(bi)}
              disabled={selected === null}
              className={`w-full text-left px-3 py-2 text-sm font-medium border-b border-ink-800 transition ${
                selected !== null
                  ? "bg-py/10 text-ink-100 hover:bg-py/20 cursor-pointer"
                  : "text-ink-300"
              }`}
            >
              {b}
              {selected !== null && <span className="text-py text-xs ml-2">tap to drop here</span>}
            </button>
            <div className="p-2.5 flex flex-wrap gap-2 min-h-[3rem]">
              {placement.map((p, ii) =>
                p === bi ? (
                  <button
                    key={ii}
                    onClick={() => removeFromBucket(ii)}
                    className={`mono text-[13px] px-2.5 py-1.5 rounded-lg border transition ${
                      checked
                        ? items[ii].bucket === bi
                          ? "border-good bg-good/10 text-good"
                          : "border-bad bg-bad/10 text-bad"
                        : "border-ink-600 bg-ink-800 text-ink-100 hover:border-ink-500"
                    }`}
                  >
                    {items[ii].text}
                    {checked && (
                      <span className="ml-1.5">{items[ii].bucket === bi ? "✓" : "✗"}</span>
                    )}
                  </button>
                ) : null
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={check}
          disabled={!allPlaced}
          className="px-4 py-2 rounded-lg bg-ink-100 text-ink-950 text-sm font-medium hover:bg-white transition disabled:opacity-40"
        >
          Check
        </button>
        <button
          onClick={reset}
          className="px-3 py-2 rounded-lg text-sm text-ink-400 hover:text-ink-100 hover:bg-ink-800 transition"
        >
          Reset
        </button>
        {allRight && <span className="text-good text-sm">✓ all sorted correctly</span>}
        {checked && !allRight && (
          <span className="text-warm text-sm">
            △ the red ones are in the wrong category — tap to take them back out
          </span>
        )}
      </div>

      {/* Explanations for whatever they got wrong */}
      {checked && !allRight && (
        <div className="space-y-1.5">
          {items.map((it, i) =>
            placement[i] !== it.bucket && it.why ? (
              <div key={i} className="text-sm text-ink-300 border-l-2 border-warm pl-3">
                <code className="mono text-ink-100">{it.text}</code> belongs in{" "}
                <b className="text-ink-100">{buckets[it.bucket]}</b> — <InlineProse text={it.why} />
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
