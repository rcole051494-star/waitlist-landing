"use client";
// Minimal markdown-ish renderer for lesson body text: **bold**, `code`, blank-line paragraphs, - lists, ``` code blocks.

import { ReactNode } from "react";

function inline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const m = match[0];
    if (m.startsWith("**")) {
      parts.push(
        <strong key={key++} className="text-ink-100 font-semibold">
          {m.slice(2, -2)}
        </strong>
      );
    } else if (m.startsWith("`")) {
      parts.push(
        <code
          key={key++}
          className="mono text-[0.9em] px-1.5 py-0.5 rounded bg-ink-800 text-ink-100 border border-ink-700"
        >
          {m.slice(1, -1)}
        </code>
      );
    }
    last = match.index + m.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function Prose({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  const lines = text.split("\n");
  let i = 0;
  let k = 0;
  while (i < lines.length) {
    if (lines[i].startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      blocks.push(
        <pre
          key={k++}
          className="rounded-lg border border-ink-800 bg-ink-950 p-3 mono text-[13px] text-ink-100 overflow-x-auto scrollbar-thin"
        >
          {buf.join("\n")}
        </pre>
      );
      continue;
    }
    if (lines[i].startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <ul key={k++} className="list-disc pl-6 space-y-1 text-ink-200">
          {items.map((it, idx) => (
            <li key={idx}>{inline(it)}</li>
          ))}
        </ul>
      );
      continue;
    }
    if (lines[i].trim() === "") {
      i++;
      continue;
    }
    const buf: string[] = [];
    while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("```") && !lines[i].startsWith("- ")) {
      buf.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={k++} className="text-ink-200 leading-relaxed">
        {inline(buf.join(" "))}
      </p>
    );
  }
  return <div className="space-y-3">{blocks}</div>;
}
