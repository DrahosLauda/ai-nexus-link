/**
 * „Shell" balíka — obal každej stránky šablóny: fonty, `.flora-root`, hlavička
 * a pätička. Dizajn-tokeny (`theme.css`) sa kompilujú cez `app/globals.css`
 * (Tailwind v4 `@import`), takže tu ich už neimportujeme — viac v README.
 *
 * Fonty (Fraunces + Figtree) načítava `next/font/google` a exponuje CSS premenné
 * `--font-fraunces` a `--font-figtree`, ktoré očakáva `theme.css`. Podpora
 * latin-ext = plná slovenská diakritika. Fraunces vrátane italic (akcenty).
 */
import { Figtree, Fraunces } from "next/font/google";
import type { ReactNode } from "react";
import { FloraFooter } from "./sections/footer";
import { FloraNav } from "./sections/nav";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin", "latin-ext"],
  variable: "--font-figtree",
  display: "swap",
});

export function FloraShell(page: ReactNode) {
  return (
    <div className={`${fraunces.variable} ${figtree.variable} flora-root min-h-screen`}>
      <a
        href="#flora-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-flora-pill focus:bg-flora-clay-600 focus:px-5 focus:py-2 focus:text-white"
      >
        Preskočiť na obsah
      </a>
      <FloraNav />
      <main id="flora-main">{page}</main>
      <FloraFooter />
    </div>
  );
}
