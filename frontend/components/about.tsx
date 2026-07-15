export function About() {
  return (
    <div className="bg-night">
      <section className="mx-auto max-w-[1320px] px-5 py-16 sm:px-10 lg:py-24">
        <div className="grid items-center gap-10 rounded-3xl border border-white/[0.06] bg-white/[0.04] p-7 backdrop-blur-2xl transition-colors duration-250 hover:border-indigo-400/50 sm:p-12 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col gap-3.5">
            <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-indigo-400">
              O nás
            </span>
            <h2 className="text-balance text-[28px] font-extrabold tracking-[-0.02em] text-white lg:text-[34px]">
              Malý tím, ktorý hovorí ľudskou rečou
            </h2>
            <p className="text-pretty text-[15.5px] leading-[1.65] text-fog-400">
              Sme technológovia, ktorí neznášajú žargón. Veríme, že AI a
              automatizácia majú slúžiť aj malej firme a bežnému človeku — nie
              len korporáciám. Preto všetko nastavíme, vysvetlíme a zostaneme
              na blízku, keď treba pomôcť.
            </p>
          </div>
          {/*
            Fotka tímu: uložte súbor do web/public/team.jpg a nahraďte tento
            placeholder komponentom <Image src="/team.jpg" … /> z next/image.
          */}
          <div className="grid h-[300px] place-items-center overflow-hidden rounded-2xl border border-dashed border-white/[0.15] bg-[linear-gradient(135deg,rgba(99,102,241,0.10),rgba(168,85,247,0.06))]">
            <span className="px-6 text-center text-sm text-fog-500">
              Fotka tímu
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
