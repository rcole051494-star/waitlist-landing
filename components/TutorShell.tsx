"use client";
import { useTutor } from "@/lib/tutor/context";

// Reserves space on the right for the tutor panel on desktop so it never
// clips lesson content. On mobile the panel is a bottom sheet, so no
// padding adjustment is needed there.
export function TutorShell({ children }: { children: React.ReactNode }) {
  const { open } = useTutor();
  return (
    <div className={`transition-[padding] duration-200 ${open ? "lg:pr-[380px]" : ""}`}>
      {children}
    </div>
  );
}
