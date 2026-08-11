"use client";
import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

// Framer Motion animates regardless of the viewer's motion preference unless
// it's told otherwise. The CSS in globals.css already strips transitions under
// prefers-reduced-motion, but that can't reach animations driven from
// JavaScript — so set the policy once here and every `motion` component in the
// app inherits it.
//
// `reducedMotion="user"` keeps opacity and colour changes (which don't cause
// vestibular trouble) while dropping transform and layout animation for anyone
// who has asked their system for less movement.
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
