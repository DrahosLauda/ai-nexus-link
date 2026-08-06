/**
 * Svadby a eventy `/svadby` — predajná stránka: sub-hero s inštaláciou,
 * ako pracujeme s párom, realizácie, cenové úrovne, priebeh, referencie, CTA.
 */
import {
  weddingsCenoveUrovne,
  weddingsCta,
  weddingsProcessIntro,
  weddingsRealizacie,
  weddingsReferencie,
  weddingsSekcie,
  weddingsSubhero,
} from "../content";
import { CenoveUrovne, CtaPas, Kroky, Referencie } from "../sections/bloky";
import { weddingsPriebeh } from "../content";
import { FloraFigure } from "../images/placeholder";
import { Eyebrow, Sekcia, ZahlavieSekcie } from "../sections/ui";

export function SvadbyPage() {
  return (
    <>
      {/* Sub-hero s full-width fotkou */}
      <section className="bg-flora-paper">
        <div className="mx-auto w-full max-w-[1200px] px-flora-gutter pt-flora-section-sm">
          <div className="flex max-w-[46ch] flex-col gap-4">
            <h1 className="text-flora-h1 font-flora-display font-medium text-balance text-flora-ink">
              {weddingsSubhero.h1}
            </h1>
            <p className="text-flora-lead text-pretty text-flora-moss">{weddingsSubhero.text}</p>
          </div>
          <div className="mt-10">
            <FloraFigure
              alt="Svadobná kvetinová inštalácia z eukalyptu a bielych ruží nad hlavným stolom"
              pomer="21/9"
              odtien="blush"
            />
          </div>
        </div>
      </section>

      {/* Ako pracujeme s párom */}
      <Sekcia podklad="paper">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-5">
            <Eyebrow>{weddingsSekcie.procesEyebrow}</Eyebrow>
            <p className="text-flora-lead text-flora-ink">{weddingsProcessIntro}</p>
          </div>
          <FloraFigure
            alt="Floristka a nevesta prezerajú moodboard so vzorkami kvetov v ateliéri"
            pomer="4/5"
            arch
            odtien="sage"
            className="max-w-[420px] lg:justify-self-end"
          />
        </div>
      </Sekcia>

      {/* Realizácie */}
      <Sekcia podklad="sand">
        <ZahlavieSekcie {...weddingsSekcie.realizacie} />
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {weddingsRealizacie.map((r, i) => (
            <li key={r.miesto} className="flex flex-col">
              <FloraFigure alt={r.alt} pomer="4/5" arch odtien={i % 2 === 0 ? "clay" : "sage"} />
              <h3 className="mt-5 text-flora-h3 font-flora-display font-medium text-flora-ink">{r.miesto}</h3>
              <p className="mt-1.5 text-flora-body text-flora-moss">{r.popis}</p>
            </li>
          ))}
        </ul>
      </Sekcia>

      {/* Cenové úrovne */}
      <Sekcia podklad="paper">
        <ZahlavieSekcie {...weddingsSekcie.ceny} />
        <div className="mt-10">
          <CenoveUrovne urovne={weddingsCenoveUrovne} />
        </div>
      </Sekcia>

      {/* Priebeh spolupráce */}
      <Sekcia podklad="paper" zhustena>
        <ZahlavieSekcie {...weddingsSekcie.priebeh} />
        <div className="mt-10">
          <Kroky kroky={weddingsPriebeh} />
        </div>
      </Sekcia>

      {/* Referencie */}
      <Sekcia podklad="sand">
        <ZahlavieSekcie {...weddingsSekcie.referencie} />
        <div className="mt-10">
          <Referencie referencie={weddingsReferencie} />
        </div>
      </Sekcia>

      <CtaPas text={weddingsCta.text} primar={weddingsCta.cta} podklad="night" />
    </>
  );
}
