import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { fetchLatestPosts, type WPPost } from "@/lib/wp";

export const revalidate = 300;

export const metadata: Metadata = {
  // Šablóna z layout.tsx doplní „ – digitalnapomoc.sk".
  title: "Blog",
  description:
    "Články o AI, automatizácii a digitálnych nástrojoch pre malé firmy a jednotlivcov — ľudsky a bez žargónu.",
  alternates: { canonical: "/blog" },
};

const gradients = [
  "linear-gradient(135deg, rgba(99,102,241,0.45), rgba(168,85,247,0.3))",
  "linear-gradient(135deg, rgba(168,85,247,0.4), rgba(59,130,246,0.3))",
  "linear-gradient(135deg, rgba(59,130,246,0.4), rgba(99,102,241,0.35))",
];

export default async function BlogIndex() {
  let posts: WPPost[] = [];
  try {
    posts = await fetchLatestPosts(24);
  } catch {
    posts = [];
  }

  return (
    <div className="min-h-screen bg-night text-fog-100">
      <Navbar />
      <main className="mx-auto flex max-w-[1320px] flex-col gap-10 px-5 pb-16 pt-[130px] sm:px-10 lg:pb-24 lg:pt-[150px]">
        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-indigo-400">
            Blog
          </span>
          <h1 className="text-4xl font-extrabold tracking-[-0.025em] text-white lg:text-[48px]">
            Všetky články
          </h1>
          <p className="max-w-[560px] text-pretty text-[17px] leading-relaxed text-fog-400">
            AI, automatizácia a digitálne nástroje pre malé firmy — ľudsky
            a bez žargónu.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-8 text-[15px] leading-relaxed text-fog-400">
            Články sa momentálne nepodarilo načítať. Skúste to prosím o chvíľu
            znova.
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <article
                key={post.id}
                className="flex flex-col overflow-hidden rounded-[20px] border border-white/[0.06] bg-white/[0.04] backdrop-blur-2xl transition-[border-color,box-shadow] duration-250 hover:border-indigo-400/65 hover:shadow-[0_0_32px_rgba(99,102,241,0.15)]"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="relative grid h-[150px] place-items-center overflow-hidden"
                  style={{ background: gradients[i % gradients.length] }}
                  aria-label={post.title}
                >
                  {post.imageUrl && (
                    <Image
                      src={post.imageUrl}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-300 hover:scale-[1.03]"
                    />
                  )}
                </Link>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <span className="text-[12.5px] text-fog-500">
                    {post.date} · {post.readingTime} min čítania
                  </span>
                  <h2 className="text-balance text-[18.5px] font-bold leading-[1.35] tracking-[-0.01em] text-white">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-white transition-colors hover:text-indigo-200"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="flex-1 text-sm leading-[1.55] text-fog-400">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-indigo-300 transition-colors hover:text-indigo-200"
                  >
                    Čítať článok →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
