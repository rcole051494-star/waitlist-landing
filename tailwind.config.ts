import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#07080b",
          900: "#0b0d12",
          850: "#0f121a",
          800: "#141824",
          700: "#1b2130",
          600: "#242c3f",
          500: "#39445f",
          400: "#6b7594",
          300: "#a2adc6",
          200: "#cfd6e6",
          100: "#e8ecf6",
        },
        py: { DEFAULT: "#3b82f6", accent: "#60a5fa" },
        js: { DEFAULT: "#f5b301", accent: "#fbbf24" },
        good: "#22c55e",
        bad: "#ef4444",
        warm: "#f59e0b",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Inter", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "JetBrains Mono", "Menlo", "monospace"],
      },
      boxShadow: {
        soft: "0 2px 20px -8px rgba(0,0,0,0.35)",
        glow: "0 0 0 1px rgba(96,165,250,0.4), 0 6px 32px -12px rgba(96,165,250,0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
