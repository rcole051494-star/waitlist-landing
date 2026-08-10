import type { Lesson } from "./types";

// Python 3.12+ curriculum. Every lesson mixes: read → example → predict → fix → write → explain/MCQ.
// Body text supports **bold**, `code`, and blank lines. Lists use "- ".

export const pythonLessons: Lesson[] = [
  {
    id: "py.01.variables",
    track: "python",
    index: 1,
    title: "Variables, types & f-strings",
    summary: "Bind names to values. Learn Python's core types and modern f-string formatting.",
    concepts: ["py:variables", "py:types:basic", "py:fstrings"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Names, not boxes",
        body:
          "You already used variables in the previous lesson — a name stuck to a value with `=`. One more detail worth knowing now: reassigning a name (`x = 7` then later `x = 'seven'`) doesn't change the old value, it just moves the sticky note to point at something new. The old value is simply forgotten.\n\nEvery value in Python has a **type** — what *kind* of thing it is. The core types you'll meet constantly: `int` (whole numbers), `float` (decimal numbers), `str` (text, short for 'string'), `bool` (True/False), plus a few container types you'll meet soon: `list`, `dict`, `set`, `tuple`, and `None` (meaning 'no value').\n\nUse `type(x)` to ask Python what type a value is, and `isinstance(x, int)` to check 'is this an int?' (True/False).",
      },
      {
        kind: "example",
        id: "e1",
        title: "Binding and rebinding",
        code:
          "x = 7          # an int\n" +
          "print(x, type(x).__name__)\n" +
          "x = 'seven'    # now a str — same name, different kind of value\n" +
          "print(x, type(x).__name__)\n",
        note:
          "`type(x)` asks Python what kind of value x holds. `.__name__` just trims the answer down to the bare word. Notice the same name held two different types over the program's life — Python allows that.",
      },
      {
        kind: "categorize",
        id: "cat1",
        title: "Which type is each value?",
        prompt:
          "Sort each value into the type Python would report for it. Watch out for the ones that look like one thing but aren't.",
        buckets: ["int (whole number)", "float (decimal)", "str (text)", "bool (True/False)"],
        items: [
          { text: "42", bucket: 0, why: "No decimal point and no quotes — a plain whole number." },
          { text: "42.0", bucket: 1, why: "The decimal point makes it a float, even though the value is a whole amount." },
          { text: "'42'", bucket: 2, why: "The quotes make it text. It looks like a number but you can't do maths on it." },
          { text: "True", bucket: 3, why: "A bool. Capital T, no quotes — Python's built-in true value." },
          { text: "'True'", bucket: 2, why: "Quoted, so it's just the five characters T-r-u-e as text, not the boolean." },
          { text: "-7", bucket: 0, why: "Negative numbers are still ints as long as there's no decimal point." },
        ],
      },
      {
        kind: "read",
        id: "r2",
        title: "f-strings: putting values inside text",
        body:
          "Constantly you'll want to build a sentence that has a value in the middle of it. The modern way is an **f-string**.\n\nPut an `f` immediately before the opening quote, and then anything inside `{curly braces}` gets *evaluated* and dropped into the text:\n\n```\nname = 'Ada'\nprint(f'hello {name}')     # hello Ada\n```\n\nWithout the `f`, the braces are just literal characters — `print('hello {name}')` prints `hello {name}`. The `f` is what switches the braces on.\n\nYou can put any expression inside the braces, not just a bare name:\n\n```\nprint(f'2 + 2 is {2 + 2}')        # 2 + 2 is 4\nprint(f'shouting: {name.upper()}') # shouting: ADA\n```",
      },
      {
        kind: "trace",
        id: "t1",
        title: "Watch an f-string get built",
        intro: "Python builds the finished string piece by piece. Here's what it's doing.",
        code: "price = 4\nqty = 3\nprint(f'{qty} items at ${price} = ${qty * price}')\n",
        lines: [
          {
            code: "price = 4",
            what: "Stick the value 4 onto the name price.",
            state: "price = 4",
          },
          {
            code: "qty = 3",
            what: "Stick the value 3 onto the name qty.",
            state: "price = 4, qty = 3",
          },
          {
            code: "f'{qty} items at ${price} = ${qty * price}'",
            what:
              "Python walks the string left to right. Plain characters copy across untouched. At the first {qty} it looks up qty (3) and drops it in. 'items at $' copies across — note that dollar sign is just an ordinary character, nothing special. At {price} it drops in 4.",
            state: "so far: '3 items at $4 = $'",
          },
          {
            code: "{qty * price}",
            what:
              "The last brace holds an expression rather than a plain name. Python works it out first — 3 times 4 is 12 — and drops the result in. The finished string is handed to print.",
            output: "3 items at $4 = $12",
          },
        ],
        takeaway:
          "Everything inside braces is evaluated then converted to text; everything outside is copied as-is. That's the whole rule.",
      },
      {
        kind: "read",
        id: "r3",
        title: "Format specs: controlling how a value looks",
        body:
          "After the value inside the braces you can add a colon and a **format spec** — instructions for how it should be displayed. This changes only the *display*, never the underlying value.\n\nThe one you'll use most is rounding a decimal:\n\n```\npi = 3.14159\nprint(f'{pi:.2f}')     # 3.14   — .2f means 2 decimal places\nprint(f'{pi:.0f}')     # 3      — 0 decimal places\nprint(pi)              # 3.14159 — pi itself never changed\n```\n\nRead `.2f` as \"2 digits after the point, as a **f**loat\".\n\nA few more worth knowing now:\n\n- `{n:,}` → thousands separators: `1000000` becomes `1,000,000`\n- `{name:>10}` → pad to 10 characters wide, aligned right\n- `{name:<10}` → same but aligned left\n\nAnd one purely for debugging — put `=` after the expression and Python prints the expression itself alongside its value:\n\n```\nscore = 92.5\nprint(f'{score=}')     # score=92.5\n```\n\nThat's a genuinely useful trick when you're trying to work out what a variable actually contains.",
      },
      {
        kind: "cloze",
        id: "cl1",
        title: "Fill in the f-string",
        prompt:
          "This should print exactly: Ada scored 91.5%  — fill in the three gaps.",
        template: "name = 'Ada'\nscore = 91.4567\nprint({{0}}'{name} scored {score:{{1}}}%')\n",
        blanks: [
          { answer: "f", width: 2 },
          { answer: ".1f", width: 4 },
        ],
        explanation:
          "The `f` before the quote is what turns the braces on. `.1f` rounds the *display* to one decimal place — 91.4567 shows as 91.5, while the variable itself is untouched. The `%` sits outside any braces, so it's printed as an ordinary character.",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "The classic f-string and type mistakes",
        items: [
          {
            wrong: "name = 'Ada'\nprint('hello {name}')",
            problem:
              "Prints the literal text `hello {name}`. Without the `f` before the opening quote, curly braces have no special meaning at all.",
            right: "name = 'Ada'\nprint(f'hello {name}')",
          },
          {
            wrong: "age = 30\nprint('I am ' + age)",
            problem:
              "TypeError: can only concatenate str (not \"int\") to str. The `+` between text and a number is ambiguous — Python refuses to guess whether you meant to add or to join. An f-string sidesteps the whole problem.",
            right: "age = 30\nprint(f'I am {age}')",
          },
          {
            wrong: "pi = 3.14159\nprint(f'{pi:2f}')",
            problem:
              "Prints 3.141590 — not what you wanted. You dropped the dot: `2f` means something different from `.2f`. The dot is part of the spec, and it's easy to miss.",
            right: "pi = 3.14159\nprint(f'{pi:.2f}')",
          },
        ],
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict the output",
        code: "n = 3\nprint(f'{n * n = }')\n",
        answer: "n * n = 9",
        hints: [
          "The `=` at the end of a brace is the debug form — it prints the expression text as well as the result.",
          "Python echoes the expression exactly as you wrote it (spaces and all), then ` = `, then the value. So you get the text `n * n`, then ` = `, then 9.",
        ],
        why:
          "The debug `=` reproduces your expression verbatim, then the computed value. Because you wrote spaces around the `*`, they appear in the output too.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: it should print 'Pi ≈ 3.14'",
        buggy: "pi = 3.14159\nprint('Pi ≈ ' + pi)\n",
        expected: "Pi ≈ 3.14",
        hints: [
          "Run it and read the error. It's a TypeError about combining a str and a float with `+`.",
          "You can't glue text and a number together with `+`. Use an f-string instead so the number gets converted for you.",
          "You also need to round 3.14159 down to two decimals for display — that's a format spec after a colon.",
        ],
        solution: "pi = 3.14159\nprint(f'Pi ≈ {pi:.2f}')\n",
        solutionWhy:
          "Two fixes in one: the f-string converts the number to text automatically (so no TypeError), and `:.2f` rounds the displayed value to two decimal places. The variable `pi` still holds the full 3.14159 — only the display changed.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Write it: greet a user by name and age",
        prompt: "Assign name='Ren' and age=30, then print exactly: Ren is 30 years old.",
        starter: "name = ''\nage = 0\n# print here\n",
        expected: "Ren is 30 years old.",
        hints: [
          "Start by putting the right values on those first two lines, replacing the empty placeholders.",
          "Use an f-string with two braces in it — one for the name, one for the age.",
          "Don't forget the full stop at the end. It goes inside the quotes, outside any braces.",
        ],
        solution: "name = 'Ren'\nage = 30\nprint(f'{name} is {age} years old.')\n",
        solutionWhy:
          "The two braces get replaced by the values; everything else — the spaces, the words 'is' and 'years old', and the final full stop — is ordinary text copied through as written.",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "Which is the cleanest way to format?",
        prompt: "You want to render x=0.333333 rounded to 2 decimals inside a sentence.",
        options: [
          "'x = ' + str(round(x, 2))",
          "f'x = {x:.2f}'",
          "'%s = %.2f' % ('x', x)",
          "print(x)",
        ],
        correctIndex: 1,
        optionFeedback: [
          "Works, but it's doing by hand what the language does for you — converting to str and rounding separately, then gluing with +. Harder to read at a glance.",
          "The idiomatic modern choice. The value and how to display it sit right where they appear in the sentence.",
          "This is %-formatting, the style Python used decades ago. You'll see it in old code, but it's no longer the recommended way to write new code.",
          "This just prints the raw number with no sentence and no rounding.",
        ],
        why: "f-strings with format specs are the current idiomatic choice — the value and its formatting live inline, where you can see them in context.",
      },
      {
        kind: "explain",
        id: "x1",
        title: "In your own words",
        prompt:
          "Why is `x = 5` then later `x = 'hello'` allowed in Python, when in a language like Java that would be an error? Use the sticky-note idea in your answer.",
        minWords: 20,
        sampleAnswer:
          "In Python the type belongs to the value, not to the name. A name is just a sticky note you can move onto anything — so moving it from the number 5 onto the text 'hello' is fine. In Java the name itself is declared to hold one specific type, so it's not allowed to point at a different kind of value later.",
      },
    ],
  },

  {
    id: "py.02.numbers",
    track: "python",
    index: 2,
    title: "Numbers & math",
    summary: "int, float, arithmetic operators, integer vs true division, and the math module.",
    concepts: ["py:numbers", "py:operators:arith", "py:math"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Two kinds of number",
        body:
          "Python splits numbers into two types:\n\n- **`int`** — whole numbers: `5`, `-200`, `0`\n- **`float`** — numbers with a decimal point: `3.14`, `-0.5`, `2.0`\n\nNote `2.0` is a float even though the value is whole. The decimal point is what decides it, not the value.\n\nOne genuinely lovely thing about Python: **ints have no size limit.** In most languages a whole number silently wraps around or overflows once it gets past a few billion. Python just keeps going — `2 ** 1000` works fine and gives you the exact answer, all 302 digits.\n\nFloats aren't like that. They trade exactness for range, which causes a surprise you'll meet later in this lesson.\n\nOne bit of syntax worth knowing now: you can put underscores in long numbers to make them readable. `1_000_000` is exactly the same value as `1000000` — Python ignores the underscores, they're purely for your eyes.",
      },
      {
        kind: "read",
        id: "r2",
        title: "The operators — and the two division signs",
        body:
          "The usual suspects work as you'd expect: `+` add, `-` subtract, `*` multiply.\n\nThen three that need a moment:\n\n**`/` — true division.** Always gives a float, *even when it divides evenly*. `6 / 2` is `3.0`, not `3`.\n\n**`//` — floor division.** Divides and throws away anything after the decimal point. `7 // 2` is `3`. Use it when you want a whole number of things — how many complete boxes, how many full pages.\n\n**`%` — modulo.** Gives the *remainder* after division. `7 % 2` is `1`. Enormously useful: `n % 2 == 0` tests for even, `n % 5 == 0` tests for a multiple of 5, and `seconds % 60` gives you the leftover seconds.\n\nAnd **`**` — power.** `2 ** 10` is 1024. Not `^` — that means something else entirely in Python.\n\nThink of `//` and `%` as a pair: they're the two halves of the answer to \"how many times does this go in, and what's left over?\"",
      },
      {
        kind: "example",
        id: "e1",
        title: "See them side by side",
        code:
          "print(7 / 2)     # true division -> float\n" +
          "print(7 // 2)    # floor division -> whole part\n" +
          "print(7 % 2)     # modulo -> remainder\n" +
          "print(2 ** 10)   # power\n" +
          "print(6 / 2)     # even division still gives a float\n" +
          "print(2 ** 200)  # ints have no size limit\n",
        note:
          "Try changing 7 and 2 to other numbers and re-running. Watch how // and % relate: 7 // 2 is 3 and 7 % 2 is 1, because 2 goes into 7 three times with 1 left over.",
      },
      {
        kind: "categorize",
        id: "cat1",
        title: "Which operator do you need?",
        prompt:
          "Sort each job into the operator that does it. These four come up constantly.",
        buckets: ["/  (true division)", "//  (floor division)", "%  (modulo)", "**  (power)"],
        items: [
          { text: "average of two numbers", bucket: 0, why: "You want the exact fractional answer, so true division." },
          { text: "how many whole boxes of 12", bucket: 1, why: "You want the whole count with the leftover discarded — floor division." },
          { text: "is this number even?", bucket: 2, why: "Check the remainder after dividing by 2: n % 2 == 0." },
          { text: "area of a square (side × side)", bucket: 3, why: "side ** 2 — squaring is raising to a power." },
          { text: "leftover seconds after whole minutes", bucket: 2, why: "seconds % 60 gives exactly the remainder." },
          { text: "split a bill exactly between 3 people", bucket: 0, why: "You want the precise share including pence, so true division." },
        ],
      },
      {
        kind: "trace",
        id: "t1",
        title: "Walk through a calculation",
        intro:
          "Python follows the same precedence rules as maths — powers first, then multiply/divide, then add/subtract. Brackets override everything. Watch the order.",
        code: "total = 2 + 3 * 4 ** 2\nprint(total)\n",
        lines: [
          {
            code: "4 ** 2",
            what:
              "Powers bind tightest, so this happens first — before the multiply, before the add. 4 squared is 16.",
            state: "expression is now: 2 + 3 * 16",
          },
          {
            code: "3 * 16",
            what: "Multiplication comes next, ahead of addition. 3 times 16 is 48.",
            state: "expression is now: 2 + 48",
          },
          {
            code: "2 + 48",
            what: "Addition last. The whole right side comes to 50, which then gets stuck onto the name total.",
            state: "total = 50",
          },
          {
            code: "print(total)",
            what: "Shows the finished value. If you'd wanted the addition first you'd have written (2 + 3) * 4 ** 2 — brackets beat everything.",
            state: "total = 50",
            output: "50",
          },
        ],
        takeaway:
          "Powers → multiply/divide → add/subtract, left to right within each level. When in doubt, add brackets: they cost nothing and make your intent obvious to the next reader.",
      },
      {
        kind: "read",
        id: "r3",
        title: "The float surprise",
        body:
          "Run this and brace yourself:\n\n```\nprint(0.1 + 0.2)\n```\n\nYou get `0.30000000000000004`.\n\nThis is not a Python bug. It happens in JavaScript, Java, C, your phone's calculator app — almost everywhere. Here's why.\n\nComputers store numbers in binary. In binary, some perfectly ordinary decimals have no exact representation — `0.1` is one of them, in the same way that `1/3` has no exact representation in decimal (0.3333… forever). So the computer stores the closest value it can, which is very slightly off. Add two slightly-off numbers and the tiny errors show up.\n\nThe practical consequence: **never compare floats with `==`.**\n\n```\nprint(0.1 + 0.2 == 0.3)    # False!\n```\n\nInstead, ask whether they're close enough:\n\n```\nimport math\nprint(math.isclose(0.1 + 0.2, 0.3))    # True\n```\n\nInts are completely immune to this — `1 + 2 == 3` is always exactly True. It's only floats. And if you're dealing with money, the professional answer is to work in whole pennies as ints, or use Python's `decimal` module, precisely to dodge this.",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "The number mistakes that bite",
        items: [
          {
            wrong: "people = 10 / 2\nprint(f'{people} people')",
            problem:
              "Shows '5.0 people', not '5 people'. `/` always gives a float, even when it divides exactly. If you want a whole number, use `//`.",
            right: "people = 10 // 2\nprint(f'{people} people')",
          },
          {
            wrong: "if 0.1 + 0.2 == 0.3:\n    print('equal')",
            problem:
              "Never prints. Floats carry tiny representation errors, so this is False. Any `==` between computed floats is a latent bug.",
            right: "import math\nif math.isclose(0.1 + 0.2, 0.3):\n    print('equal')",
          },
          {
            wrong: "print(2 ^ 10)",
            problem:
              "Gives 8, not 1024. In Python `^` is a bitwise XOR, not a power. The power operator is two asterisks: `**`. This one is nasty because it doesn't error — it silently gives you a wrong number.",
            right: "print(2 ** 10)",
          },
          {
            wrong: "total = '5' + 3",
            problem:
              "TypeError. '5' in quotes is text, not a number — you can't add text to a number. If a value came from input or a file it will be text, and you have to convert it with `int(...)` first.",
            right: "total = int('5') + 3",
          },
        ],
      },
      {
        kind: "cloze",
        id: "cl1",
        title: "Fill in the operators",
        prompt:
          "You have 100 minutes. Work out how many whole hours that is, and how many minutes are left over. Fill in the two operators.",
        template: "minutes = 100\nhours = minutes {{0}} 60\nleftover = minutes {{1}} 60\nprint(hours, 'hours', leftover, 'minutes')\n",
        blanks: [
          { answer: "//", width: 3 },
          { answer: "%", width: 3 },
        ],
        explanation:
          "`//` gives the whole number of times 60 fits into 100 (that's 1), and `%` gives what's left over (40). Together they answer 'how many, and what remains' — that's why these two operators travel as a pair.",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "print(0.1 + 0.2 == 0.3)\n",
        answer: "False",
        hints: [
          "Try running just `print(0.1 + 0.2)` on its own first and look closely at the result.",
          "It shows 0.30000000000000004 — not quite 0.3. So is the comparison true or false?",
        ],
        why:
          "0.1 and 0.2 can't be stored exactly in binary, so their sum lands a hair above 0.3. `==` demands they be identical, and they aren't. This is why float comparisons use math.isclose instead.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: compare the floats safely",
        buggy: "import math\na = 0.1 + 0.2\nb = 0.3\nprint(a == b)\n",
        expected: "True",
        hints: [
          "`==` demands the two values be bit-for-bit identical, which floats rarely are after arithmetic.",
          "The `math` module is already imported. It has a function for exactly this job.",
          "Use `math.isclose(a, b)` instead of `a == b`.",
        ],
        solution: "import math\na = 0.1 + 0.2\nb = 0.3\nprint(math.isclose(a, b))\n",
        solutionWhy:
          "`math.isclose` asks 'are these within a tiny tolerance of each other?' rather than 'are these identical?'. That's almost always the question you actually mean when comparing floats. It's part of the standard library, so there's nothing to install.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Compound interest",
        prompt:
          "With principal=1000, rate=0.05 and years=10, print the final amount compounded annually, rounded to 2 decimals. Expected: 1628.89",
        starter:
          "principal = 1000\nrate = 0.05\nyears = 10\n# print the final amount with 2 decimals\n",
        expected: "1628.89",
        hints: [
          "Compound interest multiplies by (1 + rate) once per year. Ten years means multiplying by that factor ten times over.",
          "'Multiply by something ten times' is exactly what the power operator does: (1 + rate) ** years.",
          "Then format it to two decimals with an f-string: f'{amount:.2f}'.",
        ],
        solution:
          "principal = 1000\nrate = 0.05\nyears = 10\nprint(f'{principal * (1 + rate) ** years:.2f}')\n",
        solutionWhy:
          "`(1 + rate) ** years` is the growth factor over the whole period — 1.05 multiplied by itself ten times. Multiply the principal by that and you have the final balance. The `:.2f` rounds the display to two decimal places, which is what you want for money.\n\nNote the operator precedence is doing work for you here: `**` binds tighter than `*`, so the power is worked out before the multiplication, with no brackets needed.",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "Which is true?",
        prompt: "About the two division operators in Python 3:",
        options: [
          "`/` returns an int if both operands are ints",
          "`//` always returns a float",
          "`/` always returns a float; `//` returns an int if both operands are ints",
          "`%` is undefined for negative numbers",
        ],
        correctIndex: 2,
        optionFeedback: [
          "`/` gives a float regardless — even 6 / 2 is 3.0, not 3.",
          "`//` follows its operands: 7 // 2 gives the int 3, but 7.0 // 2 gives the float 3.0.",
          "Right. `/` is always true division and always yields a float; `//` keeps the type of what you gave it.",
          "`%` works fine with negatives — in Python the result takes the sign of the right operand, so -7 % 2 is 1.",
        ],
        why:
          "`/` is always true division and always yields a float. `//` follows the types you feed it — two ints give an int, but a float anywhere gives a float.",
      },
      {
        kind: "explain",
        id: "x1",
        title: "In your own words",
        prompt:
          "A colleague's shopping-cart code checks `if total == 19.99:` and it sometimes fails even when the total looks exactly right on screen. Explain what's happening and what they should do instead.",
        minWords: 30,
        sampleAnswer:
          "The total is a float, and floats can't hold most decimals exactly — after a few additions it might be 19.989999999999998, which displays as 19.99 but isn't equal to it. They should compare with math.isclose, or better for money, work in whole pennies as integers so the values are exact.",
      },
    ],
  },

  {
    id: "py.03.strings",
    track: "python",
    index: 3,
    title: "Strings deep dive",
    summary: "Slicing, methods, join/split, immutability, and encoding awareness.",
    concepts: ["py:strings", "py:slicing", "py:immutability"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "A string is a sequence of characters",
        body:
          "Text in Python is a `str`, and it behaves like a numbered row of characters. You can pull out any single one by its **position**, counting from **zero**:\n\n```\ns = 'code'\ns[0]    # 'c'  — the first character\ns[1]    # 'o'\ns[3]    # 'e'  — the last one\n```\n\nStarting at 0 feels wrong for about a week and then becomes invisible. It means the position is really \"how far in from the start\", so the first character is zero steps in.\n\nNegative positions count backwards from the end, which saves a lot of arithmetic:\n\n```\ns[-1]   # 'e'  — last character, no need to know the length\ns[-2]   # 'd'  — second from last\n```\n\nThe other thing to know up front: **strings never change.** Every method that looks like it modifies a string actually builds a brand-new one and hands it back. `s.upper()` doesn't shout at `s`; it returns a new shouty string and leaves `s` exactly as it was. If you want to keep the result, you have to assign it somewhere.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Slicing: taking a piece",
        body:
          "A **slice** pulls out a range of characters. The form is `s[start:stop]` — starting at `start`, stopping **before** `stop`.\n\nThat exclusive endpoint is the same rule as `range`, and for the same reason: it makes `s[0:3]` exactly 3 characters long, and lets `s[:3]` and `s[3:]` fit together with no overlap and no gap.\n\n```\ns = 'code forge'\ns[0:4]    # 'code'\ns[:4]     # 'code'   — leave start off and it means 'from the beginning'\ns[5:]     # 'forge'  — leave stop off and it means 'to the end'\ns[:]      # the whole thing\n```\n\nThere's an optional third part, the **step**: `s[start:stop:step]`. A step of 2 takes every other character. A step of `-1` walks backwards — which is the classic way to reverse a string:\n\n```\ns[::-1]   # 'egrof edoc'\n```\n\nRead that as: no start, no stop, step backwards.",
      },
      {
        kind: "trace",
        id: "t1",
        title: "Walk through some slices",
        intro:
          "Positions are the thing to get straight. Here the string is 'code forge' — note the space is a character too, at position 4.",
        code: "s = 'code forge'\nprint(s[0])\nprint(s[-1])\nprint(s[:4])\nprint(s[5:])\nprint(s[::-1])\n",
        lines: [
          {
            code: "s = 'code forge'",
            what:
              "Ten characters, positions 0 to 9: c=0, o=1, d=2, e=3, space=4, f=5, o=6, r=7, g=8, e=9.",
            state: "s = 'code forge'",
          },
          {
            code: "print(s[0])",
            what: "A single position, not a slice — hand back just the character sitting at 0.",
            output: "c",
          },
          {
            code: "print(s[-1])",
            what:
              "Negative counts back from the end: -1 is the last character. Same as s[9] here, but it works without knowing the length.",
            output: "c\ne",
          },
          {
            code: "print(s[:4])",
            what:
              "No start, so from the beginning; stop at 4, meaning up to but NOT including position 4. Positions 0,1,2,3 — which is 'code'. Position 4 is the space, and it's excluded.",
            output: "c\ne\ncode",
          },
          {
            code: "print(s[5:])",
            what:
              "Start at 5 (the 'f'), no stop, so run to the end. Notice s[:4] and s[5:] skip position 4 — the space — between them.",
            output: "c\ne\ncode\nforge",
          },
          {
            code: "print(s[::-1])",
            what:
              "No start, no stop, step of -1: walk the whole string backwards one character at a time.",
            output: "c\ne\ncode\nforge\negrof edoc",
          },
        ],
        takeaway:
          "`start` is included, `stop` is excluded, and a negative step walks backwards. Everything else about slicing follows from those three facts.",
      },
      {
        kind: "read",
        id: "r3",
        title: "The methods worth memorising",
        body:
          "These come up constantly. All of them return something new rather than changing the original.\n\n**Cleaning up:**\n- `.strip()` — remove whitespace from both ends. Essential for anything a human typed.\n- `.lower()` / `.upper()` — change case. `.lower()` is how you compare text case-insensitively.\n\n**Asking questions** (these give True/False):\n- `.startswith(x)` / `.endswith(x)`\n- `x in s` — is this substring anywhere in it?\n\n**Reshaping:**\n- `.replace(old, new)` — swap every occurrence\n- `.split(sep)` — break into a list. With no argument it splits on whitespace.\n- `sep.join(list)` — the opposite: glue a list of strings together with `sep` between them\n\nThat last one reads backwards to almost everyone at first. You call `.join` **on the separator**, and pass it the list:\n\n```\n', '.join(['a', 'b', 'c'])    # 'a, b, c'\n```\n\nThink of it as \"use this separator to join these together\".",
      },
      {
        kind: "example",
        id: "e1",
        title: "Methods in action",
        code:
          "s = '  Code Forge  '\n"
          + "print(s.strip())\n"
          + "print(s.strip().lower())\n"
          + "print(s.strip().split())\n"
          + "print('-'.join(['a', 'b', 'c']))\n"
          + "print('forge' in s.lower())\n"
          + "print(s)\n",
        note:
          "The last line proves the point: after all that, `s` is still exactly what it started as. Methods can be chained — each one hands its result to the next.",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "The string mistakes that catch people",
        items: [
          {
            wrong: "name = '  Ada  '\nname.strip()\nprint(f'[{name}]')",
            problem:
              "Still shows the spaces. `.strip()` returns a cleaned copy — it doesn't modify `name`. The returned value was thrown away because nothing captured it.",
            right: "name = '  Ada  '\nname = name.strip()\nprint(f'[{name}]')",
          },
          {
            wrong: "s = 'hello'\ns[0] = 'H'",
            problem:
              "TypeError: 'str' object does not support item assignment. Strings can't be edited in place at all. Build a new one instead — here, s.capitalize() or 'H' + s[1:].",
            right: "s = 'hello'\ns = 'H' + s[1:]",
          },
          {
            wrong: "s = 'code forge'\nprint(s[0:4])   # wanting 'code '",
            problem:
              "Gives 'code' with no trailing space. The stop position is excluded, so s[0:4] stops before position 4 — and position 4 is the space. To include it you'd need s[0:5].",
            right: "s = 'code forge'\nprint(s[0:5])",
          },
          {
            wrong: "parts = ['a', 'b', 'c']\nprint(parts.join('-'))",
            problem:
              "AttributeError: 'list' object has no attribute 'join'. It reads naturally but it's backwards — `join` is a string method, not a list method. Call it on the separator and pass the list.",
            right: "parts = ['a', 'b', 'c']\nprint('-'.join(parts))",
          },
        ],
      },
      {
        kind: "cloze",
        id: "cl1",
        title: "Fill in the slice",
        prompt:
          "Given s = 'programming', pull out the word 'gram' (positions 3 to 6) and also print the string reversed.",
        template: "s = 'programming'\nprint(s[{{0}}:{{1}}])\nprint(s[::{{2}}])\n",
        blanks: [
          { answer: "3", width: 2 },
          { answer: "7", width: 2 },
          { answer: "-1", width: 3 },
        ],
        explanation:
          "'gram' sits at positions 3,4,5,6 — so the slice is s[3:7], because the stop is excluded and has to be one past the last character you want. A step of -1 walks the whole string backwards.",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "print(' - '.join(['a', 'b', 'c']))\n",
        answer: "a - b - c",
        hints: [
          "`join` is called on the separator, and the separator here is ' - ' — a space, a dash, another space.",
          "It puts that separator BETWEEN the items — so it appears twice for three items, not three times. There's nothing added at the start or the end.",
        ],
        why:
          "The separator goes between adjacent items only, so three items give two separators. That's why 'a - b - c' has no leading or trailing dash.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: tidy the input, then greet",
        buggy: "user = '   Ada   '\ngreeting = 'hello, ' + user + '!'\nprint(greeting)\n",
        expected: "hello, Ada!",
        hints: [
          "Run it and look closely at the output — there's extra whitespace either side of the name.",
          "The user's value has spaces on both ends. Which method removes whitespace from both ends of a string?",
          "`.strip()` — but remember it returns a new string rather than changing user, so you need to use the returned value.",
        ],
        solution: "user = '   Ada   '\ngreeting = 'hello, ' + user.strip() + '!'\nprint(greeting)\n",
        solutionWhy:
          "`.strip()` hands back a cleaned copy, which gets used straight away in the concatenation. You could equally have written `user = user.strip()` on its own line first — what you can't do is call `.strip()` and ignore what it returns.\n\nThis matters in real programs: anything typed by a human or read from a file routinely arrives with stray whitespace, and stripping it is the standard first move.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Reverse the words in a sentence",
        prompt:
          "Given s = 'the quick brown fox', print the words in reverse order: fox brown quick the",
        starter: "s = 'the quick brown fox'\n# print the reversed sentence\n",
        expected: "fox brown quick the",
        hints: [
          "This is words in reverse order, not characters — so s[::-1] alone won't do it (that would give 'xof nworb kciuq eht').",
          "Three moves: break the sentence into a list of words, reverse that list, then glue it back together with spaces.",
          "`.split()` breaks it up, `reversed(...)` or `[::-1]` flips the list, and `' '.join(...)` puts it back together.",
        ],
        solution: "s = 'the quick brown fox'\nprint(' '.join(s.split()[::-1]))\n",
        solutionWhy:
          "`s.split()` gives ['the','quick','brown','fox']. `[::-1]` reverses that list — slicing works on lists exactly like it does on strings. `' '.join(...)` then glues the words back with single spaces.\n\nReading it inside-out like that is the normal way to make sense of a chained expression: find the innermost call and work outwards.",
      },
      {
        kind: "explain",
        id: "x1",
        title: "Explain",
        prompt:
          "Why does calling `s.upper()` on its own line leave `s` unchanged? What do you have to do to actually keep the uppercase version?",
        minWords: 20,
        sampleAnswer:
          "Strings are immutable, so `.upper()` can't modify `s` — it builds a brand-new uppercase string and returns it. On a line by itself that returned value is simply discarded. To keep it you have to assign it to something, either back onto `s` or onto a new name.",
      },
    ],
  },

  {
    id: "py.04.booleans",
    track: "python",
    index: 4,
    title: "Booleans, truthiness, and comparisons",
    summary: "Truthy/falsy values, chained comparisons, `and`/`or` short-circuiting.",
    concepts: ["py:bool", "py:truthiness", "py:comparisons"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Falsy values",
        body:
          "A **bool** is a value that's either `True` or `False` — capital letter, no quotes. Every comparison produces one:\n\n```\nprint(5 > 3)      # True\nprint(5 == 3)     # False\n```\n\nThe comparison operators: `==` equal, `!=` not equal, `<`, `>`, `<=`, `>=`.\n\nA nice Python touch: comparisons **chain**, exactly as they do in maths. `0 < x < 10` means what you'd hope — x is between 0 and 10. Most languages make you write `0 < x and x < 10`.\n\nCombine conditions with `and`, `or`, `not`:\n\n```\nif age >= 18 and has_ticket:\n    print('come in')\n```\n\nPython uses those English words where many languages use `&&`, `||` and `!`.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Truthiness: things that aren't bools but act like them",
        body:
          "Here's where Python differs from what you might expect. An `if` doesn't demand an actual True or False — it accepts **any** value and decides whether it counts as true.\n\nThe rule is short: **empty things are false, everything else is true.**\n\nThese are all **falsy**:\n\n- `False`\n- `None` (Python's 'no value')\n- `0` and `0.0`\n- `''` — the empty string\n- `[]`, `()`, `{}`, `set()` — empty collections\n\nEverything else is **truthy** — including `'0'` (a non-empty string), `'False'` (also a non-empty string), `-1`, and `[0]` (a list with something in it, even though that something is falsy).\n\nThis is why the idiomatic Python check for 'does this list have anything in it' is simply:\n\n```\nif items:\n    ...\n```\n\nrather than `if len(items) > 0:`. Both work; the first is what Python programmers write and read.",
      },
      {
        kind: "categorize",
        id: "cat1",
        title: "Truthy or falsy?",
        prompt:
          "Sort each value by whether Python treats it as true or false in an `if`. Several of these look falsy but aren't — those are the ones worth getting right.",
        buckets: ["truthy", "falsy"],
        items: [
          { text: "0", bucket: 1, why: "Zero is falsy — the only number that is." },
          { text: "'0'", bucket: 0, why: "A string containing the character 0. It's not empty, so it's truthy — a classic trap when reading numbers from text input." },
          { text: "''", bucket: 1, why: "The empty string is falsy." },
          { text: "'False'", bucket: 0, why: "A non-empty string. The contents are irrelevant — only emptiness matters." },
          { text: "[]", bucket: 1, why: "An empty list is falsy." },
          { text: "[0]", bucket: 0, why: "A list with one item in it. The list isn't empty, so it's truthy, even though the item inside is falsy." },
          { text: "None", bucket: 1, why: "None is always falsy." },
          { text: "-1", bucket: 0, why: "Every number except 0 is truthy, negatives included." },
        ],
      },
      {
        kind: "read",
        id: "r3",
        title: "and / or return a value, not just True or False",
        body:
          "This surprises people, and it's genuinely useful once it clicks.\n\n`and` and `or` **short-circuit** — they stop as soon as the answer is settled — and they hand back **one of the original values**, not a bool.\n\n**`or`** returns the first truthy value it finds (or the last one if none are truthy):\n\n```\nprint(0 or 'fallback')     # 'fallback'  — 0 is falsy, so move on\nprint('yes' or 'nope')     # 'yes'       — first one is truthy, stop there\n```\n\nThat second line matters: `'nope'` is never even looked at. If it had been a function call, it wouldn't have run.\n\n**`and`** returns the first falsy value (or the last one if all are truthy):\n\n```\nprint(1 and 2)             # 2     — both truthy, so the last one\nprint(None and 'never')    # None  — first is falsy, stop immediately\n```\n\nThe practical uses:\n\n- **Defaults:** `name = user_input or 'anonymous'` — falls back when the input is empty.\n- **Guarding:** `if user and user.is_admin:` — if `user` is None, Python never tries `.is_admin` and never crashes.\n\nThat second pattern is worth remembering. Short-circuiting is what makes it safe.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Short-circuit returns",
        code:
          "print(0 or 'fallback')       # 0 is falsy -> take the next one\n" +
          "print('yes' or 'nope')       # first is truthy -> stop there\n" +
          "print(1 and 2)               # both truthy -> last one\n" +
          "print(None and 'never')      # first is falsy -> stop immediately\n" +
          "name = '' or 'anonymous'\n" +
          "print(name)                  # the default-value trick\n",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "The boolean mistakes to avoid",
        items: [
          {
            wrong: "name = 'Ada'\nif name == True:\n    print('has a name')",
            problem:
              "Never prints. `name` is truthy, but it isn't *equal to* `True` — 'Ada' == True is False. Testing truthiness and testing equality with True are different questions. Just use the value directly.",
            right: "name = 'Ada'\nif name:\n    print('has a name')",
          },
          {
            wrong: "answer = 'yes'\nif answer == 'yes' or 'y':\n    print('confirmed')",
            problem:
              "Looks right, always fires — even when answer is 'no'. Python reads it as `(answer == 'yes') or ('y')`, and the bare string 'y' is truthy, so the whole condition is always true. You have to write out both comparisons.",
            right: "answer = 'yes'\nif answer == 'yes' or answer == 'y':\n    print('confirmed')",
          },
          {
            wrong: "count = 0\nif count:\n    print('we have some')\nelse:\n    print('none')",
            problem:
              "Not a bug exactly, but a trap: this treats 0 as 'none'. If 0 is a legitimate value you care about — a count that's genuinely zero versus a value that was never set — check explicitly with `if count is not None:` instead.",
            right: "count = 0\nif count is not None:\n    print('we have a count:', count)",
          },
        ],
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "x = 5\nprint(0 < x < 10)\n",
        answer: "True",
        hints: [
          "Python allows chained comparisons, so read this the way you'd read it in maths.",
          "It means 'is x greater than 0 AND less than 10?'. x is 5.",
        ],
        why:
          "`0 < x < 10` is shorthand for `0 < x and x < 10`. Both halves hold for 5, so the whole thing is True. Most languages would reject this syntax; Python handles it the way maths notation does.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: only greet non-empty names",
        buggy:
          "name = ''\nif name == True:\n    print(f'hi {name}')\nelse:\n    print('nobody home')\n",
        expected: "nobody home",
        hints: [
          "Run it — it happens to print the right thing here. Now mentally change name to 'Ada' and work out what it would do.",
          "With name = 'Ada' it still says 'nobody home', because 'Ada' == True is False. The comparison is asking the wrong question.",
          "Don't compare to True at all — just test the value itself: `if name:`",
        ],
        solution: "name = ''\nif name:\n    print(f'hi {name}')\nelse:\n    print('nobody home')\n",
        solutionWhy:
          "`if name:` asks 'is this truthy?', which is the actual question — an empty string is falsy and anything else is truthy. `if name == True:` asks something different and much narrower: 'is this value literally the boolean True?', which no string ever is.\n\nThe original passed its test purely by luck. Fixing it required noticing it would fail for every non-empty name — a good reminder that a passing test doesn't mean correct code.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Give an empty name a default",
        prompt:
          "Given `user_input = ''`, use the `or` trick to set `name` to 'anonymous' when the input is empty, then print exactly: welcome, anonymous",
        starter: "user_input = ''\n# set name using or, then print the greeting\n",
        expected: "welcome, anonymous",
        hints: [
          "`or` hands back the first truthy value it finds — and an empty string is falsy.",
          "So `'' or 'anonymous'` evaluates to 'anonymous'. Assign that to name.",
          "name = user_input or 'anonymous', then print with an f-string.",
        ],
        solution: "user_input = ''\nname = user_input or 'anonymous'\nprint(f'welcome, {name}')\n",
        solutionWhy:
          "Because `user_input` is falsy, `or` moves past it and returns 'anonymous'. If the input had been 'Ada', `or` would have stopped at the first value and name would be 'Ada'.\n\nOne caveat worth carrying forward: this pattern treats *any* falsy value as missing. If 0 or an empty string were legitimate inputs you wanted to keep, you'd need an explicit `if user_input is None:` check instead.",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "Which is idiomatic?",
        prompt: "You want to run code only when `items` has at least one element.",
        options: [
          "if len(items) > 0:",
          "if items != []:",
          "if items:",
          "if bool(items) is True:",
        ],
        correctIndex: 2,
        optionFeedback: [
          "Works and is perfectly clear, but it's spelling out what truthiness already gives you. Fine in other languages; wordy in Python.",
          "Works for lists but breaks for other empty collections — a tuple or a set would never equal []. Also fails if items is None.",
          "Right — empty collections are falsy, so testing the object directly says exactly what you mean, and works for any container type.",
          "Correct but doubly redundant: bool() then `is True` on something already usable as a condition.",
        ],
        why:
          "Empty sequences are falsy, so testing the object directly is both shortest and most general — it works for lists, tuples, sets, dicts and strings alike.",
      },
      {
        kind: "explain",
        id: "x1",
        title: "Explain",
        prompt:
          "Someone writes `if user and user.is_admin:` instead of `if user.is_admin:`. What does the extra `and user` buy them, and what would go wrong without it?",
        minWords: 25,
        sampleAnswer:
          "If user is None, `user.is_admin` would raise an AttributeError because None has no such attribute. Because `and` short-circuits, Python checks `user` first and stops immediately when it's falsy, never evaluating the second half. So the guard turns a potential crash into a clean False.",
      },
    ],
  },

  {
    id: "py.05.control",
    track: "python",
    index: 5,
    title: "Control flow: if / for / while",
    summary: "Branching and looping with Python's block syntax; `break`, `continue`, `else` on loops.",
    concepts: ["py:if", "py:for", "py:while", "py:break-continue"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Making a decision: if",
        body:
          "So far every line you've written has run, every time. **`if`** lets a chunk of code run only when some condition holds.\n\n```\nage = 20\nif age >= 18:\n    print('adult')\n```\n\nThree parts to notice:\n\n- The **condition** — `age >= 18` — is anything that comes out True or False.\n- The **colon** at the end of the `if` line. Forgetting it is a SyntaxError.\n- The **indentation**. The indented lines underneath are the block that runs when the condition is true.\n\nMost languages wrap blocks in `{ curly braces }`. Python uses indentation instead — the indenting *is* the syntax, not just formatting. Four spaces is the convention.\n\nAdd `else` for the other case, and `elif` (short for 'else if') for extra cases:\n\n```\nif score >= 90:\n    grade = 'A'\nelif score >= 80:\n    grade = 'B'\nelse:\n    grade = 'F'\n```\n\nPython checks these top to bottom and stops at the **first** one that's true. Everything below is skipped — which is why you can write `elif score >= 80` without also checking that it's under 90.",
      },
      {
        kind: "trace",
        id: "t1",
        title: "Walk through an if/elif chain",
        intro:
          "The 'stops at the first true one' rule is what trips people up. Watch it happen.",
        code: "score = 85\n\nif score >= 90:\n    print('A')\nelif score >= 80:\n    print('B')\nelif score >= 70:\n    print('C')\nelse:\n    print('F')\n",
        lines: [
          { code: "score = 85", what: "Stick the value 85 onto the name score.", state: "score = 85" },
          {
            code: "if score >= 90:",
            what:
              "Work out the condition: is 85 greater than or equal to 90? No — that's False. So the indented block under this line is skipped entirely, and Python drops to the next elif.",
            state: "condition was False → skip the print('A')",
          },
          {
            code: "elif score >= 80:",
            what:
              "Is 85 >= 80? Yes — True. So this block runs. Note we never had to check 'and is it under 90' — if we'd got past the first test, we already know it isn't 90 or more.",
            output: "B",
          },
          {
            code: "elif score >= 70:\nelse:",
            what:
              "These are never even looked at. Once one branch in the chain runs, Python skips the whole rest of the chain and continues below it. 85 >= 70 is perfectly true, but it doesn't matter — we already matched.",
            output: "B",
          },
        ],
        takeaway:
          "An if/elif/else chain runs at most one branch — the first one whose condition is true. Order your conditions from most specific to least.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Repeating: the for loop",
        body:
          "A **for loop** runs the same block once for each item in a collection.\n\n```\nfor colour in ['red', 'green', 'blue']:\n    print(colour)\n```\n\nRead it as: *for each colour in this list, do the indented block.* On each pass the name `colour` is re-pointed at the next item.\n\nWhen you want to repeat a set number of times rather than walk a list, use **`range`**:\n\n```\nfor i in range(5):\n    print(i)      # 0 1 2 3 4\n```\n\nThe thing to burn into memory: **`range` stops *before* the number you give it.** `range(5)` produces 0, 1, 2, 3, 4 — five numbers, starting at 0, and 5 itself is never included.\n\nWith two arguments it starts somewhere else: `range(1, 6)` gives 1, 2, 3, 4, 5. Still stops before the second number.\n\nThat exclusive endpoint is the single most common off-by-one mistake in programming. It's not arbitrary though — it means `range(len(xs))` gives exactly the valid positions of a list, and `range(a, b)` always produces `b - a` numbers.",
      },
      {
        kind: "trace",
        id: "t2",
        title: "Watch a loop go round",
        intro:
          "This is the one to slow down on. Follow `total` and `i` as the loop repeats — notice the loop body runs three separate times.",
        code: "total = 0\n\nfor i in range(1, 4):\n    total = total + i\n\nprint(total)\n",
        lines: [
          { code: "total = 0", what: "Set up a running tally, starting at nothing.", state: "total = 0" },
          {
            code: "for i in range(1, 4):",
            what:
              "range(1, 4) will produce 1, 2, 3 — starting at 1, stopping before 4. Python points i at the first of those, 1, and enters the block.",
            state: "i = 1, total = 0",
          },
          {
            code: "    total = total + i",
            what:
              "Right side first, as always: total (0) plus i (1) is 1. Stick that back onto total. The block is finished, so Python loops back up to the for line.",
            state: "i = 1, total = 1",
          },
          {
            code: "for i in range(1, 4):",
            what: "There are more numbers to come, so i is re-pointed at 2 and the block runs again.",
            state: "i = 2, total = 1",
          },
          {
            code: "    total = total + i",
            what: "total (1) plus i (2) is 3. Back up to the top again.",
            state: "i = 2, total = 3",
          },
          {
            code: "    total = total + i",
            what: "i is now 3. total (3) plus 3 is 6. After this pass, range has run out of numbers.",
            state: "i = 3, total = 6",
          },
          {
            code: "print(total)",
            what:
              "The loop is done, so Python moves past it to this line. Notice print is NOT indented — it sits outside the loop, so it runs once at the end rather than once per pass.",
            state: "total = 6",
            output: "6",
          },
        ],
        takeaway:
          "The indented block runs once per item. Anything at the outer level runs once, after the loop finishes. Whether a line is inside or outside the loop is decided purely by its indentation.",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "The four classic control-flow mistakes",
        items: [
          {
            wrong: "if score = 90:\n    print('top marks')",
            problem:
              "SyntaxError. `=` assigns a value; comparing takes `==`. Python deliberately refuses `=` inside an `if` precisely because this typo is so easy and so damaging in languages that do allow it.",
            right: "if score == 90:\n    print('top marks')",
          },
          {
            wrong: "for i in range(1, 5):\n    print(i)\n# expecting 1 2 3 4 5",
            problem:
              "Prints 1 2 3 4 — not 5. range always stops *before* the second number. To include 5 you have to say range(1, 6).",
            right: "for i in range(1, 6):\n    print(i)",
          },
          {
            wrong: "total = 0\nfor i in range(1, 4):\n    total = total + i\n    print(total)",
            problem:
              "Prints 1, 3, 6 — three times — because the print is indented, so it's part of the loop body. If you only want the final answer, the print must sit outside the loop.",
            right: "total = 0\nfor i in range(1, 4):\n    total = total + i\nprint(total)",
          },
          {
            wrong: "if age >= 18\n    print('adult')",
            problem:
              "SyntaxError — the colon is missing off the end of the `if` line. Every line that opens a block (if, elif, else, for, while, def) ends in a colon.",
            right: "if age >= 18:\n    print('adult')",
          },
        ],
      },
      {
        kind: "parsons",
        id: "pa1",
        title: "Build a loop that counts down",
        prompt:
          "Put these lines in order so the program prints 3, 2, 1, then 'liftoff'. The indented line belongs inside the loop; the unindented ones don't.",
        solution: [
          "for n in [3, 2, 1]:",
          "    print(n)",
          "print('liftoff')",
        ],
        expectedOutput: "3\n2\n1\nliftoff",
        hints: [
          "A loop's header line has to come before its body — the indented line can't be first.",
          "'liftoff' should print once at the very end, not once per number. Which indentation level does that mean it needs to be at, and where does it go?",
          "Header first, then the indented body, then the unindented line that runs after the loop finishes.",
        ],
        explanation:
          "The indented print runs once per item (three times); the unindented print sits outside the loop so it runs a single time, after the loop is done.",
      },
      {
        kind: "cloze",
        id: "cl1",
        title: "Fill in the loop",
        prompt:
          "This should print every number from 1 to 5 inclusive, then print 'done' once at the end. Fill the gaps.",
        template: "for i in {{0}}(1, {{1}}):\n    print(i)\nprint({{2}})\n",
        blanks: [
          { answer: "range", width: 6 },
          { answer: "6", width: 2 },
          { answer: "'done'", accept: ['"done"'], width: 7 },
        ],
        explanation:
          "`range(1, 6)` gives 1 through 5 — you need 6 as the stop value because range never includes it. The final print is unindented, so it runs once after the loop rather than on every pass.",
      },
      {
        kind: "read",
        id: "r3",
        title: "while, break and continue",
        body:
          "A **while loop** repeats as long as a condition stays true. Use it when you don't know up front how many passes you need.\n\n```\ncount = 3\nwhile count > 0:\n    print(count)\n    count = count - 1\n```\n\nThe danger with `while` is the **infinite loop** — if nothing inside the block ever makes the condition false, it runs forever. Every while loop needs something in its body that moves it toward stopping. (In this app an endless loop will just hang the Run button, so it's a safe place to make that mistake once.)\n\nTwo keywords work in both kinds of loop:\n\n- **`break`** — leave the loop immediately, skipping any remaining passes.\n- **`continue`** — skip the rest of *this* pass and jump straight to the next one.\n\n```\nfor n in [1, 2, 3, 4, 5]:\n    if n == 3:\n        continue      # skip just the 3\n    if n == 5:\n        break         # stop entirely\n    print(n)          # prints 1, 2, 4\n```",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "total = 0\nfor i in range(1, 6):\n    if i == 3:\n        continue\n    total += i\nprint(total)\n",
        answer: "12",
        hints: [
          "First work out what numbers range(1, 6) actually produces. Remember it stops before 6.",
          "It gives 1, 2, 3, 4, 5. Now — what does `continue` do when i is 3?",
          "`continue` skips the rest of that pass, so `total += i` never runs for 3. You're adding 1 + 2 + 4 + 5.",
        ],
        why:
          "range(1, 6) yields 1,2,3,4,5. When i is 3 the continue jumps to the next pass before the addition happens, so 3 is left out: 1 + 2 + 4 + 5 = 12. (`total += i` is just shorthand for `total = total + i`.)",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: print 'buzz' for multiples of 5",
        buggy:
          "for i in range(1, 11):\n    if i % 5 = 0:\n        print('buzz')\n    else:\n        print(i)\n",
        expected: "1\n2\n3\n4\nbuzz\n6\n7\n8\n9\nbuzz",
        hints: [
          "Run it. It's a SyntaxError, and the arrow in the message points near the `=`.",
          "Inside an `if` you're asking a question, not assigning. Which operator asks 'are these equal?'",
          "Change `=` to `==`. (`i % 5` gives the remainder when i is divided by 5, so `== 0` means 'divides exactly'.)",
        ],
        solution:
          "for i in range(1, 11):\n    if i % 5 == 0:\n        print('buzz')\n    else:\n        print(i)\n",
        solutionWhy:
          "A single `=` means 'assign this value', which makes no sense as a question, so Python rejects it outright. `==` asks whether two things are equal. The modulo operator `%` gives the remainder, so `i % 5 == 0` is the standard way to say 'i divides evenly by 5'.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Sum of even numbers 1..100",
        prompt: "Print the sum of every even number from 1 to 100 inclusive. Expected: 2550",
        starter: "# print the sum here\n",
        expected: "2550",
        hints: [
          "Start with a running total set to 0, loop over the numbers, and print the total once at the end (outside the loop).",
          "To include 100, your range needs to stop at 101 — remember the endpoint is exclusive.",
          "To test 'is i even', check whether the remainder when divided by 2 is zero: `if i % 2 == 0:`",
        ],
        solution:
          "total = 0\nfor i in range(1, 101):\n    if i % 2 == 0:\n        total += i\nprint(total)\n",
        solutionWhy:
          "range(1, 101) covers 1 through 100 — the stop value is one past where you want to finish. `i % 2 == 0` keeps only the evens. The print is unindented so it runs once at the end, not on every pass.\n\nA neater alternative once you're comfortable: `range(2, 101, 2)` takes a third argument, the step, and counts 2, 4, 6… directly — no `if` needed at all.",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "What does range(2, 10, 3) produce?",
        prompt: "The third argument to range is the step — how much to count by each time.",
        options: ["2, 5, 8", "2, 5, 8, 11", "2, 3, 10", "3, 6, 9"],
        correctIndex: 0,
        optionFeedback: [
          "Right — start at 2, add 3 each time, and stop before 10. 11 would be past the end.",
          "This includes 11, but range always stops before the second number, and 11 is beyond 10.",
          "This reads the arguments as a list of values. They're actually start, stop, and step.",
          "This starts at 3, but the first argument is the starting value, which is 2.",
        ],
        why:
          "range(start, stop, step) counts from start, adds step each time, and stops as soon as it would reach or pass stop. So 2, 5, 8 — and 11 would be past 10, so it stops.",
      },
      {
        kind: "explain",
        id: "x1",
        title: "In your own words",
        prompt:
          "Someone writes a loop to total up some numbers, but it prints a number on every pass instead of one total at the end. Nothing is misspelled and there are no error messages. What's wrong, and how would you tell just by looking?",
        minWords: 25,
        sampleAnswer:
          "Their print is indented, so it's part of the loop body and runs once per pass. It needs to be at the outer level, lined up with the `for`, so it runs a single time after the loop ends. You can spot it purely from the indentation — in Python how far a line is indented is what decides whether it's inside the loop or after it.",
      },
    ],
  },

  {
    id: "py.06.lists",
    track: "python",
    index: 6,
    title: "Lists",
    summary: "Ordered, mutable sequences. Common methods, aliasing pitfalls, and copies.",
    concepts: ["py:list", "py:aliasing", "py:list-methods"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "A list holds many values in order",
        body:
          "A **list** is an ordered collection. Square brackets, comma separated:\n\n```\nscores = [90, 85, 77]\nnames = ['Ada', 'Ren']\nmixed = [1, 'two', 3.0]      # allowed, though usually a smell\nempty = []\n```\n\nYou reach items by position, counting from 0, exactly like string characters — and slicing works the same way too:\n\n```\nscores[0]     # 90\nscores[-1]    # 77\nscores[:2]    # [90, 85]\nlen(scores)   # 3\n```\n\nAdding and removing:\n\n- `.append(x)` — add one item to the end\n- `.insert(i, x)` — add at a position\n- `.pop()` — remove and hand back the last item; `.pop(i)` for a position\n- `.remove(x)` — remove the first item equal to x\n\nAnd `x in xs` asks whether something is present.",
      },
      {
        kind: "read",
        id: "r2",
        title: "The big difference from strings: lists change",
        body:
          "Strings are **immutable** — every method hands back a new string and leaves the original alone. Lists are the opposite: they're **mutable**, and many list methods change the list *in place* and return nothing.\n\nThat difference is the source of nearly every list bug beginners hit, so it's worth stating plainly:\n\n**Methods that change the list itself** (and return `None`):\n`.append()`, `.insert()`, `.remove()`, `.sort()`, `.reverse()`, `.extend()`\n\n**Functions that leave it alone** (and return a new thing):\n`sorted(xs)`, `reversed(xs)`, `xs + [1]`, `xs[:]`\n\nSo:\n\n```\nxs = [3, 1, 2]\nxs.sort()          # changes xs, returns None\nprint(xs)          # [1, 2, 3]\n\nys = [3, 1, 2]\nzs = sorted(ys)    # ys untouched, zs is new\nprint(ys, zs)      # [3, 1, 2] [1, 2, 3]\n```\n\nThe naming is a genuine hint once you notice it: the **method** `.sort()` acts on the thing you called it on; the **function** `sorted()` takes a thing and gives you back a sorted copy.",
      },
      {
        kind: "categorize",
        id: "cat1",
        title: "Changes the list, or returns a new one?",
        prompt:
          "Sort each of these by whether it modifies the original list or leaves it alone and hands back something new. Getting this reflex right prevents a whole class of bug.",
        buckets: ["changes the original", "returns a new thing"],
        items: [
          { text: "xs.append(4)", bucket: 0, why: "A method that adds to the list itself, and returns None." },
          { text: "xs.sort()", bucket: 0, why: "Sorts in place and returns None — the list itself is reordered." },
          { text: "sorted(xs)", bucket: 1, why: "A function that builds and returns a new sorted list; xs is untouched." },
          { text: "xs.reverse()", bucket: 0, why: "Reverses in place, returns None." },
          { text: "xs[::-1]", bucket: 1, why: "A slice, and slicing always builds a new list." },
          { text: "xs + [99]", bucket: 1, why: "The + operator makes a new combined list rather than modifying either side." },
          { text: "xs.pop()", bucket: 0, why: "Removes the last item from the list AND returns that item — it does both." },
        ],
      },
      {
        kind: "read",
        id: "r3",
        title: "Two names, one list",
        body:
          "Here's the one that catches everyone.\n\n```\na = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)        # [1, 2, 3, 4]  — a changed too!\n```\n\nGo back to the sticky-note picture. `b = a` does **not** copy the list. It sticks a second note onto the *same* list. Now `a` and `b` are two names for one object, and changing it through either name changes the thing both point at.\n\nThis never bit you with numbers or strings, because those are immutable — you can't change them in place, so the question never came up.\n\nTo get an actual copy, ask for one explicitly:\n\n```\nb = a[:]          # slice of the whole thing — a new list\nb = list(a)       # same idea, arguably clearer\nb = a.copy()      # also same idea\n```\n\nOne caveat for later: these are **shallow** copies. If your list contains other lists, the inner ones are still shared. `copy.deepcopy(a)` handles that, and you'll want it eventually.",
      },
      {
        kind: "trace",
        id: "t1",
        title: "Watch two names share one list",
        intro:
          "Follow what each name points at. The key moment is line 2 — notice no new list gets made.",
        code: "a = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)\nprint(b)\n",
        lines: [
          {
            code: "a = [1, 2, 3]",
            what: "Build a list and stick the name a onto it. One list exists.",
            state: "a → [1, 2, 3]",
          },
          {
            code: "b = a",
            what:
              "Look up a, find the list, and stick the name b onto that same list. No copy is made — nothing here says 'build a new list'. There is still exactly one list, now with two names on it.",
            state: "a → [1, 2, 3] ← b   (one list, two names)",
          },
          {
            code: "b.append(4)",
            what:
              "Modify the list through the name b. Because a and b point at the same object, there's only one list to modify — and it now ends in 4.",
            state: "a → [1, 2, 3, 4] ← b",
          },
          {
            code: "print(a)",
            what:
              "a was never assigned to again, but the object it points at has changed underneath it. This is the surprise: a line that never mentions a still altered what a shows.",
            output: "[1, 2, 3, 4]",
          },
          {
            code: "print(b)",
            what: "Same object, so identical output. They aren't two lists that happen to match — they are one list.",
            output: "[1, 2, 3, 4]\n[1, 2, 3, 4]",
          },
        ],
        takeaway:
          "`=` never copies a list; it adds another name to the same one. If you need an independent list, say so explicitly with `a[:]`, `list(a)` or `a.copy()`.",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "The list mistakes that cost real time",
        items: [
          {
            wrong: "xs = [3, 1, 2]\nxs = xs.sort()\nprint(xs)",
            problem:
              "Prints None. `.sort()` sorts the list in place and returns nothing, so assigning its result wipes out your list. Either call it without assigning, or use `sorted()`.",
            right: "xs = [3, 1, 2]\nxs.sort()\nprint(xs)",
          },
          {
            wrong: "original = [1, 2, 3]\nbackup = original\noriginal.append(4)\nprint(backup)",
            problem:
              "Prints [1, 2, 3, 4] — the 'backup' isn't a backup at all. `=` gave the same list a second name rather than copying it.",
            right: "original = [1, 2, 3]\nbackup = original[:]\noriginal.append(4)\nprint(backup)",
          },
          {
            wrong: "xs = [1, 2, 3]\nprint(xs[3])",
            problem:
              "IndexError: list index out of range. Three items live at positions 0, 1 and 2 — there is no position 3. The last valid index is always len(xs) - 1, which is why xs[-1] is the safer way to say 'the last one'.",
            right: "xs = [1, 2, 3]\nprint(xs[-1])",
          },
          {
            wrong: "xs = [2, 4, 6]\nfor x in xs:\n    if x % 2 == 0:\n        xs.remove(x)\nprint(xs)",
            problem:
              "Prints [4] — every value was even, yet one survived. Removing an item shifts everything after it left, but the loop's position keeps advancing, so it steps straight over the next element. Never modify a list while looping over it; build a new one instead.",
            right: "xs = [2, 4, 6]\nxs = [x for x in xs if x % 2 != 0]\nprint(xs)",
          },
        ],
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "xs = [3, 1, 2]\nys = sorted(xs)\nxs.append(0)\nprint(xs, ys)\n",
        answer: "[3, 1, 2, 0] [1, 2, 3]",
        hints: [
          "Is `sorted(xs)` one of the things that changes xs, or one that returns something new?",
          "It returns a new list and leaves xs alone — so after line 2, xs is still [3, 1, 2] in its original order.",
          "Line 3 then appends to xs only. ys was built earlier as a separate list and isn't affected.",
        ],
        why:
          "`sorted()` builds a brand-new list, so ys is independent from the moment it's created. xs keeps its original order and gets 0 appended; ys stays as the sorted snapshot taken before that.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: build a copy so the original is unchanged",
        buggy:
          "nums = [1, 2, 3]\ncopy = nums\ncopy.append(99)\nprint('nums:', nums)\nprint('copy:', copy)\n",
        expected: "nums: [1, 2, 3]\ncopy: [1, 2, 3, 99]",
        hints: [
          "Run it — both lines show the 99, even though only `copy` was appended to.",
          "Line 2 doesn't make a copy. It points a second name at the same list, so there's only one list to append to.",
          "Ask for a real copy: `nums[:]`, `list(nums)` or `nums.copy()` all work.",
        ],
        solution:
          "nums = [1, 2, 3]\ncopy = nums[:]\ncopy.append(99)\nprint('nums:', nums)\nprint('copy:', copy)\n",
        solutionWhy:
          "`nums[:]` is a slice covering the whole list, and slicing always builds a new list. Now there are genuinely two lists, so appending to one leaves the other alone.\n\nNaming a variable `copy` didn't make it one — the name is just a label, and only an explicit copying operation actually duplicates the data.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Squares of odd numbers 1..9",
        prompt: "Print a list of the squares of the odd numbers from 1 to 9 inclusive. Expected: [1, 9, 25, 49, 81]",
        starter: "# print the list here\n",
        expected: "[1, 9, 25, 49, 81]",
        hints: [
          "One approach: start with an empty list, loop over the numbers, and append the ones you want.",
          "To include 9 your range has to stop at 10. Test for odd with `n % 2 != 0` (or just `n % 2`, since 1 is truthy).",
          "Build with `squares = []` then `squares.append(n * n)` inside an if, and print squares at the end.",
        ],
        solution:
          "squares = []\nfor n in range(1, 10):\n    if n % 2 != 0:\n        squares.append(n * n)\nprint(squares)\n",
        solutionWhy:
          "Start empty, loop 1 through 9, keep only the odds, and append each square.\n\nOnce you meet list comprehensions (a couple of lessons on) the same thing compresses to one line: `print([n * n for n in range(1, 10, 2)])`. The loop version is worth writing first — comprehensions are shorthand for exactly this shape, and they read much better once you've built it the long way.",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "Which mutates?",
        prompt: "Which of these changes the original list?",
        options: ["sorted(xs)", "reversed(xs)", "xs.sort()", "xs + [99]"],
        correctIndex: 2,
        optionFeedback: [
          "A function that returns a new sorted list. xs is untouched.",
          "Returns a new reversed iterator; xs is untouched. (`xs.reverse()` — the method — is the one that mutates.)",
          "Right. A method called on the list, sorting it in place and returning None.",
          "The + operator builds a new combined list rather than modifying either side.",
        ],
        why:
          "Only methods called on the list itself mutate it. A rough rule: `xs.something()` often changes xs, while `something(xs)` gives you a new value back.",
      },
      {
        kind: "explain",
        id: "x1",
        title: "Explain",
        prompt:
          "A colleague passes their list to a function to 'just check something', and afterwards their original list has changed. They insist the function never reassigned anything. How is this possible, and what would you tell them to do?",
        minWords: 30,
        sampleAnswer:
          "The function received the same list object, not a copy — passing it in just gives the parameter another name for it. If the function called something like .append() or .sort(), it modified the one shared list, and the caller sees that change without any reassignment happening. They should either have the function work on a copy with list(xs), or make it build and return a new list instead of modifying what it was given.",
      },
    ],
  },

  {
    id: "py.07.tuples",
    track: "python",
    index: 7,
    title: "Tuples & unpacking",
    summary: "Immutable ordered records; multiple return values; star-unpacking.",
    concepts: ["py:tuple", "py:unpacking"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "A tuple is a list that can't change",
        body:
          "A **tuple** is an ordered collection like a list, but **immutable** — once built, you can't add, remove or replace anything.\n\nRound brackets instead of square:\n\n```\npoint = (3, 4)\nperson = ('Ada', 36, 'London')\n```\n\nIndexing and slicing work exactly as they do for lists. What doesn't work is anything that would change it — no `.append()`, no `point[0] = 5`.\n\nSo why would you want the *less* capable thing? Two real reasons:\n\n**It signals intent.** A list says \"a collection of similar things, probably growing\". A tuple says \"a fixed record where each position means something\". `(x, y)` is a point — swapping or appending would be nonsense.\n\n**It can be a dict key.** Only immutable things can be dict keys, so `(3, 4)` can be, and `[3, 4]` can't. That single fact makes tuples the natural choice for coordinates, database-style composite keys, and anything you want to put in a set.\n\nOne quirk: the brackets are often optional. `a = 1, 2` makes a tuple. And a one-item tuple needs a trailing comma — `(5,)` — because `(5)` is just the number 5 in brackets.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Unpacking: pulling a tuple apart",
        body:
          "You can assign several names at once from any collection. This is called **unpacking**, and it's used constantly in real Python.\n\n```\npoint = (3, 4)\nx, y = point\nprint(x, y)      # 3 4\n```\n\nThe number of names has to match the number of items, or you get a ValueError.\n\nThat's what makes the famous no-temp-variable swap work:\n\n```\na, b = b, a\n```\n\nThe right side builds a tuple `(b, a)` **first**, and only then unpacks it into the names on the left. Because the whole right side is worked out before any assigning happens, nothing gets clobbered.\n\nWhen you don't know or care how many items are in the middle, `*` collects the rest into a list:\n\n```\nfirst, *rest = [10, 20, 30, 40]     # first=10, rest=[20, 30, 40]\nfirst, *middle, last = [1, 2, 3, 4] # middle=[2, 3]\n```\n\nOnly one `*` per unpacking — with two, Python couldn't tell where one ends and the other starts.",
      },
      {
        kind: "trace",
        id: "t1",
        title: "Watch the swap work",
        intro:
          "This is the line that looks like it shouldn't work. The trick is that the whole right side is evaluated before anything is assigned.",
        code: "a = 1\nb = 2\na, b = b, a\nprint(a, b)\n",
        lines: [
          { code: "a = 1", what: "Stick 1 onto the name a.", state: "a = 1" },
          { code: "b = 2", what: "Stick 2 onto the name b.", state: "a = 1, b = 2" },
          {
            code: "a, b = b, a",
            what:
              "Python builds the tuple on the right BEFORE touching anything on the left. It looks up b (2) and a (1), giving the tuple (2, 1). Both old values are now safely captured.",
            state: "a = 1, b = 2, right side = (2, 1)",
          },
          {
            code: "a, b = b, a",
            what:
              "Only now does assignment happen: the tuple is unpacked, so a gets 2 and b gets 1. Nothing was overwritten mid-way, which is exactly why no temporary variable is needed.",
            state: "a = 2, b = 1",
          },
          { code: "print(a, b)", what: "They've swapped.", state: "a = 2, b = 1", output: "2 1" },
        ],
        takeaway:
          "Right side fully evaluated, then assigned. That single rule is why the swap works, and it's the same rule behind `x = x + 1`.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Swap without a temp",
        code: "a, b = 1, 2\na, b = b, a\nprint(a, b)\n",
        note: "Try adding a third variable and rotating them: a, b, c = c, a, b. The same rule applies.",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "Tuple gotchas",
        items: [
          {
            wrong: "single = (5)\nprint(type(single).__name__)",
            problem:
              "Prints 'int', not 'tuple'. Brackets alone don't make a tuple — the comma does. A one-item tuple needs a trailing comma.",
            right: "single = (5,)\nprint(type(single).__name__)",
          },
          {
            wrong: "point = (3, 4)\npoint[0] = 5",
            problem:
              "TypeError: 'tuple' object does not support item assignment. Tuples are immutable. If you need a changed version, build a new tuple.",
            right: "point = (3, 4)\npoint = (5, point[1])",
          },
          {
            wrong: "x, y = (1, 2, 3)",
            problem:
              "ValueError: too many values to unpack (expected 2). The number of names must match exactly — unless you use * to soak up the extras.",
            right: "x, *rest = (1, 2, 3)",
          },
        ],
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "first, *rest = [10, 20, 30, 40]\nprint(first, rest)\n",
        answer: "10 [20, 30, 40]",
        hints: [
          "`first` takes one value; `*rest` soaks up everything that's left.",
          "The starred name always comes out as a **list**, even when unpacking a tuple.",
        ],
        why:
          "`first` binds to the single first item. `*rest` collects all remaining items into a list — note it's a list, not a tuple, regardless of what you unpacked from.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: split a name into first, middles, last",
        buggy:
          "parts = 'John Fitzgerald Kennedy'.split()\nfirst, last = parts\nprint(first, last)\n",
        expected: "John ['Fitzgerald'] Kennedy",
        hints: [
          "Run it — ValueError, because there are three words but only two names to unpack into.",
          "You want the first, the last, and whatever middle names happen to be there. Which unpacking form handles 'and everything in between'?",
          "Use `first, *middles, last = parts`, then print all three.",
        ],
        solution:
          "parts = 'John Fitzgerald Kennedy'.split()\nfirst, *middles, last = parts\nprint(first, middles, last)\n",
        solutionWhy:
          "`*middles` sits between two fixed names, so it soaks up everything not claimed by first and last. This works for any number of middle names — including none, in which case middles is just an empty list.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Return two values",
        prompt:
          "Write a function `stats(xs)` that returns a tuple of (smallest, largest). Call stats([4,1,7,2]) and print the result. Expected: (1, 7)",
        starter: "def stats(xs):\n    ...\n\nprint(stats([4,1,7,2]))\n",
        expected: "(1, 7)",
        hints: [
          "Python has built-in min() and max() functions that each take a collection.",
          "To return two things, return them separated by a comma — that makes a tuple automatically.",
          "`return min(xs), max(xs)`",
        ],
        solution: "def stats(xs):\n    return min(xs), max(xs)\n\nprint(stats([4,1,7,2]))\n",
        solutionWhy:
          "`return a, b` builds a tuple, which is how Python functions return multiple values — there's no special syntax for it.\n\nThe caller usually unpacks it straight away: `low, high = stats(nums)`. That pairing of tuple-return and unpacking is one of the most common idioms in Python.",
      },
    ],
  },

  {
    id: "py.08.dicts",
    track: "python",
    index: 8,
    title: "Dictionaries",
    summary: "Key-value maps: get/set, .get(), iteration, and dict comprehensions.",
    concepts: ["py:dict", "py:dict-methods", "py:iteration"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Looking things up by name instead of position",
        body:
          "A list finds things by **position**. A **dict** finds them by whatever label you choose — a name, an id, a word.\n\n```\nages = {'Ada': 36, 'Ren': 29}\nprint(ages['Ada'])       # 36\n```\n\nEach entry is a **key** (the label) and a **value** (the thing stored). Keys must be unique and immutable — strings, numbers and tuples are fine; lists aren't.\n\nAdding and changing use the same syntax, which is worth noticing:\n\n```\nages['Kai'] = 41       # adds a new entry\nages['Ada'] = 37       # replaces the existing one\ndel ages['Ren']        # removes\n'Ada' in ages          # True — checks keys, not values\nlen(ages)              # how many entries\n```\n\nDicts remember insertion order (guaranteed since Python 3.7), so looping gives you entries in the order you added them.\n\nWhy dicts matter: looking up a key is fast no matter how big the dict is. Finding something in a list of a million items means potentially checking a million items; in a dict it's effectively instant. When you're matching things up by name or id, a dict is almost always the right structure.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Missing keys, and how to survive them",
        body:
          "Asking for a key that isn't there **raises KeyError** and stops your program:\n\n```\nages = {'Ada': 36}\nages['Nobody']        # KeyError: 'Nobody'\n```\n\nThat's often what you want — a missing key usually means a real bug. But when absence is expected, `.get()` returns `None` instead of exploding, and lets you supply a fallback:\n\n```\nages.get('Nobody')          # None\nages.get('Nobody', 0)       # 0\n```\n\nThat second form powers the single most common dict pattern in Python — counting things:\n\n```\ncounts = {}\nfor ch in 'banana':\n    counts[ch] = counts.get(ch, 0) + 1\n```\n\nOn the first sighting of a character, `.get(ch, 0)` gives 0, so it stores 1. On every later sighting it gives the running count. Without `.get`, the first line would KeyError before it ever got started.",
      },
      {
        kind: "trace",
        id: "t1",
        title: "Watch a word count build up",
        intro:
          "This pattern comes up constantly. Follow the counts dict as the loop goes round — pay attention to the first time each letter appears.",
        code: "counts = {}\nfor ch in 'bab':\n    counts[ch] = counts.get(ch, 0) + 1\nprint(counts)\n",
        lines: [
          { code: "counts = {}", what: "Start with an empty dict — no keys at all yet.", state: "counts = {}" },
          {
            code: "    counts[ch] = counts.get(ch, 0) + 1",
            what:
              "First pass, ch is 'b'. counts.get('b', 0) — there's no 'b' key yet, so instead of raising KeyError it hands back the fallback 0. Add 1, store under 'b'.",
            state: "counts = {'b': 1}",
          },
          {
            code: "    counts[ch] = counts.get(ch, 0) + 1",
            what: "Second pass, ch is 'a'. Same story: not present, so get returns 0, and 1 gets stored.",
            state: "counts = {'b': 1, 'a': 1}",
          },
          {
            code: "    counts[ch] = counts.get(ch, 0) + 1",
            what:
              "Third pass, ch is 'b' again — and this time it IS present, so get returns its current value 1. Add 1 to get 2, and store it back — replacing the old entry rather than adding a second one.",
            state: "counts = {'b': 2, 'a': 1}",
          },
          {
            code: "print(counts)",
            what:
              "Keys appear in first-insertion order — 'b' was seen first, so it's listed first, even though 'a' was added later and 'b' was updated after that. Updating a value doesn't move the key.",
            output: "{'b': 2, 'a': 1}",
          },
        ],
        takeaway:
          "`d[k] = d.get(k, 0) + 1` is the counting idiom. The fallback handles the first sighting; every later one just increments.",
      },
      {
        kind: "read",
        id: "r3",
        title: "Looping over a dict",
        body:
          "Looping over a dict directly gives you its **keys**:\n\n```\nfor name in ages:\n    print(name)\n```\n\nMost of the time you want both halves, and `.items()` gives you each entry as a (key, value) pair — which you unpack straight into two names, exactly as in the last lesson:\n\n```\nfor name, age in ages.items():\n    print(f'{name} is {age}')\n```\n\nThe three views:\n\n- `.keys()` — the labels (same as looping the dict directly)\n- `.values()` — the stored values, no labels\n- `.items()` — both, as pairs\n\nAnd a **dict comprehension** builds a new dict in one line — same shape as a list comprehension but with `key: value`:\n\n```\nsquares = {n: n * n for n in range(4)}     # {0: 0, 1: 1, 2: 4, 3: 9}\nflipped = {v: k for k, v in ages.items()}  # swap keys and values\n```\n\nMerging with `|` (Python 3.9+) gives a new dict, with the right-hand side winning any clashes.",
      },
      {
        kind: "example",
        id: "e1",
        title: "The patterns you'll reuse",
        code:
          "counts = {}\nfor ch in 'banana':\n    counts[ch] = counts.get(ch, 0) + 1\nprint(counts)\n\n"
          + "ages = {'Ada': 36, 'Ren': 29}\nfor name, age in ages.items():\n    print(f'{name} is {age}')\n\n"
          + "print({v: k for k, v in ages.items()})\n",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "Dict mistakes",
        items: [
          {
            wrong: "prices = {'apple': 1.0}\nprint(prices['banana'])",
            problem:
              "KeyError: 'banana'. Square brackets demand the key exists. When it might not, use .get() with a sensible fallback.",
            right: "prices = {'apple': 1.0}\nprint(prices.get('banana', 0))",
          },
          {
            wrong: "d = {}\nd[['a', 'b']] = 1",
            problem:
              "TypeError: unhashable type: 'list'. Keys must be immutable, because a key that could change would break the lookup. Use a tuple instead.",
            right: "d = {}\nd[('a', 'b')] = 1",
          },
          {
            wrong: "ages = {'Ada': 36, 'Ren': 29}\nfor name in ages:\n    print(name, ages[name])",
            problem:
              "Not wrong exactly — it works — but it looks up each key again on every pass when .items() already has the value to hand. Use .items() when you need both.",
            right: "ages = {'Ada': 36, 'Ren': 29}\nfor name, age in ages.items():\n    print(name, age)",
          },
          {
            wrong: "ages = {'Ada': 36}\nif 36 in ages:\n    print('found')",
            problem:
              "Never prints. `in` checks **keys**, not values — and 36 is a value here. To search values you'd need `36 in ages.values()`.",
            right: "ages = {'Ada': 36}\nif 36 in ages.values():\n    print('found')",
          },
        ],
      },
      {
        kind: "cloze",
        id: "cl1",
        title: "Fill in the counter",
        prompt:
          "Complete the standard counting pattern so it tallies each character. Two gaps: the method that survives a missing key, and its fallback value.",
        template: "counts = {}\nfor ch in 'banana':\n    counts[ch] = counts.{{0}}(ch, {{1}}) + 1\nprint(counts)\n",
        blanks: [
          { answer: "get", width: 4 },
          { answer: "0", width: 2 },
        ],
        explanation:
          "`.get(ch, 0)` returns the current count if the key exists, or 0 the first time it's seen — which is exactly what lets `+ 1` work on the very first sighting without a KeyError.",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "d = {'a': 1} | {'a': 2, 'b': 3}\nprint(d)\n",
        answer: "{'a': 2, 'b': 3}",
        hints: [
          "`|` merges two dicts into a new one. The question is what happens to the key they share.",
          "The right-hand dict wins any clash — think of it as the left one being updated by the right.",
        ],
        why:
          "Merging keeps every key from both sides, and when both define the same key the right-hand value wins. So 'a' becomes 2, and 'b' comes along from the right.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: safe lookup with a default of 0",
        buggy: "prices = {'apple': 1.0, 'pear': 1.5}\nprint(prices['banana'])\n",
        expected: "0",
        hints: [
          "Run it — KeyError, because 'banana' isn't in the dict and square brackets insist the key exists.",
          "There's a method that returns a fallback instead of raising when the key is missing.",
          "`prices.get('banana', 0)`",
        ],
        solution: "prices = {'apple': 1.0, 'pear': 1.5}\nprint(prices.get('banana', 0))\n",
        solutionWhy:
          "`.get(key, default)` returns the default rather than raising. Use it when a missing key is a normal, expected situation.\n\nKeep using square brackets when a missing key means something has genuinely gone wrong — an exception you can see beats a silent 0 that quietly corrupts a calculation later.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Word count",
        prompt:
          "Given text = 'to be or not to be', print a dict mapping each word to how many times it appears. Expected: {'to': 2, 'be': 2, 'or': 1, 'not': 1}",
        starter: "text = 'to be or not to be'\n# print counts dict here\n",
        expected: "{'to': 2, 'be': 2, 'or': 1, 'not': 1}",
        hints: [
          "Same pattern as counting characters, but loop over words instead — `.split()` gives you the list.",
          "Start with an empty dict, then for each word do the `counts.get(word, 0) + 1` step.",
          "The expected order is insertion order: 'to' appears first in the text, so it's first in the dict.",
        ],
        solution:
          "text = 'to be or not to be'\ncounts = {}\nfor word in text.split():\n    counts[word] = counts.get(word, 0) + 1\nprint(counts)\n",
        solutionWhy:
          "Identical to the character-counting trace, just splitting into words first.\n\nThe standard library has `collections.Counter` which does this in one line — `Counter(text.split())` — and you'll meet it later. Writing it by hand once makes clear what Counter is actually doing for you.",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "Which value can be a dict key?",
        prompt: "Keys must be hashable, which in practice means immutable.",
        options: ["['a', 'b']", "{'x': 1}", "(1, 'two')", "{1, 2, 3}"],
        correctIndex: 2,
        optionFeedback: [
          "A list is mutable, so it can't be a key — its contents could change and the lookup would break.",
          "A dict is mutable too, so it can't be a key either.",
          "Right. A tuple of immutable values is itself immutable, and makes a perfectly good key.",
          "A set is mutable. (A frozenset, its immutable cousin, would work.)",
        ],
        why:
          "Only immutable values can be keys, because a key that changed after insertion could no longer be found. Tuples of immutables qualify; lists, dicts and sets don't.",
      },
    ],
  },

  {
    id: "py.09.sets",
    track: "python",
    index: 9,
    title: "Sets & uniqueness",
    summary: "Unordered collections of unique values; fast membership; set algebra.",
    concepts: ["py:set", "py:set-algebra"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "A collection with no duplicates and no order",
        body:
          "A **set** holds unique values, with no positions and no order:\n\n```\ncolours = {'red', 'green', 'red'}\nprint(colours)          # {'red', 'green'} — the duplicate is gone\n```\n\nBecause there's no order, there's no indexing — `colours[0]` is an error. What you get instead is **very fast membership testing**, and automatic de-duplication.\n\n```\ncolours.add('blue')\ncolours.discard('red')     # no error if it's missing\n'green' in colours         # True — and fast\n```\n\nThe speed point is the real reason sets exist. Checking `x in some_list` may have to scan the entire list; `x in some_set` is effectively instant however large the set is. If you're repeatedly asking \"have I seen this before?\", a set is the tool.\n\nOne trap worth knowing now: `{}` is an **empty dict**, not an empty set. Python gave the braces to dicts first. For an empty set you must write `set()`.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Set algebra",
        body:
          "Sets support the operations from school maths, and they're genuinely useful for comparing two collections:\n\n```\na = {1, 2, 3}\nb = {2, 3, 4}\n\na | b     # {1, 2, 3, 4}  union — in either\na & b     # {2, 3}        intersection — in both\na - b     # {1}           difference — in a but not b\na ^ b     # {1, 4}        symmetric difference — in one but not both\n```\n\nThese answer real questions in one line. Which users are in both groups? `group_a & group_b`. Which permissions does this role have that the other doesn't? `role_a - role_b`. Doing that with nested loops takes ten lines and runs slower.\n\nSets also make de-duplication trivial:\n\n```\nunique = set([1, 2, 2, 3])       # {1, 2, 3}\nunique = list(set(items))        # back to a list, order NOT preserved\n```\n\nThat last caveat matters — if order matters to you, `set()` will scramble it, and you need the loop-with-a-seen-set pattern instead.",
      },
      {
        kind: "categorize",
        id: "cat1",
        title: "Which structure fits the job?",
        prompt:
          "Given what you now know about lists, dicts and sets, sort each requirement into the structure that suits it best.",
        buckets: ["list", "dict", "set"],
        items: [
          { text: "keep items in the order added", bucket: 0, why: "Lists preserve order and allow duplicates — the default choice for a sequence." },
          { text: "look up a price by product name", bucket: 1, why: "That's a key-to-value mapping, which is exactly what a dict is for." },
          { text: "check 'have I seen this id before?'", bucket: 2, why: "Fast membership testing with no duplicates — the classic set use." },
          { text: "strip duplicates out of some data", bucket: 2, why: "Sets discard duplicates automatically by construction." },
          { text: "count how often each word appears", bucket: 1, why: "You're mapping each word to a number, so a dict." },
          { text: "store a to-do list in priority order", bucket: 0, why: "Order is the whole point, and duplicates are allowed." },
        ],
      },
      {
        kind: "example",
        id: "e1",
        title: "Dedupe while preserving order",
        code:
          "seen = set()\nout = []\nfor x in [1, 2, 2, 3, 1, 4]:\n    if x not in seen:\n        seen.add(x)\n        out.append(x)\nprint(out)\nprint(list(set([1, 2, 2, 3, 1, 4])))\n",
        note:
          "Two approaches. The loop keeps first-seen order; `set()` alone is shorter but gives no order guarantee. Use the loop when order matters.",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "Set gotchas",
        items: [
          {
            wrong: "s = {}\ns.add(1)",
            problem:
              "AttributeError: 'dict' object has no attribute 'add'. `{}` creates an empty DICT, not an empty set — braces belong to dicts when there's nothing inside to disambiguate.",
            right: "s = set()\ns.add(1)",
          },
          {
            wrong: "s = {3, 1, 2}\nprint(s[0])",
            problem:
              "TypeError: 'set' object is not subscriptable. Sets have no order, so there's no 'first' item to index. Convert to a list first if you need positions.",
            right: "s = {3, 1, 2}\nprint(sorted(s)[0])",
          },
          {
            wrong: "items = ['b', 'a', 'b']\nprint(list(set(items)))",
            problem:
              "De-duplicates correctly, but the order is not guaranteed to match the original. If you need first-seen order, loop with a `seen` set instead of converting.",
            right: "items = ['b', 'a', 'b']\nseen = set()\nout = [x for x in items if not (x in seen or seen.add(x))]\nprint(out)",
          },
        ],
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "print({1,2,3} & {2,3,4})\n",
        answer: "{2, 3}",
        hints: [
          "`&` is the intersection operator — it keeps only what appears in both sets.",
          "Which values are present in {1,2,3} AND in {2,3,4}?",
        ],
        why: "Intersection keeps only values found in both sets. 1 is only in the first, 4 only in the second, so 2 and 3 remain.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Unique letters",
        prompt: "Print how many different letters appear in 'mississippi'. Expected: 4",
        starter: "# print the count\n",
        expected: "4",
        hints: [
          "A string can be handed straight to set() — you get a set of its characters.",
          "Sets drop duplicates automatically, so all that's left is to measure the size.",
          "`print(len(set('mississippi')))`",
        ],
        solution: "print(len(set('mississippi')))\n",
        solutionWhy:
          "`set('mississippi')` gives {'m','i','s','p'} — every repeat collapses away — and `len` counts them. Four distinct letters.\n\nThis one-liner replaces what would otherwise be a loop with a seen-list and a membership check on every character.",
      },
    ],
  },

  {
    id: "py.10.comprehensions",
    track: "python",
    index: 10,
    title: "Comprehensions",
    summary: "List, dict and set comprehensions with conditions and nested loops.",
    concepts: ["py:comprehensions", "py:filter-map"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "A loop that builds a list, in one line",
        body:
          "You've already written this shape several times: make an empty list, loop, append.\n\n```\nsquares = []\nfor n in range(5):\n    squares.append(n * n)\n```\n\nThat pattern is so common Python has dedicated syntax for it — a **list comprehension**:\n\n```\nsquares = [n * n for n in range(5)]\n```\n\nSame result, one line. The pieces map directly onto the loop version:\n\n- `n * n` — what to append (this goes **first**, which is the bit that feels backwards at first)\n- `for n in range(5)` — the loop header, unchanged\n\nRead it left to right as: *\"n times n, for each n in range 5\"*.\n\nAdd a condition on the end to skip items:\n\n```\n[n * n for n in range(5) if n % 2 == 0]     # only even n\n```\n\nWhich corresponds to putting an `if` inside the loop before the append.\n\nThe reason to use them isn't brevity for its own sake — it's that the whole operation reads as a single thought (\"the squares of the even numbers\") rather than four lines you have to mentally execute.",
      },
      {
        kind: "trace",
        id: "t1",
        title: "Translate a loop into a comprehension",
        intro:
          "Watch the four-line version become the one-line version, piece by piece. The pieces don't change — only where they sit.",
        code: "squares = []\nfor n in range(5):\n    if n % 2 == 0:\n        squares.append(n * n)\n\n# becomes:\nsquares = [n * n for n in range(5) if n % 2 == 0]\n",
        lines: [
          {
            code: "squares = []",
            what:
              "The empty list disappears entirely in the comprehension — the square brackets around the whole expression take its place.",
            state: "nothing left to write for this line",
          },
          {
            code: "for n in range(5):",
            what: "This moves into the middle of the comprehension, completely unchanged.",
            state: "[ ...            for n in range(5)            ]",
          },
          {
            code: "    if n % 2 == 0:",
            what: "The condition moves to the end, also unchanged apart from losing its colon.",
            state: "[ ...            for n in range(5) if n % 2 == 0 ]",
          },
          {
            code: "        squares.append(n * n)",
            what:
              "Whatever you were appending moves to the FRONT. This is the only piece that changes position, and it's why comprehensions read oddly until you've done a few.",
            state: "[ n * n          for n in range(5) if n % 2 == 0 ]",
          },
          {
            code: "squares = [n * n for n in range(5) if n % 2 == 0]",
            what: "The finished comprehension. Same loop, same condition, same appended value — rearranged.",
            output: "[0, 4, 16]",
          },
        ],
        takeaway:
          "expression first, then the for, then the if. If a comprehension confuses you, mentally unfold it back into the loop — they're exactly equivalent.",
      },
      {
        kind: "read",
        id: "r2",
        title: "The other three kinds",
        body:
          "The same syntax builds sets and dicts, just with different brackets:\n\n```\n{n * n for n in range(5)}          # set — braces\n{n: n * n for n in range(5)}       # dict — braces with key: value\n(n * n for n in range(5))          # generator — round brackets\n```\n\nThe **dict** version is the one you'll use most after lists — it's the natural way to build a lookup table from something you already have:\n\n```\nnames = ['Ada', 'Ren']\nlengths = {name: len(name) for name in names}     # {'Ada': 3, 'Ren': 3}\n```\n\nThe **generator** version doesn't build anything up front — it produces values one at a time as you ask for them. For a big sequence that saves a lot of memory, and it's why `sum(n * n for n in range(1000000))` is fine while building the full list first would be wasteful.\n\nYou can also nest loops. The order reads the same as nested for-loops would:\n\n```\n[(x, y) for x in range(3) for y in range(3) if x != y]\n```\n\nA word of caution: comprehensions stop being an improvement once they get long. If you're nesting two loops and two conditions, a plain loop is easier to read and easier to debug. Brevity isn't the goal — clarity is.",
      },
      {
        kind: "example",
        id: "e1",
        title: "All four in action",
        code:
          "print([n * n for n in range(5)])\n"
          + "print({n % 3 for n in range(10)})\n"
          + "print({name: len(name) for name in ['Ada', 'Ren']})\n"
          + "print(sum(n * n for n in range(5)))\n"
          + "print([(x, y) for x in range(3) for y in range(3) if x != y])\n",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "Comprehension mistakes",
        items: [
          {
            wrong: "print([n for n in range(5) if n % 2])",
            problem:
              "Gives the ODD numbers [1, 3], which surprises people expecting evens. `n % 2` is the remainder — it's 1 (truthy) for odds and 0 (falsy) for evens. Compare explicitly if you mean evens.",
            right: "print([n for n in range(5) if n % 2 == 0])",
          },
          {
            wrong: "squares = [n * n for n in range(5)]\nprint(squares.append(25))",
            problem:
              "Prints None. A comprehension does produce a real list, but `.append()` still returns None like always — the comprehension isn't the problem, the printed append is.",
            right: "squares = [n * n for n in range(5)]\nsquares.append(25)\nprint(squares)",
          },
          {
            wrong: "gen = (n * n for n in range(3))\nprint(list(gen))\nprint(list(gen))",
            problem:
              "The second line prints []. A generator is consumed as you read it — once exhausted, it's empty. If you need the values more than once, build a list instead.",
            right: "vals = [n * n for n in range(3)]\nprint(list(vals))\nprint(list(vals))",
          },
        ],
      },
      {
        kind: "parsons",
        id: "pa1",
        title: "Assemble a comprehension",
        prompt:
          "These fragments make a comprehension that collects the squares of the odd numbers below 10. Put them in the right order.",
        solution: ["result = [", "    n * n", "    for n in range(10)", "    if n % 2 != 0", "]", "print(result)"],
        expectedOutput: "[1, 9, 25, 49, 81]",
        hints: [
          "A comprehension always goes: the value you want, then the loop, then the filter.",
          "The expression comes first — that's the piece that moved when you translated from a loop.",
          "Opening bracket, expression, for-clause, if-clause, closing bracket, then the print.",
        ],
        explanation:
          "Split across lines like this, the structure is much easier to see — and it's perfectly valid Python. Long comprehensions are often written this way precisely for that reason.",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "print([x*x for x in range(1,6) if x % 2])\n",
        answer: "[1, 9, 25]",
        hints: [
          "range(1,6) gives 1,2,3,4,5. Now — what does the bare `if x % 2` actually keep?",
          "`x % 2` is 1 for odd numbers (truthy) and 0 for even (falsy). So it keeps the ODD ones.",
        ],
        why:
          "`if x % 2` with no comparison keeps values whose remainder is truthy — that is, the odds. So 1, 3 and 5 survive, and their squares are 1, 9 and 25.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: dict of number → square, evens only",
        buggy: "print({n: n*n for n in range(6) if n % 2})\n",
        expected: "{0: 0, 2: 4, 4: 16}",
        hints: [
          "Run it — you get the odds, not the evens.",
          "`n % 2` is truthy for odd numbers. You want the opposite.",
          "Change the condition to `if n % 2 == 0`.",
        ],
        solution: "print({n: n*n for n in range(6) if n % 2 == 0})\n",
        solutionWhy:
          "`n % 2` on its own is truthy for odds. Writing `== 0` makes the intent explicit and selects evens.\n\nThis is worth a habit: even though bare `if n % 2` works, spelling out `== 0` reads as 'divides evenly' and eliminates a very easy off-by-one-concept mistake.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Flatten",
        prompt:
          "Given m = [[1,2],[3,4],[5,6]], print a single flat list containing every number: [1, 2, 3, 4, 5, 6]",
        starter: "m = [[1,2],[3,4],[5,6]]\n# print here\n",
        expected: "[1, 2, 3, 4, 5, 6]",
        hints: [
          "You need two loops: one over the inner lists, then one over the numbers inside each.",
          "In a comprehension, nested loops are written left to right in the same order you'd nest them normally.",
          "`[n for row in m for n in row]` — outer loop first, inner loop second, expression at the front.",
        ],
        solution: "m = [[1,2],[3,4],[5,6]]\nprint([n for row in m for n in row])\n",
        solutionWhy:
          "The two for-clauses read in the same order as nested loops: for each row in m, then for each n in that row, produce n.\n\nUnfolded, it's exactly:\n\n```\nout = []\nfor row in m:\n    for n in row:\n        out.append(n)\n```\n\nIf the nested form ever confuses you, writing it out like that is the fastest way to check you've got the order right.",
      },
    ],
  },

  {
    id: "py.11.functions",
    track: "python",
    index: 11,
    title: "Functions",
    summary: "Definitions, defaults, *args, **kwargs, keyword-only, and the mutable-default trap.",
    concepts: ["py:functions", "py:args", "py:kwargs", "py:default-args-trap"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "What a function is, and why bother",
        body:
          "A **function** is a named chunk of code you can run whenever you like, as many times as you like.\n\n```\ndef greet(name):\n    return f'hello, {name}'\n\nprint(greet('Ada'))\nprint(greet('Ren'))\n```\n\nBreaking that down:\n\n- **`def`** starts a definition. Like `if` and `for`, the line ends in a colon and the body is indented.\n- **`greet`** is the name you're giving it.\n- **`name`** in the brackets is a **parameter** — a placeholder for a value that gets supplied later.\n- **`return`** hands a value back to whoever called it.\n\nDefining a function doesn't run it. `def` just stores the recipe under a name; nothing happens until you **call** it by writing `greet('Ada')`.\n\nThe value you pass in when calling — `'Ada'` — is an **argument**. Parameter is the name in the definition, argument is the actual value at the call. People mix the words up constantly and it rarely matters, but it's useful to know they're different things.\n\nWhy bother? Two reasons that matter immediately: you write the logic once instead of copying it around, and you get to give a chunk of code a **name**, which makes the code that uses it readable. `total = calculate_tax(income)` says what's happening; ten lines of inline arithmetic doesn't.",
      },
      {
        kind: "trace",
        id: "t1",
        title: "Watch a function call jump and come back",
        intro:
          "Calling a function makes execution jump somewhere else and then return to where it left off. That jump is worth watching once.",
        code: "def double(n):\n    result = n * 2\n    return result\n\nx = double(5)\nprint(x)\n",
        lines: [
          {
            code: "def double(n):",
            what:
              "Python reads the definition and stores it under the name `double`. It does NOT run the body — the lines inside are just filed away for later. Execution skips straight past to after the definition.",
            state: "double is defined (not run)",
          },
          {
            code: "x = double(5)",
            what:
              "Right side first, as always. This is a call, so execution jumps into the function — and the argument 5 gets bound to the parameter n.",
            state: "inside double, with n = 5",
          },
          {
            code: "    result = n * 2",
            what:
              "Now inside the body. n is 5, so result becomes 10. Note `result` only exists inside this call — it's local to the function and vanishes when the call ends.",
            state: "n = 5, result = 10",
          },
          {
            code: "    return result",
            what:
              "`return` does two things: it hands the value 10 back, and it ends the function immediately. Any lines after a return would never run.",
            state: "returning 10",
          },
          {
            code: "x = double(5)",
            what:
              "Execution lands back where it jumped from. The call expression is now just the value 10, which gets stuck onto x.",
            state: "x = 10",
          },
          {
            code: "print(x)",
            what: "Shows 10. Note `result` and `n` no longer exist out here — they only lived inside the call.",
            state: "x = 10",
            output: "10",
          },
        ],
        takeaway:
          "A call jumps in, binds the arguments to the parameters, runs until it hits `return`, then jumps back with that value. Names created inside a function are local — they don't leak out.",
      },
      {
        kind: "read",
        id: "r2",
        title: "return vs print — the one that confuses everyone",
        body:
          "These look similar and do completely different jobs. Getting them muddled is the single most common early function bug.\n\n**`print`** shows something to a human. The value goes to the screen and is gone.\n\n**`return`** hands a value back to the code that made the call, so it can be stored, added, passed on, whatever.\n\n```\ndef add_printing(a, b):\n    print(a + b)         # shows it\n\ndef add_returning(a, b):\n    return a + b         # hands it back\n\nx = add_printing(2, 3)     # displays 5\nprint(x)                   # None! nothing was returned\n\ny = add_returning(2, 3)    # displays nothing\nprint(y)                   # 5\n```\n\nA function with no `return` gives back **`None`** automatically. So if you print a function's result and get `None`, that's almost always the diagnosis: the function displayed its answer instead of returning it.\n\nRule of thumb: **functions that compute something should return it.** Let the caller decide whether to print it. A function that prints is much harder to reuse — you can't add its result to anything, test it, or feed it into another function.",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "The function mistakes to expect",
        items: [
          {
            wrong: "def add(a, b):\n    print(a + b)\n\ntotal = add(2, 3)\nprint(total * 2)",
            problem:
              "TypeError: unsupported operand type(s) for *: 'NoneType' and 'int'. The function printed 5 but returned nothing, so total is None — and you can't multiply None. Return the value instead of printing it.",
            right: "def add(a, b):\n    return a + b\n\ntotal = add(2, 3)\nprint(total * 2)",
          },
          {
            wrong: "def greet():\n    return 'hello'\n\nprint(greet)",
            problem:
              "Shows something like <function greet at 0x...> instead of 'hello'. Without the brackets you're referring to the function itself rather than calling it. The `()` is what actually runs it.",
            right: "def greet():\n    return 'hello'\n\nprint(greet())",
          },
          {
            wrong: "def check(n):\n    if n > 0:\n        return 'positive'\n\nprint(check(-5))",
            problem:
              "Prints None. The if didn't match, so the function ran off the end without hitting a return — and a function that returns nothing returns None. Make sure every path returns something.",
            right: "def check(n):\n    if n > 0:\n        return 'positive'\n    return 'not positive'\n\nprint(check(-5))",
          },
          {
            wrong: "def scale(n):\n    factor = 3\n    return n * factor\n\nprint(scale(2))\nprint(factor)",
            problem:
              "NameError: name 'factor' is not defined. Names created inside a function are local to it and disappear when the call ends. That's a feature — it stops functions interfering with each other.",
            right: "def scale(n):\n    factor = 3\n    return n * factor\n\nprint(scale(2))",
          },
        ],
      },
      {
        kind: "parsons",
        id: "pa1",
        title: "Assemble a function",
        prompt:
          "Put these lines in order to define a function that squares a number, then call it and show the result. Watch the indentation — the indented lines are the body.",
        solution: [
          "def square(n):",
          "    answer = n * n",
          "    return answer",
          "print(square(4))",
        ],
        expectedOutput: "16",
        hints: [
          "A function has to be defined before it can be called, so the print line can't come first.",
          "Inside the body you need to work the value out before you can return it.",
          "def line, then the calculation, then the return — all indented — and finally the unindented call.",
        ],
        explanation:
          "The three indented lines are the body, stored for later. The unindented print is the only line that actually runs anything, and it triggers the jump into the function.",
      },
      {
        kind: "read",
        id: "r3",
        title: "Default values and named arguments",
        body:
          "A parameter can have a **default**, making it optional at the call:\n\n```\ndef greet(name, greeting='hello'):\n    return f'{greeting}, {name}'\n\ngreet('Ada')                      # 'hello, Ada'\ngreet('Ada', 'welcome')           # 'welcome, Ada'\ngreet('Ada', greeting='hi')       # 'hi, Ada'\n```\n\nParameters with defaults must come **after** ones without — Python can't work out which is which otherwise.\n\nThat third call passes the argument **by name**. Worth doing whenever the meaning isn't obvious from the value alone. Compare:\n\n```\ncreate_user('Ada', True, False)\ncreate_user('Ada', is_admin=True, send_email=False)\n```\n\nThe second needs no explanation. Bare `True, False` at a call site is a small mystery for every future reader.\n\nTwo more pieces of syntax you'll see around, worth recognising now even if you don't reach for them yet:\n\n- **`*args`** collects any extra positional arguments into a tuple\n- **`**kwargs`** collects any extra named arguments into a dict\n\nSo `def total(*nums)` accepts any number of values and gets them as `nums`.",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "def add(x, y=10):\n    return x + y\nprint(add(1), add(1, 2))\n",
        answer: "11 3",
        hints: [
          "The second parameter has a default, so the first call supplies only one argument.",
          "In `add(1)`, x is 1 and y falls back to its default of 10. In `add(1, 2)`, the 2 overrides that default.",
        ],
        why:
          "`add(1)` uses the default y=10, giving 11. `add(1, 2)` supplies y explicitly, so the default is ignored and you get 3. print shows both results separated by a space.",
      },
      {
        kind: "read",
        id: "r4",
        title: "The mutable default trap",
        body:
          "This one is genuinely surprising, and it catches experienced people too.\n\n**A default value is created once, when the `def` line runs — not fresh on each call.**\n\nFor an immutable default like `10` or `'hello'` that's harmless. But for a list or a dict it means every call that relies on the default shares the *same object*:\n\n```\ndef append_to(x, xs=[]):\n    xs.append(x)\n    return xs\n\nprint(append_to(1))    # [1]\nprint(append_to(2))    # [1, 2]  — not [2]!\n```\n\nThe second call didn't get a fresh empty list. It got the same list the first call already put something in.\n\nThe fix is a standard pattern you'll see everywhere:\n\n```\ndef append_to(x, xs=None):\n    if xs is None:\n        xs = []\n    xs.append(x)\n    return xs\n```\n\n`None` is immutable and safe as a default, and the check creates a genuinely new list on each call that needs one.\n\n**Rule: never use a list, dict or set as a default value.** Use `None` and build it inside.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: the mutable-default trap",
        buggy:
          "def append_to(x, xs=[]):\n    xs.append(x)\n    return xs\nprint(append_to(1))\nprint(append_to(2))\n",
        expected: "[1]\n[2]",
        hints: [
          "Run it — the second call shows [1, 2] when you'd expect [2]. The list from the first call survived.",
          "The default `[]` was built once when the def line ran, so both calls share that one list.",
          "Use `xs=None` as the default, then inside the function do `if xs is None: xs = []` before appending.",
        ],
        solution:
          "def append_to(x, xs=None):\n    if xs is None:\n        xs = []\n    xs.append(x)\n    return xs\nprint(append_to(1))\nprint(append_to(2))\n",
        solutionWhy:
          "`None` is immutable, so there's no shared object to accumulate into. The `if xs is None` check runs on every call and builds a genuinely fresh list each time the caller didn't supply one.\n\nNote you still get the useful behaviour when a caller *does* pass a list — `append_to(3, my_list)` appends to theirs, exactly as before. Only the default case changed.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Variadic sum",
        prompt:
          "Write a function `total(*nums)` that returns the sum of however many numbers it's given. Print total(1, 2, 3, 4). Expected: 10",
        starter: "def total(*nums):\n    ...\n\nprint(total(1,2,3,4))\n",
        expected: "10",
        hints: [
          "The `*nums` means all the arguments arrive as a single collection called nums, which you can loop over.",
          "You could loop with a running total, or use Python's built-in sum() function on nums directly.",
          "Remember to `return` the answer rather than printing it — the print is already there on the calling line.",
        ],
        solution: "def total(*nums):\n    return sum(nums)\n\nprint(total(1,2,3,4))\n",
        solutionWhy:
          "`*nums` gathers all four arguments into a tuple, and the built-in `sum()` adds up any collection of numbers.\n\nWriting it out longhand works identically and is worth being able to do:\n\n```\ndef total(*nums):\n    running = 0\n    for n in nums:\n        running += n\n    return running\n```\n\nNote the `return` in both. Printing inside the function instead would show the number but hand back None, so the outer print would display None.",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "Why never `def f(x=[])`?",
        prompt: "The default list is:",
        options: [
          "Created fresh on each call",
          "Created once, shared across all calls",
          "A syntax error",
          "Slower than a fresh list",
        ],
        correctIndex: 1,
        optionFeedback: [
          "That's the intuitive expectation, and exactly why this trap catches people — but it isn't what happens.",
          "Right. The default is built once when the def line runs, so every call relying on it shares that one object.",
          "It's perfectly valid syntax — which is what makes it dangerous. Python won't warn you.",
          "Speed isn't the issue at all; the problem is state leaking between calls.",
        ],
        why:
          "Defaults are evaluated once at definition time, so all callers relying on the default share the same list. Use None and create the list inside the function.",
      },
      {
        kind: "explain",
        id: "x1",
        title: "Explain",
        prompt:
          "Someone's function seems to work — it displays the right number when they run it — but when they try to use its result in a calculation they get a TypeError about NoneType. What have they done, and what's the fix?",
        minWords: 25,
        sampleAnswer:
          "They used print inside the function instead of return. The number appears on screen, so it looks correct, but the function hands back None — and None can't be used in arithmetic. They should return the value and let whoever calls it decide whether to print it.",
      },
    ],
  },

  {
    id: "py.12.types",
    track: "python",
    index: 12,
    title: "Type hints (modern)",
    summary: "PEP 604 unions (`X | Y`), built-in generics, and PEP 695 type aliases.",
    concepts: ["py:type-hints", "py:generics", "py:pep604"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Writing down what you meant",
        body:
          "Python doesn't require you to declare types. But you can **annotate** them anyway, purely as documentation:\n\n```\ndef greet(name: str) -> str:\n    return f'hello, {name}'\n```\n\n`name: str` says the parameter should be a string; `-> str` says the function hands back a string.\n\nThe crucial thing to understand up front: **Python does not check these at runtime.** Nothing stops you passing a number. The hint is a note for humans and for tools.\n\nSo what's the point? Three things, all real:\n\n- **Editors** use them for autocomplete and to flag mistakes as you type.\n- **Type checkers** like mypy or pyright read them and catch whole classes of bug before you run anything.\n- **Readers** — including you in six months — can see what a function expects without reading its body.\n\nThey're optional. Plenty of good Python has none. But on anything that lives longer than a script, they pay for themselves quickly.",
      },
      {
        kind: "read",
        id: "r2",
        title: "The modern syntax",
        body:
          "Older Python needed imports from the `typing` module for anything beyond the basics. Modern Python mostly doesn't:\n\n**Built-in generics** — say what's inside a container:\n\n```\ndef total(nums: list[int]) -> int: ...\ndef lookup(d: dict[str, float]) -> float: ...\n```\n\n**Unions with `|`** (3.10+) — when a value could be one of several types:\n\n```\ndef parse(s: str) -> int | None:      # an int, or nothing\n```\n\n`X | None` is extremely common — it's how you say \"this might not be there\". You'll see the older spelling `Optional[int]` in existing code; they mean exactly the same thing.\n\n**Type aliases** (3.12+) — give a name to a complicated type:\n\n```\ntype Vec = list[float]\n\ndef norm(v: Vec) -> float: ...\n```\n\nHandy when the same shape appears in a dozen signatures and `list[tuple[str, int]]` is getting hard to read.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Hints in practice",
        code:
          "def parse_age(s: str) -> int | None:\n"
          + "    return int(s) if s.isdigit() else None\n\n"
          + "print(parse_age('42'), parse_age('x'))\n\n"
          + "type Vec = list[float]\n"
          + "def norm(v: Vec) -> float:\n"
          + "    return sum(x*x for x in v) ** 0.5\n"
          + "print(norm([3.0, 4.0]))\n",
        note:
          "Both functions run exactly as they would without the annotations. Try passing parse_age a number and see that Python doesn't complain — only a type checker would.",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "What hints do and don't do",
        items: [
          {
            wrong: "def double(n: int) -> int:\n    return n * 2\n\nprint(double('ab'))",
            problem:
              "Prints 'abab' — no error at all. The hint says int, but Python never checks. Strings support `*`, so it happily does something you didn't intend. Hints catch this only when you run a type checker.",
            right: "def double(n: int) -> int:\n    if not isinstance(n, int):\n        raise TypeError('expected int')\n    return n * 2",
          },
          {
            wrong: "def add_item(item: str, items: list = []) -> list:\n    items.append(item)\n    return items",
            problem:
              "Annotating the parameter doesn't rescue you from the mutable-default trap — the shared list is still shared. Hints are documentation, not protection.",
            right: "def add_item(item: str, items: list[str] | None = None) -> list[str]:\n    if items is None:\n        items = []\n    items.append(item)\n    return items",
          },
          {
            wrong: "def f(x: int = 'hello') -> int:\n    return x",
            problem:
              "Runs without complaint despite the default contradicting the annotation. Python only stores annotations; it never validates them against the defaults.",
            right: "def f(x: int = 0) -> int:\n    return x",
          },
        ],
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "def f(x: int) -> str:\n    return x  # hints don't enforce\nprint(type(f(5)).__name__)\n",
        answer: "int",
        hints: [
          "The annotation claims the return is a str. But what does the body actually return?",
          "Annotations are never enforced at runtime — the function hands back whatever the code hands back, which here is the int it was given.",
        ],
        why:
          "The `-> str` is a note, not a rule. The body returns x unchanged, so an int comes out and `type(...)` reports int. A type checker would flag this line; Python itself never will.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Annotate a signature",
        prompt:
          "Write `top(nums, k)` returning the k largest numbers, largest first. Annotate the parameters as list[int] and int, and the return as list[int]. Print top([4,1,7,2,8], 3). Expected: [8, 7, 4]",
        starter: "def top(nums, k):\n    ...\n\nprint(top([4,1,7,2,8], 3))\n",
        expected: "[8, 7, 4]",
        hints: [
          "Annotations go after each parameter name with a colon, and the return type after a `->` before the final colon.",
          "For the logic: sort descending, then take the first k. `sorted(nums, reverse=True)` sorts biggest-first.",
          "Slice the first k off the sorted list with `[:k]`.",
        ],
        solution:
          "def top(nums: list[int], k: int) -> list[int]:\n    return sorted(nums, reverse=True)[:k]\n\nprint(top([4,1,7,2,8], 3))\n",
        solutionWhy:
          "`sorted(nums, reverse=True)` builds a new descending list (leaving nums untouched), and `[:k]` takes the first k.\n\nThe annotations change nothing about how it runs — but `top(nums: list[int], k: int) -> list[int]` tells the next reader everything they need without opening the body.",
      },
    ],
  },

  {
    id: "py.13.classes",
    track: "python",
    index: 13,
    title: "Classes & dataclasses",
    summary: "Bundling data with behaviour; `__init__`, `self`, methods, and `@dataclass`.",
    concepts: ["py:classes", "py:oop", "py:dataclass"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Bundling data with the things you do to it",
        body:
          "So far your data has been loose — a name here, an age there, maybe a dict holding both. A **class** lets you define a new kind of thing, with its own data and its own functions.\n\n```\nclass Dog:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return f'{self.name} says woof'\n\nd = Dog('Rex')\nprint(d.speak())        # Rex says woof\n```\n\nThe vocabulary:\n\n- **class** — the blueprint. `Dog` describes what any dog has and does.\n- **instance** — one actual thing built from it. `d` is one dog.\n- **attribute** — data on the instance. `d.name`.\n- **method** — a function belonging to the class. `speak`.\n\n**`__init__`** runs automatically when you create an instance. Its job is to set up the starting data. The double underscores mark it as special to Python — you never call it directly, `Dog('Rex')` does.\n\nAnd **`self`** is the instance itself, handed to every method automatically. Inside a method, `self.name` means \"this particular dog's name\". It's the thing that lets one method see what another one stored.",
      },
      {
        kind: "trace",
        id: "t1",
        title: "Watch an instance get built and used",
        intro:
          "`self` is the piece everyone stumbles on. Follow where it comes from and what it refers to.",
        code: "class Dog:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return f'{self.name} says woof'\n\nd = Dog('Rex')\nprint(d.speak())\n",
        lines: [
          {
            code: "class Dog:",
            what:
              "Python reads the whole class body and files it away as a blueprint. No dog exists yet — nothing has run, exactly like `def` storing a function without calling it.",
            state: "Dog is defined; no instances",
          },
          {
            code: "d = Dog('Rex')",
            what:
              "Calling the class creates a new empty instance and immediately calls __init__ on it. Python passes the new object in as `self`, and 'Rex' as `name`.",
            state: "inside __init__: self = the new dog, name = 'Rex'",
          },
          {
            code: "        self.name = name",
            what:
              "Store the value onto the instance. Note the two are different things: `name` is the local parameter, `self.name` is an attribute that lives on the object and survives after __init__ finishes.",
            state: "the new dog now has .name = 'Rex'",
          },
          {
            code: "d = Dog('Rex')",
            what: "__init__ returns nothing useful; Python hands back the finished instance, and d points at it.",
            state: "d → Dog with .name = 'Rex'",
          },
          {
            code: "print(d.speak())",
            what:
              "Calling a method on an instance passes that instance as `self` automatically. You wrote `d.speak()` with no arguments, but speak receives self = d. That's why the definition has a parameter you never seem to pass.",
            state: "inside speak: self = d",
          },
          {
            code: "        return f'{self.name} says woof'",
            what: "self.name looks up the attribute stored earlier by __init__ — 'Rex'. The finished string goes back to print.",
            output: "Rex says woof",
          },
        ],
        takeaway:
          "`Dog('Rex')` creates an instance then calls __init__ on it. Every method gets that instance as `self` automatically, which is how methods reach the data __init__ stored.",
      },
      {
        kind: "read",
        id: "r2",
        title: "@dataclass — when it's mostly just data",
        body:
          "A lot of classes exist only to hold a few fields. Writing `__init__` for those is tedious and repetitive:\n\n```\nclass Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n```\n\n`@dataclass` writes that for you from the field names alone:\n\n```\nfrom dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: float\n    y: float\n```\n\nThat's the same class, plus two bonuses you'd otherwise have to write by hand:\n\n- **A readable repr.** `print(p)` shows `Point(x=3, y=4)` rather than `<__main__.Point object at 0x7f...>`.\n- **Sensible equality.** `Point(1, 2) == Point(1, 2)` is True. Without a dataclass, two separately-built points with identical values compare as different, because the default comparison asks \"are these literally the same object?\"\n\nYou can still add methods normally. Reach for `@dataclass` whenever a class is mostly fields — which is most of the time.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Dataclass",
        code:
          "from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: float\n    y: float\n    def dist(self) -> float:\n        return (self.x**2 + self.y**2) ** 0.5\n\np = Point(3, 4)\nprint(p, p.dist())\nprint(Point(1, 2) == Point(1, 2))\n",
        note:
          "That last line is the equality bonus. Try removing the @dataclass line and re-running — you'll need to write __init__ yourself, and the comparison becomes False.",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "The class mistakes everyone makes",
        items: [
          {
            wrong: "class Dog:\n    def speak():\n        return 'woof'\n\nd = Dog()\nprint(d.speak())",
            problem:
              "TypeError: speak() takes 0 positional arguments but 1 was given. Calling a method on an instance always passes that instance in, so the definition must have a parameter to receive it. That parameter is `self`.",
            right: "class Dog:\n    def speak(self):\n        return 'woof'\n\nd = Dog()\nprint(d.speak())",
          },
          {
            wrong: "class Dog:\n    def __init__(self, name):\n        name = name\n\nd = Dog('Rex')\nprint(d.name)",
            problem:
              "AttributeError: 'Dog' object has no attribute 'name'. `name = name` just reassigns the local parameter to itself and is thrown away when __init__ ends. To store it on the object you need `self.`",
            right: "class Dog:\n    def __init__(self, name):\n        self.name = name\n\nd = Dog('Rex')\nprint(d.name)",
          },
          {
            wrong: "class Basket:\n    items = []\n    def add(self, x):\n        self.items.append(x)\n\na, b = Basket(), Basket()\na.add('apple')\nprint(b.items)",
            problem:
              "Prints ['apple'] — b got a's apple. A list defined in the class body belongs to the CLASS, so every instance shares it. Same trap as mutable default arguments. Per-instance data belongs in __init__.",
            right: "class Basket:\n    def __init__(self):\n        self.items = []\n    def add(self, x):\n        self.items.append(x)\n\na, b = Basket(), Basket()\na.add('apple')\nprint(b.items)",
          },
        ],
      },
      {
        kind: "parsons",
        id: "pa1",
        title: "Assemble a class",
        prompt:
          "Put these lines in order to define a Circle with a radius and an area method, then use it. Watch the indentation levels.",
        solution: [
          "class Circle:",
          "    def __init__(self, r):",
          "        self.r = r",
          "    def area(self):",
          "        return 3.14159 * self.r ** 2",
          "c = Circle(2)",
          "print(round(c.area(), 2))",
        ],
        expectedOutput: "12.57",
        hints: [
          "The class header comes first, then its methods indented inside it.",
          "__init__ has to store the radius before area can use it — and both method bodies are indented one level deeper than their def lines.",
          "Class, then __init__ and its body, then area and its body, then the two unindented lines that create and use the instance.",
        ],
        explanation:
          "Three indentation levels: the class body, the method definitions inside it, and the statements inside each method. The final two lines sit at the outer level because they're not part of the class.",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "class C:\n    n = 0\n    def __init__(self): C.n += 1\n\na, b, c = C(), C(), C()\nprint(C.n)\n",
        answer: "3",
        hints: [
          "`n = 0` sits in the class body, so it belongs to the class itself rather than to any instance.",
          "__init__ runs once per instance created, and each run increments that single shared class attribute.",
        ],
        why:
          "`C.n` is one value shared by the whole class, not one per instance. Three instances are created, so __init__ runs three times, each adding 1. This is the legitimate use of a class attribute — counting instances — as opposed to the mutable-list version in the pitfalls, which is a bug.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: give the class an area method",
        buggy:
          "class Rect:\n    def __init__(self, w, h):\n        self.w = w\n        self.h = h\n\nr = Rect(3, 4)\nprint(r.area())\n",
        expected: "12",
        hints: [
          "Run it — AttributeError, because Rect has no method called area.",
          "Add a method inside the class, indented to the same level as __init__.",
          "It needs `self` as its first parameter so it can reach self.w and self.h.",
        ],
        solution:
          "class Rect:\n    def __init__(self, w, h):\n        self.w = w\n        self.h = h\n\n    def area(self):\n        return self.w * self.h\n\nr = Rect(3, 4)\nprint(r.area())\n",
        solutionWhy:
          "`area` is defined at the same indentation as __init__, making it part of the class. Its `self` parameter gives it access to the attributes __init__ stored.\n\nNote it returns rather than prints — the caller decides what to do with the number, exactly as in the functions lesson.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Counter class",
        prompt:
          "Write a class Counter with methods tick() and value(). Create one, tick 5 times, then print value(). Expected: 5",
        starter:
          "class Counter:\n    def __init__(self):\n        ...\n    def tick(self):\n        ...\n    def value(self):\n        ...\n\nc = Counter()\nfor _ in range(5):\n    c.tick()\nprint(c.value())\n",
        expected: "5",
        hints: [
          "__init__ should set the starting count to 0 — and it must be stored on self, not as a plain local.",
          "tick adds one to that stored count; value hands it back.",
          "self.count = 0 in __init__, self.count += 1 in tick, return self.count in value.",
        ],
        solution:
          "class Counter:\n    def __init__(self):\n        self.count = 0\n    def tick(self):\n        self.count += 1\n    def value(self):\n        return self.count\n\nc = Counter()\nfor _ in range(5):\n    c.tick()\nprint(c.value())\n",
        solutionWhy:
          "`self.count` lives on the instance, so each Counter has its own tally — build a second one and it starts at 0 independently.\n\nPutting `count = 0` in the class body instead would appear to work here, but every Counter would then share one number, which is the bug from the pitfalls step.",
      },
    ],
  },

  {
    id: "py.14.errors",
    track: "python",
    index: 14,
    title: "Errors & exceptions",
    summary: "Catching what you expect, letting the rest surface, and raising your own.",
    concepts: ["py:exceptions", "py:try-except", "py:custom-exceptions"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Catching what might go wrong",
        body:
          "Some failures are genuinely expected — a file that isn't there, text that isn't a number, a network that's down. **`try` / `except`** lets you handle those without your program dying.\n\n```\ntry:\n    n = int(user_input)\nexcept ValueError:\n    print(\"that wasn't a number\")\n```\n\nIf the `try` block raises the named error, the `except` block runs instead of the program stopping. If nothing goes wrong, the except is skipped.\n\nYou can capture the error object itself to see what it said:\n\n```\nexcept ValueError as e:\n    print(f'bad input: {e}')\n```\n\nTwo extras complete the picture:\n\n- **`else:`** runs only if the try block did NOT raise. Useful for the code that should only happen on success.\n- **`finally:`** runs no matter what — success, failure, even an early `return`. It's for cleanup that must happen either way.\n\nAnd you can raise errors yourself when something is wrong:\n\n```\nif amount < 0:\n    raise ValueError('amount cannot be negative')\n```",
      },
      {
        kind: "read",
        id: "r2",
        title: "Catch narrowly — the most important rule here",
        body:
          "It's tempting to write a bare `except:` that swallows everything. Don't.\n\n```\ntry:\n    result = compute()\nexcept:                 # catches literally everything\n    print('failed')\n```\n\nThat hides typos, name errors, out-of-memory, and even your Ctrl-C. A bug that should have announced itself loudly instead prints 'failed' and carries on with wrong data. Debugging that is miserable.\n\nCatch the specific thing you actually expect:\n\n```\nexcept ValueError:\n```\n\nand let everything else propagate. **An error you didn't anticipate should crash**, because a crash with a traceback tells you exactly where and why. Silence tells you nothing.\n\nIf you genuinely must catch broadly — a top-level handler in a long-running service, say — use `except Exception as e:` and log the error rather than discarding it. `except Exception` at least leaves Ctrl-C and system-exit alone.\n\nThe common exception types you'll meet:\n\n- `ValueError` — right type, wrong value (`int('abc')`)\n- `TypeError` — wrong type entirely (`'a' + 1`)\n- `KeyError` / `IndexError` — missing dict key / list position\n- `FileNotFoundError`, `ZeroDivisionError`, `AttributeError`",
      },
      {
        kind: "trace",
        id: "t1",
        title: "Watch try / except / finally flow",
        intro:
          "The surprise here is `finally` running even though the function already returned. Follow the order carefully.",
        code: "def f():\n    try:\n        return 1\n    finally:\n        print('cleanup')\n\nprint(f())\n",
        lines: [
          { code: "print(f())", what: "Evaluate f() first — execution jumps into the function.", state: "inside f" },
          {
            code: "    try:\n        return 1",
            what:
              "The try block runs and hits a return. The value 1 is worked out and held ready — but the function does NOT exit yet, because there's a finally still to honour.",
            state: "return value 1 held pending",
          },
          {
            code: "    finally:\n        print('cleanup')",
            what:
              "finally runs on the way out, no matter how the block is leaving — normally, via an exception, or via a return. So 'cleanup' prints first.",
            output: "cleanup",
          },
          {
            code: "print(f())",
            what: "Only now does f actually return the 1 it was holding, and the outer print shows it.",
            output: "cleanup\n1",
          },
        ],
        takeaway:
          "`finally` always runs before control genuinely leaves the block — which is exactly why it's the right place for cleanup like closing a file or releasing a lock.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Custom exception",
        code:
          "class NotEnough(Exception):\n    pass\n\ndef withdraw(balance, amt):\n    if amt > balance:\n        raise NotEnough(f'need {amt}, have {balance}')\n    return balance - amt\n\ntry:\n    withdraw(10, 20)\nexcept NotEnough as e:\n    print('error:', e)\n",
        note:
          "Defining your own exception type is just subclassing Exception with an empty body. It lets callers catch exactly your failure without also swallowing unrelated ValueErrors.",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "Exception-handling mistakes",
        items: [
          {
            wrong: "try:\n    total = compte_total()\nexcept:\n    total = 0",
            problem:
              "`compte_total` is a typo, which raises NameError — and the bare except swallows it, silently setting total to 0. You'd hunt for that for hours. Catch only what you expect.",
            right: "try:\n    total = compute_total()\nexcept ValueError:\n    total = 0",
          },
          {
            wrong: "try:\n    risky()\nexcept Exception as e:\n    pass",
            problem:
              "Catching and then doing nothing is worse than not catching. The failure is invisible and the program carries on in an unknown state. At minimum, log it.",
            right: "try:\n    risky()\nexcept Exception as e:\n    print(f'risky() failed: {e}')",
          },
          {
            wrong: "try:\n    n = int('x')\nexcept TypeError:\n    print('nope')",
            problem:
              "The except never fires — int('x') raises ValueError, not TypeError, so the error escapes uncaught. Catching the wrong class is the same as not catching at all.",
            right: "try:\n    n = int('x')\nexcept ValueError:\n    print('nope')",
          },
        ],
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "def f():\n    try:\n        return 1\n    finally:\n        print('cleanup')\nprint(f())\n",
        answer: "cleanup\n1",
        hints: [
          "There are two things being output — the print inside finally, and the print of the returned value.",
          "finally runs on the way out of the block, before the return actually completes. So which prints first?",
        ],
        why:
          "The return value is computed and held, then finally runs (printing 'cleanup'), and only then does the function hand back 1 for the outer print. finally always gets its turn before control leaves.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: catch the specific error, not everything",
        buggy: "try:\n    n = int('x')\nexcept:\n    print('failed')\n",
        expected: "bad int: invalid literal for int() with base 10: 'x'",
        hints: [
          "The bare `except:` catches everything, which hides what actually went wrong. Which specific error does int('x') raise?",
          "It's a ValueError — right type, wrong value. Catch that specifically.",
          "Capture the error with `as e` and print exactly `bad int: {e}` using an f-string.",
        ],
        solution:
          "try:\n    n = int('x')\nexcept ValueError as e:\n    print(f'bad int: {e}')\n",
        solutionWhy:
          "Naming ValueError means a genuinely unexpected error — a typo'd function name, say — would still crash loudly instead of being swallowed.\n\nCapturing with `as e` also gives you Python's own message, which is far more useful than a generic 'failed'. Here it tells you exactly which value couldn't be converted.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Safe divide",
        prompt:
          "Write safe_div(a, b) that returns a / b, or the string 'undefined' when b is 0. Print safe_div(6, 3) and safe_div(1, 0).",
        starter: "def safe_div(a, b):\n    ...\n\nprint(safe_div(6, 3))\nprint(safe_div(1, 0))\n",
        expected: "2.0\nundefined",
        hints: [
          "Dividing by zero raises ZeroDivisionError — you can either check for it first, or catch it.",
          "With try/except: attempt the division in the try, and return 'undefined' from the except.",
          "Remember `/` always gives a float, so 6 / 3 shows as 2.0.",
        ],
        solution:
          "def safe_div(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return 'undefined'\n\nprint(safe_div(6, 3))\nprint(safe_div(1, 0))\n",
        solutionWhy:
          "The try attempts the division; if b is 0 the ZeroDivisionError is caught and the fallback string returned instead.\n\n`if b == 0: return 'undefined'` would work equally well here, and is arguably clearer for a condition this simple. Exceptions earn their keep when the failure is buried deeper — several calls down, where an if-check at the top can't see it.",
      },
    ],
  },

  {
    id: "py.15.iter-gen",
    track: "python",
    index: 15,
    title: "Iterators & generators",
    summary: "Producing values one at a time with `yield`, instead of building whole lists.",
    concepts: ["py:iterator", "py:generator", "py:yield"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Producing values on demand",
        body:
          "A normal function computes everything and returns it in one go. If it's building a list of a million items, all million exist in memory before you see any of them.\n\nA **generator** hands back values one at a time, only when asked. You write one by using **`yield`** instead of `return`:\n\n```\ndef countdown(n):\n    while n > 0:\n        yield n\n        n -= 1\n\nfor x in countdown(3):\n    print(x)        # 3, 2, 1\n```\n\nThe difference from `return` is the important part: **`yield` pauses the function rather than ending it.** The function's whole state — every local variable, the position in the loop — is frozen. When the next value is asked for, it picks up exactly where it left off.\n\nCalling a generator function doesn't run any of the body. It hands back a generator object, ready and waiting. The body only advances when something asks for a value — a `for` loop, `next()`, `list()`, `sum()`.\n\nWhy bother:\n\n- **Memory.** Processing a huge file line by line never holds the whole thing.\n- **Infinite sequences** become possible — the generator only ever produces what you take.\n- **Speed to first result.** You get value one immediately rather than after all the work.",
      },
      {
        kind: "trace",
        id: "t1",
        title: "Watch yield pause and resume",
        intro:
          "This is the part that feels like magic. Follow how the function stops mid-loop and later carries on from that exact spot.",
        code: "def countdown(n):\n    while n > 0:\n        yield n\n        n -= 1\n\ng = countdown(3)\nprint(next(g))\nprint(next(g))\nprint(next(g))\n",
        lines: [
          {
            code: "g = countdown(3)",
            what:
              "None of the body runs. Because the function contains yield, calling it just builds a generator object, paused before the first line. n isn't even set up yet.",
            state: "g = generator, not started",
          },
          {
            code: "next(g)  ->  while n > 0:  /  yield n",
            what:
              "First request. NOW the body starts: n is 3, the while condition holds, and it reaches `yield n`. It hands back 3 and freezes right there — mid-loop, with n still 3.",
            state: "paused at yield, n = 3",
            output: "3",
          },
          {
            code: "next(g)  ->  n -= 1  /  loop  /  yield n",
            what:
              "Second request. Execution resumes on the line AFTER the yield: n becomes 2, the loop goes round, the condition still holds, and it yields 2 and freezes again.",
            state: "paused at yield, n = 2",
            output: "3\n2",
          },
          {
            code: "next(g)  ->  n -= 1  /  loop  /  yield n",
            what: "Same again: n becomes 1, yields 1, freezes. Note n survived between calls — the function's state was preserved, not rebuilt.",
            state: "paused at yield, n = 1",
            output: "3\n2\n1",
          },
        ],
        takeaway:
          "yield suspends the function with all its locals intact and resumes from the same line next time. A generator is a function you can pause.",
      },
      {
        kind: "example",
        id: "e1",
        title: "An infinite sequence",
        code:
          "def fib():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\ng = fib()\nprint([next(g) for _ in range(10)])\n",
        note:
          "`while True` would hang forever in a normal function. Here it's fine — the generator only ever computes the values actually requested. Try changing 10 to 30.",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "Generator gotchas",
        items: [
          {
            wrong: "def squares(n):\n    for i in range(n):\n        yield i * i\n\ng = squares(3)\nprint(list(g))\nprint(list(g))",
            problem:
              "The second line prints []. A generator is consumed as it's read — once exhausted it stays exhausted. If you need the values more than once, store them in a list.",
            right: "def squares(n):\n    for i in range(n):\n        yield i * i\n\nvals = list(squares(3))\nprint(vals)\nprint(vals)",
          },
          {
            wrong: "def evens(n):\n    for i in range(n):\n        if i % 2 == 0:\n            yield i\n\nprint(evens(6))",
            problem:
              "Prints <generator object ...> rather than the numbers. Printing the generator itself shows the object; you have to consume it with list(), a for loop, or sum().",
            right: "def evens(n):\n    for i in range(n):\n        if i % 2 == 0:\n            yield i\n\nprint(list(evens(6)))",
          },
          {
            wrong: "def first_positive(xs):\n    for x in xs:\n        if x > 0:\n            yield x\n            return x",
            problem:
              "Confusing yield and return in one function. `return` inside a generator just stops it — the returned value isn't handed to the caller as you'd expect. Pick one: yield for a stream, return for a single value.",
            right: "def first_positive(xs):\n    for x in xs:\n        if x > 0:\n            return x\n    return None",
          },
        ],
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "def evens(n):\n    for i in range(n):\n        if i % 2 == 0:\n            yield i\nprint(list(evens(6)))\n",
        answer: "[0, 2, 4]",
        hints: [
          "range(6) gives 0,1,2,3,4,5. Which of those satisfy the if?",
          "`list(...)` drains the generator completely, collecting every yielded value.",
        ],
        why:
          "The generator yields only when the condition holds, so 0, 2 and 4 come out. `list()` runs it to exhaustion and gathers them.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Sum of squares up to 100",
        prompt:
          "Print the sum of the squares of 1 to 100 using a generator expression rather than building a list. Expected: 338350",
        starter: "# print here using sum(...)\n",
        expected: "338350",
        hints: [
          "A generator expression looks like a list comprehension but with round brackets instead of square.",
          "sum() takes any iterable, so you can hand it a generator expression directly.",
          "`sum(n * n for n in range(1, 101))` — when a generator expression is the only argument, the brackets it needs are the function's own.",
        ],
        solution: "print(sum(n * n for n in range(1, 101)))\n",
        solutionWhy:
          "The generator produces each square as sum asks for it, so no hundred-element list is ever built.\n\nAt this size it makes no practical difference. At a hundred million it's the difference between working and running out of memory — which is why `sum(... for ...)` is the habit worth forming.",
      },
    ],
  },

  {
    id: "py.16.pattern",
    track: "python",
    index: 16,
    title: "Pattern matching (match/case)",
    summary: "Structural pattern matching for cleaner branching (3.10+).",
    concepts: ["py:match", "py:structural-matching"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Matching on shape, not just value",
        body:
          "`match` looks like a switch statement from other languages, but it does considerably more: it matches on the **structure** of a value and pulls pieces out at the same time.\n\n```\nmatch command:\n    case 'quit':\n        ...\n    case _:\n        ...\n```\n\nPython tries each `case` top to bottom and runs the first that matches. `case _:` is the wildcard that matches anything — the equivalent of `else`.\n\nWhere it earns its place is destructuring:\n\n```\nmatch point:\n    case [0, 0]:            print('origin')\n    case [0, y]:            print(f'on the y-axis at {y}')\n    case [x, y]:            print(f'at {x}, {y}')\n```\n\nThat second case matches any two-item sequence whose first item is 0, **and** binds the second to `y` in one step. Writing that with if/elif takes length checks, index access and separate assignments.\n\nThe pattern kinds:\n\n- literals — `case 0:`, `case 'hi':`\n- captures — `case n:` matches anything and binds it to n\n- sequences — `case [a, b, *rest]:`\n- mappings — `case {'type': 'circle', 'r': r}:`\n- classes — `case Point(x=0, y=y):`\n- alternatives — `case 1 | 2 | 3:`\n- guards — `case n if n > 100:`",
      },
      {
        kind: "example",
        id: "e1",
        title: "Routing on shape",
        code:
          "def describe(shape):\n    match shape:\n        case {'type': 'circle', 'r': r}: return f'circle r={r}'\n        case {'type': 'rect', 'w': w, 'h': h}: return f'{w}x{h}'\n        case _: return 'unknown'\n\nprint(describe({'type': 'circle', 'r': 5}))\nprint(describe({'type': 'rect', 'w': 3, 'h': 4}))\nprint(describe({'type': 'blob'}))\n",
        note:
          "A mapping pattern matches if the listed keys are present — extra keys are ignored. That makes it well suited to JSON-shaped data where you only care about a few fields.",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "The pattern-matching trap",
        items: [
          {
            wrong: "LIMIT = 10\n\ndef check(n):\n    match n:\n        case 0:\n            return 'zero'\n        case LIMIT:\n            return 'at the limit'\n\nprint(check(5))",
            problem:
              "Returns 'at the limit' for 5 — and for anything that isn't 0. A bare name in a case is a CAPTURE pattern: it matches absolutely anything and rebinds the name to it. It does NOT compare against your existing LIMIT variable. This is the biggest match/case gotcha. (Python does catch one arrangement of it: put a `case _:` after the capture and you get a helpful SyntaxError about unreachable patterns. Leave the capture last, as here, and it fails silently.)",
            right: "LIMIT = 10\n\ndef check(n):\n    match n:\n        case 0:\n            return 'zero'\n        case x if x == LIMIT:\n            return 'at the limit'\n        case _:\n            return 'other'\n\nprint(check(5))",
          },
          {
            wrong: "def f(xs):\n    match xs:\n        case [x, *rest]: return 'non-empty'\n        case []: return 'empty'\n\nprint(f([]))",
            problem:
              "Works here, but the ordering is fragile — put a broad pattern before a narrow one and the narrow one becomes unreachable. Always order cases most-specific first.",
            right: "def f(xs):\n    match xs:\n        case []: return 'empty'\n        case [x, *rest]: return 'non-empty'\n\nprint(f([]))",
          },
          {
            wrong: "def f(n):\n    match n:\n        case 1: return 'one'\n        case 2: return 'two'\n\nprint(f(99))",
            problem:
              "Prints None. If no case matches and there's no wildcard, match simply does nothing and the function falls off the end. Include a `case _:` unless you're certain you've covered everything.",
            right: "def f(n):\n    match n:\n        case 1: return 'one'\n        case 2: return 'two'\n        case _: return 'other'\n\nprint(f(99))",
          },
        ],
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "def describe(xs):\n    match xs:\n        case []: return 'empty'\n        case [x]: return f'one: {x}'\n        case [x, *rest]: return f'first={x}, rest={rest}'\nprint(describe([]), describe([1]), describe([1,2,3]))\n",
        answer: "empty one: 1 first=1, rest=[2, 3]",
        hints: [
          "Three calls, three different list lengths — work out which case each one lands on.",
          "Cases are tried top to bottom, so [1] hits `case [x]` before it ever reaches the starred pattern.",
        ],
        why:
          "The empty list matches the first case. [1] matches `[x]` — exactly one item. [1,2,3] falls through to the starred pattern, binding x to 1 and collecting the rest into a list.",
      },
      {
        kind: "write",
        id: "w1",
        title: "HTTP status classifier",
        prompt:
          "Write classify(code) returning 'ok' for 200-299, 'client' for 400-499, 'server' for 500-599, and 'other' otherwise. Use match with guards. Print classify for 204, 404, 500 and 302.",
        starter: "def classify(code):\n    ...\n\nfor c in (204, 404, 500, 302):\n    print(classify(c))\n",
        expected: "ok\nclient\nserver\nother",
        hints: [
          "A bare name in a case captures anything — so you need a guard (`if`) after it to narrow the match.",
          "The form is `case n if 200 <= n < 300:` — capture into n, then test it.",
          "Finish with `case _: return 'other'` to catch everything else, like 302.",
        ],
        solution:
          "def classify(code):\n    match code:\n        case n if 200 <= n < 300: return 'ok'\n        case n if 400 <= n < 500: return 'client'\n        case n if 500 <= n < 600: return 'server'\n        case _: return 'other'\n\nfor c in (204, 404, 500, 302):\n    print(classify(c))\n",
        solutionWhy:
          "Each case captures the value into n and then applies a guard. If the guard fails, matching continues to the next case.\n\nHonestly, a plain if/elif chain would read just as well here — match earns its keep when you're destructuring shapes, not comparing ranges. Knowing when NOT to reach for a feature is part of learning it.",
      },
    ],
  },

  {
    id: "py.17.modules",
    track: "python",
    index: 17,
    title: "Modules & the standard library",
    summary: "Imports, and the batteries-included modules worth knowing by name.",
    concepts: ["py:modules", "py:imports", "py:stdlib"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Using code from elsewhere",
        body:
          "A **module** is just a Python file. Importing one gives you access to what's inside it.\n\nThree forms, and the difference matters:\n\n```\nimport json                       # json.loads(...)\nfrom collections import Counter   # Counter(...) directly\nimport numpy as np                # np.array(...)\n```\n\n- `import x` keeps the module name as a prefix. Most explicit — you can always see where something came from.\n- `from x import y` brings the name straight in. Convenient, but with several imports it becomes unclear which module a name belongs to.\n- `import x as y` renames it, usually because the community has settled on a short alias (`np`, `pd`, `plt`).\n\nAvoid `from x import *` — it dumps every name into your file, and you lose track of what came from where and what might have been silently overwritten.\n\nPython ships with a large standard library, which is why people say it comes 'batteries included'. Before installing anything, check whether the standard library already does it — very often it does.",
      },
      {
        kind: "read",
        id: "r2",
        title: "The modules worth knowing by name",
        body:
          "You don't need to memorise these, but knowing they exist saves you from reinventing them:\n\n**`collections`**\n- `Counter` — counts things. `Counter('banana')` does that whole word-count exercise in one call.\n- `defaultdict` — a dict that creates missing values for you, removing the `.get(k, [])` dance.\n- `deque` — a list that's fast to add to and remove from at BOTH ends.\n\n**`pathlib`** — `Path` objects for filesystem paths. Joining with `/` beats string concatenation and works on every OS.\n\n**`json`** — convert between Python objects and JSON text.\n\n**`itertools`** — tools for looping. `accumulate` (running totals), `chain` (join sequences), `combinations`, `product`.\n\n**`functools`** — `cache` (memoise a function with one decorator), `reduce`, `partial`.\n\n**`datetime`**, **`re`** (regular expressions), **`random`**, **`math`**, **`statistics`** round out the everyday set.",
      },
      {
        kind: "example",
        id: "e1",
        title: "A few in action",
        code:
          "from collections import Counter, defaultdict\nfrom pathlib import Path\nfrom itertools import accumulate\n\n"
          + "print(Counter('mississippi').most_common(2))\n\n"
          + "p = Path('/tmp') / 'x' / 'y.txt'\nprint(p, p.suffix, p.name)\n\n"
          + "print(list(accumulate([1, 2, 3, 4])))\n\n"
          + "g = defaultdict(list)\ng['a'].append(1)\nprint(dict(g))\n",
        note:
          "That last one is the point of defaultdict: `g['a']` didn't exist, but instead of KeyError it created an empty list to append to.",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "Import mistakes",
        items: [
          {
            wrong: "import collections\nprint(Counter('abc'))",
            problem:
              "NameError. `import collections` keeps the prefix, so it's collections.Counter. Either use the prefix or import the name directly.",
            right: "from collections import Counter\nprint(Counter('abc'))",
          },
          {
            wrong: "from collections import defaultdict\ng = defaultdict(list)\ng['a'].append(1)\nprint(g)",
            problem:
              "Prints defaultdict(<class 'list'>, {'a': [1]}) — technically correct but noisy. Wrap it in dict() when you just want to see or compare the contents.",
            right: "from collections import defaultdict\ng = defaultdict(list)\ng['a'].append(1)\nprint(dict(g))",
          },
          {
            wrong: "import random\nrandom = 5\nprint(random.choice([1, 2]))",
            problem:
              "AttributeError: 'int' object has no attribute 'choice'. Assigning to a name you imported clobbers the module. Naming a file `random.py` in your project does the same thing to every import of it.",
            right: "import random\nchoice_count = 5\nprint(random.choice([1, 2]))",
          },
        ],
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "from itertools import accumulate\nprint(list(accumulate([1,2,3,4])))\n",
        answer: "[1, 3, 6, 10]",
        hints: [
          "`accumulate` produces running totals rather than one final sum.",
          "Each output is the total so far: 1, then 1+2, then 1+2+3, and so on.",
        ],
        why:
          "accumulate yields the running total at each step — 1, 3, 6, 10. It's lazy, hence the list() to see it all. Useful for cumulative sums without writing the loop.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Group words by first letter",
        prompt:
          "Given words = ['ant','ape','bee','bat','cat'], print a plain dict mapping each first letter to the list of words starting with it, in original order. Expected: {'a': ['ant', 'ape'], 'b': ['bee', 'bat'], 'c': ['cat']}",
        starter:
          "from collections import defaultdict\nwords = ['ant','ape','bee','bat','cat']\n# build and print\n",
        expected: "{'a': ['ant', 'ape'], 'b': ['bee', 'bat'], 'c': ['cat']}",
        hints: [
          "`defaultdict(list)` gives you an empty list automatically for any key you touch, so you can append without checking first.",
          "The first letter of a word is `word[0]`.",
          "Wrap the result in `dict(...)` when printing, or you'll see the defaultdict wrapper in the output.",
        ],
        solution:
          "from collections import defaultdict\nwords = ['ant','ape','bee','bat','cat']\ng = defaultdict(list)\nfor w in words:\n    g[w[0]].append(w)\nprint(dict(g))\n",
        solutionWhy:
          "defaultdict removes the usual `if key not in d: d[key] = []` preamble — touching a missing key creates the empty list for you.\n\nWith a plain dict you'd write `g.setdefault(w[0], []).append(w)`, which does the same job. Both are fine; defaultdict reads better when the pattern repeats.",
      },
    ],
  },

  {
    id: "py.18.async",
    track: "python",
    index: 18,
    title: "async / await",
    summary: "Doing several slow things at once, when the slowness is waiting.",
    concepts: ["py:async", "py:await", "py:asyncio"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Waiting is not working",
        body:
          "Downloading three files takes three seconds if you do them one after another — but almost all of that time is spent *waiting* for the network, not computing anything. Your program sits idle.\n\n**async** lets a single thread work on something else during those waits.\n\n```\nimport asyncio\n\nasync def fetch(name):\n    await asyncio.sleep(1)      # pretend network delay\n    return f'{name} done'\n```\n\n- **`async def`** marks a **coroutine** — a function that can pause.\n- **`await`** marks a pause point: \"this will take a while; go do something else and come back to me.\"\n\nCalling a coroutine doesn't run it. It hands back a coroutine object, which does nothing until awaited or scheduled — a common early surprise.\n\nRun several concurrently with `asyncio.gather`:\n\n```\nresults = await asyncio.gather(fetch('a'), fetch('b'), fetch('c'))\n```\n\nThat takes about one second, not three. All three waits overlap.\n\n**Important limit:** async only helps when you're **waiting** — network, disk, timers. It does nothing for CPU-heavy work like crunching numbers, because there's no idle time to reclaim. For that you need threads or processes.",
      },
      {
        kind: "trace",
        id: "t1",
        title: "Sequential vs concurrent",
        intro:
          "Same two one-second waits, two arrangements, very different totals. Follow the clock.",
        code: "# sequential\nawait fetch('a')     # 1s\nawait fetch('b')     # 1s\n# total: 2s\n\n# concurrent\nawait asyncio.gather(fetch('a'), fetch('b'))\n# total: 1s\n",
        lines: [
          {
            code: "await fetch('a')     # 1s",
            what:
              "Start a, and await it immediately. `await` means 'don't continue until this finishes' — so nothing else starts. One second passes with the program idle.",
            state: "t = 1s, a done, b not started",
          },
          {
            code: "await fetch('b')     # 1s",
            what: "Only now does b begin, and we wait another full second for it.",
            state: "t = 2s, both done",
          },
          {
            code: "await asyncio.gather(fetch('a'), fetch('b'))",
            what:
              "gather starts BOTH before awaiting anything. Both are now in flight at once, and their waits overlap rather than queueing.",
            state: "t = 0s, both running",
          },
          {
            code: "await asyncio.gather(fetch('a'), fetch('b'))",
            what:
              "Wait for both to finish. They were started together, so after one second both are done — the total is set by the slowest, not the sum.",
            state: "t = 1s, both done",
          },
        ],
        takeaway:
          "`await` on its own means 'stop here until done'. To overlap work you must start everything first — that's what gather does. Awaiting in a loop is the classic accidental way to make concurrent code sequential.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Concurrent waits",
        code:
          "import asyncio, time\n\nasync def work(name, secs):\n    await asyncio.sleep(secs)\n    return f'{name} done'\n\nasync def main():\n    start = time.perf_counter()\n    results = await asyncio.gather(work('a', 0.2), work('b', 0.2), work('c', 0.2))\n    print(results)\n    print(f'{time.perf_counter() - start:.1f}s')\n\nawait main()\n",
        note:
          "Three 0.2s waits finish in about 0.2s total, not 0.6s. Try changing gather to three separate awaits and watch the time triple.",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "async mistakes",
        items: [
          {
            wrong: "async def get_value():\n    return 42\n\nasync def main():\n    v = get_value()\n    print(v)\n\nawait main()",
            problem:
              "Prints <coroutine object ...> rather than 42, plus a warning that it was never awaited. Calling a coroutine only creates it. You have to await it to get its value.",
            right: "async def get_value():\n    return 42\n\nasync def main():\n    v = await get_value()\n    print(v)\n\nawait main()",
          },
          {
            wrong: "async def main():\n    results = []\n    for name in ['a', 'b', 'c']:\n        results.append(await work(name))\n    return results",
            problem:
              "Runs them one at a time — the await inside the loop finishes each before starting the next, so nothing overlaps. This is the most common way concurrent code accidentally becomes sequential.",
            right: "async def main():\n    return await asyncio.gather(*[work(n) for n in ['a', 'b', 'c']])",
          },
          {
            wrong: "import time\n\nasync def work():\n    time.sleep(1)\n    return 'done'",
            problem:
              "`time.sleep` blocks the entire event loop — every other coroutine is frozen for that second. Inside async code you must use `asyncio.sleep`, which yields control while waiting.",
            right: "import asyncio\n\nasync def work():\n    await asyncio.sleep(1)\n    return 'done'",
          },
        ],
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict (which order?)",
        code:
          "import asyncio\nasync def slow():\n    await asyncio.sleep(0.05)\n    return 'slow'\nasync def fast():\n    return 'fast'\nasync def main():\n    a, b = await asyncio.gather(slow(), fast())\n    print(a, b)\nawait main()\n",
        answer: "slow fast",
        hints: [
          "fast() finishes long before slow() does. Does that affect the order of the results?",
          "gather returns results positionally — matching the order you passed the coroutines in, not the order they completed.",
        ],
        why:
          "gather preserves argument order in its results, which is what makes unpacking like `a, b = ...` safe. Completion order doesn't come into it — if it did, you could never rely on which result was which.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: make it actually concurrent",
        buggy:
          "import asyncio, time\nasync def a():\n    await asyncio.sleep(0.1)\nasync def b():\n    await asyncio.sleep(0.1)\nasync def main():\n    start = time.perf_counter()\n    await a()\n    await b()\n    print('concurrent:', time.perf_counter() - start < 0.15)\nawait main()\n",
        expected: "concurrent: True",
        hints: [
          "Run it — it prints False, because the two waits are happening one after the other.",
          "Awaiting a() on its own line means b() doesn't even start until a() has finished.",
          "Start both together and await them as a pair with asyncio.gather(a(), b()).",
        ],
        solution:
          "import asyncio, time\nasync def a():\n    await asyncio.sleep(0.1)\nasync def b():\n    await asyncio.sleep(0.1)\nasync def main():\n    start = time.perf_counter()\n    await asyncio.gather(a(), b())\n    print('concurrent:', time.perf_counter() - start < 0.15)\nawait main()\n",
        solutionWhy:
          "gather receives both coroutines and schedules them before waiting, so the two 0.1s sleeps overlap and the total is ~0.1s rather than ~0.2s.\n\nThe general shape: build all the work first, then await it all together. Any `await` sitting alone in a loop is a sign you've serialised something that didn't need to be.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Gather three coroutines",
        prompt:
          "Complete main() so the three work() calls run concurrently and their results print as a list. Expected: ['a done', 'b done', 'c done']",
        starter:
          "import asyncio\nasync def work(name):\n    await asyncio.sleep(0.05)\n    return f'{name} done'\n\nasync def main():\n    ...\n\nawait main()\n",
        expected: "['a done', 'b done', 'c done']",
        hints: [
          "Pass all three coroutine calls to asyncio.gather at once.",
          "gather itself has to be awaited to get the results out.",
          "`results = await asyncio.gather(work('a'), work('b'), work('c'))` then print results.",
        ],
        solution:
          "import asyncio\nasync def work(name):\n    await asyncio.sleep(0.05)\n    return f'{name} done'\n\nasync def main():\n    results = await asyncio.gather(work('a'), work('b'), work('c'))\n    print(results)\n\nawait main()\n",
        solutionWhy:
          "All three start together, so the total wait is one sleep rather than three. The results come back as a list in argument order.\n\nWhen the coroutines are built from a collection, the usual form is `await asyncio.gather(*[work(n) for n in names])` — the `*` spreads the list into separate arguments.",
      },
    ],
  },

  {
    id: "py.19.files",
    track: "python",
    index: 19,
    title: "Files, JSON, and pathlib",
    summary: "Reading and writing files safely, and moving data in and out of JSON.",
    concepts: ["py:files", "py:json", "py:pathlib"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Reading and writing, without leaking",
        body:
          "An open file is a limited resource, and forgetting to close it eventually causes problems. The **`with`** statement guarantees closing, even if an error is raised partway through:\n\n```\nwith open('notes.txt') as f:\n    contents = f.read()\n# file is closed here, whatever happened\n```\n\nAlways use `with`. Manually calling `.close()` works right up until something raises before you reach it.\n\nThe modes:\n\n- `'r'` — read (the default)\n- `'w'` — write, **replacing** the file entirely\n- `'a'` — append to the end\n\nThat `'w'` truncates immediately, so opening the wrong path in write mode destroys it. Worth a moment's care.\n\nFor whole small files, `pathlib` is shorter:\n\n```\nfrom pathlib import Path\ntext = Path('notes.txt').read_text()\nPath('out.txt').write_text('hello')\n```\n\nAnd building paths with `/` beats string concatenation — it handles separators correctly on every platform:\n\n```\nPath('data') / 'raw' / 'file.csv'\n```",
      },
      {
        kind: "read",
        id: "r2",
        title: "JSON: data as text",
        body:
          "**JSON** is the standard format for exchanging structured data — every API and half the config files you'll meet use it. Python's `json` module converts both ways.\n\n**Object to text** with `dumps` (dump-string):\n\n```\nimport json\ns = json.dumps({'name': 'Ada', 'tags': ['py']})\n# '{\"name\": \"Ada\", \"tags\": [\"py\"]}'\n```\n\n**Text to object** with `loads`:\n\n```\nd = json.loads(s)\nprint(d['name'])       # Ada\n```\n\nThe `s`-less versions — `json.dump(obj, f)` and `json.load(f)` — do the same to and from an open file.\n\nFor human-readable output, `indent` and `sort_keys` help enormously:\n\n```\njson.dumps(data, indent=2, sort_keys=True)\n```\n\nOne thing to know: JSON only understands its own types — objects, arrays, strings, numbers, booleans, null. Python dicts, lists, strs, ints, floats and bools convert cleanly. Sets, tuples-as-keys, dates and custom classes do not, and will raise a TypeError unless you convert them first.",
      },
      {
        kind: "example",
        id: "e1",
        title: "JSON round trip",
        code:
          "import json\ndata = {'name': 'Ada', 'skills': ['py', 'math'], 'active': True}\n\n"
          + "s = json.dumps(data)\nprint(s)\n\n"
          + "back = json.loads(s)\nprint(back['skills'])\n\n"
          + "print(json.dumps(data, indent=2, sort_keys=True))\n",
        note:
          "Notice Python's True became JSON's `true`, and single quotes became double — JSON has its own spelling rules, which is exactly why you convert rather than just printing the dict.",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "File and JSON mistakes",
        items: [
          {
            wrong: "f = open('notes.txt', 'w')\nf.write('hello')\n# forgot f.close()",
            problem:
              "The write may sit in a buffer and never reach disk. Worse, if an exception fires between open and close, the file stays open. `with` closes it no matter what.",
            right: "with open('notes.txt', 'w') as f:\n    f.write('hello')",
          },
          {
            wrong: "import json\ndata = {'tags': {'py', 'math'}}\nprint(json.dumps(data))",
            problem:
              "TypeError: Object of type set is not JSON serializable. JSON has no set type. Convert to a list first — and remember that loses the uniqueness guarantee on the way back in.",
            right: "import json\ndata = {'tags': ['py', 'math']}\nprint(json.dumps(data))",
          },
          {
            wrong: "import json\nd = json.dumps({'a': 1})\nprint(d['a'])",
            problem:
              "TypeError: string indices must be integers. `dumps` produced a STRING, not a dict — indexing it by key fails. Use loads to go the other way.",
            right: "import json\nd = json.loads('{\"a\": 1}')\nprint(d['a'])",
          },
        ],
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "import json\nprint(json.dumps({'a': 1}, sort_keys=True, indent=2))\n",
        answer: '{\n  "a": 1\n}',
        hints: [
          "`indent=2` switches on pretty-printing, so the output spans several lines.",
          "JSON always uses double quotes around keys, regardless of how you wrote them in Python.",
        ],
        why:
          "With indent set, dumps spreads the object across lines with two-space indentation. The key gains double quotes because that's what the JSON format requires.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Pretty-print with 4-space indent",
        prompt:
          "Given d = {'a': 1, 'b': [1, 2, 3]}, print it as JSON with 4-space indentation and keys sorted.",
        starter: "import json\nd = {'a': 1, 'b': [1, 2, 3]}\n# print(...)\n",
        expected: '{\n    "a": 1,\n    "b": [\n        1,\n        2,\n        3\n    ]\n}',
        hints: [
          "`json.dumps` takes keyword arguments for both of these.",
          "`indent=4` for the spacing, `sort_keys=True` for the ordering.",
          "The list gets expanded across lines too — that's what indent does throughout.",
        ],
        solution: "import json\nd = {'a': 1, 'b': [1, 2, 3]}\nprint(json.dumps(d, indent=4, sort_keys=True))\n",
        solutionWhy:
          "`indent=4` pretty-prints everything nested, including the list. `sort_keys=True` orders keys alphabetically, which makes diffs between two versions of a config file far easier to read — a small habit worth having.",
      },
    ],
  },

  {
    id: "py.20.modern",
    track: "python",
    index: 20,
    title: "Modern features: walrus, generics, except*",
    summary: "Recent additions that show up in current Python code.",
    concepts: ["py:walrus", "py:exceptiongroup", "py:generics-new"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "The walrus operator :=",
        body:
          "`:=` assigns a value **and** produces it, so you can bind a name inside a condition instead of on a separate line beforehand.\n\nThe classic case is when you need a value both to test and to use:\n\n```\n# without\nn = len(data)\nif n > 2:\n    print(f'{n} items')\n\n# with\nif (n := len(data)) > 2:\n    print(f'{n} items')\n```\n\nIt shines most in while loops that read until something runs out:\n\n```\nwhile (line := f.readline()):\n    process(line)\n```\n\nWithout it you'd need to read once before the loop and again at the bottom — duplicated code that's easy to get out of sync.\n\nThe brackets around `(n := ...)` are usually required, and they're a useful visual signal anyway.\n\nUse it where it genuinely removes duplication. Sprinkled into ordinary code it makes things harder to read, and the shorter version isn't automatically the better one.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Walrus in a comprehension",
        code:
          "nums = [1, 4, 9, 16, 25]\n"
          + "# keep only the numbers whose square root is a whole number\n"
          + "result = [r for n in nums if (r := int(n**0.5))**2 == n]\nprint(result)\n",
        note:
          "Without the walrus you'd compute the square root twice — once to test it and once to keep it. This is exactly the duplication it exists to remove.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Generic syntax (3.12+) and except*",
        body:
          "**Generics without the boilerplate.** A function that works with any type used to need a TypeVar declared separately:\n\n```\n# old\nfrom typing import TypeVar\nT = TypeVar('T')\ndef first(xs: list[T]) -> T | None: ...\n\n# new (3.12+)\ndef first[T](xs: list[T]) -> T | None: ...\n```\n\nThe `[T]` after the name says \"this works with any type, and whatever comes in is what goes out\". That relationship is the useful part — a checker knows `first([1,2,3])` gives an int, and `first(['a'])` gives a str.\n\n**Handling several errors at once.** `asyncio.TaskGroup` can fail in more than one way simultaneously — three concurrent tasks, three different exceptions. Those arrive bundled as an `ExceptionGroup`, and `except*` catches by type *within* the bundle:\n\n```\ntry:\n    async with asyncio.TaskGroup() as tg:\n        ...\nexcept* ValueError as eg:\n    ...    # just the ValueErrors\nexcept* TypeError as eg:\n    ...    # just the TypeErrors\n```\n\nUnlike ordinary `except`, more than one `except*` block can run — because more than one kind of failure may genuinely have occurred.",
      },
      {
        kind: "pitfalls",
        id: "pf1",
        title: "Using these well",
        items: [
          {
            wrong: "data = [1, 2, 3]\nif n := len(data) > 2:\n    print(n)",
            problem:
              "Prints True, not 3. Without brackets the comparison binds first, so n gets the result of `len(data) > 2`. Bracket the walrus expression itself.",
            right: "data = [1, 2, 3]\nif (n := len(data)) > 2:\n    print(n)",
          },
          {
            wrong: "total = (x := 5) + (y := 10)\nprint(total)",
            problem:
              "Works, but there's no reason to write it this way — it's harder to read than two plain assignments and saves nothing. The walrus is for removing duplicated computation, not for compressing ordinary code.",
            right: "x = 5\ny = 10\ntotal = x + y\nprint(total)",
          },
        ],
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "data = [1, 2, 3, 4]\nif (n := len(data)) > 2:\n    print(f'{n} items')\n",
        answer: "4 items",
        hints: [
          "The walrus assigns and produces in one go — so what does n hold when the body runs?",
          "n gets len(data), which is 4. The comparison is against that same value.",
        ],
        why:
          "`(n := len(data))` stores 4 in n and yields 4 for the comparison. 4 > 2 holds, so the body runs with n still available.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Generic last()",
        prompt:
          "Write `last` using the 3.12 generic syntax: it takes a list of any type and returns the final element, or None when the list is empty. Print last([1,2,3]) and last([]).",
        starter: "def last[T](xs: list[T]) -> T | None:\n    ...\n\nprint(last([1,2,3]))\nprint(last([]))\n",
        expected: "3\nNone",
        hints: [
          "The signature is already written for you — only the body is missing.",
          "An empty list is falsy, so `if xs:` distinguishes the two cases.",
          "`return xs[-1] if xs else None` does it in one line.",
        ],
        solution:
          "def last[T](xs: list[T]) -> T | None:\n    return xs[-1] if xs else None\n\nprint(last([1,2,3]))\nprint(last([]))\n",
        solutionWhy:
          "`xs[-1]` is the last element, and the truthiness check handles the empty case without needing len().\n\nThe `[T]` is what makes this genuinely generic: a type checker knows `last([1,2,3])` yields `int | None` while `last(['a'])` yields `str | None`. The annotation carries the relationship between input and output, not just their shapes.",
      },
    ],
  },
];
