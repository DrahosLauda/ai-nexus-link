import { NextRequest, NextResponse } from "next/server";

import { bookingConfigured, getFreeSlots, listServices } from "@/lib/booking-data";

/**
 * Voľné rezervačné sloty.
 *
 * GET /api/booking/slots                          → { ok, services }  (katalóg)
 * GET /api/booking/slots?service=<id>&date=<YYYY-MM-DD>
 *                                                 → { ok, service, slots }
 *
 * Číta Directus (`booking_*`) a sloty počíta engine `lib/booking.ts`. Iba
 * čítanie → bez rate limitu; ochrany na zápis sú v /api/booking/create.
 */

export const runtime = "nodejs"; // Directus REST + Node (nie edge)

export async function GET(request: NextRequest) {
  if (!bookingConfigured()) {
    console.error("booking/slots: DIRECTUS_URL / RESERVATION_TOKEN nie sú nastavené");
    return NextResponse.json(
      { ok: false, error: "Rezervácie nie sú nakonfigurované." },
      { status: 503 },
    );
  }

  const service = request.nextUrl.searchParams.get("service");
  const date = request.nextUrl.searchParams.get("date");

  try {
    // Bez parametrov → katalóg služieb pre prvý krok widgetu.
    if (!service) {
      return NextResponse.json({ ok: true, services: await listServices() });
    }

    const serviceId = Number(service);
    if (!Number.isInteger(serviceId) || serviceId <= 0) {
      return NextResponse.json({ ok: false, error: "Neplatná služba." }, { status: 400 });
    }
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ ok: false, error: "Neplatný dátum." }, { status: 400 });
    }

    const result = await getFreeSlots(serviceId, date);
    if (!result) {
      return NextResponse.json({ ok: false, error: "Služba sa nenašla." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, service: result.service, slots: result.slots });
  } catch (e) {
    console.error("booking/slots: zlyhalo", e);
    return NextResponse.json(
      { ok: false, error: "Termíny sa nepodarilo načítať. Skúste to prosím o chvíľu." },
      { status: 502 },
    );
  }
}
