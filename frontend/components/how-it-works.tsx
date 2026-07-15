import { steps } from "@/lib/content";

export function HowItWorks() {
  return (
    <div id="postup" className="scroll-mt-16 bg-night">
      <section className="mx-auto flex max-w-[1320px] flex-col gap-10 px-5 py-16 sm:px-10 lg:py-24">
        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-indigo-400">
            Postup
          </span>
          <h2 className="text-4xl font-extrabold tracking-[-0.025em] text-white lg:text-[42px]">
            Ako to funguje
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.num}
              className="flex flex-col gap-4 rounded-[20px] border border-white/[0.06] bg-white/[0.04] p-8 backdrop-blur-2xl transition-[border-color,box-shadow] duration-250 hover:border-indigo-400/65 hover:shadow-[0_0_32px_rgba(99,102,241,0.15)]"
            >
              <div className="grid size-10 place-items-center rounded-[10px] border border-indigo-400/25 bg-indigo-400/[0.12] text-[15px] font-bold text-indigo-400">
                {step.num}
              </div>
              <h3 className="text-xl font-bold text-white">{step.title}</h3>
              <p className="text-[15px] leading-relaxed text-fog-400">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
