import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { SavingsCalculator } from "@/components/savings-calculator";

export const metadata: Metadata = {
  title: "Headless WordPress",
  description:
    "Čo je headless WordPress a koľko ušetríte na pluginoch. Známy WordPress admin zostáva, moderný Next.js frontend dodáme my — rýchly, bezpečný web bez pluginového pekla.",
  alternates: { canonical: "/headless-wordpress" },
};

/** Kroky toku obsahu — jednoduché vizuálne vysvetlenie headless architektúry. */
const FLOW = [
  {
    emoji: "📝",
    title: "WordPress (admin)",
    text: "Píšete obsah po starom, v známom admine. Zostáva vám — len ho návštevník nikdy nevidí.",
  },
  {
    emoji: "⚡",
    title: "Náš Next.js frontend",
    text: "Moderný, bleskovo rýchly web, ktorý číta obsah z WordPressu a pridáva dizajn, SEO aj AI.",
  },
  {
    emoji: "😊",
    title: "Návštevník",
    text: "Vidí len rýchly, pekný a bezpečný web. Žiadne spomalené pluginy, žiadne „vyrobené vo WP“.",
  },
];

const BENEFITS = [
  { emoji: "⚡", title: "Blesková rýchlosť", text: "Frontend je oddelený od WordPressu — žiadne ťažké pluginy, ktoré web spomaľujú." },
  { emoji: "🔒", title: "Vyššia bezpečnosť", text: "WordPress je skrytý na pozadí, verejnosť sa k nemu nedostane. Menšia útočná plocha." },
  { emoji: "🧩", title: "Žiadne konflikty", text: "Funkcie (SEO, formuláre, cache) máme natívne vo frontende — nič sa „nebije“." },
  { emoji: "🤖", title: "AI agenti 24/7", text: "Obsah a SEO tvoria naši agenti automaticky — namiesto ďalších platených pluginov." },
  { emoji: "🔎", title: "SEO & GEO v základe", text: "Optimalizované pre Google aj AI vyhľadávače (ChatGPT, Perplexity) — bez pluginu." },
  { emoji: "✍️", title: "Známy admin", text: "Obsah spravujete vo WordPresse, na ktorý ste zvyknutí. Mení sa len to, čo vidí návštevník." },
];

