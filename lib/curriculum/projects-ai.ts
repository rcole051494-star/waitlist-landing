import type { Project } from "./types";

// AI-engineer projects. These are guided read-heavy build plans — the
// success check is aspirational (you'll run these locally against real APIs).

export const aiProjects: Project[] = [
  {
    id: "py.proj.rag-cli",
    track: "python",
    title: "Doc Q&A — a RAG CLI",
    summary: "Ingest a folder of markdown files. Ask questions. Get grounded answers with citations.",
    goal:
      "Build a CLI: `python ask.py 'What is our refund policy?'`. It embeds all .md files in a directory once, stores vectors, retrieves top-k on each query, prompts a model with them, and prints an answer with source paths.",
    starter:
      `# Sketch — fill in the ...\nimport os, glob, pickle\nimport numpy as np\nfrom pathlib import Path\n\nfrom openai import OpenAI  # or use anthropic + sentence-transformers\nclient = OpenAI()\n\ndef chunk(text, size=500, overlap=50):\n    words = text.split()\n    for i in range(0, len(words), size - overlap):\n        yield ' '.join(words[i:i + size])\n\ndef embed(texts):\n    r = client.embeddings.create(model='text-embedding-3-small', input=texts)\n    return np.array([d.embedding for d in r.data])\n\ndef build_index(dir):\n    chunks, sources = [], []\n    for p in glob.glob(f'{dir}/**/*.md', recursive=True):\n        for c in chunk(Path(p).read_text()):\n            chunks.append(c); sources.append(p)\n    V = embed(chunks)\n    return {'V': V, 'chunks': chunks, 'sources': sources}\n\ndef answer(index, q, k=5):\n    ...\n\nif __name__ == '__main__':\n    ...\n`,
    hints: [
      "Build the index once and pickle it; cheap on rebuild if content unchanged.",
      "Cosine similarity — `V @ q` when both are normalized (OpenAI embeddings already are).",
      "System prompt: 'answer using only these sources; cite them; say I don't know if unsupported.'",
      "Once it works, add filters: --topk, --source, --model, --show-context.",
    ],
    successCheck: () => false, // this project is run locally
  },

  {
    id: "py.proj.coding-agent",
    track: "python",
    title: "Coding assistant agent",
    summary: "Tool-use loop with read/edit/list/shell tools that can modify a repo you point it at.",
    goal:
      "Run: `python agent.py --repo ./mytask 'Add a --verbose flag to main.py'`. Agent lists files, reads the relevant ones, proposes and applies an edit, and describes what it did.",
    starter:
      `# Sketch\nimport subprocess, json\nfrom pathlib import Path\nfrom anthropic import Anthropic\n\nclient = Anthropic()\n\ndef tools_for(repo_root: Path):\n    return [\n        {'name': 'list_files',\n         'description': 'List files under a path (relative to repo root).',\n         'input_schema': {'type':'object','properties':{'path':{'type':'string'}},'required':['path']}},\n        {'name': 'read_file',\n         'description': 'Read a file relative to repo root.',\n         'input_schema': {'type':'object','properties':{'path':{'type':'string'}},'required':['path']}},\n        {'name': 'edit_file',\n         'description': 'Replace occurrences of old_str with new_str in a file. Fails if old_str is not unique.',\n         'input_schema': {'type':'object',\n            'properties':{'path':{'type':'string'},'old_str':{'type':'string'},'new_str':{'type':'string'}},\n            'required':['path','old_str','new_str']}},\n    ]\n\ndef run_tool(root: Path, name, args):\n    ...\n\ndef run(repo, goal, max_steps=25):\n    ...\n`,
    hints: [
      "Confine every path to the repo root — reject anything with '..' or absolute paths.",
      "edit_file: read → verify old_str appears exactly once → write. Return an error otherwise.",
      "Always return a structured tool_result; on tool errors set is_error=True so the model can recover.",
      "Cap tool_use iterations. Log every step. Print diffs before writing if you want a safe mode.",
    ],
    successCheck: () => false,
  },

  {
    id: "py.proj.evals-harness",
    track: "python",
    title: "Evals harness",
    summary: "Score prompt variants against a labeled dataset. Regress-test every prompt change.",
    goal:
      "Given `dataset.jsonl` of {input, expected}, run each candidate prompt, score outputs, print a leaderboard with per-example diffs.",
    starter:
      `# Sketch\nimport json, asyncio\nfrom dataclasses import dataclass\n\n@dataclass\nclass Case:\n    input: str\n    expected: str\n\ndef load_cases(path):\n    return [Case(**json.loads(l)) for l in open(path)]\n\nasync def run_prompt(prompt: str, cases: list[Case]):\n    # Call model for each case with prompt, collect outputs\n    ...\n\ndef score(pred: str, gold: str) -> float:\n    # Start with exact match or containment; upgrade to LLM-as-judge later\n    ...\n\ndef report(results):\n    # Aggregate per prompt: mean score, top failures\n    ...\n\nif __name__ == '__main__':\n    ...\n`,
    hints: [
      "Bounded parallelism with asyncio.Semaphore(10) so you don't get rate-limited.",
      "Save raw outputs to a run-log JSONL — you'll want them for post-mortems.",
      "For LLM-as-judge, use a different provider/model than the one you're evaluating when possible.",
      "The tool becomes really valuable when you graph score over time as you iterate on the prompt.",
    ],
    successCheck: () => false,
  },

  {
    id: "py.proj.extractor",
    track: "python",
    title: "Structured data extractor",
    summary: "Messy text in, validated JSON out. With retries when validation fails.",
    goal:
      "Given a folder of `.txt` files (invoices, resumes, emails — pick one) extract typed structured data with pydantic, validate at the boundary, retry on failure with error feedback.",
    starter:
      `# Sketch — invoice extractor\nfrom pydantic import BaseModel, Field\nfrom openai import OpenAI\nimport json\n\nclient = OpenAI()\n\nclass LineItem(BaseModel):\n    description: str\n    quantity: int = Field(ge=1)\n    unit_price: float = Field(ge=0)\n\nclass Invoice(BaseModel):\n    invoice_number: str\n    vendor: str\n    date: str  # ISO 8601\n    items: list[LineItem]\n    total: float\n\ndef extract(text: str, tries: int = 3) -> Invoice:\n    ...\n`,
    hints: [
      "Use openai.beta.chat.completions.parse with response_format=Invoice for strict schema enforcement.",
      "On ValidationError, append the error message to the prompt and retry — the model self-corrects when told what was wrong.",
      "For long documents, chunk and extract per chunk, then merge — safer than one giant prompt.",
      "Add a --dry-run flag; emit a report of parsed vs failed files.",
    ],
    successCheck: () => false,
  },

  {
    id: "js.proj.ai-web-app",
    track: "javascript",
    title: "Full-stack AI chat app",
    summary: "Next.js + Anthropic (or OpenAI) + auth + persistence + streaming + deploy.",
    goal:
      "Ship a real chat UI: login (Auth.js or Clerk), conversations saved per user, streaming assistant replies, model picker (Claude / GPT), deployed to Vercel.",
    starter:
      `// High-level plan — build this incrementally, don't try to write it all at once.\n\n// 1. \`npx create-next-app@latest ai-chat --typescript --tailwind --app\`\n// 2. Add \`ai\` + \`@ai-sdk/anthropic\` + \`@ai-sdk/openai\`\n// 3. app/api/chat/route.ts — streamText with a model chosen from the request body\n// 4. app/page.tsx — useChat() hook, message list, input, stop button\n// 5. Add Clerk (fastest): \`npm i @clerk/nextjs\`, wrap with <ClerkProvider>, middleware.ts\n// 6. Add Supabase for conversations + messages tables (RLS on user_id)\n// 7. Save each user turn + assistant reply after stream completes\n// 8. Sidebar with past conversations, new-chat button\n// 9. Deploy to Vercel; add env vars for ANTHROPIC_API_KEY, OPENAI_API_KEY, DB, Clerk\n// 10. Add rate limiting per user before you post the link anywhere public\n\n// Ship the skeleton first. Add features when the skeleton works end-to-end.\n`,
    hints: [
      "Skeleton before polish — get a message round-trip end-to-end before adding auth or persistence.",
      "Persist AFTER the stream completes — try/finally in the route handler, or on the client after 'done'.",
      "Model picker: keep it a simple string in the request body; validate against a whitelist server-side.",
      "Rate limit per user_id (not just IP) once you have auth. Cost cap per user per day is a nice touch.",
    ],
    successCheck: () => false,
  },
];
