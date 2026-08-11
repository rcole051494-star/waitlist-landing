# Code Forge

An immersive, evidence-based way to learn modern **Python 3.12+** and **JavaScript ES2024+**. Every concept is a runnable example, a predict-the-output, a fix-the-bug, a from-scratch build — reinforced by spaced repetition so it doesn't slip away.

Runs three ways: as a **web app**, as a **PWA** you install on your phone from Chrome, and as a **native Android APK** via Capacitor.

## What's inside

- **40 interactive lessons** — 20 Python, 20 JavaScript
- **Live in-browser runtimes** — Pyodide (CPython 3.12 in WebAssembly) + a sandboxed JS iframe
- **Spaced-repetition review** using the SM-2 algorithm, interleaved across topics + languages
- **8 guided projects** with automated success checks
- **Modern-syntax cheatsheets** covering PEP 604 unions, PEP 695 generics, `match/case`, `Object.groupBy`, `Promise.withResolvers`, private class fields, and more

## Local dev

```bash
npm install
npm run dev       # http://localhost:3000
```

## Deploy as a PWA (fastest way onto Android)

Any static host works — the app is fully static-exported (`output: 'export'`) and includes a manifest, icons, and a service worker.

```bash
npm run build      # produces ./out
# Deploy ./out to Vercel / Netlify / GitHub Pages / Cloudflare Pages
```

On your Android phone:
1. Open the deployed URL in Chrome.
2. Menu → **Install app** (or "Add to Home screen").
3. It launches full-screen with its own icon and works offline after the first load.

## Build a native Android APK (Capacitor)

Requirements on your machine:
- **Android Studio** installed (provides JDK + Android SDK + Gradle wrapper)
- Node 20+

One-liner to open the project in Android Studio:

```bash
npm run android:open
```

Or build a debug APK from the command line (no IDE needed once the SDK is installed):

```bash
npm run android:apk
# APK lands at android/app/build/outputs/apk/debug/app-debug.apk
```

Under the hood these run: `next build` → `cap sync android` → optionally `./gradlew assembleDebug`.

### Notes

- The APK ships the **static web app** inside a Capacitor WebView, with both heavy runtimes bundled in rather than fetched: Pyodide (~13 MB) via `scripts/copy-pyodide.mjs` and the Monaco editor (~12 MB) via `scripts/copy-monaco.mjs`. Both run on `prebuild`, so a normal `npm run build` produces a fully self-contained app.
- **No internet needed, ever** — including the very first run. `npm run verify:offline` proves it: it serves `out/` with every external host blocked and checks that Monaco mounts with real syntax highlighting, that Python executes, and that the textarea fallback still works if Monaco is somehow unavailable.
- Monaco ships ~24 MB in total; `copy-monaco.mjs` copies an allowlist covering the editor core plus the Python and JavaScript grammars. Its filenames are content-hashed, so the allowlist is pattern-matched and the build **fails loudly** if a Monaco upgrade moves something, rather than silently shipping a broken editor. The single largest item is the TypeScript language service (~7 MB) behind JavaScript autocomplete — drop the `ts.worker` / `tsMode` / `lspLanguageFeatures` patterns from `KEEP` to save it, at the cost of JS hover and completion.
- App ID / package: `app.codeforge.learn` — edit in `capacitor.config.ts` and in `android/app/build.gradle` if you want your own.
- To make a release build for the Play Store, follow Capacitor's [release docs](https://capacitorjs.com/docs/android/deploying-to-google-play) (sign an AAB with your own keystore).

## Interface

Deep indigo base with a still radial wash of blue, teal and indigo fixed to
the viewport; frosted-glass panels over it so the app reads as one space
rather than stacked blocks. Code keeps an opaque ground — syntax colours are
tuned against it, and blurring live text is both unreadable and expensive.

**Attention blooms.** A soft radial glow appears behind whatever matters right
now: the step you're on, a result the moment it lands (green, amber or red by
verdict), a hint you just unlocked, the reveal after a hook, the review count
when work is waiting. It's driven by application **state, not hover** — the
Android build has no cursor, and state actually knows what you're working on.

Nothing animates on a loop. Motion happens on transitions only, and
`prefers-reduced-motion` removes it entirely while leaving the glow visible,
because the glow is information rather than decoration.

Two checks keep this honest:

- `npm run verify:contrast` — every colour pair the interface uses, against
  WCAG AA, read straight from the Tailwind config so it can't drift.
- `npm run verify:ui` — drives a real browser without ever moving the mouse:
  blooms follow state, the verdict picks the right tone, glass is actually
  frosted, code panels stay opaque, nothing animates infinitely, reduced
  motion is honoured, and the ambient wash is screenshotted and measured so
  text contrast is checked against the brightest pixel it really produces.

## Project layout

```
app/                  Next.js App Router pages (client components)
components/           Shared UI (LessonViewer, Runner, Nav, Prose, ...)
lib/
  curriculum/         Python + JavaScript lessons and projects
  pyodide-runner.ts   Loads Pyodide, runs Python, captures stdout/stderr
  js-runner.ts        Sandboxed iframe JS runtime, Node-style inspect
  srs.ts              SM-2 spaced repetition
  progress.ts         Per-lesson state, XP, streaks (localStorage)
public/               Icons, manifest, service worker
android/              Capacitor-generated native project
capacitor.config.ts   Capacitor configuration
```

## The research behind the design

- **Active recall** — every lesson forces you to produce (predict output, fix bug, write from scratch); consistently outperforms re-reading (Karpicke & Blunt, 2011).
- **Spaced repetition** — SM-2 algorithm surfaces concepts on your recall curve.
- **Interleaving** — the review queue mixes languages and topics.
- **Immediate feedback** — code runs in the browser; wrong beliefs get corrected on the spot.
- **Elaboration** — write-in-your-own-words prompts stress-test understanding.
- **Deliberate practice** — projects force you to compose skills, not just execute isolated ones.
