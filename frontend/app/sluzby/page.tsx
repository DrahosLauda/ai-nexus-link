import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "../components/PageHero";

export const metadata: Metadata = {
  title: "Služby",
  description:
    "AI SEO optimalizácia, headless transformácia WordPressu na Next.js a automatizácia e-commerce procesov.",
};

const SERVICES = [
  {
    title: "AI SEO Optimalizácia",
    description:
      "Autonómne prepisovanie článkov a meta tagov pomocou AI agentov, ktorí sledujú výkonnosť obsahu a priebežne ho vylepšujú.",
  },
  {
    title: "Headless Transformácia",
    description:
      "Zrýchlenie existujúceho WordPressu vytvorením samostatného Next.js frontendu — WordPress ostáva len ako headless CMS.",
  },
  {
    title: "E-commerce automatizácia",
    description:
      "Záchrana opustených košíkov a personalizované AI zľavy, ktoré zvyšujú konverzný pomer bez manuálnej práce.",
  },
];

export default function SluzbyPage() {
  return (
    <>
      <PageHero
        eyebrow="Služby"
        title="Riešenia postavené na AI Nexus Link"
        description="Konkrétne služby, ktorými pomáhame firmám automatizovať a zrýchliť ich weby."
      />

      <section aria-label="Zoznam služieb" className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-6 md:grid-cols-3">
          {SERVICES.map((service) => (
            <article
              key={service.title}
              className="rounded-3xl border border-white/10 bg-white/[0.025] p-8 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div className="mb-8 h-1.5 w-8 rounded-full bg-[#ff6b35]" />
              <h2 className="mb-4 text-2xl font-semibold tracking-[-0.5px]">{service.title}</h2>
              <p className="leading-relaxed text-white/60">{service.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/kontakt"
            className="inline-flex h-14 items-center justify-center rounded-full bg-[#ff6b35] px-10 text-lg font-medium text-black transition-all duration-300 hover:bg-[#ff8c5c] hover:shadow-[0_0_40px_rgba(255,107,53,0.4)]"
          >
            Prekonzultovať projekt
          </Link>
        </div>
      </section>
    </>
  );
}
