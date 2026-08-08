"use client";
import { useEffect, useState } from "react";
import { loadSettings, saveSettings } from "@/lib/tutor/settings";
import { useTutor } from "@/lib/tutor/context";
import { MODEL_OPTIONS, DEFAULT_MODELS, type Provider } from "@/lib/tutor/types";

export function TutorSettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { memory, setMemory } = useTutor();
  const [provider, setProvider] = useState<Provider>("anthropic");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(DEFAULT_MODELS.anthropic);
  const [showKey, setShowKey] = useState(false);
  const [memoryText, setMemoryText] = useState("");
  const [tab, setTab] = useState<"connection" | "memory">("connection");

  useEffect(() => {
    if (!open) return;
    const s = loadSettings();
    setProvider(s.provider);
    setApiKey(s.apiKey);
    setModel(s.model);
    setMemoryText(memory);
    setTab("connection");
  }, [open, memory]);

  if (!open) return null;

  const save = () => {
    saveSettings({ provider, apiKey: apiKey.trim(), model });
    setMemory(memoryText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-ink-700 bg-ink-900 p-5 shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-ink-100">Tutor settings</h2>

        <div className="mt-3 flex gap-1 border-b border-ink-800">
          <button
            onClick={() => setTab("connection")}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition ${
              tab === "connection" ? "border-ink-100 text-ink-100" : "border-transparent text-ink-400 hover:text-ink-200"
            }`}
          >
            Connection
          </button>
          <button
            onClick={() => setTab("memory")}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition ${
              tab === "memory" ? "border-ink-100 text-ink-100" : "border-transparent text-ink-400 hover:text-ink-200"
            }`}
          >
            Memory
          </button>
        </div>

        {tab === "connection" ? (
          <>
            <p className="mt-3 text-xs text-ink-400">
              Your API key is stored only in this browser (localStorage) and sent directly to the
              provider you pick — never through any server of ours.
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-ink-400 mb-1.5">Provider</label>
                <div className="flex gap-2">
                  {(["anthropic", "openai"] as Provider[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setProvider(p);
                        setModel(DEFAULT_MODELS[p]);
                      }}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition ${
                        provider === p
                          ? "border-ink-400 bg-ink-800 text-ink-100"
                          : "border-ink-700 text-ink-300 hover:bg-ink-800"
                      }`}
                    >
                      {p === "anthropic" ? "Anthropic (Claude)" : "OpenAI (GPT)"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-ink-400 mb-1.5">Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full rounded-lg bg-ink-950 border border-ink-700 px-3 py-2 text-sm text-ink-100 focus:border-ink-500 focus:outline-none"
                >
                  {MODEL_OPTIONS[provider].map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-ink-400 mb-1.5">
                  API key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={provider === "anthropic" ? "sk-ant-..." : "sk-..."}
                    className="w-full rounded-lg bg-ink-950 border border-ink-700 px-3 py-2 pr-16 text-sm text-ink-100 mono focus:border-ink-500 focus:outline-none"
                  />
                  <button
                    onClick={() => setShowKey((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-ink-400 hover:text-ink-100"
                  >
                    {showKey ? "hide" : "show"}
                  </button>
                </div>
                <p className="mt-1.5 text-[11px] text-ink-500">
                  Get a key at{" "}
                  {provider === "anthropic" ? (
                    <span className="text-ink-300">console.anthropic.com</span>
                  ) : (
                    <span className="text-ink-300">platform.openai.com/api-keys</span>
                  )}
                  .
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="mt-3 text-xs text-ink-400">
              Notes the tutor keeps about you across every session — included in every conversation,
              even after you clear the chat. Edit freely, or use "📌 remember this" on any tutor
              reply to save it here automatically.
            </p>
            <textarea
              value={memoryText}
              onChange={(e) => setMemoryText(e.target.value)}
              rows={8}
              placeholder="e.g. Already solid on functions and loops. Struggles with closures — go slow there. Prefers direct answers over hints."
              className="mt-3 w-full rounded-lg bg-ink-950 border border-ink-700 px-3 py-2 text-sm text-ink-100 focus:border-ink-500 focus:outline-none resize-y"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] text-ink-500">{memoryText.length} / 4000 chars</span>
              <button
                onClick={() => setMemoryText("")}
                className="text-[11px] text-bad hover:underline"
              >
                Clear memory
              </button>
            </div>
          </>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-ink-300 hover:text-ink-100 hover:bg-ink-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-ink-100 text-ink-950 hover:bg-white transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
