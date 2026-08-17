"use client";

/**
 * Objednávkový panel detailu kytice — výber veľkosti, živá cena a CTA.
 *
 * Veľkosti sú natívne rádiá (ovládateľné klávesnicou, v HTML aj bez JS je
 * predvolená prvá). CTA odovzdá výber existujúcemu kontakt-formuláru cez
 * `?typ=kytica&zhrnutie=…` — predvyplnenie už rieši `kontakt-form.tsx`,
 * tu sa nič neduplikuje a demo nemá žiadny checkout (predaj je zamknutý).
 */
import Link from "next/link";
import { useId, useState } from "react";
import { href } from "../base";
import { katalogObsah, type Kytica } from "../content";
import { formatujCenu } from "../katalog";

export function KyticaObjednavka({ kytica }: { kytica: Kytica }) {
  const t = katalogObsah.detail;
  const [kod, setKod] = useState(kytica.varianty[0].kod);
  const uid = useId();
  const variant = kytica.varianty.find((v) => v.kod === kod) ?? kytica.varianty[0];

  const zhrnutie =
    `${kytica.nazov} — veľkosť ${variant.nazov} (${variant.stonky} stoniek, ` +
    `priemer ${variant.priemerCm} cm), ${formatujCenu(variant.cena)}.\n` +
    "Termín a spôsob doručenia dohodneme podľa vašich možností.";

  const objednavkaHref = href(
    `/kontakt?typ=${t.objednavkaTyp}&zhrnutie=${encodeURIComponent(zhrnutie)}`,
  );

  return (
    <div className="rounded-flora-lg border border-flora-line bg-flora-porcelain p-6 shadow-flora-card sm:p-7">
      <fieldset>
        <legend className="text-flora-small font-medium text-flora-ink">{t.velkostNadpis}</legend>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
          {kytica.varianty.map((v) => (
            <label
              key={v.kod}
              className="flex cursor-pointer flex-col gap-0.5 rounded-flora-md border border-flora-line bg-flora-paper px-4 py-3 transition duration-150 ease-flora hover:border-flora-500 has-[:checked]:border-flora-clay-600 has-[:checked]:bg-flora-clay-100 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-flora-clay-600"
            >
              <input
                type="radio"
                name={`${uid}-velkost`}
                value={v.kod}
                checked={v.kod === kod}
                onChange={() => setKod(v.kod)}
                className="sr-only"
              />
              <span className="text-flora-body font-medium text-flora-ink">{v.nazov}</span>
              <span className="text-flora-small text-flora-moss">
                {v.stonky} {t.stonky} · {t.priemer} {v.priemerCm} cm
              </span>
              <span className="mt-1 text-flora-small font-semibold text-flora-clay-600">
                {formatujCenu(v.cena)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-flora-line pt-5">
        <span className="text-flora-small text-flora-moss">{t.cenaLabel}</span>
        <span aria-live="polite" className="text-[1.75rem] font-flora-display text-flora-clay-600">
          {formatujCenu(variant.cena)}
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <Link
          href={objednavkaHref}
          className="inline-flex min-h-[48px] items-center justify-center rounded-flora-pill bg-flora-clay-600 px-7 text-[15px] font-semibold text-white transition duration-150 ease-flora hover:bg-flora-clay-700 active:scale-[0.97]"
        >
          {t.cta}
        </Link>
        <p className="text-flora-small text-flora-moss">{t.ctaPoznamka}</p>
        <Link
          href={href(t.poradimeHref)}
          className="text-flora-small font-medium text-flora-clay-600 underline decoration-1 underline-offset-4 transition-colors duration-150 ease-flora hover:text-flora-clay-700"
        >
          {t.poradime}
        </Link>
      </div>
    </div>
  );
}
