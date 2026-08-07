import type { Project } from "./types";

export const javascriptProjects: Project[] = [
  {
    id: "js.proj.fizzbuzz",
    track: "javascript",
    title: "FizzBuzz — the classic",
    summary: "Warm-up. Loops, conditionals, and modulo.",
    goal: "Print numbers 1 to 15. Multiples of 3 → 'Fizz'. Multiples of 5 → 'Buzz'. Multiples of both → 'FizzBuzz'. Each on its own line.",
    starter: "// write your code here\nfor (let i = 1; i <= 15; i++) {\n  // ...\n}\n",
    hints: [
      "Check divisibility by 15 first, then 3, then 5, else the number.",
      "Use `i % 15 === 0` for both.",
    ],
    successCheck: (out) => {
      const expected = "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz";
      return out.trim() === expected;
    },
  },
  {
    id: "js.proj.wordcount",
    track: "javascript",
    title: "Word frequency counter",
    summary: "Strings + Maps + sorting.",
    goal:
      "Given the string in the starter, log an array of the top 3 [word, count] pairs, case-insensitive, ties broken by first appearance.",
    starter:
      "const text = 'the quick brown fox jumps over the lazy dog the fox was quick';\n// build and console.log the top 3\n",
    hints: [
      "Split into words, lowercase, tally in a Map.",
      "Then sort by count descending, keep top 3.",
    ],
    successCheck: (out) =>
      out.trim() === "[ [ 'the', 3 ], [ 'quick', 2 ], [ 'fox', 2 ] ]",
  },
  {
    id: "js.proj.todo",
    track: "javascript",
    title: "In-memory Todo list",
    summary: "Classes, methods, state.",
    goal:
      "Build a class Todos with add(text), complete(idx), pending() and done() returning arrays of texts. After adding 3 items and completing item at index 1, log pending and done.",
    starter:
      "class Todos {\n  // ...\n}\nconst t = new Todos();\nt.add('buy milk');\nt.add('walk dog');\nt.add('write code');\nt.complete(1);\nconsole.log(t.pending());\nconsole.log(t.done());\n",
    hints: [
      "Store items as array of {text, done} objects.",
      "pending() maps items where done===false to their text.",
    ],
    successCheck: (out) => {
      const trimmed = out.trim();
      return (
        trimmed.includes("'buy milk'") &&
        trimmed.includes("'write code'") &&
        trimmed.includes("'walk dog'")
      );
    },
  },
  {
    id: "js.proj.fetchish",
    track: "javascript",
    title: "Async request queue (simulated)",
    summary: "Promises, async/await, and concurrency.",
    goal:
      "Write `runAll(tasks, concurrency)` that runs an array of async task-returning functions with at most `concurrency` in flight. Log 'done' after finishing.",
    starter:
      "const sleep = ms => new Promise(r => setTimeout(r, ms));\nconst tasks = [() => sleep(20), () => sleep(20), () => sleep(20), () => sleep(20)];\nasync function runAll(tasks, concurrency) {\n  // ...\n}\nawait runAll(tasks, 2);\nconsole.log('done');\n",
    hints: [
      "Keep an index; workers loop pulling the next task.",
      "Await Promise.all of `concurrency` workers.",
    ],
    successCheck: (out) => out.trim() === "done",
  },
];
