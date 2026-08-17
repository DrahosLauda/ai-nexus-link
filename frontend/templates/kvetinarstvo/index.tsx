/**
 * Balík šablóny „kvetinárstvo" — Boma Flora. Skladá `TemplateEntry` pre register:
 * shell (fonty + navbar + pätička) a zoznam všetkých stránok (cesta → render + meta).
 * Domov má prázdnu cestu `""`, blog detail `blog/<slug>` pre každý demo článok,
 * katalóg kytíc `kytice` + `kytice/<slug>` pre každú kyticu.
 */
import type { TemplateEntry, TemplatePage } from "../registry";
import { blogClanky, brand, meta } from "./content";
import { vsetkyKytice } from "./katalog";
import { FloraShell } from "./layout";
import { AtelierPage } from "./pages/atelier";
import { BlogPage } from "./pages/blog";
import { BlogDetailPage } from "./pages/blog-detail";
import { DomovPage } from "./pages/domov";
import { KontaktPage } from "./pages/kontakt";
import { KyticaDetailPage } from "./pages/kytica-detail";
import { KyticePage } from "./pages/kytice";
import { ObchodPage } from "./pages/obchod";
import { PonukaPage } from "./pages/ponuka";
import { SvadbyPage } from "./pages/svadby";

const staticke: TemplatePage[] = [
  { path: "", meta: meta.domov, render: () => <DomovPage /> },
  { path: "kytice", meta: meta.kytice, render: () => <KyticePage /> },
  { path: "ponuka", meta: meta.ponuka, render: () => <PonukaPage /> },
  { path: "svadby", meta: meta.svadby, render: () => <SvadbyPage /> },
  { path: "obchod", meta: meta.obchod, render: () => <ObchodPage /> },
  { path: "blog", meta: meta.blog, render: () => <BlogPage /> },
  { path: "atelier", meta: meta.atelier, render: () => <AtelierPage /> },
  { path: "kontakt", meta: meta.kontakt, render: () => <KontaktPage /> },
];

const detailyKytic: TemplatePage[] = vsetkyKytice().map((kytica) => ({
  path: `kytice/${kytica.slug}`,
  meta: {
    title: `${kytica.nazov} — ${brand.meno} Trenčín`,
    description: `${kytica.perex} ${kytica.trvacnost}, doručenie po Trenčíne.`,
    ogTitle: `${kytica.nazov} — ${brand.meno}`,
    ogDescription: kytica.perex,
  },
  render: () => <KyticaDetailPage kytica={kytica} />,
}));

const detailyBlogu: TemplatePage[] = blogClanky.map((clanok) => ({
  path: `blog/${clanok.slug}`,
  meta: {
    title: `${clanok.titulok} — Boma Flora`,
    description: clanok.perex,
    ogTitle: clanok.titulok,
    ogDescription: clanok.perex,
  },
  render: () => <BlogDetailPage clanok={clanok} />,
}));

export const kvetinarstvo: TemplateEntry = {
  slug: "kvetinarstvo",
  industry: "Kvetinárstvo",
  description:
    "Boma Flora — kvetinový ateliér v centre Trenčína. Viacstránkový editorial web s katalógom hotových kytíc, meninami, svadbami a blogom.",
  shell: (page) => FloraShell(page),
  pages: [...staticke, ...detailyKytic, ...detailyBlogu],
};
