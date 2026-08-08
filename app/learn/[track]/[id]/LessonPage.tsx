"use client";
import { Nav } from "@/components/Nav";
import { findLesson } from "@/lib/curriculum";
import { LessonViewer } from "@/components/LessonViewer";

export function LessonPage({ id }: { id: string; track: string }) {
  const lesson = findLesson(id);
  if (!lesson) return null;
  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-20">
        <LessonViewer lesson={lesson} />
      </main>
    </>
  );
}
