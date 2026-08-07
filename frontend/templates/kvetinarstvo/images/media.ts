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
  undefined,
  undefined,
];

/** Tmavý teaser ateliéru na domove (arch, 4:5). */
export const atelierTeaserFoto: string | undefined = undefined;

/** Galéria na domove — index zodpovedá `homeGaleria`. */
export const galeriaFotky: (string | undefined)[] = [
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
];
