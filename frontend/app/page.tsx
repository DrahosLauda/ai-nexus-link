import Link from "next/link";
import { fetchLatestPosts, type WPPost } from "@/lib/wp";
import BlogSection from "./components/BlogSection";
import HomeChatWidget from "./components/HomeChatWidget";
import ComparisonSection from "./components/home/ComparisonSection";
import SavingsCalculator from "./components/home/SavingsCalculator";

export default async function AINexusLink() {
  // Fetch latest WP posts server-side; fail gracefully.
  let posts: WPPost[] = [];
  try {
    posts = await fetchLatestPosts(3);
  } catch {
    posts = [];
  }

  return (
    <div className="bg-gray-50 text-gray-900">
      {/* HERO */}
      <section className="relative overflow-hidden pb-16 pt-20">
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <span className="mb-6 inline-block rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
            🚀 Headless architektúra + AI automatizácia
          </span>
          <h1 translate="no" className="mb-6 text-5xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
            Nahraďte pomalý web <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              jednou AI platformou
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-500">
            AI Nexus Link prepája rýchly Next.js frontend s headless CMS a AI agentmi, ktorí sa starajú o obsah,
            SEO aj e-commerce — automaticky.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/kontakt"
              className="rounded-lg bg-blue-600 px-8 py-4 font-bold text-white shadow-xl transition hover:-translate-y-1 hover:bg-blue-700 hover:shadow-2xl"
            >
              Získať audit webu zdarma
            </Link>
            <a
              href="#problem"
              className="rounded-lg border border-gray-200 bg-white px-8 py-4 font-bold text-gray-700 shadow-md transition hover:bg-gray-50"
            >
              Prečo prejsť na headless?
            </a>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 z-0 opacity-30">
          <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-purple-300 mix-blend-multiply blur-3xl filter" />
          <div className="absolute right-10 top-20 h-72 w-72 rounded-full bg-blue-300 mix-blend-multiply blur-3xl filter" />
        </div>
      </section>

      {/* PROBLEM / SOLUTION */}
      <ComparisonSection />

      {/* TIME SAVED CALCULATOR */}
      <SavingsCalculator />

      {/* FEATURES */}
      <section aria-labelledby="features-heading" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <span className="text-sm font-bold uppercase tracking-wider text-blue-600">Ekosystém</span>
            <h2 id="features-heading" className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
              Všetko, čo potrebujete
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-500">
              Moduly sú navzájom prepojené — obsah, SEO a e-commerce automatizácia bežia na jednej headless
              platforme.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: "🔌",
                title: "Headless CMS",
                desc: "WordPress alebo Directus ako plnohodnotný headless backend s plnou kontrolou obsahu.",
              },
              {
                icon: "🤖",
                title: "AI Automatizácia",
                desc: "Inteligentní agenti automatizujú tvorbu obsahu, SEO optimalizáciu aj marketing.",
              },
              {
                icon: "⚡",
                title: "Brutálna rýchlosť",
                desc: "Next.js App Router s edge renderingom pre okamžité načítanie stránok.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition duration-300 hover:shadow-xl"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-3xl transition group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="border-t border-gray-100 bg-gray-900 py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">Pripravení zjednodušiť svoj web?</h2>
          <p className="mb-10 text-lg text-gray-400">
            Dohodnite si nezáväznú konzultáciu a ukážeme vám, ako AI Nexus Link ušetrí váš čas aj náklady na
            údržbu webu.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/kontakt"
              className="rounded-lg bg-blue-600 px-8 py-4 font-bold text-white shadow-xl transition hover:bg-blue-500"
            >
              Dohodnúť konzultáciu
            </Link>
            <Link
              href="/sluzby"
              className="rounded-lg border border-gray-600 px-8 py-4 font-bold text-white transition hover:bg-gray-800"
            >
              Pozrieť služby
            </Link>
          </div>
        </div>
      </section>

      {/* BLOG — latest posts from headless WordPress */}
      <BlogSection posts={posts} />

      <HomeChatWidget />
    </div>
  );
}
