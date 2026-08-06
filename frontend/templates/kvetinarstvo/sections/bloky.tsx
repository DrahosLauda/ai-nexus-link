/**
 * Textové/štruktúrne bloky opakované naprieč stránkami (data-driven).
 * Bez obrázkov — nesú ich rytmus a hierarchia nadpisov.
 */
import Link from "next/link";
import { href } from "../base";
import type { CenovaUroven, Kategoria, Krok, Otazka, Referencia, Sluzba } from "../content";
import { Cta } from "./ui";

/** Editorial zoznam služeb 01–05 (nie mriežka kariet). Celý riadok je odkaz. */
export function SluzbyZoznam({ sluzby }: { sluzby: Sluzba[] }) {
  return (
    <ul className="mt-10 border-t border-flora-line">
      {sluzby.map((s) => (
        <li key={s.cislo} className="border-b border-flora-line">
          <Link
            href={href(s.href)}
            className="group flex items-start gap-5 py-6 sm:gap-8 sm:py-7"
          >
            <span className="text-flora-small font-semibold tabular-nums text-flora-clay-600">{s.cislo}</span>
            <span className="flex flex-1 flex-col gap-1.5">
              <span className="text-flora-h3 font-flora-display font-medium text-flora-ink">{s.nazov}</span>
              <span className="max-w-[62ch] text-flora-body text-flora-moss">{s.popis}</span>
            </span>
            <span
              aria-hidden="true"
              className="mt-1 text-flora-clay-600 transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Kroky procesu (číslované). Domov, Svadby, Obchod. */
export function Kroky({ kroky }: { kroky: Krok[] }) {
  return (
    <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {kroky.map((k) => (
        <li key={k.cislo} className="flex flex-col gap-3">
          <span className="font-flora-display text-[2.5rem] leading-none text-flora-clay-400">{k.cislo}</span>
          <h3 className="text-flora-h3 font-flora-display font-medium text-flora-ink">{k.nazov}</h3>
          <p className="text-flora-body text-flora-moss">{k.popis}</p>
        </li>
      ))}
    </ol>
  );
}

/** Referencie ako pull-quotes (Fraunces italic). Bez hviezdičiek a carouselu. */
export function Referencie({ referencie, tmava = false }: { referencie: Referencia[]; tmava?: boolean }) {
  return (
    <ul className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
      {referencie.map((r) => (
        <li key={r.meno}>
          <figure className="flex h-full flex-col gap-4">
            <blockquote
              className={`font-flora-display text-[1.375rem] italic leading-snug ${tmava ? "text-flora-paper" : "text-flora-ink"}`}
            >
              „{r.citat}“
            </blockquote>
            <figcaption className={`mt-auto text-flora-small ${tmava ? "text-flora-mist" : "text-flora-moss"}`}>
              <span className="font-semibold">{r.meno}</span> · {r.prilezitost}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

/** Kategórie ponuky ako rovnocenné karty s cenou „od…". `idMap` doplní kotvy. */
export function KategorieKarty({
  kategorie,
  idMap = {},
}: {
  kategorie: Kategoria[];
  idMap?: Record<string, string>;
}) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {kategorie.map((k) => (
        <li
          key={k.nazov}
          id={idMap[k.nazov]}
          className="flex scroll-mt-24 flex-col rounded-flora-lg bg-flora-porcelain p-6 shadow-flora-card sm:p-8"
        >
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-flora-h3 font-flora-display font-medium text-flora-ink">{k.nazov}</h3>
            <span className="whitespace-nowrap text-[15px] font-semibold text-flora-clay-600">{k.cena}</span>
          </div>
          <p className="mt-2 flex-1 text-flora-body text-flora-moss">{k.popis}</p>
          <div className="mt-5">
            <Cta k={k.href} variant="ghost">
              Objednať
            </Cta>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Cenové úrovne (svadby) — 3 karty s cenou „od…". */
export function CenoveUrovne({ urovne }: { urovne: CenovaUroven[] }) {
  return (
    <ul className="grid gap-6 lg:grid-cols-3">
      {urovne.map((u) => (
        <li key={u.nazov} className="flex flex-col gap-3 rounded-flora-lg border border-flora-line bg-flora-porcelain p-6 sm:p-8">
          <h3 className="text-flora-h3 font-flora-display font-medium text-flora-ink">{u.nazov}</h3>
          <span className="text-[1.75rem] font-flora-display text-flora-clay-600">{u.cena}</span>
          <p className="text-flora-body text-flora-moss">{u.popis}</p>
        </li>
      ))}
    </ul>
  );
}

/** FAQ — natívne `<details>` (ovládateľné klávesnicou). */
export function Faq({ otazky }: { otazky: Otazka[] }) {
  return (
    <div className="mx-auto max-w-[760px] divide-y divide-flora-line border-y border-flora-line">
      {otazky.map((o) => (
        <details key={o.otazka} className="group py-2">
          <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-4 py-2 text-flora-ink marker:content-none">
            <span className="text-[1.0625rem] font-medium">{o.otazka}</span>
            <span aria-hidden="true" className="text-flora-clay-600 transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="max-w-[68ch] pb-3 text-flora-body text-flora-moss">{o.odpoved}</p>
        </details>
      ))}
    </div>
  );
}

/** CTA pás — jedna veta + 1–2 tlačidlá. Podklad clay alebo night. */
export function CtaPas({
  text,
  primar,
  sekundar,
  podklad = "clay",
}: {
  text: string;
  primar: { label: string; href: string };
  sekundar?: { label: string; href: string };
  podklad?: "clay" | "night";
}) {
  const naTmavej = podklad === "night";
  return (
    <section className={naTmavej ? "bg-flora-900" : "bg-flora-clay-600"}>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-start gap-6 px-flora-gutter py-flora-section-sm md:flex-row md:items-center md:justify-between">
        <p className="max-w-[42ch] text-flora-h3 font-flora-display font-medium text-flora-paper">{text}</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={href(primar.href)}
            className={`inline-flex min-h-[48px] items-center rounded-flora-pill px-7 text-[15px] font-semibold transition-colors ${
              naTmavej ? "bg-flora-clay-600 text-white hover:bg-flora-clay-700" : "bg-flora-paper text-flora-900 hover:bg-white"
            }`}
          >
            {primar.label}
          </Link>
          {sekundar ? (
            <Link
              href={href(sekundar.href)}
              className="inline-flex min-h-[48px] items-center rounded-flora-pill border border-white/50 px-7 text-[15px] font-semibold text-flora-paper transition-colors hover:bg-white/10"
            >
              {sekundar.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
