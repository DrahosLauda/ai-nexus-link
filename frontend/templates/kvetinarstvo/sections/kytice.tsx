/**
 * Prezentačné diely katalógu kytíc (server-safe, bez stavu): produktová karta
 * a mriežka, prvky dôvery, galéria detailu a zloženie kytice z odrôd.
 *
 * Zámerne bez `"use client"` — komponenty používa server (Domov, detail) aj
 * klientský filter (`katalog-filter.tsx`), takže musia fungovať v oboch.
 * Podpisový tvar šablóny (arch orez fotky) drží katalóg vizuálne pri Boma Flore.
 */
import Image from "next/image";
import Link from "next/link";
import { href } from "../base";
import {
  farbyKvetov,
  katalogObsah,
  nalepkaLabel,
  sezonaLabel,
  type Kytica,
  type KyticaFotka,
} from "../content";
import { Foto } from "../images/foto";
import { odrodaVyrezy } from "../images/media";
import { type Odtien } from "../images/placeholder";
import { cenaOd, formatujCenu, zlozenieKytice } from "../katalog";

/** Striedanie odtieňov placeholderu, nech mriežka bez fotiek nie je uniformná. */
const KARTA_ODTIENE: Odtien[] = ["clay", "sage", "blush", "sand"];

const MRIEZKA_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

/** Farebný bod odtieňa — náhrada fotky odrody a swatch vo filtri farieb. */
export function FarebnyBod({ farba, velkost = 44 }: { farba: string; velkost?: number }) {
  const t = farbyKvetov[farba];
  if (!t) return null;
  const pestra = farba === "pestra";
  return (
    <span
      aria-hidden="true"
      className="inline-block shrink-0 rounded-flora-pill"
      style={{
        width: velkost,
        height: velkost,
        background: pestra
          ? "conic-gradient(#c07856, #e2a0b3, #e3b23c, #6e8b6a, #c07856)"
          : t.hex,
        boxShadow: t.svetla ? "inset 0 0 0 1px var(--color-flora-line)" : undefined,
      }}
    />
  );
}

/** Nálepka na fotke (Najpredávanejšia / Sezónne / Novinka). */
function Nalepka({ kytica }: { kytica: Kytica }) {
  if (!kytica.nalepka) return null;
  return (
    <span className="absolute bottom-4 left-4 rounded-flora-pill bg-flora-paper/95 px-3.5 py-1.5 text-flora-eyebrow font-semibold uppercase text-flora-700 shadow-flora-card backdrop-blur-sm">
      {nalepkaLabel[kytica.nalepka]}
    </span>
  );
}

/** Produktová karta — celá je odkazom na detail kytice. */
export function KyticaKarta({
  kytica,
  odtien,
  sizes = MRIEZKA_SIZES,
}: {
  kytica: Kytica;
  odtien?: Odtien;
  sizes?: string;
}) {
  const foto = kytica.fotky[0];
  return (
    <Link href={href(`/kytice/${kytica.slug}`)} className="group flex h-full flex-col">
      <div className="relative">
        <Foto src={foto.src} alt={foto.alt} pomer="4/5" arch odtien={odtien} hoverZoom sizes={sizes} />
        <Nalepka kytica={kytica} />
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="text-flora-h3 font-flora-display font-medium text-flora-ink transition-colors duration-150 ease-flora group-hover:text-flora-clay-700">
          {kytica.nazov}
        </h3>
        <span className="whitespace-nowrap text-[15px] font-semibold text-flora-clay-600">
          {katalogObsah.karta.cenaOd} {formatujCenu(cenaOd(kytica))}
        </span>
      </div>
      <p className="mt-1.5 text-flora-small text-flora-moss">{kytica.perex}</p>
    </Link>
  );
}

/** Mriežka produktových kariet (Domov, katalóg, „Ďalšie kytice"). */
export function KyticeKarty({ kytice, sizes }: { kytice: Kytica[]; sizes?: string }) {
  return (
    <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {kytice.map((k, i) => (
        <li key={k.slug} className="flex">
          <KyticaKarta kytica={k} odtien={KARTA_ODTIENE[i % KARTA_ODTIENE.length]} sizes={sizes} />
        </li>
      ))}
    </ul>
  );
}

/** Prvky dôvery — čo sa s objednávkou naozaj stane (katalóg aj detail). */
export function PrvkyDovery() {
  return (
    <ul className="grid gap-8 sm:grid-cols-3">
      {katalogObsah.dovera.body.map((b) => (
        <li key={b.nadpis} className="flex flex-col gap-2 border-t border-flora-line pt-4">
          <h3 className="text-[1.0625rem] font-flora-display font-medium text-flora-ink">{b.nadpis}</h3>
          <p className="text-flora-small text-flora-moss">{b.text}</p>
        </li>
      ))}
    </ul>
  );
}

/** Galéria detailu — hlavná fotka v archu, ďalšie uhly pod ňou. */
export function GaleriaKytice({ fotky }: { fotky: KyticaFotka[] }) {
  const [hlavna, ...dalsie] = fotky;
  return (
    <div className="flex flex-col gap-4">
      <Foto
        src={hlavna.src}
        alt={hlavna.alt}
        pomer="4/5"
        arch
        odtien="clay"
        sizes="(max-width: 1024px) 100vw, 46vw"
      />
      {dalsie.length > 0 ? (
        <ul className={`grid gap-4 ${dalsie.length > 1 ? "grid-cols-2" : ""}`}>
          {dalsie.map((f) => (
            <li key={f.alt}>
              <Foto
                src={f.src}
                alt={f.alt}
                pomer={dalsie.length > 1 ? "1/1" : "3/2"}
                odtien="sage"
                sizes={dalsie.length > 1 ? "(max-width: 1024px) 50vw, 23vw" : "(max-width: 1024px) 100vw, 46vw"}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/**
 * „Z čoho ju viažeme" — konkrétne odrody s foto-výrezom (keď ho máme) alebo
 * farebným bodom. Transparentnosť, ktorú bežné kvetinárstva neuvádzajú.
 */
export function ZlozenieKytice({ kytica }: { kytica: Kytica }) {
  return (
    <ul className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
      {zlozenieKytice(kytica).map((o) => {
        const vyrez = odrodaVyrezy[o.id];
        return (
          <li key={o.id} className="flex items-center gap-4">
            {vyrez ? (
              <span className="relative size-14 shrink-0 overflow-hidden rounded-flora-pill bg-flora-sand">
                {/* Výrez je celá stonka na výšku — orez zhora ukáže samotný kvet. */}
                <Image src={vyrez} alt="" fill sizes="56px" className="object-cover object-top" />
              </span>
            ) : (
              // Bez výrezu ukážeme odtieň ako vzorku — orámovaný krúžok, nech
              // svetlé odtiene nepôsobia ako chýbajúci obrázok.
              <span className="grid size-14 shrink-0 place-items-center rounded-flora-pill border border-flora-line bg-flora-sand">
                <FarebnyBod farba={o.farba} velkost={26} />
              </span>
            )}
            <span className="min-w-0">
              <span className="block text-flora-body font-medium text-flora-ink">{o.nazov}</span>
              <span className="block text-flora-small text-flora-moss">
                {farbyKvetov[o.farba]?.label} · {sezonaLabel[o.sezona].toLowerCase()}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
