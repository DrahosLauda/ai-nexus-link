import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findPage, findTemplate, templates } from "@/templates/registry";

type Props = { params: Promise<{ odvetvie: string; page?: string[] }> };

// Len zaregistrované šablóny a ich stránky; neznáme cesty → 404.
export const dynamicParams = false;
// Meniny (podpisový prvok) sa musia prepnúť o polnoci → ISR ≤ 1 h.
export const revalidate = 3600;

// Enumeruj pre každú šablónu všetky jej stránky: "" (domov) + podstránky.
export function generateStaticParams() {
  const out: { odvetvie: string; page: string[] }[] = [];
  for (const t of templates) {
    for (const p of t.pages) {
      out.push({ odvetvie: t.slug, page: p.path === "" ? [] : p.path.split("/") });
    }
  }
  return out;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { odvetvie, page } = await params;
  const template = findTemplate(odvetvie);
  if (!template) return {};
  const strankaMeta = findPage(template, page ?? [])?.meta;
  if (!strankaMeta) return {};
  return {
    // `absolute` obíde template `%s – digitalnapomoc.sk` z koreňového layoutu.
    title: { absolute: strankaMeta.title },
    description: strankaMeta.description,
    openGraph: {
      title: strankaMeta.ogTitle ?? strankaMeta.title,
      description: strankaMeta.ogDescription ?? strankaMeta.description,
    },
    // robots noindex sa dedí z app/ukazky/layout.tsx — tu ho nepridávame.
  };
}

/**
 * Mount bod viacstránkovej odvetvovej šablóny. Podľa `[odvetvie]` resolne balík
 * z registra a podľa zvyšku cesty jeho stránku; obalí ju „shellom" šablóny
 * (navbar, pätička, fonty, `.flora-root`). Celá vetva `/ukazky/*` je `noindex`.
 */
export default async function UkazkaPage({ params }: Props) {
  const { odvetvie, page } = await params;
  const template = findTemplate(odvetvie);
  if (!template) notFound();
  const stranka = findPage(template, page ?? []);
  if (!stranka) notFound();
  return template.shell(stranka.render());
}
