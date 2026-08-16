"use client";

/**
 * Vizuál skladanej kytice (K1). Z výberu z konfigurátora (počty kvetov) skladá
 * DETERMINISTICKY kyticu vrstvením jednotlivých stoniek do vejára — reaguje na
 * každý klik okamžite, bez AI a bez latencie.
 *
 * Každá stonka = stalka + hlava kvetu. Hlava je PNG výrez (keď existuje —
 * `konfiguratorVyrezy` v `images/media.ts`), inak vektorová silueta podľa
 * `tvar` (fallback, aby jadro fungovalo aj bez generovaných assetov).
 *
 * Motion: „stem-in“ — nová stonka sa zasunie zdola do väzby (transform+opacity,
 * GPU). Presun celého vejára pri zmene výberu je jemná `transform` transícia.
 * `prefers-reduced-motion` rieši globálne `theme.css` (durations → 0) → prvky
 * sa len objavia na správnom mieste. Celý vizuál je dekoratívny (`role="img"`),
 * záväzný obsah nesie textový súhrn (`aria-live`) vedľa.
 */
import Image from "next/image";
import { type CSSProperties, useMemo } from "react";
import {
  type Kvet,
  type KvetTvar,
  konfiguratorFarby,
  konfiguratorKvety,
  konfiguratorObsah,
} from "../content";
import { konfiguratorVyrezy } from "../images/media";

/** Strop vykreslených stoniek (cena/súčet ostávajú presné — počítajú sa inde). */
const MAX_STONKY = 30;

type Stonka = { key: string; kvet: Kvet };

/** Stabilné 0–1 „semienko“ z reťazca — na rozloženie rovnakých kvetov vo vejári. */
function semienko(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000;
}

/** Rovnomerné podvzorkovanie zoznamu na najviac `max` prvkov (deterministické). */
function vzorkuj<T>(arr: T[], max: number): T[] {
  if (arr.length <= max) return arr;
  const out: T[] = [];
  for (let i = 0; i < max; i++) out.push(arr[Math.round((i * (arr.length - 1)) / (max - 1))]);
  return out;
}

/** Zeleň a plnivo idú do pozadia vejára; ostatné kvety sú „focal“ v popredí. */
const DO_POZADIA: ReadonlySet<KvetTvar> = new Set<KvetTvar>(["zelen", "drobne"]);

type Umiestnena = Stonka & { uhol: number; dlzka: number; z: number; velkost: number; delay: number };

/** Rozloží stonky jednej vrstvy do vejára — rovnomerne a s premiešanými druhmi. */
function rozlozVrstvu(
  stonky: Stonka[],
  { fan, baseDlzka, zubatost, zBase, velkost }: { fan: number; baseDlzka: number; zubatost: number; zBase: number; velkost: number },
): Umiestnena[] {
  // Rovnaké kvety rozprestri po [0,1) a rôzne druhy navzájom premiešaj (offset).
  const zoradene = stonky
    .map((s) => {
      const pocet = stonky.filter((x) => x.kvet.id === s.kvet.id).length;
      const poradieVDruhu = stonky.filter((x) => x.kvet.id === s.kvet.id && x.key < s.key).length;
      const spread = ((poradieVDruhu + 0.5) / pocet + semienko(s.kvet.id)) % 1;
      return { s, spread };
    })
    .sort((a, b) => a.spread - b.spread)
    .map((x) => x.s);

  const M = zoradene.length;
  return zoradene.map((s, i) => {
    const t = M === 1 ? 0.5 : i / (M - 1); // 0..1 zľava doprava
    const stred = Math.abs(t - 0.5) * 2; // 0 v strede, 1 na kraji
    return {
      ...s,
      uhol: (t - 0.5) * fan,
      dlzka: baseDlzka * (1 - zubatost * stred),
      z: zBase + Math.round((1 - stred) * 18),
      velkost,
      delay: Math.min(i, 12) * 45,
    };
  });
}

