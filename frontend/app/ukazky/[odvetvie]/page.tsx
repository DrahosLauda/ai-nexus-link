import { notFound } from "next/navigation";
import { findTemplate, templates } from "@/templates/registry";

type Props = { params: Promise<{ odvetvie: string }> };

// Predgeneruj len zaregistrované šablóny; neznáme cesty vráti 404.
export function generateStaticParams() {
  return templates.map((t) => ({ odvetvie: t.slug }));
}
export const dynamicParams = false;

/**
 * Mount bod odvetvovej šablóny — vyrenderuje balík z `templates/<odvetvie>/`
 * cez jeho `render()` z registra. Kým register neobsahuje šablónu daného slugu,
 * vráti 404. Celá vetva `/ukazky/*` je `noindex` (viď `../layout.tsx`).
 */
export default async function UkazkaPage({ params }: Props) {
  const { odvetvie } = await params;
  const template = findTemplate(odvetvie);
  if (!template) notFound();
  return template.render();
}
