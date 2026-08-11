"use client";
import { useEffect, useRef, useState } from "react";

export type BloomTone = "focus" | "good" | "warm" | "bad" | "teal";

// A soft radial glow behind a piece of content, switched on by state.
//
// The point is to make the one thing that matters right now visually louder
// than everything around it — the step you're on, the answer you just got
// wrong, the explanation that just unlocked. Deliberately not hover-driven:
// there is no hover on the Android build, and a cursor position is a poor
// guess at what someone is thinking about anyway.
export function Bloom({
  tone = "focus",
  active,
  pulse = false,
  className = "",
  children,
}: {
  tone?: BloomTone;
  active: boolean;
  /** Play a one-shot swell the moment it turns on — for results and reveals. */
  pulse?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  // Only pulse on the transition into active, never on a re-render that
  // happens to find it already on.
  const [justTurnedOn, setJustTurnedOn] = useState(false);
  const wasActive = useRef(active);

  useEffect(() => {
    if (active && !wasActive.current) {
      setJustTurnedOn(true);
      const t = setTimeout(() => setJustTurnedOn(false), 700);
      wasActive.current = active;
      return () => clearTimeout(t);
    }
    wasActive.current = active;
  }, [active]);

  return (
    <div className={`relative ${className}`}>
      <div
        aria-hidden
        className={`bloom-layer bloom-${tone} ${active ? "bloom-on" : ""} ${
          pulse && justTurnedOn ? "bloom-pulse" : ""
        }`}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
