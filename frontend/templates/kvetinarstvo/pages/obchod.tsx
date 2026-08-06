/**
 * Obchod `/obchod` — vstupná stránka; nákupný tok je zatiaľ plánovaný. Karty
 * nie sú nákupné: nesú textový štítok „Online nákup pripravujeme" (nie iba
 * farba) a CTA na objednávku formulárom. Layout znesie neskôr reálne produkty.
 */
import { shopCta, shopKrokyBuduceho, shopSortiment, shopStitok, shopSubhero } from "../content";
import { CtaPas, Kroky } from "../sections/bloky";
import { SubHero } from "../sections/hero";
import { FloraFigure, type Odtien } from "../images/placeholder";
import { Cta, Sekcia, ZahlavieSekcie } from "../sections/ui";

const ODTIENE: Odtien[] = ["clay", "sage", "blush", "sand"];

export function ObchodPage() {
  return (
    <>
      <SubHero h1={shopSubhero.h1} text={shopSubhero.text} />

      {/* Náhľad sortimentu */}
      <Sekcia podklad="paper">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <ZahlavieSekcie eyebrow="Sortiment" nadpis="Čo si u nás objednáte" />
          <span className="inline-flex items-center rounded-flora-pill bg-flora-sand px-4 py-1.5 text-flora-small font-semibold text-flora-700">
            {shopStitok}
          </span>
        </div>
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {shopSortiment.map((p, i) => (
            <li key={p.nazov} className="flex flex-col">
              <FloraFigure alt={`${p.nazov} — ${p.popis}`} pomer="4/5" arch odtien={ODTIENE[i % ODTIENE.length]} />
              <div className="mt-5 flex items-baseline justify-between gap-3">
                <h3 className="text-flora-h3 font-flora-display font-medium text-flora-ink">{p.nazov}</h3>
                <span className="whitespace-nowrap text-[15px] font-semibold text-flora-clay-600">{p.cena}</span>
              </div>
              <p className="mt-1.5 text-flora-small text-flora-moss">{p.popis}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-[60ch] text-flora-body text-flora-moss">
          Karty zatiaľ nie sú nákupné. Zatiaľ objednáte telefonicky alebo formulárom —{" "}
          <Cta k="/kontakt" variant="text">
            napíšte nám →
          </Cta>
        </p>
      </Sekcia>

      {/* Ako bude nákup fungovať */}
      <Sekcia podklad="sand">
        <ZahlavieSekcie eyebrow="Ako to bude fungovať" nadpis="Nákup online, keď spustíme e-shop" />
        <div className="mt-10">
          <Kroky kroky={shopKrokyBuduceho} />
        </div>
      </Sekcia>

      <CtaPas text={shopCta.text} primar={shopCta.cta} />
    </>
  );
}
