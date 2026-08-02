import { NextRequest, NextResponse } from "next/server";

import { bookingConfigured, createReservation } from "@/lib/booking-data";
import { sendBookingEmails } from "@/lib/booking-emails";

/**
 * Vytvorenie rezervácie.
 *
 * POST /api/booking/create
 *   { service:number, start:ISO, name, email, phone?, note?, website? (honeypot) }
 *   → { ok, start, end, when }  |  chyba (400/409/429/502/503)
 *
 * Ochrany ako pri /api/lead: honeypot `website` + rate limit na IP. Re-check
 * slotu a DB exclusion constraint proti dvojitej rezervácii rieši booking-data.
 * Po úspešnom zápise pošle potvrdenia e-mailom (best effort — nezhodia zápis).
 */

export const runtime = "nodejs";

const RATE_LIMIT = 5;
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

interface CreateBody {
  service?: number;
  date?: string; // lokálny deň YYYY-MM-DD (pásmo prevádzky)
  start?: string;
  name?: string;
  email?: string;
  phone?: string;
  note?: string;
  website?: string; // honeypot — musí zostať prázdne
}

export async function POST(request: NextRequest) {
  let body: CreateBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Neplatná požiadavka." }, { status: 400 });
  }

  // Honeypot: robotom vrátime „úspech", ale nič neuložíme.
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Priveľa požiadaviek. Skúste to o chvíľu." },
      { status: 429 },
    );
  }

  const serviceId = Number(body.service);
  if (!Number.isInteger(serviceId) || serviceId <= 0) {
    return NextResponse.json({ ok: false, error: "Vyberte službu." }, { status: 400 });
  }

  const date = body.date?.trim() ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ ok: false, error: "Vyberte platný dátum." }, { status: 400 });
  }

  const start = body.start?.trim() ?? "";
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(\.\d+)?Z$/.test(start) || Number.isNaN(Date.parse(start))) {
    return NextResponse.json({ ok: false, error: "Vyberte platný termín." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: "Zadajte meno." }, { status: 400 });
  }

  const email = body.email?.trim() ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Zadajte platný e-mail." }, { status: 400 });
  }

  if (!bookingConfigured()) {
    console.error("booking/create: DIRECTUS_URL / RESERVATION_TOKEN nie sú nastavené");
    return NextResponse.json(
      { ok: false, error: "Rezervácie nie sú nakonfigurované." },
      { status: 503 },
    );
  }

  try {
    const result = await createReservation({
      serviceId,
      date,
      startIso: new Date(start).toISOString(), // normalizácia na presný ISO tvar v DB
      name,
      email,
      phone: body.phone?.trim() || undefined,
      note: body.note?.trim() || undefined,
    });

    if (!result.ok) {
      if (result.reason === "slot-taken") {
        return NextResponse.json(
          { ok: false, error: "Tento termín je už obsadený. Vyberte prosím iný." },
          { status: 409 },
        );
      }
      return NextResponse.json({ ok: false, error: "Služba sa nenašla." }, { status: 404 });
    }

    // Potvrdenia e-mailom — best effort, rezerváciu už máme uloženú.
    await sendBookingEmails({
      serviceName: result.booking.serviceName,
      start: result.booking.start,
      name,
      email,
      phone: body.phone?.trim() || undefined,
      note: body.note?.trim() || undefined,
    });

    return NextResponse.json({
      ok: true,
      start: result.booking.start,
      end: result.booking.end,
    });
  } catch (e) {
    console.error("booking/create: zlyhalo", e);
    return NextResponse.json(
      { ok: false, error: "Rezerváciu sa nepodarilo dokončiť. Skúste to prosím znova." },
      { status: 502 },
    );
  }
}
