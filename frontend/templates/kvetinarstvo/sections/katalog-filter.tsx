"use client";

/**
 * Filtrovateľná mriežka katalógu `/kytice`.
 *
 * Klientský stav drží iba trojicu filtrov (príležitosť / farba / typ väzby);
 * dáta aj filtrovanie prichádzajú z `katalog.ts`, takže po prepnutí zdroja na
 * WooCommerce (E2) sa tento komponent nemení. Bez JS ostane v HTML kompletná
 * mriežka všetkých kytíc — filtre sú progresívne vylepšenie, nie brána k obsahu.
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import { href } from "../base";
import { farbyKvetov, katalogObsah, prilezitostLabel, typLabel } from "../content";
import {
  PRAZDNY_FILTER,
  VSETKY,
  filtrujKytice,
  moznostiFiltra,
  type KatalogFilter,
} from "../katalog";
import { FarebnyBod, KyticeKarty } from "./kytice";
import { Eyebrow } from "./ui";

const MOZNOSTI = moznostiFiltra();

export function KatalogFiltre() {
  const t = katalogObsah.filter;
  const [filter, setFilter] = useState<KatalogFilter>(PRAZDNY_FILTER);
  const kytice = useMemo(() => filtrujKytice(filter), [filter]);
  const aktivny =
    filter.prilezitost !== VSETKY || filter.farba !== VSETKY || filter.typ !== VSETKY;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <Eyebrow>{t.nadpis}</Eyebrow>
        {aktivny ? (
          <button
            type="button"
            onClick={() => setFilter(PRAZDNY_FILTER)}
            className="text-flora-small font-medium text-flora-clay-600 underline decoration-1 underline-offset-4 transition-colors duration-150 ease-flora hover:text-flora-clay-700"
          >
            {t.zrusit}
          </button>
        ) : null}
      </div>

      <div className="mt-5 flex flex-col gap-5">
        <Skupina
          label={t.prilezitost}
          hodnoty={MOZNOSTI.prilezitosti}
          aktivna={filter.prilezitost}
          popis={(p) => prilezitostLabel[p]}
          onZmena={(prilezitost) => setFilter((f) => ({ ...f, prilezitost }))}
        />
        <Skupina
          label={t.farba}
          hodnoty={MOZNOSTI.farby}
          aktivna={filter.farba}
          popis={(f) => farbyKvetov[f]?.label ?? f}
          bod
          onZmena={(farba) => setFilter((f) => ({ ...f, farba }))}
        />
        <Skupina
          label={t.typ}
          hodnoty={MOZNOSTI.typy}
          aktivna={filter.typ}
          popis={(typ) => typLabel[typ]}
          onZmena={(typ) => setFilter((f) => ({ ...f, typ }))}
        />
      </div>

      <p aria-live="polite" className="mt-6 text-flora-small text-flora-moss">
        {t.vysledok(kytice.length)}
      </p>

      <div className="mt-8">
        {kytice.length === 0 ? (
          <p className="max-w-[60ch] rounded-flora-md border border-flora-line bg-flora-porcelain p-6 text-flora-body text-flora-moss">
            {t.prazdne}{" "}
            <Link
              href={href(katalogObsah.cta.primar.href)}
              className="font-medium text-flora-clay-600 underline decoration-1 underline-offset-4 hover:text-flora-clay-700"
            >
              {katalogObsah.cta.primar.label}
            </Link>
          </p>
        ) : (
          <KyticeKarty kytice={kytice} />
        )}
      </div>
    </div>
  );
}

/** Jedna skupina filtra — chip „Všetky" + hodnoty odvodené z dát. */
function Skupina<T extends string>({
  label,
  hodnoty,
  aktivna,
  popis,
  bod = false,
  onZmena,
}: {
  label: string;
  hodnoty: T[];
  aktivna: T | typeof VSETKY;
  popis: (hodnota: T) => string;
  /** Zobraziť farebný bod pred textom (skupina „Farba"). */
  bod?: boolean;
  onZmena: (hodnota: T | typeof VSETKY) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2.5">
      <span className="mr-1 w-full text-flora-small font-medium text-flora-moss sm:w-auto">
        {label}
      </span>
      <Chip aktivny={aktivna === VSETKY} onClick={() => onZmena(VSETKY)}>
        {katalogObsah.filter.vsetky}
      </Chip>
      {hodnoty.map((h) => (
        <Chip key={h} aktivny={aktivna === h} onClick={() => onZmena(h)}>
          {bod ? <FarebnyBod farba={h} velkost={14} /> : null}
          {popis(h)}
        </Chip>
      ))}
    </div>
  );
}

/** Filtračná pilulka — prepínač, preto `aria-pressed`. */
function Chip({
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
      className={`inline-flex min-h-[40px] items-center gap-2 rounded-flora-pill border px-4 text-flora-small font-semibold transition duration-150 ease-flora ${
        aktivny
          ? "border-flora-clay-600 bg-flora-clay-600 text-white"
          : "border-flora-line bg-flora-porcelain text-flora-700 hover:border-flora-500"
      }`}
    >
      {children}
    </button>
  );
}
