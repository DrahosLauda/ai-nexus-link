"use client";

import { useState } from "react";
import { faqs } from "@/lib/content";

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <div id="faq" className="scroll-mt-16 bg-cloud text-ink">
      <section className="mx-auto flex max-w-[860px] flex-col gap-10 px-5 py-16 sm:px-10 lg:py-24">
        <div className="flex flex-col items-center gap-3.5 text-center">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-indigo-500">
            FAQ
          </span>
          <h2 className="text-4xl font-extrabold tracking-[-0.025em] text-ink lg:text-[44px]">
            Časté otázky
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={faq.q}
                className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_4px_16px_rgba(23,23,50,0.04)] transition-colors duration-250 hover:border-indigo-300"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left text-[16.5px] font-semibold text-ink transition-colors hover:bg-[#fafafe]"
                >
                  {faq.q}
                  <span
                    className={`shrink-0 text-xl text-indigo-500 transition-transform duration-200 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <p className="px-6 pb-5 text-[15px] leading-[1.65] text-mist-500">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
