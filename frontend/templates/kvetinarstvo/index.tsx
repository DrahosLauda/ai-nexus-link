/**
 * Balík šablóny „kvetinárstvo" — Boma Flora. Skladá `TemplateEntry` pre register:
 * shell (fonty + navbar + pätička) a zoznam všetkých stránok (cesta → render + meta).
 * Domov má prázdnu cestu `""`, blog detail `blog/<slug>` pre každý demo článok.
 */
import type { TemplateEntry, TemplatePage } from "../registry";
import { blogClanky, meta } from "./content";
import { FloraShell } from "./layout";
import { AtelierPage } from "./pages/atelier";
import { BlogPage } from "./pages/blog";
import { BlogDetailPage } from "./pages/blog-detail";
import { DomovPage } from "./pages/domov";
import { KontaktPage } from "./pages/kontakt";
import { ObchodPage } from "./pages/obchod";
import { PonukaPage } from "./pages/ponuka";
import { SvadbyPage } from "./pages/svadby";

const staticke: TemplatePage[] = [
  { path: "", meta: meta.domov, render: () => <DomovPage /> },
  { path: "ponuka", meta: meta.ponuka, render: () => <PonukaPage /> },
  { path: "svadby", meta: meta.svadby, render: () => <SvadbyPage /> },
  { path: "obchod", meta: meta.obchod, render: () => <ObchodPage /> },
  { path: "blog", meta: meta.blog, render: () => <BlogPage /> },
  { path: "atelier", meta: meta.atelier, render: () => <AtelierPage /> },
  { path: "kontakt", meta: meta.kontakt, render: () => <KontaktPage /> },
];

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
  description: "Boma Flora — kvetinový ateliér v centre Trenčína. Viacstránkový editorial web s meninami, sezónnou ponukou, svadbami a blogom.",
  shell: (page) => FloraShell(page),
  pages: [...staticke, ...detailyBlogu],
};
