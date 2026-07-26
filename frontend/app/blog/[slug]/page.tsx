import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { absoluteUrl, articleSchema, breadcrumbSchema } from "@/lib/seo";
import { fetchPostBySlug, type WPPostFull } from "@/lib/wp";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

async function getPost(slug: string): Promise<WPPostFull | null> {
  try {
    return await fetchPostBySlug(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Článok" };

  const url = absoluteUrl(`/blog/${post.slug}`);
  const images = post.imageUrl ? [post.imageUrl] : undefined;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.dateISO,
      modifiedTime: post.modifiedISO,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images,
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const crumbs = [
    { name: "Domov", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <JsonLd data={[articleSchema(post), breadcrumbSchema(crumbs)]} />
      <Navbar variant="light" />
      <main className="flex-1">
        {/* Náhľadový obrázok na celú šírku — navrchu (à la apertia) */}
        {post.imageUrl && (
          <div className="relative mt-[64px] h-[300px] w-full overflow-hidden bg-cloud sm:h-[420px] lg:h-[520px]">
            <Image
              src={post.imageUrl}
              alt={post.imageAlt || post.title}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Hlavička článku — pod obrázkom */}
        <div
          className={`mx-auto flex max-w-[880px] flex-col gap-5 px-5 sm:px-10 ${
            post.imageUrl ? "pt-12" : "pt-[130px] lg:pt-[150px]"
          }`}
        >
          <nav
            aria-label="Omrvinková navigácia"
            className="flex flex-wrap items-center gap-1.5 text-[13.5px] text-mist-400"
          >
            <Link href="/" className="transition-colors hover:text-mist-700">
              Domov
            </Link>
            <span aria-hidden="true">›</span>
            <Link href="/blog" className="transition-colors hover:text-mist-700">
              Blog
            </Link>
          </nav>
          <span className="text-[13.5px] text-mist-400">
            <time dateTime={post.dateISO}>{post.date}</time> ·{" "}
            {post.readingTime} min čítania
          </span>
          <h1 className="text-balance text-4xl font-extrabold leading-[1.1] tracking-[-0.03em] text-ink lg:text-[44px]">
            {post.title}
          </h1>
        </div>

        {/* Telo článku + CTA */}
        <div className="mx-auto flex max-w-[880px] flex-col gap-8 px-5 pb-16 pt-10 sm:px-10 lg:pb-24">
          {/* Obsah článku prichádza ako HTML z nášho WordPressu (headless CMS). */}
          <article
            className="wp-article"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          <div className="mt-4 flex flex-col items-start gap-4 rounded-3xl border border-line bg-cloud p-8">
            <h2 className="text-balance text-2xl font-extrabold tracking-[-0.02em] text-ink">
              Chcete niečo podobné vo svojej firme?
            </h2>
            <p className="text-[15.5px] leading-relaxed text-mist-500">
              Prvá konzultácia je zadarmo a nezáväzná.
            </p>
            <Link
              href="/#kontakt"
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-[15.5px] font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5"
            >
              Rezervovať bezplatnú konzultáciu
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
