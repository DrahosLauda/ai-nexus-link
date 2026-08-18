"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";

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

/** Fialový robot-maskot (vektor). `wave` zapne mávajúcu ruku; svietenie/hojdanie
 *  riešia CSS triedy (mascot-btn/mascot-bob) v globals.css. Biely na gradiente. */
function RobotMascot({ size = 30, wave = false }: { size?: number; wave?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* anténka */}
      <line x1="10.5" y1="6.6" x2="10.5" y2="3.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="10.5" cy="2.8" r="1" fill="currentColor" />
      {/* uši */}
      <rect x="3.2" y="10" width="1.4" height="3.4" rx="0.7" fill="currentColor" />
      <rect x="16.4" y="10" width="1.4" height="3.4" rx="0.7" fill="currentColor" />
      {/* hlava */}
      <rect x="4.4" y="6.6" width="12" height="10.6" rx="3.2" fill="currentColor" />
      {/* oči + úsmev */}
      <circle cx="8" cy="11" r="1.25" fill="#4f46e5" />
      <circle cx="12.9" cy="11" r="1.25" fill="#4f46e5" />
      <path d="M8 14.2 Q10.45 15.9 12.9 14.2" stroke="#4f46e5" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* mávajúca ruka */}
      <g className={wave ? "mascot-hand" : undefined}>
        <path d="M15.8 10.2 L19.2 6.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="19.9" cy="6" r="1.7" fill="currentColor" />
      </g>
    </svg>
  );
}

/**
 * Adresa nášho webu v texte odpovede — bot ju píše ako `digitalnapomoc.sk/…`,
 * návštevník ju chce mať klikateľnú (nájdené pri skúške naživo 18.8.2026).
 * Zámerne **iba naša doména**: odkaz na cudzí web sa cez odpoveď podstrčiť nedá.
 */
const OUR_URL = /(?:https?:\/\/)?(?:www\.)?digitalnapomoc\.sk(?:\/[\w\-/#?=&.]*)?/gi;

function linkify(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(OUR_URL)) {
    const start = m.index ?? 0;
    // „wp.digitalnapomoc.sk" ani adresa v strede slova nie je náš verejný web
    if (/[\w.@-]/.test(text[start - 1] ?? "")) continue;
    // koncová interpunkcia patrí vete, nie odkazu
    const shown = m[0].replace(/[.,;:!?)\]]+$/, "");
    const path = shown.slice(shown.toLowerCase().indexOf("digitalnapomoc.sk") + 17) || "/";
    out.push(text.slice(last, start));
    out.push(
      <Link
        key={start}
        href={path}
        className="font-medium text-indigo-600 underline underline-offset-2 hover:text-indigo-700"
      >
        {shown}
      </Link>,
    );
    last = start + shown.length;
  }
  out.push(text.slice(last));
  return out;
}

/**
 * Minimálny markdown pre bubliny asistenta: **tučné**, odrážky „- ", odstavce
 * a klikateľné adresy nášho webu. Zámerne bez novej závislosti a bez
 * `dangerouslySetInnerHTML` — text ide vždy cez React ako text, takže sa cezeň
 * nedá prepašovať HTML (XSS).
 */
function rich(text: string): ReactNode[] {
  // split s capture skupinou: nepárne indexy sú obsah medzi **…**
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 ? (
      <strong key={i} className="font-semibold text-ink">
        {linkify(part)}
      </strong>
    ) : (
      <Fragment key={i}>{linkify(part)}</Fragment>
    ),
  );
}

function ChatText({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];
  const flush = () => {
    if (!bullets.length) return;
    blocks.push(
      <ul key={blocks.length} className="list-disc space-y-0.5 pl-4">
        {bullets.map((b, i) => (
          <li key={i}>{rich(b)}</li>
        ))}
      </ul>,
    );
    bullets = [];
  };
  for (const line of text.split("\n")) {
    const item = line.match(/^\s*[-*•]\s+(.+)$/);
    if (item) {
      bullets.push(item[1]);
      continue;
    }
    flush();
    if (line.trim()) {
      blocks.push(
        <p key={blocks.length} className="whitespace-pre-wrap">
          {rich(line)}
        </p>,
      );
    }
  }
  flush();
  return <div className="space-y-1.5">{blocks}</div>;
}

