"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { href } from "../base";
import { brand, footerNav, headerCta, headerNav } from "../content";

/**
 * Hlavička šablóny — wordmark + 5 odkazov + CTA pilulka. Na mobile hamburger
 * otvorí overlay so všetkými 7 stránkami (z `footerNav`). Sticky, priesvitná
 * na papieri. Klávesnica: menu sa dá zavrieť Escape, fokus je viditeľný.
 */
export function FloraNav() {
  const pathname = usePathname();
  const [otvorene, setOtvorene] = useState(false);

  useEffect(() => {
    if (!otvorene) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOtvorene(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [otvorene]);

  const jeAktivna = (h: string) => {
    const ciel = href(h);
    return h === "/" ? pathname === ciel : pathname.startsWith(ciel);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-flora-line/70 bg-flora-paper/85 backdrop-blur-md">
      <nav
        aria-label="Hlavná navigácia"
        className="mx-auto flex h-[68px] w-full max-w-[1200px] items-center justify-between px-flora-gutter"
      >
        <Link
          href={href("/")}
          className="text-[1.35rem] font-flora-display font-semibold tracking-[-0.01em] text-flora-ink"
        >
          {brand.meno}
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {headerNav.map((p) => (
            <li key={p.href}>
              <Link
                href={href(p.href)}
                aria-current={jeAktivna(p.href) ? "page" : undefined}
                className={`inline-flex min-h-[44px] items-center text-[15px] transition-colors hover:text-flora-clay-600 ${
                  jeAktivna(p.href) ? "text-flora-clay-600" : "text-flora-moss"
                }`}
              >
                {p.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href={href(headerCta.href)}
            className="hidden min-h-[44px] items-center rounded-flora-pill bg-flora-clay-600 px-5 text-[15px] font-semibold text-white transition-colors hover:bg-flora-clay-700 sm:inline-flex"
          >
            {headerCta.label}
          </Link>
          <button
            type="button"
            onClick={() => setOtvorene((o) => !o)}
            aria-expanded={otvorene}
            aria-controls="flora-mobil-menu"
            className="grid size-11 place-items-center rounded-flora-sm text-flora-ink lg:hidden"
          >
            <span className="sr-only">{otvorene ? "Zavrieť menu" : "Otvoriť menu"}</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {otvorene ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {otvorene ? (
        <div id="flora-mobil-menu" className="border-t border-flora-line bg-flora-paper lg:hidden">
          <ul className="mx-auto flex max-w-[1200px] flex-col px-flora-gutter py-2">
            {footerNav.map((p) => (
              <li key={p.href} className="border-b border-flora-line/60 last:border-0">
                <Link
                  href={href(p.href)}
                  onClick={() => setOtvorene(false)}
                  aria-current={jeAktivna(p.href) ? "page" : undefined}
                  className={`flex min-h-[52px] flex-col justify-center py-1 ${
                    jeAktivna(p.href) ? "text-flora-clay-600" : "text-flora-ink"
                  }`}
                >
                  <span className="text-[17px] font-medium">{p.label}</span>
                  {p.popis ? <span className="text-flora-small text-flora-moss">{p.popis}</span> : null}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mx-auto max-w-[1200px] px-flora-gutter pb-4">
            <Link
              href={href(headerCta.href)}
              onClick={() => setOtvorene(false)}
              className="flex min-h-[48px] items-center justify-center rounded-flora-pill bg-flora-clay-600 px-5 text-[15px] font-semibold text-white"
            >
              {headerCta.label}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
