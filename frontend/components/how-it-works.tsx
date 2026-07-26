import { steps } from "@/lib/content";

export function HowItWorks() {
  return (
    <div id="postup" className="scroll-mt-16 bg-white">
      <section className="mx-auto flex max-w-[1320px] flex-col gap-10 px-5 py-16 sm:px-10 lg:py-24">
        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-indigo-600">
            Postup
          </span>
          <h2 className="text-4xl font-extrabold tracking-[-0.025em] text-ink lg:text-[42px]">
            Ako to funguje
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.num}
              className="flex flex-col gap-4 rounded-[20px] border border-line bg-white p-8 shadow-[0_8px_28px_rgba(23,23,50,0.05)] transition-[border-color,box-shadow] duration-250 hover:border-indigo-300 hover:shadow-[0_14px_40px_rgba(99,102,241,0.14)]"
            >
              <div className="grid size-10 place-items-center rounded-[10px] border border-indigo-100 bg-indigo-50 text-[15px] font-bold text-indigo-600">
                {step.num}
              </div>
              <h3 className="text-xl font-bold text-ink">{step.title}</h3>
              <p className="text-[15px] leading-relaxed text-mist-500">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
