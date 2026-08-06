/**
 * Ponuka `/ponuka` — prezentačná a sezónna (nie predaj). Sub-hero, kategórie,
 * meniny blok, sezónny kalendár, predplatné (tmavé), praktické info + FAQ, CTA.
 */
import {
  offerCta,
  offerFaq,
  offerKategorie,
  offerSekcie,
  offerSubhero,
  praktickeInfo,
  predplatneFrekvencie,
  predplatnePopis,
  sezonnyKalendar,
} from "../content";
import { CtaPas, Faq, KategorieKarty } from "../sections/bloky";
import { SubHero } from "../sections/hero";
import { MeninyBlok } from "../sections/meniny";
import { Eyebrow, Sekcia, ZahlavieSekcie } from "../sections/ui";

export function PonukaPage() {
  return (
    <>
      <SubHero h1={offerSubhero.h1} text={offerSubhero.text} />

      {/* Kategórie */}
      <Sekcia podklad="paper">
        <ZahlavieSekcie {...offerSekcie.kategorie} />
        <div className="mt-10">
          <KategorieKarty
            kategorie={offerKategorie}
            idMap={{ "Kytice na mieru": "kytice-na-mieru", "Smútočné kytice a vence": "smutocne" }}
          />
        </div>
      </Sekcia>

      {/* Meniny — blok */}
      <Sekcia podklad="sand" zhustena>
        <MeninyBlok />
      </Sekcia>

      {/* Sezónny kalendár */}
      <Sekcia podklad="paper">
        <ZahlavieSekcie {...offerSekcie.kalendar} />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sezonnyKalendar.map((s) => (
            <li key={s.obdobie} className="flex flex-col gap-3 rounded-flora-lg border border-flora-line bg-flora-porcelain p-6">
              <h3 className="text-flora-h3 font-flora-display font-medium text-flora-ink">{s.obdobie}</h3>
              <ul className="flex flex-col gap-1.5 text-flora-body text-flora-moss">
                {s.kvety.map((k) => (
                  <li key={k}>{k}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Sekcia>

      {/* Predplatné (tmavé) */}
      <section id="predplatne" className="scroll-mt-20 bg-flora-900 py-flora-section">
        <div className="mx-auto w-full max-w-[1200px] px-flora-gutter">
          <ZahlavieSekcie tmava {...offerSekcie.predplatne} popis={predplatnePopis} />
          <ul className="mt-10 grid gap-6 sm:grid-cols-3">
            {predplatneFrekvencie.map((f) => (
              <li key={f.frekvencia} className="flex flex-col gap-2 rounded-flora-lg border border-white/15 bg-white/5 p-6">
                <span className="text-flora-h3 font-flora-display font-medium text-flora-paper">{f.frekvencia}</span>
                <span className="text-[15px] font-semibold text-flora-clay-200">{f.cena}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Praktické info + FAQ */}
      <Sekcia podklad="paper">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-flora-lg bg-flora-sand p-6 sm:p-8">
            <h2 className="text-flora-h3 font-flora-display font-medium text-flora-ink">{praktickeInfo.doprava.nadpis}</h2>
            <p className="text-flora-body text-flora-moss">{praktickeInfo.doprava.text}</p>
          </div>
          <div className="flex flex-col gap-4 rounded-flora-lg bg-flora-sand p-6 sm:p-8">
            <h2 className="text-flora-h3 font-flora-display font-medium text-flora-ink">{praktickeInfo.starostlivost.nadpis}</h2>
            <ul className="flex flex-col gap-3 text-flora-body text-flora-moss">
              {praktickeInfo.starostlivost.tipy.map((t) => (
                <li key={t} className="flex gap-3">
                  <span aria-hidden="true" className="text-flora-clay-600">
                    ✽
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12">
          <Eyebrow>{offerSekcie.faqEyebrow}</Eyebrow>
          <div className="mt-6">
            <Faq otazky={offerFaq} />
          </div>
        </div>
      </Sekcia>

      <CtaPas text={offerCta.text} primar={offerCta.ctaPrimarna} sekundar={offerCta.ctaSekundarna} />
    </>
  );
}
