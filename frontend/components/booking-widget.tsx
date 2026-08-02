"use client";

import { useEffect, useState } from "react";

/**
 * Rezervačný widget — prvé živé demo rezervačného agenta (Krok R1).
 *
 * Tok: služba → deň → voľné termíny → kontakt → potvrdenie. Logiku slotov aj
 * zápis rieši backend (/api/booking/*), tu je len prístupné, mobilné UI v štýle
 * webu (svetlý, indigo akcent). Časy zobrazuje backend v Europe/Bratislava.
 */

interface ServiceView {
  id: number;
  name: string;
  duration_min: number;
  description: string | null;
}
interface Slot {
  start: string; // ISO UTC
  label: string; // napr. "9:00" v Bratislave
}

const TZ = "Europe/Bratislava";

/** Dnešný dátum v pásme prevádzky ("YYYY-MM-DD") pre min. hodnotu kalendára. */
function todayInTz(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

const cardClasses =
  "rounded-[20px] border border-line bg-white p-6 shadow-[0_8px_28px_rgba(23,23,50,0.05)] sm:p-8";
const inputClasses =
  "w-full rounded-[10px] border border-line bg-white px-4 py-[13px] text-[15px] text-ink placeholder:text-mist-400 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";
const labelClasses = "text-[13px] font-semibold text-mist-700";

export function BookingWidget() {
  const [services, setServices] = useState<ServiceView[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [serviceId, setServiceId] = useState<number | null>(null);
  const [date, setDate] = useState("");

  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Slot | null>(null);

  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmedLabel, setConfirmedLabel] = useState("");

  const service = services?.find((s) => s.id === serviceId) ?? null;

  // Katalóg služieb pri načítaní.
  useEffect(() => {
    let alive = true;
    fetch("/api/booking/slots")
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (d.ok) setServices(d.services);
        else setLoadError(d.error ?? "Služby sa nepodarilo načítať.");
      })
      .catch(() => alive && setLoadError("Služby sa nepodarilo načítať."));
    return () => {
      alive = false;
    };
  }, []);

  // Voľné termíny pri zmene služby alebo dňa. Resety aj fetch sú vo vnorenej
  // funkcii (nie priamo v tele efektu) — React 19 nemá rád synchronný setState.
  useEffect(() => {
    let alive = true;
    const run = async () => {
      setSelected(null);
      setSlots(null);
      setSlotsError(null);
      if (!serviceId || !date) return;
      setSlotsLoading(true);
      try {
        const res = await fetch(`/api/booking/slots?service=${serviceId}&date=${date}`);
        const d = await res.json();
        if (!alive) return;
        if (d.ok) setSlots(d.slots);
        else setSlotsError(d.error ?? "Termíny sa nepodarilo načítať.");
      } catch {
        if (alive) setSlotsError("Termíny sa nepodarilo načítať.");
      } finally {
        if (alive) setSlotsLoading(false);
      }
    };
    run();
    return () => {
      alive = false;
    };
  }, [serviceId, date]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected || !service) return;
    const data = new FormData(e.currentTarget);
    setStatus("sending");
    setFormError(null);

    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: service.id,
          date,
          start: selected.start,
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          phone: String(data.get("phone") ?? "") || undefined,
          note: String(data.get("note") ?? "") || undefined,
          website: String(data.get("website") ?? "") || undefined, // honeypot
        }),
      });
      const d = await res.json().catch(() => null);
      if (res.ok && d?.ok) {
        setConfirmedLabel(`${service.name} — ${dateLabel(date)} o ${selected.label}`);
        setStatus("done");
        return;
      }
      // 409 = medzičasom obsadené → uvoľníme výber a obnovíme termíny.
      if (res.status === 409) {
        setSelected(null);
        refreshSlots(service.id, date, setSlots, setSlotsError, setSlotsLoading);
      }
      setFormError(d?.error ?? "Rezerváciu sa nepodarilo dokončiť. Skúste to prosím znova.");
      setStatus("idle");
    } catch {
      setFormError("Rezerváciu sa nepodarilo dokončiť. Skontrolujte pripojenie a skúste znova.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className={cardClasses}>
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="grid size-12 place-items-center rounded-full bg-emerald-50 text-2xl">
            ✅
          </div>
          <h2 className="text-xl font-bold text-ink">Rezervácia je potvrdená</h2>
          <p className="text-[15px] text-mist-500">{confirmedLabel}</p>
          <p className="text-[13.5px] text-mist-400">
            Potvrdenie sme vám poslali e-mailom. Ak potrebujete termín zmeniť,
            odpovedzte naň.
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={cardClasses}>
        <p role="alert" className="text-[15px] text-red-500">
          {loadError}
        </p>
      </div>
    );
  }

  return (
    <div className={`${cardClasses} flex flex-col gap-6`}>
      {/* 1) Služba */}
      <fieldset className="flex flex-col gap-2.5">
        <legend className={`${labelClasses} mb-1`}>1. Vyberte službu</legend>
        {!services ? (
          <p className="text-[14px] text-mist-400">Načítavam služby…</p>
        ) : services.length === 0 ? (
          <p className="text-[14px] text-mist-400">Momentálne nie sú dostupné žiadne služby.</p>
        ) : (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {services.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={serviceId === s.id}
                onClick={() => setServiceId(s.id)}
                className={`rounded-[12px] border p-4 text-left transition-colors ${
                  serviceId === s.id
                    ? "border-indigo-400 bg-indigo-50/60 ring-2 ring-indigo-100"
                    : "border-line bg-white hover:border-indigo-300"
                }`}
              >
                <span className="block text-[15px] font-semibold text-ink">{s.name}</span>
                <span className="mt-0.5 block text-[13px] text-mist-400">
                  {s.duration_min} min{s.description ? ` · ${s.description}` : ""}
                </span>
              </button>
            ))}
          </div>
        )}
      </fieldset>

      {/* 2) Deň */}
      {serviceId && (
        <div className="flex flex-col gap-2">
          <label htmlFor="booking-date" className={labelClasses}>
            2. Vyberte deň
          </label>
          <input
            id="booking-date"
            type="date"
            min={todayInTz()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`${inputClasses} max-w-[220px]`}
          />
        </div>
      )}

      {/* 3) Termíny */}
      {serviceId && date && (
        <div className="flex flex-col gap-2.5" aria-live="polite">
          <span className={labelClasses}>3. Vyberte termín</span>
          {slotsLoading ? (
            <p className="text-[14px] text-mist-400">Načítavam voľné termíny…</p>
          ) : slotsError ? (
            <p role="alert" className="text-[14px] text-red-500">
              {slotsError}
            </p>
          ) : slots && slots.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {slots.map((slot) => (
                <button
                  key={slot.start}
                  type="button"
                  aria-pressed={selected?.start === slot.start}
                  onClick={() => setSelected(slot)}
                  className={`rounded-[10px] border px-2 py-2.5 text-[14px] font-semibold transition-colors ${
                    selected?.start === slot.start
                      ? "border-indigo-500 bg-indigo-500 text-white"
                      : "border-line bg-white text-ink hover:border-indigo-300"
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-[14px] text-mist-400">
              V tento deň nie sú voľné termíny. Skúste iný deň.
            </p>
          )}
        </div>
      )}

      {/* 4) Kontakt */}
      {selected && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 border-t border-line pt-5">
          <span className={labelClasses}>4. Vaše údaje</span>
          <input name="name" required placeholder="Meno a priezvisko *" className={inputClasses} />
          <input
            type="email"
            name="email"
            required
            placeholder="E-mail *"
            className={inputClasses}
          />
          <input type="tel" name="phone" placeholder="Telefón" className={inputClasses} />
          <textarea
            name="note"
            rows={2}
            placeholder="Poznámka (nepovinné)"
            className={`${inputClasses} resize-none`}
          />
          {/* Honeypot proti robotom — pre ľudí neviditeľné */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          {formError && (
            <p role="alert" className="text-[13.5px] text-red-500">
              {formError}
            </p>
          )}
          <button
            type="submit"
            disabled={status === "sending"}
            className="cursor-pointer rounded-[10px] bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-[15.5px] font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 disabled:cursor-default disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {status === "sending"
              ? "Rezervujem…"
              : `Rezervovať ${dateLabel(date)} o ${selected.label}`}
          </button>
          <p className="text-[12px] text-mist-400">
            Odoslaním súhlasíte so spracovaním údajov na účel rezervácie (GDPR).
          </p>
        </form>
      )}
    </div>
  );
}

/** Ručné znovunačítanie slotov (po 409 konflikte). */
function refreshSlots(
  serviceId: number,
  date: string,
  setSlots: (s: Slot[] | null) => void,
  setSlotsError: (e: string | null) => void,
  setSlotsLoading: (b: boolean) => void,
) {
  setSlotsLoading(true);
  fetch(`/api/booking/slots?service=${serviceId}&date=${date}`)
    .then((r) => r.json())
    .then((d) => (d.ok ? setSlots(d.slots) : setSlotsError(d.error ?? "Termíny sa nepodarilo načítať.")))
    .catch(() => setSlotsError("Termíny sa nepodarilo načítať."))
    .finally(() => setSlotsLoading(false));
}

/** "16. 3. 2026" z "YYYY-MM-DD" (bez posunu pásma — je to čistý dátum). */
function dateLabel(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("sk-SK", {
    timeZone: "UTC",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}
