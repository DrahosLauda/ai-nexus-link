/**
 * Obrazový placeholder systém šablóny.
 *
 * Cieľ finálnej šablóny sú kurátorské reálne fotografie (Unsplash/Pexels) — viď
 * `images/LICENSES.md`. Kým nie sú vložené, tu je palete verný placeholder:
 * teplé plochy + jemný botanický motív v SVG. Rezervuje miesto cez `aspect-ratio`
 * (žiadny CLS), nesie `alt` cez `role="img"` a podporuje arch orez (`.flora-arch`).
 *
 * Zámerne NIE `next/image` — nejde o rastrový súbor na optimalizáciu, ale o
 * inline vektor. Po dodaní fotiek sa `FloraFigure` nahradí `next/image` so `sizes`
 * bez zmeny rozvrhu (rovnaké pomery strán).
 */
import type { CSSProperties } from "react";

export type Pomer = "16/9" | "21/9" | "4/5" | "3/4" | "3/2" | "1/1";

/** Farebné varianty placeholderu, aby galéria/karty neboli uniformné. */
export type Odtien = "paper" | "sand" | "sage" | "clay" | "blush" | "night";

const ODTIENE: Record<Odtien, { od: string; do: string; kvet: string; stonka: string }> = {
  paper: { od: "#faf6ef", do: "#eadfce", kvet: "#c07856", stonka: "#7c9878" },
  sand: { od: "#f2ebdd", do: "#e1d3ba", kvet: "#9a4a2e", stonka: "#4e7255" },
  sage: { od: "#e7ebdf", do: "#cfd9c6", kvet: "#af5b3c", stonka: "#3b5a44" },
  clay: { od: "#f6e3d8", do: "#ecc9b5", kvet: "#9a4a2e", stonka: "#4e7255" },
  blush: { od: "#f5e7de", do: "#e9cfc2", kvet: "#af5b3c", stonka: "#55645a" },
  night: { od: "#1e3528", do: "#22392b", kvet: "#c07856", stonka: "#7c9878" },
};

/** Deterministický „výber" motívu podľa altu — rovnaký obrázok = rovnaký motív. */
function seed(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h;
}

function Kvetina({ x, kvet, stonka, r }: { x: number; kvet: string; stonka: string; r: number }) {
  // Jednoduchý štylizovaný kvet: stonka + koruna z lupienkov. Dekoratívne.
  const cy = 60;
  return (
    <g transform={`translate(${x} 0)`}>
      <path d={`M0 100 C -2 ${cy + 14} 2 ${cy + 10} 0 ${cy}`} stroke={stonka} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d={`M0 ${cy + 20} q -12 -6 -18 -18 q 12 2 18 12`} fill={stonka} opacity="0.75" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse key={a} cx="0" cy={cy} rx="4.6" ry="10.5" fill={kvet} opacity="0.9" transform={`rotate(${a} 0 ${cy})`} />
      ))}
      <circle cx="0" cy={cy} r={r} fill={stonka} opacity="0.9" />
    </g>
  );
}

export function FloraFigure({
  alt,
  pomer,
  odtien = "paper",
  arch = false,
  fill = false,
  className = "",
  style,
}: {
  alt: string;
  pomer: Pomer;
  odtien?: Odtien;
  arch?: boolean;
  /** Vyplní rodiča (`absolute inset-0`) namiesto rezervovania pomeru strán — pre hero. */
  fill?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const c = ODTIENE[odtien];
  const s = seed(alt);
  const pocet = 3 + (s % 3); // 3–5 kvetov
  const rozostup = 200 / (pocet + 1);
  const stred = odtien === "night" ? "#183021" : c.kvet;
  const gid = `flora-grad-${s.toString(36)}`;

  return (
    <div
      role="img"
      aria-label={alt}
      className={`${fill ? "absolute inset-0 h-full w-full" : "relative"} overflow-hidden bg-flora-sand ${
        arch ? "flora-arch" : fill ? "" : "rounded-flora-lg"
      } ${className}`}
      style={fill ? style : { aspectRatio: pomer.replace("/", " / "), ...style }}
    >
      <svg
        viewBox="0 0 200 120"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0" stopColor={c.od} />
            <stop offset="1" stopColor={c.do} />
          </linearGradient>
        </defs>
        <rect width="200" height="120" fill={`url(#${gid})`} />
        {/* jemný „horizont" pre hĺbku */}
        <ellipse cx="100" cy="128" rx="150" ry="34" fill={stred} opacity="0.08" />
        {Array.from({ length: pocet }, (_, i) => (
          <Kvetina
            key={i}
            x={rozostup * (i + 1)}
            kvet={c.kvet}
            stonka={c.stonka}
            r={3 + ((s >> i) % 3)}
          />
        ))}
      </svg>
    </div>
  );
}
