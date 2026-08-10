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
            code: "elif score >= 70:  /  else:",
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
            code: "    total = total + i      # pass 1",
            what:
              "Right side first, as always: total (0) plus i (1) is 1. Stick that back onto total. The block is finished, so Python loops back up to the for line.",
            state: "i = 1, total = 1",
          },
          {
            code: "for i in range(1, 4):      # next value",
            what: "There are more numbers to come, so i is re-pointed at 2 and the block runs again.",
            state: "i = 2, total = 1",
          },
          {
            code: "    total = total + i      # pass 2",
            what: "total (1) plus i (2) is 3. Back up to the top again.",
            state: "i = 2, total = 3",
          },
          {
            code: "    total = total + i      # pass 3",
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
        title: "Lists mutate in place",
        body:
          "`.append(x)`, `.extend(iter)`, `.insert(i, x)`, `.pop(i=-1)`, `.remove(x)`, `.sort()`, `.reverse()` all mutate.\n\n`sorted(xs)` and `reversed(xs)` return **new** iterables.\n\nAssignment aliases — it does not copy: `b = a` then `b.append(1)` mutates `a` too. Copy with `a[:]`, `list(a)`, or `copy.deepcopy(a)` (for nested).",
      },
      {
        kind: "example",
        id: "e1",
        title: "Aliasing",
        code: "a = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "xs = [3, 1, 2]\nys = sorted(xs)\nxs.append(0)\nprint(xs, ys)\n",
        answer: "[3, 1, 2, 0] [1, 2, 3]",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: build a copy so the original is unchanged",
        buggy:
          "nums = [1, 2, 3]\ncopy = nums\ncopy.append(99)\nprint('nums:', nums)\nprint('copy:', copy)\n",
        expected: "nums: [1, 2, 3]\ncopy: [1, 2, 3, 99]",
        hint: "Make copy with `nums[:]` or `list(nums)`.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Squares of odd numbers 1..9",
        prompt: "Print a list of squares of odd numbers from 1 to 9 inclusive. Expected: [1, 9, 25, 49, 81]",
        starter: "# print the list here\n",
        expected: "[1, 9, 25, 49, 81]",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "Which mutates?",
        prompt: "Which of these mutates the original list?",
        options: [
          "sorted(xs)",
          "reversed(xs)",
          "xs.sort()",
          "xs + [99]",
        ],
        correctIndex: 2,
        why: "Only in-place methods on the list itself mutate.",
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
        title: "Tuples are frozen lists — with a purpose",
        body:
          "Use a tuple when the position **means** something: `(x, y)`, `(name, age)`. Tuples are hashable, so they can be dict keys.\n\nUnpacking: `a, b = (1, 2)`. `*` collects the rest: `first, *middle, last = [1, 2, 3, 4]` → middle == [2, 3].",
      },
      {
        kind: "example",
        id: "e1",
        title: "Swap without a temp",
        code: "a, b = 1, 2\na, b = b, a\nprint(a, b)\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "first, *rest = [10, 20, 30, 40]\nprint(first, rest)\n",
        answer: "10 [20, 30, 40]",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: split a name into first, middle-list, last",
        buggy:
          "parts = 'John Fitzgerald Kennedy'.split()\nfirst, last = parts\nprint(first, last)\n",
        expected: "John ['Fitzgerald'] Kennedy",
        hint: "Use `first, *middles, last = parts` then print all three.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Return two values",
        prompt:
          "Write a function `stats(xs)` that returns a tuple (min, max). Call `stats([4,1,7,2])` and print the tuple.",
        starter: "def stats(xs):\n    ...\n\nprint(stats([4,1,7,2]))\n",
        expected: "(1, 7)",
      },
    ],
  },

  {
    id: "py.08.dicts",
    track: "python",
    index: 8,
    title: "Dictionaries",
    summary: "Key-value maps: get/set, .get(), .setdefault(), iteration, dict comprehensions.",
    concepts: ["py:dict", "py:dict-methods", "py:iteration"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Dicts preserve insertion order (guaranteed since 3.7)",
        body:
          "`d = {'a': 1}` — access `d['a']` raises `KeyError` if missing. `d.get('a', default)` never raises.\n\nIteration: `for k in d` iterates keys. `d.items()` yields `(k, v)` pairs. `d.values()` yields values.\n\nMerge: `d1 | d2` (Python 3.9+) returns a new dict.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Common patterns",
        code:
          "counts = {}\nfor ch in 'banana':\n    counts[ch] = counts.get(ch, 0) + 1\nprint(counts)\n" +
          "print({v: k for k, v in {'a':1,'b':2}.items()})  # invert\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "d = {'a': 1} | {'a': 2, 'b': 3}\nprint(d)\n",
        answer: "{'a': 2, 'b': 3}",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: safe lookup with default 0",
        buggy: "prices = {'apple': 1.0, 'pear': 1.5}\nprint(prices['banana'])\n",
        expected: "0",
        hint: "Use `.get(key, default)`.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Word count",
        prompt:
          "Given `text = 'to be or not to be'`, print a dict of word→count. Expected: {'to': 2, 'be': 2, 'or': 1, 'not': 1}",
        starter: "text = 'to be or not to be'\n# print counts dict here\n",
        expected: "{'to': 2, 'be': 2, 'or': 1, 'not': 1}",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "Which value can be a dict key?",
        prompt: "Only hashable values can be dict keys.",
        options: [
          "['a', 'b']",
          "{'x': 1}",
          "(1, 'two')",
          "{1, 2, 3}",
        ],
        correctIndex: 2,
        why: "Tuples of hashables are hashable. Lists, dicts, and sets are not.",
      },
    ],
  },

  {
    id: "py.09.sets",
    track: "python",
    index: 9,
    title: "Sets & uniqueness",
    summary: "Unordered collections of unique hashables; union/intersection/difference.",
    concepts: ["py:set", "py:set-algebra"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "When to reach for a set",
        body:
          "Sets test membership in O(1) and enforce uniqueness. Operators: `|` union, `&` intersection, `-` difference, `^` symmetric difference.\n\n`{}` is an empty dict, not an empty set — use `set()` for that.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Dedupe while preserving order",
        code:
          "seen = set()\nout = []\nfor x in [1, 2, 2, 3, 1, 4]:\n    if x not in seen:\n        seen.add(x)\n        out.append(x)\nprint(out)\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "print({1,2,3} & {2,3,4})\n",
        answer: "{2, 3}",
      },
      {
        kind: "write",
        id: "w1",
        title: "Unique letters",
        prompt: "Print the number of unique letters in 'mississippi'. Expected: 4",
        starter: "# print the count\n",
        expected: "4",
      },
    ],
  },

  {
    id: "py.10.comprehensions",
    track: "python",
    index: 10,
    title: "Comprehensions",
    summary: "List, dict, and set comprehensions with conditions and nested loops.",
    concepts: ["py:comprehensions", "py:filter-map"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Read them as pipelines",
        body:
          "`[expr for x in xs if cond]` reads: **for each** x in xs, **if** cond, produce expr.\n\nSet: `{...}`. Dict: `{k: v for ...}`. Generator: `(...)` — lazy, doesn't materialize.\n\nPrefer comprehensions over `map`/`filter` in idiomatic Python.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Nested",
        code:
          "pairs = [(x, y) for x in range(3) for y in range(3) if x != y]\nprint(pairs)\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "print([x*x for x in range(1,6) if x % 2])\n",
        answer: "[1, 9, 25]",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: dict of number → square, only evens",
        buggy: "print({n: n*n for n in range(6) if n % 2})\n",
        expected: "{0: 0, 2: 4, 4: 16}",
        hint: "`n % 2` is true for odds. Flip it with `not` or compare `== 0`.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Flatten",
        prompt:
          "Given `m = [[1,2],[3,4],[5,6]]`, print a single flat list: [1, 2, 3, 4, 5, 6]",
        starter: "m = [[1,2],[3,4],[5,6]]\n# print here\n",
        expected: "[1, 2, 3, 4, 5, 6]",
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
        title: "Signature grammar",
        body:
          "`def f(pos, /, both, *args, kw_only, **kwargs)` covers every parameter kind.\n\n- `/` marks the end of **positional-only** params.\n- `*args` collects extra positional args into a tuple.\n- After `*args` (or a bare `*`), everything is **keyword-only**.\n- `**kwargs` collects extra keyword args into a dict.\n\n**Default-args trap**: default values are evaluated once at `def` time. Never use mutable defaults like `def f(x=[])`.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Keyword-only args",
        code:
          "def make(name, *, upper=False):\n    return name.upper() if upper else name\n\nprint(make('ada'))\nprint(make('ada', upper=True))\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "def add(x, y=10):\n    return x + y\nprint(add(1), add(1, 2))\n",
        answer: "11 3",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: the mutable-default trap",
        buggy:
          "def append_to(x, xs=[]):\n    xs.append(x)\n    return xs\nprint(append_to(1))\nprint(append_to(2))\n",
        expected: "[1]\n[2]",
        hint: "Use `xs=None` and create a new list inside the function.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Variadic sum",
        prompt: "Write `total(*nums)` that returns the sum. Print total(1,2,3,4). Expected: 10",
        starter: "def total(*nums):\n    ...\n\nprint(total(1,2,3,4))\n",
        expected: "10",
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
        why: "Defaults evaluate at def time, so callers share the same list.",
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
        title: "Modern hint syntax (3.10+/3.12+)",
        body:
          "You no longer need to import from `typing` for most things:\n\n- `list[int]`, `dict[str, float]`, `tuple[int, ...]` — built-in generics.\n- `int | None` — union type (replaces `Optional[int]`).\n- `type Vec = list[float]` — new PEP 695 type alias (3.12+).\n\nType hints are optional and non-enforced at runtime; they document intent and enable checkers.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Hinting a function",
        code:
          "def parse_age(s: str) -> int | None:\n" +
          "    return int(s) if s.isdigit() else None\n" +
          "\nprint(parse_age('42'), parse_age('x'))\n",
      },
      {
        kind: "example",
        id: "e2",
        title: "PEP 695 type alias",
        code: "type Vec = list[float]\ndef norm(v: Vec) -> float:\n    return sum(x*x for x in v) ** 0.5\nprint(norm([3.0, 4.0]))\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "def f(x: int) -> str:\n    return x  # hints don't enforce\nprint(type(f(5)).__name__)\n",
        answer: "int",
        hint: "Hints are advisory. The function returns whatever it actually returns.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Annotate a signature",
        prompt:
          "Write `def top(nums, k)` returning the k largest ints. Hint the parameters as list[int] and int, and the return as list[int]. Print top([4,1,7,2,8], 3). Expected: [8, 7, 4]",
        starter: "def top(nums, k):\n    ...\n\nprint(top([4,1,7,2,8], 3))\n",
        expected: "[8, 7, 4]",
      },
    ],
  },

  {
    id: "py.13.classes",
    track: "python",
    index: 13,
    title: "Classes & dataclasses",
    summary: "OOP basics, `__init__`, methods, and `@dataclass` for records.",
    concepts: ["py:classes", "py:oop", "py:dataclass"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "The shape of a class",
        body:
          "`__init__(self, ...)` sets up instance attributes. Methods take `self` as their first parameter.\n\nFor plain data records, use `@dataclass` — it writes `__init__`, `__repr__`, and `__eq__` for you.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Dataclass",
        code:
          "from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: float\n    y: float\n    def dist(self) -> float:\n        return (self.x**2 + self.y**2) ** 0.5\n\np = Point(3, 4)\nprint(p, p.dist())\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "class C:\n    n = 0\n    def __init__(self): C.n += 1\n\na, b, c = C(), C(), C()\nprint(C.n)\n",
        answer: "3",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: give the class an area method",
        buggy:
          "class Rect:\n    def __init__(self, w, h):\n        self.w = w\n        self.h = h\n\nr = Rect(3, 4)\nprint(r.area())\n",
        expected: "12",
        hint: "Add a method `area(self)` returning `self.w * self.h`.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Counter class",
        prompt:
          "Write a class `Counter` with methods `tick()` and `value()`. Create one, tick 5 times, then print value(). Expected: 5",
        starter:
          "class Counter:\n    def __init__(self):\n        ...\n    def tick(self):\n        ...\n    def value(self):\n        ...\n\nc = Counter()\nfor _ in range(5):\n    c.tick()\nprint(c.value())\n",
        expected: "5",
      },
    ],
  },

  {
    id: "py.14.errors",
    track: "python",
    index: 14,
    title: "Errors & exceptions",
    summary: "Raising, catching, `else`/`finally`, and custom exceptions.",
    concepts: ["py:exceptions", "py:try-except", "py:custom-exceptions"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "try / except / else / finally",
        body:
          "- `try:` — code that might raise.\n- `except SomeError as e:` — catches this class (and subclasses).\n- `else:` — runs only if `try` didn't raise.\n- `finally:` — always runs, even on `return` or `raise`.\n\nRaise with `raise ValueError('bad input')`. Never catch bare `except:` — it swallows `KeyboardInterrupt`.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Custom exception",
        code:
          "class NotEnough(Exception): pass\n\ndef withdraw(balance, amt):\n    if amt > balance: raise NotEnough(f'need {amt}, have {balance}')\n    return balance - amt\n\ntry:\n    withdraw(10, 20)\nexcept NotEnough as e:\n    print('error:', e)\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "def f():\n    try:\n        return 1\n    finally:\n        print('cleanup')\nprint(f())\n",
        answer: "cleanup\n1",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: catch the specific error, not everything",
        buggy:
          "try:\n    n = int('x')\nexcept:\n    print('failed')\n",
        expected: "bad int: invalid literal for int() with base 10: 'x'",
        hint: "Catch `ValueError as e` and print exactly `bad int: {e}`.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Safe divide",
        prompt:
          "Write `safe_div(a, b)` that returns a/b, or the string 'undefined' when b == 0. Print safe_div(6, 3) and safe_div(1, 0).",
        starter: "def safe_div(a, b):\n    ...\n\nprint(safe_div(6, 3))\nprint(safe_div(1, 0))\n",
        expected: "2.0\nundefined",
      },
    ],
  },

  {
    id: "py.15.iter-gen",
    track: "python",
    index: 15,
    title: "Iterators & generators",
    summary: "Lazy sequences with `yield`; the iterator protocol; generator expressions.",
    concepts: ["py:iterator", "py:generator", "py:yield"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "yield produces a lazy sequence",
        body:
          "A function containing `yield` returns a **generator** — you get values one at a time on demand. Ideal for large or infinite streams.\n\nGenerator expression: `(x*x for x in xs)` — same idea, inline.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Fibonacci",
        code:
          "def fib():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\ng = fib()\nprint([next(g) for _ in range(10)])\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "def evens(n):\n    for i in range(n):\n        if i % 2 == 0:\n            yield i\nprint(list(evens(6)))\n",
        answer: "[0, 2, 4]",
      },
      {
        kind: "write",
        id: "w1",
        title: "Sum of squares up to 100 via generator expression",
        prompt: "Print the sum of squares 1..100 using a generator expression. Expected: 338350",
        starter: "# print here using sum(...)\n",
        expected: "338350",
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
        title: "match on shape, not just value",
        body:
          "`match x:` opens the block. Each `case pattern:` tries to match `x`.\n\nPatterns can be:\n- literals: `case 0:`, `case 'hi':`\n- captures: `case n:` binds n\n- sequences: `case [a, b, *rest]:`\n- mappings: `case {'type': 'circle', 'r': r}:`\n- classes: `case Point(x=0, y=y):`\n- OR: `case 1 | 2 | 3:`\n- wildcard: `case _:`",
      },
      {
        kind: "example",
        id: "e1",
        title: "Shape router",
        code:
          "def describe(shape):\n    match shape:\n        case {'type': 'circle', 'r': r}: return f'circle r={r}'\n        case {'type': 'rect', 'w': w, 'h': h}: return f'{w}x{h}'\n        case _: return 'unknown'\n\nprint(describe({'type': 'circle', 'r': 5}))\nprint(describe({'type': 'rect', 'w': 3, 'h': 4}))\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "def describe(xs):\n    match xs:\n        case []: return 'empty'\n        case [x]: return f'one: {x}'\n        case [x, *rest]: return f'first={x}, rest={rest}'\nprint(describe([]), describe([1]), describe([1,2,3]))\n",
        answer: "empty one: 1 first=1, rest=[2, 3]",
      },
      {
        kind: "write",
        id: "w1",
        title: "HTTP status classifier",
        prompt:
          "Write `classify(code)` returning 'ok' for 200-299, 'client' for 400-499, 'server' for 500-599, else 'other'. Use match with guards (`case n if 200 <= n < 300`). Print classify(204), classify(404), classify(500), classify(302).",
        starter: "def classify(code):\n    ...\n\nfor c in (204, 404, 500, 302):\n    print(classify(c))\n",
        expected: "ok\nclient\nserver\nother",
      },
    ],
  },

  {
    id: "py.17.modules",
    track: "python",
    index: 17,
    title: "Modules & the standard library",
    summary: "Imports, `__name__`, and staple modules: pathlib, json, itertools, collections.",
    concepts: ["py:modules", "py:imports", "py:stdlib"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Import forms",
        body:
          "- `import json` — access as `json.loads(...)`.\n- `from collections import Counter` — brings names in.\n- `import numpy as np` — alias.\n\nStaples to know:\n- `pathlib.Path` — filesystem paths, chainable.\n- `json` — dumps/loads.\n- `itertools` — chain, groupby, product, combinations.\n- `collections` — Counter, defaultdict, deque, namedtuple.\n- `functools` — cache, reduce, partial.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Counter and Path",
        code:
          "from collections import Counter\nfrom pathlib import Path\n\nprint(Counter('mississippi').most_common(2))\np = Path('/tmp') / 'x' / 'y.txt'\nprint(p, p.suffix, p.name)\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "from itertools import accumulate\nprint(list(accumulate([1,2,3,4])))\n",
        answer: "[1, 3, 6, 10]",
      },
      {
        kind: "write",
        id: "w1",
        title: "Group by first letter with defaultdict",
        prompt:
          "Given words = ['ant','ape','bee','bat','cat'], print a defaultdict-shaped dict mapping first letter → list of words in original order. Expected: {'a': ['ant', 'ape'], 'b': ['bee', 'bat'], 'c': ['cat']}",
        starter:
          "from collections import defaultdict\nwords = ['ant','ape','bee','bat','cat']\n# build and print\n",
        expected: "{'a': ['ant', 'ape'], 'b': ['bee', 'bat'], 'c': ['cat']}",
        hint: "Use `dict(g)` to strip the defaultdict wrapper before printing.",
      },
    ],
  },

  {
    id: "py.18.async",
    track: "python",
    index: 18,
    title: "async / await",
    summary: "Concurrency for I/O-bound work with the asyncio event loop.",
    concepts: ["py:async", "py:await", "py:asyncio"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Coroutines, not threads",
        body:
          "`async def` defines a coroutine. Inside, `await other_coroutine()` yields control back to the event loop until the awaited coroutine is done.\n\nUse `asyncio.run(main())` to start it. Use `asyncio.gather(*tasks)` to run coroutines concurrently.\n\nAsync is for **I/O-bound** work (network, disk). CPU-bound work needs threads or processes.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Concurrent waits",
        code:
          "import asyncio, time\n\nasync def work(name, secs):\n    await asyncio.sleep(secs)\n    return f'{name} done'\n\nasync def main():\n    start = time.perf_counter()\n    results = await asyncio.gather(work('a', 0.2), work('b', 0.2), work('c', 0.2))\n    print(results)\n    print(f'{time.perf_counter() - start:.2f}s')\n\nasyncio.run(main())\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict (which order?)",
        code:
          "import asyncio\nasync def slow():\n    await asyncio.sleep(0.05)\n    return 'slow'\nasync def fast():\n    return 'fast'\nasync def main():\n    a, b = await asyncio.gather(slow(), fast())\n    print(a, b)\nasyncio.run(main())\n",
        answer: "slow fast",
        hint: "gather returns in the order of its arguments, not completion.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Rewrite to run concurrently",
        prompt:
          "Given the two coroutines below, replace the two sequential awaits with a single asyncio.gather so total time is ~0.1s not ~0.2s. Print 'done'.",
        starter:
          "import asyncio\nasync def a():\n    await asyncio.sleep(0.1)\nasync def b():\n    await asyncio.sleep(0.1)\nasync def main():\n    await a()\n    await b()\n    print('done')\nasyncio.run(main())\n",
        expected: "done",
      },
    ],
  },

  {
    id: "py.19.files",
    track: "python",
    index: 19,
    title: "Files, JSON, and pathlib",
    summary: "Reading/writing text and JSON files with modern Path-based APIs.",
    concepts: ["py:files", "py:json", "py:pathlib"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Use `with` for cleanup",
        body:
          "`with open(path) as f:` guarantees the file is closed. `Path(path).read_text()` and `.write_text(s)` are one-liners when you don't need streaming.\n\nFor JSON: `json.dumps(obj)` (to string), `json.loads(s)` (from string), `json.dump(obj, f)` (to file).",
      },
      {
        kind: "example",
        id: "e1",
        title: "JSON round-trip in memory",
        code:
          "import json\ndata = {'name': 'Ada', 'skills': ['py', 'math'], 'active': True}\ns = json.dumps(data)\nprint(s)\nback = json.loads(s)\nprint(back['skills'])\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "import json\nprint(json.dumps({'a': 1}, sort_keys=True, indent=2))\n",
        answer: '{\n  "a": 1\n}',
      },
      {
        kind: "write",
        id: "w1",
        title: "Pretty-print with 4-space indent",
        prompt:
          "Given d = {'a': 1, 'b': [1, 2, 3]}, print it as JSON with 4-space indent and keys sorted.",
        starter: "import json\nd = {'a': 1, 'b': [1, 2, 3]}\n# print(...)\n",
        expected: '{\n    "a": 1,\n    "b": [\n        1,\n        2,\n        3\n    ]\n}',
      },
    ],
  },

  {
    id: "py.20.modern",
    track: "python",
    index: 20,
    title: "Modern features: walrus, ExceptionGroup, PEP 695",
    summary: "Recent additions that make idiomatic Python: :=, except*, new generic syntax.",
    concepts: ["py:walrus", "py:exceptiongroup", "py:generics-new"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Walrus `:=` (3.8+)",
        body:
          "Binds and returns a value in one expression. Great for while-loops that need a peek:\n\n```\nwhile (line := f.readline()):\n    ...\n```",
      },
      {
        kind: "example",
        id: "e1",
        title: "Walrus with comprehension",
        code:
          "nums = [1, 4, 9, 16, 25]\n# keep sqrt only when it's a whole number\nresult = [r for n in nums if (r := int(n**0.5))**2 == n]\nprint(result)\n",
      },
      {
        kind: "read",
        id: "r2",
        title: "PEP 695 generic syntax (3.12+)",
        body:
          "```\ndef first[T](xs: list[T]) -> T | None:\n    return xs[0] if xs else None\n```\n\nNo more `TypeVar('T')` boilerplate.",
      },
      {
        kind: "read",
        id: "r3",
        title: "except* for ExceptionGroup",
        body:
          "`asyncio.TaskGroup` can raise several errors at once as an `ExceptionGroup`. `except* ValueError:` catches the ValueError subtree only.",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "data = [1, 2, 3, 4]\nif (n := len(data)) > 2:\n    print(f'{n} items')\n",
        answer: "4 items",
      },
      {
        kind: "write",
        id: "w1",
        title: "Generic wrapper",
        prompt:
          "Write `def last[T](xs: list[T]) -> T | None` that returns the last element or None. Print last([1,2,3]) and last([]).",
        starter: "def last[T](xs: list[T]) -> T | None:\n    ...\n\nprint(last([1,2,3]))\nprint(last([]))\n",
        expected: "3\nNone",
      },
    ],
  },
];
