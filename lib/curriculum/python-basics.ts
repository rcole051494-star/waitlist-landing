import type { Lesson } from "./types";

// A true ground-zero primer. Assumes nothing: not what a program is, not
// what "running" code means, not what a variable is. Every later lesson
// builds on this one.

export const pythonBasicsLesson: Lesson = {
  id: "py.00.basics",
  track: "python",
  module: "foundation",
  index: 0,
  title: "Start here: what even is code?",
  summary: "No assumptions. What a program is, what 'running' it means, and your first line of Python.",
  concepts: ["py:program", "py:run", "py:print", "py:variable-intro"],
  steps: [
    {
      kind: "read",
      id: "r1",
      title: "What a program actually is",
      body:
        "A **program** is just a list of instructions, written in a language the computer understands, that get carried out one after another, top to bottom — like a recipe.\n\n`print('hello')` is one instruction: \"show the text hello.\" A whole program is a stack of instructions like that.\n\n**Python** is one such language. It's a language because it has rules (grammar) — you type text following those rules, and a program called the **Python interpreter** reads your text and carries out each instruction.",
    },
    {
      kind: "read",
      id: "r2",
      title: "What 'running' code means",
      body:
        "Every code box in this app has a **▶ Run** button. Clicking it does exactly one thing: it hands your code to the Python interpreter and lets it carry out your instructions, one line at a time, top to bottom.\n\nWhatever your code tells Python to **show** — using `print(...)` — appears below the code box, in a section usually labeled with the output. This is the single most important loop you'll repeat for the rest of this app: **write code → click Run → read what happened → adjust.**",
    },
    {
      kind: "example",
      id: "e1",
      title: "Your first program",
      code: "print('hello, world')\n",
      note:
        "Click ▶ Run above. You should see the text 'hello, world' appear below. `print(...)` is a built-in instruction meaning 'show this on screen.' Anything inside the quotes is shown exactly as typed.",
    },
    {
      kind: "example",
      id: "e2",
      title: "Multiple instructions run in order",
      code: "print('step one')\nprint('step two')\nprint('step three')\n",
      note: "Three separate instructions, each on its own line. Python runs them top to bottom — the output appears in that same order.",
    },
    {
      kind: "read",
      id: "r3",
      title: "What a variable is (forget any jargon)",
      body:
        "Sometimes you want to use the same piece of information more than once, or give it a memorable name instead of retyping it. A **variable** is just a name you invent, that you attach to a piece of information so you can refer back to it.\n\nThink of it like a sticky note: you write a name on the note (`age`), and stick it onto a value (`25`). Later, whenever you use `age`, Python looks at the sticky note and uses whatever value is currently stuck to it.\n\nThe `=` sign does this 'sticking': `age = 25` means \"create a sticky note called age, and stick it to the value 25.\"\n\nImportant: this `=` is **not** the same as the equals sign in math class (\"these two things are equal\"). Here it means \"assign\" — put this value under this name.",
    },
    {
      kind: "example",
      id: "e3",
      title: "Using a variable",
      code: "age = 25\nprint(age)\nprint('I am', age, 'years old')\n",
      note:
        "Line 1 creates the sticky note. Lines 2–3 use it. Notice `print` can take several things separated by commas — it shows them all, separated by spaces.",
    },
    {
      kind: "predict",
      id: "p1",
      title: "Predict the output",
      code: "city = 'Boston'\nprint('I live in', city)\n",
      answer: "I live in Boston",
      hint: "print joins everything you give it with a single space, in order.",
    },
    {
      kind: "read",
      id: "r4",
      title: "Errors are not scary — they're messages",
      body:
        "When Python can't carry out an instruction, it stops and prints an **error message** in red instead of your normal output. This is Python telling you exactly what confused it — not a sign you broke something permanently.\n\nThe last line of an error usually names the problem in plain English, e.g. `NameError: name 'xyz' is not defined` means \"you used a name I've never heard of.\" Reading that last line first is the single best debugging habit you can build.",
    },
    {
      kind: "fix",
      id: "f1",
      title: "Fix: read the error, then fix it",
      buggy: "name = 'Ada'\nprint(nam)\n",
      expected: "Ada",
      hint: "The error says a name isn't defined. Compare the variable name on line 1 to the one used on line 2 — they don't match.",
    },
    {
      kind: "write",
      id: "w1",
      title: "Write it: your own two variables",
      prompt:
        "Create a variable called `pet` set to 'cat' (or any word you like) and a variable called `count` set to 2. Print exactly: I have 2 cat",
        starter: "# create your variables, then print the sentence\n",
      expected: "I have 2 cat",
      hint: "print(...) can take multiple comma-separated pieces, and prints them separated by spaces.",
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
