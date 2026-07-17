import { heroBullets, stats } from "@/lib/content";
import { CallbackForm } from "./callback-form";

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      {/* Glow orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[180px] left-[8%] size-[520px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.28)_0%,rgba(99,102,241,0)_70%)] blur-[40px] animate-[orb-float_14s_ease-in-out_infinite]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[120px] top-60 size-[460px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.20)_0%,rgba(168,85,247,0)_70%)] blur-[40px] animate-[orb-float-2_18s_ease-in-out_infinite]"
      />

      <header className="relative z-[5] mx-auto grid max-w-[1320px] items-center gap-12 px-5 pb-[88px] pt-[130px] sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pt-[150px]">
        <div className="flex flex-col gap-[22px]">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-400/10 px-4 py-[7px] text-[13px] text-indigo-300">
            <span className="size-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
            Pre firmy a ľudí, ktorí chcú rásť bez stresu
          </div>
          <h1 className="text-balance text-[40px] font-extrabold leading-[1.06] tracking-[-0.03em] text-white sm:text-[56px]">
            Nahraďte rutinnú prácu a{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              ušetrite hodiny týždenne
            </span>
          </h1>
          <p className="max-w-[520px] text-pretty text-lg leading-relaxed text-fog-400">
            Napojíme AI nástroje na váš e‑mail, fakturáciu či web v priebehu
            dní. Bez zložitej integrácie, s výsledkami od prvého mesiaca.
          </p>
          <ul className="flex flex-col gap-3">
            {heroBullets.map((text) => (
              <li
                key={text}
                className="flex items-start gap-2.5 text-[15.5px] leading-normal text-fog-200"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 shrink-0"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {text}
              </li>
            ))}
          </ul>
          <div className="mt-1.5 flex flex-wrap gap-3.5">
            <a
              href="#kontakt"
              className="inline-flex items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 px-7 py-3.5 text-base font-semibold text-white shadow-[0_0_32px_rgba(99,102,241,0.45)] transition-shadow hover:shadow-[0_0_48px_rgba(99,102,241,0.65)]"
            >
              Zistiť, kde vám AI ušetrí čas
            </a>
            <a
              href="#sluzby"
              className="inline-flex items-center rounded-xl border border-white/[0.12] bg-white/[0.05] px-6 py-3.5 text-base font-medium text-fog-100 backdrop-blur-md transition-colors hover:bg-white/[0.10] hover:text-white"
            >
              Naše služby
            </a>
          </div>
        </div>

        <CallbackForm />
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
