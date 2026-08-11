"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /** Lift slightly on first paint. Suppressed automatically for anyone who
   *  has asked their system for reduced motion (see MotionProvider). */
  animate?: boolean;
}

// A frosted panel, on top of the same `.glass` utility the rest of the app
// uses — so the blur, tint and border stay in one place and the contrast
// check in scripts/verify-contrast.mjs keeps covering it.
export function GlassCard({ children, className, animate = true }: GlassCardProps) {
  if (!animate) {
    return <div className={cn("glass rounded-2xl p-5", className)}>{children}</div>;
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn("glass rounded-2xl p-5", className)}
    >
      {children}
    </motion.div>
  );
}
