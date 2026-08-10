// Verifies the built app in out/ works with NO network at all — the condition
// inside the Android APK, and on a phone in aeroplane mode.
//
// Guards three things that have each broken before:
//   1. Monaco loads from the bundled copy, not the CDN (real syntax highlighting)
//   2. Pyodide runs Python locally
//   3. If Monaco is unavailable anyway, the textarea fallback still lets you work
//
// Usage: npm run build && npm run verify:offline
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
const ok = (c, m) => { if (c) { pass++; } else { fail++; console.log(`  FAIL ${m}`); } };

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
});
const page = await browser.newPage();

let blockMonaco = false;
// Block every external host, so a CDN fetch cannot rescue a broken bundle.
await page.route("**", (route) => {
  const u = route.request().url();
  if (!u.startsWith(BASE)) {
    console.log(`  external request blocked: ${u.slice(0, 90)}`);
    return route.abort();
  }
  if (blockMonaco && u.includes("/monaco/")) return route.abort();
  return route.continue();
});
page.on("pageerror", (e) => {
  if (blockMonaco) return; // the fallback case deliberately breaks Monaco
  console.log("  FAIL page error:", e.message);
  fail++;
});
const notFound = [];
page.on("response", (r) => {
  if (r.status() >= 400 && !blockMonaco) notFound.push(`${r.status()} ${r.url().replace(BASE, "")}`);
});

const body = () => page.locator("main").innerText();
const openStep = async (label) => {
  await page.getByRole("button", { name: new RegExp(label) }).last().click();
  await page.waitForTimeout(400);
};

for (const [track, lesson, step, code, expected, waitMs] of [
  ["javascript", "js.11.closures", "Memoize", "console.log('js offline ok');", /js offline ok/, 3000],
  ["python", "py.11.functions", "Variadic sum", "print('py offline ok')", /py offline ok/, 30000],
]) {
  console.log(`${track}: bundled Monaco + local runtime`);
  await page.goto(`${BASE}/learn/${track}/${lesson}/`, { waitUntil: "networkidle" });
  await openStep(step);
  await page.waitForSelector(".monaco-editor", { timeout: 20000 }).catch(() => {});
  const mounted = (await page.locator(".monaco-editor").count()) > 0;
  ok(mounted, `${track}: Monaco mounted with no network`);
  ok(!/Offline editor —/.test(await body()), `${track}: did not fall back to the textarea`);
  if (!mounted) continue;

  // Highlighting means tokenised spans, not one undifferentiated blob.
  const tokenStyles = await page
    .locator(".monaco-editor .view-line span span")
    .evaluateAll((els) => new Set(els.map((e) => e.className)).size);
  ok(tokenStyles > 2, `${track}: syntax highlighting active (${tokenStyles} token styles)`);

  await page.locator(".monaco-editor").first().click();
  await page.keyboard.press("Control+A");
  await page.keyboard.type(code);
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: /Run/ }).first().click();
  await page.waitForTimeout(waitMs);
  ok(expected.test(await body()), `${track}: typed code ran offline`);

  ok(
    (await page.locator(".monaco-editor .squiggly-error").count()) === 0,
    `${track}: no spurious error squiggles on correct code`
  );
}

// With Monaco itself unreachable, the textarea fallback has to carry the lesson.
console.log("fallback: Monaco unavailable");
blockMonaco = true;
await page.goto(`${BASE}/learn/javascript/js.11.closures/`, { waitUntil: "networkidle" });
await openStep("Memoize");
await page.waitForSelector("main textarea", { timeout: 20000 });
await page.locator("main textarea").first().fill("console.log('fallback ok');\n");
await page.getByRole("button", { name: /Run/ }).first().click();
await page.waitForTimeout(3000);
ok(/fallback ok/.test(await body()), "fallback editor accepts typing and runs it");

if (notFound.length) {
  console.log("  FAIL missing assets:", notFound.slice(0, 10));
  fail++;
}

console.log(`\n${pass} passed, ${fail} failed`);
await browser.close();
server.close();
process.exit(fail ? 1 : 0);
