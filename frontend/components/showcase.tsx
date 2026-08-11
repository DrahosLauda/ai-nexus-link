import Image from "next/image";
import Link from "next/link";

/**
 * Sekcia „Ukážky" na domovskej stránke — portfólio odvetvových šablón.
 * Featured karta vedie priamo na živú ukážku (kvetinárstvo Boma Flora),
 * nadpis aj spodný odkaz na celý index `/ukazky`. Screenshot je reálny záber
 * šablóny (`public/ukazky/kvetinarstvo.jpg`). Kým je šablóna jedna, featured
 * karta je veľká; ďalšie šablóny sa pridajú ako mriežka.
 */
export function Showcase() {
  return (
    <div id="ukazky" className="scroll-mt-16 bg-white text-ink">
      <section className="mx-auto flex max-w-[1320px] flex-col gap-12 px-5 py-16 sm:px-10 lg:py-24">
        <div className="flex flex-col gap-3.5">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-indigo-500">
            Ukážky
          </span>
          <h2 className="text-4xl font-extrabold tracking-[-0.025em] text-ink lg:text-[44px]">
            Weby, aké staviame
          </h2>
          <p className="max-w-[620px] text-pretty text-[17px] leading-relaxed text-mist-500">
            Plnohodnotné viacstránkové weby na kľúč — nie šablóna z fotobanky.
            Toto je prvá z knižnice odvetvových šablón; každú prispôsobíme vašej
            firme, textom aj fotkám.
          </p>
        </div>

        {/* Featured ukážka — celá karta je odkaz na živé demo */}
        <Link
          href="/ukazky/kvetinarstvo"
          className="group grid overflow-hidden rounded-[24px] border border-line bg-white shadow-[0_8px_28px_rgba(23,23,50,0.05)] transition-[border-color,box-shadow] duration-250 hover:border-indigo-300 hover:shadow-[0_16px_44px_rgba(99,102,241,0.16)] lg:grid-cols-[1.55fr_1fr]"
        >
          {/* „Prehliadačový" rám okolo reálneho screenshotu */}
          <div className="flex flex-col bg-cloud">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <span className="size-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
              <span className="size-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
              <span className="size-3 rounded-full bg-[#28c840]" aria-hidden="true" />
              <span className="ml-3 truncate rounded-md bg-white px-3 py-1 text-[12px] text-mist-400">
                digitalnapomoc.sk/ukazky/kvetinarstvo
              </span>
            </div>
            <div className="relative aspect-[1280/832] w-full overflow-hidden">
              <Image
                src="/ukazky/kvetinarstvo.jpg"
                alt="Ukážka webu kvetinárstva Boma Flora — domovská stránka s hero kyticou"
                fill
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />
            </div>
          </div>

          {/* Textová strana */}
          <div className="flex flex-col justify-center gap-3 p-8 lg:p-10">
            <span className="text-[13px] font-bold uppercase tracking-[0.12em] text-indigo-500">
              Kvetinárstvo
            </span>
            <span className="text-2xl font-extrabold tracking-[-0.02em] text-ink">
              Boma Flora
            </span>
            <p className="text-[15.5px] leading-relaxed text-mist-500">
              Kvetinový ateliér — objednávka kytíc, svadby a eventy, blog aj
              meniny. Sedem stránok, vlastný dizajn, reálne fotky. Ukážková
              značka na demo obsahu.
            </p>
            <span className="mt-2 inline-flex items-center gap-1.5 text-[15px] font-semibold text-indigo-600">
              Pozrieť živú ukážku
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </div>
        </Link>

        <div>
          <Link
            href="/ukazky"
            className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-mist-700 transition-colors hover:text-indigo-600"
          >
            Všetky ukážky
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
