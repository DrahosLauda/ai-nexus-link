/**
 * Register odvetvových šablón — jediné miesto pravdy o tom, ktoré šablóny
 * existujú a aké majú stránky. Číta ho index `/ukazky` (zoznam) aj mount
 * `/ukazky/[odvetvie]/[[...page]]` (viacstránkové routovanie).
 *
 * Balík žije v `frontend/templates/<slug>/` a exportuje jeden `TemplateEntry`.
 * Nová šablóna = jeden import + jeden riadok v poli `templates` nižšie.
 */
import type { ReactNode } from "react";
import { kvetinarstvo } from "./kvetinarstvo";

/** Meta pre jednu stránku šablóny (aj keď je vetva `noindex`, hlavička je čistá). */
export type TemplatePageMeta = {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
};

/** Jedna stránka viacstránkovej šablóny. */
export type TemplatePage = {
  /** Segmenty cesty za slugom šablóny; `""` = domovská stránka.
   *  Napr. "ponuka", "blog", "blog/preco-v-auguste-viazeme-dalie". */
  path: string;
  meta: TemplatePageMeta;
  /** Vyrenderuje obsah stránky (bez „shellu" — ten dodá `shell`). */
  render: () => ReactNode;
};

export type TemplateEntry = {
  /** URL segment aj názov priečinka balíka, napr. "kvetinarstvo". */
  slug: string;
  /** Ľudský názov odvetvia, napr. "Kvetinárstvo". */
  industry: string;
  /** Krátky popis šablóny pre index `/ukazky` (a interné meta). */
  description: string;
  /** Obal každej stránky — navbar, pätička, fonty, `.flora-root`, theme. */
  shell: (page: ReactNode) => ReactNode;
  /** Všetky stránky šablóny (domov + podstránky). */
  pages: TemplatePage[];
};

export const templates: TemplateEntry[] = [kvetinarstvo];

export function findTemplate(slug: string): TemplateEntry | undefined {
  return templates.find((t) => t.slug === slug);
}

/** Nájde stránku šablóny podľa segmentov cesty (`[]` = domov). */
export function findPage(
  template: TemplateEntry,
  segments: string[],
): TemplatePage | undefined {
  const path = segments.join("/");
  return template.pages.find((p) => p.path === path);
}
