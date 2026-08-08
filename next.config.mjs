import { PHASE_PRODUCTION_BUILD } from "next/constants.js";

/** @type {(phase: string) => import('next').NextConfig} */
export default (phase) => {
  const isBuild = phase === PHASE_PRODUCTION_BUILD;
  return {
    reactStrictMode: true,
    images: { unoptimized: true },
    trailingSlash: true,
    // Static export only for production builds (needed for Capacitor / PWA).
    // In dev mode, keep the normal server so dynamic routes work interactively
    // without generateStaticParams enforcement quirks.
    ...(isBuild ? { output: "export" } : {}),
  };
};
