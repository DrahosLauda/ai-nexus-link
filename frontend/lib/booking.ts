/**
 * Rezervačný engine — čistá logika bez I/O (Krok R1 z docs/plan-agenti.md).
 *
 * `computeFreeSlots` z otváracích hodín (dostupnosť), existujúcich rezervácií a
 * blackoutov vypočíta voľné začiatky slotov pre daný deň. Žiadny fetch, žiadna
 * databáza — len funkcie → dá sa pokryť unit testami (booking.test.ts).
 *
 * Časové pásmo: v DB aj tu pracujeme v **UTC**; otváracie hodiny sú „nástenný
 * čas" prevádzky (Europe/Bratislava) — prevedieme ich na UTC instant pre daný
 * deň (rešpektuje letný/zimný čas). Zobrazenie do lokálneho času rieši widget.
 *
 * Vzor „ponytail": jedno miesto pravdy pre výpočet slotov — widget aj (neskôr)
 * chatbot ho iba volajú, nič neduplikujú.
 */

export const DEFAULT_TIME_ZONE = "Europe/Bratislava";
const MS_PER_MIN = 60_000;

/** Služba určuje dĺžku, rezervu (buffer) a krok mriežky slotov. */
export interface BookingService {
  id: number;
  duration_min: number;
  /** Rezerva po službe (upratanie/prestávka). Ráta sa do obsadeného bloku. */
  buffer_min?: number | null;
  /** Krok mriežky; NULL/0 = zhodný s `duration_min`. */
  slot_step_min?: number | null;
}

/** Otváracie hodiny na jeden zdroj a deň v týždni (nástenný čas prevádzky). */
export interface AvailabilityRow {
  weekday: number; // 0 = nedeľa … 6 = sobota (zhoda s Date.getUTCDay)
  start_time: string; // "HH:MM" alebo "HH:MM:SS"
  end_time: string;
}

/** Časový úsek v UTC (rezervácia alebo blackout). start/end ako ISO alebo Date. */
export interface UtcInterval {
  start: string | Date;
  end: string | Date;
}

export interface ComputeFreeSlotsArgs {
  service: BookingService;
  /** Dostupnosť pre daný zdroj (viac riadkov = deň rozdelený prestávkou). */
  availability: AvailabilityRow[];
  /** Existujúce potvrdené rezervácie daného zdroja (UTC). */
  bookings: UtcInterval[];
  /** Blackouty platné pre daný zdroj (UTC). */
  blackouts: UtcInterval[];
  /** Deň, ktorý si zákazník vybral, "YYYY-MM-DD" (v časovom pásme prevádzky). */
  date: string;
  /** „Teraz" — na odfiltrovanie minulosti (injektovateľné kvôli testom). */
  now?: Date;
  /** Minimálny predstih pred „teraz" v minútach (napr. neísť na o 5 minút). */
  minLeadMin?: number;
  /** Časové pásmo prevádzky (predvolene Europe/Bratislava). */
  timeZone?: string;
}

// ── Časové pásmo ────────────────────────────────────────────────────────────

/** Offset (ms), ktorý treba pripočítať k UTC, aby vznikol nástenný čas v `tz`. */
function tzOffsetMs(instant: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const map: Record<string, number> = {};
  for (const p of dtf.formatToParts(instant)) {
    if (p.type !== "literal") map[p.type] = Number(p.value);
  }
  const asUtc = Date.UTC(map.year, map.month - 1, map.day, map.hour, map.minute, map.second);
  return asUtc - instant.getTime();
}

/**
 * Nástenný čas v pásme `tz` (pre daný dátum) → UTC instant.
 * Dvojpriechodová korekcia zvládne aj prechod letný/zimný čas.
 */
function zonedWallTimeToUtc(
  year: number,
  month: number,
  day: number,
  minutes: number,
  timeZone: string,
): number {
  const naiveUtc = Date.UTC(year, month - 1, day, Math.floor(minutes / 60), minutes % 60);
  let ts = naiveUtc - tzOffsetMs(new Date(naiveUtc), timeZone);
  ts = naiveUtc - tzOffsetMs(new Date(ts), timeZone);
  return ts;
}

function parseTimeToMinutes(t: string): number {
  const [h, m] = t.split(":");
  return Number(h) * 60 + Number(m);
}

function toMs(v: string | Date): number {
  return (v instanceof Date ? v : new Date(v)).getTime();
}

// ── Jadro ───────────────────────────────────────────────────────────────────

/**
 * Vráti voľné začiatky slotov (ISO reťazce v UTC), zoradené vzostupne.
 *
 * Postup: z `availability` pre deň v týždni vygeneruje kandidátov krokom
 * `slot_step_min`; každý obsadí blok `duration_min + buffer_min`. Odfiltruje tie,
 * čo (a) nevojdú do okna, (b) sa prekrývajú s rezerváciou/blackoutom, (c) sú
 * v minulosti (< now + minLeadMin).
 */
export function computeFreeSlots(args: ComputeFreeSlotsArgs): string[] {
  const { service, availability, bookings, blackouts, date } = args;
  const timeZone = args.timeZone ?? DEFAULT_TIME_ZONE;
  const now = args.now ?? new Date();
  const earliest = now.getTime() + (args.minLeadMin ?? 0) * MS_PER_MIN;

  const [year, month, day] = date.split("-").map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();

  const totalMs = (service.duration_min + (service.buffer_min ?? 0)) * MS_PER_MIN;
  const stepMin =
    service.slot_step_min && service.slot_step_min > 0
      ? service.slot_step_min
      : service.duration_min;
  const stepMs = stepMin * MS_PER_MIN;

  const busy = [...bookings, ...blackouts].map((iv) => ({
    start: toMs(iv.start),
    end: toMs(iv.end),
  }));

  const starts = new Set<number>();
  for (const w of availability) {
    if (w.weekday !== weekday) continue;
    const wStart = zonedWallTimeToUtc(year, month, day, parseTimeToMinutes(w.start_time), timeZone);
    const wEnd = zonedWallTimeToUtc(year, month, day, parseTimeToMinutes(w.end_time), timeZone);
    for (let s = wStart; s + totalMs <= wEnd; s += stepMs) {
      const e = s + totalMs;
      if (s < earliest) continue;
      if (busy.some((b) => s < b.end && b.start < e)) continue;
      starts.add(s);
    }
  }

  return [...starts].sort((a, b) => a - b).map((s) => new Date(s).toISOString());
}

/** Koniec slotu (ISO UTC) = začiatok + duration + buffer. Na zápis rezervácie. */
export function slotEndIso(startIso: string, service: BookingService): string {
  const totalMs = (service.duration_min + (service.buffer_min ?? 0)) * MS_PER_MIN;
  return new Date(new Date(startIso).getTime() + totalMs).toISOString();
}
