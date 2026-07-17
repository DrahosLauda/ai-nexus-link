import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
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
  if (!post) return { title: "Článok – digitalnapomoc.sk" };
  return {
    title: `${post.title} – digitalnapomoc.sk`,
    description: post.excerpt,
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-night text-fog-100">
      <Navbar />
      <main className="mx-auto flex max-w-[760px] flex-col gap-8 px-5 pb-16 pt-[130px] sm:px-10 lg:pb-24 lg:pt-[150px]">
        <div className="flex flex-col gap-5">
          <Link
            href="/blog"
            className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-indigo-300 transition-colors hover:text-indigo-200"
          >
            ← Všetky články
          </Link>
          <span className="text-[13.5px] text-fog-500">
            {post.date} · {post.readingTime} min čítania
          </span>
          <h1 className="text-balance text-4xl font-extrabold leading-[1.1] tracking-[-0.03em] text-white lg:text-[44px]">
            {post.title}
          </h1>
        </div>

        {/* Obsah článku prichádza ako HTML z nášho WordPressu (headless CMS). */}
        <article
          className="wp-article"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <div className="mt-4 flex flex-col items-start gap-4 rounded-3xl border border-indigo-400/30 bg-[linear-gradient(150deg,rgba(99,102,241,0.22),rgba(168,85,247,0.12))] p-8">
          <h2 className="text-balance text-2xl font-extrabold tracking-[-0.02em] text-white">
            Chcete niečo podobné vo svojej firme?
          </h2>
          <p className="text-[15.5px] leading-relaxed text-fog-200">
            Prvá konzultácia je zadarmo a nezáväzná.
          </p>
          <Link
            href="/#kontakt"
            className="inline-flex items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 px-6 py-3 text-[15.5px] font-semibold text-white shadow-[0_0_32px_rgba(99,102,241,0.45)] transition-shadow hover:shadow-[0_0_48px_rgba(99,102,241,0.65)]"
          >
            Rezervovať bezplatnú konzultáciu
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
