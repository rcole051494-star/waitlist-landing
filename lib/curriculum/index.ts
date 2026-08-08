import { pythonLessons } from "./python";
import { javascriptLessons } from "./javascript";
import { pythonAiLessons } from "./python-ai";
import { javascriptAiLessons } from "./javascript-ai";
import { pythonProjects } from "./projects-python";
import { javascriptProjects } from "./projects-javascript";
import { aiProjects } from "./projects-ai";
import type { Lesson, Module, Track } from "./types";

const withModule = (ls: Lesson[], m: Module) => ls.map((l) => ({ ...l, module: l.module ?? m }));

export const allLessons: Lesson[] = [
  ...withModule(pythonLessons, "foundation"),
  ...withModule(javascriptLessons, "foundation"),
  ...withModule(pythonAiLessons, "ai"),
  ...withModule(javascriptAiLessons, "ai"),
];

export function lessonsForTrack(track: Track): Lesson[] {
  return allLessons.filter((l) => l.track === track);
}

export function lessonsForTrackModule(track: Track, module: Module): Lesson[] {
  return lessonsForTrack(track).filter((l) => (l.module ?? "foundation") === module);
}

export function findLesson(id: string): Lesson | undefined {
  return allLessons.find((l) => l.id === id);
}

export const allProjects = [...pythonProjects, ...javascriptProjects, ...aiProjects];
export function projectsForTrack(track: Track) {
  return allProjects.filter((p) => p.track === track);
}

export function tracks(): { id: Track; label: string; accent: string; count: number }[] {
  return [
    { id: "python", label: "Python 3.12+", accent: "text-py", count: lessonsForTrack("python").length },
    { id: "javascript", label: "JavaScript ES2024+", accent: "text-js", count: lessonsForTrack("javascript").length },
  ];
}

export const modules: { id: Module; label: string; blurb: string }[] = [
  { id: "foundation", label: "Foundation", blurb: "Language core — every AI engineer needs this cold." },
  { id: "ai", label: "AI Engineering", blurb: "ML foundations + LLM apps with Anthropic & OpenAI." },
];
