"use client";

// Loads Pyodide from CDN (once) and runs Python with captured stdout/stderr.
// Uses Python 3.12+ syntax and modern features.

declare global {
  interface Window {
    loadPyodide?: (opts?: any) => Promise<any>;
    __pyodidePromise?: Promise<any>;
  }
}

// Pyodide is bundled into the app under /pyodide/ (see scripts/copy-pyodide.mjs).
// Works fully offline — no CDN needed once the APK/PWA is installed.
const LOCAL_PYODIDE = "/pyodide/";
const LOCAL_SCRIPT = `${LOCAL_PYODIDE}pyodide.js`;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.dataset.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load Pyodide from ${src}`));
    document.head.appendChild(s);
  });
}

export async function getPyodide(): Promise<any> {
  if (typeof window === "undefined") throw new Error("Pyodide is browser-only");
  if (window.__pyodidePromise) return window.__pyodidePromise;

  window.__pyodidePromise = (async () => {
    await loadScript(LOCAL_SCRIPT);
    if (!window.loadPyodide) throw new Error("Pyodide did not load");
    const py = await window.loadPyodide({ indexURL: LOCAL_PYODIDE });
    // Redirect stdout/stderr into a buffer we can read from JS
    await py.runPythonAsync(`
import sys, io
class _Cap(io.StringIO):
    def write(self, s):
        return super().write(s)
_stdout_buf = _Cap()
_stderr_buf = _Cap()
sys.stdout = _stdout_buf
sys.stderr = _stderr_buf
def _drain():
    out = _stdout_buf.getvalue()
    err = _stderr_buf.getvalue()
    _stdout_buf.truncate(0); _stdout_buf.seek(0)
    _stderr_buf.truncate(0); _stderr_buf.seek(0)
    return (out, err)
    `);
    return py;
  })();
  return window.__pyodidePromise;
}

export type RunResult = { stdout: string; stderr: string; error?: string };

export async function runPython(code: string): Promise<RunResult> {
  try {
    const py = await getPyodide();
    let error: string | undefined;
    try {
      await py.runPythonAsync(code);
    } catch (e: any) {
      error = String(e?.message ?? e);
    }
    const drain = py.globals.get("_drain");
    const tup = drain();
    const stdout = tup.get(0) as string;
    const stderr = tup.get(1) as string;
    tup.destroy?.();
    drain.destroy?.();
    return { stdout, stderr, error };
  } catch (e: any) {
    return { stdout: "", stderr: "", error: String(e?.message ?? e) };
  }
}
