import { notFound } from "next/navigation";
import { TrackView } from "./TrackView";
import type { Track } from "@/lib/curriculum/types";

export function generateStaticParams() {
  return [{ track: "python" }, { track: "javascript" }];
}
export const dynamicParams = false;

export default function TrackPage({ params }: { params: { track: string } }) {
  if (params.track !== "python" && params.track !== "javascript") notFound();
  return <TrackView track={params.track as Track} />;
}
