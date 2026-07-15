"use client";

import { useState, type FormEvent } from "react";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

const FALLBACK_REPLY = "Ospravedlňujem sa, moje spojenie na server bolo prerušené. Skúste to prosím neskôr.";

function formatBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export default function HomeChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Ahoj! Som AI asistent AI Nexus Link. Zaujíma vás headless web alebo AI automatizácia obsahu? Spýtajte sa ma čokoľvek!",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", text }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
        }),
      });

      if (!res.ok) throw new Error("chat request failed");
      const data = (await res.json()) as { reply?: string };
      setMessages([...nextMessages, { role: "model", text: data.reply ?? FALLBACK_REPLY }]);
    } catch {
      setMessages([...nextMessages, { role: "model", text: FALLBACK_REPLY }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {open && (
        <div className="mb-4 w-80 origin-bottom-right overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:w-96">
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <div>
                <h4 className="text-sm font-bold">AI Asistent</h4>
                <p className="text-xs text-blue-100">Odpovedá ihneď</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Zavrieť chat"
              className="text-white transition-colors hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="flex h-80 flex-col gap-3 overflow-y-auto bg-gray-50 p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex max-w-[85%] items-start gap-2 ${m.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                <div
                  className={
                    m.role === "model"
                      ? "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm"
                      : "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-800 text-sm text-white"
                  }
                >
                  {m.role === "model" ? "🤖" : "👤"}
                </div>
                <div
                  className={
                    m.role === "model"
                      ? "rounded-2xl rounded-tl-none border border-gray-100 bg-white p-3 text-sm text-gray-700"
                      : "rounded-2xl rounded-tr-none bg-blue-600 p-3 text-sm text-white shadow-md"
                  }
                >
                  {formatBold(m.text)}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex items-center gap-2 p-1 text-xs italic text-gray-500">
                <span>AI premýšľa</span>
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0.4s]" />
                </span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-gray-200 bg-white p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Napíšte správu..."
              autoComplete="off"
              className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={sending || input.trim().length === 0}
              aria-label="Odoslať správu"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              →
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Zavrieť AI asistenta" : "Otvoriť AI asistenta"}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50"
      >
        {!open && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-red-500" />
          </span>
        )}
        <span className="text-2xl">{open ? "✕" : "💬"}</span>
      </button>
    </div>
  );
}
