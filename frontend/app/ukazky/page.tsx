import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { templates } from "@/templates/registry";

export const metadata: Metadata = {
  title: "Ukážky šablón",
  description:
    "Interné portfólio odvetvových webových šablón. Živé ukážky úrovne, na ktorej staviame weby na kľúč.",
};

/**
 * Index portfólia `/ukazky` — zoznam odvetvových šablón z registra.
 * Kým register neobsahuje žiadnu hotovú šablónu, zobrazí prázdny stav
 * (žiadny fiktívny obsah). Celá vetva `/ukazky/*` je `noindex` (viď layout).
 */
export default function UkazkyPage() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <Navbar />
      <main className="mx-auto flex max-w-[880px] flex-col gap-8 px-5 pb-16 pt-[130px] sm:px-8 lg:pb-24 lg:pt-[150px]">
        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-indigo-500">
            Portfólio
          </span>
          <h1 className="text-4xl font-extrabold tracking-[-0.025em] text-ink lg:text-[44px]">
            Ukážky šablón
          </h1>
          <p className="max-w-[560px] text-pretty text-[17px] leading-relaxed text-mist-500">
            Odvetvové webové šablóny na úrovni, akú staviame klientom na kľúč.
            Interné demo — reálna referencia je digitalnapomoc.sk.
          </p>
        </div>

        {templates.length === 0 ? (
          <p className="rounded-2xl border border-line bg-cloud px-6 py-8 text-[15px] text-mist-500">
            Zatiaľ tu nie sú žiadne šablóny. Základ knižnice je pripravený —
            prvá odvetvová šablóna pribudne v ďalšom míľniku.
          </p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2">
            {templates.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/ukazky/${t.slug}`}
                  className="flex h-full flex-col gap-2 rounded-2xl border border-line bg-cloud px-6 py-6 transition-colors hover:border-indigo-300"
                >
                  <span className="text-lg font-bold text-ink">{t.industry}</span>
                  <span className="text-[15px] leading-relaxed text-mist-500">
                    {t.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}
