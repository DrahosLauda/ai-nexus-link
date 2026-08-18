/**
 * Dátový prístup ku katalógu kytíc — JEDINÉ miesto, ktoré siaha na zdroj dát.
 *
 * Dnes (E1) je zdrojom statická sada `katalogKytice` v `content.ts`. V E2 sa
 * vymení telo týchto funkcií za **WooCommerce Store API** (kytice sú obsah →
 * žijú v klientovom WP admine, nikdy v Directuse) a stránky ani komponenty sa
 * meniť nemusia — preto ich volajú výhradne cez tento modul.
 *
 * Funkcie sú synchrónne, aby sa dali použiť aj v klientskom filtri. Pri prechode
 * na Woo sa čítanie presunie do `generateStaticParams`/ISR vrstvy a sem sa
 * odovzdá už načítaný zoznam — tvar `Kytica` ostáva rovnaký.
 */
import {
  farbyKvetov,
  katalogKytice,
  katalogPrilezitosti,
  odrody,
  seasonalSlugy,
  typLabel,
  type Kytica,
  type KyticaTyp,
  type Odroda,
  type Prilezitost,
} from "./content";

/** Formátovanie ceny — jedno miesto pre celý katalóg (sk-SK, EUR, bez centov). */
const EUR = new Intl.NumberFormat("sk-SK", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function formatujCenu(cena: number): string {
  return EUR.format(cena);
}

export function vsetkyKytice(): Kytica[] {
  return katalogKytice;
}

export function kyticaPodlaSlug(slug: string): Kytica | undefined {
  return katalogKytice.find((k) => k.slug === slug);
}

const ODRODY_PODLA_ID = new Map(odrody.map((o) => [o.id, o]));

/** Odrody kytice v poradí, v akom sú zapísané (neznáme `id` ticho vynechá). */
export function zlozenieKytice(kytica: Kytica): Odroda[] {
  return kytica.zlozenie
    .map((id) => ODRODY_PODLA_ID.get(id))
    .filter((o): o is Odroda => o !== undefined);
}

/** Najnižšia cena naprieč veľkosťami — „od X €" na karte aj v JSON-LD. */
export function cenaOd(kytica: Kytica): number {
  return Math.min(...kytica.varianty.map((v) => v.cena));
}

/** Najvyššia cena naprieč veľkosťami (horná hranica v JSON-LD). */
export function cenaDo(kytica: Kytica): number {
  return Math.max(...kytica.varianty.map((v) => v.cena));
}

/** Sezónny výber na Domove — poradie určuje `seasonalSlugy` v `content.ts`. */
export function sezonnyVyber(): Kytica[] {
  return seasonalSlugy
    .map((slug) => kyticaPodlaSlug(slug))
    .filter((k): k is Kytica => k !== undefined);
}

/**
 * Ďalšie kytice na detail: najprv tie so spoločnou príležitosťou, potom zvyšok —
 * nikdy nie tá istá kytica a vždy stabilné poradie (deterministické, žiadny SSR mismatch).
 */
export function dalsieKytice(slug: string, pocet = 3): Kytica[] {
  const aktualna = kyticaPodlaSlug(slug);
  const ostatne = katalogKytice.filter((k) => k.slug !== slug);
  if (!aktualna) return ostatne.slice(0, pocet);
  const pribuzne = ostatne.filter((k) =>
    k.prilezitosti.some((p) => aktualna.prilezitosti.includes(p)),
  );
  const zvysok = ostatne.filter((k) => !pribuzne.includes(k));
  return [...pribuzne, ...zvysok].slice(0, pocet);
}

/** Hodnota filtra: konkrétna voľba alebo „všetky". */
export const VSETKY = "vsetky";

export type KatalogFilter = {
  prilezitost: Prilezitost | typeof VSETKY;
  farba: string;
  typ: KyticaTyp | typeof VSETKY;
};

export const PRAZDNY_FILTER: KatalogFilter = {
  prilezitost: VSETKY,
  farba: VSETKY,
  typ: VSETKY,
};

export function filtrujKytice(filter: KatalogFilter, kytice = katalogKytice): Kytica[] {
  return kytice.filter(
    (k) =>
      (filter.prilezitost === VSETKY || k.prilezitosti.includes(filter.prilezitost)) &&
      (filter.farba === VSETKY || k.farba === filter.farba) &&
      (filter.typ === VSETKY || k.typ === filter.typ),
  );
}

/**
 * Možnosti filtrov odvodené z dát — chip sa nikdy nezobrazí pre kombináciu,
 * ktorú neponúkame (a po napojení na Woo sa zoznam prispôsobí sám).
 */
export function moznostiFiltra(kytice = katalogKytice): {
  prilezitosti: Prilezitost[];
  farby: string[];
  typy: KyticaTyp[];
} {
  return {
    prilezitosti: katalogPrilezitosti.filter((p) =>
      kytice.some((k) => k.prilezitosti.includes(p)),
    ),
    farby: Object.keys(farbyKvetov).filter((f) => kytice.some((k) => k.farba === f)),
    typy: (Object.keys(typLabel) as KyticaTyp[]).filter((t) => kytice.some((k) => k.typ === t)),
  };
}
