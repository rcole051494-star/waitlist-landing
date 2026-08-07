"use client";

// Executes JavaScript in a sandboxed iframe (srcdoc + sandbox="allow-scripts").
// Uses ES2024+ features freely — the top-level code is wrapped in an async fn.
// Console output mimics Node's default util.inspect so expected outputs read naturally.

export type JsResult = { stdout: string; stderr: string; error?: string; value?: string };

const INSPECT_JS = `
function _inspect(v, seen) {
  seen = seen || new WeakSet();
  if (v === null) return 'null';
  if (v === undefined) return 'undefined';
  if (typeof v === 'string') return "'" + v.replace(/\\\\/g, "\\\\\\\\").replace(/'/g, "\\\\'") + "'";
  if (typeof v === 'number') return Object.is(v, -0) ? '-0' : String(v);
  if (typeof v === 'boolean') return String(v);
  if (typeof v === 'bigint') return String(v) + 'n';
  if (typeof v === 'symbol') return v.toString();
  if (typeof v === 'function') return '[Function: ' + (v.name || 'anonymous') + ']';
  if (v instanceof RegExp) return v.toString();
  if (v instanceof Date) return v.toISOString();
  if (v instanceof Error) return v.name + ': ' + v.message;
  if (v instanceof Map) {
    var parts = [];
    v.forEach(function (val, k) { parts.push(_inspect(k, seen) + ' => ' + _inspect(val, seen)); });
    return 'Map(' + v.size + ') { ' + parts.join(', ') + ' }';
  }
  if (v instanceof Set) {
    var parts = [];
    v.forEach(function (val) { parts.push(_inspect(val, seen)); });
    return 'Set(' + v.size + ') { ' + parts.join(', ') + ' }';
  }
  if (typeof v === 'object') {
    if (seen.has(v)) return '[Circular]';
    seen.add(v);
    if (Array.isArray(v)) {
      if (v.length === 0) return '[]';
      return '[ ' + v.map(function (x) { return _inspect(x, seen); }).join(', ') + ' ]';
    }
    var keys = Object.keys(v);
    if (keys.length === 0) return '{}';
    var pairs = keys.map(function (k) {
      var kOut = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : "'" + k + "'";
      return kOut + ': ' + _inspect(v[k], seen);
    });
    return '{ ' + pairs.join(', ') + ' }';
  }
  return String(v);
}
`;

const SANDBOX_HTML =
  `<!doctype html><meta charset="utf-8"><script>
(function () {
  const send = (kind, data) => parent.postMessage({ __jsrun: true, kind, data }, "*");
  ${INSPECT_JS}
  const fmt = (args) => args.map(function (v) {
    if (typeof v === 'string') return v;
    try { return _inspect(v); } catch (e) { return String(v); }
  }).join(" ");
  window.console = {
    log:   function () { send("out", fmt([].slice.call(arguments))); },
    info:  function () { send("out", fmt([].slice.call(arguments))); },
    warn:  function () { send("out", fmt([].slice.call(arguments))); },
    error: function () { send("err", fmt([].slice.call(arguments))); },
    debug: function () { send("out", fmt([].slice.call(arguments))); },
  };
  window.addEventListener("message", async (ev) => {
    const msg = ev.data;
    if (!msg || !msg.__jsrun_code) return;
    try {
      const wrapped = "(async () => {\\n" + msg.code + "\\n})()";
      const value = await eval(wrapped);
      send("value", value === undefined ? "" : _inspect(value));
      send("done", "");
    } catch (e) {
      const stack = (e && e.stack) ? String(e.stack) : String(e);
      send("err", stack);
      send("done", "");
    }
  });
  send("ready", "");
})();
</script>`;

export function runJs(code: string, timeoutMs = 4000): Promise<JsResult> {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.style.display = "none";
    iframe.srcdoc = SANDBOX_HTML;
    let stdout = "";
    let stderr = "";
    let value = "";
    let done = false;
    const cleanup = () => {
      window.removeEventListener("message", onMessage);
      iframe.remove();
    };
    const timer = setTimeout(() => {
      if (done) return;
      done = true;
      cleanup();
      resolve({ stdout, stderr, value, error: `Execution timed out after ${timeoutMs}ms` });
    }, timeoutMs);
    const onMessage = (ev: MessageEvent) => {
      const msg: any = ev.data;
      if (!msg || !msg.__jsrun) return;
      if (msg.kind === "ready") {
        iframe.contentWindow?.postMessage({ __jsrun_code: true, code }, "*");
      } else if (msg.kind === "out") {
        stdout += (stdout ? "\n" : "") + msg.data;
      } else if (msg.kind === "err") {
        stderr += (stderr ? "\n" : "") + msg.data;
      } else if (msg.kind === "value") {
        value = msg.data;
      } else if (msg.kind === "done") {
        if (done) return;
        done = true;
        clearTimeout(timer);
        cleanup();
        resolve({ stdout, stderr, value });
      }
    };
    window.addEventListener("message", onMessage);
    document.body.appendChild(iframe);
  });
}
