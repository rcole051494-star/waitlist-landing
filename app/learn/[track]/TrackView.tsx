"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { lessonsForTrackModule, modules } from "@/lib/curriculum";
import { getLesson } from "@/lib/progress";
import type { Lesson, Track } from "@/lib/curriculum/types";

export function TrackView({ track }: { track: Track }) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const trackLabel = track === "python" ? "Python 3.12+" : "JavaScript ES2024+";
  const accent = track === "python" ? "text-py" : "text-js";
  const dot = track === "python" ? "bg-py" : "bg-js";

  const sections = modules.map((m) => ({ ...m, lessons: lessonsForTrackModule(track, m.id) }));
  const total = sections.reduce((s, sec) => s + sec.lessons.length, 0);
  const doneCount = hydrated
    ? sections
        .flatMap((s) => s.lessons)
        .filter((l) => getLesson(l.id).completedAt).length
    : 0;
  const percent = Math.round((doneCount / total) * 100);

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-20">
        <div className="flex items-baseline justify-between mb-6 gap-3">
          <div className="min-w-0">
            <p className={`text-[11px] sm:text-xs uppercase tracking-[0.2em] ${accent}`}>{trackLabel}</p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-ink-100">
              {track === "python" ? "Python" : "JavaScript"} — {total} lessons
            </h1>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xl sm:text-2xl font-semibold text-ink-100">{percent}%</div>
            <div className="text-[11px] sm:text-xs text-ink-400 uppercase tracking-wider">
              {doneCount} / {total} done
            </div>
          </div>
        </div>

        <div className="h-2 rounded-full bg-ink-800 overflow-hidden mb-10">
          <div className={`h-full ${dot}`} style={{ width: `${percent}%` }} />
        </div>

        {sections.map((sec) => (
          <ModuleSection
            key={sec.id}
            id={sec.id}
            label={sec.label}
            blurb={sec.blurb}
            lessons={sec.lessons}
            track={track}
            hydrated={hydrated}
          />
        ))}
      </main>
    </>
  );
}

function ModuleSection({
  id,
  label,
  blurb,
  lessons,
  track,
  hydrated,
}: {
  id: string;
  label: string;
  blurb: string;
  lessons: Lesson[];
  track: Track;
  hydrated: boolean;
}) {
  if (lessons.length === 0) return null;
  const doneInSection = hydrated
    ? lessons.filter((l) => getLesson(l.id).completedAt).length
    : 0;
  const dotColor = track === "python" ? "bg-py" : "bg-js";
  const modBadge =
    id === "ai"
      ? "bg-gradient-to-r from-py to-js text-ink-950"
      : "bg-ink-800 text-ink-200";

  return (
    <section className="mb-10">
      <div className="flex items-baseline justify-between mb-3 gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] uppercase tracking-[0.16em] font-semibold px-2 py-0.5 rounded ${modBadge}`}>
              {label}
            </span>
            <span className="text-xs text-ink-500">
              {doneInSection} / {lessons.length}
            </span>
          </div>
          <p className="mt-1.5 text-sm text-ink-400">{blurb}</p>
        </div>
      </div>
      <div className="grid gap-3">
        {lessons.map((l) => {
          const state = hydrated ? getLesson(l.id) : null;
          const done = !!state?.completedAt;
          const started = !!state?.startedAt && !done;
          return (
            <Link
              key={l.id}
              href={`/learn/${track}/${l.id}/`}
              className="group flex items-center gap-4 rounded-xl glass hover:bg-ink-900 hover:border-ink-600 active:bg-ink-800 transition p-4"
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
    </section>
  );
}
