// Checks every factual claim in the curriculum, and the shape of every lesson.
//
// Three passes:
//   1. structure  — cloze placeholder numbering, categorize bucket indices,
//                   buildup distractors, trace lines that match the program,
//                   read-block length, and that each lesson opens on its hook
//   2. javascript — every runnable snippet executed under a replica of the
//                   in-app sandbox (its util.inspect formatting, its async
//                   wrapper, its sloppy-mode scope) and compared to the
//                   output the lesson claims
//   3. python     — the same, shelled out to python3 with top-level await
//                   enabled, matching how Pyodide runs lesson code
//
// Usage: npm run verify:curriculum
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TMP = mkdtempSync(join(tmpdir(), "curriculum-"));
const READ_BUDGET = 140;

// ---------------------------------------------------------------- load ----
// The curriculum files are pure data; strip the type annotations so Node can
// import them directly rather than standing up a TypeScript build.
async function load(name) {
  const src = readFileSync(join(ROOT, "lib", "curriculum", `${name}.ts`), "utf8")
    .replace('import type { Lesson } from "./types";', "")
    .replace(/export const (\w+): Lesson(\[\])? =/g, "export const $1 =");
  const path = join(TMP, `${name}.mjs`);
  writeFileSync(path, src);
  return Object.values(await import(path)).flat();
}

const byTrack = {
  javascript: [...(await load("javascript-basics")), ...(await load("javascript"))],
  python: [...(await load("python-basics")), ...(await load("python"))],
};
const all = [...byTrack.javascript, ...byTrack.python].filter((L) => L?.steps);

let problems = 0;
const bad = (msg) => { problems++; console.log("  " + msg); };

// ----------------------------------------------------------- structure ----
console.log("structure");
for (const L of all) {
  const kinds = L.steps.map((s) => s.kind);
  const seen = new Set();
  for (const st of L.steps) {
    if (seen.has(st.id)) bad(`${L.id}: duplicate step id ${st.id}`);
    seen.add(st.id);

    if (st.kind === "cloze") {
      const found = [...st.template.matchAll(/\{\{(\d+)\}\}/g)].map((m) => Number(m[1]));
      const want = st.blanks.map((_, i) => i);
      if (JSON.stringify(found) !== JSON.stringify(want))
        bad(`${L.id}/${st.id}: cloze placeholders ${found} but ${st.blanks.length} blanks (must be 0-indexed and in order)`);
    }
    if (st.kind === "categorize") {
      for (const it of st.items)
        if (typeof it.bucket !== "number" || it.bucket < 0 || it.bucket >= st.buckets.length)
          bad(`${L.id}/${st.id}: item "${it.text}" has bucket ${it.bucket}`);
      const used = new Set(st.items.map((i) => i.bucket));
      st.buckets.forEach((b, i) => { if (!used.has(i)) bad(`${L.id}/${st.id}: bucket "${b}" has no items`); });
    }
    if (st.kind === "mcq") {
      if (st.correctIndex == null || st.correctIndex >= st.options.length) bad(`${L.id}/${st.id}: bad correctIndex`);
      if (st.optionFeedback && st.optionFeedback.length !== st.options.length)
        bad(`${L.id}/${st.id}: optionFeedback length does not match options`);
    }
    if (st.kind === "buildup") {
      for (const stage of st.stages) {
        if (stage.distractors.includes(stage.line)) bad(`${L.id}/${st.id}: a distractor equals the answer`);
        if (new Set(stage.distractors).size !== stage.distractors.length)
          bad(`${L.id}/${st.id}: duplicate distractors`);
      }
    }
    if (st.kind === "diff" && st.a.output === st.b.output)
      bad(`${L.id}/${st.id}: both sides print the same thing — nothing to spot`);
    if (st.kind === "read") {
      const w = st.body.split(/\s+/).filter(Boolean).length;
      if (w > READ_BUDGET) bad(`${L.id}/${st.id}: read block is ${w} words (budget ${READ_BUDGET})`);
    }
  }
  if (kinds[0] !== "hook") bad(`${L.id}: does not open on a hook (starts with "${kinds[0]}")`);
  kinds.forEach((k, i) => {
    if (k === "read" && kinds[i + 1] === "read") bad(`${L.id}: two read steps in a row at index ${i}`);
  });
}
console.log(`  ${all.length} lessons checked`);

