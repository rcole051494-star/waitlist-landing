// Copies the Monaco editor runtime from node_modules into public/monaco/vs/
// so the code editor works with no network — offline, and inside the Android
// APK. Without this, @monaco-editor/react fetches Monaco from a CDN and the
// editor never appears when there's no connection.
//
// Monaco ships ~24 MB. Most of that is languages and locales this app never
// touches, so we copy an allowlist instead of the whole tree (~13 MB).
//
// Filenames are content-hashed and change on every Monaco upgrade, so the
// allowlist is written as glob-ish patterns and a pattern matching NOTHING is
// a hard error — an upgrade that moves a file fails the build here rather than
// silently shipping a broken editor.
import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = join(__dirname, "..", "node_modules", "monaco-editor", "min", "vs");
const dst = join(__dirname, "..", "public", "monaco", "vs");

// `*` matches any run of characters within one path segment.
const KEEP = [
  // Loader and editor core
  "loader.js",
  "index-*.js",
  "main-*.js",
  "initialize-*.js",
  "editor-*.js",
  "editorWorkerHost-*.js",
  "toggleHighContrast-*.js",
  "workers-*.js",
  "nls.messages-loader.js",
  "editor/editor.main.js",
  "editor/editor.main.css",
  "editor/editor.worker.js",
  "assets/editor.worker-*.js",
  "assets/editorWebWorkerMain-*.js",

  // Language registration. basic-languages/ is the lazy Monarch registry;
  // only the two grammars this app teaches are shipped alongside it.
  "basic-languages/monaco.contribution.js",
  "monaco.contribution-*.js",
  "python-*.js",
  "javascript-*.js",
  "typescript-*.js",

  // The TypeScript language service backs JavaScript hover and completion.
  // It's the single biggest piece (~7 MB) — see README if you'd rather drop it.
  "tsMode-*.js",
  "ts.worker-*.js",
  "lspLanguageFeatures-*.js",
  "assets/ts.worker-*.js",

  // Monaco registers css/html/json modes even when unused. These top-level
  // files are small shims; their multi-MB workers in assets/ are deliberately
  // NOT copied, since this app never opens a css, html or json model.
  "css.worker-*.js",
  "html.worker-*.js",
  "json.worker-*.js",
];

if (!existsSync(src)) {
  console.error("[copy-monaco] node_modules/monaco-editor not found. Run `npm install` first.");
  process.exit(1);
}

const toRegExp = (pattern) =>
  new RegExp("^" + pattern.split("*").map((s) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join("[^/]*") + "$");

// Collect every file in the source tree, as paths relative to min/vs.
async function walk(dir, prefix = "") {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...(await walk(join(dir, entry.name), rel)));
    else out.push(rel);
  }
  return out;
}

const all = await walk(src);
await rm(dst, { recursive: true, force: true });

let copied = 0;
let bytes = 0;
const unmatched = [];

for (const pattern of KEEP) {
  const re = toRegExp(pattern);
  const hits = all.filter((f) => re.test(f));
  if (hits.length === 0) {
    unmatched.push(pattern);
    continue;
  }
  for (const rel of hits) {
    const to = join(dst, rel);
    await mkdir(dirname(to), { recursive: true });
    await cp(join(src, rel), to);
    bytes += (await stat(to)).size;
    copied++;
  }
}

if (unmatched.length) {
  console.error(
    "[copy-monaco] these patterns matched no files — Monaco's layout has changed:\n" +
      unmatched.map((p) => `  - ${p}`).join("\n") +
      "\nUpdate the KEEP list in scripts/copy-monaco.mjs against node_modules/monaco-editor/min/vs."
  );
  process.exit(1);
}

const mb = (bytes / (1024 * 1024)).toFixed(1);
console.log(`[copy-monaco] copied ${copied} files (${mb} MB) → public/monaco/vs/`);
