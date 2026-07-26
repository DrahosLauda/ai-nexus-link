import { stats } from "@/lib/content";

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-night">
      {/* Glow orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[120px] left-1/2 size-[620px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.28)_0%,rgba(99,102,241,0)_70%)] blur-[40px] animate-[orb-float_16s_ease-in-out_infinite]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[120px] top-40 size-[520px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.22)_0%,rgba(168,85,247,0)_70%)] blur-[40px] animate-[orb-float-2_18s_ease-in-out_infinite]"
      />

      <header className="relative z-[5] mx-auto flex max-w-[880px] flex-col items-center gap-6 px-5 pb-[72px] pt-[130px] text-center sm:px-10 lg:pt-[160px]">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.05] px-4 py-[7px] text-[13px] text-fog-200 backdrop-blur-md">
          <span className="size-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
          AI automatizácia pre malé firmy
        </div>
        <h1 className="text-balance text-[42px] font-extrabold leading-[1.05] tracking-[-0.03em] text-white sm:text-[60px]">
          Digitálna pomoc, ktorá{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            pracuje za vás
          </span>
        </h1>
        <p className="max-w-[600px] text-pretty text-lg leading-relaxed text-fog-400">
          Pomáhame malým firmám a jednotlivcom zvládnuť digitálny svet — od AI
          chatbotov po automatizáciu rutinných úloh. Ľudsky a bez žargónu.
        </p>
        <div className="mt-2 flex flex-col justify-center gap-3.5 sm:flex-row">
          <a
            href="#kontakt"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 px-7 py-3.5 text-base font-semibold text-white shadow-[0_0_32px_rgba(99,102,241,0.45)] transition-shadow hover:shadow-[0_0_48px_rgba(99,102,241,0.65)]"
          >
            Rezervovať bezplatnú konzultáciu
          </a>
          <a
            href="#sluzby"
            className="inline-flex items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.05] px-7 py-3.5 text-base font-medium text-fog-100 backdrop-blur-md transition-colors hover:bg-white/[0.10] hover:text-white"
          >
            Pozrieť služby
          </a>
        </div>
      </header>

      {/* Stats */}
      <section
        aria-label="Štatistiky"
        className="relative z-[5] mx-auto max-w-[1320px] px-5 pb-[88px] sm:px-10"
      >
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.value}
              className="flex flex-col gap-1.5 rounded-2xl border border-white/[0.06] bg-white/[0.04] p-6 backdrop-blur-2xl transition-colors duration-250 hover:border-indigo-400/60"
            >
              <div className="text-[34px] font-extrabold tracking-[-0.02em] text-white">
                {stat.value}
              </div>
              <div className="text-[13.5px] leading-[1.45] text-fog-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
