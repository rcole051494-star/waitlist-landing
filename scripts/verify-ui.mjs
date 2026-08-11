// Checks the interface behaves as designed in a real browser.
//
// The blooms are meant to be driven by application state, not by hover — the
// Android build has no cursor — so these assertions deliberately never move a
// mouse. They change state and check the glow follows.
//
// Usage: npm run build && npm run verify:ui
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "out");
const TYPES = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".txt": "text/plain",
  ".wasm": "application/wasm", ".zip": "application/zip", ".svg": "image/svg+xml",
  ".png": "image/png", ".ico": "image/x-icon", ".webmanifest": "application/manifest+json",
};

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(req.url.split("?")[0]);
  for (const candidate of [join(OUT, path), join(OUT, path, "index.html")]) {
    try {
      if (!(await stat(candidate)).isFile()) continue;
      res.writeHead(200, { "content-type": TYPES[extname(candidate)] ?? "application/octet-stream" });
      res.end(await readFile(candidate));
      return;
    } catch {}
  }
  res.writeHead(404).end("not found");
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}`;

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log(`  FAIL ${m}`); } };

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });

// How lit is the glow behind this element, 0 to 1?
const bloomOpacity = (scope) =>
  scope.evaluate((el) => {
    const layer = el.querySelector(".bloom-layer") ?? el.closest(".relative")?.querySelector(".bloom-layer");
    return layer ? Number(getComputedStyle(layer).opacity) : -1;
  });

// ------------------------------------------------------ state, not hover ----
{
  const page = await browser.newPage();
  page.on("pageerror", (e) => { console.log("  FAIL page error:", e.message); fail++; });
  await page.goto(`${BASE}/learn/javascript/js.02.numbers/`, { waitUntil: "networkidle" });

  console.log("hook reveal blooms on answering");
  // The navigator's active-step glow is lit on arrival by design, so scope
  // this to the lesson body, which should be dark until you do something.
  ok(
    (await page.locator("section .bloom-on").count()) === 0,
    "the lesson body is unlit before you act"
  );
  ok(
    (await page.locator("aside .bloom-on").count()) === 1,
    "the step you are on is lit from the moment you arrive"
  );

  await page.locator("main input").first().fill("0.30000000000000004");
  await page.getByRole("button", { name: /Lock it in/ }).click();
  await page.waitForTimeout(900);
  ok((await page.locator("section .bloom-on").count()) > 0, "the reveal lights up once you commit");

  console.log("the active step is the lit one in the sidebar");
  const litTitles = await page.locator("aside li .bloom-on").count();
  ok(litTitles === 1, `exactly one step is lit in the navigator (got ${litTitles})`);

  console.log("a wrong answer blooms warm, a right one green");
  await page.getByRole("button", { name: /Plus is not like minus/ }).last().click();
  await page.waitForTimeout(300);
  const boxes = page.locator("main textarea");
  await boxes.nth(0).fill("53");
  await boxes.nth(1).fill("wrong");
  await page.getByRole("button", { name: /Check both/ }).click();
  await page.waitForTimeout(800);
  let tone = await page.evaluate(() => {
    const l = [...document.querySelectorAll("section .bloom-on")].pop();
    return l ? getComputedStyle(l).getPropertyValue("--bloom").trim() : "";
  });
  ok(/245\s*,\s*158\s*,\s*11/.test(tone), `a wrong answer glows warm amber (got ${tone || "nothing"})`);

  await boxes.nth(1).fill("2");
  await page.getByRole("button", { name: /Check both/ }).click();
  await page.waitForTimeout(800);
  tone = await page.evaluate(() => {
    const l = [...document.querySelectorAll("section .bloom-on")].pop();
    return l ? getComputedStyle(l).getPropertyValue("--bloom").trim() : "";
  });
  ok(/34\s*,\s*197\s*,\s*94/.test(tone), `both right glows green (got ${tone || "nothing"})`);

  console.log("glass surfaces are actually frosted");
  const blurred = await page.evaluate(() => {
    const el = document.querySelector(".glass");
    if (!el) return null;
    const s = getComputedStyle(el);
    return s.backdropFilter || s.webkitBackdropFilter;
  });
  ok(blurred && /blur/.test(blurred), `glass applies a backdrop blur (got ${blurred})`);

  console.log("code keeps an opaque ground");
  const codeBg = await page.evaluate(() => {
    const el = document.querySelector(".surface-code");
    return el ? getComputedStyle(el).backgroundColor : null;
  });
  ok(codeBg && !/rgba\([^)]*,\s*0?\.\d+\)/.test(codeBg), `code panels stay opaque (got ${codeBg})`);
  await page.close();
}

// ------------------------------------------------------------ no motion ----
{
  console.log("nothing animates on a loop");
  const page = await browser.newPage();
  await page.goto(`${BASE}/learn/python/py.05.control/`, { waitUntil: "networkidle" });
  const looping = await page.evaluate(() =>
    [...document.querySelectorAll("*")].some((el) => {
      const s = getComputedStyle(el);
      return s.animationName !== "none" && s.animationIterationCount === "infinite";
    })
  );
  ok(!looping, "no element animates infinitely");

  const bodyAnim = await page.evaluate(() => getComputedStyle(document.body, "::before").animationName);
  ok(bodyAnim === "none", "the background wash is still");
  await page.close();
}

// -------------------------------------------------- prefers-reduced-motion ----
{
  console.log("reduced motion is honoured");
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/learn/javascript/js.02.numbers/`, { waitUntil: "networkidle" });
  await page.locator("main input").first().fill("0.30000000000000004");
  await page.getByRole("button", { name: /Lock it in/ }).click();
  await page.waitForTimeout(400);

  const durations = await page.evaluate(() => {
    const el = document.querySelector(".bloom-layer");
    if (!el) return null;
    const s = getComputedStyle(el);
    return { transition: s.transitionDuration, animation: s.animationDuration };
  });
  ok(durations !== null, "a bloom layer is present");
  if (durations) {
    const secs = (v) => Math.max(...String(v).split(",").map((x) => parseFloat(x) || 0));
    ok(secs(durations.transition) < 0.01, `transitions are cut (got ${durations.transition})`);
    ok(secs(durations.animation) < 0.01, `animations are cut (got ${durations.animation})`);
  }
  // The glow is information, so it must still be visible — just not animated.
  ok((await page.locator("section .bloom-on").count()) > 0, "the glow still appears with motion reduced");
  await ctx.close();
}

