/**
 * Blog `/blog` — zoznam. Sub-hero, najnovší článok ako veľká karta (21:9),
 * mriežka ostatných (3:2). Fotografia nesie kartu, text je stručný. Arch tvar
 * sa na blogu nepoužíva (mäkké `rounded-flora-lg`).
 */
import Link from "next/link";
import { href } from "../base";
import { blogClanky, blogCta, blogSekcie, blogSubhero } from "../content";
import { CtaPas } from "../sections/bloky";
import { SubHero } from "../sections/hero";
import { Foto } from "../images/foto";
import { blogFotky } from "../images/media";
import { type Odtien } from "../images/placeholder";
import { Sekcia } from "../sections/ui";

const ODTIENE: Odtien[] = ["sage", "clay", "blush", "sand"];

export function BlogPage() {
  const [featured, ...ostatne] = blogClanky;

  return (
    <>
      <SubHero h1={blogSubhero.h1} text={blogSubhero.text} />

      <Sekcia podklad="paper">
        {/* Najnovší článok */}
        <Link href={href(`/blog/${featured.slug}`)} className="group grid gap-6 lg:grid-cols-2 lg:items-center">
          <Foto src={blogFotky[0]} alt={featured.obrazokAlt} pomer="21/9" odtien="sage" sizes="(max-width: 1024px) 100vw, 50vw" />
          <div className="flex flex-col gap-3">
            <span className="text-flora-small text-flora-moss">
              {featured.datum} · {featured.citanieMinut} min čítania
            </span>
            <h2 className="text-flora-h2 font-flora-display font-medium text-flora-ink group-hover:text-flora-clay-600">
              {featured.titulok}
            </h2>
            <p className="text-flora-lead text-flora-moss">{featured.perex}</p>
            <span className="text-[15px] font-semibold text-flora-clay-600">{blogSekcie.citajFeatured}</span>
          </div>
        </Link>

        {/* Mriežka ostatných */}
        <ul className="mt-16 grid gap-10 sm:grid-cols-3">
          {ostatne.map((c, i) => (
            <li key={c.slug}>
              <Link href={href(`/blog/${c.slug}`)} className="group flex h-full flex-col">
                <Foto src={blogFotky[i + 1]} alt={c.obrazokAlt} pomer="3/2" odtien={ODTIENE[(i + 1) % ODTIENE.length]} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                <span className="mt-4 text-flora-small text-flora-moss">
                  {c.datum} · {c.citanieMinut} min
                </span>
                <h3 className="mt-1.5 text-flora-h3 font-flora-display font-medium text-flora-ink group-hover:text-flora-clay-600">
                  {c.titulok}
                </h3>
                <p className="mt-2 text-flora-body text-flora-moss">{c.perex}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Sekcia>

      <CtaPas text={blogCta.text} primar={blogCta.cta} />
    </>
  );
}
