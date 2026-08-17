/**
 * Detail hotovej kytice `/kytice/[slug]` (E1) — galéria, výber veľkosti so
 * živou cenou, „O kytici", zloženie z konkrétnych odrôd, prvky dôvery a ďalšie
 * kytice. Objednávka vedie do existujúceho kontakt-formulára (`?typ=kytica`),
 * žiadny checkout — predaj je zamknutý.
 *
 * Product JSON-LD tu je zámerne: rovnaká štruktúra ponesie reálne produkty po
 * napojení na WooCommerce (E2) a je to vrstva, ktorou katalóg vidia aj AI
 * vyhľadávače. Demo je pod `/ukazky`, teda `noindex` — ide o pripravenú vrstvu.
 */
import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";
import { href } from "../base";
import {
  brand,
  katalogObsah,
  praktickeInfo,
  typLabel,
  type Kytica,
} from "../content";
import { cenaDo, cenaOd, dalsieKytice } from "../katalog";
import { CtaPas } from "../sections/bloky";
import { KyticaObjednavka } from "../sections/kytica-objednavka";
import { GaleriaKytice, KyticeKarty, PrvkyDovery, ZlozenieKytice } from "../sections/kytice";
import { Eyebrow, Sekcia, ZahlavieSekcie } from "../sections/ui";

export function KyticaDetailPage({ kytica }: { kytica: Kytica }) {
  const t = katalogObsah.detail;
  const obrazky = kytica.fotky.filter((f) => f.src).map((f) => absoluteUrl(f.src as string));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: kytica.nazov,
    description: kytica.perex,
    ...(obrazky.length > 0 ? { image: obrazky } : {}),
    brand: { "@type": "Brand", name: brand.meno },
    category: typLabel[kytica.typ],
    url: absoluteUrl(href(`/kytice/${kytica.slug}`)),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: cenaOd(kytica),
      highPrice: cenaDo(kytica),
      offerCount: kytica.varianty.length,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* Produkt — galéria + objednávkový panel */}
      <Sekcia podklad="paper" zhustena>
        <Link
          href={href("/kytice")}
          className="inline-flex min-h-[44px] items-center gap-2 text-flora-small font-medium text-flora-moss transition-colors duration-150 ease-flora hover:text-flora-clay-600"
        >
          <span aria-hidden="true">←</span>
          {t.spat}
        </Link>

        <div className="mt-4 grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <GaleriaKytice fotky={kytica.fotky} />

          <div className="flex flex-col gap-7 lg:sticky lg:top-24">
            <div className="flex flex-col gap-3">
              <Eyebrow>{typLabel[kytica.typ]}</Eyebrow>
              <h1 className="text-flora-h1 font-flora-display font-medium text-balance text-flora-ink">
                {kytica.nazov}
              </h1>
              <p className="text-flora-lead text-pretty text-flora-moss">{kytica.perex}</p>
            </div>
            <KyticaObjednavka kytica={kytica} />
          </div>
        </div>
      </Sekcia>

      {/* O kytici — popis, trvácnosť, čo je v cene, starostlivosť */}
      <Sekcia podklad="sand">
        <ZahlavieSekcie nadpis={t.oKytici} />
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col gap-6">
            <p className="max-w-[62ch] text-flora-body text-flora-moss">{kytica.popis}</p>
            <div className="flex flex-col gap-1.5 border-t border-flora-line pt-5">
              <h3 className="text-[1.0625rem] font-flora-display font-medium text-flora-ink">
                {t.trvacnostNadpis}
              </h3>
              <p className="text-flora-body text-flora-moss">{kytica.trvacnost}</p>
            </div>
            <div className="flex flex-col gap-3 border-t border-flora-line pt-5">
              <h3 className="text-[1.0625rem] font-flora-display font-medium text-flora-ink">
                {praktickeInfo.starostlivost.nadpis}
              </h3>
              <ul className="flex flex-col gap-2.5 text-flora-body text-flora-moss">
                {praktickeInfo.starostlivost.tipy.map((tip) => (
                  <li key={tip} className="flex gap-3">
                    <span aria-hidden="true" className="text-flora-clay-600">
                      ✽
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-flora-lg bg-flora-porcelain p-6 shadow-flora-card sm:p-8 lg:self-start">
            <h3 className="text-flora-h3 font-flora-display font-medium text-flora-ink">
              {t.vCeneNadpis}
            </h3>
            <ul className="flex flex-col divide-y divide-flora-line">
              {kytica.vCene.map((polozka) => (
                <li key={polozka} className="flex gap-3 py-3 text-flora-body text-flora-ink">
                  <span aria-hidden="true" className="text-flora-clay-600">
                    ✽
                  </span>
                  <span>{polozka}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Sekcia>

      {/* Z čoho ju viažeme */}
      <Sekcia podklad="paper">
        <ZahlavieSekcie nadpis={t.zlozenieNadpis} />
        <div className="mt-8">
          <ZlozenieKytice kytica={kytica} />
        </div>
        <p className="mt-8 max-w-[68ch] text-flora-small text-flora-moss">{t.zlozeniePoznamka}</p>
      </Sekcia>

      {/* Prvky dôvery */}
      <Sekcia podklad="sand" zhustena>
        <ZahlavieSekcie nadpis={katalogObsah.dovera.nadpis} />
        <div className="mt-8">
          <PrvkyDovery />
        </div>
      </Sekcia>

      {/* Ďalšie kytice */}
      <Sekcia podklad="paper">
        <ZahlavieSekcie nadpis={t.dalsieNadpis} />
        <div className="mt-10">
          <KyticeKarty kytice={dalsieKytice(kytica.slug)} />
        </div>
      </Sekcia>

      <CtaPas text={katalogObsah.cta.text} primar={katalogObsah.cta.primar} />
    </>
  );
}
