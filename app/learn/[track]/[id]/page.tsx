import { notFound } from "next/navigation";
import { allLessons, findLesson } from "@/lib/curriculum";
import { LessonPage } from "./LessonPage";

export function generateStaticParams() {
  return allLessons.map((l) => ({ track: l.track, id: l.id }));
}
export const dynamicParams = false;

export default function Page({ params }: { params: { track: string; id: string } }) {
  const lesson = findLesson(params.id);
  if (!lesson || lesson.track !== params.track) notFound();
  return <LessonPage id={params.id} track={params.track} />;
}
