/**
 * Hero Domova (M2a — statický „poster" v štýle „ruky + kytica"). Fotografia
 * full-bleed s tmavým gradientom zdola, aby biely text držal kontrast. V M2b
 * poster nahradí video loop bez zmeny rozvrhu. Text je viditeľný okamžite.
 */
import Link from "next/link";
import { href } from "../base";
import { homeHero } from "../content";
import { FloraFigure } from "../images/placeholder";

export function HomeHero() {
  return (
    <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden">
      <FloraFigure
        alt="Ruky floristky viažuce kyticu dálií a záhradných ruží na pracovnom stole v rannom svetle"
        pomer="16/9"
        odtien="night"
        fill
      />
      {/* tmavý gradient zdola pre kontrast textu (biela ≥ 4.5:1) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-flora-900/85 via-flora-900/40 to-flora-900/10"
      />
      <div className="relative mx-auto w-full max-w-[1200px] px-flora-gutter pb-16 pt-28 sm:pb-24">
        <div className="max-w-[20ch]">
          <h1 className="text-flora-hero font-flora-display font-medium text-balance text-flora-paper">
            {homeHero.h1}
          </h1>
        </div>
        <p className="mt-6 max-w-[54ch] text-flora-lead text-flora-paper/90">{homeHero.podnadpis}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={href(homeHero.ctaPrimarna.href)}
            className="inline-flex min-h-[48px] items-center rounded-flora-pill bg-flora-clay-600 px-7 text-[15px] font-semibold text-white transition-colors hover:bg-flora-clay-700"
          >
            {homeHero.ctaPrimarna.label}
          </Link>
          <Link
            href={href(homeHero.ctaSekundarna.href)}
            className="inline-flex min-h-[48px] items-center rounded-flora-pill border border-white/50 px-7 text-[15px] font-semibold text-flora-paper transition-colors hover:bg-white/10"
          >
            {homeHero.ctaSekundarna.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Kompaktný textový sub-hero pre podstránky (na sand). */
export function SubHero({ h1, text }: { h1: string; text: string }) {
  return (
    <section className="border-b border-flora-line bg-flora-sand">
      <div className="mx-auto w-full max-w-[1200px] px-flora-gutter py-flora-section-sm">
        <div className="flex max-w-[46ch] flex-col gap-4 pt-6">
          <h1 className="text-flora-h1 font-flora-display font-medium text-balance text-flora-ink">{h1}</h1>
          <p className="text-flora-lead text-pretty text-flora-moss">{text}</p>
        </div>
      </div>
    </section>
  );
}
