"use client";
import type { ChatMsg, LessonContext, Provider } from "./types";

// Direct browser → provider calls, streamed. The API key lives only in
// localStorage and is sent straight to Anthropic/OpenAI — never through
// any server of ours (there is none; this app is static).

export function buildSystemPrompt(ctx: LessonContext): string {
  const parts: string[] = [];
  parts.push(
    "You are an embedded coding tutor inside 'Code Forge', an app teaching modern Python and JavaScript through active recall and spaced repetition. " +
      "You can see exactly what the learner is looking at and what they've typed. Be specific — reference their actual code and actual error, not generic advice. " +
      "Default to Socratic guidance: point at what's wrong and ask a leading question rather than just handing over corrected code, UNLESS they explicitly ask you to just give the answer or fix the code, in which case do that directly. " +
      "Keep replies short — a few sentences, or a small code snippet. No long lectures unless asked."
  );
  if (ctx.track) parts.push(`Language: ${ctx.track === "python" ? "Python 3.12+" : "JavaScript ES2024+"}.`);
  if (ctx.lessonTitle) parts.push(`Lesson: "${ctx.lessonTitle}"${ctx.lessonSummary ? ` — ${ctx.lessonSummary}` : ""}.`);
  if (ctx.stepTitle) parts.push(`Current step (${ctx.stepKind ?? "step"}): "${ctx.stepTitle}".`);
  if (ctx.stepPrompt) parts.push(`Step instructions:\n${ctx.stepPrompt}`);
  if (ctx.referenceCode) parts.push(`Reference/starter code for this step:\n\`\`\`\n${ctx.referenceCode}\n\`\`\``);
  if (ctx.expected !== undefined) parts.push(`Expected output for this step:\n${ctx.expected}`);
  if (ctx.userCode) parts.push(`The learner's CURRENT code in the editor:\n\`\`\`\n${ctx.userCode}\n\`\`\``);
  if (ctx.lastStdout) parts.push(`Their last run's stdout:\n${ctx.lastStdout}`);
  if (ctx.lastStderr) parts.push(`Their last run's stderr:\n${ctx.lastStderr}`);
  if (ctx.lastError) parts.push(`Their last run's error:\n${ctx.lastError}`);
  return parts.join("\n\n");
}

export type StreamHandlers = {
  onToken: (delta: string) => void;
  onDone: () => void;
  onError: (message: string) => void;
};

export function streamChat(
  provider: Provider,
  apiKey: string,
  model: string,
  system: string,
  history: ChatMsg[],
  handlers: StreamHandlers
): { abort: () => void } {
  const controller = new AbortController();
  (async () => {
    try {
      if (provider === "anthropic") {
        await streamAnthropic(apiKey, model, system, history, handlers, controller.signal);
      } else {
        await streamOpenAI(apiKey, model, system, history, handlers, controller.signal);
      }
    } catch (e: any) {
      if (controller.signal.aborted) return;
      const msg = String(e?.message ?? e);
      // Browsers report both CORS blocks and offline/DNS failures as this
      // generic message with no further detail — give the learner something
      // actionable instead of a cryptic "Failed to fetch".
      if (/failed to fetch|networkerror|load failed/i.test(msg)) {
        handlers.onError(
          "Couldn't reach the model provider. Check your internet connection and that your API key is valid — " +
            "some corporate networks or browser extensions also block direct API calls."
        );
      } else {
        handlers.onError(msg);
      }
    }
  })();
  return { abort: () => controller.abort() };
}

async function streamAnthropic(
  apiKey: string,
  model: string,
  system: string,
  history: ChatMsg[],
  handlers: StreamHandlers,
  signal: AbortSignal
) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    signal,
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      system,
      stream: true,
      messages: history.map((m) => ({ role: m.role, content: m.content })),
    }),
  });
  if (!res.ok || !res.body) {
    const text = await safeText(res);
    handlers.onError(`Anthropic API error ${res.status}: ${text || res.statusText}`);
    return;
  }
  await readSSE(res.body, (event) => {
    if (event.event === "content_block_delta") {
      try {
        const data = JSON.parse(event.data);
        if (data?.delta?.type === "text_delta" && typeof data.delta.text === "string") {
          handlers.onToken(data.delta.text);
        }
      } catch {}
    } else if (event.event === "error") {
      try {
        const data = JSON.parse(event.data);
        handlers.onError(data?.error?.message ?? "stream error");
      } catch {
        handlers.onError("stream error");
      }
    }
  });
  handlers.onDone();
}

async function streamOpenAI(
  apiKey: string,
  model: string,
  system: string,
  history: ChatMsg[],
  handlers: StreamHandlers,
  signal: AbortSignal
) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    signal,
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      stream: true,
      messages: [
        { role: "system", content: system },
        ...history.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });
  if (!res.ok || !res.body) {
    const text = await safeText(res);
    handlers.onError(`OpenAI API error ${res.status}: ${text || res.statusText}`);
    return;
  }
  await readSSE(res.body, (event) => {
    if (event.data === "[DONE]") return;
    try {
      const data = JSON.parse(event.data);
      const delta = data?.choices?.[0]?.delta?.content;
      if (typeof delta === "string") handlers.onToken(delta);
    } catch {}
  });
  handlers.onDone();
}

async function safeText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

// Minimal SSE parser: splits on double-newline event boundaries, extracts
// `event:` and `data:` fields. Good enough for both providers' streams.
async function readSSE(body: ReadableStream<Uint8Array>, onEvent: (e: { event: string; data: string }) => void) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buf.indexOf("\n\n")) !== -1) {
      const chunk = buf.slice(0, idx);
      buf = buf.slice(idx + 2);
      let event = "message";
      const dataLines: string[] = [];
      for (const line of chunk.split("\n")) {
        if (line.startsWith("event:")) event = line.slice(6).trim();
        else if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
      }
      if (dataLines.length) onEvent({ event, data: dataLines.join("\n") });
    }
  }
}
