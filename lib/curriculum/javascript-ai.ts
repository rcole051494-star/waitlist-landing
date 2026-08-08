import type { Lesson } from "./types";

// AI apps in JS/TypeScript. Focus on building shipped web products with LLMs:
// Next.js API routes + Server Actions, streaming to the browser, both SDKs, chat UI patterns.

export const javascriptAiLessons: Lesson[] = [
  {
    id: "js.ai.01.typescript",
    track: "javascript",
    module: "ai",
    index: 21,
    title: "TypeScript essentials for the AI stack",
    summary: "The type system you'll actually use — no PhD required.",
    concepts: ["js.ai:ts:basics", "js.ai:ts:generics"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Why TypeScript for AI apps",
        body:
          "Every serious Node/Next.js AI codebase is TypeScript. Reasons:\n\n- API responses have shape — types catch typos and refactor breakage.\n- Model SDKs ship typed clients (Anthropic, OpenAI, Vercel AI SDK).\n- Structured outputs pair naturally with a type or Zod schema.\n- Editor autocomplete for anthropic/openai types alone is worth the setup.",
      },
      {
        kind: "read",
        id: "r2",
        title: "The 90% you need",
        body:
          "```\n// Basic annotations\nconst n: number = 5;\nconst names: string[] = ['a', 'b'];\n\n// Object shapes\ntype User = { id: string; email: string; admin?: boolean };\nconst u: User = { id: '1', email: 'x@y.z' };\n\n// Unions and literals\ntype Role = 'user' | 'assistant' | 'system';\ntype Result<T> = { ok: true; value: T } | { ok: false; error: string };\n\n// Function types\ntype Fetcher = (url: string) => Promise<Response>;\n\n// Generics\nfunction identity<T>(x: T): T { return x; }\n```\n\nThat's ~80% of TS you'll write day-to-day.",
      },
      {
        kind: "read",
        id: "r3",
        title: "Zod — runtime validation with inferred types",
        body:
          "TypeScript types disappear at runtime. **Zod** gives you a schema that validates at runtime AND infers a TS type:\n\n```\nimport { z } from 'zod';\n\nconst User = z.object({\n  id: z.string(),\n  email: z.string().email(),\n  age:  z.number().int().min(0).max(150).optional(),\n});\ntype User = z.infer<typeof User>;   // { id: string; email: string; age?: number }\n\nconst parsed = User.parse(untrustedJson);   // throws on mismatch\nconst safe   = User.safeParse(untrustedJson);   // { success, data } | { success:false, error }\n```\n\nZod is what you'll use to validate LLM outputs on the boundary. Learn it before writing your first AI app.",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "What's actually enforced?",
        prompt:
          "You declare `type X = { n: number }` and receive JSON from an API. Does TypeScript prevent a runtime crash if `n` is actually a string?",
        options: [
          "Yes — TS validates all JSON at runtime",
          "No — TS types are erased at build; you need runtime validation like Zod",
          "Only in strict mode",
          "Only for arrays",
        ],
        correctIndex: 1,
        why: "TS types don't exist at runtime. Validate untrusted data with a schema library like Zod at every boundary.",
      },
    ],
  },

  {
    id: "js.ai.02.anthropic-node",
    track: "javascript",
    module: "ai",
    index: 22,
    title: "Anthropic SDK in Node/TS",
    summary: "Messages, streaming, tool use. Same concepts as Python — different shape.",
    concepts: ["js.ai:anthropic:node"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Install + one-shot",
        body:
          "```\nnpm install @anthropic-ai/sdk\n```\n\n```\nimport Anthropic from '@anthropic-ai/sdk';\nconst client = new Anthropic();      // reads ANTHROPIC_API_KEY from env\n\nconst msg = await client.messages.create({\n  model: 'claude-opus-4-7',\n  max_tokens: 1024,\n  system: 'You are a concise assistant.',\n  messages: [{ role: 'user', content: 'Explain RAG in 3 sentences.' }],\n});\nconsole.log(msg.content[0].type === 'text' ? msg.content[0].text : '');\nconsole.log(msg.usage);\n```\n\nSame shape as Python: `system` at top level, `messages` alternating, `content` as an array of typed blocks.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Streaming for the browser",
        body:
          "```\nconst stream = await client.messages.stream({\n  model: 'claude-opus-4-7',\n  max_tokens: 1024,\n  messages: [{ role: 'user', content: 'Write a haiku.' }],\n});\n\nfor await (const chunk of stream) {\n  if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {\n    process.stdout.write(chunk.delta.text);\n  }\n}\nconst final = await stream.finalMessage();\nconsole.log('\\n', final.usage);\n```\n\nIn a Next.js route this is what you'll pipe out to the browser as SSE.",
      },
      {
        kind: "read",
        id: "r3",
        title: "Tool use in TS",
        body:
          "```\nconst tools = [{\n  name: 'get_weather',\n  description: 'Get current weather for a city.',\n  input_schema: {\n    type: 'object' as const,\n    properties: { city: { type: 'string' } },\n    required: ['city'],\n  },\n}];\n\nconst resp = await client.messages.create({\n  model: 'claude-opus-4-7', max_tokens: 1024,\n  tools, messages: [{ role: 'user', content: 'Weather in Paris?' }],\n});\n\nfor (const block of resp.content) {\n  if (block.type === 'tool_use') {\n    const result = await runTool(block.name, block.input);\n    // Send tool_result back in the next turn (same as Python)\n  }\n}\n```\n\nMental model is identical to the Python version — TypeScript just gives you autocomplete on the block union.",
      },
    ],
  },

  {
    id: "js.ai.03.openai-node",
    track: "javascript",
    module: "ai",
    index: 23,
    title: "OpenAI SDK in Node/TS",
    summary: "Chat completions, streaming, structured outputs — TS edition.",
    concepts: ["js.ai:openai:node"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Install + basic call",
        body:
          "```\nnpm install openai\n```\n\n```\nimport OpenAI from 'openai';\nconst client = new OpenAI();     // reads OPENAI_API_KEY\n\nconst r = await client.chat.completions.create({\n  model: 'gpt-4o',\n  messages: [\n    { role: 'system', content: 'You are a concise assistant.' },\n    { role: 'user',   content: 'Explain gradient descent in 3 sentences.' },\n  ],\n  max_tokens: 300,\n});\nconsole.log(r.choices[0].message.content);\n```\n\nRemember: `system` is a message here, not a top-level field.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Structured outputs with Zod",
        body:
          "```\nimport { zodResponseFormat } from 'openai/helpers/zod';\nimport { z } from 'zod';\n\nconst Extract = z.object({\n  name: z.string(),\n  org:  z.string().nullable(),\n  role: z.string().nullable(),\n});\n\nconst r = await client.chat.completions.parse({\n  model: 'gpt-4o-2024-08-06',\n  messages: [\n    { role: 'system', content: 'Extract entities.' },\n    { role: 'user',   content: 'Ada Lovelace worked with Charles Babbage.' },\n  ],\n  response_format: zodResponseFormat(Extract, 'extract'),\n});\nconst parsed = r.choices[0].message.parsed;  // typed as Extract\n```",
      },
      {
        kind: "read",
        id: "r3",
        title: "Streaming",
        body:
          "```\nconst stream = await client.chat.completions.create({\n  model: 'gpt-4o',\n  messages: [{ role: 'user', content: 'Write a haiku.' }],\n  stream: true,\n});\n\nfor await (const chunk of stream) {\n  const delta = chunk.choices[0]?.delta?.content;\n  if (delta) process.stdout.write(delta);\n}\n```",
      },
    ],
  },

  {
    id: "js.ai.04.streaming-ui",
    track: "javascript",
    module: "ai",
    index: 24,
    title: "Streaming LLM output to the browser",
    summary: "Server-sent events (SSE) and how to render tokens as they arrive.",
    concepts: ["js.ai:sse", "js.ai:stream-ui"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Why streaming — perceived latency",
        body:
          "A 2-second wait for the full answer *feels* far worse than seeing tokens tick in over 4 seconds. Streaming is the single biggest UX lever for chat-style interfaces.\n\nThree parts:\n1. **Server** — get the async iterable from the SDK, pipe each chunk out.\n2. **Transport** — Server-Sent Events (SSE) or the newer streaming Response API.\n3. **Client** — read the stream with `fetch`, update state per chunk.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Server: Next.js route handler",
        body:
          "```\n// app/api/chat/route.ts\nimport Anthropic from '@anthropic-ai/sdk';\nexport const runtime = 'nodejs';\n\nexport async function POST(req: Request) {\n  const { message } = await req.json();\n  const client = new Anthropic();\n  const stream = await client.messages.stream({\n    model: 'claude-opus-4-7', max_tokens: 1024,\n    messages: [{ role: 'user', content: message }],\n  });\n\n  const encoder = new TextEncoder();\n  const readable = new ReadableStream({\n    async start(controller) {\n      for await (const chunk of stream) {\n        if (chunk.type === 'content_block_delta' &&\n            chunk.delta.type === 'text_delta') {\n          controller.enqueue(encoder.encode(chunk.delta.text));\n        }\n      }\n      controller.close();\n    },\n  });\n  return new Response(readable, {\n    headers: { 'content-type': 'text/plain; charset=utf-8' },\n  });\n}\n```",
      },
      {
        kind: "read",
        id: "r3",
        title: "Client: consuming the stream",
        body:
          "```\n// In a React component\nasync function send(msg: string) {\n  setAnswer('');\n  const res = await fetch('/api/chat', {\n    method: 'POST',\n    headers: { 'content-type': 'application/json' },\n    body: JSON.stringify({ message: msg }),\n  });\n  if (!res.body) return;\n  const reader = res.body.getReader();\n  const decoder = new TextDecoder();\n  for (;;) {\n    const { done, value } = await reader.read();\n    if (done) break;\n    setAnswer(prev => prev + decoder.decode(value, { stream: true }));\n  }\n}\n```\n\nThat's the entire stream loop. Everything else is polish.",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "Cancel a stream",
        prompt: "The user hits Stop. What do you do?",
        options: [
          "Nothing — let it finish",
          "Reload the page",
          "Call reader.cancel() and abort the fetch with an AbortController",
          "Restart the server",
        ],
        correctIndex: 2,
        why: "Wire an AbortController into the fetch, and call abort() when the user cancels. The reader will unwind cleanly.",
      },
    ],
  },

  {
    id: "js.ai.05.nextjs-routes",
    track: "javascript",
    module: "ai",
    index: 25,
    title: "Next.js API routes for AI",
    summary: "The right place to call model providers. Never call them from the browser.",
    concepts: ["js.ai:nextjs:api"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Why not from the browser",
        body:
          "If you put your API key in client code, anyone can steal it and burn your budget. Always call model APIs from the **server** — a Next.js API route, a Server Action, or a dedicated backend.\n\nBonus: server-side you can prompt-cache, log, rate-limit per user, and keep the system prompt private.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Route handler shape (App Router)",
        body:
          "```\n// app/api/complete/route.ts\nimport { z } from 'zod';\nimport Anthropic from '@anthropic-ai/sdk';\n\nconst Input = z.object({ prompt: z.string().min(1).max(4000) });\nconst client = new Anthropic();\n\nexport async function POST(req: Request) {\n  const parsed = Input.safeParse(await req.json());\n  if (!parsed.success) {\n    return Response.json({ error: 'bad input' }, { status: 400 });\n  }\n  const msg = await client.messages.create({\n    model: 'claude-opus-4-7', max_tokens: 512,\n    messages: [{ role: 'user', content: parsed.data.prompt }],\n  });\n  const text = msg.content.map(b => b.type === 'text' ? b.text : '').join('');\n  return Response.json({ text, usage: msg.usage });\n}\n```",
      },
      {
        kind: "read",
        id: "r3",
        title: "Rate-limit per user",
        body:
          "Every LLM endpoint needs rate limiting. Simplest option: **Upstash Ratelimit** with their Redis:\n\n```\nimport { Ratelimit } from '@upstash/ratelimit';\nimport { Redis } from '@upstash/redis';\n\nconst limiter = new Ratelimit({\n  redis: Redis.fromEnv(),\n  limiter: Ratelimit.slidingWindow(20, '1 m'),\n});\n\nexport async function POST(req: Request) {\n  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';\n  const { success, remaining } = await limiter.limit(ip);\n  if (!success) return new Response('rate limited', { status: 429 });\n  // ...proceed\n}\n```\n\nWithout this, one bad actor can drain your model budget in an hour.",
      },
    ],
  },

  {
    id: "js.ai.06.server-actions",
    track: "javascript",
    module: "ai",
    index: 26,
    title: "Server Actions — write to your app with types",
    summary: "Next.js's typed RPC. Great for form-driven AI features.",
    concepts: ["js.ai:server-actions"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "What Server Actions solve",
        body:
          "For non-streaming AI features (extract structured data from a form, classify, summarize), Server Actions let you call server code as if it were a typed function — no route handler boilerplate, no JSON wrangling on the client.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Shape",
        body:
          "```\n// app/actions.ts\n'use server';\nimport Anthropic from '@anthropic-ai/sdk';\nimport { z } from 'zod';\n\nconst Input = z.object({ url: z.string().url() });\nconst client = new Anthropic();\n\nexport async function summarize(input: z.infer<typeof Input>) {\n  const { url } = Input.parse(input);\n  const html = await (await fetch(url)).text();\n  const msg = await client.messages.create({\n    model: 'claude-opus-4-7', max_tokens: 400,\n    messages: [{ role: 'user',\n                 content: `Summarize in 3 bullets:\\n\\n${html.slice(0, 20000)}` }],\n  });\n  return { text: msg.content.map(b => b.type === 'text' ? b.text : '').join('') };\n}\n```\n\n```\n// app/page.tsx  (client or server component)\n'use client';\nimport { summarize } from './actions';\nexport default function Page() {\n  return <form action={async fd => {\n    const r = await summarize({ url: fd.get('url') as string });\n    console.log(r.text);\n  }}><input name=\"url\" /></form>;\n}\n```",
      },
      {
        kind: "read",
        id: "r3",
        title: "When to use which",
        body:
          "- **Server Action** — user submits, waits for result, gets it once. No streaming, no long-running.\n- **Route handler** — streaming, third-party clients, cron jobs, webhooks.\n- Both live server-side. Both use the same SDK code. Pick based on the interaction pattern.",
      },
    ],
  },

  {
    id: "js.ai.07.chat-ui",
    track: "javascript",
    module: "ai",
    index: 27,
    title: "Building a chat UI",
    summary: "Message list + input + streaming assistant response. The core AI-app pattern.",
    concepts: ["js.ai:chat-ui"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "State model",
        body:
          "```\ntype Msg = { role: 'user' | 'assistant'; content: string };\nconst [messages, setMessages] = useState<Msg[]>([]);\nconst [input, setInput]       = useState('');\nconst [pending, setPending]   = useState(false);\n```\n\nEvery chat UI is a growing array of messages + a controlled input + a pending flag. Everything else is polish.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Send flow",
        body:
          "```\nasync function send() {\n  const userMsg: Msg = { role: 'user', content: input };\n  const next = [...messages, userMsg, { role: 'assistant' as const, content: '' }];\n  setMessages(next);\n  setInput('');\n  setPending(true);\n\n  const res = await fetch('/api/chat', {\n    method: 'POST',\n    headers: { 'content-type': 'application/json' },\n    body: JSON.stringify({ messages: next.slice(0, -1) }),\n  });\n  const reader = res.body!.getReader();\n  const dec = new TextDecoder();\n  let acc = '';\n  for (;;) {\n    const { done, value } = await reader.read();\n    if (done) break;\n    acc += dec.decode(value, { stream: true });\n    setMessages(m => {\n      const copy = m.slice();\n      copy[copy.length - 1] = { role: 'assistant', content: acc };\n      return copy;\n    });\n  }\n  setPending(false);\n}\n```\n\nOptimistic UI: add both messages before waiting, populate assistant as the stream arrives.",
      },
      {
        kind: "read",
        id: "r3",
        title: "The details that matter",
        body:
          "- **Auto-scroll to bottom** as new tokens arrive — unless the user has scrolled up (respect their scroll position).\n- **Stop button** → AbortController.abort(); revert pending.\n- **Markdown rendering** — most LLMs output markdown. `react-markdown` + `remark-gfm` handles it. Sanitize.\n- **Code blocks** — highlight, copy button, language label.\n- **Copy message**, **regenerate**, **edit last user message** — table-stakes actions.\n- **Empty state** — a few example prompts. Never launch users into a blank void.",
      },
    ],
  },

  {
    id: "js.ai.08.vercel-ai-sdk",
    track: "javascript",
    module: "ai",
    index: 28,
    title: "Vercel AI SDK — batteries-included patterns",
    summary: "Provider-agnostic hooks + streaming helpers. Skip the boilerplate.",
    concepts: ["js.ai:vercel-ai"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "What it gives you",
        body:
          "The Vercel AI SDK (`ai`) is an abstraction over model providers with:\n- Provider adapters (`@ai-sdk/anthropic`, `@ai-sdk/openai`, others).\n- `streamText`, `generateText`, `generateObject` server helpers.\n- `useChat`, `useCompletion` React hooks that handle the streaming loop for you.\n\nUse it when you want to move fast and don't need provider-specific features. Drop back to raw SDKs when you do.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Server: streamText",
        body:
          "```\n// app/api/chat/route.ts\nimport { streamText } from 'ai';\nimport { anthropic } from '@ai-sdk/anthropic';\n\nexport const runtime = 'edge';\n\nexport async function POST(req: Request) {\n  const { messages } = await req.json();\n  const result = await streamText({\n    model: anthropic('claude-opus-4-7'),\n    system: 'You are a helpful assistant.',\n    messages,\n  });\n  return result.toDataStreamResponse();\n}\n```\n\nSwap `anthropic('claude-opus-4-7')` for `openai('gpt-4o')` — same API, different provider.",
      },
      {
        kind: "read",
        id: "r3",
        title: "Client: useChat",
        body:
          "```\n'use client';\nimport { useChat } from 'ai/react';\n\nexport default function Chat() {\n  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat();\n  return (\n    <>\n      {messages.map(m => (\n        <div key={m.id}><b>{m.role}:</b> {m.content}</div>\n      ))}\n      <form onSubmit={handleSubmit}>\n        <input value={input} onChange={handleInputChange} />\n        <button disabled={isLoading}>Send</button>\n        {isLoading && <button type=\"button\" onClick={stop}>Stop</button>}\n      </form>\n    </>\n  );\n}\n```\n\nEverything a chat UI needs, in ~15 lines.",
      },
      {
        kind: "read",
        id: "r4",
        title: "Structured objects",
        body:
          "```\nimport { generateObject } from 'ai';\nimport { openai } from '@ai-sdk/openai';\nimport { z } from 'zod';\n\nconst { object } = await generateObject({\n  model: openai('gpt-4o-2024-08-06'),\n  schema: z.object({\n    name: z.string(),\n    tags: z.array(z.string()),\n  }),\n  prompt: 'Extract structured data from: \"Ada, tags: math, engine\".',\n});\nconsole.log(object);   // typed to the Zod schema\n```",
      },
    ],
  },

  {
    id: "js.ai.09.auth-persist",
    track: "javascript",
    module: "ai",
    index: 29,
    title: "Auth + persistence for AI apps",
    summary: "Users, sessions, chat history — the boring must-haves.",
    concepts: ["js.ai:auth", "js.ai:db"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Auth stack",
        body:
          "Pick one and move on:\n- **NextAuth / Auth.js** — self-hosted, many providers, tight Next.js integration.\n- **Clerk** — hosted, gorgeous UI components, generous free tier.\n- **Supabase Auth** — bundled with Postgres + row-level security.\n\nRule: don't invent your own auth for an LLM app. You have interesting problems to solve; this isn't one.",
      },
      {
        kind: "read",
        id: "r2",
        title: "What to persist per user",
        body:
          "- **Conversations** — id, user_id, title, created_at.\n- **Messages** — conv_id, role, content, tool_calls (as JSON), tokens_in, tokens_out, created_at.\n- **Usage** — daily rollups per user for cost caps and analytics.\n- **API keys** (if bring-your-own) — **encrypted at rest**.\n- Feature flags per user (which model they're on, beta features).",
      },
      {
        kind: "read",
        id: "r3",
        title: "Sketch — Supabase",
        body:
          "```\nCREATE TABLE conversations (\n  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id    uuid NOT NULL,\n  title      text,\n  created_at timestamptz DEFAULT now()\n);\nCREATE TABLE messages (\n  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  conv_id      uuid REFERENCES conversations(id) ON DELETE CASCADE,\n  role         text NOT NULL,\n  content      text NOT NULL,\n  tool_calls   jsonb,\n  tokens_in    int,\n  tokens_out   int,\n  created_at   timestamptz DEFAULT now()\n);\nALTER TABLE conversations ENABLE ROW LEVEL SECURITY;\nCREATE POLICY own ON conversations USING (auth.uid() = user_id);\n```\n\nRow-level security means a query can only ever return rows the current user owns. Belt and suspenders — do it at the DB, not just the app layer.",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "Where should message history live?",
        prompt: "For a multi-device AI chat app:",
        options: [
          "Browser localStorage only",
          "In-memory server state",
          "A durable database, keyed by user_id, with RLS",
          "The model's context window",
        ],
        correctIndex: 2,
        why: "localStorage doesn't sync across devices. Memory dies with the process. Context has limits. The DB is the only right answer.",
      },
    ],
  },

  {
    id: "js.ai.10.deploy",
    track: "javascript",
    module: "ai",
    index: 30,
    title: "Deploy + monitor an AI app",
    summary: "From localhost to shipped, with the guardrails you'll actually need.",
    concepts: ["js.ai:deploy", "js.ai:monitor"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Deploy target choices",
        body:
          "- **Vercel** — best default for Next.js. Zero config, edge runtime available, generous free tier.\n- **Cloudflare Workers / Pages** — edge everywhere, cheap, but some Node APIs unavailable.\n- **Fly.io / Railway** — persistent servers, when you need long-running processes or self-hosted state.\n- **AWS / GCP** — when you need what only they offer, otherwise a lot of yak-shaving.\n\nStart with Vercel unless you have a reason not to. Move when a specific pain forces it.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Environment variables — the right way",
        body:
          "- Never commit `.env` files.\n- Every provider (Vercel etc.) has a UI for secrets. Set `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, DB URLs, Redis URLs there.\n- Prefix with `NEXT_PUBLIC_` **only** for values safe to expose in the browser — never API keys.\n- Use different keys per environment (dev / preview / prod).",
      },
      {
        kind: "read",
        id: "r3",
        title: "Runtime timeouts",
        body:
          "Serverless functions have max durations. Long LLM streams can hit them.\n\n- Vercel default: 10s (hobby), 60s (pro), configurable to 300s.\n- Set `export const maxDuration = 60` at the top of the route file.\n- For very long agents, use a background job (Inngest, Trigger.dev, Vercel Queue) and poll from the client.",
      },
      {
        kind: "read",
        id: "r4",
        title: "Observability, day 1",
        body:
          "Wire up on launch — not after your first incident:\n- **Error tracking** — Sentry catches server AND client errors.\n- **LLM tracing** — Langfuse or Helicone to see every prompt, response, cost per user.\n- **Product analytics** — PostHog for feature usage funnels.\n- **Uptime pings** — a simple `/api/health` endpoint that hits your DB + a $0 external ping.\n- **Cost dashboard** — daily cost by user and by model. If you can't answer 'who's my most expensive user?' in seconds, you can't reason about profit.",
      },
      {
        kind: "explain",
        id: "x1",
        title: "Explain — your first launch",
        prompt:
          "You're about to open your AI app to real users tomorrow. List 5 things you'd verify tonight before flipping the switch.",
        minWords: 60,
      },
    ],
  },
];
