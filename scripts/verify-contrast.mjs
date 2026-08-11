// Checks the colour pairs the interface actually uses against WCAG 2.1
// contrast minimums. Glass surfaces are translucent, so the effective
// background is composited against the page beneath before measuring —
// checking the token in isolation would flatter it.
//
// Usage: npm run verify:contrast
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const hex = (h) => {
  const s = h.replace("#", "");
  const n = s.length === 3 ? s.split("").map((c) => c + c).join("") : s;
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
};

// Composite a translucent colour over an opaque one.
const over = (fg, alpha, bg) => fg.map((c, i) => c * alpha + bg[i] * (1 - alpha));

const luminance = (rgb) => {
  const [r, g, b] = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const ratio = (a, b) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

// Pull the palette straight from the Tailwind config so this can't drift.
const cfg = readFileSync(join(ROOT, "tailwind.config.ts"), "utf8");
const tokens = {};
for (const [, name, value] of cfg.matchAll(/(\w+):\s*"(#[0-9a-fA-F]{3,8})"/g)) tokens[name] = value;
for (const [, scale, body] of cfg.matchAll(/(ink|py|js):\s*\{([^}]*)\}/g))
  for (const [, k, v] of body.matchAll(/(\w+):\s*"(#[0-9a-fA-F]{3,6})"/g))
    tokens[`${scale}-${k}`] = v;

const t = (name) => {
  if (!tokens[name]) throw new Error(`no such colour token: ${name}`);
  return hex(tokens[name]);
};

const BASE = t("ink-950");

// This file does the deterministic half: token against token, no browser.
// The page also carries a radial wash over the base, which lightens the
// ground under a glass panel — modelling that analytically means guessing at
// where the gradients peak, so verify-ui.mjs measures it from a real render
// instead and checks contrast against the brightest pixel it finds.
const PAGE = BASE;
// The glass surfaces lighten whatever is behind them by this much (see
// .glass in globals.css). Text sits on the composited result.
const GLASS = over([255, 255, 255], 0.045, PAGE);
const GLASS_STRONG = over([255, 255, 255], 0.07, PAGE);

const AA = 4.5; // body text
const AA_LARGE = 3.0; // 18.66px bold / 24px, and UI component boundaries

const checks = [
  ["body text on the base colour", t("ink-100"), PAGE, AA],
  ["body text on glass", t("ink-100"), GLASS, AA],
  ["secondary text on glass", t("ink-200"), GLASS, AA],
  ["muted prose on glass", t("ink-300"), GLASS, AA],
  ["dim labels on glass", t("ink-400"), GLASS, AA_LARGE],
  ["dim labels on the page", t("ink-400"), PAGE, AA_LARGE],
  ["body text on a strong glass panel", t("ink-100"), GLASS_STRONG, AA],
  ["code text on the editor ground", t("ink-100"), t("ink-950"), AA],
  ["Python accent on the page", t("py-DEFAULT"), PAGE, AA_LARGE],
  ["Python accent text on glass", t("py-accent"), GLASS, AA],
  ["JavaScript accent on the page", t("js-DEFAULT"), PAGE, AA_LARGE],
  ["JavaScript accent text on glass", t("js-accent"), GLASS, AA],
  ["correct-answer green on glass", t("good"), GLASS, AA],
  ["wrong-answer red on glass", t("bad"), GLASS, AA_LARGE],
  ["warm highlight on glass", t("warm"), GLASS, AA],
  ["dark text on a light button", t("ink-950"), t("ink-100"), AA],
];

let failed = 0;
for (const [label, fg, bg, min] of checks) {
  const r = ratio(fg, bg);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? "  ok  " : "  FAIL"} ${r.toFixed(2)}:1 (needs ${min}) — ${label}`);
}

console.log(failed ? `\n${failed} colour pair(s) below WCAG AA` : "\nall colour pairs meet WCAG AA");
process.exit(failed ? 1 : 0);
