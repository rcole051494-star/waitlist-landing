import type { Lesson } from "./types";

// AI-engineering track for Python: ML foundations + LLM app engineering.
// Both Anthropic (Claude) and OpenAI SDKs are covered.
// Lessons that use external SDKs (anthropic, openai, chromadb, etc.) are read-heavy —
// code samples show idiomatic patterns you'll run in your own Python env.
// Pure-Python lessons run live in Pyodide as usual.

export const pythonAiLessons: Lesson[] = [
  // ── ML foundations ───────────────────────────────────────────────────────
  {
    id: "py.ai.01.numpy",
    track: "python",
    module: "ai",
    index: 21,
    title: "NumPy — the language of numerical Python",
    summary: "Arrays, dtypes, broadcasting. The substrate under every ML/AI library.",
    concepts: ["py.ai:numpy:array", "py.ai:numpy:broadcast"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Why arrays, not lists",
        body:
          "A Python list is a bag of pointers to arbitrary objects. A **NumPy array** is a contiguous block of same-typed numbers with a fixed shape. That layout unlocks:\n\n- **Speed** — vectorized C loops instead of Python-level iteration (often 10–100× faster).\n- **Broadcasting** — element-wise ops between compatible shapes, no explicit loop.\n- **Interop** — every ML library (PyTorch, TensorFlow, JAX, scikit-learn, pandas) speaks NumPy or something that looks like it.\n\nCore concepts to internalize: `shape` (dimensions), `dtype` (element type), `axis` (which dimension a reduction runs across).",
      },
      {
        kind: "read",
        id: "r2",
        title: "Creating arrays",
        body:
          "```\nimport numpy as np\na = np.array([1, 2, 3])                # shape (3,)\nb = np.zeros((2, 3))                    # 2×3 of zeros\nc = np.ones((3,), dtype=np.float32)     # explicit dtype\nd = np.arange(0, 10, 2)                 # [0, 2, 4, 6, 8]\ne = np.linspace(0, 1, 5)                # 5 evenly spaced\nf = np.random.default_rng(42).standard_normal((3, 3))\n```\n\n`np.random.default_rng(seed)` is the modern RNG — reproducible.",
      },
      {
        kind: "read",
        id: "r3",
        title: "Vectorized ops + broadcasting",
        body:
          "```\nimport numpy as np\nx = np.array([1, 2, 3])\ny = np.array([10, 20, 30])\nprint(x + y)          # [11 22 33]  element-wise\nprint(x * 2)          # [2 4 6]     broadcast scalar\nprint(x @ y)          # 140         dot product\nA = np.arange(6).reshape(2, 3)   # [[0 1 2] [3 4 5]]\nprint(A + np.array([100, 200, 300]))\n# broadcasts the row across each row of A\n```\n\nRule: shapes align from the right. Missing dims are treated as 1 and stretched.",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "Which is fastest?",
        prompt: "Given a 1M-element array, computing `x * 2` element-wise:",
        options: [
          "A Python for-loop building a new list",
          "A list comprehension",
          "NumPy's `x * 2`",
          "Same speed — all Python",
        ],
        correctIndex: 2,
        why: "NumPy runs a compiled C loop with no Python-level per-element overhead. Usually 20–100× faster than the list versions.",
      },
      {
        kind: "read",
        id: "r4",
        title: "Reductions along an axis",
        body:
          "```\nA = np.array([[1, 2, 3], [4, 5, 6]])\nA.sum()          # 21   — everything\nA.sum(axis=0)    # [5 7 9]   — collapse rows, keep columns\nA.sum(axis=1)    # [6 15]     — collapse columns, keep rows\nA.mean(axis=0)   # [2.5 3.5 4.5]\n```\n\nRule of thumb: `axis` is the dimension you're **removing**.",
      },
      {
        kind: "explain",
        id: "x1",
        title: "In your own words",
        prompt:
          "Why does 'shape (n, 1) + shape (1, m) = shape (n, m)' work? Explain broadcasting in terms of what NumPy does under the hood.",
        minWords: 25,
      },
    ],
  },

  {
    id: "py.ai.02.pandas",
    track: "python",
    module: "ai",
    index: 22,
    title: "pandas — DataFrames for real data",
    summary: "Tabular data manipulation. What every data pipeline lands on.",
    concepts: ["py.ai:pandas:df", "py.ai:pandas:group"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Series and DataFrame",
        body:
          "A `Series` is a 1-D labeled array (a column). A `DataFrame` is a 2-D table of Series that share an index.\n\n```\nimport pandas as pd\ndf = pd.DataFrame({\n    'name': ['Ada', 'Ren', 'Kai'],\n    'age':  [36, 29, 41],\n    'city': ['London', 'Kyoto', 'Boston'],\n})\nprint(df)\nprint(df.dtypes)\nprint(df.shape)   # (3, 3)\n```",
      },
      {
        kind: "read",
        id: "r2",
        title: "Reading, selecting, filtering",
        body:
          "```\ndf = pd.read_csv('users.csv')          # or read_parquet, read_json\ndf['age']                              # a Series\ndf[['name', 'age']]                    # a DataFrame with 2 cols\ndf.loc[df['age'] > 30]                 # rows where age > 30\ndf.query('age > 30 and city == \"Boston\"')\ndf.iloc[0]                             # first row by position\n```\n\n`.loc` selects by **label**; `.iloc` by **integer position**. Never mix them up.",
      },
      {
        kind: "read",
        id: "r3",
        title: "GroupBy — split, apply, combine",
        body:
          "```\ndf.groupby('city')['age'].mean()\n# city\n# Boston    41.0\n# Kyoto     29.0\n# London    36.0\n\ndf.groupby('city').agg(\n    avg_age=('age', 'mean'),\n    n=('name', 'count'),\n)\n```\n\n**The** most useful method for analytics work.",
      },
      {
        kind: "read",
        id: "r4",
        title: "Missing data + joins",
        body:
          "```\ndf.isna().sum()               # count NaN per column\ndf.dropna(subset=['age'])     # drop rows missing age\ndf.fillna({'city': 'unknown'})\n\ndf.merge(other, on='user_id', how='left')     # SQL-style joins\n```\n\nDefault join is 'inner'; use 'left'/'right'/'outer' when you know your data.",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "Pick the right selector",
        prompt: "You want the row where the index label is 'Ada'.",
        options: [
          "df['Ada']",
          "df.loc['Ada']",
          "df.iloc['Ada']",
          "df.query('Ada')",
        ],
        correctIndex: 1,
        why: ".loc uses index labels. .iloc uses integer positions.",
      },
      {
        kind: "explain",
        id: "x1",
        title: "Explain",
        prompt:
          "When would you use `df.query(...)` vs boolean indexing `df[df['x'] > 5]`? What's the trade-off?",
        minWords: 20,
      },
    ],
  },

  {
    id: "py.ai.03.grad",
    track: "python",
    module: "ai",
    index: 23,
    title: "How models learn — gradient descent from scratch",
    summary: "The one algorithm behind every modern ML/AI model. Written by hand in NumPy.",
    concepts: ["py.ai:ml:loss", "py.ai:ml:gradient", "py.ai:ml:training-loop"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "The training loop, distilled",
        body:
          "Every model that 'learns' — from linear regression to GPT-4 — runs the same loop:\n\n1. **Forward** — feed input through the model, get a prediction.\n2. **Loss** — measure how wrong the prediction is (a single number).\n3. **Backward** — compute the gradient of the loss w.r.t. each parameter (how the loss changes if we nudge the parameter).\n4. **Update** — move each parameter a small step **opposite** the gradient. That's gradient descent.\n\nRepeat until the loss stops decreasing.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Linear regression by hand",
        body:
          "Predict `y = w*x + b`. Loss = mean squared error.\n\n```\nimport numpy as np\nrng = np.random.default_rng(0)\nx = np.linspace(-2, 2, 200)\ny_true = 3.0 * x + 1.0 + 0.3 * rng.standard_normal(200)\n\nw, b = 0.0, 0.0\nlr = 0.05\nfor step in range(500):\n    y_pred = w * x + b\n    loss = ((y_pred - y_true) ** 2).mean()\n    # gradients: d loss / d w  and  d loss / d b\n    grad_w = (2 * (y_pred - y_true) * x).mean()\n    grad_b = (2 * (y_pred - y_true)).mean()\n    w -= lr * grad_w\n    b -= lr * grad_b\nprint(w, b)   # ≈ 3.0, 1.0\n```\n\nThat's it. Everything else (deep nets, transformers) is more layers of the same idea plus autograd doing the calculus for you.",
      },
      {
        kind: "read",
        id: "r3",
        title: "Learning rate — the one knob to know",
        body:
          "- Too small → training crawls, may never converge in your compute budget.\n- Too large → loss oscillates or diverges.\n- Right → loss decreases smoothly, plateaus.\n\nModern practice: **learning-rate schedules** — start higher, decay over training. Optimizers like Adam adapt per-parameter learning rates automatically.\n\nAlways plot loss over training steps. If you can't see it, you can't debug it.",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "Why subtract the gradient?",
        prompt: "In `w -= lr * grad_w`, why is the sign negative?",
        options: [
          "Gradients are always negative",
          "The gradient points in the direction of steepest increase; we want to decrease loss",
          "It's a NumPy convention",
          "To keep w bounded",
        ],
        correctIndex: 1,
        why: "Gradient descent moves in the opposite direction of the gradient because the gradient points uphill on the loss surface.",
      },
      {
        kind: "explain",
        id: "x1",
        title: "Explain",
        prompt:
          "A neural network with millions of parameters uses the same 4-step loop. What changes vs the linear-regression example? What stays the same?",
        minWords: 30,
      },
    ],
  },

  {
    id: "py.ai.04.sklearn",
    track: "python",
    module: "ai",
    index: 24,
    title: "scikit-learn — real ML in 10 lines",
    summary: "The consistent estimator API: fit / predict / score. Know it cold.",
    concepts: ["py.ai:sklearn:pipeline", "py.ai:sklearn:split"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "The estimator interface",
        body:
          "Every scikit-learn model has the same three methods:\n\n- `.fit(X, y)` — train on data.\n- `.predict(X)` — predict on new data.\n- `.score(X, y)` — evaluate on a labeled test set.\n\n`X` is a 2-D array of features (n_samples × n_features). `y` is a 1-D array of labels (or targets).\n\nAlways **split** your data first — never evaluate on the data you trained on.",
      },
      {
        kind: "read",
        id: "r2",
        title: "End-to-end classifier",
        body:
          "```\nfrom sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import Pipeline\n\nX, y = load_iris(return_X_y=True)\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42, stratify=y)\n\nmodel = Pipeline([\n    ('scale', StandardScaler()),\n    ('clf', LogisticRegression(max_iter=1000)),\n])\nmodel.fit(X_train, y_train)\nprint('accuracy:', model.score(X_test, y_test))\n```\n\n**Pipeline** = preprocessing + model as one object. The scaler learns from train-only, applies to test — no data leakage.",
      },
      {
        kind: "read",
        id: "r3",
        title: "Which model?",
        body:
          "Start simple, add complexity only when the simple thing isn't good enough.\n\n- **Tabular classification/regression** — start with `LogisticRegression` / `Ridge`. Move to `HistGradientBoostingClassifier` / `HistGradientBoostingRegressor` if you need more.\n- **Text classification** — `TfidfVectorizer` → linear model, or embeddings → linear model. Or just prompt an LLM.\n- **Unsupervised** — `KMeans` for grouping, `PCA` for reducing dimensions.\n\nThese cover 80% of everyday ML.",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "Why split first?",
        prompt: "If you scale features BEFORE splitting into train/test:",
        options: [
          "Nothing changes — it's the same data",
          "The scaler sees the test data statistics, leaking future info into training",
          "It's faster",
          "It's required for logistic regression",
        ],
        correctIndex: 1,
        why: "Data leakage: your evaluation becomes optimistic. Always fit any transform on train only.",
      },
      {
        kind: "explain",
        id: "x1",
        title: "Explain",
        prompt:
          "You train a model that gets 100% accuracy on the training data but 40% on new data. What's happening? What would you try?",
        minWords: 30,
      },
    ],
  },

  {
    id: "py.ai.05.evaluation",
    track: "python",
    module: "ai",
    index: 25,
    title: "Model evaluation — beyond accuracy",
    summary: "Precision, recall, F1, ROC, calibration. Choosing the right metric matters more than the model.",
    concepts: ["py.ai:eval:metrics", "py.ai:eval:cv"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Accuracy lies on imbalanced data",
        body:
          "A cancer detector that always says 'no cancer' gets 99% accuracy if only 1% of the population has it. It's useless.\n\nWhat you actually need for classification:\n\n- **Precision** = of predicted positives, how many were correct?\n- **Recall** = of actual positives, how many did we catch?\n- **F1** = harmonic mean of precision and recall\n- **ROC-AUC** = ranking quality, threshold-independent\n- **Confusion matrix** = raw counts, always look at it",
      },
      {
        kind: "read",
        id: "r2",
        title: "Compute them",
        body:
          "```\nfrom sklearn.metrics import (\n    classification_report, confusion_matrix, roc_auc_score,\n)\nfrom sklearn.model_selection import cross_val_score\n\ny_pred = model.predict(X_test)\ny_proba = model.predict_proba(X_test)[:, 1]   # for binary\n\nprint(classification_report(y_test, y_pred))\nprint(confusion_matrix(y_test, y_pred))\nprint('AUC:', roc_auc_score(y_test, y_proba))\n\n# Cross-validated score — more robust than one split\nscores = cross_val_score(model, X, y, cv=5, scoring='f1_macro')\nprint(scores.mean(), scores.std())\n```",
      },
      {
        kind: "read",
        id: "r3",
        title: "Regression metrics",
        body:
          "- **MAE** (mean absolute error) — average absolute difference. Robust to outliers.\n- **RMSE** — square-rooted mean squared error. Penalizes big misses.\n- **R²** — fraction of variance explained. `1.0` is perfect, `0.0` is 'no better than mean', negative means worse than mean.\n\nChoose based on **how bad is it to be wrong by X vs 2X?** MAE = linear, RMSE = quadratic.",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "Cancer screener",
        prompt: "Missing a cancer case is catastrophic; a false alarm just means one extra test. Which metric do you optimize?",
        options: [
          "Accuracy",
          "Precision",
          "Recall",
          "F1",
        ],
        correctIndex: 2,
        why: "Recall = fraction of true positives caught. Missing positives is the costly error, so recall dominates.",
      },
      {
        kind: "explain",
        id: "x1",
        title: "Explain",
        prompt:
          "Your fraud detector has 95% precision, 20% recall. Product wants recall of 60%. What are your levers? What does the trade-off look like?",
        minWords: 30,
      },
    ],
  },

  // ── LLM engineering ─────────────────────────────────────────────────────
  {
    id: "py.ai.06.http",
    track: "python",
    module: "ai",
    index: 26,
    title: "HTTP + JSON APIs with httpx",
    summary: "The primitive under every SDK. Know it so you can debug what SDKs do.",
    concepts: ["py.ai:http", "py.ai:json"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "httpx — modern requests",
        body:
          "`httpx` is `requests` with an async API and HTTP/2. It's what most modern Python SDKs use under the hood.\n\n```\nimport httpx\n\nr = httpx.get('https://api.example.com/users/42', timeout=10)\nr.raise_for_status()\nprint(r.json())\n\n# POST JSON\nr = httpx.post(\n    'https://api.example.com/users',\n    json={'name': 'Ada'},\n    headers={'authorization': f'Bearer {token}'},\n    timeout=30,\n)\n```\n\nAlways set an **explicit timeout**. Always check `raise_for_status()`.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Async client for parallel calls",
        body:
          "```\nimport asyncio, httpx\n\nasync def fetch(client, url):\n    r = await client.get(url, timeout=10)\n    r.raise_for_status()\n    return r.json()\n\nasync def main():\n    async with httpx.AsyncClient() as client:\n        results = await asyncio.gather(*(\n            fetch(client, u) for u in urls\n        ))\n    return results\n\nasyncio.run(main())\n```\n\nThis is exactly the pattern you'll use to batch LLM API calls.",
      },
      {
        kind: "read",
        id: "r3",
        title: "Handle rate limits + retries",
        body:
          "```\nfrom tenacity import retry, wait_exponential, stop_after_attempt, retry_if_exception_type\n\n@retry(\n    retry=retry_if_exception_type(httpx.HTTPStatusError),\n    wait=wait_exponential(multiplier=1, min=1, max=30),\n    stop=stop_after_attempt(6),\n)\ndef call_api():\n    r = httpx.post(URL, json=payload, timeout=30)\n    r.raise_for_status()\n    return r.json()\n```\n\n**Exponential backoff** on 429/5xx. Never blind-retry immediately — you'll make the problem worse.",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "Which is safer?",
        prompt: "Between these two, which handles a slow API more robustly?",
        options: [
          "httpx.get(url)",
          "httpx.get(url, timeout=30)",
          "requests.get(url) with default timeout",
          "urllib.request.urlopen(url)",
        ],
        correctIndex: 1,
        why: "Explicit timeouts prevent your process from hanging forever if the server stops responding. The other clients have implicit defaults that may not be what you expect.",
      },
    ],
  },

  {
    id: "py.ai.07.anthropic",
    track: "python",
    module: "ai",
    index: 27,
    title: "Anthropic SDK — talking to Claude",
    summary: "Messages API, streaming, system prompts. The idiomatic Anthropic Python patterns.",
    concepts: ["py.ai:anthropic:messages", "py.ai:anthropic:stream"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Setup",
        body:
          "```\npip install anthropic\nexport ANTHROPIC_API_KEY=sk-ant-...\n```\n\nGet a key at console.anthropic.com. Never hardcode it in source. Load from env or a secrets manager.",
      },
      {
        kind: "read",
        id: "r2",
        title: "One-shot message",
        body:
          "```\nfrom anthropic import Anthropic\n\nclient = Anthropic()\n\nresp = client.messages.create(\n    model='claude-opus-4-7',\n    max_tokens=1024,\n    system='You are a concise technical writer.',\n    messages=[\n        {'role': 'user', 'content': 'Explain vector databases in 3 sentences.'},\n    ],\n)\nprint(resp.content[0].text)\nprint(resp.usage)   # input_tokens, output_tokens\n```\n\nStructure to know:\n- `system` — the persistent instruction (persona, rules).\n- `messages` — the conversation, alternating `user` / `assistant`.\n- Response `content` is a **list of blocks** — usually `[TextBlock(text=...)]`, but tool-use responses add other block types.",
      },
      {
        kind: "read",
        id: "r3",
        title: "Streaming for interactive UIs",
        body:
          "```\nwith client.messages.stream(\n    model='claude-opus-4-7',\n    max_tokens=1024,\n    messages=[{'role': 'user', 'content': 'Write a haiku about databases.'}],\n) as stream:\n    for text in stream.text_stream:\n        print(text, end='', flush=True)\n    final = stream.get_final_message()\n    print()\n    print(final.usage)\n```\n\nStreaming lets you display tokens as they arrive — dramatically better perceived latency in a chat UI.",
      },
      {
        kind: "read",
        id: "r4",
        title: "Multi-turn conversation",
        body:
          "A conversation is just the growing `messages` list. Append user turns and the model's replies.\n\n```\nhistory = []\ndef ask(text):\n    history.append({'role': 'user', 'content': text})\n    r = client.messages.create(\n        model='claude-opus-4-7',\n        max_tokens=1024,\n        system='You are a helpful tutor.',\n        messages=history,\n    )\n    reply = r.content[0].text\n    history.append({'role': 'assistant', 'content': reply})\n    return reply\n\nprint(ask('What is a monad?'))\nprint(ask('Give a Python example.'))\n```\n\nWatch context length — every turn adds tokens. Truncate or summarize when the history gets long.",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "Where does the persona go?",
        prompt: "You want Claude to always answer as a stern proofreader. Where do you put that instruction?",
        options: [
          "In every user message",
          "In the `system` parameter",
          "As the first assistant message",
          "In `metadata`",
        ],
        correctIndex: 1,
        why: "The `system` parameter is designed for persistent instructions — persona, style, rules that apply to every turn.",
      },
    ],
  },

  {
    id: "py.ai.08.openai",
    track: "python",
    module: "ai",
    index: 28,
    title: "OpenAI SDK — chat completions & streaming",
    summary: "The same concepts, the OpenAI shape. Interoperable patterns worth knowing.",
    concepts: ["py.ai:openai:chat", "py.ai:openai:stream"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Setup + one-shot",
        body:
          "```\npip install openai\nexport OPENAI_API_KEY=sk-...\n```\n\n```\nfrom openai import OpenAI\nclient = OpenAI()\n\nresp = client.chat.completions.create(\n    model='gpt-4o',\n    messages=[\n        {'role': 'system', 'content': 'You are a concise assistant.'},\n        {'role': 'user',   'content': 'Explain gradient descent in 3 sentences.'},\n    ],\n    max_tokens=300,\n)\nprint(resp.choices[0].message.content)\nprint(resp.usage)\n```\n\nDifferences from Anthropic to remember:\n- `system` lives inside `messages` as `{'role': 'system', ...}`, not a top-level parameter.\n- Response uses `choices[0].message.content` (a string), not a list of content blocks.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Streaming",
        body:
          "```\nstream = client.chat.completions.create(\n    model='gpt-4o',\n    messages=[{'role': 'user', 'content': 'Write a haiku.'}],\n    stream=True,\n)\nfor chunk in stream:\n    delta = chunk.choices[0].delta.content\n    if delta:\n        print(delta, end='', flush=True)\nprint()\n```\n\nOpenAI streams **delta** chunks; concatenate their `content` fields as they arrive.",
      },
      {
        kind: "read",
        id: "r3",
        title: "Provider-agnostic wrapper",
        body:
          "In real apps you often want to swap providers or A/B test them. A tiny wrapper:\n\n```\ndef chat(provider, messages, system=None, model=None):\n    if provider == 'anthropic':\n        from anthropic import Anthropic\n        r = Anthropic().messages.create(\n            model=model or 'claude-opus-4-7',\n            max_tokens=1024,\n            system=system,\n            messages=messages,\n        )\n        return r.content[0].text\n    elif provider == 'openai':\n        from openai import OpenAI\n        msgs = ([{'role': 'system', 'content': system}] if system else []) + messages\n        r = OpenAI().chat.completions.create(\n            model=model or 'gpt-4o',\n            messages=msgs,\n            max_tokens=1024,\n        )\n        return r.choices[0].message.content\n```\n\nKeep the wrapper thin. Every abstraction leaks.",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "System prompt placement",
        prompt: "In OpenAI's chat completions, the system prompt is:",
        options: [
          "A top-level `system` parameter",
          "The first message with role='system'",
          "Only in the `metadata` field",
          "Sent as a header",
        ],
        correctIndex: 1,
        why: "OpenAI treats system as just another message. Anthropic treats it as a top-level field. Same idea, different shape.",
      },
    ],
  },

  {
    id: "py.ai.09.prompting",
    track: "python",
    module: "ai",
    index: 29,
    title: "Prompt engineering as a real skill",
    summary: "System prompts, few-shot examples, chain-of-thought. When each pays off.",
    concepts: ["py.ai:prompt:system", "py.ai:prompt:fewshot", "py.ai:prompt:cot"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "The five techniques that actually help",
        body:
          "1. **Be specific.** Instead of 'write a summary,' say 'in 3 bullet points, each under 15 words, focused on financial impact.'\n2. **Give a role/persona** in the system prompt. Focuses tone and vocabulary.\n3. **Show, don't tell** — few-shot examples usually beat instructions for output format.\n4. **Chain-of-thought** — for reasoning tasks, ask for the reasoning before the answer.\n5. **Structured output** — ask for JSON that matches a schema you'll validate.\n\nEverything else is either a variation of these or has weak empirical evidence.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Few-shot in practice",
        body:
          "```\nsystem = '''You classify support tickets. Output exactly one label from: BILLING, TECHNICAL, ACCOUNT.'''\n\nfewshot = [\n    {'role': 'user',      'content': 'My credit card was charged twice.'},\n    {'role': 'assistant', 'content': 'BILLING'},\n    {'role': 'user',      'content': 'Cannot log in after password reset.'},\n    {'role': 'assistant', 'content': 'ACCOUNT'},\n    {'role': 'user',      'content': 'App crashes on Android 13.'},\n    {'role': 'assistant', 'content': 'TECHNICAL'},\n]\n\nnew_ticket = 'Getting a 500 error when uploading a photo.'\nmsgs = fewshot + [{'role': 'user', 'content': new_ticket}]\n```\n\n**3–5 examples** is usually the sweet spot. More rarely helps; picking **diverse, edge-case** examples helps a lot.",
      },
      {
        kind: "read",
        id: "r3",
        title: "Chain-of-thought (for reasoning)",
        body:
          "```\nprompt = '''\nA store sold 245 apples on Monday, 180 on Tuesday, then 30% more on Wednesday than Tuesday. What was the total?\n\nThink step by step, then give the final number on the last line prefixed with 'Answer: '.\n'''\n```\n\nModern models often reason internally without explicit prompting — but for tricky math/logic, explicit CoT still lifts accuracy. Combine with **self-consistency**: run the same prompt several times, take the majority answer.",
      },
      {
        kind: "read",
        id: "r4",
        title: "Anti-patterns to avoid",
        body:
          "- **Vague adjectives** — 'high quality', 'professional', 'better' — the model has no ground truth for these. Prefer measurable criteria.\n- **Contradictory rules** — 'be concise but thorough' is a wash. Pick.\n- **Big pile of edge cases in the system prompt** — better handled by examples or by structured post-processing.\n- **Assuming the model saw context it didn't** — always include the source material in the prompt.",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "Best fix?",
        prompt:
          "Your prompt says 'output a JSON object with the user's info'. The model sometimes returns markdown-wrapped JSON, sometimes a schema-mismatched shape.",
        options: [
          "Ask 'please output valid JSON' more emphatically",
          "Show 2–3 examples of the exact input → JSON output, plus use structured-output mode",
          "Retry the same prompt 10 times",
          "Increase temperature",
        ],
        correctIndex: 1,
        why: "Examples + a schema-enforced output are far more reliable than pleading in prose.",
      },
      {
        kind: "explain",
        id: "x1",
        title: "Explain",
        prompt:
          "Give an example of a task where few-shot prompting would clearly beat a plain instruction, and one where it wouldn't help.",
        minWords: 40,
      },
    ],
  },

  {
    id: "py.ai.10.structured",
    track: "python",
    module: "ai",
    index: 30,
    title: "Structured outputs & pydantic",
    summary: "Force the model to return JSON that matches a schema you can trust.",
    concepts: ["py.ai:pydantic", "py.ai:structured"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Pydantic 101",
        body:
          "```\nfrom pydantic import BaseModel, Field\n\nclass Person(BaseModel):\n    name: str\n    age: int = Field(ge=0, le=150)\n    email: str | None = None\n\np = Person.model_validate({'name': 'Ada', 'age': 36})\nprint(p.model_dump())     # dict\nprint(p.model_dump_json())\n```\n\nPydantic gives you **typed validation** for free — parse dicts/JSON into typed objects, raise on schema violations, generate JSON Schema.",
      },
      {
        kind: "read",
        id: "r2",
        title: "OpenAI structured output",
        body:
          "```\nfrom openai import OpenAI\nfrom pydantic import BaseModel\n\nclass Extract(BaseModel):\n    name: str\n    org:  str | None\n    role: str | None\n\nclient = OpenAI()\nresp = client.beta.chat.completions.parse(\n    model='gpt-4o-2024-08-06',\n    messages=[\n        {'role': 'system', 'content': 'Extract entities.'},\n        {'role': 'user',   'content': 'Ada Lovelace worked with Charles Babbage.'},\n    ],\n    response_format=Extract,\n)\nprint(resp.choices[0].message.parsed)   # Extract instance\n```\n\n`beta.chat.completions.parse` uses **strict schema enforcement** on the server side. The output is guaranteed to fit your model.",
      },
      {
        kind: "read",
        id: "r3",
        title: "Anthropic tool-use for JSON",
        body:
          "Claude doesn't have a `response_format` field, but you can get the same behavior with a **single tool** whose input schema is what you want returned:\n\n```\nfrom anthropic import Anthropic\nclient = Anthropic()\n\ntools = [{\n    'name': 'submit_person',\n    'description': 'Submit the extracted person record',\n    'input_schema': {\n        'type': 'object',\n        'properties': {\n            'name': {'type': 'string'},\n            'org':  {'type': 'string'},\n            'role': {'type': 'string'},\n        },\n        'required': ['name'],\n    },\n}]\n\nresp = client.messages.create(\n    model='claude-opus-4-7', max_tokens=1024,\n    tool_choice={'type': 'tool', 'name': 'submit_person'},\n    tools=tools,\n    messages=[{'role': 'user', 'content': 'Ada Lovelace at Analytical Engine, mathematician.'}],\n)\n# The tool_use block's input is the structured JSON\ntool_use = next(b for b in resp.content if b.type == 'tool_use')\ndata = tool_use.input\nprint(data)\n```\n\nForcing tool choice guarantees the model uses your schema.",
      },
      {
        kind: "read",
        id: "r4",
        title: "Validate → retry pattern",
        body:
          "Even with structured outputs, validate at the boundary:\n\n```\nfor attempt in range(3):\n    try:\n        data = call_model(prompt)\n        return Extract.model_validate(data)\n    except pydantic.ValidationError as e:\n        prompt += f'\\nYour last output failed validation: {e}. Try again.'\nraise RuntimeError('gave up')\n```\n\nTelling the model **specifically** what was wrong makes retries dramatically more likely to succeed.",
      },
    ],
  },

  {
    id: "py.ai.11.tools",
    track: "python",
    module: "ai",
    index: 31,
    title: "Tool use / function calling",
    summary: "Let the model reach into your code — fetch data, run functions, take actions.",
    concepts: ["py.ai:tools", "py.ai:tool-loop"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "What tool use really is",
        body:
          "You give the model a list of function definitions. On each turn it can either **respond in text** or **request a tool call** — output a structured payload with a tool name and arguments. Your code runs the tool, feeds the result back, and the model continues.\n\nThis is the substrate under **every agent, every code assistant, every browsing model**. Learn it well.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Anthropic — defining tools",
        body:
          "```\ntools = [\n  {\n    'name': 'get_weather',\n    'description': 'Get current weather for a city.',\n    'input_schema': {\n      'type': 'object',\n      'properties': {\n        'city':  {'type': 'string'},\n        'units': {'type': 'string', 'enum': ['celsius', 'fahrenheit']},\n      },\n      'required': ['city'],\n    },\n  }\n]\n```\n\nGood tool definitions have:\n- **Clear name** — verb + noun (`get_weather`, `search_docs`).\n- **Concrete description** — what it does, when to use it, when NOT to use it.\n- **Tight schema** — required fields, enums for closed sets. The tighter the schema, the fewer bugs.",
      },
      {
        kind: "read",
        id: "r3",
        title: "The tool loop",
        body:
          "```\ndef run_tool(name, args):\n    if name == 'get_weather':\n        return {'temp': 72, 'condition': 'sunny'}\n    raise ValueError(f'unknown tool: {name}')\n\nmessages = [{'role': 'user', 'content': 'Is it warm in Paris today?'}]\n\nwhile True:\n    resp = client.messages.create(\n        model='claude-opus-4-7',\n        max_tokens=1024,\n        tools=tools,\n        messages=messages,\n    )\n    messages.append({'role': 'assistant', 'content': resp.content})\n\n    if resp.stop_reason != 'tool_use':\n        # Model produced a final answer\n        final_text = ''.join(b.text for b in resp.content if b.type == 'text')\n        print(final_text)\n        break\n\n    # Handle every tool_use block in this turn\n    tool_results = []\n    for block in resp.content:\n        if block.type == 'tool_use':\n            result = run_tool(block.name, block.input)\n            tool_results.append({\n                'type': 'tool_result',\n                'tool_use_id': block.id,\n                'content': str(result),\n            })\n    messages.append({'role': 'user', 'content': tool_results})\n```\n\nThat's the whole agent loop. Everything else is more tools + guardrails.",
      },
      {
        kind: "read",
        id: "r4",
        title: "OpenAI function calling — same idea",
        body:
          "```\ntools = [{\n    'type': 'function',\n    'function': {\n        'name': 'get_weather',\n        'description': '...',\n        'parameters': {  # same JSON Schema\n            'type': 'object',\n            'properties': {'city': {'type': 'string'}},\n            'required': ['city'],\n        },\n    },\n}]\n\nresp = client.chat.completions.create(\n    model='gpt-4o', messages=messages, tools=tools,\n)\ntool_calls = resp.choices[0].message.tool_calls\n```\n\nMental model: identical. Handle the calls, feed results back with `role='tool'` messages.",
      },
      {
        kind: "explain",
        id: "x1",
        title: "Explain",
        prompt:
          "You give the model a `run_sql` tool. What are 3 concrete things you'd do to keep it from doing something destructive?",
        minWords: 30,
      },
    ],
  },

  {
    id: "py.ai.12.embeddings",
    track: "python",
    module: "ai",
    index: 32,
    title: "Embeddings & semantic search",
    summary: "Turn text into vectors so 'meaning' becomes math you can index.",
    concepts: ["py.ai:embeddings", "py.ai:cosine"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "What an embedding is",
        body:
          "An **embedding** is a fixed-length vector (e.g. 1536 floats) that represents the meaning of a piece of text. Semantically similar text → nearby vectors. You measure 'nearby' with **cosine similarity**.\n\nEmbeddings unlock:\n- **Semantic search** — find docs about 'dog food' when the query is 'kibble'.\n- **Clustering** — group similar items with no labels.\n- **Recommendations** — 'more like this'.\n- **RAG** — retrieve relevant context to feed an LLM.",
      },
      {
        kind: "read",
        id: "r2",
        title: "OpenAI embeddings",
        body:
          "```\nfrom openai import OpenAI\nimport numpy as np\n\nclient = OpenAI()\n\ndef embed(texts):\n    r = client.embeddings.create(\n        model='text-embedding-3-small', input=texts,\n    )\n    return np.array([d.embedding for d in r.data])\n\ndocs = ['Puppies are baby dogs.', 'Kittens are baby cats.', 'CSS styles web pages.']\nD = embed(docs)                # shape (3, 1536)\nq = embed(['young dogs'])[0]\n\n# Cosine similarity — vectors are already unit-normalized for OpenAI\nscores = D @ q\nprint(scores)                  # doc 0 wins\n```",
      },
      {
        kind: "read",
        id: "r3",
        title: "Cosine similarity, manually",
        body:
          "For embeddings that aren't pre-normalized, do this:\n\n```\ndef cosine(a, b):\n    return (a @ b) / (np.linalg.norm(a) * np.linalg.norm(b))\n```\n\nRanges from -1 to 1. Practical similarity thresholds sit in the 0.3–0.7 range depending on the model and domain — never trust a magic number, always eyeball examples.",
      },
      {
        kind: "read",
        id: "r4",
        title: "Local embeddings — no API needed",
        body:
          "```\npip install sentence-transformers\n```\n\n```\nfrom sentence_transformers import SentenceTransformer\nmodel = SentenceTransformer('all-MiniLM-L6-v2')   # ~90 MB, runs on CPU\nV = model.encode(docs, normalize_embeddings=True)\n```\n\nGood defaults: `all-MiniLM-L6-v2` (fast, 384-d), `BAAI/bge-large-en-v1.5` (higher quality, 1024-d). No API cost, no per-request latency. Trade-off: you host the model.",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "Same or different?",
        prompt: "Which pair should give the highest cosine similarity?",
        options: [
          "'apple pie recipe' and 'how to bake apple pie'",
          "'apple pie recipe' and 'apple stock price'",
          "'apple pie recipe' and 'Linux kernel commit log'",
          "'apple pie recipe' and 'the'",
        ],
        correctIndex: 0,
        why: "Semantically nearly identical. The others share a word or nothing at all.",
      },
    ],
  },

  {
    id: "py.ai.13.rag",
    track: "python",
    module: "ai",
    index: 33,
    title: "RAG — retrieval-augmented generation",
    summary: "Give the model your knowledge base. Ground answers in sources.",
    concepts: ["py.ai:rag", "py.ai:chunking", "py.ai:vector-db"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "The RAG pipeline",
        body:
          "1. **Chunk** your documents into ~200–500-token pieces.\n2. **Embed** each chunk once, store vectors in a vector DB.\n3. At query time: **embed the query**, find top-k most similar chunks.\n4. **Stuff** those chunks into the prompt as context.\n5. **Ask** the model to answer using only that context, with citations.\n\nRAG is the answer to 'my model doesn't know about our docs / doesn't have current info / hallucinates when unsure.'",
      },
      {
        kind: "read",
        id: "r2",
        title: "Chunking that actually works",
        body:
          "```\ndef chunk_text(text, size=500, overlap=50):\n    words = text.split()\n    for i in range(0, len(words), size - overlap):\n        yield ' '.join(words[i:i + size])\n```\n\nBetter still: **semantic chunking** — split on headings, paragraphs, or sentence boundaries. Preserves meaning across chunk boundaries.\n\nRule of thumb: **overlap = ~10% of chunk size**. Store the source path + heading with each chunk — you'll want it for citations.",
      },
      {
        kind: "read",
        id: "r3",
        title: "Vector DB — the storage layer",
        body:
          "Options in rough order of complexity:\n- **In-memory / numpy** — fine for < 100k chunks.\n- **chromadb** — file-based, no setup, great for prototypes.\n- **pgvector** — Postgres extension, prod-ready, familiar SQL.\n- **Pinecone, Weaviate, Qdrant, Milvus** — managed / self-host, HNSW indexes, filtering.\n\n```\nimport chromadb\nclient = chromadb.PersistentClient(path='.chroma')\ncoll = client.get_or_create_collection('docs')\ncoll.add(\n    ids=[str(i) for i in range(len(chunks))],\n    documents=chunks,\n    metadatas=[{'source': p} for p in paths],\n    embeddings=embeddings.tolist(),\n)\nhits = coll.query(query_embeddings=[q.tolist()], n_results=5)\n```",
      },
      {
        kind: "read",
        id: "r4",
        title: "Assembling the prompt",
        body:
          "```\ncontext = '\\n\\n---\\n\\n'.join(\n    f'[Source: {m[\"source\"]}]\\n{d}'\n    for d, m in zip(hits['documents'][0], hits['metadatas'][0])\n)\nsystem = '''You answer questions using ONLY the provided sources.\nIf the sources don't contain the answer, say 'I don't know from the provided sources.'\nCite the source path in square brackets for every claim.'''\nresp = client.messages.create(\n    model='claude-opus-4-7', max_tokens=1024,\n    system=system,\n    messages=[{'role': 'user', 'content': f'Sources:\\n{context}\\n\\nQuestion: {question}'}],\n)\n```\n\nThe two hard problems in RAG:\n1. **Retrieval quality** — did the right chunks come back?\n2. **Grounding** — did the model actually use them, or make something up?\n\nBoth need **evals** to measure.",
      },
      {
        kind: "explain",
        id: "x1",
        title: "Explain",
        prompt:
          "Your RAG system says 'I don't know from the sources' even for questions where you know the answer is in the docs. What are the top 3 things to check?",
        minWords: 40,
      },
    ],
  },

  {
    id: "py.ai.14.agents",
    track: "python",
    module: "ai",
    index: 34,
    title: "Agents — LLMs that take actions in a loop",
    summary: "The tool-use loop, extended. When to reach for an agent — and when not to.",
    concepts: ["py.ai:agent-loop", "py.ai:planning"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "'Agent' is a loop, not a library",
        body:
          "An **agent** is a program that runs the tool-use loop repeatedly until a goal is reached (or a budget is spent). Same loop as lesson 11, just with:\n- More tools (search, run code, read/write files, call APIs)\n- A goal in the initial user message\n- Explicit stop conditions (max steps, budget, success criterion)\n\nModern coding assistants (Claude Code, Cursor, Aider) are agents with `read_file`, `edit_file`, `run_shell`, `search_code` tools.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Agent skeleton",
        body:
          "```\ndef run_agent(goal, tools, run_tool, max_steps=20, model='claude-opus-4-7'):\n    messages = [{'role': 'user', 'content': goal}]\n    for step in range(max_steps):\n        resp = client.messages.create(\n            model=model, max_tokens=4096, tools=tools, messages=messages,\n        )\n        messages.append({'role': 'assistant', 'content': resp.content})\n        if resp.stop_reason != 'tool_use':\n            return ''.join(b.text for b in resp.content if b.type == 'text')\n        results = []\n        for b in resp.content:\n            if b.type == 'tool_use':\n                try:\n                    out = run_tool(b.name, b.input)\n                    results.append({'type': 'tool_result', 'tool_use_id': b.id,\n                                    'content': str(out)})\n                except Exception as e:\n                    results.append({'type': 'tool_result', 'tool_use_id': b.id,\n                                    'is_error': True, 'content': str(e)})\n        messages.append({'role': 'user', 'content': results})\n    raise RuntimeError('hit step budget')\n```",
      },
      {
        kind: "read",
        id: "r3",
        title: "When NOT to build an agent",
        body:
          "Agents are the right hammer when:\n- The task requires multiple steps whose exact sequence depends on prior results.\n- Available tools + a smart controller genuinely beat a hand-written script.\n\nAgents are the **wrong** answer when:\n- A single API call would work — don't wrap it in a loop for style points.\n- Latency matters — 5 model calls take 5x longer than one.\n- Cost matters — same math.\n- The task is deterministic — write a script, not an agent.\n\nRule: **start with the simplest thing**. Add an agent when a single call can't get you there.",
      },
      {
        kind: "read",
        id: "r4",
        title: "Guardrails you always want",
        body:
          "- **Step budget** — hard cap on iterations. Agents love to spin.\n- **Cost budget** — track tokens, halt when you cross a threshold.\n- **Tool timeouts** — every tool wrapped with a max time.\n- **Confirm-before-destructive** — file deletes, DB writes, external sends need explicit user OK.\n- **Structured error results** — return errors AS tool results so the model can recover, don't crash the loop.\n- **Logging** — every step, tool call, and result. You'll need it when things go sideways.",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "Pick the right pattern",
        prompt: "You need to summarize 100 PDFs. Each is independent.",
        options: [
          "One agent with a 'summarize_pdf' tool that loops",
          "100 direct model calls, batched with asyncio.gather",
          "One giant prompt with all PDFs concatenated",
          "A fine-tuned model",
        ],
        correctIndex: 1,
        why: "Independent tasks want parallel direct calls. An agent adds overhead with no benefit here.",
      },
    ],
  },

  {
    id: "py.ai.15.evals",
    track: "python",
    module: "ai",
    index: 35,
    title: "Evals — measuring model quality",
    summary: "You can't improve what you don't measure. Build the eval before the app.",
    concepts: ["py.ai:evals", "py.ai:llm-as-judge"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "The single most-skipped step",
        body:
          "Most LLM projects fail because there's no way to answer 'did my last prompt change make it better?' Fix that first.\n\nAn eval is:\n1. A **dataset** — 50–500 realistic inputs, ideally with expected outputs or grading criteria.\n2. A **scorer** — code that produces a number (or pass/fail) per input.\n3. A **runner** — invokes your app on each input and aggregates scores.\n4. A **regression check** — did your latest change move the number up or down?",
      },
      {
        kind: "read",
        id: "r2",
        title: "Deterministic scorers first",
        body:
          "For tasks with a right answer: string match, JSON schema match, numeric tolerance.\n\n```\ndef score_extraction(pred: dict, gold: dict) -> float:\n    correct = sum(1 for k in gold if pred.get(k) == gold[k])\n    return correct / len(gold)\n```\n\nStart simple. A crude deterministic scorer that runs in 1 second beats a perfect scorer you never build.",
      },
      {
        kind: "read",
        id: "r3",
        title: "LLM-as-judge for open-ended tasks",
        body:
          "When 'correct' has many valid forms (summaries, code explanations, chat replies), grade with another LLM:\n\n```\nJUDGE_PROMPT = '''You are grading an assistant's response.\nRate 1-5 on: (a) accuracy, (b) relevance, (c) clarity.\nBe strict. Output JSON: {\"accuracy\": N, \"relevance\": N, \"clarity\": N, \"why\": \"...\"}'''\n\ndef judge(question, response):\n    r = client.messages.create(\n        model='claude-opus-4-7', max_tokens=500, system=JUDGE_PROMPT,\n        messages=[{'role': 'user',\n                   'content': f'Q: {question}\\nA: {response}'}],\n    )\n    return json.loads(r.content[0].text)\n```\n\nUse a **different model** as judge when possible (or at least a different prompt). Sanity-check the judge against human ratings on a subset.",
      },
      {
        kind: "read",
        id: "r4",
        title: "Eval-driven prompt iteration",
        body:
          "Workflow:\n1. Run eval on your current prompt. Note the score.\n2. Look at the **worst 10 failures**. What pattern do they share?\n3. Change ONE thing (a rule in the system prompt, an example, a schema tightening).\n4. Re-run eval. Better? Keep it. Worse? Revert.\n5. Repeat.\n\nAsking 'is this prompt good?' is meaningless. 'Does this prompt beat the previous version on my eval?' is answerable.",
      },
      {
        kind: "explain",
        id: "x1",
        title: "Explain",
        prompt:
          "You built an LLM-as-judge that rates support-ticket responses 1–5. The average is stubbornly 3.8 regardless of prompt changes. What might be wrong with the judge, and how would you check?",
        minWords: 40,
      },
    ],
  },

  {
    id: "py.ai.16.async-scale",
    track: "python",
    module: "ai",
    index: 36,
    title: "Async batching + rate limits at scale",
    summary: "Process thousands of LLM calls without melting or getting throttled.",
    concepts: ["py.ai:async-batch", "py.ai:rate-limit"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Bounded parallelism",
        body:
          "Do NOT `asyncio.gather` 10,000 coroutines at once — you'll hit rate limits and open file descriptors will explode.\n\n```\nimport asyncio\n\nasync def run_bounded(items, worker, concurrency=10):\n    sem = asyncio.Semaphore(concurrency)\n    async def wrapped(x):\n        async with sem:\n            return await worker(x)\n    return await asyncio.gather(*(wrapped(x) for x in items))\n```\n\nMost API providers publish RPM (requests/min) and TPM (tokens/min) limits. Pick concurrency so you sit safely under both.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Retry with backoff, on the right errors",
        body:
          "```\nfrom tenacity import retry, wait_exponential_jitter, stop_after_attempt, retry_if_exception_type\nfrom anthropic import APIStatusError, RateLimitError, APIConnectionError\n\n@retry(\n    retry=retry_if_exception_type((RateLimitError, APIConnectionError)),\n    wait=wait_exponential_jitter(initial=1, max=60),\n    stop=stop_after_attempt(6),\n)\nasync def call(msg):\n    return await client.messages.create(model=..., max_tokens=1024,\n                                        messages=[{'role':'user','content':msg}])\n```\n\n**Jitter** matters — without it, retries synchronize and slam the provider all at once.",
      },
      {
        kind: "read",
        id: "r3",
        title: "Persist as you go",
        body:
          "For a 10,000-item batch: assume the process WILL crash. Write results as they complete so a rerun resumes.\n\n```\nimport json, aiofiles\nasync def worker(item, out_path):\n    result = await call(item['text'])\n    async with aiofiles.open(out_path, 'a') as f:\n        await f.write(json.dumps({'id': item['id'], 'result': result}) + '\\n')\n```\n\nJSONL is your friend: append-only, resumable, tail-able.",
      },
      {
        kind: "read",
        id: "r4",
        title: "Consider batch APIs",
        body:
          "Both Anthropic and OpenAI offer a **batch API** — submit thousands of requests, get results within 24h, pay ~50% less. Ideal for offline evals, large-scale extractions, non-interactive workloads.\n\nWhen latency doesn't matter, use it.",
      },
    ],
  },

  {
    id: "py.ai.17.caching-cost",
    track: "python",
    module: "ai",
    index: 37,
    title: "Prompt caching + cost / latency optimization",
    summary: "The unglamorous engineering that turns a prototype into a product.",
    concepts: ["py.ai:prompt-cache", "py.ai:cost"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Prompt caching — the biggest lever",
        body:
          "If you send the same long system prompt or documents on every call, cache them. Anthropic and OpenAI both support it. Cached tokens are **90% cheaper** and lower latency.\n\n```\nresp = client.messages.create(\n    model='claude-opus-4-7', max_tokens=1024,\n    system=[{\n        'type': 'text',\n        'text': LONG_SYSTEM_PROMPT_OR_DOCS,\n        'cache_control': {'type': 'ephemeral'},\n    }],\n    messages=[{'role': 'user', 'content': user_msg}],\n)\n```\n\nRule of thumb: cache anything > 1024 tokens that repeats across calls.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Right model for the job",
        body:
          "- Cheapest model that meets your quality bar wins.\n- Try the small/fast model first (Haiku, gpt-4o-mini). Measure via your eval.\n- Reserve the big model (Opus, gpt-4o / o1) for the hard subset.\n- **Routing pattern:** small model tries first; big model handles the escalations.",
      },
      {
        kind: "read",
        id: "r3",
        title: "Trim your context",
        body:
          "Every unnecessary token costs money and adds latency:\n\n- Truncate long documents to the top-k relevant chunks (RAG).\n- Summarize old conversation turns instead of shipping the full history.\n- Prefer JSON over prose in tool results — same info, half the tokens.\n- Watch out for markdown tables and code blocks — they eat tokens fast.",
      },
      {
        kind: "read",
        id: "r4",
        title: "Track usage as data",
        body:
          "```\ndef log_call(name, resp):\n    usage = resp.usage\n    print({\n        'endpoint': name,\n        'input_tokens':  usage.input_tokens,\n        'output_tokens': usage.output_tokens,\n        'cache_read':    getattr(usage, 'cache_read_input_tokens', 0),\n        'cache_write':   getattr(usage, 'cache_creation_input_tokens', 0),\n    })\n```\n\nDump these to a log/DB. Aggregating them tells you exactly where cost lives, which is exactly where to optimize.",
      },
    ],
  },

  {
    id: "py.ai.18.finetuning",
    track: "python",
    module: "ai",
    index: 38,
    title: "Fine-tuning — when it's worth it (and when it isn't)",
    summary: "The overhyped last resort. Prompting + RAG solves 90% of cases.",
    concepts: ["py.ai:finetune", "py.ai:sft-vs-rag"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "First: don't fine-tune",
        body:
          "In order of usual effectiveness:\n1. Better prompt (persona, examples, structured output).\n2. Better retrieval (RAG).\n3. Tool use (let the model call your ground truth).\n4. THEN consider fine-tuning.\n\nFine-tuning is right when:\n- You need a specific **output style or format** the base model doesn't reliably produce.\n- You have **thousands of examples** of correct behavior.\n- Latency matters — a smaller fine-tuned model can beat a bigger base model on your task.\n\nFine-tuning is wrong when:\n- You want to teach the model new **facts** (use RAG).\n- You have < 100 examples (won't beat few-shot).\n- You expect it to fix hallucinations broadly (it won't).",
      },
      {
        kind: "read",
        id: "r2",
        title: "Preparing data",
        body:
          "Format: JSONL, one example per line. Each example is a full conversation.\n\n```\n{\"messages\": [\n  {\"role\": \"system\",    \"content\": \"You are a support triage bot.\"},\n  {\"role\": \"user\",      \"content\": \"My card was charged twice.\"},\n  {\"role\": \"assistant\", \"content\": \"{\\\"label\\\":\\\"BILLING\\\",\\\"priority\\\":\\\"high\\\"}\"}\n]}\n```\n\n- 100 examples = maybe useful. 1,000+ = good. 10,000+ = great.\n- Split off a real **held-out set** for eval — same distribution as production.\n- Balance categories. Fine-tuning inherits your data's biases.",
      },
      {
        kind: "read",
        id: "r3",
        title: "OpenAI fine-tuning API",
        body:
          "```\nfrom openai import OpenAI\nclient = OpenAI()\n\nfile = client.files.create(file=open('train.jsonl','rb'), purpose='fine-tune')\njob = client.fine_tuning.jobs.create(training_file=file.id, model='gpt-4o-mini-2024-07-18')\n# Poll job.status until 'succeeded'; then use job.fine_tuned_model as the model name in chat.completions.\n```\n\nAnthropic offers a fine-tuning program too — currently more selective; check the console.\n\nIndependent path: fine-tune open weights (Llama, Mistral, Qwen) with libraries like TRL, axolotl, or unsloth. Cheaper long-term if you have the ops appetite.",
      },
      {
        kind: "mcq",
        id: "m1",
        title: "Choose the tool",
        prompt: "Your model needs to answer questions about your product docs, which change weekly.",
        options: [
          "Fine-tune weekly with the latest docs",
          "Put the docs in a vector DB and use RAG",
          "Include all docs in every system prompt",
          "Train a model from scratch",
        ],
        correctIndex: 1,
        why: "Facts that change belong in retrieval, not weights. Fine-tuning gets stale immediately and burns money.",
      },
    ],
  },

  {
    id: "py.ai.19.observability",
    track: "python",
    module: "ai",
    index: 39,
    title: "Observability — logging, tracing, debugging LLM apps",
    summary: "Traditional monitoring assumes determinism. LLM apps aren't deterministic. Different tools apply.",
    concepts: ["py.ai:obs", "py.ai:traces"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "What you actually need to log",
        body:
          "Per call, at minimum:\n- Timestamp, model, prompt (or a hash of it), full response text.\n- Input tokens, output tokens, cached tokens, latency.\n- User/session ID.\n- Cost estimate.\n- Any tool calls and their results.\n\nStore in a database or JSONL you can query. This is your **only** way to debug production issues after the fact.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Traces beat logs for agents",
        body:
          "A single agent run makes many nested calls. Flat logs turn into soup. Use **tracing** — each run gets a trace ID; each step (model call, tool call) is a span with parent/child links.\n\nTools worth knowing:\n- **Langfuse** — open source, self-hostable\n- **Helicone** — proxy in front of your API calls\n- **LangSmith** — LangChain's hosted tool\n- **OpenTelemetry** — vendor-neutral traces if you already have infra for it\n\nOr roll your own if the app is small — just log parent_span_id per call.",
      },
      {
        kind: "read",
        id: "r3",
        title: "The three question you'll ask most",
        body:
          "When something breaks in production, you'll want to answer:\n\n1. **What exactly did the model see?** Full assembled prompt including retrieved chunks.\n2. **What did it return?** Full response text or tool calls.\n3. **Why?** Reproduce with the exact inputs against the same model version.\n\nIf your logs can't answer all three in under a minute, improve them.",
      },
      {
        kind: "read",
        id: "r4",
        title: "Alerts that actually help",
        body:
          "- Cost/day rising unexpectedly → investigate a runaway agent or new heavy user.\n- Eval score dropping on production traffic → something changed (data, prompt, or model version).\n- Rate-limit errors > threshold → hitting scale, need concurrency changes.\n- Latency P99 spike → cache miss, model slowdown, or new heavy prompt.\n\nAvoid: alerting on error rate alone — LLM apps have inherent variability. Alert on **sustained** deviations.",
      },
      {
        kind: "explain",
        id: "x1",
        title: "Explain",
        prompt:
          "You ship a change to the system prompt. The next day, users complain the assistant is 'less helpful.' What do you look at, in what order, to figure out if the change caused it?",
        minWords: 40,
      },
    ],
  },

  {
    id: "py.ai.20.putting-together",
    track: "python",
    module: "ai",
    index: 40,
    title: "Putting it all together — a production checklist",
    summary: "The engineering habits that separate a demo from a shipped LLM product.",
    concepts: ["py.ai:prod-checklist"],
    steps: [
      {
        kind: "read",
        id: "r1",
        title: "Before you write a prompt",
        body:
          "- **Write the eval first.** 20–50 realistic inputs with either expected outputs or clear grading criteria.\n- **Pick a metric.** Accuracy, F1, judge score, cost/task — one number to move.\n- **Baseline it.** What does a naive prompt score? What does 'answer the constant \"I don't know\"' score? Know your floor.",
      },
      {
        kind: "read",
        id: "r2",
        title: "Building the app",
        body:
          "- **Iterate on prompts against the eval, not vibes.**\n- **Log every call** in a way you can replay later.\n- **Validate every model output** at the boundary — schema, allowed values, safety filters.\n- **Every tool has a timeout, a budget, and a way to fail structured.**\n- **Rate-limit + retry with jitter, batch when possible.**\n- **Cache aggressively** — prompts, embeddings, retrieved chunks.",
      },
      {
        kind: "read",
        id: "r3",
        title: "Before you ship",
        body:
          "- Red-team the prompt — try adversarial inputs, jailbreaks, edge cases.\n- Test the failure mode: what does the app do when the API is down / slow / rate-limited?\n- Cost model: what's the per-user cost at your target scale? Does the math work?\n- Set up dashboards for cost, latency, error rate, eval score on prod traffic.\n- Wire up an oncall path for when the alerts fire.",
      },
      {
        kind: "read",
        id: "r4",
        title: "After you ship",
        body:
          "- **Look at real user interactions** daily for the first weeks. Real users find edge cases you didn't imagine.\n- **Grow your eval set** with the failures you see in production.\n- **A/B test** prompt changes on live traffic — the offline eval is a predictor, not the truth.\n- **Track quality drift** — models get updated, data distributions shift.\n- **Keep the loop tight** — small, measured changes beat big rewrites.",
      },
      {
        kind: "explain",
        id: "x1",
        title: "Your project",
        prompt:
          "Pick a real problem you'd use an LLM for. In 5+ sentences: what's the input? The output? What's your eval? What's your first end-to-end version look like?",
        minWords: 50,
      },
    ],
  },
];
