"use client";

/**
 * Konfigurátor kytice — funkčné jadro (K0). Klientský stav: počty kvetov +
 * filter podľa príležitosti. Súčet ceny beží naživo. „Hotová kytica“ vytvorí
 * odkaz na kontakt-formulár s predvyplneným typom a textovým zhrnutím
 * (`?typ=kytica&zhrnutie=…`) — žiadna duplicita objednávkovej logiky.
 *
 * Bez Kláry a bez vizuálneho skladania kytice (PNG výrezy + motion) — tie sú
 * K1–K3. Dáta prichádzajú z `content.ts` (numerická cena/ks), pripravené na
 * neskoršiu výmenu zdroja (Directus/Woo) bez zásahu do tohto komponentu.
 */
import Link from "next/link";
import { useMemo, useState } from "react";
import { href } from "../base";
import {
  type Prilezitost,
  konfiguratorFarby,
  konfiguratorKvety,
  konfiguratorObsah,
  konfiguratorPrilezitosti,
  prilezitostLabel,
  sezonaLabel,
} from "../content";
import { KyticaVizual } from "./kytica-vizual";
import { Eyebrow } from "./ui";

const eur = new Intl.NumberFormat("sk-SK", { style: "currency", currency: "EUR" });

type FilterHodnota = Prilezitost | "vsetky";

