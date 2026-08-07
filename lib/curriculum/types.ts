export type Track = "python" | "javascript";

export type Step =
  | {
      kind: "read";
      id: string;
      title: string;
      body: string; // markdown-ish (rendered manually)
    }
  | {
      kind: "example";
      id: string;
      title: string;
      code: string;
      note?: string;
    }
  | {
      kind: "predict";
      id: string;
      title: string;
      code: string;
      answer: string; // expected stdout (trimmed compared)
      hint?: string;
    }
  | {
      kind: "fix";
      id: string;
      title: string;
      buggy: string;
      expected: string; // expected stdout when correct
      hint?: string;
    }
  | {
      kind: "write";
      id: string;
      title: string;
      prompt: string;
      starter: string;
      expected: string; // stdout to match
      hint?: string;
    }
  | {
      kind: "explain";
      id: string;
      title: string;
      prompt: string; // asks user to write explanation
      minWords?: number;
    }
  | {
      kind: "mcq";
      id: string;
      title: string;
      prompt: string;
      options: string[];
      correctIndex: number;
      why?: string;
    };

export type Lesson = {
  id: string; // e.g. "py.01.variables"
  track: Track;
  index: number;
  title: string;
  summary: string;
  concepts: string[]; // SRS concept ids seeded from this lesson
  steps: Step[];
};

export type Project = {
  id: string;
  track: Track;
  title: string;
  summary: string;
  goal: string;
  starter: string;
  hints: string[];
  successCheck: (stdout: string) => boolean;
};