// ------------------------------------------------- javascript-driven motion ----
// The CSS reduced-motion block can't reach animations driven from JavaScript,
// so the app wraps everything in MotionConfig reducedMotion="user". Verified
// by hand that this suppresses interpolation (y snaps 8 → 0 instead of easing);
// this guard just makes sure the wrapper doesn't quietly disappear.
{
  console.log("framer-motion inherits the reduced-motion policy");
  const layout = await readFile(join(dirname(fileURLToPath(import.meta.url)), "..", "app", "layout.tsx"), "utf8");
  ok(/MotionProvider/.test(layout), "the root layout wraps the tree in MotionProvider");
  const provider = await readFile(
    join(dirname(fileURLToPath(import.meta.url)), "..", "components", "MotionProvider.tsx"),
    "utf8"
  );
  ok(/reducedMotion=["']user["']/.test(provider), 'MotionConfig is set to reducedMotion="user"');
}

// ------------------------------------------ contrast against the real wash ----
// The page carries a radial wash over its base colour, so the ground under a
// glass panel is brighter in some places than others. Rather than guess where
// the gradients peak, screenshot the painted background and measure the
// brightest pixel it actually produces, then check the text tokens against it.
{
  console.log("text stays legible over the brightest part of the wash");
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  // Hide everything except the painted background.
  await page.evaluate(() => {
    document.querySelectorAll("body > *").forEach((el) => (el.style.visibility = "hidden"));
  });
  // screenshot() hands back a Buffer; base64 it ourselves for the data URL.
  const shot = (await page.screenshot()).toString("base64");

  // Let the browser decode its own PNG, then read the pixels back.
  const brightest = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = "data:image/png;base64," + b64;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(0, 0, c.width, c.height);
    let best = [0, 0, 0];
    let bestL = -1;
    const lum = ([r, g, b]) =>
      [r, g, b]
        .map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; })
        .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
    for (let i = 0; i < data.length; i += 4) {
      const px = [data[i], data[i + 1], data[i + 2]];
      const l = lum(px);
      if (l > bestL) { bestL = l; best = px; }
    }
    return best;
  }, shot);

  const composite = (fg, alpha, bg) => fg.map((c, i) => c * alpha + bg[i] * (1 - alpha));
  const lum = (rgb) =>
    rgb
      .map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; })
      .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
    return (x + 0.05) / (y + 0.05);
  };
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

  const ground = composite([255, 255, 255], 0.045, brightest); // glass over the brightest wash
  console.log(`  brightest background pixel: rgb(${brightest.join(", ")})`);

  // The wash once regressed to invisible — a z-index:-1 pseudo-element sits
  // behind body's own background, so nothing rendered and the page was a flat
  // fill. If the brightest pixel is barely above the base colour, it's gone.
  ok(
    lum(brightest) > lum([5, 7, 15]) * 2,
    `the ambient wash actually renders (brightest pixel rgb(${brightest.join(", ")}) vs base rgb(5, 7, 15))`
  );
  for (const [label, colour, min] of [
    ["body text", "#eaeff9", 4.5],
    ["secondary text", "#d2dbec", 4.5],
    ["muted prose", "#a8b6d2", 4.5],
    ["dim labels", "#7286ab", 3.0],
    ["Python accent", "#60a5fa", 4.5],
    ["JavaScript accent", "#fbbf24", 4.5],
  ]) {
    const r = ratio(hex(colour), ground);
    ok(r >= min, `${label} on glass over the brightest wash is ${r.toFixed(2)}:1 (needs ${min})`);
  }
  await page.close();
}

console.log(`\n${pass} passed, ${fail} failed`);
await browser.close();
server.close();
process.exit(fail ? 1 : 0);
