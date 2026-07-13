import { fetchLatestPosts, type WPPost } from "@/lib/wp";
import BlogSection from "./components/BlogSection";

export default async function AINexusLink() {
  // Fetch latest WP posts server-side; fail gracefully.
  let posts: WPPost[] = [];
  try {
    posts = await fetchLatestPosts(3);
  } catch {
    posts = [];
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1a1a1a_0%,#0a0a0a_60%)]" />

      {/* HERO */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-6">
        {/* Logo / Brand mark */}
        <div className="mb-8 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-[#ff6b35]" />
          <span className="text-sm font-medium tracking-[3px] text-white/60 uppercase">INTELIGENTNÝ ORCHESTRÁTOR</span>
        </div>

        {/* Hero heading */}
        <h1 translate="no" className="text-center text-[72px] md:text-[96px] font-semibold tracking-[-4.5px] leading-[0.9] mb-6">
          AI Nexus Link
        </h1>

        {/* Tagline */}
        <p className="max-w-2xl text-center text-2xl md:text-3xl text-white/70 tracking-[-0.8px] leading-tight mb-12">
          Prepoj Next.js frontend s Directus backendom.<br />Automatizuj. Optimalizuj. Škáluj.
        </p>

        {/* Premium CTA button */}
        <a
          href="#get-started"
          className="group relative inline-flex h-14 items-center justify-center rounded-full bg-[#ff6b35] px-10 text-lg font-medium text-black transition-all duration-300 hover:bg-[#ff8c5c] hover:shadow-[0_0_40px_rgba(255,107,53,0.4)] active:scale-[0.985]"
        >
          Začať s AI Nexus Link
          <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
        </a>

        {/* Subtle footer hint */}
        <div className="absolute bottom-12 text-xs tracking-[2px] text-white/30 font-mono">
          POWERED BY DIRECTUS + NEXT.JS
        </div>
      </div>

      {/* FEATURES */}
      <div className="relative max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <div className="text-[#ff6b35] text-sm tracking-[3px] uppercase mb-3">FUNKCIE</div>
          <h2 className="text-5xl font-semibold tracking-[-2px]">Všetko, čo potrebuješ</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Headless CMS", desc: "Directus ako plnohodnotný headless backend s plnou kontrolou obsahu." },
            { title: "AI Automatizácia", desc: "Inteligentné agenty pre automatizáciu obsahu, SEO a marketingu." },
            { title: "Brutálna rýchlosť", desc: "Next.js App Router + edge rendering. Okamžité načítanie." },
          ].map((feature, i) => (
            <div
              key={i}
              className="group rounded-3xl border border-white/10 bg-white/[0.025] backdrop-blur-xl p-8 transition-all hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div className="h-1.5 w-8 bg-[#ff6b35] rounded-full mb-8" />
              <h3 className="text-2xl font-semibold tracking-[-0.5px] mb-4">{feature.title}</h3>
              <p className="text-white/60 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="relative border-t border-white/10 bg-black/40 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-[#ff6b35] text-sm tracking-[3px] uppercase mb-3">PROCES</div>
            <h2 className="text-5xl font-semibold tracking-[-2px]">Ako to funguje</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Prepojenie dát", desc: "Directus spravuje obsah a API." },
              { step: "02", title: "AI Spracovanie", desc: "Agent automatizuje procesy." },
              { step: "03", title: "Rýchly Frontend", desc: "Next.js doručí bleskovú aplikáciu." },
            ].map((item, i) => (
              <div key={i} className="flex flex-col">
                <div className="text-[#ff6b35] font-mono text-sm tracking-[4px] mb-4">{item.step}</div>
                <h3 translate="no" className="text-3xl font-semibold tracking-[-1px] mb-4">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BLOG — latest posts from headless WordPress */}
      <BlogSection posts={posts} />

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-white/50">
          <div>© {new Date().getFullYear()} AI Nexus Link. Všetky práva vyhradené.</div>
          <div className="flex gap-8">
            <a href="#features" className="hover:text-white transition-colors">Funkcie</a>
            <a href="#how" className="hover:text-white transition-colors">Ako to funguje</a>
            <a href="#docs" className="hover:text-white transition-colors">Dokumentácia</a>
            <a href="#contact" className="hover:text-white transition-colors">Kontakt</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
