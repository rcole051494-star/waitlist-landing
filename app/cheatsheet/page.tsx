"use client";
import { useState } from "react";
import { Nav } from "@/components/Nav";

type Section = { title: string; rows: [string, string][] };

const python: Section[] = [
  {
    title: "Values & printing",
    rows: [
      ["f-string with format", "f'{x:.2f}'"],
      ["debug f-string (3.8+)", "f'{x=}'"],
      ["multi-line string", "'''line1\\nline2'''"],
      ["number separators", "1_000_000"],
    ],
  },
  {
    title: "Collections",
    rows: [
      ["list comp", "[x*x for x in xs if x > 0]"],
      ["dict comp", "{k: v for k, v in items}"],
      ["set comp", "{x for x in xs}"],
      ["unpack", "a, *rest, b = xs"],
      ["merge dicts (3.9+)", "d1 | d2"],
    ],
  },
  {
    title: "Functions & typing",
    rows: [
      ["keyword-only args", "def f(*, k): ..."],
      ["union (PEP 604)", "int | None"],
      ["generic (PEP 695, 3.12+)", "def first[T](xs: list[T]) -> T: ..."],
      ["type alias (3.12+)", "type Vec = list[float]"],
    ],
  },
  {
    title: "Control flow",
    rows: [
      ["walrus", "if (n := len(xs)) > 0: ..."],
      ["match (3.10+)", "case {'type': 'circle', 'r': r}: ..."],
      ["for/else", "for x in xs:\\n    ...\\nelse:\\n    ..."],
    ],
  },
  {
    title: "Async & concurrency",
    rows: [
      ["run event loop", "asyncio.run(main())"],
      ["parallel", "await asyncio.gather(a(), b())"],
      ["task group (3.11+)", "async with asyncio.TaskGroup() as tg: ..."],
      ["catch ExceptionGroup part", "except* ValueError: ..."],
    ],
  },
  {
    title: "Standard library gems",
    rows: [
      ["path", "Path('/tmp') / 'file.txt'"],
      ["counter", "Counter(s).most_common(3)"],
      ["defaultdict", "defaultdict(list)"],
      ["cache decorator", "@functools.cache"],
    ],
  },
];

const javascript: Section[] = [
  {
    title: "Values & printing",
    rows: [
      ["template literal", "`hi ${name}`"],
      ["tagged template", "html`<b>${x}</b>`"],
      ["at index", "arr.at(-1)"],
      ["nullish default", "x ?? fallback"],
      ["optional chain", "user?.address?.city"],
    ],
  },
  {
    title: "Collections",
    rows: [
      ["spread", "[...xs, extra]  /  { ...obj, over: 1 }"],
      ["destructure", "const { a = 1, b: renamed } = obj"],
      ["non-mutating sort (ES2023)", "xs.toSorted()"],
      ["group by (ES2024)", "Object.groupBy(xs, fn)"],
    ],
  },
  {
    title: "Functions",
    rows: [
      ["arrow", "const f = (x) => x * 2"],
      ["rest / default", "function f(a, b = 1, ...rest) {}"],
      ["explicit this", "fn.call(that, ...args)"],
    ],
  },
  {
    title: "Async",
    rows: [
      ["parallel", "await Promise.all([a(), b()])"],
      ["all settled", "await Promise.allSettled(xs)"],
      ["fastest resolver", "await Promise.any(xs)"],
      ["deferred (ES2024)", "const { promise, resolve, reject } = Promise.withResolvers()"],
      ["top-level await", "// in ESM: await import(...)"],
    ],
  },
  {
    title: "Classes",
    rows: [
      ["private field", "class C { #n = 0 }"],
      ["static", "class C { static kind = 'x' }"],
      ["inherit", "class D extends C { constructor() { super() } }"],
    ],
  },
  {
    title: "Modern quality-of-life",
    rows: [
      ["deep clone", "structuredClone(v)"],
      ["error with cause", "throw new Error('m', { cause: e })"],
      ["reg exp flags", "/pat/gimsuy"],
      ["number safe int test", "Number.isSafeInteger(n)"],
    ],
  },
];

export default function CheatsheetPage() {
  const [track, setTrack] = useState<"python" | "javascript">("python");
  const data = track === "python" ? python : javascript;
  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-6 pt-10 pb-20">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink-400">quick reference</p>
            <h1 className="mt-2 text-3xl font-bold text-ink-100">Cheatsheet</h1>
          </div>
          <div className="flex gap-2 rounded-lg border border-ink-800 p-1">
            <button
              onClick={() => setTrack("python")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                track === "python" ? "bg-py text-ink-950" : "text-ink-300 hover:text-ink-100"
              }`}
            >
              Python
            </button>
            <button
              onClick={() => setTrack("javascript")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                track === "javascript" ? "bg-js text-ink-950" : "text-ink-300 hover:text-ink-100"
              }`}
            >
              JavaScript
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {data.map((sec) => (
            <div key={sec.title} className="rounded-2xl border border-ink-800 bg-ink-900/40 p-5">
              <h3 className="text-ink-100 font-semibold mb-3">{sec.title}</h3>
              <dl className="space-y-2">
                {sec.rows.map(([label, code]) => (
                  <div key={label} className="grid grid-cols-[130px_1fr] gap-3 items-start">
                    <dt className="text-xs text-ink-400 uppercase tracking-wider pt-1">{label}</dt>
                    <dd className="mono text-[13px] rounded bg-ink-950 border border-ink-800 px-2 py-1 text-ink-100 overflow-x-auto scrollbar-thin">
                      {code}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
