/**
 * Pätička šablóny na tmavej `flora-900`: značka, adresa a hodiny, kontakt,
 * mini-mapa všetkých 7 stránok a sociálne siete. Meniny sem zámerne nedávame
 * (duplicita bez hodnoty — viď DESIGN.md e-bis).
 */
import Link from "next/link";
import { href } from "../base";
import { brand, footerNav, footerText } from "../content";

const socialne: { label: string; url: string }[] = [
  { label: "Instagram", url: brand.socialne.instagram },
  { label: "Facebook", url: brand.socialne.facebook },
  { label: "Pinterest", url: brand.socialne.pinterest },
];

export function FloraFooter() {
  return (
    <footer className="bg-flora-night text-flora-mist">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-flora-gutter py-flora-section-sm sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <span className="text-[1.35rem] font-flora-display font-semibold text-flora-paper">
            {brand.meno}
          </span>
          <p className="max-w-[34ch] text-flora-small leading-relaxed">{footerText}</p>
          <ul className="flex gap-4 pt-1">
            {socialne.map((s) => (
              <li key={s.label}>
                <a
                  href={s.url}
                  className="inline-flex min-h-[44px] items-center text-flora-small text-flora-mist underline decoration-1 underline-offset-4 hover:text-flora-paper"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-flora-eyebrow font-semibold uppercase text-flora-clay-200">Kontakt</h2>
          <address className="not-italic text-flora-small leading-relaxed text-flora-paper">
            {brand.adresaRiadok1}
            <br />
            {brand.adresaRiadok2}
          </address>
          <a href={`tel:${brand.telefon.replace(/\s/g, "")}`} className="text-flora-small text-flora-paper hover:underline">
            {brand.telefon}
          </a>
          <a href={`mailto:${brand.email}`} className="text-flora-small text-flora-paper hover:underline">
            {brand.email}
          </a>
          <dl className="mt-2 flex flex-col gap-1 text-flora-small">
            {brand.otvaracieHodiny.map((h) => (
              <div key={h.dni} className="flex justify-between gap-4">
                <dt>{h.dni}</dt>
                <dd className="text-flora-paper">{h.hodiny}</dd>
              </div>
            ))}
          </dl>
        </div>

        <nav aria-label="Mapa stránok" className="flex flex-col gap-3">
          <h2 className="text-flora-eyebrow font-semibold uppercase text-flora-clay-200">Stránky</h2>
          <ul className="flex flex-col">
            {footerNav.map((p) => (
              <li key={p.href}>
                <Link
                  href={href(p.href)}
                  className="inline-flex min-h-[44px] items-center text-flora-small text-flora-mist hover:text-flora-paper"
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-1 px-flora-gutter py-5 text-[13px] text-flora-mist sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {brand.meno}. {brand.slogan}.</span>
          <span>Ukážková šablóna — demo obsah.</span>
        </div>
      </div>
    </footer>
  );
}
