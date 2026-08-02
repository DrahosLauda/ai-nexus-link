import Link from "next/link";
import type { ReactNode } from "react";

const cardClasses =
  "rounded-[20px] border border-line bg-white p-7 shadow-[0_8px_28px_rgba(23,23,50,0.05)] transition-[border-color,box-shadow] duration-250 hover:border-indigo-300 hover:shadow-[0_14px_40px_rgba(99,102,241,0.14)]";

type Service = {
  title: string;
  desc: string;
  tileClass: string;
  icon: ReactNode;
  href?: string;
};

/** Jednotné, rovnomerné kartičky služieb (3-stĺpcová mriežka, à la apertia). */
const services: Service[] = [
  {
    title: "AI chatboty a asistenti",
    desc: "Chatbot na vašom webe, ktorý odpovedá zákazníkom 24/7, aj interný asistent na e‑maily a ponuky.",
    tileClass: "bg-[#eef0ff]",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
      </svg>
    ),
  },
  {
    title: "Automatizácia procesov",
    desc: "Faktúry, objednávky a reporty, ktoré sa vybavia samy — bez ručného prepisovania.",
    tileClass: "bg-[#f4efff]",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4v16h16" />
        <path d="m4 20 7-7" />
        <path d="M14 4h6v6" />
        <path d="M20 4 11 13" />
      </svg>
    ),
  },
  {
    title: "Weby a e‑shopy",
    desc: "Moderný web na headless WordPresse — rýchly, bezpečný a bez pluginového pekla.",
    tileClass: "bg-[#eef0ff]",
    href: "/headless-wordpress",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
  {
    title: "AI obsah a SEO",
    desc: "Články a SEO tvoria AI agenti automaticky — viac návštev z Googla aj z AI vyhľadávačov.",
    tileClass: "bg-[#f4efff]",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
  },
  {
    title: "Digitálna pomoc 1:1",
    desc: "Trpezlivé zaškolenie do nástrojov — pre jednotlivcov aj celé tímy.",
    tileClass: "bg-[#eef0ff]",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z" />
        <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
      </svg>
    ),
  },
  {
    title: "Prepojenie nástrojov",
    desc: "Kalendár, fakturácia, CRM a e‑maily prepojené tak, aby dáta tiekli samy.",
    tileClass: "bg-[#f4efff]",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22v-9" />
        <path d="M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z" />
        <path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13" />
        <path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z" />
      </svg>
    ),
  },
  {
    title: "Rezervácie a objednávky",
    desc: "Online rezervačný systém s automatickými potvrdeniami — vyskúšajte ho naživo.",
    tileClass: "bg-[#eef0ff]",
    href: "/rezervacia",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
        <path d="m9 16 2 2 4-4" />
      </svg>
    ),
  },
];

function CardInner({ s }: { s: Service }) {
  return (
    <>
      <div className={`grid size-11 place-items-center rounded-xl ${s.tileClass}`}>
        {s.icon}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <h3 className="text-[19px] font-bold text-ink">{s.title}</h3>
        <p className="text-[14.5px] leading-[1.55] text-mist-500">{s.desc}</p>
      </div>
      {s.href && (
        <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-indigo-500">
          Zistiť viac →
        </span>
      )}
    </>
  );
}

export function Services() {
  return (
    <div id="sluzby" className="scroll-mt-16 bg-cloud text-ink">
      <section className="mx-auto flex max-w-[1320px] flex-col gap-12 px-5 py-16 sm:px-10 lg:py-24">
        <div className="flex flex-col items-center gap-3.5 text-center">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-indigo-500">
            Služby
          </span>
          <h2 className="text-4xl font-extrabold tracking-[-0.025em] text-ink lg:text-[44px]">
            S čím vám pomôžeme
          </h2>
          <p className="max-w-[560px] text-pretty text-[17px] leading-relaxed text-mist-500">
            Konkrétne digitálne služby, ktoré firmy a jednotlivci najčastejšie
            riešia s nami.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) =>
            s.href ? (
              <Link
                key={s.title}
                href={s.href}
                className={`${cardClasses} flex flex-col gap-5`}
              >
                <CardInner s={s} />
              </Link>
            ) : (
              <div key={s.title} className={`${cardClasses} flex flex-col gap-5`}>
                <CardInner s={s} />
              </div>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