const GREETING: Msg = {
  role: "assistant",
  greeting: true,
  content:
    "Dobrý deň! 👋 Som asistent digitálnej pomoci. Spýtajte sa ma na naše služby — " +
    "automatizáciu, chatboty, weby či ceny. Odpovedám z nášho obsahu.",
};

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  // Na mobile: o koľko klávesnica prekrýva spodok obrazovky — o toľko celý
  // widget nadvihneme, nech vstup ostane nad klávesnicou (iOS/Android).
  const [kbOffset, setKbOffset] = useState(0);
  // Viditeľná výška (bez klávesnice) — strop výšky panela, nech sa vždy zmestí.
  const [availH, setAvailH] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const onResize = () => {
      const overlap = window.innerHeight - vv.height - vv.offsetTop;
      setKbOffset(Math.max(0, Math.round(overlap)));
      setAvailH(Math.round(vv.height));
    };
    vv.addEventListener("resize", onResize);
    vv.addEventListener("scroll", onResize);
    onResize();
    return () => {
      vv.removeEventListener("resize", onResize);
      vv.removeEventListener("scroll", onResize);
    };
  }, []);

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

  // Vetva /ukazky/* sú odvetvové demo šablóny s vlastnou identitou — globálny
  // chat hlavného webu (digitalnapomoc.sk) tam nepatrí. Všetky hooky sú volané
  // vyššie, takže tento skorý návrat neporušuje pravidlá hookov.
  if (pathname?.startsWith("/ukazky")) return null;

  return (
    <div
      className="fixed right-5 z-50 flex flex-col items-end print:hidden"
      style={{ bottom: `calc(1.25rem + ${kbOffset}px)` }}
    >
      {open && (
        <div
          role="dialog"
          aria-label="Chat s asistentom"
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          style={{ maxHeight: availH ? `${Math.max(320, Math.min(560, availH - 96))}px` : "70vh" }}
          className="mb-3 flex w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_24px_64px_rgba(23,23,50,0.22)] sm:w-[380px]"
        >
          {/* Hlavička */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3.5 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white">
              <RobotMascot size={22} />
            </span>
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
          <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-cloud px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-2.5 text-[14.5px] leading-[1.5] text-white"
                      : "max-w-[85%] rounded-2xl rounded-bl-sm border border-line bg-white px-3.5 py-2.5 text-[14.5px] leading-[1.5] text-mist-700"
                  }
                >
                  {m.role === "user" ? (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    <ChatText text={m.content} />
                  )}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1 border-t border-line pt-2">
                      <span className="text-[11.5px] font-semibold text-mist-400">Zdroje:</span>
                      {m.sources.map((s) => (
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

          {/* Vstup — zámerne NIE <form>, aby iOS neponúkal heslá/karty/kontakty. */}
          <div className="flex items-center gap-2 border-t border-line bg-white px-3 py-3">
            <label htmlFor="chat-input" className="sr-only">
              Napíšte otázku
            </label>
            <input
              id="chat-input"
              ref={inputRef}
              type="text"
              name="dnp-chat-message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Napíšte otázku…"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="sentences"
              spellCheck={false}
              enterKeyHint="send"
              inputMode="text"
              className="flex-1 rounded-full border border-line bg-cloud px-4 py-2.5 text-[14.5px] text-ink outline-none transition-colors placeholder:text-mist-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            <button
              type="button"
              onClick={send}
              disabled={!input.trim() || sending}
              aria-label="Odoslať"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white transition hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 12l16-8-6 8 6 8-16-8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Bublina */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Zavrieť chat" : "Otvoriť chat s asistentom"}
        aria-expanded={open}
        className={`grid h-14 w-14 place-items-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white transition hover:-translate-y-0.5 ${
          open ? "shadow-lg shadow-indigo-500/30" : "mascot-btn"
        }`}
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <span className="mascot-bob grid place-items-center">
            <RobotMascot size={40} wave />
          </span>
        )}
      </button>
    </div>
  );
}
