/**
 * Ateliér `/atelier` — o nás: sub-hero s portrétom, príbeh, tím, ako pracujeme
 * (konkrétne fakty), priestor, CTA.
 */
import {
  katalogPrelink,
  studioAkoPracujeme,
  studioCta,
  studioPribeh,
  studioPriestor,
  studioSekcie,
  studioSubhero,
  studioTim,
} from "../content";
import { CtaPas } from "../sections/bloky";
import { Foto } from "../images/foto";
import { studioBarboraFoto, studioPriestorFotky, studioTimFotky } from "../images/media";
import { Cta, Eyebrow, Sekcia, ZahlavieSekcie } from "../sections/ui";

export function AtelierPage() {
  return (
    <>
      {/* Sub-hero s portrétom */}
      <section className="border-b border-flora-line bg-flora-sand">
        <div className="mx-auto grid w-full max-w-[1200px] items-center gap-10 px-flora-gutter py-flora-section-sm lg:grid-cols-[0.8fr_1.2fr]">
          <Foto
            src={studioBarboraFoto}
            alt="Portrét Barbory Momčilovej, zakladateľky ateliéru Boma Flora"
            pomer="4/5"
            arch
            odtien="clay"
            className="max-w-[360px]"
            sizes="(max-width: 1024px) 100vw, 360px"
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
        <ZahlavieSekcie {...studioSekcie.pribeh} />
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
        <ZahlavieSekcie {...studioSekcie.tim} />
        <ul className="mt-10 grid gap-8 sm:grid-cols-3">
          {studioTim.map((clen, i) => (
            <li key={clen.meno} className="flex flex-col">
              <Foto
                src={studioTimFotky[i]}
                alt={clen.alt}
                pomer="4/5"
                arch
                odtien="sage"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
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
          <ZahlavieSekcie {...studioSekcie.akoPracujeme} />
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
        <Eyebrow>{studioSekcie.priestorEyebrow}</Eyebrow>
        <ul className="mt-6 grid gap-6 sm:grid-cols-3">
          {studioPriestor.map((p, i) => (
            <li key={p.alt}>
              <Foto
                src={studioPriestorFotky[i]}
                alt={p.alt}
                pomer="3/4"
                odtien={i === 1 ? "clay" : "sage"}
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </li>
          ))}
        </ul>
      </Sekcia>

      {/* Prelink na katalóg kytíc */}
      <Sekcia podklad="sand">
        <div className="flex flex-col items-start gap-6 rounded-flora-lg border border-flora-line bg-flora-porcelain p-8 shadow-flora-card md:flex-row md:items-center md:justify-between md:gap-10 sm:p-10">
          <div className="flex max-w-[52ch] flex-col gap-3">
            <Eyebrow>{katalogPrelink.eyebrow}</Eyebrow>
            <h2 className="text-flora-h3 font-flora-display font-medium text-flora-ink">{katalogPrelink.nadpis}</h2>
            <p className="text-flora-body text-flora-moss">{katalogPrelink.popis}</p>
          </div>
          <Cta k={katalogPrelink.cta.href} variant="primar">
            {katalogPrelink.cta.label}
          </Cta>
        </div>
      </Sekcia>

      <CtaPas text={studioCta.text} primar={studioCta.cta} podklad="night" />
    </>
  );
}
