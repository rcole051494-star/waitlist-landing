import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Deep indigo-black rather than neutral grey: the same luminance
        // ladder as before, rotated toward the cool end. Every pairing that
        // ships is checked by scripts/verify-contrast.mjs.
        ink: {
          950: "#05070f",
          900: "#080c17",
          850: "#0c1121",
          800: "#111829",
          700: "#18223a",
          600: "#213052",
          500: "#374d75",
          400: "#7286ab",
          300: "#a8b6d2",
          200: "#d2dbec",
          100: "#eaeff9",
        },
        py: { DEFAULT: "#3b82f6", accent: "#60a5fa" },
        js: { DEFAULT: "#f5b301", accent: "#fbbf24" },
        good: "#22c55e",
        bad: "#ef4444",
        warm: "#f59e0b",
        teal: "#2dd4bf",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Inter", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "JetBrains Mono", "Menlo", "monospace"],
      },
      boxShadow: {
        soft: "0 2px 20px -8px rgba(0,0,0,0.45)",
        glow: "0 0 0 1px rgba(96,165,250,0.4), 0 6px 32px -12px rgba(96,165,250,0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
