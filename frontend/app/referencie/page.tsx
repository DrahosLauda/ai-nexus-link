import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "../components/PageHero";

export const metadata: Metadata = {
  title: "Referencie",
  description: "Prípadové štúdie a výsledky projektov realizovaných cez AI Nexus Link.",
};

export default function ReferenciePage() {
  return (
    <>
      <PageHero
        eyebrow="Referencie"
        title="Prípadové štúdie"
        description="Konkrétne čísla a výsledky projektov, na ktorých pracujeme."
      />

      <section aria-label="Zoznam referencií" className="mx-auto max-w-3xl px-6 py-24 text-center">
        <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-12 backdrop-blur-xl">
          <h2 className="mb-4 text-2xl font-semibold tracking-[-0.5px]">
            Prvé prípadové štúdie pripravujeme
          </h2>
          <p className="mb-8 leading-relaxed text-white/60">
            Čoskoro tu nájdeš konkrétne výsledky a čísla z projektov, ktoré realizujeme s klientmi. Ak chceš byť
            jedným z prvých, ozvi sa nám.
          </p>
          <Link
            href="/kontakt"
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#ff6b35] px-8 font-medium text-black transition-all duration-300 hover:bg-[#ff8c5c]"
          >
            Kontaktovať nás
          </Link>
        </div>
      </section>
    </>
  );
}
