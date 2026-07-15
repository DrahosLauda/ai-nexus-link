import type { Metadata } from "next";
import PageHero from "../components/PageHero";

export const metadata: Metadata = {
  title: "O nás",
  description: "AI Nexus Link je projekt Digitálnej Pomoci — stavia mosty medzi headless webmi a AI automatizáciou.",
};

export default function ONasPage() {
  return (
    <>
      <PageHero
        eyebrow="O nás"
        title="Veríme v synergiu človeka a AI"
        description="AI Nexus Link je technologická vetva Digitálnej Pomoci — vyvíjame nástroje, ktoré automatizujú a zrýchľujú weby našich klientov."
      />

      <section aria-label="Naša vízia" className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="mb-4 text-3xl font-semibold tracking-[-1px]">Naša vízia</h2>
        <p className="mb-6 leading-relaxed text-white/70">
          Weby dnes musia byť rýchle, sémanticky správne a schopné pracovať s AI agentmi rovnako dobre ako s ľuďmi.
          Preto stavia AI Nexus Link headless architektúru, kde CMS spravuje obsah a Next.js ho doručuje bleskovo —
          a AI agenti sa starajú o opakujúcu sa prácu okolo SEO, obsahu a starostlivosti o zákazníkov.
        </p>
        <p className="leading-relaxed text-white/70">
          Nechceme nahradiť ľudí — chceme im dať späť čas na to, na čom skutočne záleží.
        </p>
      </section>
    </>
  );
}
