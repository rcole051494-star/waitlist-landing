import type { Lesson } from "./types";

// Modern JavaScript curriculum (ES2024+). Focus on the language runtime — DOM is out of scope.

export const javascriptLessons: Lesson[] = [
  {
    id: "js.01.variables",
    track: "javascript",
    index: 1,
    title: "let, const & primitive types",
    summary: "Block-scoped bindings, the 7 primitive types, and template literals.",
    concepts: ["js:let-const", "js:primitives", "js:template-literals"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "let vs const",
        body:
          "In the last lesson you made variables with `let`. JavaScript actually gives you two keywords for this, and picking between them is a real decision you'll make on every line.\n\n- **`let name = value`** — a name you're allowed to reassign later, as often as you like.\n- **`const name = value`** — a name that can **never be reassigned**. Trying gives an error.\n\n```\nlet y = 1;\ny = 2;          // fine — let allows it\n\nconst x = 1;\nx = 2;          // TypeError: Assignment to constant variable\n```\n\n**Reach for `const` by default**, and only switch to `let` when you actually need the value to change (a counter climbing in a loop, a running total). That sounds backwards if you're new — surely being able to change things is better? — but a `const` is a promise to whoever reads the code next, including future you: *this never changes, you don't have to track it.* Most variables genuinely never change, and marking them that way removes a whole category of bug.\n\nYou'll also see `var` in older code and tutorials. It's the original keyword, with scoping rules loose enough to cause real bugs. It still works, but there is no reason to write it in new code — this app never does, and neither should you.",
      },
      {
        kind: "categorize",
        id: "cat1",
        title: "let or const?",
        prompt:
          "For each situation, decide which keyword you'd reach for. Remember the rule: const unless the value genuinely has to change.",
        buckets: ["const", "let"],
        items: [
          { text: "someone's date of birth", bucket: 0, why: "It never changes once set — that's exactly what const is for." },
          { text: "a running total inside a loop", bucket: 1, why: "The whole point is that it grows on each pass, so it must be reassignable." },
          { text: "the value of pi", bucket: 0, why: "A fixed mathematical constant — it will never be reassigned." },
          { text: "a counter that climbs 1, 2, 3…", bucket: 1, why: "It's reassigned on every step, so const would throw an error." },
          { text: "a config setting read once at startup", bucket: 0, why: "Read once and used everywhere — no reason to allow reassignment." },
        ],
      },
      {
        kind: "read",
        id: "r2",
        title: "Template literals: putting values inside text",
        body:
          "Constantly you'll want to build a sentence with a value in the middle of it. The modern way is a **template literal**.\n\nInstead of the usual quotes, wrap the text in **backticks** — the ` character, usually top-left of the keyboard next to the 1. Inside a backtick string, `${...}` gets evaluated and dropped into the text:\n\n```\nconst name = 'Ada';\nconsole.log(`hello ${name}`);     // hello Ada\n```\n\nWith ordinary quotes the `${}` has no special meaning — `'hello ${name}'` shows literally as `hello ${name}`. The backticks are what switch it on.\n\nAny expression works inside, not just a bare name:\n\n```\nconsole.log(`2 + 2 is ${2 + 2}`);          // 2 + 2 is 4\nconsole.log(`shouting: ${name.toUpperCase()}`); // shouting: ADA\n```\n\nBacktick strings can also span several lines without any escaping, which ordinary quotes can't do.",
      },
      {
        kind: "trace",
        id: "t1",
        title: "Watch a template literal get built",
        intro: "JavaScript builds the finished string piece by piece. Here's what it's doing.",
        code: "const price = 4;\nconst qty = 3;\nconsole.log(`${qty} items at $${price} = $${qty * price}`);\n",
        lines: [
          { code: "const price = 4;", what: "Stick the value 4 onto the name price. It's a const, so it'll never change.", state: "price = 4" },
          { code: "const qty = 3;", what: "Same again for qty.", state: "price = 4, qty = 3" },
          {
            code: "console.log(`${qty} items at $${price} = $${qty * price}`);",
            what:
              "JavaScript walks the string left to right. Plain characters copy across untouched. At `${qty}` it looks up qty (3) and drops it in. ' items at $' copies across — note the first $ is an ordinary character, and the second one starts a `${`. Two dollar signs in a row look odd but they're doing different jobs.",
            state: "so far: '3 items at $4'",
          },
          {
            code: "console.log(`${qty} items at $${price} = $${qty * price}`);",
            what:
              "The last slot holds an expression rather than a plain name. JavaScript works it out first — 3 times 4 is 12 — and drops the result in. The finished string goes to console.log.",
            output: "3 items at $4 = $12",
          },
        ],
        takeaway:
          "Everything inside `${}` is evaluated then turned into text; everything outside is copied as-is. That's the whole rule.",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "The classic let/const and template mistakes",
        items: [
          {
            wrong: "const total = 0;\ntotal = total + 5;",
            problem:
              "TypeError: Assignment to constant variable. You declared it const, which promises it never gets reassigned — then reassigned it. If a value needs to change, it must be `let`.",
            right: "let total = 0;\ntotal = total + 5;",
          },
          {
            wrong: "const name = 'Ada';\nconsole.log('hello ${name}');",
            problem:
              "Shows the literal text `hello ${name}`. Those are ordinary single quotes, so `${}` means nothing. Template substitution only happens inside backticks.",
            right: "const name = 'Ada';\nconsole.log(`hello ${name}`);",
          },
          {
            wrong: "let count = 1;\nlet count = 2;",
            problem:
              "SyntaxError: Identifier 'count' has already been declared. `let` and `const` announce a NEW name — you use the keyword once. To change an existing variable, just assign to it without a keyword.",
            right: "let count = 1;\ncount = 2;",
          },
        ],
      },
      {
        kind: "cloze",
        id: "cl1",
        title: "Fill in the template literal",
        prompt:
          "This should log exactly: Ada scored 92.5%  — fill in the three gaps. (The first and last gaps are the same character.)",
        template: "const name = 'Ada';\nconst score = 92.5;\nconsole.log({{0}}${name} scored {{1}}{score}%{{2}});\n",
        blanks: [
          { answer: "`", width: 2 },
          { answer: "$", width: 2 },
          { answer: "`", width: 2 },
        ],
        explanation:
          "Backticks open and close a template literal — ordinary quotes wouldn't substitute anything. Each slot needs the `$` immediately before its `{`; without it, `{score}` is just literal braces.",
      },
      {
        kind: "read",
        id: "r3",
        title: "Blocks, and the types you'll use daily",
        body:
          "A pair of curly braces `{ ... }` marks a **block** — a chunk of code, for example the body of an `if` or a loop. A variable made with `let` or `const` only exists **inside** the block where it was made; step outside those braces and it's gone.\n\nThis is called being **block-scoped**, and it's a safety feature: it stops code in one part of your program from accidentally reaching into and clobbering a variable somewhere else. It also means you can reuse a short name like `i` in two different loops without them interfering.\n\nEvery value in JavaScript has a type. The core ones — called **primitives** because they're the simplest building blocks:\n\n- `string` — text\n- `number` — all numbers (unlike Python, JavaScript doesn't split whole numbers and decimals into separate types)\n- `boolean` — true or false\n- `undefined` — a variable that exists but hasn't been given a value\n- `null` — deliberately 'no value'\n- plus `bigint` and `symbol`, which you'll meet later\n\nEverything else — arrays, objects, functions — is **not** primitive.",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "let outer = 1;\n{ let outer = 2; console.log(outer); }\nconsole.log(outer);\n",
        answer: "2\n1",
        hints: [
          "There are two separate `let outer` declarations — one outside the braces, one inside.",
          "The inner one is a brand-new variable that only exists inside the block. It doesn't touch the outer one.",
          "Inside the block, `outer` refers to the inner variable (2). After the block closes, that one is gone and `outer` means the original again (1).",
        ],
        why:
          "The inner `let outer` creates a separate variable that shadows the outer one for the length of the block. Once the closing brace is passed, the inner one no longer exists and the name refers to the original — which was never modified.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: 'assignment to constant variable' error",
        buggy: "const n = 10;\nn = 20;\nconsole.log(n);\n",
        expected: "20",
        hints: [
          "Run it and read the error — it names exactly what went wrong.",
          "The value needs to change on line 2, but line 1 declared it in a way that forbids that.",
          "Swap the keyword on line 1 for the one that permits reassignment.",
        ],
        solution: "let n = 10;\nn = 20;\nconsole.log(n);\n",
        solutionWhy:
          "`const` is a promise the value never gets reassigned, and line 2 breaks that promise. Since this variable genuinely does need to change, `let` is the correct choice. (Note the fix is on line 1, even though the error points at line 2 — the error is where the promise was broken, but the decision that caused it was made earlier.)",
      },
      {
        kind: "write",
        id: "w1",
        title: "Format a badge",
        prompt: "With user='ren' and level=7, use a template literal to log exactly: [ren] level 7",
        starter: "const user = 'ren';\nconst level = 7;\n// console.log(...)\n",
        expected: "[ren] level 7",
        hints: [
          "Use backticks rather than quotes so `${}` substitution works.",
          "The square brackets are ordinary characters — type them literally, outside any `${}`.",
          "The shape is: backtick, [, ${user}, ], space, the word level, space, ${level}, backtick.",
        ],
        solution: "const user = 'ren';\nconst level = 7;\nconsole.log(`[${user}] level ${level}`);\n",
        solutionWhy:
          "The two `${}` slots get replaced by the values; the brackets, the word 'level' and the spaces are ordinary text copied through exactly as written. `const` is right here because neither value ever changes.",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "Which types are primitive?",
        prompt: "Pick the option that lists only primitives.",
        options: [
          "string, array, boolean, symbol",
          "string, number, boolean, null, undefined, symbol, bigint",
          "object, function, number, string",
          "string, number, boolean, array, object",
        ],
        correctIndex: 1,
        optionFeedback: [
          "Array isn't a primitive — it's a kind of object. The other three are.",
          "Correct — that's the complete list of the seven primitive types.",
          "Object and function are both non-primitive. Number and string are primitives.",
          "Array and object are both non-primitive; the first three are.",
        ],
        why:
          "There are exactly seven primitives: string, number, boolean, null, undefined, symbol and bigint. Anything else — arrays, objects, functions, dates — is an object.",
      },
      {
        kind: "explain",
        id: "x1",
        title: "In your own words",
        prompt:
          "Why prefer `const` by default when `let` is more flexible? What does choosing `const` tell someone reading your code later?",
        minWords: 25,
        sampleAnswer:
          "`const` says this value never changes, so a reader doesn't have to scan the rest of the function wondering whether it gets modified somewhere. Most variables genuinely never change, so marking them const makes the few that do change stand out — and it turns an accidental reassignment into an immediate error rather than a silent bug.",
      },
    ],
  },

  {
    id: "js.02.numbers",
    track: "javascript",
    index: 2,
    title: "Numbers & math",
    summary: "One number type, the float surprise, and BigInt for very large integers.",
    concepts: ["js:number", "js:bigint", "js:math"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "One number type for everything",
        body:
          "Python splits whole numbers and decimals into `int` and `float`. **JavaScript doesn't** — there's a single `number` type, and `5` and `5.5` are both it.\n\nThat's simpler in one way and trickier in another: every number carries the imprecision of decimals, even when it looks like a whole number.\n\nThe operators are the ones you'd expect: `+ - * /`, plus `%` for remainder and `**` for powers.\n\nOne notable difference from Python: **`/` never floors.** `7 / 2` is `3.5`, and there's no `//`. When you want the whole part, you say so explicitly:\n\n```\nMath.floor(7 / 2)     // 3\nMath.trunc(-7 / 2)    // -3  (chops toward zero)\nMath.round(3.6)       // 4\n```\n\n`Math` also carries `Math.abs`, `Math.max`, `Math.min`, `Math.sqrt`, `Math.random` and friends — it's a plain object of helpers, not something you import.",
      },
      {
        kind: "read",
        id: "r2",
        title: "The float surprise, and its limits",
        body:
          "Run this and brace yourself:\n\n```\nconsole.log(0.1 + 0.2);       // 0.30000000000000004\n```\n\nSame cause as in Python: binary can't represent 0.1 exactly, so the tiny error surfaces. **Never compare computed decimals with `===`.** Compare within a tolerance:\n\n```\nMath.abs(a - b) < 1e-9\n```\n\nJavaScript has a second limit Python doesn't. Because every number is a 64-bit float, whole numbers stop being exact past about 9 quadrillion:\n\n```\nconsole.log(Number.MAX_SAFE_INTEGER);   // 9007199254740991\nconsole.log(2 ** 53 === 2 ** 53 + 1);   // true — they're indistinguishable!\n```\n\nPython's ints are arbitrary precision and never do this. When you genuinely need huge exact integers in JavaScript, use **BigInt** — an `n` suffix on the literal:\n\n```\nconsole.log(2n ** 53n + 1n);    // 9007199254740993n\n```\n\nBigInt and Number can't be mixed in arithmetic; convert explicitly. In practice you'll rarely need it — but database ids and financial values are the classic cases where it matters.",
      },
      {
        kind: "example",
        id: "e1",
        title: "See the edges",
        code:
          "console.log(7 / 2);\n"
          + "console.log(Math.floor(7 / 2));\n"
          + "console.log(7 % 2);\n"
          + "console.log(2 ** 10);\n"
          + "console.log(0.1 + 0.2);\n"
          + "console.log(2 ** 53 === 2 ** 53 + 1);\n"
          + "console.log(2n ** 53n + 1n);\n",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "Number mistakes",
        items: [
          {
            wrong: "if (0.1 + 0.2 === 0.3) {\n  console.log('equal');\n}",
            problem:
              "Never runs. The sum is 0.30000000000000004, so strict equality fails. Any === between computed decimals is a latent bug.",
            right: "if (Math.abs((0.1 + 0.2) - 0.3) < 1e-9) {\n  console.log('equal');\n}",
          },
          {
            wrong: "const n = '5';\nconsole.log(n + 3);",
            problem:
              "Logs '53', not 8. With a string on either side, `+` means concatenate rather than add — and JavaScript won't warn you. Values from inputs, JSON and URLs are strings; convert with Number() first.",
            right: "const n = '5';\nconsole.log(Number(n) + 3);",
          },
          {
            wrong: "const total = Number('abc');\nconsole.log(total + 1);",
            problem:
              "Logs NaN — 'not a number'. Conversion failed but threw nothing, and NaN spreads silently through every later calculation. Check with Number.isNaN() when the input might not be numeric.",
            right: "const total = Number('abc');\nif (Number.isNaN(total)) {\n  console.log('not a number');\n}",
          },
          {
            wrong: "console.log(Math.round(2.5), Math.round(-2.5));",
            problem:
              "Gives 3 and -2, not 3 and -3. Math.round breaks ties by rounding UP, which for negatives means toward zero. Use Math.trunc or Math.floor when you need predictable behaviour on negatives.",
            right: "console.log(Math.round(2.5), Math.trunc(-2.5));",
          },
        ],
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "console.log(0.1 + 0.2 === 0.3);\n",
        answer: "false",
        hints: [
          "Log `0.1 + 0.2` on its own first and look closely at the result.",
          "It's 0.30000000000000004, which isn't identical to 0.3 — and === demands identical.",
        ],
        why:
          "Binary floating point can't hold 0.1 or 0.2 exactly, so their sum lands a hair above 0.3. Strict equality has no tolerance, so it's false.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: compare within a tolerance",
        buggy: "const a = 0.1 + 0.2, b = 0.3;\nconsole.log(a === b);\n",
        expected: "true",
        hints: [
          "=== requires the two numbers to be bit-for-bit identical, which decimals rarely are after arithmetic.",
          "Instead ask whether the difference is small enough to ignore.",
          "`Math.abs(a - b) < 1e-9`",
        ],
        solution: "const a = 0.1 + 0.2, b = 0.3;\nconsole.log(Math.abs(a - b) < 1e-9);\n",
        solutionWhy:
          "Comparing the gap against a small tolerance is the standard approach. `1e-9` is a reasonable default for everyday values.\n\nFor money, the better answer is to avoid decimals entirely — work in whole pence as integers, or use a decimal library. Tolerance comparisons handle the symptom; integers remove the cause.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Round to 2 decimals",
        prompt: "Given x = 2.71828, log the value rounded to 2 decimal places as a number. Expected: 2.72",
        starter: "const x = 2.71828;\n// console.log(...)\n",
        expected: "2.72",
        hints: [
          "`toFixed(2)` rounds correctly but returns a STRING — logging it would show the same digits, so either works visually here.",
          "To get a genuine number back, either wrap it in Number(...) or use the multiply-round-divide trick.",
          "`Math.round(x * 100) / 100` keeps it a number throughout.",
        ],
        solution: "const x = 2.71828;\nconsole.log(Math.round(x * 100) / 100);\n",
        solutionWhy:
          "Multiplying by 100 shifts two decimal places up, rounding drops the rest, and dividing shifts back.\n\n`Number(x.toFixed(2))` gives the same answer. The difference matters when you carry on calculating: `toFixed` alone hands back a string, and `'2.72' + 1` would give '2.721'.",
      },
    ],
  },

  {
    id: "js.03.strings",
    track: "javascript",
    index: 3,
    title: "Strings",
    summary: "Immutability, the methods worth knowing, and .at() for counting from the end.",
    concepts: ["js:strings", "js:string-methods", "js:at"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Strings are immutable",
        body:
          "As in Python, a JavaScript string can't be changed once created. Every method that looks like it edits a string actually returns a **new** one:\n\n```\nconst s = 'hello';\ns.toUpperCase();        // 'HELLO' — returned, not stored\nconsole.log(s);         // 'hello' — unchanged\n```\n\nIf you want to keep the result, you have to capture it.\n\nAccess by position with brackets, counting from 0 — or with **`.at()`**, which also accepts negatives:\n\n```\ns[0]        // 'h'\ns.at(-1)    // 'o'  — last character, no length arithmetic\ns.length    // 5    — a property, not a method: no brackets\n```\n\nSlicing uses `.slice(start, end)`, with the end excluded — the same convention as Python:\n\n```\n'code forge'.slice(0, 4)    // 'code'\n'code forge'.slice(5)       // 'forge'\n'code forge'.slice(-5)      // 'forge' — negatives count from the end\n```",
      },
      {
        kind: "read",
        id: "r2",
        title: "The methods worth knowing",
        body:
          "**Cleaning up**\n- `.trim()` — remove whitespace from both ends. Essential for anything typed by a human.\n- `.toLowerCase()` / `.toUpperCase()` — case conversion, and how you compare case-insensitively.\n\n**Asking questions** (all return true/false)\n- `.includes(x)`, `.startsWith(x)`, `.endsWith(x)`\n\n**Reshaping**\n- `.replace(a, b)` — replaces the FIRST match only\n- `.replaceAll(a, b)` — replaces every match\n- `.split(sep)` — break into an array\n- `array.join(sep)` — glue an array back together\n- `.padStart(n, ch)` / `.padEnd(n, ch)` — useful for lining up output\n\nThat `.replace` / `.replaceAll` split is a genuine trap — `.replace('o', '0')` on 'foo' changes only the first o. Python's `.replace()` replaces all of them, so it's an easy assumption to carry over wrongly.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Methods in action",
        code:
          "const s = '  Code Forge  ';\n"
          + "console.log(s.trim());\n"
          + "console.log(s.trim().toLowerCase());\n"
          + "console.log(s.trim().split(' '));\n"
          + "console.log(['a', 'b', 'c'].join('-'));\n"
          + "console.log('code forge'.at(-1));\n"
          + "console.log('abc'.padStart(6, '-'));\n"
          + "console.log(s);\n",
        note: "The last line proves immutability — after all that, s is exactly as it started.",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "String mistakes",
        items: [
          {
            wrong: "let name = '  Ada  ';\nname.trim();\nconsole.log(`[${name}]`);",
            problem:
              "Still shows the spaces. `.trim()` returns a cleaned copy and doesn't modify name — and here the returned value was discarded.",
            right: "let name = '  Ada  ';\nname = name.trim();\nconsole.log(`[${name}]`);",
          },
          {
            wrong: "console.log('foo'.replace('o', '0'));",
            problem:
              "Gives 'f0o' — only the first o changed. Unlike Python's replace, JavaScript's `.replace` with a plain string replaces one occurrence. Use `.replaceAll` for all of them.",
            right: "console.log('foo'.replaceAll('o', '0'));",
          },
          {
            wrong: "const s = 'hello';\ns[0] = 'H';\nconsole.log(s);",
            problem:
              "Silently does nothing — logs 'hello'. Strings are immutable, and assigning to an index fails without any error at all (outside strict mode). Build a new string instead.",
            right: "const s = 'hello';\nconsole.log('H' + s.slice(1));",
          },
          {
            wrong: "console.log('5' + 3, '5' - 3);",
            problem:
              "Logs '53' and 2 — the same operands behave completely differently. `+` prefers string concatenation; `-` has no string meaning so it converts to numbers. Convert explicitly rather than relying on this.",
            right: "console.log(Number('5') + 3, Number('5') - 3);",
          },
        ],
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "console.log('abc'.padStart(6, '-'));\n",
        answer: "---abc",
        hints: [
          "padStart pads the FRONT until the string reaches the given total length.",
          "'abc' is 3 characters and the target is 6, so 3 dashes go on the front.",
        ],
        why: "padStart(6, '-') keeps adding '-' at the start until the whole string is 6 characters long.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: trim before using",
        buggy: "const raw = '   ada   ';\nconst clean = raw + '!';\nconsole.log(clean.toUpperCase());\n",
        expected: "ADA!",
        hints: [
          "Run it — the spaces survive into the output because nothing removed them.",
          "`.trim()` returns a cleaned copy; you have to use what it returns.",
          "Call `.trim()` on raw as part of building clean.",
        ],
        solution: "const raw = '   ada   ';\nconst clean = raw.trim() + '!';\nconsole.log(clean.toUpperCase());\n",
        solutionWhy:
          "`raw.trim()` hands back the cleaned string, which is then concatenated. raw itself is untouched — which is fine, since we only needed the cleaned version.\n\nTrimming input is the standard first move for anything typed by a person, where stray spaces are the norm rather than the exception.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Titlecase",
        prompt:
          "Given s = 'hello world from js', log it with the first letter of each word capitalised. Expected: Hello World From Js",
        starter: "const s = 'hello world from js';\n// console.log(...)\n",
        expected: "Hello World From Js",
        hints: [
          "Split into words, transform each one, then join back with spaces.",
          "For one word: uppercase the first character and append the rest — `w[0].toUpperCase() + w.slice(1)`.",
          "`s.split(' ').map(w => ...).join(' ')` is the whole shape.",
        ],
        solution:
          "const s = 'hello world from js';\nconsole.log(s.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' '));\n",
        solutionWhy:
          "`.split(' ')` gives an array of words, `.map()` transforms each one, `.join(' ')` puts them back together.\n\nThat split → map → join shape comes up constantly for text work. You'll meet `.map` properly in a couple of lessons; here it's just 'do this to every item'.",
      },
    ],
  },

  {
    id: "js.04.truthy",
    track: "javascript",
    index: 4,
    title: "Equality, truthiness & nullish",
    summary: "Why === matters, what counts as falsy, and when to reach for ??.",
    concepts: ["js:equality", "js:truthy", "js:nullish"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Always use ===",
        body:
          "JavaScript has two equality operators, and the difference matters more here than in most languages.\n\n**`==` converts types before comparing.** That produces results almost nobody wants:\n\n```\n0 == ''          // true\n0 == '0'         // true\n'' == '0'        // false  (!)\nnull == undefined // true\n[] == false      // true\n```\n\nThose rules aren't arbitrary, but they are complicated, and memorising them is not a good use of your life.\n\n**`===` compares without converting.** If the types differ, it's false. Full stop.\n\n```\n0 === ''         // false\n0 === '0'        // false\n```\n\n**Use `===` (and `!==`) always.** The one conventional exception is `x == null`, which conveniently catches both null and undefined — and even that has clearer alternatives.\n\nThis is not a stylistic preference; it's the single most widely agreed rule in JavaScript, and every linter enforces it by default.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Truthy, falsy, and the nullish operator",
        body:
          "Like Python, JavaScript accepts any value in a condition. There are exactly **eight falsy values** — everything else is truthy:\n\n`false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, `NaN`\n\nNote what's missing: **empty arrays and empty objects are truthy.** `if ([])` runs. That differs from Python, where empty collections are falsy, and it catches people crossing between the two languages.\n\nTo check whether an array has anything in it, check its length:\n\n```\nif (items.length > 0) { ... }\n```\n\n**`||` vs `??`** — both supply fallbacks, but they trigger on different things:\n\n- `a || b` uses b when a is **falsy** (including 0 and '')\n- `a ?? b` uses b only when a is **null or undefined**\n\n```\nconst count = 0;\ncount || 10      // 10  — 0 is falsy, so the fallback wins\ncount ?? 10      // 0   — 0 isn't nullish, so it's kept\n```\n\nThat distinction is a real source of bugs. If 0 or '' are legitimate values, `||` will silently discard them. Reach for `??` for defaults unless you specifically want falsy values replaced.",
      },
      {
        kind: "categorize",
        id: "cat1",
        title: "Truthy or falsy?",
        prompt:
          "Sort each value by how JavaScript treats it in a condition. Two of these differ from Python — worth spotting which.",
        buckets: ["truthy", "falsy"],
        items: [
          { text: "0", bucket: 1, why: "Zero is falsy." },
          { text: "'0'", bucket: 0, why: "A non-empty string. Its contents are irrelevant — only emptiness matters." },
          { text: "''", bucket: 1, why: "The empty string is falsy." },
          { text: "[]", bucket: 0, why: "An empty array is TRUTHY in JavaScript — unlike Python, where it's falsy. Check .length instead." },
          { text: "{}", bucket: 0, why: "An empty object is truthy too, for the same reason." },
          { text: "null", bucket: 1, why: "Falsy, and one of the two nullish values." },
          { text: "undefined", bucket: 1, why: "Falsy, and the other nullish value." },
          { text: "NaN", bucket: 1, why: "Falsy — and famously not even equal to itself." },
        ],
      },
      {
        kind: "example",
        id: "e1",
        title: "?? vs ||",
        code:
          "const count = 0;\n"
          + "console.log(count || 10);\n"
          + "console.log(count ?? 10);\n\n"
          + "const name = '';\n"
          + "console.log(name || 'anonymous');\n"
          + "console.log(name ?? 'anonymous');\n\n"
          + "console.log(Boolean([]), Boolean({}), Boolean(''));\n",
        note:
          "The first pair is the important one. With `||`, a legitimate 0 gets thrown away. With `??`, it survives.",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "Equality and truthiness mistakes",
        items: [
          {
            wrong: "function pageSize(opts) {\n  return opts.size || 100;\n}\nconsole.log(pageSize({ size: 0 }));",
            problem:
              "Returns 100, discarding a deliberate 0. `||` fires on any falsy value, so 0 and '' get replaced along with null. Use ?? when only null/undefined should trigger the fallback.",
            right: "function pageSize(opts) {\n  return opts.size ?? 100;\n}\nconsole.log(pageSize({ size: 0 }));",
          },
          {
            wrong: "const items = [];\nif (items) {\n  console.log('has items');\n}",
            problem:
              "Always logs 'has items' — an empty array is truthy in JavaScript. This trips up anyone arriving from Python, where empty collections are falsy. Check the length.",
            right: "const items = [];\nif (items.length > 0) {\n  console.log('has items');\n}",
          },
          {
            wrong: "console.log(NaN === NaN);",
            problem:
              "false — NaN is not equal to itself, by design. So you can never test for it with ===. Use Number.isNaN() instead.",
            right: "console.log(Number.isNaN(NaN));",
          },
          {
            wrong: "if (x == 0) { ... }",
            problem:
              "Loose equality makes this true for 0, '0', '', false and []. Almost never what you want, and it hides bugs where a value arrived as the wrong type.",
            right: "if (x === 0) { ... }",
          },
        ],
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "console.log([] == false, [] === false);\n",
        answer: "true false",
        hints: [
          "`==` converts both sides toward numbers before comparing; `===` refuses to convert at all.",
          "An empty array converts to '' then to 0, and false also converts to 0 — so loose equality says true. Strict equality sees array vs boolean and stops there.",
        ],
        why:
          "This pair is the classic argument for ===. Loose equality performs several conversions and lands on true; strict equality sees two different types and returns false immediately. Note this also means an empty array is loosely equal to false while being truthy in an if — which is exactly the kind of contradiction === avoids.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: keep a deliberate zero",
        buggy: "function pageSize(opts) {\n  return opts.size || 100;\n}\nconsole.log(pageSize({ size: 0 }));\n",
        expected: "0",
        hints: [
          "Run it — you get 100, even though 0 was explicitly supplied.",
          "`||` treats every falsy value as missing, and 0 is falsy.",
          "Swap `||` for the operator that only triggers on null and undefined.",
        ],
        solution: "function pageSize(opts) {\n  return opts.size ?? 100;\n}\nconsole.log(pageSize({ size: 0 }));\n",
        solutionWhy:
          "`??` only falls through for null and undefined, so a deliberate 0 survives.\n\nA good default: use `??` for supplying defaults, and reserve `||` for cases where you genuinely want any falsy value replaced — an empty search box treated as 'no filter', say.",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "Which comparison is right?",
        prompt: "Comparing a variable x to the number zero:",
        options: ["x == 0", "x === 0", "x == '0'", "!x"],
        correctIndex: 1,
        optionFeedback: [
          "Loose equality is also true for '', '0', false and [] — far more than you asked for.",
          "Correct. Strict equality compares value and type with no conversion.",
          "Compares against the string '0', which loose equality makes true for the number 0 too — confusing and fragile.",
          "`!x` is true for every falsy value, including '', null and undefined — not just 0.",
        ],
        why: "=== compares without conversion, which is almost always the question you actually mean.",
      },
    ],
  },

  {
    id: "js.05.control",
    track: "javascript",
    index: 5,
    title: "if / switch / loops",
    summary: "Branching, the three loop forms, and which to reach for.",
    concepts: ["js:if", "js:for", "js:for-of"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Conditions and blocks",
        body:
          "The condition goes in brackets and the block in braces:\n\n```\nif (age >= 18) {\n  console.log('adult');\n} else if (age >= 13) {\n  console.log('teen');\n} else {\n  console.log('child');\n}\n```\n\nAs in Python, the chain stops at the first true branch. Unlike Python, indentation is purely cosmetic — the braces decide what's inside. Misleading indentation won't break your code, but it will mislead the next reader, so keep it honest.\n\nFor a short either/or that produces a value, the **ternary** is idiomatic:\n\n```\nconst label = age >= 18 ? 'adult' : 'minor';\n```\n\nRead as: condition ? if-true : if-false. It's an expression, so it can go anywhere a value can — including inside a template literal. Don't nest them more than one deep; it gets unreadable fast.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Three loops, and which one to use",
        body:
          "**`for...of`** — walks the values of an array or string. This is your default:\n\n```\nfor (const item of items) {\n  console.log(item);\n}\n```\n\n**Classic `for`** — when you need the index, or a step other than 1:\n\n```\nfor (let i = 0; i < items.length; i++) { ... }\n```\n\nThree parts separated by semicolons: start, keep-going condition, and what to do after each pass.\n\n**`while`** — when you don't know the count up front:\n\n```\nwhile (queue.length > 0) { ... }\n```\n\nThere's a fourth, **`for...in`**, which walks an object's **keys**. It is a common beginner mistake to use it on arrays — it gives you index *strings*, and it can pick up inherited properties. For arrays use `for...of`; for objects prefer `Object.entries()`.\n\n`break` leaves the loop entirely; `continue` skips to the next pass. Both behave exactly as they do in Python.",
      },
      {
        kind: "trace",
        id: "t1",
        title: "Watch a loop accumulate",
        intro: "Follow `total` and `i` across the passes, and note where the log sits.",
        code: "let total = 0;\n\nfor (let i = 1; i <= 3; i++) {\n  total = total + i;\n}\n\nconsole.log(total);\n",
        lines: [
          { code: "let total = 0;", what: "A running tally, starting at nothing.", state: "total = 0" },
          {
            code: "for (let i = 1; i <= 3; i++) {",
            what:
              "The three parts run in order: i starts at 1, the condition 1 <= 3 holds, so the body runs. (The i++ hasn't happened yet — it fires at the END of each pass.)",
            state: "i = 1, total = 0",
          },
          { code: "  total = total + i;", what: "0 + 1 = 1. End of body, so i++ makes i 2, and the condition is checked again.", state: "i = 2, total = 1" },
          { code: "  total = total + i;", what: "1 + 2 = 3. i++ makes it 3; 3 <= 3 still holds.", state: "i = 3, total = 3" },
          { code: "  total = total + i;", what: "3 + 3 = 6. i++ makes it 4, and 4 <= 3 fails — the loop ends.", state: "i = 4, total = 6" },
          {
            code: "console.log(total);",
            what:
              "Outside the braces, so it runs once after the loop. Note `i` no longer exists out here — `let` in the loop header scopes it to the loop.",
            output: "6",
          },
        ],
        takeaway:
          "The increment runs at the end of each pass, then the condition is re-checked. Anything outside the braces runs once, after the loop is done.",
      },
      {
        kind: "example",
        id: "e1",
        title: "for-of vs for-in",
        code:
          "const xs = ['a', 'b', 'c'];\n"
          + "for (const x of xs) console.log('of', x);\n"
          + "for (const k in xs) console.log('in', k, typeof k);\n",
        note:
          "`for...in` gives index STRINGS ('0', '1', '2'), not values and not numbers. That's why it's the wrong tool for arrays.",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "Control-flow mistakes",
        items: [
          {
            wrong: "const xs = [10, 20, 30];\nfor (const i in xs) {\n  console.log(i + 1);\n}",
            problem:
              "Logs '01', '11', '21' — string concatenation, because for...in yields index strings. Use for...of for values, or .entries() when you need both.",
            right: "const xs = [10, 20, 30];\nfor (const x of xs) {\n  console.log(x + 1);\n}",
          },
          {
            wrong: "function grade(n) {\n  switch (true) {\n    case n >= 90: return 'A';\n    case n >= 80: return 'B';\n    default: 'F';\n  }\n}\nconsole.log(grade(60));",
            problem:
              "Logs undefined. The default case computes 'F' and throws it away — there's no return. Every branch that should produce a value needs its own return.",
            right: "function grade(n) {\n  switch (true) {\n    case n >= 90: return 'A';\n    case n >= 80: return 'B';\n    default: return 'F';\n  }\n}\nconsole.log(grade(60));",
          },
          {
            wrong: "const xs = [1, 2, 3];\nfor (let i = 0; i <= xs.length; i++) {\n  console.log(xs[i]);\n}",
            problem:
              "Logs a trailing undefined. Valid indexes stop at length - 1, so the condition must be `<`, not `<=`. This is the classic off-by-one.",
            right: "const xs = [1, 2, 3];\nfor (let i = 0; i < xs.length; i++) {\n  console.log(xs[i]);\n}",
          },
        ],
      },
      {
        kind: "parsons",
        id: "pa1",
        title: "Build a countdown",
        prompt:
          "Put these lines in order so the program logs 3, 2, 1 and then 'liftoff'. Watch which line belongs inside the braces.",
        solution: ["for (const n of [3, 2, 1]) {", "  console.log(n);", "}", "console.log('liftoff');"],
        expectedOutput: "3\n2\n1\nliftoff",
        hints: [
          "The loop header opens a block, so its closing brace must come after the body.",
          "'liftoff' should appear once at the very end — so it goes after the closing brace, not inside it.",
          "Header, body, closing brace, then the final log.",
        ],
        explanation:
          "The braces decide what repeats. The log inside runs three times; the one after the closing brace runs once.",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "let sum = 0;\nfor (let i = 1; i <= 5; i++) {\n  if (i === 3) continue;\n  sum += i;\n}\nconsole.log(sum);\n",
        answer: "12",
        hints: [
          "The loop covers 1 through 5 inclusive — check the condition carefully.",
          "`continue` skips the rest of that one pass, so 3 never reaches the `sum +=` line.",
          "You're adding 1 + 2 + 4 + 5.",
        ],
        why:
          "`i <= 5` includes 5, so the values are 1..5. When i is 3 the continue jumps straight to the increment, skipping the addition. 1+2+4+5 = 12.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: the switch falls through to nothing",
        buggy:
          "function grade(n) {\n  switch (true) {\n    case n >= 90: return 'A';\n    case n >= 80: return 'B';\n    case n >= 70: return 'C';\n    default: 'F';\n  }\n}\nconsole.log(grade(60));\n",
        expected: "F",
        hints: [
          "Run it — you get undefined rather than 'F'.",
          "Look closely at the default case compared with the others.",
          "It's missing `return`. Computing 'F' without returning it discards the value.",
        ],
        solution:
          "function grade(n) {\n  switch (true) {\n    case n >= 90: return 'A';\n    case n >= 80: return 'B';\n    case n >= 70: return 'C';\n    default: return 'F';\n  }\n}\nconsole.log(grade(60));\n",
        solutionWhy:
          "A function that ends without hitting a return gives back undefined. The default branch evaluated 'F' as a bare expression and threw it away.\n\n`switch (true)` with conditions in each case is a legitimate pattern for range checks, though a plain if/else chain reads just as well here.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Even sum 1..100",
        prompt: "Log the sum of every even number from 1 to 100 inclusive. Expected: 2550",
        starter: "// console.log(...)\n",
        expected: "2550",
        hints: [
          "A running total starting at 0, a loop, and a log after the loop finishes.",
          "To include 100, the condition needs `i <= 100`.",
          "Test for even with `i % 2 === 0` — or skip the test entirely by stepping the loop by 2.",
        ],
        solution:
          "let total = 0;\nfor (let i = 2; i <= 100; i += 2) {\n  total += i;\n}\nconsole.log(total);\n",
        solutionWhy:
          "Starting at 2 and stepping by 2 visits only the evens, so no `if` is needed at all — the third part of a `for` header can be any expression, not just `i++`.\n\nThe more literal version works identically:\n\n```\nfor (let i = 1; i <= 100; i++) {\n  if (i % 2 === 0) total += i;\n}\n```",
      },
    ],
  },

  {
    id: "js.06.arrays",
    track: "javascript",
    index: 6,
    title: "Arrays",
    summary: "Ordered lists, destructuring, and which methods mutate.",
    concepts: ["js:array", "js:array-methods", "js:destructuring"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Ordered, mutable, and reference-shared",
        body:
          "Arrays hold values in order, indexed from 0:\n\n```\nconst xs = [10, 20, 30];\nxs[0]        // 10\nxs.at(-1)    // 30\nxs.length    // 3\n```\n\nAdding and removing:\n\n- `.push(x)` / `.pop()` — add or remove at the **end** (fast)\n- `.unshift(x)` / `.shift()` — add or remove at the **start** (slower; everything has to shift along)\n- `.splice(i, n)` — remove n items from position i\n\nNote you can call `.push()` on a `const` array. `const` prevents **reassigning the name**, not changing the contents. `xs = []` is an error; `xs.push(1)` is fine.\n\nAnd exactly as with Python lists: **assignment doesn't copy.** `const b = a` gives the same array a second name, and changing it through either name changes the one array. Copy explicitly with `[...a]` or `a.slice()`.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Mutating vs non-mutating, and destructuring",
        body:
          "Some methods change the array in place; others return a new one. Mixing them up is a common source of bugs.\n\n**Mutate:** `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`\n\n**Return new:** `slice`, `concat`, `map`, `filter`, `flat`, and the ES2023 trio `toSorted`, `toReversed`, `toSpliced`\n\nThose last three exist precisely because `sort` and `reverse` mutating in place surprises people. `xs.toSorted()` gives you a sorted copy and leaves xs alone.\n\n**Destructuring** pulls values out by position, like Python's unpacking:\n\n```\nconst [a, , c, ...rest] = [1, 2, 3, 4, 5];\n// a = 1, c = 3, rest = [4, 5]  — the gap skips an item\n```\n\nAnd the **spread** operator `...` expands an array in place — the idiomatic way to copy or combine:\n\n```\nconst copy = [...xs];\nconst joined = [...a, ...b];\n```",
      },
      {
        kind: "categorize",
        id: "cat1",
        title: "Mutates, or returns new?",
        prompt: "Sort each by whether it changes the original array or leaves it untouched.",
        buckets: ["changes the original", "returns a new array"],
        items: [
          { text: "xs.push(4)", bucket: 0, why: "Adds to the array itself and returns the new length." },
          { text: "xs.sort()", bucket: 0, why: "Sorts in place — a genuine surprise, and the reason toSorted was added." },
          { text: "xs.toSorted()", bucket: 1, why: "The ES2023 non-mutating version; xs is untouched." },
          { text: "xs.reverse()", bucket: 0, why: "Reverses in place." },
          { text: "xs.slice()", bucket: 1, why: "Always returns a new array — which is why it's a common way to copy." },
          { text: "xs.map(f)", bucket: 1, why: "Builds a new array of transformed values." },
          { text: "xs.splice(0, 1)", bucket: 0, why: "Removes items from the array itself." },
          { text: "[...xs, 4]", bucket: 1, why: "Spread builds a brand-new array." },
        ],
      },
      {
        kind: "example",
        id: "e1",
        title: "Copying and sorting",
        code:
          "const xs = [3, 1, 2];\n"
          + "const sorted = xs.toSorted();\n"
          + "console.log(sorted, xs);\n\n"
          + "const a = [1, 2, 3];\n"
          + "const alias = a;\nconst copy = [...a];\n"
          + "alias.push(99);\n"
          + "console.log(a, copy);\n",
        note:
          "The second half is the aliasing trap: `alias` shares the array, so pushing through it changes `a`. `copy` is genuinely separate.",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "Array mistakes",
        items: [
          {
            wrong: "const xs = [10, 2, 30, 4];\nconsole.log(xs.sort());",
            problem:
              "Gives [ 10, 2, 30, 4 ] — barely sorted at all. `sort` converts every element to a STRING and compares those, so '10' comes before '2'. Always pass a comparator for numbers: `.sort((a, b) => a - b)`.",
            right: "const xs = [10, 2, 30, 4];\nconsole.log(xs.sort((a, b) => a - b));",
          },
          {
            wrong: "const original = [1, 2, 3];\nconst backup = original;\noriginal.push(4);\nconsole.log(backup);",
            problem:
              "Logs [ 1, 2, 3, 4 ] — the backup isn't one. Assignment shares the array rather than copying it, exactly as with Python lists.",
            right: "const original = [1, 2, 3];\nconst backup = [...original];\noriginal.push(4);\nconsole.log(backup);",
          },
          {
            wrong: "const xs = [3, 1, 2];\nconst sorted = xs.sort();\nconsole.log(xs);",
            problem:
              "xs is now sorted too — sort mutates and returns the SAME array, so `sorted` and `xs` are one array with two names. Use toSorted() when you want the original preserved.",
            right: "const xs = [3, 1, 2];\nconst sorted = xs.toSorted();\nconsole.log(xs);",
          },
          {
            wrong: "const xs = [1, 2, 3];\nconsole.log(xs[3]);",
            problem:
              "Logs undefined rather than raising. JavaScript doesn't error on out-of-range indexes, so a bug can travel a long way before it surfaces. Prefer .at(-1) for the last item.",
            right: "const xs = [1, 2, 3];\nconsole.log(xs.at(-1));",
          },
        ],
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "const [a, , c, ...rest] = [1, 2, 3, 4, 5];\nconsole.log(a, c, rest);\n",
        answer: "1 3 [ 4, 5 ]",
        hints: [
          "The empty slot between the commas is deliberate — it skips a position.",
          "a takes 1, the gap skips 2, c takes 3, and ...rest collects everything remaining.",
        ],
        why:
          "Destructuring assigns by position. The hole skips index 1, and the rest element gathers all remaining items into a new array.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: sort numbers properly",
        buggy: "const xs = [1, 5, 10, 2];\nconsole.log(xs.sort());\n",
        expected: "[ 1, 2, 5, 10 ]",
        hints: [
          "Run it — you get [ 1, 10, 2, 5 ], which isn't numeric order.",
          "By default sort converts each item to a string and compares those. '10' sorts before '2' because '1' < '2'.",
          "Pass a comparator: `(a, b) => a - b`.",
        ],
        solution: "const xs = [1, 5, 10, 2];\nconsole.log(xs.sort((a, b) => a - b));\n",
        solutionWhy:
          "The comparator returns a negative number when a should come first, positive when b should, and 0 when they tie — so `a - b` gives ascending order (and `b - a` descending).\n\nThis default is a genuine language wart. Any time you sort numbers, the comparator is required.",
      },
      {
        kind: "write",
        id: "w1",
        title: "First five odd squares",
        prompt: "Log an array of the squares of the first five odd numbers starting at 1. Expected: [ 1, 9, 25, 49, 81 ]",
        starter: "// console.log(...)\n",
        expected: "[ 1, 9, 25, 49, 81 ]",
        hints: [
          "The odd numbers you need are 1, 3, 5, 7, 9.",
          "One route: build them with a loop stepping by 2 and push each square.",
          "Another: `[1, 3, 5, 7, 9].map(n => n * n)` — map transforms every item.",
        ],
        solution: "console.log([1, 3, 5, 7, 9].map(n => n * n));\n",
        solutionWhy:
          "`.map()` runs the function on every item and collects the results into a new array — the same job as a loop that pushes, but as a single expression.\n\nThe loop version is equally valid:\n\n```\nconst out = [];\nfor (let n = 1; n <= 9; n += 2) out.push(n * n);\nconsole.log(out);\n```",
      },
    ],
  },

  {
    id: "js.07.array-methods",
    track: "javascript",
    index: 7,
    title: "map / filter / reduce",
    summary: "The functional trio, and choosing the smallest tool that fits.",
    concepts: ["js:map", "js:filter", "js:reduce"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Three tools, three shapes",
        body:
          "These three replace most loops you'd otherwise write, and each has a distinct signature you can recognise at a glance:\n\n**`.map(fn)`** — transform every item. Output has the **same length** as input.\n\n```\n[1, 2, 3].map(n => n * 2)         // [2, 4, 6]\n```\n\n**`.filter(fn)`** — keep the items where fn returns true. Output is **same length or shorter**, and the items are unchanged.\n\n```\n[1, 2, 3, 4].filter(n => n % 2 === 0)   // [2, 4]\n```\n\n**`.reduce(fn, start)`** — fold everything into a **single value**.\n\n```\n[1, 2, 3].reduce((acc, n) => acc + n, 0)   // 6\n```\n\nreduce's function takes two arguments: the accumulator so far, and the current item. It returns the new accumulator. That second argument to reduce is the starting value — always supply it, or an empty array will throw.\n\nAll three leave the original array untouched, and all three chain:\n\n```\nitems.filter(i => i.inStock).map(i => i.price)\n```\n\nRule of thumb: reach for the most specific tool that fits. If it's a transformation, use map. If it's a selection, use filter. Save reduce for when you're genuinely collapsing to one value — a clever reduce that does the job of a map is harder to read, not cleverer.",
      },
      {
        kind: "trace",
        id: "t1",
        title: "Watch a chain evaluate",
        intro:
          "Chains read left to right, and each step hands a whole new array to the next. Follow what exists at each stage.",
        code: "const items = [\n  { name: 'a', price: 10, stock: 2 },\n  { name: 'b', price: 5,  stock: 0 },\n  { name: 'c', price: 8,  stock: 3 },\n];\n\nconst total = items\n  .filter(i => i.stock > 0)\n  .reduce((sum, i) => sum + i.price * i.stock, 0);\n\nconsole.log(total);\n",
        lines: [
          {
            code: ".filter(i => i.stock > 0)",
            what:
              "Runs the test on each of the three items. 'b' has stock 0, so it's dropped. A NEW two-item array is produced; the original items array is untouched.",
            state: "[ {a, 10, 2}, {c, 8, 3} ]",
          },
          {
            code: "  .reduce((sum, i) => sum + i.price * i.stock, 0);",
            what: "The accumulator starts at 0 — that's the second argument to reduce.",
            state: "sum = 0",
          },
          {
            code: "  .reduce((sum, i) => sum + i.price * i.stock, 0);",
            what: "sum (0) plus price 10 times stock 2 = 20. That becomes the new accumulator.",
            state: "sum = 20",
          },
          {
            code: "  .reduce((sum, i) => sum + i.price * i.stock, 0);",
            what: "sum (20) plus 8 times 3 = 44. No items left, so this is the final value.",
            state: "sum = 44",
          },
          { code: "console.log(total);", what: "reduce collapsed the array to a single number.", output: "44" },
        ],
        takeaway:
          "Each link produces a whole new array for the next to consume. Reading a chain top to bottom tells you the shape of the data at every stage.",
      },
      {
        kind: "example",
        id: "e1",
        title: "The trio",
        code:
          "const nums = [1, 2, 3, 4, 5];\n"
          + "console.log(nums.map(n => n * 2));\n"
          + "console.log(nums.filter(n => n % 2 === 0));\n"
          + "console.log(nums.reduce((a, b) => a + b, 0));\n"
          + "console.log(nums.filter(n => n > 2).map(n => n * 10));\n"
          + "console.log(nums);\n",
        note: "The last line confirms none of them modified the original.",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "Mistakes with the trio",
        items: [
          {
            wrong: "const xs = [1, 2, 3];\nconst doubled = xs.map(n => { n * 2; });\nconsole.log(doubled);",
            problem:
              "Logs [ undefined, undefined, undefined ]. Braces make it a function BODY, so you must return explicitly. Without braces, the arrow returns the expression automatically.",
            right: "const xs = [1, 2, 3];\nconst doubled = xs.map(n => n * 2);\nconsole.log(doubled);",
          },
          {
            wrong: "const xs = [1, 2, 3];\nxs.map(n => console.log(n));",
            problem:
              "Works, but misuses map — you're building an array of undefined and discarding it. When you only want a side effect, use forEach or a for...of loop.",
            right: "const xs = [1, 2, 3];\nxs.forEach(n => console.log(n));",
          },
          {
            wrong: "const empty = [];\nconsole.log(empty.reduce((a, b) => a + b));",
            problem:
              "TypeError: Reduce of empty array with no initial value. Without a starting value reduce has nothing to begin from. Always pass one.",
            right: "const empty = [];\nconsole.log(empty.reduce((a, b) => a + b, 0));",
          },
          {
            wrong: "const xs = [1, 2, 3, 4];\nconsole.log(xs.map(n => n * 2).filter(n => n % 2 === 0));",
            problem:
              "Doubling first makes everything even, so the filter does nothing. Order matters in a chain — filter before you transform when the test applies to the original values.",
            right: "const xs = [1, 2, 3, 4];\nconsole.log(xs.filter(n => n % 2 === 0).map(n => n * 2));",
          },
        ],
      },
      {
        kind: "cloze",
        id: "cl1",
        title: "Fill in the chain",
        prompt:
          "This should keep the numbers above 2 and then triple them. Fill in the two method names.",
        template: "const nums = [1, 2, 3, 4];\nconsole.log(nums.{{0}}(n => n > 2).{{1}}(n => n * 3));\n",
        blanks: [
          { answer: "filter", width: 7 },
          { answer: "map", width: 4 },
        ],
        explanation:
          "filter selects (keeping 3 and 4), then map transforms them (to 9 and 12). Doing it in the other order would triple everything first and then test the tripled values — a different result.",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "console.log([1,2,3,4].reduce((a, b) => a + b, 0));\n",
        answer: "10",
        hints: [
          "The accumulator starts at 0 — that's the second argument.",
          "Each pass adds the current item: 0+1, then +2, +3, +4.",
        ],
        why: "reduce carries a running value through the array. Starting at 0 and adding each item gives 10.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: doubled evens only",
        buggy: "const xs = [1,2,3,4,5,6];\nconsole.log(xs.map(x => x * 2).filter(x => x % 2 === 0));\n",
        expected: "[ 4, 8, 12 ]",
        hints: [
          "Run it — you get every number doubled, because after doubling they're all even.",
          "The filter is testing the transformed values, not the originals.",
          "Swap the order: filter for evens first, then double what survives.",
        ],
        solution: "const xs = [1,2,3,4,5,6];\nconsole.log(xs.filter(x => x % 2 === 0).map(x => x * 2));\n",
        solutionWhy:
          "Filtering first means the test applies to the original values, so only 2, 4 and 6 survive — then doubling gives 4, 8 and 12.\n\nWhenever a chain gives an odd result, check what shape the data is in at each link. Here the filter was correct but was being handed the wrong input.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Longest word",
        prompt: "Given words = ['a','bbb','cc','dddd'], log the longest one. Expected: dddd",
        starter: "const words = ['a','bbb','cc','dddd'];\n// console.log(...)\n",
        expected: "dddd",
        hints: [
          "You're collapsing an array to a single value, so reduce is the natural fit.",
          "At each step, compare the current item's length to the best so far and keep the longer.",
          "`words.reduce((best, w) => w.length > best.length ? w : best)` — here you can safely omit the start value since the array isn't empty.",
        ],
        solution:
          "const words = ['a','bbb','cc','dddd'];\nconsole.log(words.reduce((best, w) => w.length > best.length ? w : best));\n",
        solutionWhy:
          "reduce carries the best-so-far along, replacing it whenever a longer word turns up. With no start value it begins from the first element, which is fine for a non-empty array.\n\nA sort would also work — `words.toSorted((a, b) => b.length - a.length)[0]` — but that does more work than needed, arranging the whole array when you only want one item.",
      },
    ],
  },

  {
    id: "js.08.objects",
    track: "javascript",
    index: 8,
    title: "Objects & destructuring",
    summary: "Key-value data, shorthand, spread, and pulling fields out by name.",
    concepts: ["js:object", "js:destructuring", "js:spread"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Objects are JavaScript's dictionaries",
        body:
          "An object maps keys to values — the equivalent of a Python dict, and the most-used structure in the language:\n\n```\nconst user = { name: 'Ada', age: 36 };\nuser.name          // 'Ada'   — dot access\nuser['name']       // 'Ada'   — bracket access, for dynamic keys\nuser.email         // undefined — no error for a missing key\n```\n\nThat last line differs from Python, where a missing dict key raises KeyError. JavaScript hands back `undefined` silently, so a typo'd property name can travel a long way before it causes visible trouble.\n\nKeys are strings (or symbols). Writing `{ 1: 'a' }` stores the key as `'1'`.\n\nThe modern conveniences:\n\n```\nconst name = 'Ada';\nconst obj = { name };              // shorthand for { name: name }\nconst key = 'colour';\nconst dyn = { [key]: 'red' };      // computed key -> { colour: 'red' }\nconst merged = { ...a, ...b };     // spread; later keys win\n```\n\nAnd to loop over one:\n\n```\nfor (const [k, v] of Object.entries(user)) { ... }\n```\n\n`Object.keys()` and `Object.values()` give you just one side each.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Destructuring by name",
        body:
          "Array destructuring pulls values out **by position**. Object destructuring pulls them out **by key**:\n\n```\nconst { name, age } = user;\n```\n\nThe names have to match the keys — order is irrelevant.\n\nYou can rename and supply defaults:\n\n```\nconst { name: userName, city = 'unknown' } = user;\n// userName = 'Ada', city = 'unknown' if user has no city\n```\n\nRead `name: userName` as \"take the key `name`, call it `userName` locally\". It's the opposite direction from an object literal, which trips people up at first.\n\nDefaults fire only for `undefined`, not for null or 0 — same rule as `??`.\n\nThis really pays off in function parameters:\n\n```\nfunction createUser({ name, isAdmin = false }) { ... }\ncreateUser({ name: 'Ada', isAdmin: true });\n```\n\nThe caller labels every argument, so there's no guessing what a bare `true` means at the call site — and adding a new option later doesn't disturb existing calls.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Objects in practice",
        code:
          "const user = { name: 'Ada', profile: { theme: 'dark' } };\n\n"
          + "const { name, profile: { theme = 'light', font = 'sans' } } = user;\n"
          + "console.log(name, theme, font);\n\n"
          + "const defaults = { theme: 'light', size: 14 };\n"
          + "console.log({ ...defaults, size: 16 });\n\n"
          + "for (const [k, v] of Object.entries({ a: 1, b: 2 })) console.log(k, v);\n",
        note:
          "The nested destructuring reaches two levels down and supplies a default for the missing font, all in one line.",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "Object mistakes",
        items: [
          {
            wrong: "const key = 'colour';\nconst obj = { key: 'red' };\nconsole.log(obj.colour);",
            problem:
              "undefined. Without brackets, `key` is taken as the literal key name — the object is { key: 'red' }. Wrap it in square brackets to use the variable's value.",
            right: "const key = 'colour';\nconst obj = { [key]: 'red' };\nconsole.log(obj.colour);",
          },
          {
            wrong: "const a = { nested: { x: 1 } };\nconst b = { ...a };\nb.nested.x = 99;\nconsole.log(a.nested.x);",
            problem:
              "Logs 99 — spread is a SHALLOW copy. Top-level keys are copied, but nested objects are still shared. For a deep copy use structuredClone(a).",
            right: "const a = { nested: { x: 1 } };\nconst b = structuredClone(a);\nb.nested.x = 99;\nconsole.log(a.nested.x);",
          },
          {
            wrong: "const user = { name: 'Ada' };\nconsole.log(user.naem.length);",
            problem:
              "TypeError: Cannot read properties of undefined. The typo'd key gives undefined silently, and the error only appears one step later when something is read off it — pointing at the wrong place.",
            right: "const user = { name: 'Ada' };\nconsole.log(user.name.length);",
          },
        ],
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "const a = { x: 1, y: 2 };\nconst b = { ...a, y: 20 };\nconsole.log(b);\n",
        answer: "{ x: 1, y: 20 }",
        hints: [
          "Spread copies all of a's keys into the new object first.",
          "Then `y: 20` is applied — and when a key appears twice, the later one wins.",
        ],
        why:
          "Object literals are built left to right, so a later key overwrites an earlier one. That's exactly what makes `{ ...defaults, ...overrides }` the standard way to merge settings.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: use the variable as the key",
        buggy: "const key = 'colour';\nconst obj = { key: 'red' };\nconsole.log(obj.colour);\n",
        expected: "red",
        hints: [
          "Log the whole object and see what key it actually has.",
          "It's literally 'key' — the variable's name, not its value.",
          "Square brackets around the key make it computed: `{ [key]: 'red' }`.",
        ],
        solution: "const key = 'colour';\nconst obj = { [key]: 'red' };\nconsole.log(obj.colour);\n",
        solutionWhy:
          "Square brackets tell JavaScript to evaluate the expression and use the result as the key. Without them, whatever you type is taken literally.\n\nThis matters whenever the key isn't known until runtime — building a lookup keyed by user id, say.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Merge with override",
        prompt:
          "Given defaults = { theme: 'light', font: 'sans', size: 14 } and user = { theme: 'dark', size: 16 }, log a merged object where the user's values win. Expected: { theme: 'dark', font: 'sans', size: 16 }",
        starter:
          "const defaults = { theme: 'light', font: 'sans', size: 14 };\nconst user = { theme: 'dark', size: 16 };\n// console.log(...)\n",
        expected: "{ theme: 'dark', font: 'sans', size: 16 }",
        hints: [
          "Spread both objects into one new literal.",
          "Later keys win, so whichever you spread second takes priority.",
          "`{ ...defaults, ...user }` — user second, so it overrides.",
        ],
        solution:
          "const defaults = { theme: 'light', font: 'sans', size: 14 };\nconst user = { theme: 'dark', size: 16 };\nconsole.log({ ...defaults, ...user });\n",
        solutionWhy:
          "Spreading defaults first lays down every key; spreading user second overwrites the two it defines, leaving font from the defaults.\n\nGetting the order backwards is a common bug — `{ ...user, ...defaults }` would let the defaults clobber the user's choices, which is exactly wrong.",
      },
    ],
  },

  {
    id: "js.09.optional",
    track: "javascript",
    index: 9,
    title: "Optional chaining & safe access",
    summary: "Reaching into data that might not be there, without crashing.",
    concepts: ["js:optional-chain"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "?. stops instead of throwing",
        body:
          "Reading a property off `undefined` or `null` throws:\n\n```\nconst user = {};\nuser.address.city      // TypeError: Cannot read properties of undefined\n```\n\n**Optional chaining** short-circuits instead. If the thing before `?.` is null or undefined, the whole expression stops and evaluates to `undefined`:\n\n```\nuser?.address?.city    // undefined — no crash\n```\n\nIt works in three places:\n\n```\nobj?.prop        // property access\narr?.[0]         // index access\nfn?.()           // function call — only calls if fn exists\n```\n\nIt pairs naturally with `??` to supply a fallback:\n\n```\nconst city = user?.address?.city ?? 'unknown';\n```\n\n**Use it deliberately, not everywhere.** `a?.b?.c?.d?.e` usually means you don't actually know the shape of your data — and silencing five possible failures makes the eventual bug much harder to find. Reach for `?.` where a value is genuinely optional (an API field that may be absent), not as blanket insurance.",
      },
      {
        kind: "example",
        id: "e1",
        title: "All three forms",
        code:
          "const user = {};\n"
          + "console.log(user?.address?.city ?? 'unknown');\n\n"
          + "const obj = { fn: null };\n"
          + "console.log(obj?.fn?.());\n\n"
          + "const post = {};\n"
          + "console.log(post?.tags?.[0]);\n\n"
          + "const real = { tags: ['js'] };\n"
          + "console.log(real?.tags?.[0]);\n",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "Using ?. well",
        items: [
          {
            wrong: "const user = { address: { city: 'Boston' } };\nconsole.log(user?.adress?.city ?? 'unknown');",
            problem:
              "Logs 'unknown' — but the data was there. The property is misspelled, and optional chaining turned a would-be TypeError into a plausible-looking wrong answer. This is the real cost of over-using it.",
            right: "const user = { address: { city: 'Boston' } };\nconsole.log(user.address.city);",
          },
          {
            wrong: "const config = { retries: 0 };\nconsole.log(config?.retries || 3);",
            problem:
              "Logs 3, discarding a deliberate 0. The `?.` is fine; the `||` is the problem — it replaces every falsy value. Use `??`.",
            right: "const config = { retries: 0 };\nconsole.log(config?.retries ?? 3);",
          },
          {
            wrong: "const data = {};\nconsole.log(data?.items.length);",
            problem:
              "Still throws when data exists but has no items. The `?.` only guards the first hop — each optional step needs its own. Put `?.` at every link that might be missing.",
            right: "const data = {};\nconsole.log(data?.items?.length);",
          },
        ],
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "const obj = { fn: null };\nconsole.log(obj?.fn?.());\n",
        answer: "undefined",
        hints: [
          "obj exists, so the first `?.` passes through. What is `obj.fn`?",
          "It's null — so `?.()` refuses to call it and the whole expression short-circuits.",
        ],
        why:
          "`?.()` calls the function only if it isn't null or undefined. Here fn is null, so nothing is called and the expression produces undefined instead of throwing 'fn is not a function'.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: read a tag that might not exist",
        buggy: "function firstTag(post) {\n  return post.tags[0];\n}\nconsole.log(firstTag({}));\n",
        expected: "undefined",
        hints: [
          "Run it — TypeError, because `post.tags` is undefined and you can't index into undefined.",
          "You need to guard the index access, not just the property.",
          "`post?.tags?.[0]` — note the dot before the bracket, which is required for optional index access.",
        ],
        solution: "function firstTag(post) {\n  return post?.tags?.[0];\n}\nconsole.log(firstTag({}));\n",
        solutionWhy:
          "Each `?.` guards one hop. `post?.` handles a missing post, `tags?.[0]` handles a missing tags array.\n\nThe `?.[0]` syntax looks odd — you might expect just `?.[`— but the dot is required to distinguish optional indexing from an ordinary bracket access.",
      },
    ],
  },

  {
    id: "js.10.functions",
    track: "javascript",
    index: 10,
    title: "Functions, arrows & defaults",
    summary: "The three ways to define a function, and which to use when.",
    concepts: ["js:functions", "js:arrow", "js:rest-params"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Three ways to write one",
        body:
          "```\nfunction add(a, b) { return a + b; }       // declaration\nconst add = function (a, b) { return a + b; };  // expression\nconst add = (a, b) => a + b;                    // arrow\n```\n\nAll three produce a callable function. The differences that matter day to day:\n\n**Declarations are hoisted** — you can call them before the line that defines them. Expressions and arrows aren't; calling early gives a ReferenceError.\n\n**Arrows have no `this` of their own.** They inherit it from where they were written. That's usually what you want inside callbacks — and occasionally exactly what you don't want, as the next lesson covers.\n\n**Arrows can be very short.** With no braces, the body is the return value:\n\n```\nn => n * 2                  // returns n * 2\nn => { return n * 2; }      // same thing, spelled out\nn => { n * 2; }             // returns UNDEFINED — no return statement\n```\n\nThat third line is one of the most common JavaScript slips.\n\nIn practice: use arrows for short callbacks, and `function` declarations for named top-level functions where hoisting and a readable name in stack traces both help.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Defaults and rest parameters",
        body:
          "**Default values** apply when an argument is `undefined` — including when it's simply not passed:\n\n```\nfunction greet(name = 'world') {\n  return `hello, ${name}`;\n}\ngreet()            // 'hello, world'\ngreet(undefined)   // 'hello, world' — same thing\ngreet(null)        // 'hello, null'  — null is NOT undefined\n```\n\nThat last case surprises people: defaults check for `undefined` specifically, so an explicit null passes straight through.\n\nA default can reference earlier parameters:\n\n```\nfunction range(start, end = start + 10) { ... }\n```\n\n**Rest parameters** collect any extra arguments into a real array:\n\n```\nfunction total(...nums) {\n  return nums.reduce((a, b) => a + b, 0);\n}\ntotal(1, 2, 3)     // 6\n```\n\nThe rest parameter must be last, and there can only be one. Unlike the old `arguments` object, it's a genuine array — so map, filter and reduce all work on it, and it exists inside arrow functions too.",
      },
      {
        kind: "trace",
        id: "t1",
        title: "Watch defaults and rest bind",
        intro: "Three calls, three different bindings. Follow which parameter gets what.",
        code: "function tag(name, level = 1, ...extras) {\n  return `${name}:${level}:${extras.length}`;\n}\n\nconsole.log(tag('a'));\nconsole.log(tag('b', 5));\nconsole.log(tag('c', 5, 'x', 'y'));\n",
        lines: [
          {
            code: "console.log(tag('a'));",
            what:
              "Only one argument. name binds to 'a'; level isn't supplied so its default 1 applies; extras collects nothing and is an empty array — not undefined.",
            state: "name='a', level=1, extras=[]",
            output: "a:1:0",
          },
          {
            code: "console.log(tag('b', 5));",
            what: "Two arguments. The 5 overrides the default; extras is still empty.",
            state: "name='b', level=5, extras=[]",
            output: "b:5:0",
          },
          {
            code: "console.log(tag('c', 5, 'x', 'y'));",
            what:
              "Four arguments. The first two bind by position, and everything left over lands in extras as a two-item array.",
            state: "name='c', level=5, extras=['x','y']",
            output: "c:5:2",
          },
        ],
        takeaway:
          "Positional parameters fill first, defaults cover anything undefined, and the rest parameter always ends up as an array — empty rather than undefined when nothing is left.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Arrow, rest, default",
        code:
          "const greet = (name = 'world', ...extras) =>\n"
          + "  `hi ${name}${extras.length ? ' + ' + extras.join(',') : ''}`;\n\n"
          + "console.log(greet());\n"
          + "console.log(greet('Ada', 'Ren', 'Kai'));\n\n"
          + "const f = (x, y = x * 2) => x + y;\n"
          + "console.log(f(3), f(3, 10));\n",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "Function mistakes",
        items: [
          {
            wrong: "const double = n => { n * 2; };\nconsole.log(double(5));",
            problem:
              "Logs undefined. Braces make it a full body, which needs an explicit return. Drop the braces for a one-expression arrow, or add the return.",
            right: "const double = n => n * 2;\nconsole.log(double(5));",
          },
          {
            wrong: "const total = () => {\n  let sum = 0;\n  for (const n of arguments) sum += n;\n  return sum;\n};\nconsole.log(total(1, 2, 3));",
            problem:
              "Arrow functions have no `arguments` object of their own. In a module this is a flat ReferenceError; in other contexts it silently picks up an enclosing function's `arguments` and quietly sums nothing. Either way you don't get the caller's arguments. Use a rest parameter — it's a real array, and it works in every kind of function.",
            right: "const total = (...nums) => nums.reduce((a, b) => a + b, 0);\nconsole.log(total(1, 2, 3));",
          },
          {
            wrong: "const makeUser = () => { name: 'Ada' };\nconsole.log(makeUser());",
            problem:
              "Logs undefined. The braces are read as a function body, not an object literal — so `name:` becomes a label and nothing is returned. Wrap the object in round brackets.",
            right: "const makeUser = () => ({ name: 'Ada' });\nconsole.log(makeUser());",
          },
          {
            wrong: "function greet(name = 'world') {\n  return `hello, ${name}`;\n}\nconsole.log(greet(null));",
            problem:
              "Logs 'hello, null'. Defaults only fire for undefined, so an explicit null is passed through untouched. Use `??` inside if null should also fall back.",
            right: "function greet(name) {\n  return `hello, ${name ?? 'world'}`;\n}\nconsole.log(greet(null));",
          },
        ],
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "const f = (x, y = x * 2) => x + y;\nconsole.log(f(3));\nconsole.log(f(3, 10));\n",
        answer: "9\n13",
        hints: [
          "The default for y refers to x — that's allowed, since x is bound first.",
          "In the first call y defaults to 3 * 2 = 6, so the result is 3 + 6.",
        ],
        why:
          "Parameters bind left to right, so a later default can use an earlier parameter. f(3) gives y = 6 and returns 9; f(3, 10) supplies y explicitly and returns 13.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: arrows have no `arguments`",
        buggy:
          "const total = () => {\n  let sum = 0;\n  for (const n of arguments) sum += n;\n  return sum;\n};\nconsole.log(total(1,2,3));\n",
        expected: "6",
        hints: [
          "Run it — ReferenceError, because `arguments` doesn't exist inside an arrow function.",
          "The modern replacement collects extra arguments into a real array.",
          "Use a rest parameter: `(...nums) =>` and then work with nums.",
        ],
        solution: "const total = (...nums) => nums.reduce((a, b) => a + b, 0);\nconsole.log(total(1,2,3));\n",
        solutionWhy:
          "`...nums` gathers every argument into a genuine array, so array methods work on it directly.\n\nRest parameters are better than the old `arguments` object even in regular functions: `arguments` is array-*like* but lacks the array methods, so you'd have to convert it before doing anything useful.",
      },
      {
        kind: "write",
        id: "w1",
        title: "clamp",
        prompt:
          "Write clamp(x, lo, hi) returning x limited to the range lo..hi. Log clamp(5,0,3), clamp(-1,0,3) and clamp(2,0,3).",
        starter:
          "function clamp(x, lo, hi) {\n  // ...\n}\nconsole.log(clamp(5, 0, 3));\nconsole.log(clamp(-1, 0, 3));\nconsole.log(clamp(2, 0, 3));\n",
        expected: "3\n0\n2",
        hints: [
          "If x is above hi return hi; if below lo return lo; otherwise return x.",
          "That's expressible with two nested Math calls rather than if-statements.",
          "`Math.min(hi, Math.max(lo, x))` — push it up to at least lo, then down to at most hi.",
        ],
        solution:
          "function clamp(x, lo, hi) {\n  return Math.min(hi, Math.max(lo, x));\n}\nconsole.log(clamp(5, 0, 3));\nconsole.log(clamp(-1, 0, 3));\nconsole.log(clamp(2, 0, 3));\n",
        solutionWhy:
          "`Math.max(lo, x)` raises anything below lo up to lo; `Math.min(hi, ...)` then lowers anything above hi. Between them the value is pinned into range.\n\nThe if-based version is equally correct and arguably clearer to a newcomer — this one is worth knowing mainly because you'll meet it in other people's code.",
      },
    ],
  },


  {
    id: "js.11.closures",
    track: "javascript",
    index: 11,
    title: "Closures",
    summary: "Functions remember the variables they were born next to. That one fact powers a lot of JavaScript.",
    concepts: ["js:closure", "js:scope"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "A function remembers where it was written",
        body:
          "Here's the whole idea in one sentence: **when you create a function inside another function, the inner one keeps access to the outer one's variables — even after the outer function has finished and returned.**\n\nThat sounds like it shouldn't work. Normally when a function returns, its local variables are gone. But if something still points at them, JavaScript keeps them alive:\n\n```\nfunction makeGreeter(name) {\n  return function () {\n    console.log('Hi, ' + name);\n  };\n}\n\nconst greetSam = makeGreeter('Sam');\nmakeGreeter has now finished. `name` should be gone.\ngreetSam();   // 'Hi, Sam'  — but it isn't\n```\n\nThe returned function is carrying `name` around with it. That combination — **a function plus the variables it captured** — is what people mean by a *closure*.\n\nYou have already been writing closures without the name. Every callback you passed to `map` that used a variable from outside was one.",
      },
      {
        kind: "read",
        id: "r2",
        title: "What it's actually for",
        body:
          "Three jobs come up over and over.\n\n**1. Private state.** Variables inside the factory can't be reached from outside — the only way in is through the functions you hand back. There's no `obj.count = -999` to accidentally clobber.\n\n**2. Factories.** Write one function that manufactures customised functions:\n\n```\nfunction multiplyBy(n) {\n  return (x) => x * n;\n}\nconst double = multiplyBy(2);\nconst triple = multiplyBy(3);\n```\n\n`double` and `triple` are separate functions with separate captured `n`s.\n\n**3. Callbacks that need baggage.** When you hand a function to `setTimeout` or an event listener, you can't pass extra arguments to it — but a closure can carry them.\n\nOne rule to internalise now, because it causes real bugs later: **a closure captures the variable, not a snapshot of its value.** If the variable changes afterwards, the closure sees the new value.",
      },
      {
        kind: "trace",
        id: "t1",
        title: "Watch a counter keep its own state",
        intro:
          "`makeCounter` returns two small functions. Both of them close over the same `n`. Step through and watch where `n` lives.",
        code:
          "function makeCounter() {\n  let n = 0;\n  return {\n    inc: () => { n = n + 1; },\n    get: () => n,\n  };\n}\nconst a = makeCounter();\nconst b = makeCounter();\na.inc();\na.inc();\nconsole.log(a.get(), b.get());\n",
        lines: [
          {
            code: "const a = makeCounter();",
            what: "Calls makeCounter. Inside, a fresh `n` is created and set to 0, and an object holding two arrow functions is returned.",
            state: "a = { inc, get }, and hidden behind it: n = 0",
          },
          {
            code: "const b = makeCounter();",
            what: "Calls it AGAIN. This is a separate call, so it makes a completely separate `n`. b's functions close over b's `n`, not a's.",
            state: "a's n = 0, b's n = 0 — two independent boxes",
          },
          {
            code: "a.inc();",
            what: "makeCounter finished ages ago, but a.inc can still reach the `n` it captured. It sets it to 1.",
            state: "a's n = 1, b's n = 0",
          },
          {
            code: "a.inc();",
            what: "Again. Same captured variable, so it keeps climbing.",
            state: "a's n = 2, b's n = 0",
          },
          {
            code: "console.log(a.get(), b.get());",
            what: "a.get reads a's n; b.get reads b's. b was never incremented.",
            state: "a's n = 2, b's n = 0",
            output: "2 0",
          },
        ],
        takeaway:
          "Every CALL of the outer function creates a fresh set of captured variables. That's why two counters don't interfere — and it's exactly how you get private, per-instance state without a class.",
      },
      {
        kind: "example",
        id: "e1",
        title: "A factory and a private store",
        code:
          "function multiplyBy(n) {\n"
          + "  return (x) => x * n;\n"
          + "}\n"
          + "const double = multiplyBy(2);\n"
          + "const triple = multiplyBy(3);\n"
          + "console.log(double(5), triple(5));\n"
          + "\n"
          + "function makeWallet(start) {\n"
          + "  let balance = start;\n"
          + "  return {\n"
          + "    deposit: (x) => { balance += x; },\n"
          + "    balance: () => balance,\n"
          + "  };\n"
          + "}\n"
          + "const w = makeWallet(10);\n"
          + "w.deposit(5);\n"
          + "console.log(w.balance());\n"
          + "console.log(w.hiddenBalance);\n",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "Where closures bite",
        items: [
          {
            wrong: "const fns = [];\nfor (var i = 0; i < 3; i++) {\n  fns.push(() => i);\n}\nconsole.log(fns.map(f => f()));",
            problem:
              "Logs [ 3, 3, 3 ]. `var` creates ONE `i` shared by the whole loop, so all three functions captured the same variable — and by the time you call them, the loop has finished and left it at 3. `let` creates a fresh binding each iteration, which is what you almost always want.",
            right: "const fns = [];\nfor (let i = 0; i < 3; i++) {\n  fns.push(() => i);\n}\nconsole.log(fns.map(f => f()));",
          },
          {
            wrong: "let msg = 'first';\nconst show = () => console.log(msg);\nmsg = 'second';\nshow();",
            problem:
              "Logs 'second'. A closure captures the VARIABLE, not a copy of its value at the moment it was created. If you want a snapshot, copy it into a new const before making the function.",
            right: "let msg = 'first';\nconst snapshot = msg;\nconst show = () => console.log(snapshot);\nmsg = 'second';\nshow();",
          },
          {
            wrong: "let count = 0;\nfunction makeCounter() {\n  return () => ++count;\n}\nconst a = makeCounter();\nconst b = makeCounter();\na(); a();\nconsole.log(b());",
            problem:
              "Logs 3, not 1. `count` lives OUTSIDE the factory, so every counter shares it. The state must be declared inside the function for each call to get its own.",
            right: "function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}",
          },
        ],
      },
      {
        kind: "parsons",
        id: "pa1",
        title: "Assemble a counter factory",
        prompt:
          "Put these lines in order to build a factory that returns an independent counting function. Watch where the state has to be declared.",
        solution: [
          "function makeCounter() {",
          "  let n = 0;",
          "  return () => ++n;",
          "}",
          "const next = makeCounter();",
          "next();",
          "console.log(next());",
        ],
        expectedOutput: "2",
        hints: [
          "The state has to be created fresh on every call, so it belongs inside the function body.",
          "The factory's job is to hand back a function — that's the `return`.",
          "Two calls to `next()` happen; only the second one is logged.",
        ],
        explanation:
          "`let n = 0` runs once per call to makeCounter, giving each returned counter its own private tally. The first `next()` moves it to 1 and its result is thrown away; the second returns 2.",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "const fns = [];\nfor (let i = 0; i < 3; i++) fns.push(() => i);\nconsole.log(fns.map(f => f()));\n",
        answer: "[ 0, 1, 2 ]",
        hints: [
          "There are three functions in the array, and each was created during a different pass of the loop.",
          "`let` gives each iteration of the loop its very own `i`, so each function captured a different one.",
        ],
        why:
          "`let` in a for-loop header is special-cased: the language creates a new binding per iteration. Each arrow captured its own `i`, frozen at 0, 1 and 2. Swap in `var` and you'd get [ 3, 3, 3 ].",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: the shared counter",
        buggy:
          "let n = 0;\nfunction makeCounter() {\n  return () => ++n;\n}\nconst a = makeCounter();\nconst b = makeCounter();\na(); a();\nconsole.log(b());\n",
        expected: "1",
        hints: [
          "Run it. `b` has only been called once, so why isn't it 1?",
          "Both counters are reaching for the same variable. Where is that variable declared?",
          "Move `let n = 0` inside makeCounter so each call creates its own.",
        ],
        solution:
          "function makeCounter() {\n  let n = 0;\n  return () => ++n;\n}\nconst a = makeCounter();\nconst b = makeCounter();\na(); a();\nconsole.log(b());\n",
        solutionWhy:
          "Nothing about the returned arrow changed — the fix is entirely about WHERE the captured variable is declared. Inside the factory, each call gets a fresh one. Outside, they all share.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Memoize",
        prompt:
          "Write `memoize(fn)`: it returns a new function that remembers results by its first argument, so repeat calls skip the work. Test it with `x => x * x`, calling memo(4) twice and logging the sum. Expected: 32",
        starter:
          "function memoize(fn) {\n  // keep a cache here, return a function that uses it\n}\nconst memo = memoize(x => x * x);\nconsole.log(memo(4) + memo(4));\n",
        expected: "32",
        hints: [
          "The cache has to survive between calls but not be visible outside — so declare it inside memoize, before the returned function.",
          "A Map is a good cache. Check `cache.has(x)` first; if it's there, return `cache.get(x)`.",
          "Otherwise compute `fn(x)`, store it with `cache.set(x, result)`, and return it.",
        ],
        solution:
          "function memoize(fn) {\n  const cache = new Map();\n  return (x) => {\n    if (cache.has(x)) return cache.get(x);\n    const result = fn(x);\n    cache.set(x, result);\n    return result;\n  };\n}\nconst memo = memoize(x => x * x);\nconsole.log(memo(4) + memo(4));\n",
        solutionWhy:
          "The `cache` is the closure's private state: unreachable from outside, but alive for as long as the returned function is.\n\nUse `has`/`get` rather than `if (cache.get(x))` — a legitimately cached `0`, `''` or `false` is falsy and would be recomputed forever.",
      },
    ],
  },

  {
    id: "js.12.this",
    track: "javascript",
    index: 12,
    title: "`this`",
    summary: "The one JavaScript keyword that trips up everybody. Four rules and you're done.",
    concepts: ["js:this", "js:binding"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "`this` depends on how the function is CALLED",
        body:
          "In most languages, `this` (or `self`) means \"the object I belong to\", and it's decided when the code is written. JavaScript is different, and this is the source of nearly all the confusion:\n\n> In a regular function, `this` is decided **at the moment of the call**, by how the call was written — not by where the function was defined.\n\nThe same function can have a different `this` on every call. Here are the rules, in the order you should check them:\n\n**1. Is there a dot?** `user.greet()` — `this` is whatever is immediately left of the dot: `user`.\n\n**2. Is it `new`?** `new Timer()` — `this` is the brand-new object being built.\n\n**3. Was it called with `.call` / `.apply` / `.bind`?** Then `this` is whatever you passed.\n\n**4. None of the above?** `greet()` on its own — `this` is `undefined` in modern code (modules and class bodies). Reading a property off it throws.\n\nAnd then the escape hatch: **arrow functions ignore all four rules.** An arrow has no `this` of its own; it uses whatever `this` meant in the surrounding code where it was written. That's lexical, decided at write-time, and it's why arrows are the fix for most `this` bugs.",
      },
      {
        kind: "read",
        id: "r2",
        title: "The failure mode you'll actually hit",
        body:
          "It's rule 1 combined with rule 4. Look at what happens when a method gets separated from its object:\n\n```\nclass Timer {\n  constructor() { this.secs = 0; }\n  tick() { return ++this.secs; }\n}\n\nconst t = new Timer();\nt.tick();               // fine — there's a dot, this = t\n\nconst fn = t.tick;      // just grabbing the function\nfn();                   // TypeError — no dot, this is undefined\n```\n\nNothing about `tick` changed. The only difference is that the second call has no object to its left.\n\nThis happens constantly in real code, because passing a method somewhere *always* detaches it:\n\n```\nsetTimeout(t.tick, 100);          // detached — breaks\nbutton.addEventListener('click', t.tick);   // detached — breaks\n[1, 2, 3].forEach(t.tick);        // detached — breaks\n```\n\nTwo fixes, both fine:\n\n```\nsetTimeout(() => t.tick(), 100);   // arrow keeps the dot inside\nsetTimeout(t.tick.bind(t), 100);   // bind glues this to t permanently\n```\n\nThe arrow version is the more common style today. `bind` is useful when you need to hand off the function itself.",
      },
      {
        kind: "trace",
        id: "t1",
        title: "The same function, three different `this`",
        intro:
          "One function, called three ways. Follow what `this` is on each line.",
        code:
          "class Dog {\n  constructor(name) { this.name = name; }\n  speak() { return this.name + ' says woof'; }\n}\nconst rex = new Dog('Rex');\nconsole.log(rex.speak());\nconst loose = rex.speak;\ntry { console.log(loose()); } catch (e) { console.log('threw:', e.constructor.name); }\nconst bound = rex.speak.bind(rex);\nconsole.log(bound());\n",
        lines: [
          {
            code: "const rex = new Dog('Rex');",
            what: "Rule 2: `new` is used, so inside the constructor `this` is the fresh object. `this.name = name` writes onto it.",
            state: "rex = { name: 'Rex' }",
          },
          {
            code: "console.log(rex.speak());",
            what: "Rule 1: there's a dot, and `rex` is left of it. So `this` is rex and `this.name` is 'Rex'.",
            state: "this === rex",
            output: "Rex says woof",
          },
          {
            code: "const loose = rex.speak;",
            what: "No call yet — this just copies the function into a new variable. The function itself has no memory of rex; the connection only ever existed at the call site.",
            state: "loose is the same function, with no object attached",
          },
          {
            code: "try { console.log(loose()); } catch (e) { console.log('threw:', e.constructor.name); }",
            what: "Rule 4: no dot, no new, no bind. Class bodies are always strict mode, so `this` is undefined — and `undefined.name` throws a TypeError, which the catch reports.",
            state: "this === undefined",
            output: "threw: TypeError",
          },
          {
            code: "const bound = rex.speak.bind(rex);",
            what: "Rule 3: bind returns a NEW function with `this` permanently welded to rex. Nothing can detach it now.",
            state: "bound is a copy of speak with this locked to rex",
          },
          {
            code: "console.log(bound());",
            what: "Called with no dot — but bind wins over rule 4, so `this` is still rex.",
            output: "Rex says woof",
          },
        ],
        takeaway:
          "The object is never stored in the function. It's supplied by the call. Lose the call site and you lose `this` — unless an arrow or `bind` has fixed it in place.",
      },
      {
        kind: "categorize",
        id: "cat1",
        title: "What is `this` here?",
        prompt:
          "For each call, decide where `this` comes from. Tap a snippet, then tap the bucket it belongs in.",
        buckets: ["The object left of the dot", "Inherited from surrounding code", "Set explicitly by you"],
        items: [
          { text: "user.greet()", bucket: 0, why: "There's a dot, and `user` is immediately left of it." },
          { text: "app.config.save()", bucket: 0, why: "IMMEDIATELY left of the dot — that's `config`, not `app`." },
          { text: "greet.call(user)", bucket: 2, why: "`.call` takes `this` as its first argument." },
          { text: "const g = greet.bind(user)", bucket: 2, why: "`bind` returns a new function with `this` permanently fixed." },
          { text: "() => this.total  (inside a method)", bucket: 1, why: "Arrows have no `this` of their own; they borrow the enclosing method's." },
          { text: "items.forEach(n => this.sum += n)", bucket: 1, why: "Same reason — the arrow keeps whatever `this` the surrounding method had. This is why arrows fix callback bugs." },
        ],
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "The classic `this` mistakes",
        items: [
          {
            wrong: "const counter = {\n  n: 0,\n  inc: () => {\n    this.n++;\n  },\n};\ncounter.inc();",
            problem:
              "An arrow as an object METHOD is almost always wrong. Arrows ignore the dot, so `this` is whatever it was outside the object literal — not `counter`. Use shorthand method syntax for methods, and save arrows for callbacks.",
            right: "const counter = {\n  n: 0,\n  inc() {\n    this.n++;\n  },\n};\ncounter.inc();",
          },
          {
            wrong: "class Cart {\n  constructor() { this.items = [1, 2, 3]; this.total = 0; }\n  sum() {\n    this.items.forEach(function (n) {\n      this.total += n;\n    });\n    return this.total;\n  }\n}",
            problem:
              "Throws a TypeError. `forEach` calls that plain function with no object attached, so `this` is undefined inside it — even though the surrounding method had a perfectly good `this`. Swap the plain function for an arrow and it inherits the method's `this`.",
            right: "sum() {\n  this.items.forEach((n) => {\n    this.total += n;\n  });\n  return this.total;\n}",
          },
          {
            wrong: "const t = new Timer();\nsetTimeout(t.tick, 100);",
            problem:
              "By the time setTimeout calls it, the function has been separated from `t` — there's no dot at the call site, so `this` is undefined. Passing a method anywhere as a value detaches it.",
            right: "setTimeout(() => t.tick(), 100);",
          },
        ],
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "class C {\n  constructor() { this.x = 1; }\n  get() { return this.x; }\n}\nconst c = new C();\nconst g = c.get;\ntry { console.log(g()); } catch (e) { console.log(e.constructor.name); }\n",
        answer: "TypeError",
        hints: [
          "Look at the call `g()` — is there anything to the left of a dot?",
          "Class bodies are strict mode, so a function called bare gets `this === undefined`.",
          "What happens when you read `.x` off `undefined`?",
        ],
        why:
          "`const g = c.get` copies the function out; the link to `c` lived only in the call site `c.get()`. Called bare, `this` is undefined and `undefined.x` throws a TypeError, which the catch block prints.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: keep the method attached",
        buggy:
          "class Timer {\n  constructor() { this.secs = 0; }\n  tick() { this.secs++; return this.secs; }\n}\nconst t = new Timer();\nconst tick = t.tick;\nconsole.log(tick());\n",
        expected: "1",
        hints: [
          "Run it and read the error. What is `this` when `tick()` is called on its own?",
          "You need to give the function back its object — either at the call site or permanently.",
          "`const tick = t.tick.bind(t);` welds it on. `const tick = () => t.tick();` works just as well.",
        ],
        solution:
          "class Timer {\n  constructor() { this.secs = 0; }\n  tick() { this.secs++; return this.secs; }\n}\nconst t = new Timer();\nconst tick = t.tick.bind(t);\nconsole.log(tick());\n",
        solutionWhy:
          "`bind` returns a new function whose `this` is fixed to `t` forever, so it survives being passed around.\n\nThe arrow version (`() => t.tick()`) achieves the same thing by keeping the dot inside. There's also a third option you'll see in class-heavy code: declare the method as a class field, `tick = () => { ... }`, which binds it per instance automatically.",
      },
    ],
  },

  {
    id: "js.13.classes",
    track: "javascript",
    index: 13,
    title: "Classes",
    summary: "A blueprint for objects: constructor, fields, #private, static, and inheritance.",
    concepts: ["js:class", "js:private-fields", "js:static"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Why bother, when object literals exist?",
        body:
          "You can already make objects with `{ }`. A class earns its place when you need **many objects of the same shape**, each with its own data but sharing the same behaviour.\n\nWriting `{ name: 'Rex', speak() {...} }` twenty times means twenty copies of `speak`. A class is a factory that stamps them out:\n\n```\nclass Dog {\n  constructor(name) {\n    this.name = name;      // per-instance data\n  }\n  speak() {                // shared behaviour, stored once\n    return `${this.name} says woof`;\n  }\n}\n\nconst rex = new Dog('Rex');\nconst mia = new Dog('Mia');\n```\n\nThe pieces:\n\n- **`constructor`** runs automatically on `new`. Its job is to set up `this`. It's optional — omit it if there's nothing to set up.\n- **Methods** go in the class body with no `function` keyword and no commas between them.\n- **`new`** is required. Calling `Dog('Rex')` without it throws.\n\nComing from Python: same idea as `class Dog:` with `__init__`, except JavaScript has no explicit `self` parameter — `this` is supplied by the call, as you saw in the last lesson.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Fields, #private, static, getters",
        body:
          "**Class fields** let you declare instance data at the top of the class instead of assigning it in the constructor. It reads better and documents the shape:\n\n```\nclass Counter {\n  n = 0;                 // every instance starts with n = 0\n}\n```\n\n**Private fields** start with `#`. They are genuinely inaccessible from outside — not a naming convention like Python's `_underscore`, but enforced by the language:\n\n```\nclass Counter {\n  #n = 0;\n  inc() { this.#n++; }\n  get value() { return this.#n; }\n}\nconst c = new Counter();\nc.#n            // SyntaxError — the code won't even parse\n```\n\n**`get`** makes a method behave like a property: `c.value`, not `c.value()`. Use it for things that are cheap to compute and feel like data. There's a matching `set` for assignment.\n\n**`static`** members live on the class itself, not on instances — useful for constants and alternative constructors:\n\n```\nclass Temp {\n  static ABSOLUTE_ZERO = -273.15;\n  static fromF(f) { return new Temp((f - 32) * 5 / 9); }\n  constructor(c) { this.c = c; }\n}\nTemp.fromF(212);           // on the class\n```\n\n**Inheritance** uses `extends`, and a subclass constructor must call `super(...)` **before** touching `this`:\n\n```\nclass Puppy extends Dog {\n  constructor(name) {\n    super(name);           // must come first\n    this.small = true;\n  }\n}\n```",
      },
      {
        kind: "trace",
        id: "t1",
        title: "What `new` actually does",
        intro:
          "Four steps happen behind that one keyword. Follow a subclass being built.",
        code:
          "class Shape {\n  constructor(name) { this.name = name; }\n  describe() { return `a ${this.name}`; }\n}\nclass Circle extends Shape {\n  constructor(r) {\n    super('circle');\n    this.r = r;\n  }\n  area() { return Math.PI * this.r ** 2; }\n}\nconst c = new Circle(2);\nconsole.log(c.describe(), c.area().toFixed(2));\n",
        lines: [
          {
            code: "const c = new Circle(2);",
            what: "`new` creates an empty object, links it to Circle so it can find Circle's methods, then runs the constructor with `this` set to that object.",
            state: "this = {} (an empty Circle)",
          },
          {
            code: "    super('circle');",
            what: "Runs the PARENT constructor against the same `this`. Until this line finishes, touching `this` is an error — that's why super has to come first.",
            state: "this = { name: 'circle' }",
          },
          {
            code: "    this.r = r;",
            what: "Now the subclass adds its own data on top.",
            state: "this = { name: 'circle', r: 2 }",
          },
          {
            code: "console.log(c.describe(), c.area().toFixed(2));",
            what: "`describe` isn't on Circle, so JavaScript looks up the chain and finds it on Shape. `area` is found on Circle directly. Both run with `this === c`.",
            state: "c = { name: 'circle', r: 2 }",
            output: "a circle 12.57",
          },
        ],
        takeaway:
          "Data lives on the instance; methods live on the class and are shared. A missing method is looked for on the parent, then its parent, and so on — that's the prototype chain.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Privacy, getters and statics together",
        code:
          "class BankAccount {\n"
          + "  #balance = 0;\n"
          + "  static opened = 0;\n"
          + "\n"
          + "  constructor(owner) {\n"
          + "    this.owner = owner;\n"
          + "    BankAccount.opened++;\n"
          + "  }\n"
          + "  deposit(amount) {\n"
          + "    if (amount <= 0) throw new RangeError('deposit must be positive');\n"
          + "    this.#balance += amount;\n"
          + "    return this;\n"
          + "  }\n"
          + "  get balance() { return this.#balance; }\n"
          + "}\n"
          + "\n"
          + "const acct = new BankAccount('Sam');\n"
          + "acct.deposit(50).deposit(25);\n"
          + "console.log(acct.owner, acct.balance);\n"
          + "console.log('accounts opened:', BankAccount.opened);\n"
          + "console.log('readable through the getter:', acct.balance);\n"
          + "console.log('but invisible from outside:', Object.keys(acct));\n",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "Class mistakes",
        items: [
          {
            wrong: "class Dog {\n  constructor(name) { this.name = name; }\n}\nconst rex = Dog('Rex');",
            problem:
              "TypeError: Class constructor Dog cannot be invoked without 'new'. Unlike an ordinary function, a class refuses to run without `new`. The error is at least clear — but it's easy to forget when a class name looks like a function name.",
            right: "const rex = new Dog('Rex');",
          },
          {
            wrong: "class Puppy extends Dog {\n  constructor(name) {\n    this.small = true;\n    super(name);\n  }\n}",
            problem:
              "ReferenceError: Must call super constructor before accessing 'this'. In a derived class, `this` literally does not exist until super() has run — the parent is the one that creates it. super() always comes first.",
            right: "class Puppy extends Dog {\n  constructor(name) {\n    super(name);\n    this.small = true;\n  }\n}",
          },
          {
            wrong: "class Counter {\n  n = 0;\n  inc() { n++; }\n}",
            problem:
              "ReferenceError: n is not defined. Inside a method, a bare `n` means a variable in scope — not the field. Instance data always needs `this.` (or `#` for private fields). This one catches Python users constantly, since Python needs `self.` for the same reason.",
            right: "class Counter {\n  n = 0;\n  inc() { this.n++; }\n}",
          },
          {
            wrong: "class Temp {\n  static ZERO = -273.15;\n  show() { return this.ZERO; }\n}\nnew Temp().show();",
            problem:
              "Returns undefined. `static` members live on the CLASS, not on instances, so `this.ZERO` finds nothing. Reach for it by the class name — `Temp.ZERO` — or `this.constructor.ZERO` if you want subclasses to be able to override it.",
            right: "class Temp {\n  static ZERO = -273.15;\n  show() { return Temp.ZERO; }\n}",
          },
        ],
      },
      {
        kind: "cloze",
        id: "cz1",
        title: "Fill in the class",
        prompt: "Complete the keywords. A private tally, a shared count, and a subclass hookup.",
        template:
          "class Counter {\n  {{0}}n = 0;                 // private to this class\n  {{1}} made = 0;            // lives on the class, not instances\n  inc() { {{2}}.#n++; }\n}\n\nclass Loud {{3}} Counter {\n  constructor() {\n    {{4}}();                 // must run before touching this\n  }\n}\n",
        blanks: [
          { answer: "#", width: 3 },
          { answer: "static", width: 8 },
          { answer: "this", width: 6 },
          { answer: "extends", width: 9 },
          { answer: "super", width: 7 },
        ],
        explanation:
          "`#` marks a hard-private field. `static` puts a member on the class itself. Instance data is always reached through `this`. `extends` sets up inheritance and `super()` runs the parent constructor — which must happen before `this` is available.",
      },
      {
        kind: "parsons",
        id: "pa1",
        title: "Assemble a subclass",
        prompt:
          "Order these lines into a working subclass. Remember what has to happen before `this` can be used.",
        solution: [
          "class Animal {",
          "  constructor(name) { this.name = name; }",
          "}",
          "class Cat extends Animal {",
          "  constructor(name) {",
          "    super(name);",
          "    this.legs = 4;",
          "  }",
          "}",
          "const c = new Cat('Mia');",
          "console.log(c.name, c.legs);",
        ],
        expectedOutput: "Mia 4",
        hints: [
          "The parent class has to be defined before the class that extends it.",
          "Inside the subclass constructor, one specific call must come before any use of `this`.",
          "super(name) hands the name up to Animal, which is what sets this.name.",
        ],
        explanation:
          "Animal is declared first, Cat extends it, and the subclass constructor calls super(name) before assigning this.legs. Class declarations are not hoisted the way function declarations are, so order genuinely matters here.",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "class C {\n  static n = 0;\n  constructor() { C.n++; }\n}\nnew C(); new C(); new C();\nconsole.log(C.n);\n",
        answer: "3",
        hints: [
          "How many times does the constructor run?",
          "`C.n` is one single value shared by the class — not one per instance.",
        ],
        why:
          "A static field belongs to the class object itself, so every constructor call increments the same counter. This is the standard way to count instances.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Build a Stack",
        prompt:
          "Write a Stack class with a private `#items` array, `push(x)`, `pop()` (returns and removes the top), and `size()`. Push 1, 2, 3, pop once, then log size(). Expected: 2",
        starter:
          "class Stack {\n  // #items, push, pop, size\n}\nconst s = new Stack();\ns.push(1); s.push(2); s.push(3);\ns.pop();\nconsole.log(s.size());\n",
        expected: "2",
        hints: [
          "Declare the field as `#items = [];` at the top of the class body — no `const`, no comma after it.",
          "Arrays already do the work: `push` maps to `this.#items.push(x)` and `pop` to `this.#items.pop()`.",
          "`size()` returns `this.#items.length`.",
        ],
        solution:
          "class Stack {\n  #items = [];\n  push(x) { this.#items.push(x); }\n  pop() { return this.#items.pop(); }\n  size() { return this.#items.length; }\n}\nconst s = new Stack();\ns.push(1); s.push(2); s.push(3);\ns.pop();\nconsole.log(s.size());\n",
        solutionWhy:
          "The class is a thin, well-named wrapper over an array — that's most of what small classes are, and it's a good thing. The `#` means no caller can reach in and reorder the items behind your back, so the only way to change a Stack is through the three operations you allowed.\n\n`size` could just as well have been a getter (`get size() { ... }`), letting callers write `s.size`. Both are idiomatic.",
      },
    ],
  },

  {
    id: "js.14.promises",
    track: "javascript",
    index: 14,
    title: "Promises",
    summary: "A receipt for a value that isn't ready yet — and how to chain, combine and catch.",
    concepts: ["js:promise", "js:chain", "js:combinators"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "A promise is a receipt",
        body:
          "Some work doesn't finish immediately: reading a file, calling an API, waiting a second. JavaScript refuses to sit and block while that happens — it's single-threaded, so blocking would freeze everything.\n\nInstead, the function hands you a **Promise**: an object that says *\"the value isn't here yet; I'll tell you when it is.\"* A receipt.\n\nA promise is in exactly one of three states:\n\n- **pending** — still working\n- **fulfilled** — finished, with a value\n- **rejected** — failed, with an error\n\nOnce it settles into fulfilled or rejected, it's frozen there forever. It can't change its mind or fire twice.\n\nYou read the result with `.then()`, and handle failure with `.catch()`:\n\n```\ngetUser(1)\n  .then(user => console.log(user.name))\n  .catch(err => console.log('failed:', err.message));\n```\n\nOne thing to be clear about up front: **`.then` does not pause your program.** The lines after it run immediately, while the promise is still pending. That's the whole point — but it surprises everyone at first.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Chaining, and why `return` matters",
        body:
          "`.then()` returns a **new promise**, which is what makes chains work:\n\n```\nPromise.resolve(2)\n  .then(x => x + 1)      // fulfilled with 3\n  .then(x => x * 10)     // fulfilled with 30\n  .then(console.log);    // logs 30\n```\n\nEach handler's return value becomes the next promise's value. And there's a special case that makes the whole design work: **if a handler returns a promise, the chain waits for it** and unwraps the value.\n\nWhich means the single most common mistake is forgetting to return:\n\n```\n.then(x => { doSomethingAsync(x); })    // chain does NOT wait\n.then(x => doSomethingAsync(x))         // chain waits — arrow returns it\n```\n\nWith curly braces you must write `return` yourself. Without them the arrow returns automatically.\n\n**Errors slide down the chain.** A `throw` anywhere — or a rejected promise — skips every `.then` until it reaches a `.catch`. So one `.catch` at the end covers the whole chain, and there should always be one. A rejection with nobody listening becomes an unhandled rejection, which crashes Node and logs an ugly error in the browser.\n\n`.finally(fn)` runs either way, for cleanup — hiding a spinner, closing a connection.",
      },
      {
        kind: "read",
        id: "r3",
        title: "The four combinators",
        body:
          "When you have several promises at once, these decide how to wait. Choosing the right one is a real design decision:\n\n**`Promise.all([...])`** — waits for all to fulfil; gives you an array of values in order. If ANY rejects, the whole thing rejects immediately with that error. *Use when you need every piece.*\n\n**`Promise.allSettled([...])`** — waits for all to finish, success or failure, and never rejects. Gives you `{ status: 'fulfilled', value }` or `{ status: 'rejected', reason }` for each. *Use when partial failure is acceptable and you want a report.*\n\n**`Promise.race([...])`** — settles as soon as the FIRST one settles, whether it fulfilled or rejected. *Use for timeouts: race the real work against a promise that rejects after 5 seconds.*\n\n**`Promise.any([...])`** — gives you the first SUCCESS, ignoring failures. Only rejects if all of them fail (with an `AggregateError`). *Use for redundancy: three mirrors, take whichever answers first.*\n\nThe `all` vs `allSettled` distinction is the one that bites in production. `all` rejecting on the first failure means you lose the results that did succeed.",
      },
      {
        kind: "trace",
        id: "t1",
        title: "Follow a chain, including the error path",
        intro: "Step through and watch the value change hands — and watch a throw skip past a `.then`.",
        code:
          "await Promise.resolve(2)\n  .then(x => x + 1)\n  .then(x => { throw new Error('boom'); })\n  .then(x => console.log('never runs', x))\n  .catch(e => console.log('caught:', e.message))\n  .finally(() => console.log('cleanup'));\n",
        lines: [
          {
            code: "await Promise.resolve(2)",
            what: "Makes a promise that is ALREADY fulfilled with 2. Handy for starting a chain or for testing.",
            state: "value travelling down the chain: 2",
          },
          {
            code: "  .then(x => x + 1)",
            what: "Receives 2, returns 3. The promise this .then produced is now fulfilled with 3.",
            state: "value: 3",
          },
          {
            code: "  .then(x => { throw new Error('boom'); })",
            what: "Receives 3 but throws instead of returning. The promise this produced is now REJECTED with that Error.",
            state: "rejected with Error('boom')",
          },
          {
            code: "  .then(x => console.log('never runs', x))",
            what: "Skipped entirely. A .then with only a success handler has nothing to say about a rejection, so the rejection passes straight through.",
            state: "still rejected with Error('boom')",
          },
          {
            code: "  .catch(e => console.log('caught:', e.message))",
            what: "This one handles rejections. It logs, and — importantly — returns normally, which puts the chain back into a fulfilled state.",
            state: "fulfilled again (with undefined)",
            output: "caught: boom",
          },
          {
            code: "  .finally(() => console.log('cleanup'));",
            what: "Runs no matter which way things went. It doesn't change the value passing through — it's purely for cleanup.",
            output: "cleanup",
          },
        ],
        takeaway:
          "A rejection falls past every `.then` until something catches it. That's why one `.catch` at the bottom is enough — and why a chain without one silently loses errors.",
      },
      {
        kind: "example",
        id: "e1",
        title: "all vs allSettled on the same inputs",
        code:
          "const ok = (v) => Promise.resolve(v);\n"
          + "const bad = (m) => Promise.reject(new Error(m));\n"
          + "\n"
          + "try {\n"
          + "  await Promise.all([ok(1), bad('nope'), ok(3)]);\n"
          + "} catch (e) {\n"
          + "  console.log('all rejected with:', e.message);\n"
          + "}\n"
          + "\n"
          + "const settled = await Promise.allSettled([ok(1), bad('nope'), ok(3)]);\n"
          + "for (const r of settled) {\n"
          + "  console.log(r.status, r.status === 'fulfilled' ? r.value : r.reason.message);\n"
          + "}\n"
          + "\n"
          + "console.log('any:', await Promise.any([bad('a'), ok('winner')]));\n",
      },
      {
        kind: "categorize",
        id: "cat1",
        title: "Pick the right combinator",
        prompt: "Each row is a real situation. Which one do you reach for?",
        buckets: ["Promise.all", "Promise.allSettled", "Promise.race", "Promise.any"],
        items: [
          {
            text: "Load the 4 panels a dashboard cannot render without",
            bucket: 0,
            why: "You need every one. If any fails there's nothing worth showing, so failing fast is correct.",
          },
          {
            text: "Send 100 emails, then report which ones bounced",
            bucket: 1,
            why: "Partial failure is expected and you want the full report, not an early abort.",
          },
          {
            text: "Give up on a request if it takes longer than 5 seconds",
            bucket: 2,
            why: "Race the real work against a timer that rejects. First to settle wins, win or lose.",
          },
          {
            text: "Query three mirrors, use whichever replies successfully first",
            bucket: 3,
            why: "Failures are ignored; you just want the first success. Only rejects if all three fail.",
          },
          {
            text: "Fetch a user AND their orders before rendering a page",
            bucket: 0,
            why: "Both are required, and running them together is faster than one after the other.",
          },
          {
            text: "Try 3 CDN URLs for an image and take the first one that works",
            bucket: 3,
            why: "Same redundancy pattern — first success wins, individual failures don't matter.",
          },
        ],
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "Promise mistakes",
        items: [
          {
            wrong: "fetchUser(1)\n  .then(user => { fetchOrders(user.id); })\n  .then(orders => console.log(orders.length));",
            problem:
              "Logs an error — `orders` is undefined. The braces mean the arrow returns nothing, so the chain didn't wait for fetchOrders. Either add `return`, or drop the braces so the arrow returns implicitly.",
            right: "fetchUser(1)\n  .then(user => fetchOrders(user.id))\n  .then(orders => console.log(orders.length));",
          },
          {
            wrong: "doWork().then(handleResult());",
            problem:
              "The parentheses CALL handleResult right now and pass its return value — usually undefined — to .then. Pass the function itself, without calling it.",
            right: "doWork().then(handleResult);",
          },
          {
            wrong: "getUser(1).then(u => console.log(u.name));",
            problem:
              "No .catch. If the promise rejects, nothing is listening: Node exits with an unhandled rejection error and browsers log a warning you'll probably miss. Every chain needs a terminal .catch.",
            right: "getUser(1)\n  .then(u => console.log(u.name))\n  .catch(e => console.log('failed:', e.message));",
          },
          {
            wrong: "const user = getUser(1);\nconsole.log(user.name);",
            problem:
              "`user` is the Promise itself, not the user — `.name` is undefined. A promise never turns into its value by sitting in a variable; you have to unwrap it with .then or await.",
            right: "getUser(1).then(user => console.log(user.name));",
          },
        ],
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict (this is the important one)",
        code:
          "console.log('a');\nPromise.resolve().then(() => console.log('b'));\nconsole.log('c');\n",
        answer: "a\nc\nb",
        hints: [
          "The promise is already resolved — but does that make `.then` run immediately?",
          "`.then` handlers are queued to run after the current run of straight-line code finishes, even when there's nothing to wait for.",
        ],
        why:
          "Handlers never run in the middle of your synchronous code. JavaScript finishes the current script first, then drains the queue of pending handlers. So 'a' and 'c' print, and only then 'b'.\n\nThis is the engine's guarantee that a `.then` is *always* asynchronous — which means code behaves the same whether the promise was instant or took a second.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: the chain isn't waiting",
        buggy:
          "await Promise.resolve(1)\n  .then(x => { Promise.resolve(x + 1); })\n  .then(v => console.log('got', v));\n",
        expected: "got 2",
        hints: [
          "It prints `got undefined`. What value did the first handler hand to the next one?",
          "An arrow with `{ }` around its body returns undefined unless you write `return`.",
          "Return the inner promise — the chain will then wait for it and unwrap the value.",
        ],
        solution:
          "await Promise.resolve(1)\n  .then(x => Promise.resolve(x + 1))\n  .then(v => console.log('got', v));\n",
        solutionWhy:
          "Dropping the braces makes the arrow return the inner promise. Because a returned promise is awaited and unwrapped by the chain, the next `.then` receives 2 rather than a promise.\n\n`.then(x => { return Promise.resolve(x + 1); })` is identical in effect — the fix is the `return`, not the braces.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Add a timeout with race",
        prompt:
          "Write `withTimeout(promise, ms)` that returns whichever settles first: the promise, or a rejection with message 'timeout'. Call it with work that takes 10ms and a 200ms limit, and log the result. Expected: done",
        starter:
          "const sleep = (ms, v) => new Promise(r => setTimeout(() => r(v), ms));\n\nfunction withTimeout(promise, ms) {\n  // race the promise against a rejecting timer\n}\n\nconsole.log(await withTimeout(sleep(10, 'done'), 200));\n",
        expected: "done",
        hints: [
          "You need a second promise that REJECTS after `ms` — build it with `new Promise((resolve, reject) => ...)`.",
          "Inside it: `setTimeout(() => reject(new Error('timeout')), ms)`.",
          "Then `return Promise.race([promise, timer])` — first to settle wins.",
        ],
        solution:
          "const sleep = (ms, v) => new Promise(r => setTimeout(() => r(v), ms));\n\nfunction withTimeout(promise, ms) {\n  const timer = new Promise((_, reject) => {\n    setTimeout(() => reject(new Error('timeout')), ms);\n  });\n  return Promise.race([promise, timer]);\n}\n\nconsole.log(await withTimeout(sleep(10, 'done'), 200));\n",
        solutionWhy:
          "This is the canonical use of `race`, and worth memorising — almost every network call in production should have something like it.\n\nOne honest caveat: racing doesn't CANCEL the slow work, it just stops you waiting on it. The original promise keeps running in the background. Real cancellation needs `AbortController`, which is what `fetch` accepts via its `signal` option.",
      },
    ],
  },

  {
    id: "js.15.async",
    track: "javascript",
    index: 15,
    title: "async / await",
    summary: "The same promises, written so they read top to bottom.",
    concepts: ["js:async", "js:await", "js:concurrency"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "await is `.then` with better handwriting",
        body:
          "`async`/`await` doesn't add anything promises couldn't already do. It's a different way to write the same thing, and it's overwhelmingly the way people write it now.\n\nTwo keywords:\n\n- **`async`** in front of a function means \"this function returns a promise\", whatever you write inside it.\n- **`await`** in front of a promise means \"pause here until it settles, then give me the value\".\n\nSide by side:\n\n```\n// with .then\nfunction load() {\n  return getUser(1)\n    .then(user => getOrders(user.id))\n    .then(orders => orders.length);\n}\n\n// with await\nasync function load() {\n  const user = await getUser(1);\n  const orders = await getOrders(user.id);\n  return orders.length;\n}\n```\n\nThe second version has no callbacks, no nesting, and intermediate values in plain named variables. That's the entire pitch.\n\nTwo things that trip people up:\n\n**`await` only pauses the function it's in.** The rest of your program keeps running. Nothing is blocked.\n\n**An `async` function always returns a promise.** `return orders.length` doesn't hand back a number — it hands back a promise that fulfils with that number. So the caller still has to `await` it.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Errors, and the concurrency trap",
        body:
          "Because a rejected `await` **throws**, you handle async errors with ordinary `try`/`catch`:\n\n```\nasync function load() {\n  try {\n    const user = await getUser(1);\n    return user.name;\n  } catch (e) {\n    console.log('failed:', e.message);\n    return 'anonymous';\n  } finally {\n    hideSpinner();\n  }\n}\n```\n\nNow the trap, and it's the one that actually matters in production.\n\n**`await` in a loop makes everything sequential.**\n\n```\nfor (const id of ids) {\n  results.push(await getUser(id));   // one at a time\n}\n```\n\nWith 10 ids at 200ms each, that's 2 seconds. The requests don't depend on each other, so they could all be in flight at once:\n\n```\nconst results = await Promise.all(ids.map(id => getUser(id)));   // ~200ms\n```\n\nThe rule: **start everything first, await afterwards.** `ids.map(...)` without `await` inside kicks off every request immediately and gives you an array of promises; `Promise.all` then waits for the lot.\n\nWhen the calls genuinely depend on each other — you need the user before you can fetch their orders — sequential is correct and unavoidable. The waste is only when independent work is serialised out of habit.",
      },
      {
        kind: "trace",
        id: "t1",
        title: "Where does await actually pause?",
        intro:
          "This one is worth stepping through slowly. Watch the order the lines print in — it isn't the order they're written.",
        code:
          "const sleep = (ms) => new Promise(r => setTimeout(r, ms));\nasync function work() {\n  console.log('2: inside, before await');\n  await sleep(10);\n  console.log('4: after await');\n  return 'done';\n}\nconsole.log('1: before call');\nconst p = work();\nconsole.log('3: after call, p is a promise');\nconsole.log('5:', await p);\n",
        lines: [
          {
            code: "console.log('1: before call');",
            what: "Ordinary synchronous code, runs first.",
            output: "1: before call",
          },
          {
            code: "const p = work();",
            what: "Calling an async function runs its body IMMEDIATELY and synchronously — right up to the first await.",
            state: "we are now inside work()",
          },
          {
            code: "  console.log('2: inside, before await');",
            what: "Still synchronous. Nothing has been deferred yet.",
            output: "2: inside, before await",
          },
          {
            code: "  await sleep(10);",
            what: "HERE is the pause. work() suspends and immediately hands a pending promise back to whoever called it. It has NOT finished.",
            state: "p = a pending promise; control returns to the caller",
          },
          {
            code: "console.log('3: after call, p is a promise');",
            what: "The caller carries on straight away. This is the key insight: await paused work(), not the program.",
            output: "3: after call, p is a promise",
          },
          {
            code: "  console.log('4: after await');",
            what: "10ms later the timer fires, sleep's promise fulfils, and work() resumes exactly where it left off.",
            output: "4: after await",
          },
          {
            code: "console.log('5:', await p);",
            what: "work() returned 'done', which fulfils p. Awaiting it unwraps the value.",
            output: "5: done",
          },
        ],
        takeaway:
          "An async function runs synchronously until its first `await`, then hands control back and resumes later. If you take one thing from this lesson: `await` suspends the FUNCTION, not the program.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Sequential vs parallel, timed",
        code:
          "const sleep = (ms) => new Promise(r => setTimeout(r, ms));\n"
          + "\n"
          + "async function sequential() {\n"
          + "  const t = Date.now();\n"
          + "  await sleep(60);\n"
          + "  await sleep(60);\n"
          + "  return Date.now() - t;\n"
          + "}\n"
          + "\n"
          + "async function parallel() {\n"
          + "  const t = Date.now();\n"
          + "  await Promise.all([sleep(60), sleep(60)]);\n"
          + "  return Date.now() - t;\n"
          + "}\n"
          + "\n"
          + "const s = await sequential();\n"
          + "const p = await parallel();\n"
          + "console.log('sequential took about 120ms?', s >= 110);\n"
          + "console.log('parallel took about 60ms?', p < 110);\n",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "async mistakes",
        items: [
          {
            wrong: "async function getName() { return 'Sam'; }\nconst name = getName();\nconsole.log(name.toUpperCase());",
            problem:
              "Throws — `name` is a Promise, not a string. An async function ALWAYS returns a promise, even when the body returns a plain value. Forgetting `await` at a call site is the single most common async bug.",
            right: "const name = await getName();\nconsole.log(name.toUpperCase());",
          },
          {
            wrong: "ids.forEach(async (id) => {\n  await save(id);\n});\nconsole.log('all saved');",
            problem:
              "Logs 'all saved' before anything is saved. `forEach` ignores the promise each callback returns, so it has no idea there's anything to wait for. This one is nasty because it looks completely correct.",
            right: "await Promise.all(ids.map(id => save(id)));\nconsole.log('all saved');",
          },
          {
            wrong: "const results = [];\nfor (const id of ids) {\n  results.push(await getUser(id));\n}",
            problem:
              "Correct, but needlessly slow — each request waits for the previous one to come back. With 10 independent requests at 200ms you've turned 200ms into 2 seconds. Only serialise when a call genuinely depends on the one before it.",
            right: "const results = await Promise.all(ids.map(id => getUser(id)));",
          },
          {
            wrong: "async function load() {\n  const data = await risky();\n  return data;\n}\nload();",
            problem:
              "If risky() rejects, the rejection propagates out of load() with nobody catching it — an unhandled rejection. Either try/catch inside, or .catch() at the call site. Every async call chain needs a catch somewhere.",
            right: "load().catch(e => console.log('failed:', e.message));",
          },
        ],
      },
      {
        kind: "parsons",
        id: "pa1",
        title: "Assemble a parallel fetch with error handling",
        prompt:
          "Order these lines so both items are fetched at the same time, with failures handled.",
        solution: [
          "async function loadBoth(a, b) {",
          "  try {",
          "    const results = await Promise.all([get(a), get(b)]);",
          "    return results.join(' + ');",
          "  } catch (e) {",
          "    return 'failed: ' + e.message;",
          "  }",
          "}",
        ],
        hints: [
          "The whole body needs to be wrapped so a rejected await can be caught.",
          "Both calls have to start before anything is awaited — that's what putting them inside Promise.all does.",
          "The catch block comes after the try block's closing brace, and both sit inside the function.",
        ],
        explanation:
          "`get(a)` and `get(b)` are both called while building the array, so both requests are in flight before `await` runs. Because a rejected await throws, an ordinary try/catch handles the failure.",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "async function f() { return 1; }\nconsole.log(f() instanceof Promise);\nconsole.log(await f());\n",
        answer: "true\n1",
        hints: [
          "What does an async function hand back — the value, or something wrapping it?",
          "`await` is what unwraps it.",
        ],
        why:
          "`async` guarantees a promise return type no matter what's inside, so `f()` is a Promise even though the body returns a plain 1. `await f()` unwraps it back to 1.\n\nThis is exactly why forgetting `await` gives you a Promise where you expected data.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: make the work parallel",
        buggy:
          "const sleep = (ms) => new Promise(r => setTimeout(r, ms));\nconst t = Date.now();\nawait sleep(80);\nawait sleep(80);\nconsole.log('fast enough:', Date.now() - t < 130);\n",
        expected: "fast enough: true",
        hints: [
          "The two sleeps don't depend on each other, but the second doesn't start until the first has finished.",
          "Start both timers first, then wait for both together.",
          "`await Promise.all([sleep(80), sleep(80)]);`",
        ],
        solution:
          "const sleep = (ms) => new Promise(r => setTimeout(r, ms));\nconst t = Date.now();\nawait Promise.all([sleep(80), sleep(80)]);\nconsole.log('fast enough:', Date.now() - t < 130);\n",
        solutionWhy:
          "Both `sleep(80)` calls run as the array is built, so both timers start at essentially the same moment. `Promise.all` then waits for the slower of the two — about 80ms rather than 160ms.\n\nThe general shape to remember: **call everything, collect the promises, await once.**",
      },
      {
        kind: "write",
        id: "w1",
        title: "Retry once on failure",
        prompt:
          "Write `withRetry(fn)` that awaits fn(); if it throws, it calls fn() one more time and returns that result. `unstable` throws the first time and returns 'ok' the second. Log the result. Expected: ok",
        starter:
          "let tries = 0;\nfunction unstable() {\n  tries++;\n  if (tries === 1) throw new Error('fail');\n  return 'ok';\n}\n\nasync function withRetry(fn) {\n  // try once, and on failure try once more\n}\n\nconsole.log(await withRetry(unstable));\n",
        expected: "ok",
        hints: [
          "A rejected or throwing call inside an async function can be caught with an ordinary try/catch.",
          "In the try block, `return await fn();`.",
          "In the catch block, just `return await fn();` again — the second attempt is the retry.",
        ],
        solution:
          "let tries = 0;\nfunction unstable() {\n  tries++;\n  if (tries === 1) throw new Error('fail');\n  return 'ok';\n}\n\nasync function withRetry(fn) {\n  try {\n    return await fn();\n  } catch (e) {\n    return await fn();\n  }\n}\n\nconsole.log(await withRetry(unstable));\n",
        solutionWhy:
          "`await` inside `try` means the same code handles a synchronous throw and a rejected promise — that uniformity is a big part of why await beat `.then` in everyday use.\n\nReal-world retries add two things: a **loop** with a maximum attempt count, and a **delay between attempts** that grows each time (exponential backoff), so a struggling server isn't hammered. And you should only retry errors that might succeed next time — retrying a 404 is pointless.",
      },
    ],
  },

  {
    id: "js.16.iterators",
    track: "javascript",
    index: 16,
    title: "Iterators & generators",
    summary: "How for...of actually works, and how to produce values lazily with function*.",
    concepts: ["js:iterator", "js:generator", "js:yield"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "What makes something loopable",
        body:
          "`for...of` works on arrays, strings, Maps and Sets — but not on plain objects. That isn't arbitrary. There's a rule:\n\n> An object can be used with `for...of` if it has a method under the key `Symbol.iterator`.\n\nThat method returns an **iterator**: an object with a `.next()` method that hands back `{ value, done }` each time it's called. `for...of` just calls `.next()` over and over until `done` is true.\n\nEverything built on iteration uses the same protocol — `for...of`, spread `[...x]`, destructuring, `Array.from`, `Promise.all`'s argument. Make something iterable and it works with all of them at once.\n\nYou can implement `[Symbol.iterator]()` by hand, and it's worth seeing once so the magic goes away. But you almost never should, because **generators** do it for you.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Generators: functions that pause",
        body:
          "A generator is a function written `function*` that can **stop in the middle and resume later**. Instead of `return` (once, then done) it uses `yield` (as many times as it likes):\n\n```\nfunction* nums() {\n  yield 1;\n  yield 2;\n  yield 3;\n}\n\nfor (const n of nums()) console.log(n);   // 1, 2, 3\n```\n\nCalling `nums()` does **not** run the body. It hands back a generator object, and the body only advances when something asks for the next value. Each `yield` pauses it exactly where it stands, local variables intact, until the next request.\n\nThat laziness is the point. It means you can describe an **infinite** sequence and take only what you need:\n\n```\nfunction* naturals() {\n  let n = 0;\n  while (true) yield n++;    // never terminates — and that's fine\n}\n```\n\nNothing hangs, because nothing runs until someone asks. Two practical consequences: you can process a huge file or stream one chunk at a time without loading it all into memory, and you can express \"the sequence of all X\" without committing to a length.\n\nGenerator objects are also iterable, so `[...nums()]` and `for...of` work on them directly. If you know Python: this is the same idea, with `function*` in place of the implicit generator function and `yield` behaving identically.",
      },
      {
        kind: "trace",
        id: "t1",
        title: "Watch a generator pause and resume",
        intro: "The surprise here is line 6 — calling a generator runs none of its body.",
        code:
          "function* counter() {\n  console.log('  starting');\n  yield 1;\n  console.log('  woke up');\n  yield 2;\n  console.log('  finishing');\n}\nconst it = counter();\nconsole.log('first:', it.next());\nconsole.log('second:', it.next());\nconsole.log('third:', it.next());\n",
        lines: [
          {
            code: "const it = counter();",
            what: "Creates the generator object. NOTHING inside the body has run — 'starting' has not printed.",
            state: "it = a paused generator, sitting before line 1 of the body",
          },
          {
            code: "console.log('first:', it.next());",
            what: "The first .next() runs the body until it hits a yield. So 'starting' prints, then it pauses at `yield 1` and reports the value.",
            state: "paused at `yield 1`",
            output: "  starting\nfirst: { value: 1, done: false }",
          },
          {
            code: "console.log('second:', it.next());",
            what: "Resumes exactly where it stopped: prints 'woke up', then pauses at `yield 2`.",
            state: "paused at `yield 2`",
            output: "  woke up\nsecond: { value: 2, done: false }",
          },
          {
            code: "console.log('third:', it.next());",
            what: "Resumes again, prints 'finishing', reaches the end of the body with no more yields — so done is true and value is undefined.",
            state: "exhausted",
            output: "  finishing\nthird: { value: undefined, done: true }",
          },
        ],
        takeaway:
          "The body advances only when asked, one `yield` at a time, keeping its local state in between. `for...of` is just this loop written for you — it calls `.next()` until `done` is true and hands you each `value`.",
      },
      {
        kind: "example",
        id: "e1",
        title: "An infinite sequence, taken finitely",
        code:
          "function* fib() {\n"
          + "  let [a, b] = [0, 1];\n"
          + "  while (true) {\n"
          + "    yield a;\n"
          + "    [a, b] = [b, a + b];\n"
          + "  }\n"
          + "}\n"
          + "\n"
          + "const it = fib();\n"
          + "const first10 = Array.from({ length: 10 }, () => it.next().value);\n"
          + "console.log(first10);\n"
          + "\n"
          + "// Making your own object work with for...of:\n"
          + "const deck = {\n"
          + "  suits: ['clubs', 'hearts'],\n"
          + "  *[Symbol.iterator]() {\n"
          + "    for (const s of this.suits) {\n"
          + "      yield `A of ${s}`;\n"
          + "    }\n"
          + "  },\n"
          + "};\n"
          + "console.log([...deck]);\n",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "Generator gotchas",
        items: [
          {
            wrong: "function* g() { yield 1; yield 2; }\nconst it = g();\nconsole.log([...it]);\nconsole.log([...it]);",
            problem:
              "Logs [ 1, 2 ] then []. An iterator is consumed once and cannot rewind. If you need to iterate twice, either store the values in an array or call g() again for a fresh generator.",
            right: "function* g() { yield 1; yield 2; }\nconsole.log([...g()]);\nconsole.log([...g()]);",
          },
          {
            wrong: "function* naturals() { let n = 0; while (true) yield n++; }\nconsole.log([...naturals()]);",
            problem:
              "Hangs forever. Spread asks for EVERY value, and this sequence has no end. Laziness only helps if the consumer is lazy too — take a bounded slice instead.",
            right: "function* take(it, n) {\n  let i = 0;\n  for (const v of it) {\n    if (i++ >= n) return;\n    yield v;\n  }\n}\nconsole.log([...take(naturals(), 5)]);",
          },
          {
            wrong: "const obj = { a: 1, b: 2 };\nfor (const v of obj) console.log(v);",
            problem:
              "TypeError: obj is not iterable. Plain objects have no Symbol.iterator. Use for...in for keys, or — better — Object.keys / Object.values / Object.entries, which give you a real array.",
            right: "const obj = { a: 1, b: 2 };\nfor (const [k, v] of Object.entries(obj)) console.log(k, v);",
          },
        ],
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "function* evens(n) {\n  for (let i = 0; i < n; i++) {\n    if (i % 2 === 0) yield i;\n  }\n}\nconsole.log([...evens(6)]);\n",
        answer: "[ 0, 2, 4 ]",
        hints: [
          "The loop runs i from 0 up to but not including 6.",
          "Only the values passing the `i % 2 === 0` test get yielded — the others are skipped silently.",
        ],
        why:
          "Spread drains the generator, collecting every yielded value. i takes 0,1,2,3,4,5 and only the even ones are yielded, so 5 never appears and neither does 6 (the loop stops before it).",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: it isn't a generator",
        buggy:
          "function countdown(n) {\n  while (n > 0) {\n    yield n--;\n  }\n}\nconsole.log([...countdown(3)]);\n",
        expected: "[ 3, 2, 1 ]",
        hints: [
          "Read the error carefully — it complains about `yield`, not about the loop.",
          "`yield` is only legal in one kind of function.",
          "Add the star: `function* countdown(n)`.",
        ],
        solution:
          "function* countdown(n) {\n  while (n > 0) {\n    yield n--;\n  }\n}\nconsole.log([...countdown(3)]);\n",
        solutionWhy:
          "Without the `*`, `yield` isn't a keyword at all and the parser rejects the code. The star is what makes the function pausable.\n\n`n--` returns the value BEFORE decrementing, which is why the first yield is 3 and not 2.",
      },
      {
        kind: "write",
        id: "w1",
        title: "A range generator",
        prompt:
          "Write `function* range(start, stop, step = 1)` yielding start, start+step, … while below stop. Log [...range(1, 10, 2)]. Expected: [ 1, 3, 5, 7, 9 ]",
        starter:
          "function* range(start, stop, step = 1) {\n  // ...\n}\nconsole.log([...range(1, 10, 2)]);\n",
        expected: "[ 1, 3, 5, 7, 9 ]",
        hints: [
          "A plain for-loop is all you need: start at `start`, keep going while below `stop`, add `step` each pass.",
          "Inside the loop, `yield i;` instead of pushing to an array.",
          "`for (let i = start; i < stop; i += step) yield i;`",
        ],
        solution:
          "function* range(start, stop, step = 1) {\n  for (let i = start; i < stop; i += step) {\n    yield i;\n  }\n}\nconsole.log([...range(1, 10, 2)]);\n",
        solutionWhy:
          "This is Python's `range` in four lines, and it shows the appeal of generators: no array is built, values appear as they're asked for, and `range(1, 1e9)` costs nothing until you actually consume it.\n\nThe `stop` is exclusive, which is why 9 is the last value — 11 would be past it.",
      },
    ],
  },

  {
    id: "js.17.errors",
    track: "javascript",
    index: 17,
    title: "Errors & try/catch",
    summary: "Throwing well, catching narrowly, and never swallowing a failure silently.",
    concepts: ["js:error", "js:try-catch", "js:cause"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "try / catch / finally",
        body:
          "When something goes wrong, a function can **throw**. The throw travels up through every caller until something catches it — or, if nothing does, it crashes the program.\n\n```\ntry {\n  const data = JSON.parse(text);   // might throw\n  console.log(data.name);\n} catch (err) {\n  console.log('bad JSON:', err.message);\n} finally {\n  hideSpinner();                   // runs either way\n}\n```\n\n- **`try`** — the risky code. The moment something throws, the rest of the block is abandoned.\n- **`catch (err)`** — receives whatever was thrown.\n- **`finally`** — runs whether or not there was an error, and even if the try block returned. It's for cleanup.\n\nA rule that matters more than it sounds: **keep the try block small.** Wrapping fifty lines means an error anywhere in them lands in the same handler and you can't tell what actually failed. Wrap the one call that can fail.\n\nAnd `catch` is optional if you only want cleanup — `try { } finally { }` is valid.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Throw Error objects, and keep the cause",
        body:
          "You can technically throw anything — `throw 'oops'` is legal. **Don't.** A string has no stack trace, no name, and breaks every tool that expects an Error. Always throw an Error or a subclass:\n\n```\nthrow new Error('user not found');\nthrow new TypeError('expected a number');\nthrow new RangeError('must be 1-100');\n```\n\nThe built-in types (`TypeError`, `RangeError`, `SyntaxError`, …) all extend `Error`, so you can catch broadly and narrow with `instanceof`:\n\n```\ncatch (e) {\n  if (e instanceof RangeError) retryWithSmallerInput();\n  else throw e;                 // not mine — pass it up\n}\n```\n\nThat `else throw e` is important. **Only catch errors you can actually do something about**, and re-throw the rest. A catch block that swallows everything hides real bugs.\n\nWhen you wrap a low-level error in a more meaningful one, don't lose the original — ES2022 added `cause` for exactly this:\n\n```\ntry {\n  await db.query(sql);\n} catch (e) {\n  throw new Error('could not load user profile', { cause: e });\n}\n```\n\nThe caller sees a message that makes sense at their level, and `e.cause` still holds the connection error underneath. You can also define your own type when callers need to distinguish it:\n\n```\nclass ValidationError extends Error {\n  constructor(field) {\n    super(`invalid ${field}`);\n    this.name = 'ValidationError';\n    this.field = field;\n  }\n}\n```",
      },
      {
        kind: "trace",
        id: "t1",
        title: "Follow the control flow",
        intro: "Watch which lines get skipped, and note exactly when `finally` fires.",
        code:
          "function risky(n) {\n  try {\n    console.log('  trying', n);\n    if (n < 0) throw new RangeError('negative');\n    return 'ok';\n  } catch (e) {\n    console.log('  caught:', e.name);\n    return 'recovered';\n  } finally {\n    console.log('  cleanup');\n  }\n}\nconsole.log(risky(1));\nconsole.log(risky(-1));\n",
        lines: [
          {
            code: "console.log(risky(1));",
            what: "First call, with a value that won't trigger the throw.",
            output: "  trying 1",
          },
          {
            code: "    return 'ok';",
            what: "The try block succeeds and returns. The catch block is skipped entirely — but finally still has to run before the function actually leaves.",
            state: "return value 'ok' held, finally pending",
            output: "  cleanup\nok",
          },
          {
            code: "console.log(risky(-1));",
            what: "Second call, this time with -1.",
            output: "  trying -1",
          },
          {
            code: "    if (n < 0) throw new RangeError('negative');",
            what: "Throws. Everything after it in the try block — including the return — is abandoned immediately.",
            state: "a RangeError is in flight",
          },
          {
            code: "    console.log('  caught:', e.name);",
            what: "The catch block receives the error. `e.name` is 'RangeError' because that's the class that was thrown.",
            output: "  caught: RangeError",
          },
          {
            code: "    return 'recovered';",
            what: "Catch returns a fallback, so the caller never sees the error — it was genuinely handled. Then finally runs on the way out.",
            output: "  cleanup\nrecovered",
          },
        ],
        takeaway:
          "`finally` runs on every exit path — success, error, even a `return` inside try. And once something throws, the rest of the try block never runs, which is why you want the try block to be short.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Wrapping an error without losing it",
        code:
          "class ValidationError extends Error {\n"
          + "  constructor(field) {\n"
          + "    super(`invalid ${field}`);\n"
          + "    this.name = 'ValidationError';\n"
          + "    this.field = field;\n"
          + "  }\n"
          + "}\n"
          + "\n"
          + "function parseAge(s) {\n"
          + "  try {\n"
          + "    const n = Number(s);\n"
          + "    if (!Number.isFinite(n)) throw new ValidationError('age');\n"
          + "    return n;\n"
          + "  } catch (e) {\n"
          + "    throw new Error(`could not read age from ${JSON.stringify(s)}`, { cause: e });\n"
          + "  }\n"
          + "}\n"
          + "\n"
          + "try {\n"
          + "  parseAge('nope');\n"
          + "} catch (e) {\n"
          + "  console.log('outer :', e.message);\n"
          + "  console.log('cause :', e.cause.name, '-', e.cause.message);\n"
          + "  console.log('field :', e.cause.field);\n"
          + "  console.log('still an Error?', e.cause instanceof Error);\n"
          + "}\n",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "Error-handling mistakes",
        items: [
          {
            wrong: "try {\n  doWork();\n} catch (e) {\n  // ignore\n}",
            problem:
              "The empty catch. It converts a loud failure into a silent wrong answer — the program carries on with missing data and breaks somewhere unrelated an hour later. If you truly want to ignore an error, log it and write a comment saying why.",
            right: "try {\n  doWork();\n} catch (e) {\n  console.warn('doWork failed, using defaults:', e.message);\n}",
          },
          {
            wrong: "throw 'user not found';",
            problem:
              "Throwing a string. There's no stack trace, no `.message`, and `e instanceof Error` is false — so any handler written normally will mishandle it. Always throw an Error.",
            right: "throw new Error('user not found');",
          },
          {
            wrong: "try {\n  const user = await getUser(id);\n  const orders = await getOrders(user.id);\n  render(user, orders);\n  track('page_view');\n} catch (e) {\n  console.log('something failed');\n}",
            problem:
              "The try block is too big. An error in render or analytics is reported as if the data fetch failed, and you can't tell the difference from the log. Wrap only what can fail in a way you intend to handle.",
            right: "let user, orders;\ntry {\n  [user, orders] = await loadData(id);\n} catch (e) {\n  showError(e);\n  return;\n}\nrender(user, orders);\ntrack('page_view');",
          },
          {
            wrong: "function f() {\n  try {\n    return 'from try';\n  } finally {\n    return 'from finally';\n  }\n}",
            problem:
              "Returns 'from finally'. A return inside finally overrides the one from try — and would also swallow an in-flight exception. Never return (or throw) from a finally block; keep it to cleanup only.",
            right: "function f() {\n  try {\n    return 'from try';\n  } finally {\n    cleanup();\n  }\n}",
          },
        ],
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "try {\n  throw new TypeError('t');\n} catch (e) {\n  console.log(e instanceof Error, e instanceof TypeError, e instanceof RangeError);\n}\n",
        answer: "true true false",
        hints: [
          "TypeError is a subclass of Error — so what does `instanceof Error` say about it?",
          "RangeError is a SIBLING of TypeError, not an ancestor.",
        ],
        why:
          "`instanceof` walks up the inheritance chain. A TypeError is a TypeError and also an Error, but it is not a RangeError — they're separate branches. This is why `catch (e) { if (e instanceof X) }` lets you handle specific failures while letting others through.",
      },
      {
        kind: "cloze",
        id: "cz1",
        title: "Complete the handler",
        prompt: "Fill in the keywords for a handler that narrows, re-throws what it can't handle, and always cleans up.",
        template:
          "try {\n  save(record);\n} {{0}} (e) {\n  if (e {{1}} ValidationError) {\n    showFieldError(e.field);\n  } else {\n    {{2}} e;                 // not ours — let it bubble up\n  }\n} {{3}} {\n  hideSpinner();\n}\n",
        blanks: [
          { answer: "catch", width: 7 },
          { answer: "instanceof", width: 12 },
          { answer: "throw", width: 7 },
          { answer: "finally", width: 9 },
        ],
        explanation:
          "`catch` receives the error, `instanceof` narrows it to the one type this code knows how to handle, `throw e` passes anything else up to a caller that might, and `finally` cleans up on every path.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Safe JSON parse",
        prompt:
          "Write `safeParse(s)` that returns the parsed value, or the string 'invalid' if parsing fails. Log `safeParse('{\"a\":1}').a` and then `safeParse('nope')`. Expected two lines: 1 and invalid",
        starter:
          "function safeParse(s) {\n  // ...\n}\nconsole.log(safeParse('{\"a\":1}').a);\nconsole.log(safeParse('nope'));\n",
        expected: "1\ninvalid",
        hints: [
          "`JSON.parse` throws a SyntaxError on bad input — that's the thing to wrap.",
          "Put `return JSON.parse(s);` inside try.",
          "In the catch block, `return 'invalid';`.",
        ],
        solution:
          "function safeParse(s) {\n  try {\n    return JSON.parse(s);\n  } catch (e) {\n    return 'invalid';\n  }\n}\nconsole.log(safeParse('{\"a\":1}').a);\nconsole.log(safeParse('nope'));\n",
        solutionWhy:
          "The try block holds exactly one line — the only line that can fail. That's the discipline worth keeping.\n\nOne design note: returning a plain string as the error signal is fine for an exercise but poor for real code, because a caller can't tell a failure from a successfully parsed string. Real versions return `null`, a default value, or an object like `{ ok: false, error }`.",
      },
    ],
  },

  {
    id: "js.18.maps-sets",
    track: "javascript",
    index: 18,
    title: "Maps, Sets & structuredClone",
    summary: "The right collection for the job, and how to copy things properly.",
    concepts: ["js:map", "js:set", "js:structuredclone"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Set: a bag with no duplicates",
        body:
          "A `Set` holds values, each at most once. Add the same thing twice and the second add does nothing.\n\n```\nconst s = new Set([1, 2, 2, 3]);\ns.add(3);\nconsole.log(s.size);        // 3 — not 5\nconsole.log(s.has(2));      // true\ns.delete(1);\nconsole.log([...s]);        // [ 2, 3 ] — spread turns it back into an array\n```\n\nTwo reasons to reach for one:\n\n**Deduplicating.** `[...new Set(arr)]` is the shortest correct way to remove duplicates from an array.\n\n**Membership tests.** `set.has(x)` is fast no matter how big the set is; `array.includes(x)` scans from the start. With thousands of items inside a loop, that's the difference between instant and sluggish.\n\nThe catch: uniqueness is by **identity**, not contents. Two objects that look the same are still two different objects, so a Set won't merge them.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Map: a dictionary that takes any key",
        body:
          "A plain object is already a key-value store, so why `Map`? Four concrete reasons:\n\n**1. Any key type.** Object keys are silently converted to strings — `obj[1]` and `obj['1']` are the same slot, and any object key becomes the useless string `'[object Object]'`. A Map key can be a number, an object, a function, anything, and stays itself.\n\n**2. A real size.** `map.size`. For an object you have to write `Object.keys(obj).length`.\n\n**3. No inherited surprises.** Objects come with keys like `constructor` and `toString` from their prototype, so a key you didn't set can appear to exist. A Map starts genuinely empty.\n\n**4. Built for iteration.** `for (const [k, v] of map)` in insertion order.\n\n```\nconst m = new Map();\nm.set('a', 1).set('b', 2);        // set returns the map, so it chains\nm.get('a');                       // 1\nm.has('z');                       // false\nm.delete('a');\nfor (const [k, v] of m) console.log(k, v);\n```\n\n**Rule of thumb:** use a plain object for a fixed set of known fields (a record — a user, a config). Use a Map when keys are data: arbitrary, added and removed at runtime, or not strings.\n\nThere's also `WeakMap`, whose keys don't stop the garbage collector reclaiming them — used for attaching private data to objects you don't own.",
      },
      {
        kind: "read",
        id: "r3",
        title: "Copying: shallow, JSON, and structuredClone",
        body:
          "Assignment doesn't copy an object — it copies the reference, so both names point at the same thing:\n\n```\nconst a = { n: 1 };\nconst b = a;\nb.n = 99;\nconsole.log(a.n);      // 99 — same object\n```\n\nThree ways to actually copy, in increasing power:\n\n**Spread — shallow.** `const b = { ...a }` copies the top level only. Nested objects are still shared, so `b.address.city = 'x'` also changes `a`. Fine for flat objects, a trap for nested ones.\n\n**`JSON.parse(JSON.stringify(a))` — deep, but lossy.** It's the old trick and it does copy all the way down, but it silently destroys anything JSON can't express: Dates become strings, `undefined` and functions vanish, Maps and Sets become `{}`, and circular references throw.\n\n**`structuredClone(a)` — deep and faithful.** Built into modern browsers and Node. Handles nested objects, Dates, Maps, Sets, typed arrays and circular references correctly. It can't clone functions or DOM nodes, and it drops prototypes (a cloned class instance comes back as a plain object).\n\nDefault to `structuredClone` for a genuine deep copy, and spread when you only need one level.",
      },
      {
        kind: "trace",
        id: "t1",
        title: "Shallow vs deep, on the same object",
        intro: "Two copies of one object, and only one of them is really independent.",
        code:
          "const original = { name: 'Sam', address: { city: 'Leeds' } };\nconst shallow = { ...original };\nconst deep = structuredClone(original);\nshallow.name = 'Alex';\nshallow.address.city = 'York';\ndeep.address.city = 'Bath';\nconsole.log(original.name, original.address.city);\nconsole.log(shallow.name, shallow.address.city);\nconsole.log(deep.name, deep.address.city);\n",
        lines: [
          {
            code: "const shallow = { ...original };",
            what: "Copies the top-level keys. `name` is a fresh string, but `address` is the very same nested object — the copy just points at it too.",
            state: "shallow.address IS original.address (one object, two references)",
          },
          {
            code: "const deep = structuredClone(original);",
            what: "Rebuilds the whole structure from scratch, including a brand-new nested address object.",
            state: "deep.address is a separate object",
          },
          {
            code: "shallow.name = 'Alex';",
            what: "Top level, so it only affects the copy. This is the part people test, see working, and assume the whole copy is safe.",
            state: "original.name = 'Sam', shallow.name = 'Alex'",
          },
          {
            code: "shallow.address.city = 'York';",
            what: "This reaches THROUGH the shared reference. It changes the one address object — which the original is still using.",
            state: "original.address.city = 'York' too",
          },
          {
            code: "deep.address.city = 'Bath';",
            what: "The deep clone has its own address, so nothing else is affected.",
            state: "only deep.address.city changed",
          },
          {
            code: "console.log(original.name, original.address.city);",
            what: "The original kept its name but lost its city to the shallow copy's edit.",
            output: "Sam York",
          },
          {
            code: "console.log(shallow.name, shallow.address.city);",
            what: "The shallow copy sees the shared city too — of course, it's the same object.",
            output: "Alex York",
          },
          {
            code: "console.log(deep.name, deep.address.city);",
            what: "Fully independent: it kept the original name and its own edited city.",
            output: "Sam Bath",
          },
        ],
        takeaway:
          "Spread copies one level deep. If your object has anything nested inside it and you intend to edit the copy, use `structuredClone` — otherwise you'll mutate the original by accident, and it'll show up as a bug far from this code.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Where Map beats an object",
        code:
          "const objKey = {};\n"
          + "const bad = {};\n"
          + "bad[objKey] = 'first';\n"
          + "bad[{ different: true }] = 'second';\n"
          + "console.log('object keys:', Object.keys(bad), '->', bad[objKey]);\n"
          + "\n"
          + "const good = new Map();\n"
          + "good.set(objKey, 'first');\n"
          + "good.set({ different: true }, 'second');\n"
          + "console.log('map size:', good.size, '->', good.get(objKey));\n"
          + "\n"
          + "console.log('numeric keys stay numeric:', new Map([[1, 'a']]).get(1));\n"
          + "console.log('but on an object:', ({ 1: 'a' })['1']);\n",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "Collection mistakes",
        items: [
          {
            wrong: "const seen = new Set();\nseen.add({ id: 1 });\nseen.add({ id: 1 });\nconsole.log(seen.size);",
            problem:
              "Logs 2. Sets compare by identity, and those are two different objects that merely look alike. To dedupe by contents, build a Set of the identifying VALUE (ids, or a JSON string) rather than the objects themselves.",
            right: "const seen = new Set();\nfor (const u of users) seen.add(u.id);\nconsole.log(seen.size);",
          },
          {
            wrong: "const m = new Map([['a', 1]]);\nconsole.log(m.length);\nconsole.log(m['a']);",
            problem:
              "Both are undefined. A Map has `.size`, not `.length`, and its entries are NOT properties — bracket access looks for a normal object property and finds nothing. Always use .get() and .set().",
            right: "const m = new Map([['a', 1]]);\nconsole.log(m.size);\nconsole.log(m.get('a'));",
          },
          {
            wrong: "const copy = { ...user };\ncopy.address.city = 'York';",
            problem:
              "Also changes user.address.city. Spread is shallow: the nested address object is shared between the two. Reach for structuredClone when anything is nested and you plan to edit it.",
            right: "const copy = structuredClone(user);\ncopy.address.city = 'York';",
          },
          {
            wrong: "const copy = JSON.parse(JSON.stringify(record));",
            problem:
              "Deep, but it quietly destroys data: Dates come back as strings, undefined and functions disappear entirely, Maps and Sets collapse to {}, and circular references throw. structuredClone handles all of these.",
            right: "const copy = structuredClone(record);",
          },
        ],
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "const s = new Set([1, 2, 2, 3, 3, 3]);\nconsole.log([...s], s.size);\n",
        answer: "[ 1, 2, 3 ] 3",
        hints: [
          "The constructor adds each item in turn — what happens on the repeats?",
          "Spread walks the Set in insertion order, which is the order each value was FIRST added.",
        ],
        why:
          "Duplicates are dropped as they're added, leaving 1, 2, 3. Spread converts back to an array in insertion order, and `.size` is the count. `[...new Set(arr)]` is the idiomatic dedupe for primitives.",
      },
      {
        kind: "cloze",
        id: "cz1",
        title: "Fill in the collection API",
        prompt: "These are the method names people mix up most. Fill them in.",
        template:
          "const m = new Map();\nm.{{0}}('a', 1);          // add or overwrite\nconsole.log(m.{{1}}('a'));  // read it back\nconsole.log(m.{{2}});       // how many entries\n\nconst s = new Set([1, 2]);\ns.{{3}}(3);               // add a value\nconsole.log(s.{{4}}(2));    // is it in there?\n",
        blanks: [
          { answer: "set", width: 6 },
          { answer: "get", width: 6 },
          { answer: "size", width: 6 },
          { answer: "add", width: 6 },
          { answer: "has", width: 6 },
        ],
        explanation:
          "A Map stores pairs, so it needs `set`/`get`. A Set stores single values, so it's `add`, and membership is `has` on both. Neither has `.length` — that's arrays and strings.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Dedupe by key",
        prompt:
          "Given users with a repeated id, log an array of unique users by id, keeping the FIRST occurrence of each. Expected: [ { id: 1, n: 'a' }, { id: 2, n: 'b' } ]",
        starter:
          "const users = [{ id: 1, n: 'a' }, { id: 2, n: 'b' }, { id: 1, n: 'c' }];\n// build the unique array and log it\n",
        expected: "[ { id: 1, n: 'a' }, { id: 2, n: 'b' } ]",
        hints: [
          "A Set of the objects won't work — they're distinct objects. Track the IDS you've already seen instead.",
          "`filter` is a good fit: keep an item only when its id isn't in the Set yet.",
          "Inside the filter callback: if `seen.has(u.id)` return false; otherwise `seen.add(u.id)` and return true.",
        ],
        solution:
          "const users = [{ id: 1, n: 'a' }, { id: 2, n: 'b' }, { id: 1, n: 'c' }];\nconst seen = new Set();\nconst unique = users.filter((u) => {\n  if (seen.has(u.id)) return false;\n  seen.add(u.id);\n  return true;\n});\nconsole.log(unique);\n",
        solutionWhy:
          "The Set remembers which ids have already been let through. Because `filter` walks in order, the first of each id wins and later duplicates are dropped.\n\nIf you wanted the LAST occurrence instead, a Map is neater: `[...new Map(users.map(u => [u.id, u])).values()]` — each `set` on an existing key overwrites, so the last one survives.",
      },
    ],
  },

  {
    id: "js.19.modules",
    track: "javascript",
    index: 19,
    title: "Modules (ESM)",
    summary: "Splitting code across files with import and export — the shape of every real project.",
    concepts: ["js:esm", "js:import-export", "js:top-level-await"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Every file is its own private world",
        body:
          "So far everything has lived in one place. Real projects don't: they're dozens or hundreds of files, and **each file is a module with its own private scope.** Nothing you declare in one file is visible in another unless you deliberately export it.\n\nThat's the whole system — one keyword to offer something, one to take it.\n\n```\n// math.js\nexport function add(a, b) { return a + b; }\nexport const PI = 3.14159;\n\nconst secret = 42;        // not exported — invisible to everyone else\n```\n\n```\n// main.js\nimport { add, PI } from './math.js';\nconsole.log(add(1, 2), PI);\n```\n\nThose are **named exports**: exported under their own names, imported inside braces, and the names must match. You can rename on the way in when they'd clash:\n\n```\nimport { add as addNumbers } from './math.js';\nimport * as math from './math.js';    // everything, as one namespace object\n```\n\nThere's also a **default export** — one per file, imported without braces and under whatever name you like:\n\n```\n// Button.js\nexport default function Button() { ... }\n\n// main.js\nimport Button from './Button.js';\nimport AnythingIWant from './Button.js';   // also legal, which is the problem\n```\n\n**Prefer named exports.** Because a default can be imported under any name, the same thing ends up called three different things across a codebase, and your editor can't autocomplete or rename it reliably. Default is conventional when a file exports exactly one obvious thing — a React component, a class — and that's the case to use it.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Practicalities that trip people up",
        body:
          "**Turning modules on.** In the browser: `<script type=\"module\" src=\"main.js\">`. In Node: add `\"type\": \"module\"` to package.json, or name the file `.mjs`. Without that, Node assumes the older CommonJS system (`require` / `module.exports`) — which is where most \"Cannot use import statement outside a module\" errors come from.\n\n**Paths need to be explicit.** `./math.js`, not `math`. A bare `math` means a package from `node_modules`. And in Node, the `.js` extension is required; bundlers are lenient about it, Node is not.\n\n**Imports are hoisted and run first.** Every import in a file is resolved and executed before any of that file's own code, regardless of where you wrote the import statement. Module code also runs **exactly once**, however many files import it — the result is cached and shared.\n\n**Imports are live bindings, not copies.** If the exporting module later changes an exported `let`, importers see the new value. This is different from a normal assignment, and it's why circular imports can produce `undefined` rather than an error — one module read a value before the other had finished setting it up.\n\n**Imports are read-only.** You can't assign to an imported binding; only the module that owns it can change it.\n\n**Top-level `await` is allowed** in modules — no need to wrap everything in an async function, which is why the exercises in this app can use `await` at the top level.\n\n**Dynamic import** loads a module at runtime and returns a promise, which is how code-splitting and lazy loading work:\n\n```\nconst { heavyThing } = await import('./heavy.js');\n```",
      },
      {
        kind: "example",
        id: "e1",
        title: "One file's worth of module surface",
        code:
          "// This is what math.js would contain. In a single-file sandbox we can\n"
          + "// only demonstrate the shapes, but these are the exact lines you'd write.\n"
          + "\n"
          + "// export function add(a, b) { return a + b; }\n"
          + "// export const PI = 3.14159;\n"
          + "// export default class Vector { }\n"
          + "\n"
          + "// And in the file importing it:\n"
          + "// import Vector, { add, PI as CIRCLE_PI } from './math.js';\n"
          + "// import * as math from './math.js';\n"
          + "\n"
          + "// The private-scope idea, shown with a block instead of a file:\n"
          + "const api = (() => {\n"
          + "  const secret = 42;                 // not exposed\n"
          + "  const add = (a, b) => a + b;\n"
          + "  return { add };                    // the 'exports'\n"
          + "})();\n"
          + "\n"
          + "console.log(api.add(1, 2));\n"
          + "console.log('secret leaked?', api.secret);\n",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "Module mistakes",
        items: [
          {
            wrong: "// math.js\nexport default function add(a, b) { return a + b; }\n\n// main.js\nimport { add } from './math.js';",
            problem:
              "`add` is undefined. Braces are for NAMED exports; a default export is imported without them. The mismatch doesn't error at import time — you just get undefined and a confusing crash later.",
            right: "import add from './math.js';",
          },
          {
            wrong: "import { helper } from './utils';",
            problem:
              "In Node ESM this throws ERR_MODULE_NOT_FOUND. Relative imports need the file extension — './utils.js'. Bundlers let you get away with it, which is exactly why it surprises you the first time you run the code under plain Node.",
            right: "import { helper } from './utils.js';",
          },
          {
            wrong: "const { readFile } = require('fs');\nimport path from 'path';",
            problem:
              "You can't mix the two systems in one file. `require` is CommonJS; `import` is ESM. Pick one — modern code should be ESM, using `import { readFile } from 'node:fs/promises'`.",
            right: "import { readFile } from 'node:fs/promises';\nimport path from 'node:path';",
          },
          {
            wrong: "// a.js\nimport { b } from './b.js';\nexport const a = b + 1;\n\n// b.js\nimport { a } from './a.js';\nexport const b = a + 1;",
            problem:
              "A circular import. One of the two will read the other's export before it has been initialised and get undefined — or a ReferenceError. The fix is structural: pull the shared piece into a third module that both import.",
            right: "// shared.js\nexport const base = 1;\n// a.js and b.js both import from './shared.js'",
          },
        ],
      },
      {
        kind: "cloze",
        id: "cz1",
        title: "Write the import/export lines",
        prompt: "Fill in the keywords for a small module and the file that uses it.",
        template:
          "// math.js\n{{0}} function add(a, b) { return a + b; }\n{{1}} default class Vector {}\n\n// main.js\n{{2}} Vector, { add } {{3}} './math.js';\nimport * {{4}} math from './math.js';\n",
        blanks: [
          { answer: "export", width: 8 },
          { answer: "export", width: 8 },
          { answer: "import", width: 8 },
          { answer: "from", width: 6 },
          { answer: "as", width: 4 },
        ],
        explanation:
          "`export` offers a binding to other files; `import ... from` takes it. The default comes first and outside the braces, named imports go inside them, and `import * as name` grabs everything under one namespace object.",
      },
      {
        kind: "categorize",
        id: "cat1",
        title: "Named or default?",
        prompt: "Which export style fits each file? Tap a file, then tap a bucket.",
        buckets: ["Named export", "Default export"],
        items: [
          {
            text: "utils.js — 12 small helper functions",
            bucket: 0,
            why: "Many things, each with a meaningful name. Named exports let importers take only what they need and keep the names consistent.",
          },
          {
            text: "Button.jsx — one React component",
            bucket: 1,
            why: "The file is the component. This is the conventional case for default, and every React codebase does it.",
          },
          {
            text: "constants.js — API_URL, MAX_RETRIES, TIMEOUT",
            bucket: 0,
            why: "Several unrelated values that must keep their exact names.",
          },
          {
            text: "config.js — one settings object the whole app reads",
            bucket: 1,
            why: "A single obvious thing per file. Named would work too — this one is a genuine style choice.",
          },
          {
            text: "validators.js — isEmail, isPhone, isPostcode",
            bucket: 0,
            why: "A toolbox. Named exports also let bundlers drop the ones you never import.",
          },
        ],
      },
      {
        kind: "mcq",
        id: "m1",
        title: "Which is the safer default?",
        prompt: "You're writing a small utility module that exposes one function today, and might expose more later.",
        options: [
          "export default function foo() {}",
          "export function foo() {}",
          "module.exports = { foo }",
          "globalThis.foo = function () {}",
        ],
        correctIndex: 1,
        optionFeedback: [
          "It works, but importers can rename it to anything, so the same function ends up called different things in different files — and adding a second export later means mixing styles.",
          "Correct. A named export keeps the name consistent everywhere, autocompletes and renames reliably, and adding more exports later needs no change to this line.",
          "That's CommonJS. It still exists in older Node code, but new code should use ESM — and you can't mix the two in one file.",
          "Putting things on the global object is what modules exist to avoid: name collisions, invisible dependencies, and nothing a tool can analyse.",
        ],
        why: "Named exports scale as the file grows and keep one name for one thing across the codebase.",
      },
      {
        kind: "explain",
        id: "x1",
        title: "Explain",
        prompt:
          "In your own words: what's the practical difference between a named import and a default import, and when would you actually pick default?",
        minWords: 20,
        sampleAnswer:
          "A named import has to use the exact name the module exported, and it goes in braces: `import { add } from './math.js'`. A default import has no braces and you can call it whatever you like, because the module only says \"here's the one main thing\" without a name.\n\nThe practical effect is consistency. With named exports, `add` is called `add` everywhere, so search, autocomplete and rename all work. With a default, three files can import the same thing under three names.\n\nI'd pick default when the file IS one thing — a React component, a single class — where the filename already tells you the name. For anything exporting more than one thing, named.",
      },
    ],
  },

  {
    id: "js.20.modern",
    track: "javascript",
    index: 20,
    title: "Modern JavaScript worth using today",
    summary: "The recent additions that remove boilerplate: groupBy, non-mutating array methods, .at, withResolvers.",
    concepts: ["js:groupby", "js:withresolvers", "js:at", "js:immutable-array"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Array methods that don't mutate",
        body:
          "`sort`, `reverse` and `splice` have always had a nasty property: **they change the array in place** and return it, so the original is destroyed. That's a constant source of bugs in code that shares data.\n\nES2023 added copying versions of all of them:\n\n```\nconst xs = [3, 1, 2];\nxs.toSorted()        // [1, 2, 3]  — xs unchanged\nxs.toReversed()      // [2, 1, 3]  — xs unchanged\nxs.with(0, 99)       // [99, 1, 2] — replace one index, copy the rest\nxs.toSpliced(1, 1)   // [3, 2]     — copying splice\n```\n\nUse these by default. The mutating originals are still there when you genuinely want in-place behaviour, but that should be the deliberate choice, not the accident.\n\nWhile you're here: **`sort` compares as strings unless you give it a comparator.** `[10, 9, 1].sort()` gives `[1, 10, 9]`, because '10' sorts before '9' alphabetically. Always pass `(a, b) => a - b` for numbers.\n\nAnd `.at(-1)` reads the last element, which `arr[-1]` cannot do — bracket access on a negative index looks for a property literally named '-1' and finds undefined.",
      },
      {
        kind: "read",
        id: "r2",
        title: "groupBy, withResolvers, and a few small ones",
        body:
          "**`Object.groupBy(items, fn)`** (ES2024) does the thing everyone used to write a reduce for: bucket a list by some key.\n\n```\nObject.groupBy([1, 2, 3, 4, 5], n => n % 2 ? 'odd' : 'even')\n// { odd: [1, 3, 5], even: [2, 4] }\n```\n\n`Map.groupBy` is the same, returning a Map, for when the keys aren't strings.\n\n**`Promise.withResolvers()`** (ES2024) hands you a promise together with its `resolve` and `reject` functions, so you can settle it from somewhere else without the awkward variable dance:\n\n```\nconst { promise, resolve, reject } = Promise.withResolvers();\nsocket.onmessage = (e) => resolve(e.data);\nconst first = await promise;\n```\n\n**Others worth knowing:**\n\n- `structuredClone(x)` — the deep copy from the last lesson.\n- `arr.findLast(fn)` / `arr.findLastIndex(fn)` — search from the end.\n- `??=`, `||=`, `&&=` — assign only if nullish / falsy / truthy: `config.retries ??= 3`.\n- `Object.hasOwn(obj, key)` — the safe replacement for `obj.hasOwnProperty(key)`.\n- `str.replaceAll(a, b)` — because `replace` with a plain string only does the first match.\n\nNone of these are essential. They're all removing three lines of fiddly code that you'd otherwise write by hand and occasionally get wrong.",
      },
      {
        kind: "example",
        id: "e1",
        title: "The lot, running",
        code:
          "const xs = [3, 1, 2];\n"
          + "console.log('toSorted:', xs.toSorted(), 'original still:', xs);\n"
          + "console.log('with(0,99):', xs.with(0, 99));\n"
          + "console.log('last:', xs.at(-1), 'and arr[-1] gives:', xs[-1]);\n"
          + "\n"
          + "console.log('string sort trap:', [10, 9, 1].sort());\n"
          + "console.log('with comparator:', [10, 9, 1].toSorted((a, b) => a - b));\n"
          + "\n"
          + "const people = [\n"
          + "  { name: 'Sam', dept: 'eng' },\n"
          + "  { name: 'Alex', dept: 'design' },\n"
          + "  { name: 'Jo', dept: 'eng' },\n"
          + "];\n"
          + "console.log(Object.groupBy(people, (p) => p.dept));\n"
          + "\n"
          + "const config = { timeout: 0 };\n"
          + "config.retries ??= 3;\n"
          + "config.timeout ??= 30;\n"
          + "console.log('??= skips 0 because 0 is not nullish:', config);\n"
          + "\n"
          + "const { promise, resolve } = Promise.withResolvers();\n"
          + "setTimeout(() => resolve('settled from outside'), 5);\n"
          + "console.log(await promise);\n",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "Mistakes these features exist to prevent",
        items: [
          {
            wrong: "const scores = [10, 9, 1];\nconst best = scores.sort().at(-1);\nconsole.log(best, scores);",
            problem:
              "Two bugs at once. `sort` with no comparator sorts as text, so the order is [1, 10, 9] and `best` is 9. And `sort` mutated `scores` — the caller's array is now reordered. Pass a comparator and use toSorted.",
            right: "const scores = [10, 9, 1];\nconst best = scores.toSorted((a, b) => a - b).at(-1);\nconsole.log(best, scores);",
          },
          {
            wrong: "const last = arr[-1];",
            problem:
              "Always undefined. Negative indices are not a thing for bracket access — JavaScript looks for a property named '-1'. Use `.at(-1)`, or `arr[arr.length - 1]`.",
            right: "const last = arr.at(-1);",
          },
          {
            wrong: "config.retries = config.retries || 3;",
            problem:
              "Silently replaces a legitimate 0 with 3, because 0 is falsy. `??=` only assigns when the value is null or undefined, which is nearly always what you meant.",
            right: "config.retries ??= 3;",
          },
          {
            wrong: "console.log('a-b-c'.replace('-', '+'));",
            problem:
              "Logs 'a+b-c' — with a plain string, `replace` only changes the FIRST match. It's a genuinely surprising default. Use replaceAll.",
            right: "console.log('a-b-c'.replaceAll('-', '+'));",
          },
        ],
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "console.log([10, 9, 1].sort());\n",
        answer: "[ 1, 10, 9 ]",
        hints: [
          "`sort` with no arguments doesn't compare numbers as numbers.",
          "It converts each element to a string and compares those. How do '1', '10' and '9' order alphabetically?",
        ],
        why:
          "The default comparator stringifies, and '10' comes before '9' because '1' < '9' at the first character. This is the most notorious default in the language — always pass `(a, b) => a - b` for numbers.",
      },
      {
        kind: "cloze",
        id: "cz1",
        title: "Reach for the modern method",
        prompt: "Fill in the method or operator that does the job without mutating or repeating yourself.",
        template:
          "const xs = [3, 1, 2];\nconst sorted = xs.{{0}}((a, b) => a - b);   // sort a COPY\nconst last = xs.{{1}}(-1);                    // last element\nconst grouped = Object.{{2}}(people, p => p.dept);\nconfig.retries {{3}} 3;                       // only if null/undefined\nconst clean = 'a-b-c'.{{4}}('-', '+');        // every match\n",
        blanks: [
          { answer: "toSorted", width: 11 },
          { answer: "at", width: 5 },
          { answer: "groupBy", width: 10 },
          { answer: "??=", width: 5 },
          { answer: "replaceAll", width: 12 },
        ],
        explanation:
          "`toSorted` is the copying sort, `.at()` accepts negatives, `Object.groupBy` buckets a list by a key, `??=` assigns only when the current value is null or undefined, and `replaceAll` replaces every match instead of just the first.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: sorting destroyed the original",
        buggy:
          "const scores = [10, 9, 1];\nconst best = scores.sort().at(-1);\nconsole.log(best, scores);\n",
        expected: "10 [ 10, 9, 1 ]",
        hints: [
          "Two separate problems. First: why is `best` 9 rather than 10?",
          "`sort` with no comparator compares stringified values. Give it `(a, b) => a - b`.",
          "Second: `scores` came out reordered. Use `toSorted`, which returns a new array and leaves the original alone.",
        ],
        solution:
          "const scores = [10, 9, 1];\nconst best = scores.toSorted((a, b) => a - b).at(-1);\nconsole.log(best, scores);\n",
        solutionWhy:
          "The comparator fixes the ordering; `toSorted` fixes the mutation. Both matter — the mutation bug is the one that shows up far away from this line, when some other part of the program relied on the original order.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Group and count",
        prompt:
          "Group the items by their `cat` field with Object.groupBy and log the result. Expected: { a: [ { cat: 'a', v: 1 }, { cat: 'a', v: 3 } ], b: [ { cat: 'b', v: 2 } ] }",
        starter:
          "const items = [{ cat: 'a', v: 1 }, { cat: 'b', v: 2 }, { cat: 'a', v: 3 }];\n// console.log(...)\n",
        expected: "{ a: [ { cat: 'a', v: 1 }, { cat: 'a', v: 3 } ], b: [ { cat: 'b', v: 2 } ] }",
        hints: [
          "`Object.groupBy` takes the list first and a function second.",
          "The function receives one item and returns the key it should be filed under.",
          "`Object.groupBy(items, (i) => i.cat)`",
        ],
        solution:
          "const items = [{ cat: 'a', v: 1 }, { cat: 'b', v: 2 }, { cat: 'a', v: 3 }];\nconsole.log(Object.groupBy(items, (i) => i.cat));\n",
        solutionWhy:
          "One line replaces the reduce everyone used to write:\n\n```\nitems.reduce((acc, i) => {\n  (acc[i.cat] ||= []).push(i);\n  return acc;\n}, {});\n```\n\nBoth produce the same buckets, in first-seen key order, with each group in original order.\n\nThat's the last lesson of the JavaScript foundation track. You've covered the whole language surface you need for real work — from variables to closures, `this`, classes, promises, generators and modules. What's left is practice, and the projects and AI tracks are where that happens.",
      },
    ],
  },
];
