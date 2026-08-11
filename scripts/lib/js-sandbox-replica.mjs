// A faithful replica of lib/js-runner.ts, so curriculum claims can be checked
// outside a browser: the same hand-rolled util.inspect formatting, the same
// `(async () => { ... })()` wrapper, and the same sloppy-mode scope.
//
// Any divergence here produces false confidence, so keep it in step with
// lib/js-runner.ts whenever that changes.
//
// Usage: node js-sandbox-replica.mjs <cases.json>
import fs from "node:fs";

function _inspect(v, seen) {
  seen = seen || new WeakSet();
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  if (typeof v === "string") return "'" + v.replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
  if (typeof v === "number") return Object.is(v, -0) ? "-0" : String(v);
  if (typeof v === "boolean") return String(v);
  if (typeof v === "bigint") return String(v) + "n";
  if (typeof v === "symbol") return v.toString();
  if (typeof v === "function") return "[Function: " + (v.name || "anonymous") + "]";
  if (v instanceof RegExp) return v.toString();
  if (v instanceof Date) return v.toISOString();
  if (v instanceof Error) return v.name + ": " + v.message;
  if (v instanceof Map) {
    const parts = [];
    v.forEach((val, k) => parts.push(_inspect(k, seen) + " => " + _inspect(val, seen)));
    return "Map(" + v.size + ") { " + parts.join(", ") + " }";
  }
  if (v instanceof Set) {
    const parts = [];
    v.forEach((val) => parts.push(_inspect(val, seen)));
    return "Set(" + v.size + ") { " + parts.join(", ") + " }";
  }
  if (typeof v === "object") {
    if (seen.has(v)) return "[Circular]";
    seen.add(v);
    if (Array.isArray(v)) {
      if (v.length === 0) return "[]";
      return "[ " + v.map((x) => _inspect(x, seen)).join(", ") + " ]";
    }
    const keys = Object.keys(v);
    if (keys.length === 0) return "{}";
    const pairs = keys.map((k) => {
      const kOut = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : "'" + k + "'";
      return kOut + ": " + _inspect(v[k], seen);
    });
    return "{ " + pairs.join(", ") + " }";
  }
  return String(v);
}

const fmt = (args) =>
  args
    .map((v) => {
      if (typeof v === "string") return v;
      try {
        return _inspect(v);
      } catch (e) {
        return String(v);
      }
    })
    .join(" ");

export async function runJs(code) {
  let stdout = "";
  let stderr = "";
  const push = (buf, s) => s;
  const realConsole = console;
  const fakeConsole = {
    log: (...a) => { stdout += (stdout ? "\n" : "") + fmt(a); },
    info: (...a) => { stdout += (stdout ? "\n" : "") + fmt(a); },
    warn: (...a) => { stdout += (stdout ? "\n" : "") + fmt(a); },
    debug: (...a) => { stdout += (stdout ? "\n" : "") + fmt(a); },
    error: (...a) => { stderr += (stderr ? "\n" : "") + fmt(a); },
  };
  globalThis.console = fakeConsole;
  try {
    const wrapped = "(async () => {\n" + code + "\n})()";
    // sloppy-mode indirect construction, mirrors eval inside the sandbox IIFE
    const fn = new Function("return " + wrapped);
    await fn();
  } catch (e) {
    const stack = e && e.stack ? String(e.stack) : String(e);
    stderr += (stderr ? "\n" : "") + stack;
  } finally {
    globalThis.console = realConsole;
  }
  return { stdout, stderr };
}

const cases = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
let pass = 0,
  fail = 0;
for (const c of cases) {
  const { stdout, stderr } = await runJs(c.code);
  // Let any stragglers (late .then handlers, timers) land before the next case,
  // so one lesson's leaked output can't be mistaken for the next one's.
  await new Promise((r) => setTimeout(r, 250));
  const got = stdout;
  const expectErr = c.expectErr;
  if (expectErr) {
    if (stderr.includes(expectErr)) {
      pass++;
    } else {
      fail++;
      console.log(`FAIL(err) ${c.id}\n  want err containing: ${expectErr}\n  got stderr: ${stderr}\n  got stdout: ${stdout}`);
    }
    continue;
  }
  if (c.mustDiffer !== undefined) {
    // A "fix" exercise's buggy code must NOT already produce the expected output.
    // Throwing counts as differing — that's often the whole point of the bug.
    if (stderr || got !== c.mustDiffer) pass++;
    else {
      fail++;
      console.log(`FAIL(buggy already correct) ${c.id}\n  produced the expected: ${JSON.stringify(got)}`);
    }
    continue;
  }
  if (stderr) {
    fail++;
    console.log(`FAIL(threw) ${c.id}\n  stderr: ${stderr}`);
    continue;
  }
  if (c.expected === undefined) {
    // No asserted output — running without throwing is the whole check.
    pass++;
    continue;
  }
  if (got === c.expected) pass++;
  else {
    fail++;
    console.log(`FAIL ${c.id}\n  want: ${JSON.stringify(c.expected)}\n  got:  ${JSON.stringify(got)}`);
  }
}
console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail ? 1 : 0);
