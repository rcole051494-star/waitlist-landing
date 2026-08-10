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
        title: "int and float",
        body:
          "`int` has **arbitrary precision** — no overflow. `float` is IEEE 754 double.\n\nOperators: `+`, `-`, `*`, `/` (true division → float), `//` (floor division), `%` (modulo), `**` (power).\n\nUse `_` as a digit separator: `1_000_000`.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Division kinds",
        code:
          "print(7 / 2)    # 3.5   (true division)\n" +
          "print(7 // 2)   # 3     (floor division)\n" +
          "print(-7 // 2)  # -4    (rounds toward -infinity)\n" +
          "print(7 % 2)    # 1     (modulo)\n" +
          "print(2 ** 10)  # 1024  (power)\n",
      },
      {
        kind: "example",
        id: "e2",
        title: "Big ints just work",
        code: "print(2 ** 200)\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "print(0.1 + 0.2 == 0.3)\n",
        answer: "False",
        hint: "Binary floating point can't represent 0.1 exactly.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: safe float compare within 1e-9",
        buggy: "import math\na = 0.1 + 0.2\nb = 0.3\nprint(a == b)\n",
        expected: "True",
        hint: "Use math.isclose(a, b).",
      },
      {
        kind: "write",
        id: "w1",
        title: "Compound interest",
        prompt:
          "Given principal=1000, rate=0.05, years=10 print the final amount rounded to 2 decimals (compounded annually). Expected: 1628.89",
        starter:
          "principal = 1000\nrate = 0.05\nyears = 10\n# print the final amount with 2 decimals\n",
        expected: "1628.89",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "Which is true?",
        prompt: "About integer division in Python 3:",
        options: [
          "`/` returns an int if both operands are ints",
          "`//` always returns a float",
          "`/` always returns a float; `//` returns an int if both are ints",
          "`%` is undefined for negative numbers",
        ],
        correctIndex: 2,
        why: "`/` is true division (always float); `//` follows the operand types.",
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
        title: "Strings are immutable sequences of Unicode code points",
        body:
          "You can index (`s[0]`) and slice (`s[1:4]`, `s[::-1]`). Every method returns a **new string** — the original is never changed.\n\nCore methods to know: `.upper()`, `.lower()`, `.strip()`, `.startswith()`, `.endswith()`, `.replace()`, `.split()`, `.join()`, `.find()`, `.count()`.\n\nSlicing form: `s[start:stop:step]`, all optional. Negative indexes count from the end.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Slicing",
        code:
          "s = 'code forge'\n" +
          "print(s[0])       # 'c'\n" +
          "print(s[-1])      # 'e'\n" +
          "print(s[:4])      # 'code'\n" +
          "print(s[5:])      # 'forge'\n" +
          "print(s[::-1])    # 'egrof edoc'  (reverse)\n" +
          "print(s.split())  # ['code', 'forge']\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "print(' - '.join(['a', 'b', 'c']))\n",
        answer: "a - b - c",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: normalize input, print greeting",
        buggy: "user = '   Ada   '\ngreeting = 'hello, ' + user + '!'\nprint(greeting)\n",
        expected: "hello, Ada!",
        hint: "Strip whitespace before concatenating.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Reverse the words in a sentence",
        prompt:
          "Given s = 'the quick brown fox', print the words in reverse order: 'fox brown quick the'",
        starter: "s = 'the quick brown fox'\n# print the reversed sentence\n",
        expected: "fox brown quick the",
      },
      {
        kind: "explain",
        id: "x1",
        title: "Explain",
        prompt: "Why does `s.upper()` not change `s` itself?",
        minWords: 10,
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
          "In Python, the following are **falsy**: `False`, `None`, `0`, `0.0`, `''`, `[]`, `()`, `{}`, `set()`.\n\nEverything else is truthy. `and`/`or` **short-circuit** and return one of the operands — not necessarily `True`/`False`.\n\nComparisons chain: `0 < x < 10` is equivalent to `0 < x and x < 10`.",
      },
      {
        kind: "example",
        id: "e1",
        title: "Short-circuit returns",
        code:
          "print(0 or 'fallback')       # 'fallback'\n" +
          "print('yes' or 'nope')       # 'yes'\n" +
          "print(1 and 2)               # 2  (last truthy)\n" +
          "print(None and 'never')      # None (short-circuits)\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code: "x = 5\nprint(0 < x < 10)\n",
        answer: "True",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: only greet non-empty names",
        buggy:
          "name = ''\nif name == True:\n    print(f'hi {name}')\nelse:\n    print('nobody home')\n",
        expected: "nobody home",
        hint: "Test the name for truthiness directly, don't compare with True.",
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
        why: "Empty sequences are falsy — testing the object directly is idiomatic.",
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
        title: "Indentation is the syntax",
        body:
          "Python uses indentation (4 spaces by convention) to delimit blocks. No braces.\n\n`for x in iterable:` iterates. `while cond:` loops while true. Both can have an `else:` clause that runs **only if the loop completed without `break`**.",
      },
      {
        kind: "example",
        id: "e1",
        title: "for/else",
        code:
          "nums = [2, 4, 7, 8]\nfor n in nums:\n    if n % 2:\n        print(f'odd: {n}')\n        break\nelse:\n    print('all even')\n",
      },
      {
        kind: "predict",
        id: "p1",
        title: "Predict",
        code:
          "total = 0\nfor i in range(1, 6):\n    if i == 3:\n        continue\n    total += i\nprint(total)\n",
        answer: "12",
        hint: "range(1,6) = 1,2,3,4,5; skip 3.",
      },
      {
        kind: "fix",
        id: "f1",
        title: "Fix: print 'buzz' for multiples of 5",
        buggy:
          "for i in range(1, 11):\n    if i % 5 = 0:\n        print('buzz')\n    else:\n        print(i)\n",
        expected: "1\n2\n3\n4\nbuzz\n6\n7\n8\n9\nbuzz",
        hint: "`=` is assignment. Comparison uses `==`.",
      },
      {
        kind: "write",
        id: "w1",
        title: "Sum of even numbers 1..100",
        prompt: "Print the sum of even numbers from 1 to 100 inclusive. Expected: 2550",
        starter: "# print the sum here\n",
        expected: "2550",
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
