"use client";

/**
 * Hero Domova (M2b) — SCROLL-ovládané video: kytica sa počas scrollovania
 * rozvinie a rozletí do kvetinového venca (Kling 3.0, start→end frame).
 *
 * Mantinely kvality (docs/sablony-kvalita.md):
 * - Statický `poster` (prvý snímok) drží LCP a je fallback bez JS.
 * - Scroll-scrub sa zapne LEN na väčších obrazovkách s jemným ukazovateľom a
 *   bez `prefers-reduced-motion`; inak ostáva elegantný statický layout
 *   (na mobile skladaný: fotka hore, text pod ňou na papieri = plný kontrast).
 * - Video je `muted playsInline`, animuje sa len `currentTime` (žiadny layout).
 * - Text vľavo, tmavý atrament na svetlom papieri — video má kyticu vpravo.
 */
import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { href } from "../base";
import { homeHero } from "../content";

const POSTER = "/kvetinarstvo/hero-poster.jpg";
const POSTER_ALT =
  "Ručne viazaná kytica dálií, záhradných ruží a hortenzií v prírodnom papieri";
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/**
 * Scroll-scrub zapneme len na väčších obrazovkách s jemným ukazovateľom a bez
 * `prefers-reduced-motion`. `useSyncExternalStore` je SSR-bezpečné (server →
 * `false` → statický layout) a reaguje na zmenu média bez `setState` v efekte.
 */
const SCRUB_QUERIES = [
  "(prefers-reduced-motion: reduce)",
  "(pointer: coarse)",
  "(max-width: 768px)",
];

function subscribeScrub(onChange: () => void): () => void {
  const mqs = SCRUB_QUERIES.map((q) => window.matchMedia(q));
  mqs.forEach((m) => m.addEventListener("change", onChange));
  return () => mqs.forEach((m) => m.removeEventListener("change", onChange));
}

function useScrubCapable(): boolean {
  return useSyncExternalStore(
    subscribeScrub,
    () => !SCRUB_QUERIES.some((q) => window.matchMedia(q).matches),
    () => false,
  );
}

/** Textový obsah hera (eyebrow + nadpis + perex + CTA). */
function HeroCopy() {
  return (
    <div className="max-w-[32rem]">
      <span className="text-flora-eyebrow font-semibold uppercase tracking-[0.14em] text-flora-clay-600">
        Kvetinový ateliér · Trenčín
      </span>
      <h1 className="mt-3 max-w-[19ch] text-flora-hero font-flora-display font-medium text-balance text-flora-ink sm:max-w-[22ch]">
        {homeHero.h1}
      </h1>
      <p className="mt-5 max-w-[42ch] text-flora-lead text-pretty text-flora-moss">
        {homeHero.podnadpis}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={href(homeHero.ctaPrimarna.href)}
          className="inline-flex min-h-[48px] items-center rounded-flora-pill bg-flora-clay-600 px-7 text-[15px] font-semibold text-white transition-colors hover:bg-flora-clay-700"
        >
          {homeHero.ctaPrimarna.label}
        </Link>
        <Link
          href={href(homeHero.ctaSekundarna.href)}
          className="inline-flex min-h-[48px] items-center rounded-flora-pill border border-flora-ink/30 px-7 text-[15px] font-semibold text-flora-ink transition-colors hover:bg-flora-ink/5"
        >
          {homeHero.ctaSekundarna.label}
        </Link>
      </div>
    </div>
  );
}

/** Svetlý prechod zľava, aby text držal kontrast nad médiom (len na sm+ overlay). */
function LeftScrim() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 hidden sm:block sm:bg-gradient-to-r sm:from-flora-paper/90 sm:via-flora-paper/35 sm:to-transparent"
    />
  );
}

export function HomeHero() {
  const scrub = useScrubCapable();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Viaž `currentTime` videa na pozíciu scrollu v rámci sekcie.
  useEffect(() => {
    if (!scrub) return;
    const v = videoRef.current;
    const sec = sectionRef.current;
    if (!v || !sec) return;
    v.pause();
    let raf = 0;
    const update = () => {
      raf = 0;
      const scrollable = sec.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = clamp(-sec.getBoundingClientRect().top / scrollable, 0, 1);
      const dur = v.duration;
      if (Number.isFinite(dur) && dur > 0) v.currentTime = progress * dur * 0.999;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    if (v.readyState >= 1) update();
    else v.addEventListener("loadedmetadata", update, { once: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [scrub]);

  // Statický hero: mobil = skladaný (fotka + text pod), sm+ = poster + overlay text.
  if (!scrub) {
    return (
      <section className="relative isolate overflow-hidden bg-flora-paper sm:min-h-[100svh]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={POSTER}
          alt={POSTER_ALT}
          className="h-[52svh] w-full object-cover sm:absolute sm:inset-0 sm:h-full sm:translate-x-[12%] sm:scale-[1.08]"
          fetchPriority="high"
        />
        <LeftScrim />
        <div className="relative sm:absolute sm:inset-0 sm:flex sm:items-center">
          <div className="mx-auto w-full max-w-[1200px] px-flora-gutter py-12 sm:py-0">
            <HeroCopy />
          </div>
        </div>
      </section>
    );
  }

  // Scroll-scrub hero: vysoká sekcia + prilepené video, ktoré scroll „prehráva".
  return (
    <section ref={sectionRef} className="relative h-[170vh] bg-flora-paper">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover translate-x-[12%] scale-[1.08]"
          poster={POSTER}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src="/kvetinarstvo/hero.webm" type="video/webm" />
          <source src="/kvetinarstvo/hero.mp4" type="video/mp4" />
        </video>
        <LeftScrim />
        <div className="relative mx-auto flex h-full w-full max-w-[1200px] items-center px-flora-gutter">
          <HeroCopy />
        </div>
      </div>
    </section>
  );
}