export default function HeadlessWordPressPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <Navbar variant="light" />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-24 left-[8%] size-80 rounded-full bg-indigo-300/30 blur-3xl" />
            <div className="absolute -top-10 right-[6%] size-80 rounded-full bg-violet-300/30 blur-3xl" />
          </div>
          <div className="mx-auto max-w-[900px] px-5 pb-16 pt-[130px] text-center sm:px-8 lg:pb-20 lg:pt-[160px]">
            <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1 text-[13px] font-semibold text-indigo-600">
              Moderný web bez pluginového pekla
            </span>
            <h1 className="mt-6 text-balance text-4xl font-extrabold tracking-[-0.03em] text-ink sm:text-5xl lg:text-6xl">
              Headless{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                WordPress
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-[600px] text-pretty text-[18px] leading-relaxed text-mist-500">
              Váš známy WordPress zostáva na obsah. My k nemu dodáme moderný,
              rýchly a bezpečný frontend — a nahradíme drahé pluginy. Pozrite sa,
              čo to je a koľko ušetríte.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="#kalkulacka"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5"
              >
                Spočítať úsporu
              </Link>
              <Link
                href="#co-je"
                className="inline-flex items-center justify-center rounded-xl border border-line bg-white px-7 py-3.5 font-semibold text-mist-700 transition hover:border-mist-400/60"
              >
                Čo je headless?
              </Link>
            </div>
          </div>
        </section>

        {/* ČO JE HEADLESS */}
        <section id="co-je" className="bg-cloud py-20 lg:py-24">
          <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
            <div className="mx-auto max-w-[640px] text-center">
              <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-indigo-600">
                Ako to funguje
              </span>
              <h2 className="mt-2 text-balance text-3xl font-extrabold tracking-[-0.02em] text-ink lg:text-4xl">
                Čo je headless WordPress?
              </h2>
              <p className="mt-4 text-[17px] leading-relaxed text-mist-500">
                „Headless“ znamená, že WordPress oddelíme od vzhľadu. Ostane vám
                len ako sklad obsahu — návštevníkom ho ukáže náš moderný frontend.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {FLOW.map((step, i) => (
                <div key={step.title} className="relative">
                  <div className="flex h-full flex-col gap-3 rounded-2xl border border-line bg-white p-7 shadow-sm">
                    <div className="grid size-12 place-items-center rounded-xl bg-indigo-50 text-2xl">
                      {step.emoji}
                    </div>
                    <h3 className="text-lg font-bold text-ink">{step.title}</h3>
                    <p className="text-[14.5px] leading-relaxed text-mist-500">
                      {step.text}
                    </p>
                  </div>
                  {i < FLOW.length - 1 && (
                    <span className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-2xl text-mist-400 md:block">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PLUGINOVÉ PEKLO VS HEADLESS */}
        <section className="py-20 lg:py-24">
          <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
            <div className="mx-auto max-w-[640px] text-center">
              <h2 className="text-balance text-3xl font-extrabold tracking-[-0.02em] text-ink lg:text-4xl">
                Prečo „zadarmo“ WordPress nakoniec stojí viac
              </h2>
              <p className="mt-4 text-[17px] leading-relaxed text-mist-500">
                Klasický web potrebuje na plnú funkčnosť množstvo platených
                pluginov, ktoré ho spomaľujú a treba ich udržiavať.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-4 rounded-3xl border border-red-100 bg-red-50/40 p-8">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-full bg-red-100 text-xl">
                    ⚠️
                  </span>
                  <h3 className="text-xl font-bold text-ink">
                    Klasický WordPress
                  </h3>
                </div>
                <ul className="flex flex-col gap-3 text-[15px] text-mist-700">
                  {[
                    "5–10 platených pluginov, ktoré sa navzájom „bijú“",
                    "Pomalé načítanie kvôli množstvu skriptov",
                    "Neustále aktualizácie a bezpečnostné diery",
                    "Za každú funkciu ďalší mesačný poplatok",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2.5">
                      <span className="mt-0.5 text-red-500">✕</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-4 rounded-3xl border-2 border-indigo-200 bg-white p-8 shadow-lg shadow-indigo-500/5">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-full bg-indigo-100 text-xl">
                    ✅
                  </span>
                  <h3 className="text-xl font-bold text-ink">
                    Headless riešenie
                  </h3>
                </div>
                <ul className="flex flex-col gap-3 text-[15px] text-mist-700">
                  {[
                    "Funkcie natívne vo frontende — žiadne konflikty",
                    "Blesková rýchlosť (výborné hodnotenie v PageSpeed)",
                    "WordPress skrytý = menšia útočná plocha",
                    "SEO, formuláre aj obsah rieši náš systém a AI agenti",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2.5">
                      <span className="mt-0.5 text-emerald-500">✓</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* KALKULAČKA */}
        <section id="kalkulacka" className="bg-cloud py-20 lg:py-24">
          <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
            <div className="mx-auto max-w-[640px] text-center">
              <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-indigo-600">
                Kalkulačka úspor
              </span>
              <h2 className="mt-2 text-balance text-3xl font-extrabold tracking-[-0.02em] text-ink lg:text-4xl">
                Koľko platíte zbytočne?
              </h2>
              <p className="mt-4 text-[17px] leading-relaxed text-mist-500">
                Zaškrtnite, čo dnes používate. Tieto funkcie v headless riešení
                nahrádzame frontendom a AI agentmi — uvidíte, koľko ušetríte.
              </p>
            </div>

            <div className="mt-12">
              <SavingsCalculator />
            </div>
          </div>
        </section>

        {/* VÝHODY */}
        <section className="py-20 lg:py-24">
          <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
            <div className="mx-auto max-w-[640px] text-center">
              <h2 className="text-balance text-3xl font-extrabold tracking-[-0.02em] text-ink lg:text-4xl">
                Čo tým získate
              </h2>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {BENEFITS.map((b) => (
                <div
                  key={b.title}
                  className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-7 transition-shadow hover:shadow-md"
                >
                  <div className="grid size-12 place-items-center rounded-xl bg-violet-50 text-2xl">
                    {b.emoji}
                  </div>
                  <h3 className="text-[17px] font-bold text-ink">{b.title}</h3>
                  <p className="text-[14.5px] leading-relaxed text-mist-500">
                    {b.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 pb-20 sm:px-8 lg:pb-24">
          <div className="mx-auto max-w-[1120px] overflow-hidden rounded-3xl bg-ink px-6 py-14 text-center sm:px-12 lg:py-20">
            <h2 className="mx-auto max-w-[560px] text-balance text-3xl font-extrabold tracking-[-0.02em] text-white lg:text-4xl">
              Chcete moderný web bez pluginového pekla?
            </h2>
            <p className="mx-auto mt-4 max-w-[520px] text-[16.5px] leading-relaxed text-fog-400">
              Ukážeme vám na vašom webe, čo sa dá zmodernizovať a koľko ušetríte.
              Nezáväzne a zrozumiteľne.
            </p>
            <Link
              href="/#kontakt"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-8 py-4 font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5"
            >
              Nezáväzná konzultácia
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
