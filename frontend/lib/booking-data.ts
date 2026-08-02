/**
 * Prístup k dátam rezervácií cez Directus REST (Krok R1 z docs/plan-agenti.md).
 *
 * Číta katalóg (`booking_services`, `booking_resources`, `booking_availability`,
 * `booking_blackouts`) a zapisuje `bookings` + prepája `client_leads`. Výpočet
 * voľných slotov deleguje na čistý engine `lib/booking.ts` (žiadna duplicita).
 *
 * Autorizácia: token `RESERVATION_TOKEN` (least privilege — read na katalóg,
 * create/read na bookings, create na client_leads). Vzor podľa `/api/lead`.
 * Časy v DB sú UTC (`timestamptz`); zobrazenie do Europe/Bratislava rieši widget
 * a e-maily (helper `formatSlotHuman`).
 */

import {
  computeFreeSlots,
  slotEndIso,
  DEFAULT_TIME_ZONE,
  type BookingService,
  type AvailabilityRow,
  type UtcInterval,
} from "./booking";

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const TOKEN = process.env.RESERVATION_TOKEN || process.env.DIRECTUS_TOKEN;

/** Minimálny predstih pred rezerváciou (nedovoliť „o 5 minút"). */
const MIN_LEAD_MIN = 60;

export function bookingConfigured(): boolean {
  return Boolean(DIRECTUS_URL && TOKEN);
}

// ── Directus REST pomocníci ─────────────────────────────────────────────────

interface Query {
  fields?: string[];
  filter?: unknown;
  sort?: string[];
  limit?: number;
}

async function directusGet<T>(collection: string, query: Query = {}): Promise<T[]> {
  const params = new URLSearchParams();
  if (query.fields) params.set("fields", query.fields.join(","));
  if (query.sort) params.set("sort", query.sort.join(","));
  params.set("limit", String(query.limit ?? -1));
  if (query.filter) params.set("filter", JSON.stringify(query.filter));

  const res = await fetch(`${DIRECTUS_URL}/items/${collection}?${params}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Directus GET ${collection} ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  const json = (await res.json()) as { data: T[] };
  return json.data;
}

async function directusCreate<T>(collection: string, item: unknown): Promise<T | null> {
  const res = await fetch(`${DIRECTUS_URL}/items/${collection}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  const text = await res.text();
  if (!res.ok) {
    const err = new Error(`Directus POST ${collection} ${res.status}: ${text.slice(0, 300)}`);
    // Prekryv chytený DB exclusion constraintom → rozlíšime ako „obsadené".
    if (/overlap|exclusion|bookings_no_overlap|RECORD_NOT_UNIQUE/i.test(text)) {
      (err as Error & { conflict?: boolean }).conflict = true;
    }
    throw err;
  }
  // Token iba s právom Create (napr. `client_leads`) nevie prečítať vytvorenú
  // položku späť → Directus vráti prázdne telo. To NIE je chyba (položka vznikla),
  // len nepoznáme jej id (napr. na prepojenie leadu na rezerváciu).
  if (!text) return null;
  return (JSON.parse(text) as { data: T }).data;
}

// ── Katalóg ─────────────────────────────────────────────────────────────────

export interface ServiceView {
  id: number;
  name: string;
  duration_min: number;
  description: string | null;
}

interface ServiceRow extends BookingService {
  name: string;
  description: string | null;
  resource: number | null;
  is_active?: boolean;
}

/** Aktívne služby pre widget (výber v prvom kroku). */
export async function listServices(): Promise<ServiceView[]> {
  const rows = await directusGet<ServiceRow>("booking_services", {
    fields: ["id", "name", "duration_min", "description"],
    filter: { is_active: { _eq: true } },
    sort: ["sort", "name"],
  });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    duration_min: r.duration_min,
    description: r.description ?? null,
  }));
}

async function getService(id: number): Promise<ServiceRow | null> {
  const rows = await directusGet<ServiceRow>("booking_services", {
    fields: ["id", "name", "duration_min", "buffer_min", "slot_step_min", "description", "resource"],
    filter: { id: { _eq: id }, is_active: { _eq: true } },
    limit: 1,
  });
  return rows[0] ?? null;
}

/** Ktorý zdroj službu poskytuje. NULL na službe = prvý aktívny zdroj (v1). */
async function resolveResourceId(service: ServiceRow): Promise<number | null> {
  if (service.resource) return service.resource;
  const rows = await directusGet<{ id: number }>("booking_resources", {
    fields: ["id"],
    filter: { is_active: { _eq: true } },
    sort: ["sort", "id"],
    limit: 1,
  });
  return rows[0]?.id ?? null;
}

function addDays(date: string, n: number): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/**
 * Načíta všetko potrebné a spočíta voľné sloty pre (službu, deň). Zdieľané medzi
 * GET /slots a POST /create (re-check pred zápisom) → jedna cesta pravdy.
 */
