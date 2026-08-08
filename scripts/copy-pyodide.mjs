// Copies Pyodide runtime files from node_modules into public/pyodide/
// so they get bundled into the static export (and the Android APK).
import { cp, mkdir, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = join(__dirname, "..", "node_modules", "pyodide");
const dst = join(__dirname, "..", "public", "pyodide");

// Files needed to boot Pyodide and run pure-Python code (no extra packages).
const CORE = [
  "pyodide.js",
  "pyodide.mjs",
  "pyodide.asm.js",
  "pyodide.asm.wasm",
  "python_stdlib.zip",
  "pyodide-lock.json",
];

if (!existsSync(src)) {
  console.error("[copy-pyodide] node_modules/pyodide not found. Run `npm install` first.");
  process.exit(1);
}

await mkdir(dst, { recursive: true });
let copied = 0;
let bytes = 0;
for (const name of CORE) {
  const from = join(src, name);
  const to = join(dst, name);
  if (!existsSync(from)) {
    console.warn(`[copy-pyodide] skipping ${name} — not in Pyodide package`);
    continue;
  }
  await cp(from, to);
  const s = await stat(to);
  bytes += s.size;
  copied++;
}
const mb = (bytes / (1024 * 1024)).toFixed(1);
console.log(`[copy-pyodide] copied ${copied} files (${mb} MB) → public/pyodide/`);
