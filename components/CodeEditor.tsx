"use client";
import Editor, { OnMount, loader } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";

// Load Monaco from the copy bundled into the app (scripts/copy-monaco.mjs)
// rather than the default CDN, so the editor works offline and inside the
// Android APK. Must be configured before any <Editor> mounts.
loader.config({ paths: { vs: "/monaco/vs" } });

// Even bundled, loading can fail — a partial install, a stale service worker
// cache. Rather than leave the learner staring at "Loading…" and unable to
// practise, fall back to a plain textarea after a few seconds.
const MONACO_TIMEOUT_MS = 6000;

export function CodeEditor({
  value,
  onChange,
  language,
  height = 220,
  readOnly = false,
}: {
  value: string;
  onChange?: (v: string) => void;
  language: "python" | "javascript";
  height?: number | string;
  readOnly?: boolean;
}) {
  const editorRef = useRef<any>(null);
  const [fallback, setFallback] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!mounted.current) setFallback(true);
    }, MONACO_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, []);

  const handleMount: OnMount = (editor, monaco) => {
    mounted.current = true;
    editorRef.current = editor;
    monaco.editor.defineTheme("codeforge", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#0b0d12",
        "editor.lineHighlightBackground": "#141824",
        "editorLineNumber.foreground": "#39445f",
        "editorGutter.background": "#0b0d12",
      },
    });
    monaco.editor.setTheme("codeforge");

    // Monaco type-checks JavaScript through the TypeScript service. Left alone
    // it red-underlines perfectly good lesson code — top-level `await`, a bare
    // `console`, a snippet that references something defined in an earlier
    // step — which is actively confusing for a beginner. Keep syntax errors
    // (those are real and worth seeing) and drop the semantic ones.
    const ts = monaco.languages.typescript;
    ts.javascriptDefaults.setCompilerOptions({
      ...ts.javascriptDefaults.getCompilerOptions(),
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      allowJs: true,
      checkJs: false,
      lib: ["esnext"],
    });
    ts.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
      noSuggestionDiagnostics: true,
    });
  };

  if (fallback) {
    const indent = language === "python" ? "    " : "  ";
    return (
      <div className="rounded-xl overflow-hidden glass-strong">
        <textarea
          value={value}
          readOnly={readOnly}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={(e) => {
            // Tab should indent, not jump to the next control.
            if (e.key !== "Tab" || readOnly) return;
            e.preventDefault();
            const el = e.currentTarget;
            const { selectionStart: s, selectionEnd: end } = el;
            const next = value.slice(0, s) + indent + value.slice(end);
            onChange?.(next);
            requestAnimationFrame(() => {
              el.selectionStart = el.selectionEnd = s + indent.length;
            });
          }}
          className="w-full block mono text-[13.5px] leading-relaxed bg-ink-950 text-ink-100 p-3 outline-none resize-y scrollbar-thin"
          style={{ height: typeof height === "number" ? `${height}px` : height }}
        />
        <div className="px-3 py-1.5 text-[11px] text-ink-500 border-t border-ink-800">
          Offline editor — syntax highlighting needs a connection, but everything else works.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden glass-strong">
      <Editor
        height={height}
        defaultLanguage={language}
        language={language}
        value={value}
        onChange={(v) => onChange?.(v ?? "")}
        onMount={handleMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontFamily:
            "ui-monospace, SFMono-Regular, 'JetBrains Mono', Menlo, monospace",
          fontSize: 13.5,
          fontLigatures: true,
          renderLineHighlight: "all",
          scrollBeyondLastLine: false,
          padding: { top: 12, bottom: 12 },
          smoothScrolling: true,
          tabSize: language === "python" ? 4 : 2,
          automaticLayout: true,
          wordWrap: "on",
        }}
      />
    </div>
  );
}
