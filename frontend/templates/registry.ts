/**
 * Register odvetvových šablón — jediné miesto pravdy o tom, ktoré šablóny
 * existujú. Číta ho index `/ukazky` (zoznam) aj mount `/ukazky/[odvetvie]`.
 *
 * Nová šablóna (napr. kvetinárstvo v míľniku M2) sa sem pridá jedným záznamom:
 * balík žije v `frontend/templates/<slug>/`, `render` mountne jeho stránku.
 * Kým je zoznam prázdny, `/ukazky/*` vracia 404 (žiadny fiktívny obsah).
 */
import type { ReactNode } from "react";

export type TemplateEntry = {
  /** URL segment aj názov priečinka balíka, napr. "kvetinarstvo". */
  slug: string;
  /** Ľudský názov odvetvia, napr. "Kvetinárstvo". */
  industry: string;
  /** Krátky popis šablóny pre index `/ukazky` (a interné meta). */
  description: string;
  /** Mount balíka — vráti stránku šablóny z `templates/<slug>/`. */
  render: () => ReactNode;
};

export const templates: TemplateEntry[] = [];

export function findTemplate(slug: string): TemplateEntry | undefined {
  return templates.find((t) => t.slug === slug);
}
