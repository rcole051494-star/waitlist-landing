"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ChatMsg, LessonContext } from "./types";
import { loadSettings } from "./settings";
import { buildSystemPrompt, streamChat } from "./client";
import { appendMemory, loadMemory, saveMemory as persistMemory } from "./memory";

const CHAT_KEY = "codeforge.tutor.chat.v1";
const MAX_API_HISTORY = 24; // last N messages sent to the API per turn; full history stays in UI/storage

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
  memory: string;
  setMemory: (text: string) => void;
  rememberMessage: (content: string) => void;
};

const TutorCtx = createContext<TutorState | null>(null);

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function loadChat(): ChatMsg[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(CHAT_KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function TutorProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [ctx, setCtxState] = useState<LessonContext>({});
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [memory, setMemoryState] = useState("");
  const abortRef = useRef<{ abort: () => void } | null>(null);
  const ctxRef = useRef(ctx);
  ctxRef.current = ctx;
  const messagesRef = useRef<ChatMsg[]>(messages);
  messagesRef.current = messages;
  const memoryRef = useRef(memory);
  memoryRef.current = memory;
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load persisted chat + memory once, client-side only.
  useEffect(() => {
    setMessages(loadChat());
    setMemoryState(loadMemory());
  }, []);

  // Debounced persistence — avoids a localStorage write on every streamed token.
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
      }
    }, 400);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [messages]);

  const setCtx = useCallback((patch: Partial<LessonContext>) => {
    setCtxState((prev) => ({ ...prev, ...patch }));
  }, []);

  const setMemory = useCallback((text: string) => {
    persistMemory(text);
    setMemoryState(text);
  }, []);

  const rememberMessage = useCallback((content: string) => {
    const next = appendMemory(content);
    setMemoryState(next);
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

    const system = buildSystemPrompt(ctxRef.current, memoryRef.current);
    const history = [...priorHistory.slice(-MAX_API_HISTORY), userMsg];

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
      value={{
        open,
        setOpen,
        ctx,
        setCtx,
        messages,
        streaming,
        send,
        quickAsk,
        stop,
        clearChat,
        error,
        memory,
        setMemory,
        rememberMessage,
      }}
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
