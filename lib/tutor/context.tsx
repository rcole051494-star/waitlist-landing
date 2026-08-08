"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ChatMsg, LessonContext } from "./types";
import { loadSettings } from "./settings";
import { buildSystemPrompt, streamChat } from "./client";

type TutorState = {
  open: boolean;
  setOpen: (o: boolean) => void;
  ctx: LessonContext;
  setCtx: (patch: Partial<LessonContext>) => void;
  messages: ChatMsg[];
  streaming: boolean;
  send: (text: string) => void;
  quickAsk: (prompt: string) => void;
  stop: () => void;
  clearChat: () => void;
  error: string | null;
};

const TutorCtx = createContext<TutorState | null>(null);

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function TutorProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [ctx, setCtxState] = useState<LessonContext>({});
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<{ abort: () => void } | null>(null);
  const ctxRef = useRef(ctx);
  ctxRef.current = ctx;
  const messagesRef = useRef<ChatMsg[]>(messages);
  messagesRef.current = messages;

  const setCtx = useCallback((patch: Partial<LessonContext>) => {
    setCtxState((prev) => ({ ...prev, ...patch }));
  }, []);

  const runSend = useCallback((text: string) => {
    const settings = loadSettings();
    setError(null);
    if (!settings.apiKey.trim()) {
      setError("Add your API key in Tutor settings to start chatting.");
      setOpen(true);
      return;
    }
    const priorHistory = messagesRef.current;
    const userMsg: ChatMsg = { id: uid(), role: "user", content: text, createdAt: Date.now() };
    const assistantMsg: ChatMsg = { id: uid(), role: "assistant", content: "", createdAt: Date.now() };
    setMessages((m) => [...m, userMsg, assistantMsg]);
    setStreaming(true);
    setOpen(true);

    const system = buildSystemPrompt(ctxRef.current);
    const history = [...priorHistory, userMsg];

    const handle = streamChat(settings.provider, settings.apiKey, settings.model, system, history, {
      onToken: (delta) => {
        setMessages((m) => {
          const copy = m.slice();
          const last = copy[copy.length - 1];
          if (last && last.id === assistantMsg.id) {
            copy[copy.length - 1] = { ...last, content: last.content + delta };
          }
          return copy;
        });
      },
      onDone: () => {
        setStreaming(false);
        abortRef.current = null;
      },
      onError: (msg) => {
        setError(msg);
        setStreaming(false);
        abortRef.current = null;
      },
    });
    abortRef.current = handle;
  }, []);

  const send = useCallback((text: string) => {
    if (!text.trim() || streaming) return;
    runSend(text.trim());
  }, [runSend, streaming]);

  const quickAsk = useCallback((prompt: string) => {
    if (streaming) return;
    runSend(prompt);
  }, [runSend, streaming]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStreaming(false);
  }, []);

  const clearChat = useCallback(() => {
    stop();
    setMessages([]);
    setError(null);
  }, [stop]);

  return (
    <TutorCtx.Provider
      value={{ open, setOpen, ctx, setCtx, messages, streaming, send, quickAsk, stop, clearChat, error }}
    >
      {children}
    </TutorCtx.Provider>
  );
}

export function useTutor() {
  const v = useContext(TutorCtx);
  if (!v) throw new Error("useTutor must be used within TutorProvider");
  return v;
}

// Convenience hook for lesson/runner components to push context without
// needing the full tutor state. Re-patches whenever the given deps change.
export function useTutorContext(patch: Partial<LessonContext>, deps: React.DependencyList) {
  const { setCtx } = useTutor();
  const patchRef = useRef(patch);
  patchRef.current = patch;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setCtx(patchRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
