import { testimonials } from "@/lib/content";

export function Testimonials() {
  return (
    <div id="referencie" className="scroll-mt-16 bg-cloud text-ink">
      <section className="mx-auto flex max-w-[1320px] flex-col gap-12 px-5 py-16 sm:px-10 lg:py-24">
        <div className="flex flex-col items-center gap-3.5 text-center">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-indigo-500">
            Referencie
          </span>
          <h2 className="text-4xl font-extrabold tracking-[-0.025em] text-ink lg:text-[44px]">
            Čo hovoria klienti
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.initials}
              className="flex flex-col justify-between gap-5 rounded-[20px] border border-line bg-white p-8 shadow-[0_8px_28px_rgba(23,23,50,0.05)] transition-[border-color,box-shadow] duration-250 hover:border-indigo-300 hover:shadow-[0_14px_40px_rgba(99,102,241,0.14)]"
            >
              <blockquote className="text-[15.5px] leading-[1.65] text-mist-700">
                „{t.quote}“
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-bold text-white">
                  {t.initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-ink">
                    {t.name}
                  </span>
                  <span className="text-[12.5px] text-mist-400">{t.role}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
