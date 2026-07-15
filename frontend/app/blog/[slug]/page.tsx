import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPostBySlug } from "@/lib/wp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.date,
    description: post.excerpt,
  };

  return (
    <article className="mx-auto max-w-3xl px-6 py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-10 text-center">
        <div className="mb-4 flex items-center justify-center gap-3 text-xs uppercase tracking-[1px] text-white/60 font-mono">
          <span>{post.date}</span>
          <span className="text-white/40">·</span>
          <span>{post.readingTime} min čítania</span>
        </div>
        <h1 translate="no" className="text-4xl font-semibold tracking-[-1.5px] md:text-5xl">
          {post.title}
        </h1>
      </div>

      <div
        className="prose prose-invert max-w-none prose-headings:tracking-[-0.5px] prose-a:text-[#ff6b35]"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}
