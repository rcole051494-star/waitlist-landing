import type { Lesson } from "./types";

// Same zero-assumption primer, for JavaScript. Deliberately does not assume
// the learner did the Python track first — someone could start here cold.

export const javascriptBasicsLesson: Lesson = {
    id: "js.00.basics",
    track: "javascript",
    module: "foundation",
    index: 0,
    title: "Start here: what even is code?",
    summary: 
      "No assumptions. What a program is, what 'running' it means, and your first line of JavaScript.",
    concepts: ["js:program", "js:run", "js:console-log", "js:variable-intro"],
    steps: [
      {
        kind: "hook",
        id: "h1",
        title: "The equals sign is lying to you",
        code: 
          "let score = 10;\n"
          + "score = score + 5;\n"
          + "console.log(score);\n",
        answer: "15",
        reveal: 
          "If you read `score = score + 5` as a maths equation it's nonsense — nothing equals itself plus five.\n\nIt isn't an equation. `=` means **\"work out the right-hand side, then put the result in the box on the left\"**. So: fetch 10, add 5, put 15 back in `score`.\n\nAlmost every early confusion in programming comes from reading `=` as \"equals\" instead of \"becomes\".",
      },
      {
        kind: "read",
        id: "r1",
        title: "What a program actually is",
        body: 
          "A **program** is a list of instructions, written in a language the computer understands, carried out one after another, top to bottom — like a recipe.\n\nA recipe says: *crack the eggs. whisk them. pour into the pan.* Order matters. A program is the same, with one extra catch: the computer does **exactly** what you wrote, not what you meant.\n\nThat's the whole game. The computer isn't being awkward when your code misbehaves; it's being *literal*. Most of learning to code is learning to be precise enough for something that takes you completely at your word.\n\n**JavaScript** is one such language — it has its own grammar rules. When you click Run, a program called a **JavaScript engine** reads your text and carries out each instruction.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Your first program",
        code: 
          "console.log('hello, world');\n",
        note: 
          "Click ▶ Run. 'hello, world' appears below. Anything inside the quotes is shown exactly as typed. The semicolon `;` marks the end of an instruction — JavaScript is forgiving about it, but including it is a good habit. Try changing the words and running again.",
      },
      {
        kind: "read",
        id: "r2",
        title: "What 'running' code means",
        body: 
          "Every code box in this app has a **▶ Run** button. Clicking it hands your code to a JavaScript engine, which carries out your instructions top to bottom.\n\nWhatever your code tells JavaScript to **show** — using `console.log(...)` — appears below the code box.\n\nThat's the loop you'll repeat forever as a programmer:\n\n- **Write** some code\n- **Run** it\n- **Read** what actually happened\n- **Adjust**\n\nNobody writes correct code first try — not beginners, not people who've done this twenty years. The skill isn't writing it perfectly; it's getting fast at that loop.\n\n(`console.log` is JavaScript's way of showing something. The name is historical — it means 'write this to the console', the text output area. Other languages call it `print`.)",
      },
      {
        kind: "trace",
        id: "t1",
        title: "Walk through a 3-line program",
        intro: 
          "Before you write your own, watch one run. Step through line by line and see exactly what JavaScript does at each moment.",
        code: 
          "console.log('step one');\n"
          + "console.log('step two');\n"
          + "console.log('step three');\n",
        lines: [
          {
            code: "console.log('step one');",
            what: 
              "JavaScript starts at the very top. It sees a console.log instruction, so it shows what's inside the parentheses — the text 'step one'. The quotes tell JavaScript 'this is literal text'; they aren't shown themselves.",
            output: "step one",
          },
          {
            code: "console.log('step two');",
            what: 
              "Line 1 is finished, so it moves to line 2. Same instruction, different text, shown on a new line below.",
            output: "step two",
          },
          {
            code: "console.log('step three');",
            what: 
              "Line 3. Shows the third piece of text. No more lines after this, so the program ends.",
            output: "step three",
          },
        ],
        takeaway: 
          "JavaScript reads top to bottom, finishes one line, then moves to the next. When you wonder 'why did it show that?' — trace it with your finger, exactly like this.",
      },
      {
        kind: "read",
        id: "r3",
        title: "What a variable is (forget any jargon)",
        body: 
          "Sometimes you want to reuse a piece of information, or give it a memorable name. A **variable** is a name you invent, attached to a value so you can refer back to it.\n\nThink of a sticky note. You write a name on it — `age` — and stick it onto a value — `25`. Later, using `age` makes JavaScript look at the note and use whatever's stuck to it.\n\n```\nlet age = 25;\n```",
      },
      {
        kind: "trace",
        id: "t2",
        title: "Watch a variable change",
        intro: 
          "This is the line that confuses everyone at first. Step through it slowly.",
        code: 
          "let score = 10;\n"
          + "console.log(score);\n"
          + "score = score + 5;\n"
          + "console.log(score);\n",
        lines: [
          {
            code: "let score = 10;",
            what: 
              "Create a sticky note named 'score' and stick it onto 10. Nothing is shown — making a variable is silent.",
            state: "score = 10",
          },
          {
            code: "console.log(score);",
            what: 
              "Here `score` has no quotes, so JavaScript doesn't treat it as text — it looks up the sticky note and finds 10. It shows that.",
            state: "score = 10",
            output: "10",
          },
          {
            code: "score = score + 5;",
            what: 
              "JavaScript always does the **right side first**. It looks up score (currently 10), adds 5, getting 15. THEN it sticks that back onto score, replacing the old value. The 10 is gone. Note there's no `let` here — the name already exists, we're just changing what it points at.",
            state: "score = 15",
          },
          {
            code: "console.log(score);",
            what: "Looks up score again. It's 15 now — the previous line replaced it.",
            state: "score = 15",
            output: "15",
          },
        ],
        takeaway: 
          "For any line with `=`, work out the whole right side first, then stick the result onto the name on the left. That one rule explains nearly every confusing assignment you'll meet.",
      },
      {
        kind: "read",
        id: "r3b",
        title: "Making a variable, and changing it",
        body: 
          "Reads as: *make a sticky note called age, stick it to the value 25.*\n\nTwo things to notice:\n\n**`let`** announces you're creating a brand-new name. You only use it the first time — after that you just use the name.\n\n**`=` is not the equals sign from maths.** In maths `x = 5` states a fact. Here it's an **action**: put this value under this name. Read it as \"gets\" rather than \"equals\".\n\nThat difference makes lines like `count = count + 1` sensible. As maths it's nonsense — nothing equals itself plus one. As an action it's obvious: *take whatever count is, add 1, put the result back.*",
      },
      {
        kind: "example",
        id: "e3",
        title: "Using a variable",
        code: 
          "let age = 25;\n"
          + "console.log(age);\n"
          + "console.log('I am', age, 'years old');\n",
        note: 
          "Line 1 makes the sticky note. Lines 2–3 use it. `console.log` can take several things separated by commas — it shows them all with a space between each.",
      },
      {
        kind: "read",
        id: "r4",
        title: "Errors are not scary — they're messages",
        body: 
          "When JavaScript can't carry out an instruction, it stops and shows an **error message** in red instead of your normal output.\n\nThis isn't JavaScript being annoyed with you. It's telling you, as precisely as it can, what confused it. An error is the most useful thing on your screen — far better than code that silently does the wrong thing.",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "The three mistakes everyone makes here",
        intro: 
          "You are about to hit all of these. Recognising them now turns a confusing twenty-minute stall into a five-second fix.",
        items: [
          {
            wrong: 
              "let age = 25;\n"
              + "console.log('age');",
            problem: 
              "Shows the literal word 'age', not 25. Quotes mean 'treat this as plain text, don't look anything up'. Without quotes, JavaScript looks up the sticky note. With them, it doesn't.",
            right: 
              "let age = 25;\n"
              + "console.log(age);",
          },
          {
            wrong: "console.log(nickname);",
            problem: 
              "If you never made a sticky note called nickname, JavaScript stops with ReferenceError: nickname is not defined. It means 'you asked me for a name I've never been given'. Usually a typo, or using the name before the line that creates it.",
            right: 
              "let nickname = 'Ren';\n"
              + "console.log(nickname);",
          },
          {
            wrong: 
              "let total = 5;\n"
              + "let total = 8;",
            problem: 
              "SyntaxError: Identifier 'total' has already been declared. `let` means 'make a NEW name' — you only use it once per variable. To change an existing one, drop the `let` and just assign.",
            right: 
              "let total = 5;\n"
              + "total = 8;",
          },
        ],
      },
      {
        kind: "read",
        id: "r4b",
        title: "How to read an error message",
        body: 
          "**Read the first line.** That's where the problem is named, usually in fairly plain English:\n\n- `ReferenceError: x is not defined` → you used a name I've never heard of\n- `SyntaxError: ...` → I couldn't even understand this as JavaScript\n- `TypeError: ...` → you tried to do something to a value that doesn't support it\n\nThe indented lines below are the *stack trace* — where it happened. For now, the first line is what matters.",
      },
      {
        kind: "cloze",
        id: "cl1",
        title: "Fill in the blanks",
        prompt: 
          "This should create a variable holding the number 7, then show it. Fill in the two gaps.",
        template: 
          "{{0}} lucky = 7;\n"
          + "{{1}}(lucky);\n",
        blanks: [
          { answer: "let", width: 4 },
          {
            answer: "console.log",
            accept: ["console.info"],
            width: 12,
          },
        ],
        explanation: 
          "`let` announces a new name; `console.log` shows something on screen. Those two are the backbone of almost every program you'll write for a while.",
      },
      {
        kind: "parsons",
        id: "pa1",
        title: "Put the program in order",
        prompt: 
          "These lines are shuffled. Put them in the order that makes the program work — JavaScript runs top to bottom, so a variable must exist before you can use it.",
        solution: [
          "let name = 'Ada';",
          "let greeting = 'hello';",
          "console.log(greeting, name);",
        ],
        expectedOutput: "hello Ada",
        hints: [
          "Which line uses names that the other lines create? That one can't come first.",
          "Both `name` and `greeting` have to already exist by the time the console.log line runs.",
          "The two `let` lines go first (in either order), and the console.log goes last.",
        ],
        explanation: 
          "Order matters because JavaScript reads top to bottom. Using a name before the line that creates it gives a ReferenceError — the sticky note doesn't exist yet.",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict the output",
        code: 
          "let city = 'Boston';\n"
          + "console.log('I live in', city);\n",
        answer: "I live in Boston",
        hints: [
          "Two things inside console.log, separated by a comma. One has quotes, one doesn't.",
          "'I live in' has quotes → shown literally. city has none → JavaScript looks up the sticky note and finds 'Boston'. A single space is put between them.",
        ],
        why: 
          "Quoted text shows as-is; an unquoted name gets looked up. console.log joins whatever you give it with single spaces, in order.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: read the error, then fix it",
        buggy: 
          "let name = 'Ada';\n"
          + "console.log(nam);\n",
        expected: "Ada",
        hints: [
          "Run it first. Read the red error message — what name does it say isn't defined?",
          "It says `nam` isn't defined. Look at line 1 — what did you actually call the sticky note?",
          "Line 1 creates `name`, but line 2 asks for `nam`. They must match exactly.",
        ],
        solution: 
          "let name = 'Ada';\n"
          + "console.log(name);\n",
        solutionWhy: 
          "One missing letter is enough. JavaScript matches names character-for-character — `name`, `nam` and `Name` are three completely different sticky notes. This is the most common error you'll hit, and ReferenceError almost always means a typo.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Write it: your own two variables",
        prompt: 
          "Create a variable called `pet` set to 'cat' and a variable called `count` set to 2. Then log exactly: I have 2 cat",
        starter: 
          "// create your variables, then log the sentence\n",
        expected: "I have 2 cat",
        hints: [
          "Start with the two sticky notes, one per line, each beginning with `let`. Text values need quotes; numbers don't.",
          "For the output, remember console.log takes several comma-separated pieces: console.log('I have', count, pet)",
          "Line 1: let pet = 'cat'; Line 2: let count = 2; Line 3: a console.log with three pieces.",
        ],
        solution: 
          "let pet = 'cat';\n"
          + "let count = 2;\n"
          + "console.log('I have', count, pet);\n",
        solutionWhy: 
          "'cat' is text so it needs quotes; 2 is a number so it doesn't. In the log, 'I have' is quoted (literal text) while count and pet are unquoted (look up the notes). console.log puts a single space between each comma-separated piece, giving 'I have 2 cat' with no extra spacing work.",
      },
      {
        kind: "explain",
        id: "x1",
        title: "In your own words",
        prompt: 
          "Explain to a friend who has never coded: what does clicking 'Run' actually do? And why does `score = score + 5` make sense even though it looks like nonsense in maths?",
        minWords: 25,
        sampleAnswer: 
          "Clicking Run hands your text to a JavaScript engine, which carries out each line in order from top to bottom, showing anything you asked it to log. `score = score + 5` works because `=` doesn't mean 'is equal to', it means 'work out the right side, then stick that result onto this name'. So it looks up the current score, adds 5, and stores the answer back under the same name.",
      },
    ],
  };
