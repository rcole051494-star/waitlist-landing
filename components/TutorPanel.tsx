"use client";
import { useEffect, useRef, useState } from "react";
import { useTutor } from "@/lib/tutor/context";
import { hasApiKey } from "@/lib/tutor/settings";
import { TutorSettingsModal } from "./TutorSettingsModal";
import {
  createRecognizer,
  isSTTSupported,
  isTTSSupported,
  speak,
  stopSpeaking,
  type Recognizer,
} from "@/lib/tutor/voice";
import { loadVoiceSettings, saveVoiceSettings } from "@/lib/tutor/voiceSettings";

const QUICK_ACTIONS = [
  { label: "What's wrong with my code?", prompt: "Look at my current code and the last run's output/error. What's wrong, and why?" },
  { label: "Explain this step", prompt: "Explain what this step is asking me to do and the key concept behind it, in simple terms." },
  { label: "Give me a hint", prompt: "Don't give me the full answer. Give me one small hint to nudge me toward the fix myself." },
  { label: "Why does this work?", prompt: "Explain why the reference/example code for this step works, line by line if useful." },
];

export function TutorPanel() {
  const { open, setOpen, messages, streaming, send, quickAsk, stop, clearChat, error, ctx, rememberMessage, memory } =
    useTutor();
  const [input, setInput] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [keyPresent, setKeyPresent] = useState(true);
  const [rememberedId, setRememberedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Voice
  const [sttSupported, setSttSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const recRef = useRef<Recognizer | null>(null);
  const wasStreaming = useRef(false);

  useEffect(() => {
    setKeyPresent(hasApiKey());
  }, [open, settingsOpen]);

  useEffect(() => {
    setSttSupported(isSTTSupported());
    setTtsSupported(isTTSSupported());
    setAutoSpeak(loadVoiceSettings().autoSpeak);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  // Auto-speak the reply once streaming finishes, if enabled.
  useEffect(() => {
    if (wasStreaming.current && !streaming && autoSpeak && ttsSupported) {
      const last = messages[messages.length - 1];
      if (last?.role === "assistant" && last.content) {
        const vs = loadVoiceSettings();
        speak(last.content, { voiceURI: vs.voiceURI, rate: vs.rate });
      }
    }
    wasStreaming.current = streaming;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streaming]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    send(input);
    setInput("");
  };

  const toggleListening = () => {
    if (listening) {
      recRef.current?.stop();
      return;
    }
    stopSpeaking();
    setVoiceError(null);
    const rec = createRecognizer({
      onInterim: (text) => setInput(text),
      onFinal: (text) => {
        setInput("");
        send(text);
      },
      onEnd: () => setListening(false),
      onError: (msg) => {
        setVoiceError(msg);
        setListening(false);
      },
    });
    if (!rec) return;
    recRef.current = rec;
    setListening(true);
    rec.start();
  };

  const toggleAutoSpeak = () => {
    const vs = loadVoiceSettings();
    const next = !autoSpeak;
    saveVoiceSettings({ ...vs, autoSpeak: next });
    setAutoSpeak(next);
    if (!next) stopSpeaking();
  };

  const speakMessage = (content: string) => {
    const vs = loadVoiceSettings();
    speak(content, { voiceURI: vs.voiceURI, rate: vs.rate });
  };

  const hasLessonContext = !!(ctx.lessonTitle || ctx.stepTitle);

  return (
    <>
      <TutorSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Floating toggle (mobile + collapsed desktop) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-py to-js text-ink-950 shadow-glow grid place-items-center font-bold text-sm hover:brightness-110 active:brightness-95 transition"
          aria-label="Open AI tutor"
        >
          AI
        </button>
      )}

      {/* Panel */}
      <div
        className={`fixed z-40 bg-ink-900 border-ink-700 shadow-soft flex flex-col transition-transform duration-200
          bottom-0 left-0 right-0 h-[75vh] rounded-t-2xl border-t
          lg:top-14 lg:bottom-0 lg:left-auto lg:right-0 lg:h-auto lg:w-[380px] lg:rounded-t-none lg:border-l lg:border-t-0
          ${open ? "translate-y-0" : "translate-y-full lg:translate-y-0 lg:translate-x-full"}
        `}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-ink-800 shrink-0">
          <span className="w-6 h-6 rounded-md bg-gradient-to-br from-py to-js grid place-items-center text-ink-950 text-[10px] font-black">
            AI
          </span>
          <span className="font-semibold text-sm text-ink-100">Tutor</span>
          {hasLessonContext && (
            <span className="text-[11px] text-ink-500 truncate ml-1">
              · watching {ctx.stepTitle ? "this step" : "this lesson"}
            </span>
          )}
          {memory.trim() && (
            <span
              className="text-[11px] text-py ml-1 shrink-0"
              title="The tutor has saved notes from past sessions"
            >
              · 🧠 remembers you
            </span>
          )}
          <div className="ml-auto flex items-center gap-1">
            {ttsSupported && (
              <button
                onClick={toggleAutoSpeak}
                className={`w-7 h-7 grid place-items-center rounded-md transition text-xs ${
                  autoSpeak ? "text-py bg-py/10" : "text-ink-400 hover:text-ink-100 hover:bg-ink-800"
                }`}
                title={autoSpeak ? "Auto-speak replies: on" : "Auto-speak replies: off"}
              >
                {autoSpeak ? "🔊" : "🔇"}
              </button>
            )}
            <button
              onClick={() => setSettingsOpen(true)}
              className="w-7 h-7 grid place-items-center rounded-md text-ink-400 hover:text-ink-100 hover:bg-ink-800 transition text-xs"
              title="Settings"
            >
              ⚙
            </button>
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="w-7 h-7 grid place-items-center rounded-md text-ink-400 hover:text-ink-100 hover:bg-ink-800 transition text-xs"
                title="Clear chat"
              >
                ⟲
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 grid place-items-center rounded-md text-ink-400 hover:text-ink-100 hover:bg-ink-800 transition"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {!keyPresent ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="text-sm text-ink-300">
              Add your Anthropic or OpenAI API key to turn on the tutor. It's contextually aware —
              it can see your current lesson step, your code, and your last run's output.
            </p>
            <button
              onClick={() => setSettingsOpen(true)}
              className="px-4 py-2 rounded-lg bg-ink-100 text-ink-950 text-sm font-medium hover:bg-white transition"
            >
              Add API key
            </button>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-4 py-3 space-y-3">
              {messages.length === 0 && (
                <div className="text-sm text-ink-400 leading-relaxed">
                  Ask about the step you're on, paste an error, or use a quick action below. I can
                  see your lesson, your code, and your last run.
                  {sttSupported && " Tap the mic to talk instead of typing."}
                </div>
              )}
              {messages.map((m, i) => {
                const isLastAssistant = m.role === "assistant" && i === messages.length - 1;
                const finishedAssistant = m.role === "assistant" && m.content && !(isLastAssistant && streaming);
                return (
                  <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                    <div className="max-w-[90%]">
                      <div
                        className={`rounded-xl px-3 py-2 text-[13.5px] whitespace-pre-wrap leading-relaxed ${
                          m.role === "user"
                            ? "bg-ink-100 text-ink-950"
                            : "bg-ink-800 text-ink-100 border border-ink-700"
                        }`}
                      >
                        {m.content || (streaming && m.role === "assistant" ? "…" : "")}
                      </div>
                      {finishedAssistant && (
                        <div className="mt-1 flex items-center gap-3">
                          <button
                            onClick={() => {
                              rememberMessage(m.content);
                              setRememberedId(m.id);
                              setTimeout(() => setRememberedId((id) => (id === m.id ? null : id)), 1800);
                            }}
                            className="text-[11px] text-ink-500 hover:text-ink-200 transition"
                            title="Save this to long-term memory so future sessions know it too"
                          >
                            {rememberedId === m.id ? "✓ saved to memory" : "📌 remember this"}
                          </button>
                          {ttsSupported && (
                            <button
                              onClick={() => speakMessage(m.content)}
                              className="text-[11px] text-ink-500 hover:text-ink-200 transition"
                              title="Read this reply aloud"
                            >
                              🔊 play
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {error && (
                <div className="rounded-lg border border-bad/50 bg-bad/10 text-bad text-xs px-3 py-2">
                  {error}
                </div>
              )}
              {voiceError && (
                <div className="rounded-lg border border-warm/50 bg-warm/10 text-warm text-xs px-3 py-2">
                  {voiceError}
                </div>
              )}
            </div>

            {/* Quick actions */}
            {hasLessonContext && (
              <div className="px-3 pt-2 shrink-0 flex gap-1.5 overflow-x-auto scrollbar-thin">
                {QUICK_ACTIONS.map((qa) => (
                  <button
                    key={qa.label}
                    disabled={streaming}
                    onClick={() => quickAsk(qa.prompt)}
                    className="shrink-0 whitespace-nowrap text-[11.5px] px-2.5 py-1.5 rounded-full border border-ink-700 text-ink-300 hover:text-ink-100 hover:bg-ink-800 transition disabled:opacity-40"
                  >
                    {qa.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={submit} className="p-3 border-t border-ink-800 shrink-0 flex items-end gap-2">
              {sttSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`shrink-0 w-9 h-9 grid place-items-center rounded-lg border transition ${
                    listening
                      ? "border-bad bg-bad/20 text-bad animate-pulse"
                      : "border-ink-700 text-ink-300 hover:text-ink-100 hover:bg-ink-800"
                  }`}
                  title={listening ? "Listening… tap to stop" : "Talk to the tutor"}
                >
                  {listening ? "●" : "🎤"}
                </button>
              )}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
                rows={1}
                placeholder={listening ? "Listening…" : "Ask the tutor…"}
                className="flex-1 resize-none rounded-lg bg-ink-950 border border-ink-700 focus:border-ink-500 focus:outline-none px-3 py-2 text-sm text-ink-100 max-h-32"
              />
              {streaming ? (
                <button
                  type="button"
                  onClick={() => {
                    stopSpeaking();
                    stop();
                  }}
                  className="shrink-0 px-3 py-2 rounded-lg bg-bad/20 text-bad text-sm font-medium hover:bg-bad/30 transition"
                >
                  Stop
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="shrink-0 px-3 py-2 rounded-lg bg-ink-100 text-ink-950 text-sm font-medium hover:bg-white transition disabled:opacity-40"
                >
                  Send
                </button>
              )}
            </form>
          </>
        )}
      </div>
    </>
  );
}
