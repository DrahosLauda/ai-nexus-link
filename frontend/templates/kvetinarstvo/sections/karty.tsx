/**
 * Vizuálne blokové sekcie postavené na obrazovom placeholderi (arch karty,
 * editorial galéria, tmavý teaser ateliéru). Data-driven z `content.ts`.
 */
import Link from "next/link";
import { href } from "../base";
import type { Kytica } from "../content";
import { homeAtelierTeaser } from "../content";
import { Foto } from "../images/foto";
import { type Odtien } from "../images/placeholder";
import { atelierTeaserFoto } from "../images/media";
import { Eyebrow } from "./ui";

const KARTA_ODTIENE: Odtien[] = ["clay", "sage", "blush", "sand"];

/** Mriežka kytíc ako arch karty (4:5). Používa sezónny výber aj náhľad Obchodu. */
export function KyticeKarty({ kytice, fotky }: { kytice: Kytica[]; fotky?: (string | undefined)[] }) {
  return (
    <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {kytice.map((k, i) => (
        <li key={k.nazov} className="flex flex-col">
          <Foto
            src={fotky?.[i]}
            alt={k.alt}
            pomer="4/5"
            arch
            odtien={KARTA_ODTIENE[i % KARTA_ODTIENE.length]}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="mt-5 flex items-baseline justify-between gap-4">
            <h3 className="text-flora-h3 font-flora-display font-medium text-flora-ink">{k.nazov}</h3>
            <span className="whitespace-nowrap text-[15px] font-semibold text-flora-clay-600">{k.cena}</span>
          </div>
          <p className="mt-1.5 text-flora-small text-flora-moss">{k.kvety}</p>
        </li>
      ))}
    </ul>
  );
}

/** Asymetrická editorial mozaika (mix pomerov + jedna 21:9 na celú šírku). */
export function Galeria({ obrazky, fotky }: { obrazky: { alt: string }[]; fotky?: (string | undefined)[] }) {
  const [a, b, c, d, e, f] = obrazky;
  const odtiene: Odtien[] = ["sage", "clay", "blush", "sand", "paper", "sage"];
  const third = "(max-width: 640px) 100vw, 33vw";
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {a ? <Foto src={fotky?.[0]} alt={a.alt} pomer="3/4" odtien={odtiene[0]} className="sm:row-span-2" sizes={third} /> : null}
        {b ? <Foto src={fotky?.[1]} alt={b.alt} pomer="1/1" odtien={odtiene[1]} sizes={third} /> : null}
        {c ? <Foto src={fotky?.[2]} alt={c.alt} pomer="1/1" odtien={odtiene[2]} sizes={third} /> : null}
        {d ? <Foto src={fotky?.[3]} alt={d.alt} pomer="4/5" odtien={odtiene[3]} sizes={third} /> : null}
        {e ? <Foto src={fotky?.[4]} alt={e.alt} pomer="1/1" odtien={odtiene[4]} sizes={third} /> : null}
      </div>
      {f ? <Foto src={fotky?.[5]} alt={f.alt} pomer="21/9" odtien={odtiene[5]} sizes="100vw" /> : null}
    </div>
  );
}

/** Tmavý „nádych" — teaser ateliéru s fotkou, príbehom a podpisom. */
export function AtelierTeaser() {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <Foto
        src={atelierTeaserFoto}
        alt="Interiér ateliéru Boma Flora v rannom svetle s vedrami rezaných kvetov"
        pomer="4/5"
        arch
        odtien="night"
        className="max-w-[420px]"
        sizes="(max-width: 1024px) 100vw, 420px"
      />
      <div className="flex flex-col gap-5">
        <Eyebrow tmava>{homeAtelierTeaser.eyebrow}</Eyebrow>
        {homeAtelierTeaser.odseky.map((o) => (
          <p key={o} className="text-flora-lead text-flora-mist">
            {o}
          </p>
        ))}
        <p className="font-flora-display text-[1.1rem] italic text-flora-paper">{homeAtelierTeaser.podpis}</p>
        <div>
          <Link
            href={href(homeAtelierTeaser.href)}
            className="inline-flex min-h-[44px] items-center text-[15px] font-semibold text-flora-clay-200 underline decoration-1 underline-offset-4 hover:text-flora-paper"
          >
            {homeAtelierTeaser.odkaz}
          </Link>
        </div>
      </div>
    </div>
  );
}
