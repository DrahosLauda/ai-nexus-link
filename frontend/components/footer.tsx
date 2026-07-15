const linkClasses = "text-[13.5px] text-fog-500 transition-colors hover:text-fog-200";

export function Footer() {
  return (
    <footer className="relative z-[5] border-t border-white/[0.07] bg-night">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-5 pb-6 pt-14 sm:grid-cols-2 sm:px-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center gap-2.5">
            <div className="grid size-7 place-items-center rounded-[7px] bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-extrabold text-white">
              d
            </div>
            <span className="text-[15px] font-bold text-white">
              digitalnapomoc.sk
            </span>
          </div>
          <p className="max-w-[280px] text-[13.5px] leading-relaxed text-fog-500">
            Pomáhame malým firmám a jednotlivcom automatizovať rutinnú prácu
            pomocou AI — ľudsky a bez žargónu.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-bold text-white">Spoločnosť</span>
          <a href="#sluzby" className={linkClasses}>Služby</a>
          <a href="#postup" className={linkClasses}>Ako to funguje</a>
          <a href="#blog" className={linkClasses}>Blog</a>
          <a href="#kontakt" className={linkClasses}>Kontakt</a>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-bold text-white">Služby</span>
          <a href="#sluzby" className={linkClasses}>AI chatboty</a>
          <a href="#sluzby" className={linkClasses}>Automatizácia procesov</a>
          <a href="#sluzby" className={linkClasses}>Weby a e‑shopy</a>
          <a href="#sluzby" className={linkClasses}>Digitálna pomoc 1:1</a>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-bold text-white">Kontakt</span>
          <a href="mailto:info@digitalnapomoc.sk" className={linkClasses}>
            info@digitalnapomoc.sk
          </a>
          <a href="tel:+421900000000" className={linkClasses}>
            +421 900 000 000
          </a>
          <span className="text-[13.5px] text-fog-500">PO–PI 8:00–17:00</span>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] px-5 pb-7 pt-5 sm:px-10">
        <span className="text-[12.5px] text-fog-600">
          © 2026 digitalnapomoc.sk. Všetky práva vyhradené.
        </span>
        <div className="flex gap-5 text-[12.5px]">
          <a href="#kontakt" className="text-fog-600 transition-colors hover:text-fog-300">
            Ochrana súkromia
          </a>
          <a href="#kontakt" className="text-fog-600 transition-colors hover:text-fog-300">
            Obchodné podmienky
          </a>
        </div>
      </div>
    </footer>
  );
}
