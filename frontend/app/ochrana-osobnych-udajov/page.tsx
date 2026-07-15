import type { Metadata } from "next";
import PageHero from "../components/PageHero";

export const metadata: Metadata = {
  title: "Ochrana osobných údajov",
  description: "Zásady spracúvania osobných údajov na webe digitalnapomoc.sk.",
};

export default function OchranaOsobnychUdajovPage() {
  return (
    <>
      <PageHero eyebrow="Právne informácie" title="Ochrana osobných údajov" />

      <section aria-label="Zásady ochrany osobných údajov" className="mx-auto max-w-3xl px-6 py-24">
        <div className="flex flex-col gap-10 leading-relaxed text-white/70">
          <div>
            <h2 className="mb-3 text-2xl font-semibold tracking-[-0.5px] text-white">Prevádzkovateľ</h2>
            <p>
              Prevádzkovateľom webu digitalnapomoc.sk a spracovateľom osobných údajov je Digitálna Pomoc.
              Kontaktovať nás môžeš na{" "}
              <a href="mailto:info@digitalnapomoc.sk" className="text-[#ff6b35] hover:text-[#ff8c5c]">
                info@digitalnapomoc.sk
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold tracking-[-0.5px] text-white">Aké údaje spracúvame</h2>
            <p>
              Pri vyplnení kontaktného formulára spracúvame meno, e-mailovú adresu a obsah správy — výhradne za
              účelom vybavenia tvojej požiadavky. Web ďalej môže používať cookies na meranie návštevnosti; ich
              použitie vieš spravovať cez nastavenia súhlasu s cookies.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold tracking-[-0.5px] text-white">Tvoje práva</h2>
            <p>
              V súlade s GDPR máš právo na prístup k svojim osobným údajom, ich opravu, vymazanie, obmedzenie
              spracúvania a prenosnosť. Žiadosť môžeš zaslať na e-mail uvedený vyššie.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
