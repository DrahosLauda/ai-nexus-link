import { NextRequest, NextResponse } from "next/server";

/**
 * Príjem leadov z kontaktných formulárov.
 *
 * Zapisuje do Directus kolekcie `client_leads` (CRM vrstva AI Nexus Link).
 * Očakávané polia kolekcie: name, email, phone, message, source.
 *
 * Ochrany: honeypot pole `website` (roboti ho vyplnia, ľudia nevidia)
 * a jednoduchý rate limit na IP (5 požiadaviek / 10 minút).
 */

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  // priebežné čistenie starých záznamov, nech mapa nerastie donekonečna
  if (hits.size > 10_000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > RATE_LIMIT;
}

interface LeadBody {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  source?: string;
  website?: string; // honeypot — musí zostať prázdne
}

export async function POST(request: NextRequest) {
  let body: LeadBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Neplatná požiadavka." },
      { status: 400 },
    );
  }

  // Honeypot: robotom odpovieme "úspechom", ale nič neuložíme.
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Priveľa požiadaviek. Skúste to o chvíľu." },
      { status: 429 },
    );
  }

  const email = body.email?.trim() ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Zadajte platný e-mail." },
      { status: 400 },
    );
  }

  if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
    console.error("lead: DIRECTUS_URL / DIRECTUS_TOKEN nie sú nastavené");
    return NextResponse.json(
      { ok: false, error: "Služba nie je nakonfigurovaná." },
      { status: 503 },
    );
  }

  const lead = {
    name: body.name?.trim().slice(0, 200) || null,
    email: email.slice(0, 200),
    phone: body.phone?.trim().slice(0, 50) || null,
    message: body.message?.trim().slice(0, 5000) || null,
    source: body.source?.trim().slice(0, 100) || "web",
  };

  const res = await fetch(`${DIRECTUS_URL}/items/client_leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DIRECTUS_TOKEN}`,
    },
    body: JSON.stringify(lead),
  });

  if (!res.ok) {
    console.error("lead: Directus odpovedal", res.status, await res.text());
    return NextResponse.json(
      { ok: false, error: "Uloženie zlyhalo. Skúste to prosím znova." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
