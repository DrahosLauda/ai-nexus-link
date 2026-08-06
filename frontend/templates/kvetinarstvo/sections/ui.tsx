/**
 * Malé zdieľané UI primitívy šablóny (server-safe). Držia jednotný editorial
 * rytmus a značkové CTA. Odkazy stavajú cez `href()` z `base.ts` — kvôli liftu.
 */
import Link from "next/link";
import type { ReactNode } from "react";
import { href } from "../base";

/** Uppercase „eyebrow" štítok nad nadpisom (moss, letter-spacing z tokenu). */
export function Eyebrow({ children, tmava = false }: { children: ReactNode; tmava?: boolean }) {
  return (
    <span
      className={`text-flora-eyebrow font-semibold uppercase ${tmava ? "text-flora-clay-400" : "text-flora-500"}`}
    >
      {children}
    </span>
  );
}

/** Dvojica eyebrow + nadpis (h2) pre záhlavia sekcií. */
export function ZahlavieSekcie({
  eyebrow,
  nadpis,
  popis,
  tmava = false,
  zarovnanie = "left",
}: {
  eyebrow?: string;
  nadpis: string;
  popis?: string;
  tmava?: boolean;
  zarovnanie?: "left" | "center";
}) {
  return (
    <div className={`flex max-w-[52ch] flex-col gap-4 ${zarovnanie === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow ? <Eyebrow tmava={tmava}>{eyebrow}</Eyebrow> : null}
      <h2 className={`text-flora-h2 font-flora-display font-medium text-balance ${tmava ? "text-flora-paper" : "text-flora-ink"}`}>
        {nadpis}
      </h2>
      {popis ? (
        <p className={`text-flora-lead text-pretty ${tmava ? "text-flora-mist" : "text-flora-moss"}`}>{popis}</p>
      ) : null}
    </div>
  );
}

type CtaVariant = "primar" | "ghost" | "ghostTmava" | "text";

const CTA_ZAKLAD =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-flora-pill px-6 text-[15px] font-semibold transition-colors";

const CTA_VARIANTY: Record<CtaVariant, string> = {
  primar: "bg-flora-clay-600 text-white hover:bg-flora-clay-700",
  ghost:
    "border border-flora-500 text-flora-700 hover:bg-flora-100",
  ghostTmava:
    "border border-flora-mist/40 text-flora-paper hover:bg-white/10",
  text: "min-h-0 rounded-none px-0 text-flora-clay-600 underline decoration-1 underline-offset-4 hover:text-flora-clay-700",
};

/** Značkové CTA / odkaz. `k` je href v tvare z `content.ts` (prejde cez `href()`). */
export function Cta({
  k,
  variant = "primar",
  children,
}: {
  k: string;
  variant?: CtaVariant;
  children: ReactNode;
}) {
  return (
    <Link href={href(k)} className={`${CTA_ZAKLAD} ${CTA_VARIANTY[variant]}`}>
      {children}
    </Link>
  );
}

/** Obal jednej sekcie s vertikálnym rytmom a voliteľným podkladom. */
export function Sekcia({
  children,
  podklad = "paper",
  zhustena = false,
  className = "",
  ...rest
}: {
  children: ReactNode;
  podklad?: "paper" | "sand" | "porcelain" | "night" | "clay";
  zhustena?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLElement>) {
  const bg: Record<string, string> = {
    paper: "bg-flora-paper",
    sand: "bg-flora-sand",
    porcelain: "bg-flora-porcelain",
    night: "bg-flora-900",
    clay: "bg-flora-clay-600",
  };
  return (
    <section
      className={`${bg[podklad]} ${zhustena ? "py-flora-section-sm" : "py-flora-section"} ${className}`}
      {...rest}
    >
      <div className="mx-auto w-full max-w-[1200px] px-flora-gutter">{children}</div>
    </section>
  );
}
