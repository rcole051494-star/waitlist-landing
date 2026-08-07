"use client";
import { Nav } from "@/components/Nav";
import { findLesson } from "@/lib/curriculum";
import { LessonViewer } from "@/components/LessonViewer";
import { notFound } from "next/navigation";

export default function LessonPage({ params }: { params: { track: string; id: string } }) {
  const lesson = findLesson(params.id);
  if (!lesson || lesson.track !== params.track) notFound();
  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-6 pt-8 pb-20">
        <LessonViewer lesson={lesson} />
      </main>
    </>
  );
}
