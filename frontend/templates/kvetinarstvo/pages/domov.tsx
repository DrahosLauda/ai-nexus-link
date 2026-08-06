/**
 * Domov `/` — 11 sekcií podľa DESIGN.md (hero → meniny pás → manifest → sezónny
 * výber → služby 01–05 → galéria → tmavý teaser ateliéru → kroky objednávky →
 * referencie → CTA pás). Pätička je v shelli. Data-driven z `content.ts`.
 */
import {
  homeCtaPas,
  homeGaleria,
  homeKrokyObjednavky,
  homeManifest,
  homeReferencie,
  homeSluzby,
  seasonalEyebrow,
  seasonalKytice,
} from "../content";
import { AtelierTeaser, Galeria, KyticeKarty } from "../sections/karty";
import { CtaPas, Kroky, Referencie, SluzbyZoznam } from "../sections/bloky";
import { HomeHero } from "../sections/hero";
import { MeninyPas } from "../sections/meniny";
import { Cta, Eyebrow, Sekcia, ZahlavieSekcie } from "../sections/ui";

export function DomovPage() {
  return (
    <>
      <HomeHero />
      <MeninyPas />

      {/* Manifest — jedna editorial veta + text o ateliéri */}
      <Sekcia podklad="paper">
        <div className="max-w-[24ch]">
          <p className="text-flora-h1 font-flora-display font-medium text-balance text-flora-ink">
            {homeManifest.leadPred}
            <em className="italic text-flora-clay-600">{homeManifest.leadDoraz}</em>
            {homeManifest.leadPo}
          </p>
        </div>
        <div className="mt-8 grid max-w-[70ch] gap-4">
          {homeManifest.odseky.map((o) => (
            <p key={o} className="text-flora-lead text-flora-moss">
              {o}
            </p>
          ))}
        </div>
      </Sekcia>

      {/* Sezónny výber */}
      <Sekcia podklad="paper" zhustena>
        <div className="flex flex-col gap-3">
          <Eyebrow>{seasonalEyebrow}</Eyebrow>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-flora-h2 font-flora-display font-medium text-flora-ink">Čo práve viažeme</h2>
            <Cta k="/ponuka" variant="text">
              Celá ponuka →
            </Cta>
          </div>
        </div>
        <div className="mt-10">
          <KyticeKarty kytice={seasonalKytice} />
        </div>
      </Sekcia>

      {/* Služby 01–05 */}
      <Sekcia podklad="paper">
        <ZahlavieSekcie eyebrow="Čo pre vás robíme" nadpis="Od kytice dňa po svadobný deň" />
        <SluzbyZoznam sluzby={homeSluzby} />
      </Sekcia>

      {/* Galéria */}
      <Sekcia podklad="paper" zhustena>
        <Galeria obrazky={homeGaleria} />
      </Sekcia>

      {/* Tmavý teaser ateliéru */}
      <Sekcia podklad="night">
        <AtelierTeaser />
      </Sekcia>

      {/* Kroky objednávky */}
      <Sekcia podklad="paper">
        <ZahlavieSekcie eyebrow="Ako to prebieha" nadpis="Tri kroky k vašej kytici" />
        <div className="mt-10">
          <Kroky kroky={homeKrokyObjednavky} />
        </div>
      </Sekcia>

      {/* Referencie */}
      <Sekcia podklad="sand">
        <ZahlavieSekcie eyebrow="Referencie" nadpis="Čo hovoria zákazníci" />
        <div className="mt-10">
          <Referencie referencie={homeReferencie} />
        </div>
      </Sekcia>

      <CtaPas
        text={homeCtaPas.text}
        primar={homeCtaPas.ctaPrimarna}
        sekundar={homeCtaPas.ctaSekundarna}
      />
    </>
  );
}
