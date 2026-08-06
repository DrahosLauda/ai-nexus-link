/**
 * Ateliér `/atelier` — o nás: sub-hero s portrétom, príbeh, tím, ako pracujeme
 * (konkrétne fakty), priestor, CTA.
 */
import {
  studioAkoPracujeme,
  studioCta,
  studioPribeh,
  studioPriestor,
  studioSubhero,
  studioTim,
} from "../content";
import { CtaPas } from "../sections/bloky";
import { FloraFigure } from "../images/placeholder";
import { Eyebrow, Sekcia, ZahlavieSekcie } from "../sections/ui";

export function AtelierPage() {
  return (
    <>
      {/* Sub-hero s portrétom */}
      <section className="border-b border-flora-line bg-flora-sand">
        <div className="mx-auto grid w-full max-w-[1200px] items-center gap-10 px-flora-gutter py-flora-section-sm lg:grid-cols-[0.8fr_1.2fr]">
          <FloraFigure
            alt="Portrét Barbory Momčilovej, zakladateľky ateliéru Boma Flora"
            pomer="4/5"
            arch
            odtien="clay"
            className="max-w-[360px]"
          />
          <div className="flex flex-col gap-4">
            <h1 className="text-flora-h1 font-flora-display font-medium text-balance text-flora-ink">
              {studioSubhero.h1}
            </h1>
            <p className="text-flora-lead text-pretty text-flora-moss">{studioSubhero.text}</p>
          </div>
        </div>
      </section>

      {/* Príbeh */}
      <Sekcia podklad="paper">
        <ZahlavieSekcie eyebrow="Príbeh" nadpis="Ako Boma Flora vznikla" />
        <div className="mt-8 grid max-w-[70ch] gap-4">
          {studioPribeh.odseky.map((o) => (
            <p key={o} className="text-flora-lead text-flora-moss">
              {o}
            </p>
          ))}
        </div>
      </Sekcia>

      {/* Tím */}
      <Sekcia podklad="sand">
        <ZahlavieSekcie eyebrow="Tím" nadpis="Kto viaže vaše kvety" />
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {studioTim.map((clen) => (
            <li key={clen.meno} className="flex flex-col">
              <FloraFigure alt={clen.alt} pomer="4/5" arch odtien="sage" />
              <h3 className="mt-5 text-flora-h3 font-flora-display font-medium text-flora-ink">{clen.meno}</h3>
              <span className="text-flora-small font-semibold text-flora-clay-600">{clen.rola}</span>
              <p className="mt-2 text-flora-body text-flora-moss">{clen.veta}</p>
            </li>
          ))}
        </ul>
      </Sekcia>

      {/* Ako pracujeme */}
      <Sekcia podklad="paper">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <ZahlavieSekcie eyebrow="Ako pracujeme" nadpis="Konkrétne, nie prázdne sľuby" />
          <ul className="flex flex-col divide-y divide-flora-line border-y border-flora-line">
            {studioAkoPracujeme.map((f) => (
              <li key={f} className="flex gap-4 py-5">
                <span aria-hidden="true" className="mt-1 text-flora-clay-600">
                  ✽
                </span>
                <p className="text-flora-body text-flora-ink">{f}</p>
              </li>
            ))}
          </ul>
        </div>
      </Sekcia>

      {/* Priestor */}
      <Sekcia podklad="paper" zhustena>
        <Eyebrow>Priestor</Eyebrow>
        <ul className="mt-6 grid gap-6 sm:grid-cols-3">
          {studioPriestor.map((p, i) => (
            <li key={p.alt}>
              <FloraFigure alt={p.alt} pomer="3/4" odtien={i === 1 ? "clay" : "sage"} />
            </li>
          ))}
        </ul>
      </Sekcia>

      <CtaPas text={studioCta.text} primar={studioCta.cta} podklad="night" />
    </>
  );
}
