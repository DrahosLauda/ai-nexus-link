import Link from "next/link";

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
          <Link href="/#sluzby" className={linkClasses}>Služby</Link>
          <Link href="/#postup" className={linkClasses}>Ako to funguje</Link>
          <Link href="/blog" className={linkClasses}>Blog</Link>
          <Link href="/#kontakt" className={linkClasses}>Kontakt</Link>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-bold text-white">Služby</span>
          <Link href="/#sluzby" className={linkClasses}>AI chatboty</Link>
          <Link href="/#sluzby" className={linkClasses}>Automatizácia procesov</Link>
          <Link href="/#sluzby" className={linkClasses}>Weby a e‑shopy</Link>
          <Link href="/#sluzby" className={linkClasses}>Digitálna pomoc 1:1</Link>
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
          <Link href="/#kontakt" className="text-fog-600 transition-colors hover:text-fog-300">
            Ochrana súkromia
          </Link>
          <Link href="/#kontakt" className="text-fog-600 transition-colors hover:text-fog-300">
            Obchodné podmienky
          </Link>
        </div>
      </div>
    </footer>
  );
}
