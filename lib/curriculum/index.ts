import { pythonLessons } from "./python";
import { javascriptLessons } from "./javascript";
import type { Lesson, Track } from "./types";
import { pythonProjects } from "./projects-python";
import { javascriptProjects } from "./projects-javascript";

export const allLessons: Lesson[] = [...pythonLessons, ...javascriptLessons];

export function lessonsForTrack(track: Track): Lesson[] {
  return track === "python" ? pythonLessons : javascriptLessons;
}

export function findLesson(id: string): Lesson | undefined {
  return allLessons.find((l) => l.id === id);
}

export const allProjects = [...pythonProjects, ...javascriptProjects];
export function projectsForTrack(track: Track) {
  return track === "python" ? pythonProjects : javascriptProjects;
}

export function tracks(): { id: Track; label: string; accent: string; count: number }[] {
  return [
    { id: "python", label: "Python 3.12+", accent: "text-py", count: pythonLessons.length },
    { id: "javascript", label: "JavaScript ES2024+", accent: "text-js", count: javascriptLessons.length },
  ];
}
