/**
 * Katalóg hotových kytíc `/kytice` (E1) — sub-hero, filtrovateľná mriežka,
 * prvky dôvery a CTA na kyticu na mieru. Predaj je zamknutý: karty vedú na
 * detail a objednávka končí formulárom, nie pokladňou.
 */
import { katalogObsah } from "../content";
import { CtaPas } from "../sections/bloky";
import { SubHero } from "../sections/hero";
import { KatalogFiltre } from "../sections/katalog-filter";
import { PrvkyDovery } from "../sections/kytice";
import { Sekcia, ZahlavieSekcie } from "../sections/ui";

export function KyticePage() {
  return (
    <>
      <SubHero h1={katalogObsah.subhero.h1} text={katalogObsah.subhero.text} />

      <Sekcia podklad="paper">
        <ZahlavieSekcie nadpis={katalogObsah.mriezkaNadpis} />
        <div className="mt-8">
          <KatalogFiltre />
        </div>
      </Sekcia>

      <Sekcia podklad="sand" zhustena>
        <ZahlavieSekcie nadpis={katalogObsah.dovera.nadpis} />
        <div className="mt-8">
          <PrvkyDovery />
        </div>
      </Sekcia>

      <CtaPas
        text={katalogObsah.cta.text}
        primar={katalogObsah.cta.primar}
        sekundar={katalogObsah.cta.sekundar}
      />
    </>
  );
}
