"use client";
import { useState } from "react";
import { Nav } from "@/components/Nav";
import { allProjects } from "@/lib/curriculum";
import type { Project } from "@/lib/curriculum/types";
import { Runner } from "@/components/Runner";

export default function ProjectsPage() {
  const [current, setCurrent] = useState<Project | null>(null);
  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-6 pt-10 pb-20">
        <p className="text-xs uppercase tracking-[0.2em] text-ink-400">apply what you've learned</p>
        <h1 className="mt-2 text-3xl font-bold text-ink-100">Projects</h1>
        <p className="mt-2 text-ink-300 max-w-2xl">
          Small, focused builds that force you to compose skills. Every project has a success
          check — your solution has to actually work.
        </p>

        {current ? (
          <div className="mt-10">
            <button
              onClick={() => setCurrent(null)}
              className="text-sm text-ink-400 hover:text-ink-100 mb-4 transition"
            >
              ← All projects
            </button>
            <ProjectView project={current} />
          </div>
        ) : (
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            {allProjects.map((p) => (
              <button
                key={p.id}
                onClick={() => setCurrent(p)}
                className="text-left rounded-2xl border border-ink-800 bg-ink-900/40 hover:bg-ink-900 hover:border-ink-600 transition p-5"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      p.track === "python" ? "bg-py/20 text-py" : "bg-js/20 text-js"
                    }`}
                  >
                    {p.track === "python" ? "Python" : "JavaScript"}
                  </span>
                  <h3 className="font-semibold text-ink-100">{p.title}</h3>
                </div>
                <p className="text-sm text-ink-400 mt-2">{p.summary}</p>
                <div className="text-xs text-ink-500 mt-3">Tap to open →</div>
              </button>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

function ProjectView({ project }: { project: Project }) {
  const [passed, setPassed] = useState(false);
  const [showHints, setShowHints] = useState(false);
  return (
    <div className="grid lg:grid-cols-[280px_minmax(0,1fr)] gap-6">
      <aside className="rounded-2xl border border-ink-800 bg-ink-900/60 p-4 self-start">
        <div
          className={`text-xs px-2 py-0.5 rounded inline-block ${
            project.track === "python" ? "bg-py/20 text-py" : "bg-js/20 text-js"
          }`}
        >
          {project.track === "python" ? "Python" : "JavaScript"}
        </div>
        <h2 className="mt-3 text-lg font-semibold text-ink-100">{project.title}</h2>
        <p className="mt-1 text-sm text-ink-400">{project.summary}</p>
        <div className="mt-4 rounded-lg border border-ink-700 bg-ink-950/50 p-3 text-sm text-ink-200">
          <b className="text-ink-100">Goal:</b> {project.goal}
        </div>
        <button
          onClick={() => setShowHints((s) => !s)}
          className="mt-3 text-sm text-ink-400 hover:text-ink-100 transition"
        >
          {showHints ? "Hide hints" : "Show hints"}
        </button>
        {showHints && (
          <ul className="mt-2 space-y-2 text-sm text-ink-300">
            {project.hints.map((h, i) => (
              <li key={i} className="border-l-2 border-warm pl-3">
                {h}
              </li>
            ))}
          </ul>
        )}
        {passed && (
          <div className="mt-4 rounded-lg border border-good bg-good/10 text-good text-sm p-3">
            🎉 Project passed! You built the thing.
          </div>
        )}
      </aside>
      <section>
        <Runner
          initial={project.starter}
          track={project.track}
          height={340}
          runLabel="Run project"
          onResult={(r) => setPassed(project.successCheck(r.stdout))}
        />
        <div className="mt-4 text-sm text-ink-400">
          {passed
            ? "Success check passed. Try to simplify your solution — half as many lines is often twice as clear."
            : "Success check pending — run your code above."}
        </div>
      </section>
    </div>
  );
}
