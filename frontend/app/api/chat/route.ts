import { NextRequest, NextResponse } from "next/server";

import { answerQuestion, ragConfigured, type ChatMessage } from "@/lib/rag";

/**
 * Mozog RAG chatbota.
 *
 * POST /api/chat  { question: string, history?: {role, content}[] }
 *   → { ok: true, answer: string, sources: {title, url}[] }
 *
 * Odpovedá IBA z nášho obsahu (viď lib/rag.ts). Ochrany ako pri /api/lead:
 * honeypot `website` a jednoduchý rate limit na IP.
 */

export const runtime = "nodejs"; // potrebujeme Node (pg), nie edge

const RATE_LIMIT = 15;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 10_000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > RATE_LIMIT;
}

interface ChatBody {
  question?: string;
  history?: ChatMessage[];
  website?: string; // honeypot
}

export async function POST(request: NextRequest) {
  let body: ChatBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Neplatná požiadavka." }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ ok: true, answer: "", sources: [] });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Priveľa otázok naraz. Skúste to o chvíľu." },
      { status: 429 },
    );
  }

  const question = body.question?.trim() ?? "";
  if (!question) {
    return NextResponse.json({ ok: false, error: "Napíšte otázku." }, { status: 400 });
  }
  if (question.length > 1000) {
    return NextResponse.json({ ok: false, error: "Otázka je príliš dlhá." }, { status: 400 });
  }

  if (!ragConfigured()) {
    console.error("chat: RAG_DATABASE_URL / GEMINI_API_KEY nie sú nastavené");
    return NextResponse.json({ ok: false, error: "Asistent nie je nakonfigurovaný." }, { status: 503 });
  }

  const history = Array.isArray(body.history) ? body.history : [];

  try {
    const { answer, sources } = await answerQuestion(question, history);
    if (!answer) {
      return NextResponse.json({
        ok: true,
        answer: "Prepáčte, teraz neviem odpovedať. Napíšte nám prosím cez kontaktný formulár.",
        sources: [],
      });
    }
    return NextResponse.json({ ok: true, answer, sources });
  } catch (e) {
    console.error("chat: odpoveď zlyhala", e);
    return NextResponse.json(
      { ok: false, error: "Asistent má krátku prestávku. Skúste to prosím o chvíľu." },
      { status: 502 },
    );
  }
}