export function KyticaVizual({ pocty }: { pocty: Record<string, number> }) {
  const t = konfiguratorObsah.nahlad;

  const { umiestnene, popis, prazdne } = useMemo(() => {
    // Ploché stonky v poradí dátovej sady (stabilné).
    const vsetky: Stonka[] = [];
    for (const kvet of konfiguratorKvety) {
      const n = pocty[kvet.id] ?? 0;
      for (let j = 0; j < n; j++) vsetky.push({ key: `${kvet.id}-${String(j).padStart(2, "0")}`, kvet });
    }
    if (vsetky.length === 0) {
      return { umiestnene: [] as Umiestnena[], popis: t.popisPrazdny, prazdne: true };
    }

    const pozadie = vzorkuj(vsetky.filter((s) => DO_POZADIA.has(s.kvet.tvar)), Math.round(MAX_STONKY * 0.4));
    const popredie = vzorkuj(vsetky.filter((s) => !DO_POZADIA.has(s.kvet.tvar)), MAX_STONKY - pozadie.length);

    const umiestnene = [
      ...rozlozVrstvu(pozadie, { fan: 104, baseDlzka: 74, zubatost: 0.1, zBase: 0, velkost: 0.72 }),
      ...rozlozVrstvu(popredie, { fan: 78, baseDlzka: 66, zubatost: 0.17, zBase: 24, velkost: 1 }),
    ];

    // Prístupný popis — z reálneho výberu (nie z podvzorkovaného vejára).
    const vybrane = konfiguratorKvety.filter((k) => (pocty[k.id] ?? 0) > 0);
    const casti = vybrane.slice(0, 6).map((k) => `${pocty[k.id]}× ${k.nazov}`);
    const popis = `${t.popisZaklad} ${casti.join(", ")}${vybrane.length > 6 ? ` ${t.viac}` : ""}.`;

    return { umiestnene, popis, prazdne: false };
  }, [pocty, t]);

  const skryte = umiestnene.length > 0
    ? Object.values(pocty).reduce((s, n) => s + n, 0) - umiestnene.length
    : 0;

  return (
    <figure className="kv-nahlad" role="img" aria-label={popis}>
      <div className="kv-scena" aria-hidden="true">
        {prazdne ? (
          <p className="kv-prazdne">{konfiguratorObsah.nahlad.prazdne}</p>
        ) : (
          umiestnene.map((s) => {
            const farba = konfiguratorFarby[s.kvet.farba];
            const vyrez = konfiguratorVyrezy[s.kvet.id];
            return (
              <span
                key={s.key}
                className="kv-stonka"
                style={
                  {
                    "--uhol": `${s.uhol}deg`,
                    "--dlzka": `${s.dlzka}%`,
                    "--vel": s.velkost,
                    zIndex: s.z,
                  } as CSSProperties
                }
              >
                <span className="kv-stonka-in" style={{ animationDelay: `${s.delay}ms` }}>
                  {vyrez ? (
                    // Fotorežim: PNG výrez je CELÁ stonka (kvet hore, stonka po
                    // spodný okraj = väzbu), otočená vo vejári. Bez CSS stalky/siluety.
                    <span className="kv-foto">
                      <Image src={vyrez} alt="" fill sizes="160px" className="object-contain object-bottom" />
                    </span>
                  ) : (
                    // Fallback: vektorová stalka + silueta hlavy (kým nie je fotka).
                    <>
                      <span className="kv-stalka" />
                      <span className="kv-hlava">
                        <KvetHlava tvar={s.kvet.tvar} hex={farba.hex} svetla={farba.svetla} />
                      </span>
                    </>
                  )}
                </span>
              </span>
            );
          })
        )}
      </div>
      {skryte > 0 ? (
        <figcaption className="kv-skryte">+{skryte}</figcaption>
      ) : null}
    </figure>
  );
}

/**
 * Vektorová silueta hlavy kvetu podľa tvaru (fallback, kým nie je PNG výrez).
 * ViewBox 0 0 40 40, kvet vycentrovaný. `svetla` = svetlý kvet → jemný obrys,
 * aby bol viditeľný na papierovom podklade.
 */
