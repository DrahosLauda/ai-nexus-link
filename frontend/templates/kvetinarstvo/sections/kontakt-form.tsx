"use client";

import { useEffect, useId, useRef, useState } from "react";
import { contactTypyObjednavky } from "../content";

/**
 * Objednávkový formulár. Prístupný (viditeľné labely, `autocomplete`, chyby
 * textom aj farbou, aria-live potvrdenie). Polia sú v statickom HTML aj bez JS
 * (žiadny Suspense/`useSearchParams` gating) — progresívne vylepšenie.
 *
 * Predvyplnenie typu z `?typ=` (odkazy z menín a CTA) rieši malý `useEffect`,
 * ktorý po načítaní prečíta `window.location.search` a nastaví neriadený
 * `<select>`; `defaultValue` ostáva prvá hodnota, takže bez JS je pole platné.
 * V M2a sa formulár neodosiela (demo) — napojenie na lead/booking je M3.
 */
export function KontaktForm() {
  const zoznam = contactTypyObjednavky;
  const [odoslane, setOdoslane] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);
  const uid = useId();

  useEffect(() => {
    const typ = new URLSearchParams(window.location.search).get("typ");
    if (typ && selectRef.current && zoznam.some((t) => t.hodnota === typ)) {
      selectRef.current.value = typ;
    }
  }, [zoznam]);

  if (odoslane) {
    return (
      <div
        role="status"
        className="rounded-flora-lg border border-flora-line bg-flora-porcelain p-6 text-flora-body text-flora-moss sm:p-8"
      >
        <p className="text-flora-h3 font-flora-display text-flora-ink">Ďakujeme za dopyt.</p>
        <p className="mt-2 max-w-[52ch]">
          Toto je ukážková šablóna, preto sa formulár zatiaľ neodosiela. Na reálnom webe by vám objednávka
          prišla do schránky ateliéru a ozveme sa vám späť.
        </p>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        setOdoslane(true);
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Pole id={`${uid}-meno`} label="Meno a priezvisko" autoComplete="name" required />
        <Pole id={`${uid}-kontakt`} label="Telefón alebo e-mail" autoComplete="off" required />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor={`${uid}-typ`} className="text-flora-small font-medium text-flora-ink">
            Typ objednávky
          </label>
          <select
            ref={selectRef}
            id={`${uid}-typ`}
            name="typ"
            defaultValue={zoznam[0].hodnota}
            className="min-h-[48px] rounded-flora-sm border border-flora-line bg-flora-porcelain px-3.5 text-flora-body text-flora-ink"
          >
            {zoznam.map((t) => (
              <option key={t.hodnota} value={t.hodnota}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <Pole id={`${uid}-termin`} label="Termín (nepovinné)" type="date" autoComplete="off" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${uid}-sprava`} className="text-flora-small font-medium text-flora-ink">
          Vaša predstava
        </label>
        <textarea
          id={`${uid}-sprava`}
          name="sprava"
          rows={4}
          required
          className="rounded-flora-sm border border-flora-line bg-flora-porcelain px-3.5 py-3 text-flora-body text-flora-ink"
          placeholder="Príležitosť, farby, rozpočet, miesto doručenia…"
        />
      </div>

      <div>
        <button
          type="submit"
          className="inline-flex min-h-[48px] items-center rounded-flora-pill bg-flora-clay-600 px-7 text-[15px] font-semibold text-white transition-colors hover:bg-flora-clay-700"
        >
          Odoslať dopyt
        </button>
      </div>
    </form>
  );
}

function Pole({
  id,
  label,
  type = "text",
  autoComplete,
  required = false,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-flora-small font-medium text-flora-ink">
        {label}
        {required ? <span className="text-flora-clay-600"> *</span> : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="min-h-[48px] rounded-flora-sm border border-flora-line bg-flora-porcelain px-3.5 text-flora-body text-flora-ink"
      />
    </div>
  );
}
