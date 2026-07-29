"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Plávajúci RAG chatbot (Krok 4).
 *
 * Bublina vpravo dole → panel s chatom. Volá `/api/chat`, ktorý odpovedá
 * z nášho obsahu a vracia zdroje. Prístupné: klávesnica (Enter odošle,
 * Escape zavrie), aria role, fokus na vstup po otvorení.
 */

interface Source {
  title: string;
  url: string;
}
interface Msg {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  greeting?: boolean;
}

const GREETING: Msg = {
  role: "assistant",
  greeting: true,
  content:
    "Dobrý deň! 👋 Som asistent digitálnej pomoci. Spýtajte sa ma na naše služby — " +
    "automatizáciu, chatboty, weby či ceny. Odpovedám z nášho obsahu.",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send() {
    const question = input.trim();
    if (!question || sending) return;

    const history = messages
      .filter((m) => !m.greeting)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, history }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; answer?: string; sources?: Source[]; error?: string }
        | null;
      if (res.ok && data?.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.answer ?? "", sources: data.sources },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data?.error ?? "Prepáčte, nastala chyba. Skúste to prosím znova." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Prepáčte, spojenie zlyhalo. Skúste to prosím o chvíľu." },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end print:hidden">
      {open && (
        <div
          role="dialog"
          aria-label="Chat s asistentom"
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          className="mb-3 flex h-[70vh] max-h-[560px] w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_24px_64px_rgba(23,23,50,0.22)] sm:w-[380px]"
        >
          {/* Hlavička */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3.5 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-lg">🤖</span>
            <div className="flex-1">
              <p className="text-[15px] font-semibold leading-tight">Asistent · digitálna pomoc</p>
              <p className="text-[12px] leading-tight text-white/70">Odpovedá z nášho obsahu</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Zavrieť chat"
              className="grid h-8 w-8 place-items-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Správy */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-cloud px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-2.5 text-[14.5px] leading-[1.5] text-white"
                      : "max-w-[85%] rounded-2xl rounded-bl-sm border border-line bg-white px-3.5 py-2.5 text-[14.5px] leading-[1.5] text-mist-700"
                  }
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1 border-t border-line pt-2">
                      <span className="text-[11.5px] font-semibold text-mist-400">Zdroje:</span>
                      {m.sources.slice(0, 3).map((s) => (
                        <a
                          key={s.url}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate text-[12.5px] text-indigo-600 hover:underline"
                        >
                          → {s.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm border border-line bg-white px-3.5 py-2.5 text-[14.5px] text-mist-400">
                  Píšem…
                </div>
              </div>
            )}
          </div>

          {/* Vstup */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 border-t border-line bg-white px-3 py-3"
          >
            <label htmlFor="chat-input" className="sr-only">
              Napíšte otázku
            </label>
            <input
              id="chat-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Napíšte otázku…"
              autoComplete="off"
              className="flex-1 rounded-full border border-line bg-cloud px-4 py-2.5 text-[14.5px] text-ink outline-none transition-colors placeholder:text-mist-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              aria-label="Odoslať"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white transition hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 12l16-8-6 8 6 8-16-8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Bublina */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Zavrieť chat" : "Otvoriť chat s asistentom"}
        aria-expanded={open}
        className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 transition hover:-translate-y-0.5"
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M21 11.5a8.38 8.38 0 01-8.5 8.5 8.5 8.5 0 01-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 01-.9-3.8A8.38 8.38 0 0112.5 3 8.5 8.5 0 0121 11.5z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
