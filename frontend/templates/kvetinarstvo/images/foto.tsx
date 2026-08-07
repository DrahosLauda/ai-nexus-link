/**
 * `Foto` — reálna fotka cez `next/image`, alebo placeholder, keď fotka ešte nie je.
 *
 * Kým dopĺňame kurátorské fotky po jednej, sekcie volajú `Foto` s voliteľným
 * `src`: ak je vyplnené, vyrenderuje sa optimalizovaná fotka pri rovnakom pomere
 * strán (žiadny CLS); ak chýba, spadne späť na `FloraFigure` placeholder.
 * Cesty k fotkám žijú v `images/media.ts` (médiálna vrstva, mimo textov).
 */
import Image from "next/image";
import { FloraFigure, type Odtien, type Pomer } from "./placeholder";

const POMER_AR: Record<Pomer, string> = {
  "16/9": "16 / 9",
  "21/9": "21 / 9",
  "4/5": "4 / 5",
  "3/4": "3 / 4",
  "3/2": "3 / 2",
  "1/1": "1 / 1",
};

export function Foto({
  src,
  alt,
  pomer,
  odtien,
  arch = false,
  className = "",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: {
  src?: string;
  alt: string;
  pomer: Pomer;
  odtien?: Odtien;
  arch?: boolean;
  className?: string;
  sizes?: string;
}) {
  if (!src) {
    return <FloraFigure alt={alt} pomer={pomer} odtien={odtien} arch={arch} className={className} />;
  }
  return (
    <div
      className={`relative overflow-hidden bg-flora-sand ${arch ? "flora-arch" : "rounded-flora-lg"} ${className}`}
      style={{ aspectRatio: POMER_AR[pomer] }}
    >
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}
