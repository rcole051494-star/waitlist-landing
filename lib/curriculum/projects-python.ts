import type { Project } from "./types";

export const pythonProjects: Project[] = [
  {
    id: "py.proj.fizzbuzz",
    track: "python",
    title: "FizzBuzz — the classic",
    summary: "Warm-up. Loops, conditionals, and modulo.",
    goal: "Print numbers 1 to 15. Multiples of 3 → 'Fizz'. Multiples of 5 → 'Buzz'. Multiples of both → 'FizzBuzz'.",
    starter: "# write your code here\nfor i in range(1, 16):\n    ...\n",
    hints: [
      "Check divisibility by 15 first, then 3, then 5, else the number.",
      "`i % 15 == 0` is true only for multiples of both.",
    ],
    successCheck: (out) => {
      const expected = "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz";
      return out.trim() === expected;
    },
  },
  {
    id: "py.proj.wordcount",
    track: "python",
    title: "Word frequency counter",
    summary: "Strings + dicts + sorting.",
    goal: "Given the paragraph in the starter, print the top 3 most common words as tuples (word, count) — case-insensitive, ties broken by first appearance.",
    starter:
      "from collections import Counter\ntext = 'the quick brown fox jumps over the lazy dog the fox was quick'\n# print the top 3 as a list of tuples\n",
    hints: [
      "Split on whitespace, lowercase each word.",
      "Counter has a .most_common(n) method.",
    ],
    successCheck: (out) =>
      out.trim() === "[('the', 3), ('quick', 2), ('fox', 2)]",
  },
  {
    id: "py.proj.todo",
    track: "python",
    title: "In-memory Todo list",
    summary: "Classes, methods, state.",
    goal:
      "Build a class Todos with add(text), complete(idx), pending() -> list, done() -> list. After adding 3 items and completing item 1, print pending and done.",
    starter:
      "class Todos:\n    def __init__(self):\n        ...\n    def add(self, text): ...\n    def complete(self, idx): ...\n    def pending(self): ...\n    def done(self): ...\n\nt = Todos()\nt.add('buy milk')\nt.add('walk dog')\nt.add('write code')\nt.complete(1)\nprint(t.pending())\nprint(t.done())\n",
    hints: [
      "Store items as list of (text, done_bool) tuples.",
      "pending() returns items where done is False; done() the opposite.",
    ],
    successCheck: (out) => {
      const lines = out.trim().split("\n");
      if (lines.length !== 2) return false;
      return (
        lines[0].includes("buy milk") &&
        lines[0].includes("write code") &&
        !lines[0].includes("walk dog") &&
        lines[1].includes("walk dog") &&
        !lines[1].includes("buy milk")
      );
    },
  },
  {
    id: "py.proj.parser",
    track: "python",
    title: "Mini CSV parser",
    summary: "Strings + comprehensions + dicts.",
    goal:
      "Given the CSV string in starter (with a header), parse it into a list of dicts and print the list.",
    starter:
      "csv = 'name,age,city\\nAda,36,London\\nRen,29,Kyoto\\nKai,41,Boston'\n# parse and print list[dict]\n",
    hints: [
      "Split by newline for rows, then by comma for cells.",
      "The first row is the header — use it as the dict keys.",
    ],
    successCheck: (out) => {
      const trimmed = out.trim();
      return (
        trimmed.includes("'name': 'Ada'") &&
        trimmed.includes("'age': '29'") &&
        trimmed.includes("'city': 'Boston'")
      );
    },
  },
];
