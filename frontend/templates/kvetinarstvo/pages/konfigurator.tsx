/**
 * Konfigurátor kytice `/konfigurator` — sub-hero + interaktívne jadro (K0).
 * Samotná logika (počty, filter, živý súčet, odkaz na objednávku) je v klientskom
 * komponente `sections/konfigurator`. Bez Kláry a bez vizuálneho skladania kytice
 * (tie sú K1–K3) — funkčné, otestovateľné jadro.
 */
import { konfiguratorObsah } from "../content";
import { SubHero } from "../sections/hero";
import { Konfigurator } from "../sections/konfigurator";

export function KonfiguratorPage() {
  return (
    <>
      <SubHero h1={konfiguratorObsah.subhero.h1} text={konfiguratorObsah.subhero.text} />
      <Konfigurator />
    </>
  );
}
