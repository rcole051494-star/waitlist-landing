"""A faithful replica of how lib/pyodide-runner.ts executes lesson code, so
curriculum claims can be checked without a browser: top-level `await` is
allowed (Pyodide's runPythonAsync does the same), stdout is captured, and the
result is compared to the output the lesson claims.

Keep this in step with lib/pyodide-runner.ts whenever that changes.

Usage: python3 py_sandbox_replica.py <cases.json>
"""
import ast
import asyncio
import contextlib
import io
import json
import sys

CO_COROUTINE = 0x80


def run(code: str) -> tuple[str, str | None]:
    buf = io.StringIO()
    try:
        compiled = compile(code, "<lesson>", "exec", flags=ast.PyCF_ALLOW_TOP_LEVEL_AWAIT)
        scope: dict = {}
        with contextlib.redirect_stdout(buf):
            if compiled.co_flags & CO_COROUTINE:
                asyncio.run(eval(compiled, scope))
            else:
                exec(compiled, scope)
    except Exception as exc:
        return buf.getvalue().rstrip("\n"), f"{type(exc).__name__}: {exc}"
    return buf.getvalue().rstrip("\n"), None


def main() -> int:
    cases = json.load(open(sys.argv[1]))
    passed = failed = 0
    for case in cases:
        got, error = run(case["code"])
        must_differ = case.get("mustDiffer")
        if must_differ is not None:
            # A "fix" exercise's broken code must not already produce the
            # answer; throwing counts as differing, and often is the bug.
            if error is not None or got != must_differ:
                passed += 1
            else:
                failed += 1
                print(f"FAIL(already correct) {case['id']}")
            continue
        want = case.get("expected")
        if error is not None:
            failed += 1
            print(f"FAIL(threw) {case['id']}\n  {error}")
            continue
        if want is None:
            # No asserted output — running without raising is the whole check.
            passed += 1
            continue
        if got == want:
            passed += 1
        else:
            failed += 1
            print(f"FAIL {case['id']}\n  want: {want!r}\n  got:  {got!r}")
    print(f"{passed}/{passed + failed} claims verified")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