function KvetHlava({ tvar, hex, svetla }: { tvar: KvetTvar; hex: string; svetla?: boolean }) {
  const stred = mix(hex, "#3a2a20", 0.28); // tmavší tón na jadro/tieň
  const svetlo = mix(hex, "#ffffff", 0.32);
  const obrys = svetla ? { stroke: mix(hex, "#7a6a52", 0.5), strokeWidth: 0.8 } : undefined;

  return (
    <svg viewBox="0 0 40 40" className="h-full w-full overflow-visible" focusable="false">
      {tvar === "ruza" ? (
        <g {...obrys} fill={hex}>
          <circle cx="20" cy="21" r="13" />
          <circle cx="20" cy="21" r="9.5" fill={svetlo} opacity="0.55" />
          <path d="M20 12a9 9 0 0 1 0 18 6.5 6.5 0 0 0 0-13 3.5 3.5 0 0 1 0-5z" fill={stred} opacity="0.7" />
          <circle cx="20" cy="21" r="3" fill={stred} />
        </g>
      ) : tvar === "gulata" ? (
        <g {...obrys} fill={hex}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <ellipse key={a} cx="20" cy="20" rx="5.4" ry="8.6" transform={`rotate(${a} 20 20)`} />
          ))}
          <circle cx="20" cy="20" r="7.5" fill={svetlo} />
          <circle cx="20" cy="20" r="3.2" fill={stred} opacity="0.6" />
        </g>
      ) : tvar === "lucna" ? (
        <g {...obrys} fill={hex}>
          {Array.from({ length: 12 }, (_, i) => i * 30).map((a) => (
            <ellipse key={a} cx="20" cy="9.5" rx="2.9" ry="7.5" transform={`rotate(${a} 20 20)`} />
          ))}
          <circle cx="20" cy="20" r="6" fill={stred} />
          <circle cx="20" cy="20" r="3.4" fill={mix(hex, "#5a3d1f", 0.5)} />
        </g>
      ) : tvar === "zvon" ? (
        <g {...obrys} fill={hex}>
          <path d="M20 6c6 3 8 9 8 15 0 7-3.6 12-8 12s-8-5-8-12c0-6 2-12 8-15z" />
          <path d="M20 6c3 3 4 9 4 15 0 7-1.6 12-4 12z" fill={svetlo} opacity="0.6" />
          <path d="M20 9c-3.4 2.6-5 8-5 13" fill="none" stroke={stred} strokeWidth="1.1" opacity="0.55" />
        </g>
      ) : tvar === "klas" ? (
        <g {...obrys} fill={hex}>
          {Array.from({ length: 7 }, (_, i) => i).map((i) => (
            <g key={i} transform={`translate(0 ${5 + i * 4.4})`}>
              <ellipse cx="16.4" cy="20" rx="3" ry="2.2" />
              <ellipse cx="23.6" cy="20" rx="3" ry="2.2" fill={svetlo} opacity="0.85" />
            </g>
          ))}
        </g>
      ) : tvar === "zelen" ? (
        <g>
          <path d="M20 38C20 26 20 14 20 4" fill="none" stroke={mix(hex, "#2c3f2a", 0.4)} strokeWidth="1.4" strokeLinecap="round" />
          {Array.from({ length: 6 }, (_, i) => i).map((i) => {
            const y = 8 + i * 5;
            const left = i % 2 === 0;
            return (
              <ellipse
                key={i}
                cx={left ? 13.5 : 26.5}
                cy={y}
                rx="6"
                ry="3.4"
                fill={i % 2 === 0 ? hex : svetlo}
                transform={`rotate(${left ? -32 : 32} ${left ? 13.5 : 26.5} ${y})`}
              />
            );
          })}
        </g>
      ) : (
        // drobne — plnivo (gypsomilka): rozsypané drobné kvietky
        <g {...obrys} fill={hex}>
          {[
            [20, 8], [13, 13], [27, 13], [10, 22], [20, 20], [30, 22], [15, 30], [25, 30], [20, 34],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 3.2 : 2.3} />
          ))}
        </g>
      )}
    </svg>
  );
}

/** Zmieša dve hex farby v pomere `p` (0 = a, 1 = b). Malý helper pre tiene/svetlá. */
function mix(a: string, b: string, p: number): string {
  const pa = parse(a);
  const pb = parse(b);
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * p));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
function parse(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}
