"use client";

import { useState } from "react";

const TASKS = [
  { id: "clanky", label: "Písanie a publikovanie blogových článkov", hours: 8 },
  { id: "seo", label: "SEO optimalizácia a meta tagy", hours: 6 },
  { id: "pluginy", label: "Aktualizácie a záplaty pluginov", hours: 4 },
  { id: "kosiky", label: "Sledovanie a záchrana opustených košíkov", hours: 5 },
  { id: "monitoring", label: "Manuálny monitoring výkonu obsahu", hours: 3 },
] as const;

const DEFAULT_CHECKED = new Set(["clanky", "seo", "kosiky"]);
const MAX_HOURS = TASKS.reduce((sum, t) => sum + t.hours, 0);

export default function SavingsCalculator() {
  const [checked, setChecked] = useState<Set<string>>(DEFAULT_CHECKED);

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const totalHours = TASKS.filter((t) => checked.has(t.id)).reduce((sum, t) => sum + t.hours, 0);
  const yearlyHours = totalHours * 12;

  return (
    <section id="savings" className="bg-white py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-6 text-4xl font-bold text-gray-900">Koľko času strácate manuálnou správou webu?</h2>
          <p className="mb-8 text-lg text-gray-600">
            Zaškrtnite úlohy, ktoré aktuálne robíte ručne, a zistite, koľko hodín mesačne vám vráti automatizácia
            AI Nexus Link.
          </p>

          <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-6">
            {TASKS.map((task) => (
              <label
                key={task.id}
                className="flex cursor-pointer items-center justify-between rounded-lg bg-white p-3 shadow-sm hover:bg-gray-50"
              >
                <span className="flex items-center">
                  <input
                    type="checkbox"
                    checked={checked.has(task.id)}
                    onChange={() => toggle(task.id)}
                    className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 font-medium text-gray-700">{task.label}</span>
                </span>
                <span className="text-gray-500">{task.hours} h/mes</span>
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-gray-900 p-8 text-white shadow-2xl">
          <h3 className="mb-6 text-2xl font-semibold">Váš mesačný stratený čas</h3>

          <div className="space-y-5">
            <div>
              <div className="mb-1 flex justify-between text-sm text-gray-400">
                <span>Aktuálne (ručne)</span>
                <span>{totalHours} h</span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-gray-800">
                <div
                  className="h-full rounded-full bg-red-400 transition-all duration-500"
                  style={{ width: `${MAX_HOURS === 0 ? 0 : (totalHours / MAX_HOURS) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm text-gray-400">
                <span>S AI Nexus Link</span>
                <span>≈ 0 h</span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-gray-800">
                <div className="h-full w-[3%] rounded-full bg-green-500 transition-all duration-500" />
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-end justify-between border-t border-gray-700 pt-8">
            <div>
              <p className="text-sm text-gray-400">Mesačne stratený čas</p>
              <p className="text-4xl font-bold text-red-400">{totalHours} h</p>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-green-500/50 bg-green-500/20 p-4 text-center">
            {totalHours > 0 ? (
              <span className="text-lg font-bold text-green-400">Ročne ušetríte približne {yearlyHours} hodín</span>
            ) : (
              <span className="text-gray-400">Zaškrtnite aspoň jednu úlohu</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
