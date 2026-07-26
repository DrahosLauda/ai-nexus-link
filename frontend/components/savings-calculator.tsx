"use client";

import { useMemo, useState } from "react";

/**
 * Kalkulačka úspory za WordPress pluginy. Návštevník zaškrtne, čo dnes platí;
 * headless riešenie tie funkcie nahrádza frontendom + AI agentmi. Zámerne
 * NEuvádza našu cenu (žiadny cenník) — ukazuje len potenciálnu úsporu.
 */
type Item = { id: string; label: string; note: string; cost: number };

const ITEMS: Item[] = [
  { id: "seo", label: "SEO plugin", note: "napr. Rank Math / Yoast Pro", cost: 8 },
  { id: "cache", label: "Rýchlosť & cache", note: "napr. WP Rocket", cost: 6 },
  { id: "forms", label: "Formuláre", note: "napr. WPForms Pro", cost: 5 },
  { id: "backup", label: "Zálohy", note: "napr. UpdraftPlus Premium", cost: 5 },
  { id: "security", label: "Bezpečnosť", note: "napr. Wordfence Premium", cost: 9 },
  { id: "email", label: "Email marketing", note: "napr. Mailchimp", cost: 13 },
  { id: "booking", label: "Rezervácie", note: "napr. Bookly / Calendly", cost: 10 },
];

const MAX_TOTAL = ITEMS.reduce((s, i) => s + i.cost, 0);
const DEFAULT_ON = new Set(["seo", "cache", "forms", "security"]);

export function SavingsCalculator() {
  const [checked, setChecked] = useState<Set<string>>(new Set(DEFAULT_ON));

  const monthly = useMemo(
    () => ITEMS.filter((i) => checked.has(i.id)).reduce((s, i) => s + i.cost, 0),
    [checked],
  );
  const yearly = monthly * 12;
  const barPct = Math.max(4, Math.round((monthly / MAX_TOTAL) * 100));

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
      {/* Zoznam nástrojov */}
      <div className="flex flex-col gap-3">
        {ITEMS.map((item) => {
          const on = checked.has(item.id);
          return (
            <label
              key={item.id}
              className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border bg-white p-4 transition-colors ${
                on ? "border-indigo-300 ring-1 ring-indigo-200" : "border-line hover:border-mist-400/50"
              }`}
            >
              <span className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(item.id)}
                  className="size-5 accent-indigo-600"
                />
                <span className="flex flex-col">
                  <span className="text-[15px] font-semibold text-ink">
                    {item.label}
                  </span>
                  <span className="text-[12.5px] text-mist-400">{item.note}</span>
                </span>
              </span>
              <span className="shrink-0 text-[14px] font-medium text-mist-500">
                €{item.cost}/mes
              </span>
            </label>
          );
        })}
      </div>

      {/* Výsledok — tmavý panel (akcent, ladí s apertiou) */}
      <div className="flex flex-col gap-6 rounded-3xl bg-ink p-7 text-white shadow-xl sm:p-9">
        <h3 className="text-lg font-semibold text-white">Koľko ušetríte</h3>

        {/* Porovnanie pruhmi */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="mb-1.5 flex justify-between text-[13px] text-fog-400">
              <span>Dnes platíte za pluginy</span>
              <span className="font-semibold text-red-300">€{monthly}/mes</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/[0.08]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-400 to-orange-400 transition-all duration-300"
                style={{ width: `${barPct}%` }}
              />
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex justify-between text-[13px] text-fog-400">
              <span>S headless riešením</span>
              <span className="font-semibold text-emerald-300">v cene</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/[0.08]">
              <div className="h-full w-[4%] rounded-full bg-gradient-to-r from-emerald-400 to-teal-400" />
            </div>
          </div>
        </div>

        <div className="mt-1 rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.08] p-5 text-center">
          <p className="text-[13px] text-fog-300">Ušetríte ročne</p>
          <p className="text-4xl font-extrabold tracking-tight text-emerald-300">
            €{yearly}
          </p>
          <p className="mt-1 text-[12.5px] text-fog-400">
            {monthly === 0
              ? "Zaškrtnite, čo dnes platíte."
              : "…a to sú len licencie. Bez konfliktov, aktualizácií a spomalení."}
          </p>
        </div>
      </div>
    </div>
  );
}
