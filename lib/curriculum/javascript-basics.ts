import type { Lesson } from "./types";

// Same zero-assumption primer, for JavaScript. Deliberately does not assume
// the learner did the Python track first — someone could start here cold.

export const javascriptBasicsLesson: Lesson = {
  id: "js.00.basics",
  track: "javascript",
  module: "foundation",
  index: 0,
  title: "Start here: what even is code?",
  summary: "No assumptions. What a program is, what 'running' it means, and your first line of JavaScript.",
  concepts: ["js:program", "js:run", "js:console-log", "js:variable-intro"],
  steps: [
    {
      kind: "read",
      id: "r1",
      title: "What a program actually is",
      body:
        "A **program** is a list of instructions, written in a language the computer understands, carried out one after another, top to bottom — like a recipe.\n\n`console.log('hello')` is one instruction: \"show the text hello.\" A whole program is a stack of instructions like that.\n\n**JavaScript** is one such language — it has its own grammar rules. When you click Run, a program called a **JavaScript engine** reads your text and carries out each instruction.",
    },
    {
      kind: "read",
      id: "r2",
      title: "What 'running' code means",
      body:
        "Every code box in this app has a **▶ Run** button. Clicking it hands your code to a JavaScript engine, which carries out your instructions top to bottom.\n\nWhatever your code tells JavaScript to **show** — using `console.log(...)` — appears below the code box. This is the loop you'll repeat constantly: **write code → click Run → read what happened → adjust.**\n\n(`console.log` is the JavaScript equivalent of Python's `print` — same idea, different name.)",
    },
    {
      kind: "example",
      id: "e1",
      title: "Your first program",
      code: "console.log('hello, world');\n",
      note:
        "Click ▶ Run above. 'hello, world' appears below. `console.log(...)` means 'show this on screen.' The semicolon `;` marks the end of an instruction — JavaScript is forgiving about it, but it's good habit to include it.",
    },
    {
      kind: "example",
      id: "e2",
      title: "Multiple instructions run in order",
      code: "console.log('step one');\nconsole.log('step two');\nconsole.log('step three');\n",
      note: "Three separate instructions, each ending in `;`. JavaScript runs them top to bottom — output appears in that order.",
    },
    {
      kind: "read",
      id: "r3",
      title: "What a variable is (forget any jargon)",
      body:
        "Sometimes you want to reuse the same piece of information, or give it a memorable name. A **variable** is a name you invent, attached to a piece of information so you can refer back to it.\n\nThink of it like a sticky note: you write a name on it (`age`), and stick it onto a value (`25`). Later, using `age` makes JavaScript look at the note and use whatever's stuck to it right now.\n\n`const age = 25;` does this sticking. `const` means \"I'm creating a new sticky note.\" The `=` means \"stick this value to it\" — not the math-class 'equals', but 'assign'.",
    },
    {
      kind: "example",
      id: "e3",
      title: "Using a variable",
      code: "const age = 25;\nconsole.log(age);\nconsole.log('I am', age, 'years old');\n",
      note:
        "Line 1 creates the sticky note. Lines 2–3 use it. `console.log` can take several things separated by commas — it shows them all, space-separated.",
    },
    {
      kind: "predict",
      id: "p1",
      title: "Predict the output",
      code: "const city = 'Boston';\nconsole.log('I live in', city);\n",
      answer: "I live in Boston",
      hint: "console.log joins everything you give it with a single space, in order.",
    },
    {
      kind: "read",
      id: "r4",
      title: "Errors are not scary — they're messages",
      body:
        "When JavaScript can't carry out an instruction, it stops and shows an **error message** in red instead of your normal output. This is JavaScript telling you exactly what confused it, not a sign you broke something.\n\nThe error usually names the problem in plain English, e.g. `ReferenceError: xyz is not defined` means \"you used a name I've never heard of.\" Reading that message first is the best debugging habit you can build.",
    },
    {
      kind: "fix",
      id: "f1",
      title: "Fix: read the error, then fix it",
      buggy: "const name = 'Ada';\nconsole.log(nam);\n",
      expected: "Ada",
      hint: "The error says a name isn't defined. Compare the variable name on line 1 to the one used on line 2 — they don't match.",
    },
    {
      kind: "write",
      id: "w1",
      title: "Write it: your own two variables",
      prompt:
        "Create a variable called `pet` set to 'cat' (or any word you like) and a variable called `count` set to 2. Log exactly: I have 2 cat",
      starter: "// create your variables, then log the sentence\n",
      expected: "I have 2 cat",
      hint: "console.log(...) can take multiple comma-separated pieces, and logs them separated by spaces.",
    },
    {
      kind: "explain",
      id: "x1",
      title: "In your own words",
      prompt: "Explain to a friend who has never coded: what does clicking 'Run' actually do?",
      minWords: 15,
    },
  ],
};
