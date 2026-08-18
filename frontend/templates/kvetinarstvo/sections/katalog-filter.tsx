"use client";

/**
 * Filter a mriežka katalógu `/kytice`.
 *
 * Dizajnový smer „tichý typografický index": voľby sú obyčajný text v troch
 * riadkoch medzi vlasovými linkami, aktívna je podčiarknutá hlinou — žiadne
 * pilulky, aby filter nesúťažil s fotkami kytíc. Vybrané filtre sa pod blokom
 * zopakujú ako štítky, ktoré sa dajú jedným klikom odobrať (na mobile je aktívna
 * voľba často mimo obrazovky).
 *
 * Klientský stav drží iba trojicu filtrov; dáta aj filtrovanie prichádzajú
 * z `katalog.ts`, takže po prepnutí zdroja na WooCommerce (E2) sa komponent
 * nemení. Bez JS ostane v HTML kompletná mriežka všetkých kytíc — filtre sú
 * progresívne vylepšenie, nie brána k obsahu.
 */
import Link from "next/link";
import { useMemo, useState } from "react";
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

const MOZNOSTI = moznostiFiltra();

/** Kľúče filtra — štítok podľa nich vie, ktorú voľbu má vrátiť na „Všetky". */
type Kluc = keyof KatalogFilter;

export function KatalogFiltre() {
  const t = katalogObsah.filter;
  const [filter, setFilter] = useState<KatalogFilter>(PRAZDNY_FILTER);
  const kytice = useMemo(() => filtrujKytice(filter), [filter]);

  const vycisti = (kluc: Kluc) => setFilter((f) => ({ ...f, [kluc]: VSETKY }));

  const stitky: { kluc: Kluc; label: string }[] = [];
  if (filter.prilezitost !== VSETKY)
    stitky.push({ kluc: "prilezitost", label: prilezitostLabel[filter.prilezitost] });
  if (filter.farba !== VSETKY)
    stitky.push({ kluc: "farba", label: farbyKvetov[filter.farba]?.label ?? filter.farba });
  if (filter.typ !== VSETKY) stitky.push({ kluc: "typ", label: typLabel[filter.typ] });

  return (
    <div>
      <div className="border-y border-flora-line py-1">
        <Riadok
          label={t.prilezitost}
          hodnoty={MOZNOSTI.prilezitosti}
          aktivna={filter.prilezitost}
          popis={(p) => prilezitostLabel[p]}
          onZmena={(prilezitost) => setFilter((f) => ({ ...f, prilezitost }))}
        />
        <Riadok
          label={t.farba}
          hodnoty={MOZNOSTI.farby}
          aktivna={filter.farba}
          popis={(f) => farbyKvetov[f]?.label ?? f}
          bod
          onZmena={(farba) => setFilter((f) => ({ ...f, farba }))}
        />
        <Riadok
          label={t.typ}
          hodnoty={MOZNOSTI.typy}
          aktivna={filter.typ}
          popis={(typ) => typLabel[typ]}
          onZmena={(typ) => setFilter((f) => ({ ...f, typ }))}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1">
        <p aria-live="polite" className="mr-1 text-flora-small text-flora-moss">
          {t.vysledok(kytice.length)}
        </p>
        {stitky.map((s) => (
          <button
            key={s.kluc}
            type="button"
            onClick={() => vycisti(s.kluc)}
            aria-label={t.zrusitJeden(s.label)}
            className="inline-flex min-h-[44px] items-center gap-2.5 rounded-flora-pill bg-flora-100 py-1.5 pl-4 pr-2.5 text-flora-small font-semibold text-flora-700 transition-colors duration-150 ease-flora hover:bg-flora-200"
          >
            {s.label}
            <span
              aria-hidden="true"
              className="grid size-5 place-items-center rounded-flora-pill bg-flora-700/15 text-[13px] leading-none"
            >
              ×
            </span>
          </button>
        ))}
        {stitky.length > 1 ? (
          <button
            type="button"
            onClick={() => setFilter(PRAZDNY_FILTER)}
            className="inline-flex min-h-[44px] items-center text-flora-small font-medium text-flora-moss underline decoration-1 underline-offset-4 transition-colors duration-150 ease-flora hover:text-flora-ink"
          >
            {t.zrusit}
          </button>
        ) : null}
      </div>

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

/** Jeden riadok filtra — popisok vľavo, voľby ako text (chip „Všetky" navrchu). */
function Riadok<T extends string>({
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
  /** Farebný bod pred textom (riadok „Farba"). */
  bod?: boolean;
  onZmena: (hodnota: T | typeof VSETKY) => void;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex flex-wrap items-center gap-x-6 border-t border-flora-line/60 py-1 first:border-t-0"
    >
      <span className="w-full shrink-0 pt-2 text-flora-eyebrow font-semibold uppercase text-flora-500 sm:w-[124px] sm:pt-0">
        {label}
      </span>
      <Volba aktivna={aktivna === VSETKY} onClick={() => onZmena(VSETKY)}>
        {katalogObsah.filter.vsetky}
      </Volba>
      {hodnoty.map((h) => (
        <Volba key={h} aktivna={aktivna === h} onClick={() => onZmena(h)}>
          {bod ? <FarebnyBod farba={h} velkost={13} /> : null}
          {popis(h)}
        </Volba>
      ))}
    </div>
  );
}

/**
 * Jedna voľba — prepínač (`aria-pressed`) v podobe textu. Dotykový cieľ drží
 * `min-h-[44px]`, podčiarknutie nesie vnútorný `span`, aby sedelo pri texte
 * a nie na spodku dotykovej plochy.
 */
function Volba({
  aktivna,
  onClick,
  children,
}: {
  aktivna: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={aktivna}
      className={`inline-flex min-h-[44px] items-center transition-colors duration-150 ease-flora ${
        aktivna ? "text-flora-ink" : "text-flora-moss hover:text-flora-ink"
      }`}
    >
      <span
        className={`inline-flex items-center gap-2 border-b-2 pb-1 ${
          aktivna ? "border-flora-clay-600 font-semibold" : "border-transparent"
        }`}
      >
        {children}
      </span>
    </button>
  );
}
