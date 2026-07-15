"use client";

import { useState } from "react";

type Selection = "classic" | "headless";

const BARS: Record<Selection, { technika: number; obsah: number }> = {
  classic: { technika: 70, obsah: 30 },
  headless: { technika: 10, obsah: 90 },
};

const QUOTES: Record<Selection, string> = {
  classic: "Klasický WordPress vás núti riešiť aktualizácie a konflikty pluginov namiesto obsahu.",
  headless: "AI Nexus Link automatizuje techniku aj obsah, takže sa sústredíte len na rast.",
};

export default function ComparisonSection() {
  const [selected, setSelected] = useState<Selection>("headless");
  const bars = BARS[selected];

  return (
    <section id="problem" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Prečo klasický web nakoniec stojí viac?</h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
            Klasický WordPress vyžaduje neustálu údržbu pluginov. Headless architektúra AI Nexus Link oddelí
            obsah od zobrazenia a AI agenti prevezmú opakujúcu sa prácu.
          </p>
        </div>

        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => setSelected("classic")}
              className={`w-full cursor-pointer rounded-2xl border bg-white p-6 text-left shadow-sm transition-all duration-300 hover:shadow-md ${
                selected === "classic" ? "border-red-300 shadow-xl" : "border-gray-100 opacity-60"
              }`}
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-2xl">⚠️</div>
                <h3 className="text-xl font-bold text-gray-800">Klasický WordPress web</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2 text-red-500">✖</span> Pomalé načítanie kvôli desiatkam pluginov
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-500">✖</span> Ručné písanie a publikovanie obsahu
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-500">✖</span> Manuálna SEO optimalizácia
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-500">✖</span> Bezpečnostné diery a nutnosť aktualizácií
                </li>
              </ul>
            </button>

            <button
              type="button"
              onClick={() => setSelected("headless")}
              className={`w-full origin-left cursor-pointer rounded-2xl border-2 bg-white p-6 text-left shadow-sm transition-all duration-300 ${
                selected === "headless" ? "scale-105 border-blue-500 shadow-xl" : "border-gray-100 opacity-60"
              }`}
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl">✅</div>
                <h3 className="text-xl font-bold text-gray-800">AI Nexus Link (headless + AI)</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✔</span> Next.js frontend s bleskovým načítaním
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✔</span> AI agenti generujú a optimalizujú obsah
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✔</span> WordPress ostáva len ako headless CMS
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✔</span> Automatizovaná starostlivosť o e-commerce
                </li>
              </ul>
            </button>
          </div>

          <div className="flex h-full flex-col justify-center rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
            <h4 className="mb-2 text-lg font-semibold uppercase tracking-wide text-blue-600">Analýza efektivity</h4>
            <p className="mb-8 text-2xl font-bold text-gray-800">{QUOTES[selected]}</p>

            <div className="space-y-5">
              <div>
                <div className="mb-1 flex justify-between text-sm text-gray-500">
                  <span>Čas na technike</span>
                  <span>{bars.technika}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-red-400 transition-all duration-500"
                    style={{ width: `${bars.technika}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm text-gray-500">
                  <span>Čas na obsahu a raste</span>
                  <span>{bars.obsah}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${bars.obsah}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="mt-6 text-center text-sm text-gray-400">Rozdelenie času medzi údržbou a rastom</p>
          </div>
        </div>
      </div>
    </section>
  );
}
