import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Join class names, letting later Tailwind classes win over earlier ones that
 * set the same property.
 *
 * `clsx` handles the conditional forms — arrays, objects, falsy values — and
 * `twMerge` resolves the conflicts, so `cn("p-2", "p-4")` gives `p-4` rather
 * than both. That matters for components that take a `className` prop: without
 * the merge, a caller's override and the component's default both end up in
 * the list and which one applies depends on CSS source order rather than
 * intent.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
