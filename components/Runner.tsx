"use client";
import { useCallback, useState } from "react";
import { CodeEditor } from "./CodeEditor";
import { runJs } from "@/lib/js-runner";
import { runPython } from "@/lib/pyodide-runner";

type Track = "python" | "javascript";

export function Runner({
  initial,
  track,
  expected,
  onResult,
  height = 220,
  runLabel = "Run",
}: {
  initial: string;
  track: Track;
  expected?: string; // if provided, compares stdout (trimmed)
  onResult?: (r: { ok: boolean; stdout: string; error?: string }) => void;
  height?: number;
  runLabel?: string;
}) {
  const [code, setCode] = useState(initial);
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "ok" | "err" | "match" | "nomatch">("idle");
  const [pyLoading, setPyLoading] = useState(false);

  const run = useCallback(async () => {
    setStatus("running");
    setStderr("");
    setStdout("");
    if (track === "python") setPyLoading(true);
    try {
      const r = track === "python" ? await runPython(code) : await runJs(code);
      setPyLoading(false);
      const out = r.stdout || "";
      const err = r.stderr || r.error || "";
      setStdout(out);
      setStderr(err);
      const ok = !err;
      if (expected !== undefined) {
        const norm = (s: string) => s.replace(/\r\n/g, "\n").trim();
        const match = norm(out) === norm(expected) && !err;
        setStatus(match ? "match" : ok ? "nomatch" : "err");
        onResult?.({ ok: match, stdout: out, error: err });
      } else {
        setStatus(ok ? "ok" : "err");
        onResult?.({ ok, stdout: out, error: err });
      }
    } catch (e: any) {
      setPyLoading(false);
      setStderr(String(e?.message ?? e));
      setStatus("err");
      onResult?.({ ok: false, stdout: "", error: String(e?.message ?? e) });
    }
  }, [code, expected, onResult, track]);

  const reset = () => {
    setCode(initial);
    setStdout("");
    setStderr("");
    setStatus("idle");
  };

  const statusPill =
    status === "match" ? (
      <span className="text-good font-medium">✓ matches expected</span>
    ) : status === "nomatch" ? (
      <span className="text-warm font-medium">△ ran, but output doesn't match</span>
    ) : status === "err" ? (
      <span className="text-bad font-medium">✗ error</span>
    ) : status === "ok" ? (
      <span className="text-good font-medium">✓ ran</span>
    ) : null;

  return (
    <div className="space-y-3">
      <CodeEditor value={code} onChange={setCode} language={track} height={height} />
      <div className="flex items-center gap-3">
        <button
          onClick={run}
          disabled={status === "running"}
          className="px-4 py-2 rounded-lg bg-ink-100 text-ink-950 text-sm font-medium hover:bg-white disabled:opacity-60 disabled:cursor-wait transition"
        >
          {status === "running" ? (pyLoading ? "Loading Python…" : "Running…") : `▶ ${runLabel}`}
        </button>
        <button
          onClick={reset}
          className="px-3 py-2 rounded-lg text-ink-300 hover:text-ink-100 text-sm hover:bg-ink-800 transition"
        >
          Reset
        </button>
        <div className="text-sm">{statusPill}</div>
      </div>
      {(stdout || stderr) && (
        <div className="rounded-lg bg-ink-950 border border-ink-800 p-3 mono text-[13px] scrollbar-thin overflow-auto max-h-64">
          {stdout && <pre className="text-ink-100 whitespace-pre-wrap">{stdout}</pre>}
          {stderr && <pre className="text-bad whitespace-pre-wrap">{stderr}</pre>}
        </div>
      )}
      {expected !== undefined && (
        <details className="text-xs text-ink-400">
          <summary className="cursor-pointer hover:text-ink-200">Show expected output</summary>
          <pre className="mt-2 rounded-lg border border-ink-800 bg-ink-950 p-3 mono text-ink-200 whitespace-pre-wrap">{expected}</pre>
        </details>
      )}
    </div>
  );
}
