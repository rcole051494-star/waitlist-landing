export type Provider = "anthropic" | "openai";

export type TutorSettings = {
  provider: Provider;
  apiKey: string;
  model: string;
};

export type ChatMsg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
};

// Snapshot of what the learner is currently looking at / has done.
// Kept up to date by LessonViewer + Runner so the tutor can "see" it.
export type LessonContext = {
  track?: "python" | "javascript";
  lessonTitle?: string;
  lessonSummary?: string;
  stepTitle?: string;
  stepKind?: string;
  stepPrompt?: string; // instructions/body text for the current step
  referenceCode?: string; // example/buggy/starter code as originally given
  expected?: string; // expected output, if this step has one
  userCode?: string; // what the learner currently has in the editor
  lastStdout?: string;
  lastStderr?: string;
  lastError?: string;
};

export const DEFAULT_MODELS: Record<Provider, string> = {
  anthropic: "claude-opus-4-7",
  openai: "gpt-4o",
};

export const MODEL_OPTIONS: Record<Provider, { id: string; label: string }[]> = {
  anthropic: [
    { id: "claude-opus-4-7", label: "Claude Opus 4.7" },
    { id: "claude-sonnet-5", label: "Claude Sonnet 5" },
    { id: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5 (fastest)" },
  ],
  openai: [
    { id: "gpt-4o", label: "GPT-4o" },
    { id: "gpt-4o-mini", label: "GPT-4o mini (fastest)" },
  ],
};
