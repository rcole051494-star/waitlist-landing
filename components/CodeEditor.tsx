"use client";
import Editor, { OnMount } from "@monaco-editor/react";
import { useRef } from "react";

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
  const handleMount: OnMount = (editor, monaco) => {
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
  };
  return (
    <div className="rounded-xl overflow-hidden border border-ink-700 bg-ink-900">
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
