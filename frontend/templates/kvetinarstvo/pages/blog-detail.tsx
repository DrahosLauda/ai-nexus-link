/**
 * Detail článku `/blog/[slug]`. Hlavička (eyebrow, h1, dátum + čítanie), úvodná
 * fotka 16:9, telo (odseky + medzinadpisy h2), súvisiace články, CTA. Prose
 * šírka ~70 znakov, riadkovanie z tokenu.
 */
import Link from "next/link";
import { href } from "../base";
import type { Clanok } from "../content";
import { blogClanky, blogCta, blogSekcie } from "../content";
import { CtaPas } from "../sections/bloky";
import { Foto } from "../images/foto";
import { blogFotky } from "../images/media";
import { type Odtien } from "../images/placeholder";
import { Eyebrow } from "../sections/ui";

const ODTIENE: Odtien[] = ["sage", "clay", "blush", "sand"];

export function BlogDetailPage({ clanok }: { clanok: Clanok }) {
  const clanokIndex = blogClanky.findIndex((c) => c.slug === clanok.slug);
  const suvisiace = blogClanky
    .map((c, i) => ({ c, i }))
    .filter(({ c }) => c.slug !== clanok.slug)
    .slice(0, 3);

  return (
    <>
      <article className="bg-flora-paper py-flora-section-sm">
        <div className="mx-auto w-full max-w-[760px] px-flora-gutter">
          <div className="flex flex-col gap-4 pt-6">
            <Eyebrow>{blogSekcie.detailEyebrow}</Eyebrow>
            <h1 className="text-flora-h1 font-flora-display font-medium text-balance text-flora-ink">
              {clanok.titulok}
            </h1>
            <p className="text-flora-small text-flora-moss">
              {clanok.datum} · {clanok.citanieMinut} min čítania
            </p>
          </div>
        </div>

        <div className="mx-auto mt-8 w-full max-w-[960px] px-flora-gutter">
          <Foto
            src={blogFotky[clanokIndex]}
            alt={clanok.obrazokAlt}
            pomer="16/9"
            odtien="sage"
            sizes="(max-width: 992px) 100vw, 960px"
          />
        </div>

        <div className="mx-auto mt-10 flex w-full max-w-[760px] flex-col gap-6 px-flora-gutter">
          {clanok.telo.map((blok, i) =>
            blok.typ === "medzinadpis" ? (
              <h2 key={i} className="mt-4 text-flora-h3 font-flora-display font-medium text-flora-ink">
                {blok.text}
              </h2>
            ) : (
              <p key={i} className="text-flora-body text-flora-moss">
                {blok.text}
              </p>
            ),
          )}
        </div>
      </article>

      {/* Súvisiace články */}
      <section className="bg-flora-sand py-flora-section">
        <div className="mx-auto w-full max-w-[1200px] px-flora-gutter">
          <h2 className="text-flora-h2 font-flora-display font-medium text-flora-ink">{blogSekcie.suvisiaceNadpis}</h2>
          <ul className="mt-10 grid gap-10 sm:grid-cols-3">
            {suvisiace.map(({ c, i }, pos) => (
              <li key={c.slug}>
                <Link href={href(`/blog/${c.slug}`)} className="group flex h-full flex-col">
                  <Foto
                    src={blogFotky[i]}
                    alt={c.obrazokAlt}
                    pomer="3/2"
                    odtien={ODTIENE[pos % ODTIENE.length]}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <h3 className="mt-4 text-flora-h3 font-flora-display font-medium text-flora-ink group-hover:text-flora-clay-600">
                    {c.titulok}
                  </h3>
                  <p className="mt-2 text-flora-body text-flora-moss">{c.perex}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaPas text={blogCta.text} primar={blogCta.cta} />
    </>
  );
}
