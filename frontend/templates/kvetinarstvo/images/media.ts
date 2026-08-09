/**
 * Médiálna vrstva šablóny — cesty ku kurátorským fotkám per obrazový slot.
 *
 * Oddelené od `content.ts` (texty). Dopĺňame priebežne: `undefined` = zatiaľ
 * placeholder (`FloraFigure`), reťazec = reálna fotka cez `next/image`
 * (`Foto`). Poradie zodpovedá poliam v `content.ts` (index = ten istý slot).
 * Súbory: `frontend/public/kvetinarstvo/img/`.
 */

/** Sezónny výber na domove — index zodpovedá `seasonalKytice`. */
export const seasonalFotky: (string | undefined)[] = [
  "/kvetinarstvo/img/sezona-1.webp",
  "/kvetinarstvo/img/sezona-2.webp",
  "/kvetinarstvo/img/sezona-3.webp",
];

/** Tmavý teaser ateliéru na domove (arch, 4:5). */
export const atelierTeaserFoto: string | undefined = "/kvetinarstvo/img/atelier.webp";

/** Galéria na domove — index zodpovedá `homeGaleria`. */
export const galeriaFotky: (string | undefined)[] = [
  "/kvetinarstvo/img/galeria-1.webp",
  "/kvetinarstvo/img/galeria-2.webp",
  "/kvetinarstvo/img/galeria-3.webp",
  "/kvetinarstvo/img/galeria-4.webp",
  "/kvetinarstvo/img/galeria-5.webp",
  "/kvetinarstvo/img/galeria-6.webp",
];

/* ── Svadby `/svadby` ──────────────────────────────────────────────── */

/** Sub-hero inštalácia (21:9). Zatiaľ portrét orezaný na šírku — dočasné. */
export const weddingsSubheroFoto: string | undefined = "/kvetinarstvo/img/svadby-subhero.webp";

/** „Ako pracujeme s párom" — detail rúk pri viazaní (4:5, arch). */
export const weddingsProcesFoto: string | undefined = "/kvetinarstvo/img/svadby-proces.webp";

/** Realizácie — index zodpovedá `weddingsRealizacie` (Omšenie, Skalka, Elizabeth). */
export const weddingsRealizacieFotky: (string | undefined)[] = [
  "/kvetinarstvo/img/svadby-r1.webp",
  "/kvetinarstvo/img/svadby-r2.webp",
  "/kvetinarstvo/img/svadby-r3.webp",
];

/* ── Ateliér `/atelier` ─────────────────────────────────────────────── */

/** Barbora (zakladateľka) — tá istá fotka pre sub-hero aj 1. kartu tímu. */
export const studioBarboraFoto: string | undefined = "/kvetinarstvo/img/atelier-barbora.webp";

/** Tím — index zodpovedá `studioTim` (Barbora, Denisa, Tomáš). */
export const studioTimFotky: (string | undefined)[] = [
  studioBarboraFoto,
  "/kvetinarstvo/img/atelier-denisa.webp",
  "/kvetinarstvo/img/atelier-tomas.webp",
];

/** Priestor — index zodpovedá `studioPriestor` (stôl, chladnička, pult). */
export const studioPriestorFotky: (string | undefined)[] = [
  "/kvetinarstvo/img/atelier-stol.webp",
  "/kvetinarstvo/img/atelier-chladnicka.webp",
  "/kvetinarstvo/img/atelier-pult.webp",
];

/* ── Blog `/blog` ───────────────────────────────────────────────────── */

/** Náhľady článkov — index zodpovedá `blogClanky` (0 = hlavný, 21:9; ďalšie 3:2). */
export const blogFotky: (string | undefined)[] = [
  "/kvetinarstvo/img/blog-dalie.webp", // dálie (hlavný)
  "/kvetinarstvo/img/blog-tri-chyby.webp", // tri chyby
  "/kvetinarstvo/img/blog-svadba.webp", // kvety na svadbu
  "/kvetinarstvo/img/blog-pena.webp", // bez floristickej peny
];

/* ── Obchod `/obchod` ───────────────────────────────────────────────── */

/** Sortiment — index zodpovedá `shopSortiment` (Kytica dňa, na mieru, predplatné, poukaz). */
export const shopSortimentFotky: (string | undefined)[] = [
  "/kvetinarstvo/img/obchod-kytica-dna.webp",
  "/kvetinarstvo/img/obchod-na-mieru.webp",
  "/kvetinarstvo/img/obchod-predplatne.webp",
  "/kvetinarstvo/img/obchod-poukaz.webp",
];

/* ── Kontakt `/kontakt` ─────────────────────────────────────────────── */

/** Statická mapa polohy (16:9). Demo screenshot z Google Máp — klient nahradí svojou. */
export const kontaktMapaFoto: string | undefined = "/kvetinarstvo/img/kontakt-mapa.webp";
