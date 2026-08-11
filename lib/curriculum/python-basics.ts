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
    summary: 
      "No assumptions. What a program is, what 'running' it means, and your first line of Python.",
    concepts: ["py:program", "py:run", "py:print", "py:variable-intro"],
    steps: [
      {
        kind: "hook",
        id: "h1",
        title: "The equals sign is lying to you",
        code: 
          "score = 10\n"
          + "score = score + 5\n"
          + "print(score)\n",
        answer: "15",
        reveal: 
          "If you read `score = score + 5` as a maths equation it's nonsense — nothing equals itself plus five.\n\nIt isn't an equation. `=` means **\"work out the right-hand side, then put the result in the box on the left\"**. So: fetch 10, add 5, put 15 back in `score`.\n\nAlmost every early confusion in programming comes from reading `=` as \"equals\" instead of \"becomes\".",
      },
      {
        kind: "read",
        id: "r1",
        title: "What a program actually is",
        body: 
          "A **program** is a list of instructions, written in a language the computer understands, that get carried out one after another, top to bottom — like a recipe.\n\nA recipe says: *crack the eggs. whisk them. pour into the pan.* You do those in order. Do them out of order and you get a mess. A program is the same: order matters, and the computer does **exactly** what you wrote — not what you meant.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Your first program",
        code: 
          "print('hello, world')\n",
        note: 
          "Click ▶ Run. You should see 'hello, world' appear below. `print(...)` means 'show this on screen.' Anything inside the quotes is shown exactly as typed. Try changing the words inside the quotes and running it again.",
      },
      {
        kind: "read",
        id: "r1b",
        title: "The computer does exactly what you said",
        body: 
          "That last part is the whole game. The computer isn't being difficult when your code doesn't work; it's being *literal*. Most of learning to code is learning to be precise enough for something that takes you completely at your word.\n\n**Python** is one such language. You type text following its rules, and a program called the **Python interpreter** reads your text and carries out each instruction.",
      },
      {
        kind: "trace",
        id: "t1",
        title: "Walk through a 3-line program",
        intro: 
          "Before you write your own, let's watch one run. Step through this line by line and see exactly what Python does at each moment.",
        code: 
          "print('step one')\n"
          + "print('step two')\n"
          + "print('step three')\n",
        lines: [
          {
            code: "print('step one')",
            what: 
              "Python starts at the very top. It sees a print instruction, so it shows whatever is inside the parentheses — the text 'step one'. The quotes tell Python 'this is literal text'; they don't get printed themselves.",
            output: "step one",
          },
          {
            code: "print('step two')",
            what: 
              "Python is done with line 1, so it moves down to line 2. Same instruction, different text. It shows this on a new line, below the first.",
            output: "step two",
          },
          {
            code: "print('step three')",
            what: 
              "Down to line 3. Shows the third piece of text. There are no more lines after this, so the program ends here.",
            output: "step three",
          },
        ],
        takeaway: 
          "Python reads top to bottom, does one line completely, then moves to the next. If you ever wonder 'why did it print that?' — trace it with your finger, line by line, exactly like this.",
      },
      {
        kind: "read",
        id: "r2",
        title: "What 'running' code means",
        body: 
          "Every code box in this app has a **▶ Run** button. Clicking it does exactly one thing: it hands your code to Python, which carries out your instructions one line at a time, top to bottom.\n\nWhatever your code tells Python to **show** — using `print(...)` — appears below the code box.\n\nThat's the loop you'll repeat for the rest of your life as a programmer:\n\n- **Write** some code\n- **Run** it\n- **Read** what actually happened\n- **Adjust**\n\nNobody writes correct code first try. Not beginners, not people who've done this for twenty years. The skill isn't writing it perfectly — it's getting good at that loop.",
      },
      {
        kind: "trace",
        id: "t2",
        title: "Watch a variable change",
        intro: 
          "This is the line that confuses everyone at first. Step through it slowly.",
        code: 
          "score = 10\n"
          + "print(score)\n"
          + "score = score + 5\n"
          + "print(score)\n",
        lines: [
          {
            code: "score = 10",
            what: 
              "Create a sticky note named 'score' and stick it onto the value 10. Nothing is printed — assigning a value is silent.",
            state: "score = 10",
          },
          {
            code: "print(score)",
            what: 
              "Here 'score' has no quotes around it, so Python doesn't treat it as text — it looks up the sticky note named score and finds 10. It shows that.",
            state: "score = 10",
            output: "10",
          },
          {
            code: "score = score + 5",
            what: 
              "Python always does the **right side first**. It looks up score (currently 10), adds 5, getting 15. THEN it sticks that result back onto the name score, replacing the old value. The 10 is now gone.",
            state: "score = 15",
          },
          {
            code: "print(score)",
            what: 
              "Looks up score again. It's 15 now, not 10 — the previous line replaced it.",
            state: "score = 15",
            output: "15",
          },
        ],
        takeaway: 
          "For any line with `=`, work out the entire right side first, then stick the result onto the name on the left. That single rule explains almost every confusing assignment you'll ever meet.",
      },
      {
        kind: "read",
        id: "r3",
        title: "What a variable is (forget any jargon)",
        body: 
          "Sometimes you want to use the same piece of information more than once, or give it a memorable name instead of retyping it. A **variable** is just a name you invent, attached to a piece of information so you can refer back to it.\n\nThink of a sticky note. You write a name on the note — `age` — and stick it onto a value — `25`. Later, whenever you use `age`, Python looks at the sticky note and uses whatever's stuck to it.",
      },
      {
        kind: "example",
        id: "e3",
        title: "Using a variable",
        code: 
          "age = 25\n"
          + "print(age)\n"
          + "print('I am', age, 'years old')\n",
        note: 
          "Line 1 creates the sticky note. Lines 2–3 use it. Notice `print` can take several things separated by commas — it shows them all, with a space between each.",
      },
      {
        kind: "read",
        id: "r3b",
        title: "Making a variable, and changing it",
        body: 
          "The `=` sign does the sticking:\n\n```\nage = 25\n```\n\nReads as: *create a sticky note called age, stick it to the value 25.*\n\n**This `=` is not the equals sign from math class.** In math, `x = 5` is a statement of fact: x and 5 are the same. In Python, `=` is an **action**: put this value under this name. It's better read as \"gets\" or \"becomes\" than \"equals\".\n\nThat difference matters, because it makes lines like `count = count + 1` sensible. As math that's nonsense (nothing equals itself plus one). As an action it's obvious: *take whatever count is, add 1, stick the result back onto count.*",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "The two mistakes everyone makes here",
        intro: 
          "You are about to hit both of these. Recognising them now turns a confusing 20-minute stall into a 5-second fix.",
        items: [
          {
            wrong: 
              "age = 25\n"
              + "print('age')",
            problem: 
              "This prints the literal word 'age', not 25. The quotes mean 'treat this as plain text, don't look anything up.' Without quotes, Python looks up the sticky note. With quotes, it doesn't.",
            right: 
              "age = 25\n"
              + "print(age)",
          },
          {
            wrong: "print(nickname)",
            problem: 
              "If you never created a sticky note called nickname, Python stops and says NameError: name 'nickname' is not defined. It means 'you asked me for a name I've never been given.' Usually it's a typo — you wrote `nickname` but created `nick_name` — or you used the name before the line that creates it.",
            right: 
              "nickname = 'Ren'\n"
              + "print(nickname)",
          },
        ],
      },
      {
        kind: "read",
        id: "r4",
        title: "Errors are not scary — they're messages",
        body: 
          "When Python can't carry out an instruction, it stops and prints an **error message** in red instead of your normal output.\n\nThis is not Python being angry with you. It's Python telling you, as precisely as it can, what confused it. An error message is the single most useful thing on your screen — far more useful than code that silently does the wrong thing.",
      },
      {
        kind: "cloze",
        id: "cl1",
        title: "Fill in the blanks",
        prompt: 
          "This program should create a variable holding the number 7, then print it. Fill in the two gaps.",
        template: 
          "lucky {{0}} 7\n"
          + "{{1}}(lucky)\n",
        blanks: [
          { answer: "=", width: 2 },
          { answer: "print", width: 6 },
        ],
        explanation: 
          "`=` sticks the value onto the name; `print` is the instruction that shows something on screen. Those two are the backbone of nearly every program you'll write for a while.",
      },
      {
        kind: "read",
        id: "r4b",
        title: "How to read an error message",
        body: 
          "Errors look intimidating because they're several lines long. **Read the last line first.** That's where the actual problem is named, usually in fairly plain English:\n\n- `NameError: name 'xyz' is not defined` → you used a name I've never heard of\n- `SyntaxError: invalid syntax` → I couldn't even understand this as Python\n- `TypeError: ...` → you tried to combine two things that don't go together\n\nThe lines above the last one tell you *where* it happened. Last line = what went wrong. Lines above = where.",
      },
      {
        kind: "parsons",
        id: "pa1",
        title: "Put the program in order",
        prompt: 
          "These lines are shuffled. Put them in the order that makes the program work — remember Python runs top to bottom, so a variable has to exist before you can use it.",
        solution: ["name = 'Ada'", "greeting = 'hello'", "print(greeting, name)"],
        expectedOutput: "hello Ada",
        hints: [
          "Which line uses names that the other lines create? That one can't come first.",
          "Both `name` and `greeting` must already exist by the time the print line runs.",
          "The two assignment lines go first (in either order), and the print line goes last.",
        ],
        explanation: 
          "Order matters because Python reads top to bottom. Using a name before the line that creates it gives you a NameError — the sticky note doesn't exist yet.",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict the output",
        code: 
          "city = 'Boston'\n"
          + "print('I live in', city)\n",
        answer: "I live in Boston",
        hints: [
          "There are two things inside print, separated by a comma. One has quotes, one doesn't.",
          "'I live in' has quotes → printed literally. city has no quotes → Python looks up the sticky note and finds 'Boston'. print puts a single space between them.",
        ],
        why: 
          "Quoted text prints as-is; an unquoted name gets looked up. `print` joins whatever you give it with single spaces, in order.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: read the error, then fix it",
        buggy: 
          "name = 'Ada'\n"
          + "print(nam)\n",
        expected: "Ada",
        hints: [
          "Run it first. Read the last line of the red error message — what name does it say isn't defined?",
          "Python says `nam` isn't defined. Look at line 1 — what did you actually name the sticky note?",
          "Line 1 creates `name`, but line 2 asks for `nam`. They have to match exactly.",
        ],
        solution: 
          "name = 'Ada'\n"
          + "print(name)\n",
        solutionWhy: 
          "A missing letter is enough. Python matches names character-for-character — `name`, `nam`, and `Name` are three completely different sticky notes to it. This is the single most common error you'll hit, and NameError almost always means a typo.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Write it: your own two variables",
        prompt: 
          "Create a variable called `pet` set to 'cat' and a variable called `count` set to 2. Then print exactly: I have 2 cat",
        starter: 
          "# create your variables, then print the sentence\n",
        expected: "I have 2 cat",
        hints: [
          "Start with the two sticky notes, one per line. Text values need quotes; numbers don't.",
          "For the printing, remember print can take several comma-separated pieces: print('I have', count, pet)",
          "Line 1: pet = 'cat'. Line 2: count = 2. Line 3: a print with three pieces — the text 'I have', then count, then pet.",
        ],
        solution: 
          "pet = 'cat'\n"
          + "count = 2\n"
          + "print('I have', count, pet)\n",
        solutionWhy: 
          "'cat' is text so it needs quotes; 2 is a number so it doesn't. In the print, 'I have' is quoted (literal text) while count and pet are unquoted (look up the sticky notes). print inserts a single space between each comma-separated piece, which gives you 'I have 2 cat' with no extra spacing work.",
      },
      {
        kind: "explain",
        id: "x1",
        title: "In your own words",
        prompt: 
          "Explain to a friend who has never coded: what does clicking 'Run' actually do? And why does `score = score + 5` make sense even though it looks like nonsense in math?",
        minWords: 25,
        sampleAnswer: 
          "Clicking Run hands your text to Python, which carries out each line in order from top to bottom, showing anything you asked it to print. `score = score + 5` works because `=` doesn't mean 'is equal to', it means 'work out the right side, then stick that result onto this name'. So Python looks up the current score, adds 5, and stores the answer back under the same name.",
      },
    ],
  };