// ------------------------------------------------------------ extract ----
// Pull every claim of the form "this code produces this output".
function claims(lessons) {
  const out = [];
  for (const L of lessons) {
    for (const st of L.steps) {
      const id = `${L.id}/${st.id}`;
      const add = (suffix, code, expected) => out.push({ id: `${id} ${suffix}`, code, expected });
      switch (st.kind) {
        case "hook": add("hook", st.code, st.answer); break;
        case "example": add("example", st.code, undefined); break;
        case "predict": add("predict", st.code, st.answer); break;
        case "fix":
          if (st.solution) add("fix", st.solution, st.expected);
          out.push({ id: `${id} fix.buggy`, code: st.buggy, mustDiffer: st.expected });
          break;
        case "mutate":
          if (st.solution) add("mutate", st.solution, st.expected);
          out.push({ id: `${id} mutate.starter`, code: st.starter, mustDiffer: st.expected });
          break;
        case "write": if (st.solution) add("write", st.solution, st.expected); break;
        case "parsons": add("parsons", st.solution.join("\n"), st.expectedOutput); break;
        case "diff":
          add("diff.a", st.a.code, st.a.output);
          add("diff.b", st.b.code, st.b.output);
          break;
        case "buildup": {
          const last = [...st.stages].reverse().find((s) => s.output)?.output;
          // An output written as prose — "(nothing yet)" — is commentary.
          add("buildup", st.stages.map((s) => s.line).join("\n"), /^\(/.test(last ?? "") ? undefined : last);
          break;
        }
        case "trace": {
          const outs = st.lines.map((l) => l.output).filter(Boolean).join("\n");
          add("trace", st.code, outs || undefined);
          // A trace line is normally a whole program line, which the UI
          // highlights. Some deliberately quote a sub-expression instead, so
          // only complain when the text appears nowhere in the program at all.
          const lines = st.code.split("\n").map((x) => x.trim()).filter(Boolean);
          const program = new Set(lines);
          for (const l of st.lines) {
            if (l.highlight === false) continue; // declared an annotation
            for (const cl of l.code.split("\n").map((x) => x.trim()).filter(Boolean))
              if (!program.has(cl) && !lines.some((pl) => pl.includes(cl)))
                bad(`${id}: trace line appears nowhere in the program (set highlight: false if that is deliberate): ${JSON.stringify(cl)}`);
          }
          break;
        }
      }
    }
  }
  return out;
}

// --------------------------------------------------------- javascript ----
console.log("javascript");
const jsClaims = claims(byTrack.javascript);
writeFileSync(join(TMP, "js.json"), JSON.stringify(jsClaims));
const jsRunner = readFileSync(join(ROOT, "scripts", "lib", "js-sandbox-replica.mjs"), "utf8");
writeFileSync(join(TMP, "runner.mjs"), jsRunner);
let jsOut;
try {
  jsOut = execFileSync(process.execPath, [join(TMP, "runner.mjs"), join(TMP, "js.json")], { encoding: "utf8" });
} catch (e) {
  jsOut = (e.stdout ?? "") + (e.stderr ?? "");
  problems++;
}
process.stdout.write(jsOut.replace(/^/gm, "  "));

// ------------------------------------------------------------- python ----
console.log("python");
const pyClaims = claims(byTrack.python);
writeFileSync(join(TMP, "py.json"), JSON.stringify(pyClaims));
writeFileSync(join(TMP, "runner.py"), readFileSync(join(ROOT, "scripts", "lib", "py_sandbox_replica.py"), "utf8"));
let pyOut = "";
let python = null;
for (const candidate of ["python3.12", "python3", "python"]) {
  try {
    execFileSync(candidate, ["-c", "import sys; assert sys.version_info >= (3, 10)"], { stdio: "ignore" });
    python = candidate;
    break;
  } catch {}
}
if (!python) {
  console.log("  SKIPPED — no python3.10+ on PATH (Pyodide runs CPython 3.12)");
} else {
  try {
    pyOut = execFileSync(python, [join(TMP, "runner.py"), join(TMP, "py.json")], { encoding: "utf8" });
  } catch (e) {
    pyOut = (e.stdout ?? "") + (e.stderr ?? "");
    problems++;
  }
  process.stdout.write(pyOut.replace(/^/gm, "  "));
}

const failed = problems || /\bFAIL/.test(jsOut) || /\bFAIL/.test(pyOut);
console.log(failed ? "\ncurriculum verification FAILED" : "\ncurriculum verification passed");
process.exit(failed ? 1 : 0);
