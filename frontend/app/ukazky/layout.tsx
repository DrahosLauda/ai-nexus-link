import type { Metadata } from "next";

/**
 * Layout pre celú vetvu `/ukazky/*` (portfólio odvetvových šablón).
 *
 * Šablóny majú **fiktívny** demo obsah — nesmú sa dostať do Googla ani
 * znečistiť naše SEO. Preto tu tvrdo nastavíme `noindex, nofollow` pre celý
 * podstrom (dedí sa na index aj na `[odvetvie]`). Sitemap ani llms.txt tieto
 * cesty nezaraďujú. Naša reálna referencia je digitalnapomoc.sk, nie demo web.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function UkazkyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
