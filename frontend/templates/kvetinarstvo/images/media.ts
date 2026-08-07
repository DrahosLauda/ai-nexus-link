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
