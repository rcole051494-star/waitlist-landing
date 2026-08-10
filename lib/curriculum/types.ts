export type Track = "python" | "javascript";

// One line of a worked-example walkthrough: what this line does, and what
// the program's state looks like afterwards. Modeled on the "worked example
// effect" — beginners learn faster from studying fully traced examples than
// from attempting problems cold.
export type TraceLine = {
  code: string; // the line (or small group of lines) being explained
  what: string; // plain-language description of what happens
  state?: string; // optional: variable values after this line, e.g. "age = 25"
  output?: string; // optional: what gets printed at this point
};

// A common mistake, shown *before* the learner makes it.
export type Pitfall = {
  wrong: string; // the tempting-but-broken code
  problem: string; // what actually happens and why
  right?: string; // the corrected version
};

export type Step =
  | {
      kind: "read";
      id: string;
      title: string;
      body: string; // markdown-ish (rendered manually)
    }
  | {
      kind: "trace";
      id: string;
      title: string;
      intro?: string;
      code: string; // the full program being traced
      lines: TraceLine[];
      takeaway?: string;
    }
  | {
      kind: "pitfalls";
      id: string;
      title: string;
      intro?: string;
      items: Pitfall[];
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
      hint?: string; // legacy single hint
      hints?: string[]; // progressive ladder: nudge → stronger → nearly there
      why?: string; // shown after answering: why the output is what it is
    }
  | {
      kind: "fix";
      id: string;
      title: string;
      buggy: string;
      expected: string; // expected stdout when correct
      hint?: string;
      hints?: string[];
      solution?: string; // full working code, revealed on request
      solutionWhy?: string; // what was wrong and why the fix works
    }
  | {
      kind: "write";
      id: string;
      title: string;
      prompt: string;
      starter: string;
      expected: string; // stdout to match
      hint?: string;
      hints?: string[];
      solution?: string;
      solutionWhy?: string;
    }
  // Parsons problem: reorder shuffled lines into a working program. Teaches
  // structure and sequencing without syntax errors blocking progress — well
  // evidenced as comparable to writing-from-scratch in less time and with
  // less frustration for novices.
  | {
      kind: "parsons";
      id: string;
      title: string;
      prompt: string;
      solution: string[]; // correct order; the UI shuffles a copy
      expectedOutput?: string; // what the finished program prints
      hints?: string[];
      explanation?: string; // shown once they get it right
    }
  // Fill-in-the-blank over a code template. The scaffold between reading
  // working code and producing it from nothing.
  | {
      kind: "cloze";
      id: string;
      title: string;
      prompt?: string;
      template: string; // code containing {{0}}, {{1}}, … placeholders
      blanks: {
        answer: string; // canonical answer
        accept?: string[]; // other acceptable spellings (e.g. "x" vs 'x')
        width?: number; // input width in chars
      }[];
      explanation?: string;
    }
  // Sort items into categories. Good for the either/or distinctions that
  // trip people up: mutable vs immutable, truthy vs falsy, let vs const.
  | {
      kind: "categorize";
      id: string;
      title: string;
      prompt: string;
      buckets: string[];
      items: { text: string; bucket: number; why?: string }[];
    }
  | {
      kind: "explain";
      id: string;
      title: string;
      prompt: string; // asks user to write explanation
      minWords?: number;
      sampleAnswer?: string; // revealed after they write theirs, to compare against
    }
  | {
      kind: "mcq";
      id: string;
      title: string;
      prompt: string;
      options: string[];
      correctIndex: number;
      why?: string;
      optionFeedback?: string[]; // per-option explanation of why it's wrong/right
    };

export type Module = "foundation" | "ai";

export type Lesson = {
  id: string; // e.g. "py.01.variables"
  track: Track;
  module?: Module; // default "foundation"
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