export function Konfigurator() {
  const t = konfiguratorObsah;
  const [pocty, setPocty] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState<FilterHodnota>("vsetky");

  const zmen = (id: string, delta: number) =>
    setPocty((p) => {
      const dalej = Math.max(0, (p[id] ?? 0) + delta);
      const zvysok = { ...p };
      if (dalej === 0) delete zvysok[id];
      else zvysok[id] = dalej;
      return zvysok;
    });

  const viditelne = useMemo(
    () =>
      filter === "vsetky"
        ? konfiguratorKvety
        : konfiguratorKvety.filter((k) => k.prilezitosti.includes(filter)),
    [filter],
  );

  const vybrane = useMemo(
    () => konfiguratorKvety.filter((k) => (pocty[k.id] ?? 0) > 0),
    [pocty],
  );
  const stonky = vybrane.reduce((s, k) => s + pocty[k.id], 0);
  const spolu = vybrane.reduce((s, k) => s + pocty[k.id] * k.cenaZaKs, 0);

  const zhrnutieText =
    "Kytica z konfigurátora:\n" +
    vybrane.map((k) => `• ${pocty[k.id]}× ${k.nazov}`).join("\n") +
    `\nSpolu ${stonky} ${stonky === 1 ? "stonka" : stonky < 5 ? "stonky" : "stoniek"}, orientačne ${eur.format(spolu)}.`;

  const objednavkaHref = href(
    `/kontakt?typ=${t.objednavkaTyp}&zhrnutie=${encodeURIComponent(zhrnutieText)}`,
  );

  return (
    <section className="bg-flora-paper py-flora-section">
      <div className="mx-auto grid w-full max-w-[1200px] items-start gap-10 px-flora-gutter lg:grid-cols-[1fr_360px] lg:gap-14">
        {/* Ľavý stĺpec — filter + mriežka kvetov */}
        <div>
          <Eyebrow>{t.filterEyebrow}</Eyebrow>
          <div role="group" aria-label={t.filterEyebrow} className="mt-4 flex flex-wrap gap-2.5">
            <FilterChip aktivny={filter === "vsetky"} onClick={() => setFilter("vsetky")}>
              {t.filterVsetky}
            </FilterChip>
            {konfiguratorPrilezitosti.map((p) => (
              <FilterChip key={p} aktivny={filter === p} onClick={() => setFilter(p)}>
                {prilezitostLabel[p]}
              </FilterChip>
            ))}
          </div>
          <p className="mt-3 text-flora-small text-flora-moss">{t.filterPomoc}</p>

          {viditelne.length === 0 ? (
            <p className="mt-10 rounded-flora-md border border-flora-line bg-flora-porcelain p-6 text-flora-body text-flora-moss">
              {t.prazdnyFilter}
            </p>
          ) : (
            <ul className="mt-8 grid gap-5 sm:grid-cols-2">
              {viditelne.map((k) => {
                const farba = konfiguratorFarby[k.farba];
                const pocet = pocty[k.id] ?? 0;
                return (
                  <li
                    key={k.id}
                    className="flex items-center gap-4 rounded-flora-md border border-flora-line bg-flora-porcelain p-4 shadow-flora-card"
                  >
                    <span
                      aria-hidden="true"
                      className="h-11 w-11 shrink-0 rounded-flora-pill"
                      style={{
                        backgroundColor: farba.hex,
                        boxShadow: farba.svetla ? "inset 0 0 0 1px var(--color-flora-line)" : undefined,
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[1.0625rem] font-flora-display font-medium text-flora-ink">{k.nazov}</h3>
                      <p className="text-flora-small text-flora-moss">
                        {farba.label} · {sezonaLabel[k.sezona]}
                      </p>
                      <p className="text-flora-small font-semibold text-flora-clay-600">
                        {eur.format(k.cenaZaKs)} <span className="font-normal text-flora-moss">{t.cenaZaKs}</span>
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Krok
                        onClick={() => zmen(k.id, -1)}
                        disabled={pocet === 0}
                        label={`${t.uber} ${k.nazov}`}
                      >
                        −
                      </Krok>
                      <span
                        className="min-w-[2ch] text-center text-flora-body font-semibold tabular-nums text-flora-ink"
                        aria-hidden="true"
                      >
                        {pocet}
                      </span>
                      <Krok onClick={() => zmen(k.id, 1)} label={`${t.pridaj} ${k.nazov}`}>
                        +
                      </Krok>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Pravý stĺpec — živý vizuál kytice + súhrn */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
          {/* Vizuál skladanej kytice — reaguje na výber okamžite a deterministicky */}
          <div className="rounded-flora-lg border border-flora-line bg-flora-sand p-4 shadow-flora-card sm:p-5">
            <Eyebrow>{t.nahlad.eyebrow}</Eyebrow>
            <div className="mt-3">
              <KyticaVizual pocty={pocty} />
            </div>
          </div>

          <div className="rounded-flora-lg border border-flora-line bg-flora-porcelain p-6 shadow-flora-card sm:p-7">
            <h2 className="text-flora-h3 font-flora-display font-medium text-flora-ink">{t.suhrn.nadpis}</h2>

            <div aria-live="polite">
              {vybrane.length === 0 ? (
                <p className="mt-4 text-flora-body text-flora-moss">{t.suhrn.prazdne}</p>
              ) : (
                <>
                  <ul className="mt-5 flex flex-col divide-y divide-flora-line border-y border-flora-line">
                    {vybrane.map((k) => (
                      <li key={k.id} className="flex items-baseline justify-between gap-3 py-2.5">
                        <span className="text-flora-body text-flora-ink">
                          <span className="font-semibold tabular-nums">{pocty[k.id]}×</span> {k.nazov}
                        </span>
                        <span className="whitespace-nowrap text-flora-small font-semibold text-flora-clay-600">
                          {eur.format(pocty[k.id] * k.cenaZaKs)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-flora-small text-flora-moss">
                    {stonky} {t.suhrn.stonky}
                  </p>
                  <div className="mt-1 flex items-baseline justify-between gap-3">
                    <span className="text-flora-body font-medium text-flora-ink">{t.suhrn.spolu}</span>
                    <span className="text-[1.5rem] font-flora-display text-flora-clay-600">{eur.format(spolu)}</span>
                  </div>
                </>
              )}
            </div>

            <p className="mt-5 text-flora-small text-flora-moss">{t.suhrn.poznamka}</p>

            {vybrane.length > 0 ? (
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={objednavkaHref}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-flora-pill bg-flora-clay-600 px-7 text-[15px] font-semibold text-white transition duration-150 ease-flora hover:bg-flora-clay-700 active:scale-[0.97]"
                >
                  {t.suhrn.cta}
                </Link>
                <button
                  type="button"
                  onClick={() => setPocty({})}
                  className="text-flora-small font-medium text-flora-moss underline decoration-1 underline-offset-4 transition hover:text-flora-ink"
                >
                  {t.suhrn.vycistit}
                </button>
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </section>
  );
}

/** Filtračná pilulka (prepínač príležitosti). */
function FilterChip({
  aktivny,
  onClick,
  children,
}: {
  aktivny: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={aktivny}
      className={`inline-flex min-h-[40px] items-center rounded-flora-pill border px-4 text-flora-small font-semibold transition duration-150 ease-flora ${
        aktivny
          ? "border-flora-clay-600 bg-flora-clay-600 text-white"
          : "border-flora-line bg-flora-porcelain text-flora-700 hover:border-flora-500"
      }`}
    >
      {children}
    </button>
  );
}

/** Krokovacie tlačidlo (+/−) s prístupným popisom a dotykovým cieľom 44 px. */
function Krok({
  onClick,
  disabled = false,
  label,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-flora-pill border border-flora-line bg-flora-paper text-[1.25rem] leading-none text-flora-ink transition duration-150 ease-flora hover:border-flora-clay-600 hover:text-flora-clay-600 active:scale-[0.94] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-flora-line disabled:hover:text-flora-ink"
    >
      {children}
    </button>
  );
}
