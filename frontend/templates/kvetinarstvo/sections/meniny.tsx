/**
 * Podpisový prvok — meniny. Pás na Domove (`<aside>`, doplnková info, neruší
 * osnovu nadpisov) a väčší blok na Ponuke (`<h2>`). Celý obsah je skutočný text,
 * dátum v `<time>`, akcia je podčiarknutý odkaz so šípkou (nie iba farba).
 * Výška je daná typografiou → žiadny CLS, nečaká sa na JS.
 */
import Link from "next/link";
import { href } from "../base";
import { meninyCopy, offerMeninyBlok } from "../content";
import { denVTyzdni, meninyDnesZajtra, meninyNajblizsie } from "../meniny";

const odkaz =
  "inline-flex min-h-[44px] items-center text-[15px] font-semibold text-flora-clay-600 underline decoration-1 underline-offset-4 transition-colors duration-150 ease-flora hover:text-flora-clay-700";

/** Tenký pás pod hero na Domove. */
export function MeninyPas() {
  const { dnes, zajtra } = meninyDnesZajtra();

  return (
    <aside
      aria-label="Dnešné meniny"
      className="border-y border-flora-line bg-flora-sand"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-x-6 gap-y-1 px-flora-gutter py-3.5 sm:flex-row sm:flex-wrap sm:items-baseline">
        {dnes.meno ? (
          <>
            <p className="text-[15px] text-flora-moss">
              <span className="uppercase tracking-[0.12em] text-flora-500">{meninyCopy.eyebrowDnes} </span>
              <time
                dateTime={dnes.iso}
                className="mx-0.5 inline-block rounded-md bg-flora-clay-100 px-2 py-0.5 font-flora-display text-[1.25rem] italic leading-tight text-flora-clay-700"
              >
                {dnes.meno}
              </time>
              {zajtra.meno ? (
                <span className="text-flora-moss">
                  {" · "}
                  {meninyCopy.labelZajtra} {zajtra.meno}
                </span>
              ) : null}
            </p>
            <Link href={href(meninyCopy.hrefKytica)} className={`${odkaz} sm:ml-auto`}>
              {dnes.rod === "z" ? meninyCopy.ctaZena : meninyCopy.ctaMuz}
            </Link>
          </>
        ) : (
          <>
            <p className="text-[15px] text-flora-moss">{meninyCopy.fallbackText}</p>
            <Link href={href(meninyCopy.hrefFallback)} className={`${odkaz} sm:ml-auto`}>
              {meninyCopy.fallbackCta}
            </Link>
          </>
        )}
      </div>
    </aside>
  );
}

/** Väčší blok „Meniny tento týždeň" na Ponuke (porcelain karta). */
export function MeninyBlok() {
  const dni = meninyNajblizsie(7);

  return (
    <div className="rounded-flora-lg bg-flora-porcelain p-6 shadow-flora-card sm:p-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-[46ch]">
          <h2 className="text-flora-h2 font-flora-display font-medium text-flora-ink">{offerMeninyBlok.nadpis}</h2>
          <p className="mt-3 text-flora-lead text-flora-moss">{offerMeninyBlok.popis}</p>
          <Link href={href(offerMeninyBlok.href)} className={`${odkaz} mt-4`}>
            {offerMeninyBlok.cta}
          </Link>
        </div>

        <ul className="grid w-full max-w-[420px] gap-px overflow-hidden rounded-flora-md border border-flora-line bg-flora-line">
          {dni.map((d, i) => (
            <li
              key={d.iso}
              className={`flex items-baseline justify-between gap-4 px-4 py-2.5 ${
                i === 0 ? "bg-flora-clay-100" : "bg-flora-porcelain"
              }`}
            >
              <span
                className={
                  i === 0
                    ? "text-flora-small font-semibold uppercase tracking-[0.08em] text-flora-clay-700"
                    : "text-flora-small text-flora-moss"
                }
              >
                {i === 0 ? "Dnes" : denVTyzdni(d.iso)}
              </span>
              {d.meno ? (
                <time
                  dateTime={d.iso}
                  className={
                    i === 0
                      ? "font-flora-display text-[1.35rem] italic text-flora-clay-700"
                      : "text-[15px] text-flora-ink"
                  }
                >
                  {d.meno}
                </time>
              ) : (
                <span className="text-[15px] text-flora-moss">
                  <span aria-hidden="true">—</span>
                  <span className="sr-only">bez menín</span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
