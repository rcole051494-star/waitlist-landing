"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { lessonsForTrack } from "@/lib/curriculum";
import { getLesson } from "@/lib/progress";
import type { Track } from "@/lib/curriculum/types";
import { notFound } from "next/navigation";

export default function TrackPage({ params }: { params: { track: string } }) {
  const track = params.track as Track;
  if (track !== "python" && track !== "javascript") notFound();

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const lessons = lessonsForTrack(track);
  const trackLabel = track === "python" ? "Python 3.12+" : "JavaScript ES2024+";
  const accent = track === "python" ? "text-py" : "text-js";
  const dot = track === "python" ? "bg-py" : "bg-js";
  const doneCount = hydrated
    ? lessons.filter((l) => getLesson(l.id).completedAt).length
    : 0;
  const percent = Math.round((doneCount / lessons.length) * 100);

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-6 pt-10 pb-20">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <p className={`text-xs uppercase tracking-[0.2em] ${accent}`}>{trackLabel}</p>
            <h1 className="mt-2 text-3xl font-bold text-ink-100">
              {track === "python" ? "Python" : "JavaScript"} — {lessons.length} lessons
            </h1>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold text-ink-100">{percent}%</div>
            <div className="text-xs text-ink-400 uppercase tracking-wider">
              {doneCount} / {lessons.length} complete
            </div>
          </div>
        </div>

        <div className="h-2 rounded-full bg-ink-800 overflow-hidden mb-8">
          <div className={`h-full ${dot}`} style={{ width: `${percent}%` }} />
        </div>

        <div className="grid gap-3">
          {lessons.map((l) => {
            const state = hydrated ? getLesson(l.id) : null;
            const done = !!state?.completedAt;
            const started = !!state?.startedAt && !done;
            return (
              <Link
                key={l.id}
                href={`/learn/${track}/${l.id}`}
                className="group flex items-center gap-4 rounded-xl border border-ink-800 bg-ink-900/40 hover:bg-ink-900 hover:border-ink-600 transition p-4"
              >
                <span
                  className={`w-10 h-10 shrink-0 rounded-lg grid place-items-center text-sm font-semibold ${
                    done
                      ? "bg-good/20 text-good"
                      : started
                      ? "bg-warm/20 text-warm"
                      : "bg-ink-800 text-ink-300"
                  }`}
                >
                  {done ? "✓" : String(l.index).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-ink-100 truncate">
                    {l.title}
                    {started && <span className="ml-2 text-xs text-warm">• in progress</span>}
                  </h3>
                  <p className="text-sm text-ink-400 truncate">{l.summary}</p>
                </div>
                <span className="text-ink-500 group-hover:text-ink-100 transition">→</span>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
