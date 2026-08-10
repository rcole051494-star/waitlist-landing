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
            code: "`${qty} items at $${price}`",
            what:
              "JavaScript walks the string left to right. Plain characters copy across untouched. At `${qty}` it looks up qty (3) and drops it in. ' items at $' copies across — note the first $ is an ordinary character, and the second one starts a `${`. Two dollar signs in a row look odd but they're doing different jobs.",
            state: "so far: '3 items at $4'",
          },
          {
            code: "${qty * price}",
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
    title: "Numbers, math & BigInt",
    summary: "Number is IEEE 754; use BigInt for arbitrary precision integers.",
    concepts: ["js:number", "js:bigint", "js:math"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "One numeric type… plus BigInt",
        body:
          "`Number` is a 64-bit float. `Number.MAX_SAFE_INTEGER` is 2**53 - 1.\n\nUse **BigInt** literals with `n`: `9007199254740993n`. BigInt and Number can't mix in arithmetic — convert explicitly.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Safe integer math",
        code:
          "console.log(2 ** 53);            // 9007199254740992\n" +
          "console.log(2 ** 53 + 1);        // 9007199254740992 (!)\n" +
          "console.log(2n ** 53n + 1n);     // 9007199254740993n\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "console.log(0.1 + 0.2 === 0.3);\n",
        answer: "false",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: compare floats within tolerance",
        buggy: "const a = 0.1 + 0.2, b = 0.3;\nconsole.log(a === b);\n",
        expected: "true",
        hint: "Compare `Math.abs(a - b) < 1e-9`.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Round to 2 decimals",
        prompt: "Given x = 2.71828, log a number rounded to 2 decimal places. Expected: 2.72",
        starter: "const x = 2.71828;\n// console.log(...)\n",
        expected: "2.72",
        hint: "Use Math.round(x * 100) / 100 or Number(x.toFixed(2)).",
      },
    ],
  },

  {
    id: "js.03.strings",
    track: "javascript",
    index: 3,
    title: "Strings",
    summary: "Immutability, common methods, .at() for negative indexing.",
    concepts: ["js:strings", "js:string-methods", "js:at"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Strings are immutable UTF-16",
        body:
          "Methods return new strings: `.toUpperCase()`, `.trim()`, `.includes()`, `.startsWith()`, `.replaceAll()`, `.split(sep)`, arrays' `.join(sep)`.\n\nModern: `.at(-1)` returns the last character.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Handy pieces",
        code:
          "const s = 'code forge';\nconsole.log(s.at(-1));                     // 'e'\nconsole.log(s.split(' ').reverse().join(' ')); // 'forge code'\nconsole.log(s.replaceAll('o', '0'));\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "console.log('abc'.padStart(6, '-'));\n",
        answer: "---abc",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: trim and capitalize input",
        buggy:
          "const raw = '   ada   ';\nconst clean = raw + '!';\nconsole.log(clean.toUpperCase());\n",
        expected: "ADA!",
        hint: "Call .trim() before concatenating.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Titlecase",
        prompt:
          "Given `s = 'hello world from js'`, log it with each word capitalized. Expected: Hello World From Js",
        starter: "const s = 'hello world from js';\n// console.log(...)\n",
        expected: "Hello World From Js",
      },
    ],
  },

  {
    id: "js.04.truthy",
    track: "javascript",
    index: 4,
    title: "Equality, truthiness & nullish",
    summary: "== vs ===, falsy values, `??` and `??=`.",
    concepts: ["js:equality", "js:truthy", "js:nullish"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Default to === always",
        body:
          "`==` performs type coercion (`0 == ''` is `true`). Use `===` for strict equality.\n\nFalsy: `false`, `0`, `0n`, `''`, `null`, `undefined`, `NaN`. Everything else is truthy — including empty arrays and objects.\n\n`??` returns the right side only if the left is `null` or `undefined` (unlike `||`, which triggers on any falsy).",
      },
      {
        kind: "example",
        id: "e1",
        title: "?? vs ||",
        code:
          "const count = 0;\nconsole.log(count || 10);   // 10  (0 is falsy)\nconsole.log(count ?? 10);   // 0   (0 is not nullish)\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "console.log([] == false, [] === false);\n",
        answer: "true false",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: default to 100 only when name is null/undefined",
        buggy:
          "function pageSize(opts) {\n  return opts.size || 100;\n}\nconsole.log(pageSize({ size: 0 }));\n",
        expected: "0",
        hint: "Use `??` instead of `||`.",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "Which comparison is idiomatic?",
        prompt: "Comparing a variable `x` to zero:",
        options: [
          "x == 0",
          "x === 0",
          "x == '0'",
          "!x",
        ],
        correctIndex: 1,
        why: "Use === to avoid coercion pitfalls.",
      },
    ],
  },

  {
    id: "js.05.control",
    track: "javascript",
    index: 5,
    title: "if / switch / loops",
    summary: "Conditionals, ternary, for/for-of/for-in, and break/continue.",
    concepts: ["js:if", "js:for", "js:for-of"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Prefer for-of for values",
        body:
          "`for (const x of xs)` iterates **values** of iterables (arrays, strings, Maps, Sets).\n\n`for (const k in obj)` iterates **enumerable keys** of an object — mostly useful for plain objects. Don't use it on arrays.\n\n`switch` falls through unless you `break` — always `break` (or `return`).",
      },
      {
        kind: "example",
        id: "e1",
        title: "for-of vs for-in",
        code:
          "const xs = ['a', 'b', 'c'];\nfor (const x of xs) console.log('of', x);\nfor (const k in xs) console.log('in', k);\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "let sum = 0;\nfor (let i = 1; i <= 5; i++) {\n  if (i === 3) continue;\n  sum += i;\n}\nconsole.log(sum);\n",
        answer: "12",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: switch keeps falling through",
        buggy:
          "function grade(n) {\n  switch (true) {\n    case n >= 90: return 'A';\n    case n >= 80: return 'B';\n    case n >= 70: return 'C';\n    default: 'F';\n  }\n}\nconsole.log(grade(60));\n",
        expected: "F",
        hint: "The default case needs `return`.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Even sum 1..100",
        prompt: "Log the sum of even numbers 1..100. Expected: 2550",
        starter: "// console.log(...)\n",
        expected: "2550",
      },
    ],
  },

  {
    id: "js.06.arrays",
    track: "javascript",
    index: 6,
    title: "Arrays",
    summary: "Ordered lists, common methods, and destructuring.",
    concepts: ["js:array", "js:array-methods", "js:destructuring"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Mutating vs non-mutating",
        body:
          "Mutating: `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`.\n\nNon-mutating (return new): `concat`, `slice`, `map`, `filter`, `flat`, `flatMap`, `toSorted`, `toReversed` (ES2023).\n\nUse `arr.at(-1)` for the last element.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Non-mutating sort (ES2023)",
        code:
          "const xs = [3, 1, 2];\nconst sorted = xs.toSorted();\nconsole.log(sorted, xs);   // xs unchanged\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "const [a, , c, ...rest] = [1, 2, 3, 4, 5];\nconsole.log(a, c, rest);\n",
        answer: "1 3 [ 4, 5 ]",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: sort numbers ascending",
        buggy: "const xs = [10, 2, 30, 4];\nconsole.log(xs.sort());\n",
        expected: "[ 2, 4, 10, 30 ]",
        hint: "sort() compares strings by default. Pass (a, b) => a - b.",
      },
      {
        kind: "write",
        id: "w1",
        title: "First 5 squares of odd numbers",
        prompt:
          "Log the array of the first 5 squares of odd numbers starting from 1. Expected: [ 1, 9, 25, 49, 81 ]",
        starter: "// console.log(...)\n",
        expected: "[ 1, 9, 25, 49, 81 ]",
      },
    ],
  },

  {
    id: "js.07.array-methods",
    track: "javascript",
    index: 7,
    title: "map / filter / reduce",
    summary: "The functional trio + when each is the right tool.",
    concepts: ["js:map", "js:filter", "js:reduce"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Choose the smallest tool",
        body:
          "- `map(fn)` when input length equals output length.\n- `filter(fn)` when you're keeping some, dropping others.\n- `reduce(fn, init)` when you're folding into a single value.\n\nPrefer clarity — chained `filter().map()` is easier to read than one clever `reduce`.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Total price of in-stock items",
        code:
          "const items = [\n  { name: 'a', price: 10, stock: 2 },\n  { name: 'b', price: 5,  stock: 0 },\n  { name: 'c', price: 8,  stock: 3 },\n];\nconst total = items\n  .filter(i => i.stock > 0)\n  .reduce((sum, i) => sum + i.price * i.stock, 0);\nconsole.log(total);\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "console.log([1,2,3,4].reduce((a, b) => a + b, 0));\n",
        answer: "10",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: doubled evens only",
        buggy:
          "const xs = [1,2,3,4,5,6];\nconsole.log(xs.map(x => x * 2).filter(x => x % 2 === 0));\n",
        expected: "[ 4, 8, 12 ]",
        hint: "Filter for evens **before** doubling.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Longest word",
        prompt:
          "Given `words = ['a','bbb','cc','dddd']`, log the longest word. Expected: dddd",
        starter: "const words = ['a','bbb','cc','dddd'];\n// console.log(...)\n",
        expected: "dddd",
      },
    ],
  },

  {
    id: "js.08.objects",
    track: "javascript",
    index: 8,
    title: "Objects & destructuring",
    summary: "Property shorthand, spread, computed keys, and nested destructuring.",
    concepts: ["js:object", "js:destructuring", "js:spread"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Modern object literals",
        body:
          "Shorthand: `{ x, y }` == `{ x: x, y: y }`.\nComputed keys: `{ [dynamicKey]: 1 }`.\nSpread: `{ ...a, ...b, override: 1 }` — later keys win.\nDestructure with rename + default: `const { a: alpha = 1 } = obj;`.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Nested destructuring with defaults",
        code:
          "const user = { name: 'Ren', profile: { theme: 'dark' } };\nconst { name, profile: { theme = 'light', font = 'sans' } } = user;\nconsole.log(name, theme, font);\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "const a = { x: 1, y: 2 };\nconst b = { ...a, y: 20 };\nconsole.log(b);\n",
        answer: "{ x: 1, y: 20 }",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: dynamic key",
        buggy:
          "const key = 'color';\nconst obj = { key: 'red' };\nconsole.log(obj.color);\n",
        expected: "red",
        hint: "Wrap the key in square brackets: `{ [key]: 'red' }`.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Merge with override",
        prompt:
          "Given defaults = {theme:'light', font:'sans', size:14} and user = {theme:'dark', size:16}, log the merged object where user overrides defaults. Expected: { theme: 'dark', font: 'sans', size: 16 }",
        starter:
          "const defaults = { theme: 'light', font: 'sans', size: 14 };\nconst user = { theme: 'dark', size: 16 };\n// console.log(...)\n",
        expected: "{ theme: 'dark', font: 'sans', size: 16 }",
      },
    ],
  },

  {
    id: "js.09.optional",
    track: "javascript",
    index: 9,
    title: "Optional chaining & safe access",
    summary: "`?.` for nested access, `?.()` for calls, and `?.[i]` for indexes.",
    concepts: ["js:optional-chain"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "?. short-circuits on null/undefined",
        body:
          "`user?.address?.street` returns `undefined` if any link is nullish, instead of throwing.\n\n`fn?.(arg)` calls only if fn is defined. `arr?.[i]` indexes only if arr is defined.\n\nDon't overuse: `a?.b?.c?.d?.e` often hides a bug — figure out whether nulls are expected there.",
      },
      {
        kind: "example",
        id: "e1",
        title: "With defaults",
        code:
          "const user = {};\nconsole.log(user?.address?.city ?? 'unknown');\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "const obj = { fn: null };\nconsole.log(obj?.fn?.());\n",
        answer: "undefined",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: safe access",
        buggy:
          "function firstTag(post) {\n  return post.tags[0];\n}\nconsole.log(firstTag({}));\n",
        expected: "undefined",
        hint: "Use `post?.tags?.[0]`.",
      },
    ],
  },

  {
    id: "js.10.functions",
    track: "javascript",
    index: 10,
    title: "Functions, arrows & defaults",
    summary: "Declarations, expressions, arrow functions, default and rest parameters.",
    concepts: ["js:functions", "js:arrow", "js:rest-params"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Three ways to define",
        body:
          "- `function foo() {}` — hoisted, has its own `this`.\n- `const foo = function () {}` — not hoisted.\n- `const foo = () => {}` — arrow: no own `this`, `arguments`, or `new`.\n\nDefault params: `function greet(name = 'world')`. Rest: `function sum(...nums)`.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Arrow, rest, default",
        code:
          "const greet = (name = 'world', ...extras) =>\n  `hi ${name}${extras.length ? ' + ' + extras.join(',') : ''}`;\nconsole.log(greet());\nconsole.log(greet('Ada', 'Ren', 'Kai'));\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "const f = (x, y = x * 2) => x + y;\nconsole.log(f(3));\nconsole.log(f(3, 10));\n",
        answer: "9\n13",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: arrow has no `arguments`",
        buggy:
          "const total = () => {\n  let sum = 0;\n  for (const n of arguments) sum += n;\n  return sum;\n};\nconsole.log(total(1,2,3));\n",
        expected: "6",
        hint: "Use rest params: `const total = (...nums) => nums.reduce((a,b) => a+b, 0);`",
      },
      {
        kind: "write",
        id: "w1",
        title: "clamp",
        prompt:
          "Write `clamp(x, lo, hi)` that returns x bounded to [lo, hi]. Log clamp(5, 0, 3) and clamp(-1, 0, 3) and clamp(2, 0, 3).",
        starter:
          "function clamp(x, lo, hi) {\n  // ...\n}\nconsole.log(clamp(5, 0, 3));\nconsole.log(clamp(-1, 0, 3));\nconsole.log(clamp(2, 0, 3));\n",
        expected: "3\n0\n2",
      },
    ],
  },

  {
    id: "js.11.closures",
    track: "javascript",
    index: 11,
    title: "Closures",
    summary: "Functions capture their surrounding scope. Use them for privacy and state.",
    concepts: ["js:closure", "js:scope"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "A closure is a function + its enclosing scope",
        body:
          "When you return a function from another function, it keeps access to the outer function's variables — even after the outer function returns.\n\nUsed for: private state, memoization, module patterns, event handlers with captured data.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Private counter",
        code:
          "function makeCounter() {\n  let n = 0;\n  return {\n    inc: () => ++n,\n    get: () => n,\n  };\n}\nconst c = makeCounter();\nc.inc(); c.inc(); c.inc();\nconsole.log(c.get());\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict (loop closure)",
        code:
          "const fns = [];\nfor (let i = 0; i < 3; i++) fns.push(() => i);\nconsole.log(fns.map(f => f()));\n",
        answer: "[ 0, 1, 2 ]",
        hint: "`let` gives each iteration its own `i`.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: var breaks the closure",
        buggy:
          "const fns = [];\nfor (var i = 0; i < 3; i++) fns.push(() => i);\nconsole.log(fns.map(f => f()));\n",
        expected: "[ 0, 1, 2 ]",
        hint: "Change `var` to `let` so each iteration has its own binding.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Memoize",
        prompt:
          "Write `memoize(fn)` that caches results by first argument. Test with `memo = memoize(x => x*x)`, then log memo(4) + memo(4) (should call fn once). Expected: 32",
        starter:
          "function memoize(fn) {\n  // ...\n}\nconst memo = memoize(x => x*x);\nconsole.log(memo(4) + memo(4));\n",
        expected: "32",
      },
    ],
  },

  {
    id: "js.12.this",
    track: "javascript",
    index: 12,
    title: "`this` in a nutshell",
    summary: "Rules of `this` for regular functions, arrows, methods, and constructors.",
    concepts: ["js:this", "js:binding"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "How this is set",
        body:
          "1. `obj.method()` — `this` is `obj`.\n2. `fn()` (standalone call) — `this` is undefined in strict/module code.\n3. Arrow functions **inherit** `this` from where they were defined.\n4. `new Cls()` — `this` is the newly created object.\n5. `fn.call(that, ...)`, `fn.apply(that, args)`, `fn.bind(that)` — explicit set.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Arrow vs method",
        code:
          "const obj = {\n  x: 10,\n  arrow: () => console.log('arrow', this?.x),   // this = undefined (module scope)\n  method() { console.log('method', this.x); },\n};\nobj.arrow();\nobj.method();\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "const obj = { x: 1, f() { return this.x; } };\nconst f = obj.f;\ntry { console.log(f()); } catch (e) { console.log('threw'); }\n",
        answer: "threw",
        hint: "Detached call — `this` is undefined, reading .x throws.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: bind or arrow",
        buggy:
          "class Timer {\n  constructor() { this.secs = 0; }\n  tick() { this.secs++; return this.secs; }\n}\nconst t = new Timer();\nconst tick = t.tick;\nconsole.log(tick());\n",
        expected: "1",
        hint: "Bind the method: `const tick = t.tick.bind(t);`",
      },
    ],
  },

  {
    id: "js.13.classes",
    track: "javascript",
    index: 13,
    title: "Classes",
    summary: "Modern class syntax with fields, static, private (#), and inheritance.",
    concepts: ["js:class", "js:private-fields", "js:static"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Class fields & privacy",
        body:
          "```\nclass Counter {\n  #n = 0;               // private field\n  static kind = 'basic';\n  inc() { this.#n++; }\n  get value() { return this.#n; }\n}\n```\n\n`#name` is hard-private — inaccessible outside the class. `static` fields/methods live on the class, not instances.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Inheritance",
        code:
          "class Shape {\n  constructor(name) { this.name = name; }\n  area() { return 0; }\n}\nclass Circle extends Shape {\n  constructor(r) { super('circle'); this.r = r; }\n  area() { return Math.PI * this.r ** 2; }\n}\nconst c = new Circle(2);\nconsole.log(c.name, c.area().toFixed(2));\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "class C {\n  static n = 0;\n  constructor() { C.n++; }\n}\nnew C(); new C(); new C();\nconsole.log(C.n);\n",
        answer: "3",
      },
      {
        kind: "write",
        id: "w1",
        title: "Stack class",
        prompt:
          "Write a Stack class with #items array, push(x), pop() (returns top), and size(). Push 1, 2, 3, pop once, log size(). Expected: 2",
        starter:
          "class Stack {\n  // ...\n}\nconst s = new Stack();\ns.push(1); s.push(2); s.push(3);\ns.pop();\nconsole.log(s.size());\n",
        expected: "2",
      },
    ],
  },

  {
    id: "js.14.promises",
    track: "javascript",
    index: 14,
    title: "Promises",
    summary: "The states of a Promise, chaining .then, error propagation.",
    concepts: ["js:promise", "js:chain"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Pending → fulfilled/rejected",
        body:
          "A promise starts **pending**, then either **fulfilled** with a value or **rejected** with an error.\n\n`.then(onOk, onErr)` returns a new promise. Errors propagate down the chain until caught by `.catch()`.\n\nStatic: `Promise.resolve(v)`, `Promise.reject(e)`, `Promise.all([...])`, `Promise.allSettled`, `Promise.race`, `Promise.any`.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Chain",
        code:
          "Promise.resolve(2)\n  .then(x => x + 1)\n  .then(x => x * 10)\n  .then(console.log);\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "Promise.resolve(1)\n  .then(x => { throw new Error('boom'); })\n  .then(x => console.log('never', x))\n  .catch(e => console.log('caught', e.message));\n",
        answer: "caught boom",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: forgot to return in .then",
        buggy:
          "Promise.resolve(1)\n  .then(x => { Promise.resolve(x + 1); })\n  .then(v => console.log('got', v));\n",
        expected: "got 2",
        hint: "Return the inner promise so the chain waits for it.",
      },
    ],
  },

  {
    id: "js.15.async",
    track: "javascript",
    index: 15,
    title: "async / await",
    summary: "Write asynchronous code that reads like synchronous. Errors via try/catch.",
    concepts: ["js:async", "js:await", "js:concurrency"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "async marks a function as returning a Promise",
        body:
          "Inside an `async` function, `await promise` pauses until the promise settles and returns its value (or throws its rejection).\n\nFor parallel work, `await Promise.all([a(), b()])`. To fire many, don't `await` inside the loop unless you want sequential behavior.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Sequential vs parallel",
        code:
          "const sleep = ms => new Promise(r => setTimeout(r, ms));\nasync function seq() {\n  const t = Date.now();\n  await sleep(100); await sleep(100);\n  console.log('seq ms ≈', Date.now() - t);\n}\nasync function par() {\n  const t = Date.now();\n  await Promise.all([sleep(100), sleep(100)]);\n  console.log('par ms ≈', Date.now() - t);\n}\nawait seq(); await par();\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "async function f() { return 1; }\nf().then(v => console.log('v =', v));\n",
        answer: "v = 1",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: parallelize",
        buggy:
          "const sleep = ms => new Promise(r => setTimeout(r, ms));\nasync function work() {\n  const t = Date.now();\n  await sleep(80);\n  await sleep(80);\n  console.log('elapsed ok:', Date.now() - t < 130);\n}\nawait work();\n",
        expected: "elapsed ok: true",
        hint: "Await Promise.all([sleep(80), sleep(80)]).",
      },
      {
        kind: "write",
        id: "w1",
        title: "Retry once on error",
        prompt:
          "Write `withRetry(fn)` that awaits fn(); if it throws, calls fn() once more. Use it with a fn that throws on first call and returns 'ok' on second. Log the result.",
        starter:
          "let tries = 0;\nfunction unstable() {\n  tries++;\n  if (tries === 1) throw new Error('fail');\n  return 'ok';\n}\nasync function withRetry(fn) {\n  // ...\n}\nconsole.log(await withRetry(unstable));\n",
        expected: "ok",
      },
    ],
  },

  {
    id: "js.16.iterators",
    track: "javascript",
    index: 16,
    title: "Iterators & generators",
    summary: "Symbol.iterator, function*, yield, and iteration protocols.",
    concepts: ["js:iterator", "js:generator", "js:yield"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Anything with [Symbol.iterator] is iterable",
        body:
          "Arrays, strings, Maps, Sets are all iterable. You can define your own by implementing `[Symbol.iterator]()` — but the easy way is a **generator**.\n\n```\nfunction* nums() { yield 1; yield 2; yield 3; }\nfor (const n of nums()) console.log(n);\n```",
      },
      {
        kind: "example",
        id: "e1",
        title: "Infinite generator, take the first N",
        code:
          "function* fib() {\n  let [a, b] = [0, 1];\n  while (true) { yield a; [a, b] = [b, a + b]; }\n}\nconst it = fib();\nconst first10 = Array.from({ length: 10 }, () => it.next().value);\nconsole.log(first10);\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "function* evens(n) { for (let i = 0; i < n; i++) if (i % 2 === 0) yield i; }\nconsole.log([...evens(6)]);\n",
        answer: "[ 0, 2, 4 ]",
      },
      {
        kind: "write",
        id: "w1",
        title: "Range generator",
        prompt:
          "Write `function* range(start, stop, step = 1)` that yields values start, start+step, ... < stop. Log [...range(1, 10, 2)]. Expected: [ 1, 3, 5, 7, 9 ]",
        starter:
          "function* range(start, stop, step = 1) {\n  // ...\n}\nconsole.log([...range(1, 10, 2)]);\n",
        expected: "[ 1, 3, 5, 7, 9 ]",
      },
    ],
  },

  {
    id: "js.17.errors",
    track: "javascript",
    index: 17,
    title: "Errors & try/catch",
    summary: "Throwing, catching, Error hierarchy, and the ES2022 `cause`.",
    concepts: ["js:error", "js:try-catch", "js:cause"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Throw Error instances, not strings",
        body:
          "```\nthrow new TypeError('expected number');\n```\n\nCatch specifically: `if (e instanceof TypeError) ...`.\n\nES2022 lets you preserve the original cause:\n\n```\ntry { ... }\ncatch (e) { throw new Error('wrap', { cause: e }); }\n```",
      },
      {
        kind: "example",
        id: "e1",
        title: "Error with cause",
        code:
          "function parseAge(s) {\n  try {\n    const n = Number(s);\n    if (!Number.isFinite(n)) throw new RangeError('not finite');\n    return n;\n  } catch (e) {\n    throw new Error(`bad age: ${s}`, { cause: e });\n  }\n}\ntry { parseAge('nope'); }\ncatch (e) { console.log(e.message, '->', e.cause.message); }\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "try { throw new TypeError('t'); }\ncatch (e) { console.log(e instanceof Error, e instanceof TypeError); }\n",
        answer: "true true",
      },
      {
        kind: "write",
        id: "w1",
        title: "Safe JSON.parse",
        prompt:
          "Write `safeParse(s)` that returns the parsed value or the string 'invalid' on error. Log safeParse('{\"a\":1}').a and safeParse('nope').",
        starter:
          "function safeParse(s) {\n  // ...\n}\nconsole.log(safeParse('{\"a\":1}').a);\nconsole.log(safeParse('nope'));\n",
        expected: "1\ninvalid",
      },
    ],
  },

  {
    id: "js.18.maps-sets",
    track: "javascript",
    index: 18,
    title: "Maps, Sets & structuredClone",
    summary: "When Map beats plain object, Set for uniqueness, deep-copy without JSON.",
    concepts: ["js:map", "js:set", "js:structuredclone"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Map vs Object",
        body:
          "`Map` allows any type as a key (including objects), preserves insertion order, and has a real `.size`. `Set` stores unique values.\n\n`structuredClone(value)` deep-clones almost anything (including Maps, Sets, Dates, TypedArrays). Better than `JSON.parse(JSON.stringify(...))` for anything non-plain.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Map basics",
        code:
          "const m = new Map();\nm.set('a', 1); m.set('b', 2);\nfor (const [k, v] of m) console.log(k, '=', v);\nconsole.log('has a?', m.has('a'), 'size:', m.size);\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "const s = new Set([1, 2, 2, 3, 3, 3]);\nconsole.log([...s], s.size);\n",
        answer: "[ 1, 2, 3 ] 3",
      },
      {
        kind: "write",
        id: "w1",
        title: "Dedupe by key",
        prompt:
          "Given users = [{id:1,n:'a'},{id:2,n:'b'},{id:1,n:'c'}], log an array of unique users by id, keeping the first occurrence. Expected: [ { id: 1, n: 'a' }, { id: 2, n: 'b' } ]",
        starter:
          "const users = [{id:1,n:'a'},{id:2,n:'b'},{id:1,n:'c'}];\n// build unique array by id and log\n",
        expected: "[ { id: 1, n: 'a' }, { id: 2, n: 'b' } ]",
        hint: "Track seen ids in a Set as you filter.",
      },
    ],
  },

  {
    id: "js.19.modules",
    track: "javascript",
    index: 19,
    title: "Modules (ESM)",
    summary: "import / export, default vs named, top-level await.",
    concepts: ["js:esm", "js:import-export", "js:top-level-await"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Named vs default",
        body:
          "```\n// util.js\nexport function add(a, b) { return a + b; }\nexport const PI = 3.14;\nexport default class Vector { ... }\n```\n\n```\nimport Vector, { add, PI } from './util.js';\n```\n\nImports are **live bindings** (not copies) and are **hoisted**. Top-level `await` is allowed in modules.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Dynamic import (returns a Promise)",
        code:
          "// Runtime, not top-level:\nconst mod = await import('data:text/javascript;charset=utf-8,export%20const%20x=42');\nconsole.log(mod.x);\n",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "Which is idiomatic?",
        prompt: "You want to expose one function from a small utility module.",
        options: [
          "export default function foo() {}",
          "export function foo() {}",
          "module.exports = { foo }",
          "window.foo = function () {}",
        ],
        correctIndex: 1,
        why: "Named exports scale better and are easier to refactor than defaults.",
      },
      {
        kind: "explain",
        id: "x1",
        title: "Explain",
        prompt:
          "What's the difference between a named import and a default import — and when would you pick default?",
        minWords: 20,
      },
    ],
  },

  {
    id: "js.20.modern",
    track: "javascript",
    index: 20,
    title: "Modern features: Object.groupBy, Promise.withResolvers, .at",
    summary: "Recent additions worth using today.",
    concepts: ["js:groupby", "js:withresolvers", "js:at"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Object.groupBy (ES2024)",
        body:
          "```\nconst xs = [1, 2, 3, 4, 5];\nObject.groupBy(xs, n => n % 2 ? 'odd' : 'even');\n// => { odd: [1, 3, 5], even: [2, 4] }\n```\n\nMap.groupBy exists too if you need non-string keys.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Promise.withResolvers (ES2024)",
        code:
          "const { promise, resolve } = Promise.withResolvers();\nsetTimeout(() => resolve('done'), 10);\nconsole.log(await promise);\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "const xs = [10, 20, 30];\nconsole.log(xs.at(-1), xs.at(-2));\n",
        answer: "30 20",
      },
      {
        kind: "write",
        id: "w1",
        title: "Group items by category",
        prompt:
          "Given items = [{cat:'a',v:1},{cat:'b',v:2},{cat:'a',v:3}], log Object.groupBy(items, i => i.cat).",
        starter:
          "const items = [{cat:'a',v:1},{cat:'b',v:2},{cat:'a',v:3}];\n// console.log(...)\n",
        expected:
          "{ a: [ { cat: 'a', v: 1 }, { cat: 'a', v: 3 } ], b: [ { cat: 'b', v: 2 } ] }",
      },
    ],
  },
];