async function resolveSlots(
  serviceId: number,
  date: string,
  now: Date,
): Promise<{ service: ServiceRow; resourceId: number; slots: string[] } | null> {
  const service = await getService(serviceId);
  if (!service) return null;
  const resourceId = await resolveResourceId(service);
  if (!resourceId) return null;

  // UTC okno so slušnou rezervou (±1 deň) — engine potom presne odfiltruje prekryvy.
  const from = `${addDays(date, -1)}T00:00:00Z`;
  const to = `${addDays(date, 1)}T23:59:59Z`;

  const [availability, bookings, blackouts] = await Promise.all([
    directusGet<AvailabilityRow>("booking_availability", {
      fields: ["weekday", "start_time", "end_time"],
      filter: { resource: { _eq: resourceId } },
    }),
    directusGet<UtcInterval>("bookings", {
      fields: ["start", "end"],
      filter: {
        resource: { _eq: resourceId },
        status: { _eq: "confirmed" },
        start: { _lte: to },
        end: { _gte: from },
      },
    }),
    directusGet<UtcInterval>("booking_blackouts", {
      fields: ["start", "end"],
      filter: {
        _or: [{ resource: { _eq: resourceId } }, { resource: { _null: true } }],
        start: { _lte: to },
        end: { _gte: from },
      },
    }),
  ]);

  const slots = computeFreeSlots({
    service,
    availability,
    bookings,
    blackouts,
    date,
    now,
    minLeadMin: MIN_LEAD_MIN,
    timeZone: DEFAULT_TIME_ZONE,
  });
  return { service, resourceId, slots };
}

export interface SlotsResult {
  service: ServiceView;
  slots: { start: string; label: string }[];
}

/** Voľné sloty pre GET /api/booking/slots (s ľudským popiskom v Bratislave). */
export async function getFreeSlots(serviceId: number, date: string): Promise<SlotsResult | null> {
  const resolved = await resolveSlots(serviceId, date, new Date());
  if (!resolved) return null;
  return {
    service: {
      id: resolved.service.id,
      name: resolved.service.name,
      duration_min: resolved.service.duration_min,
      description: resolved.service.description ?? null,
    },
    slots: resolved.slots.map((start) => ({ start, label: formatTimeHuman(start) })),
  };
}

// ── Zápis rezervácie ────────────────────────────────────────────────────────

export interface CreateReservationInput {
  serviceId: number;
  /** Lokálny deň (YYYY-MM-DD, pásmo prevádzky) — jednoznačne určuje okno slotov. */
  date: string;
  startIso: string;
  name: string;
  email: string;
  phone?: string;
  note?: string;
}

export type CreateReservationResult =
  | { ok: true; booking: { id: number; start: string; end: string; serviceName: string } }
  | { ok: false; reason: "not-found" | "slot-taken" };

/**
 * Vytvorí rezerváciu: re-check slotu → lead (`client_leads`) → `bookings`.
 * DB exclusion constraint chytí súbeh dvoch requestov → mapujeme na „obsadené".
 */
export async function createReservation(
  input: CreateReservationInput,
): Promise<CreateReservationResult> {
  const now = new Date();
  const resolved = await resolveSlots(input.serviceId, input.date, now);
  if (!resolved) return { ok: false, reason: "not-found" };

  // Re-check tesne pred zápisom: vybraný začiatok musí byť stále medzi voľnými.
  if (!resolved.slots.includes(input.startIso)) {
    return { ok: false, reason: "slot-taken" };
  }

  const { service, resourceId } = resolved;
  const endIso = slotEndIso(input.startIso, service);

  // Lead do CRM (prepojíme na rezerváciu). Zlyhanie leadu nezhodí rezerváciu.
  let leadId: number | null = null;
  try {
    const lead = await directusCreate<{ id: number }>("client_leads", {
      name: input.name.slice(0, 200),
      email: input.email.slice(0, 200),
      phone: input.phone?.slice(0, 50) || null,
      message: input.note?.slice(0, 5000) || null,
      source: "rezervacia",
    });
    // Pri create-only tokene je `lead` null (Directus nevráti telo) — lead vznikol,
    // len ho nevieme prepojiť. Prepojenie funguje, ak token dostane aj Read.
    leadId = lead?.id ?? null;
  } catch (e) {
    console.error("booking: lead sa nepodarilo vytvoriť (pokračujem)", e);
  }

  try {
    const booking = await directusCreate<{ id: number }>("bookings", {
      service: service.id,
      resource: resourceId,
      start: input.startIso,
      end: endIso,
      customer_name: input.name.slice(0, 200),
      customer_email: input.email.slice(0, 200),
      customer_phone: input.phone?.slice(0, 50) || null,
      note: input.note?.slice(0, 5000) || null,
      status: "confirmed",
      source: "web-widget",
      lead: leadId,
    });
    return {
      ok: true,
      booking: {
        id: booking?.id ?? 0,
        start: input.startIso,
        end: endIso,
        serviceName: service.name,
      },
    };
  } catch (e) {
    if ((e as { conflict?: boolean }).conflict) {
      return { ok: false, reason: "slot-taken" };
    }
    throw e;
  }
}

// ── Zobrazenie času (Europe/Bratislava, po slovensky) ───────────────────────

/** "16. 3. 2026 o 9:00" — na potvrdenia a odpovede API. */
export function formatSlotHuman(startIso: string, timeZone = DEFAULT_TIME_ZONE): string {
  const d = new Date(startIso);
  const date = new Intl.DateTimeFormat("sk-SK", {
    timeZone,
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(d);
  return `${date} o ${formatTimeHuman(startIso, timeZone)}`;
}

/** "9:00" — len hodina/minúta v pásme prevádzky. */
export function formatTimeHuman(startIso: string, timeZone = DEFAULT_TIME_ZONE): string {
  return new Intl.DateTimeFormat("sk-SK", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(startIso));
}
