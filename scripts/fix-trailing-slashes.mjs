// After `next build`, rewrite href="/foo/bar" -> href="/foo/bar/" in every
// HTML file under out/, so Capacitor's Android WebView (which does not auto-
// resolve directory index.html for URLs without a trailing slash) can find
// the right page on full-page loads (e.g. after a service-worker cold start).
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join, dirname, sep } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "out");

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else if (entry.isFile()) out.push(p);
  }
  return out;
}

// Rewrite href="/x" or href='/x' where /x is site-internal and doesn't already
// end with "/", "#", "?", or a file extension.
const RE = /(href|action)=(["'])(\/[^"'#?]*?)\2/g;
const EXT = /\.[a-z0-9]{1,5}$/i;

function fix(html) {
  return html.replace(RE, (m, attr, q, url) => {
    if (url === "/" || url.endsWith("/")) return m;
    if (EXT.test(url)) return m; // real files like /icon-192.png, /_next/... .js
    if (url.startsWith("/_next/")) return m;
    return `${attr}=${q}${url}/${q}`;
  });
}

const all = await walk(OUT);

// Next's client prefetches a route's RSC payload from "<route>.txt", but with
// trailingSlash + export it writes that payload to "<route>/index.txt". Every
// prefetch therefore 404s. Mirror each payload to the name the client asks for
// so next-lesson prefetching actually works (a real win on a phone).
let mirrored = 0;
for (const f of all.filter((f) => f.endsWith(`${sep}index.txt`))) {
  const dir = dirname(f);
  if (dir === OUT) continue; // the root payload is already at the right place
  await writeFile(`${dir}.txt`, await readFile(f));
  mirrored++;
}
console.log(`[fix-trailing-slashes] mirrored ${mirrored} RSC payloads to <route>.txt`);

const files = all.filter((f) => f.endsWith(".html"));
let changed = 0;
for (const f of files) {
  const src = await readFile(f, "utf8");
  const out = fix(src);
  if (out !== src) {
    await writeFile(f, out);
    changed++;
  }
}
console.log(`[fix-trailing-slashes] rewrote ${changed} / ${files.length} HTML files`);
