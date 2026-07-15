import type { Metadata } from "next";
import PageHero from "../components/PageHero";
import ContactForm from "../components/ContactForm";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Ozvi sa nám ohľadom AI automatizácie a headless transformácie tvojho webu.",
};

export default function KontaktPage() {
  return (
    <>
      <PageHero eyebrow="Kontakt" title="Poďme prekonzultovať tvoj projekt" />

      <section aria-label="Kontaktný formulár a údaje" className="mx-auto grid max-w-4xl gap-16 px-6 py-24 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-semibold tracking-[-0.5px]">Kontaktné údaje</h2>
          <p className="mb-2 text-white/70">
            E-mail:{" "}
            <a href="mailto:info@digitalnapomoc.sk" className="text-[#ff6b35] hover:text-[#ff8c5c]">
              info@digitalnapomoc.sk
            </a>
          </p>
          <p className="text-white/70">Web: digitalnapomoc.sk</p>
        </div>

        <ContactForm />
      </section>
    </>
  );
}
