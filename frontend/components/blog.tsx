import Image from "next/image";
import Link from "next/link";

export interface BlogCardPost {
  title: string;
  excerpt: string;
  date: string;
  read: string;
  href: string;
  tag?: string;
  external?: boolean;
  imageUrl?: string | null;
  imageAlt?: string | null;
}

const gradients = [
  "linear-gradient(135deg, rgba(99,102,241,0.45), rgba(168,85,247,0.3))",
  "linear-gradient(135deg, rgba(168,85,247,0.4), rgba(59,130,246,0.3))",
  "linear-gradient(135deg, rgba(59,130,246,0.4), rgba(99,102,241,0.35))",
];

export function Blog({ posts }: { posts: BlogCardPost[] }) {
  return (
    <div id="blog" className="scroll-mt-16 bg-white">
      <section className="mx-auto flex max-w-[1320px] flex-col gap-10 px-5 py-16 sm:px-10 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-indigo-600">
              Blog
            </span>
            <h2 className="text-4xl font-extrabold tracking-[-0.025em] text-ink lg:text-[42px]">
              Najnovšie články
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex shrink-0 items-center gap-2 rounded-[10px] border border-line bg-white px-5 py-[11px] text-[14.5px] font-medium text-mist-700 transition-colors hover:border-indigo-300 hover:text-indigo-600"
          >
            Všetky články →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {posts.map((post, i) => (
            <article
              key={post.title}
              className="flex flex-col overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_8px_28px_rgba(23,23,50,0.05)] transition-[border-color,box-shadow] duration-250 hover:border-indigo-300 hover:shadow-[0_14px_40px_rgba(99,102,241,0.14)]"
            >
              <div
                className="relative grid h-[150px] place-items-center overflow-hidden"
                style={{ background: gradients[i % gradients.length] }}
              >
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={post.imageAlt || post.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  post.tag && (
                    <span className="rounded-full border border-white/20 bg-[rgba(8,8,13,0.35)] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-white/85 backdrop-blur-sm">
                      {post.tag}
                    </span>
                  )
                )}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <span className="text-[12.5px] text-mist-400">
                  {post.date} · {post.read} min čítania
                </span>
                <h3 className="text-balance text-[18.5px] font-bold leading-[1.35] tracking-[-0.01em] text-ink">
                  {post.title}
                </h3>
                <p className="flex-1 text-sm leading-[1.55] text-mist-500">
                  {post.excerpt}
                </p>
                <a
                  href={post.href}
                  {...(post.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-500"
                >
                  Čítať článok →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
