import type { Metadata } from "next";
import { About } from "@/components/about";
import { Blog, type BlogCardPost } from "@/components/blog";
import { ContactCta } from "@/components/contact-cta";
import { Faq } from "@/components/faq";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { Services } from "@/components/services";
import { Testimonials } from "@/components/testimonials";
import { fallbackPosts, faqs } from "@/lib/content";
import { faqSchema, organizationSchema, websiteSchema } from "@/lib/seo";
import { fetchLatestPosts } from "@/lib/wp";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  // Najnovšie články z WordPressu (www.digitalnapomoc.sk); keď API
  // nie je dostupné, sekcia zobrazí záložné články z lib/content.ts.
  let posts: BlogCardPost[] = fallbackPosts;
  try {
    const wpPosts = await fetchLatestPosts(3);
    if (wpPosts.length > 0) {
      posts = wpPosts.map((p) => ({
        title: p.title,
        excerpt: p.excerpt,
        date: p.date,
        read: String(p.readingTime),
        // Interná stránka článku — WordPress zostáva skrytý headless backend.
        href: `/blog/${p.slug}`,
        imageUrl: p.imageUrl,
      }));
    }
  } catch {
    // ponechá fallbackPosts
  }

  return (
    <div className="min-h-screen bg-night text-fog-100">
      <JsonLd data={[organizationSchema(), websiteSchema(), faqSchema(faqs)]} />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <Testimonials />
        <About />
        <Faq />
        <Blog posts={posts} />
        <ContactCta />
      </main>
      <Footer />
    </div>
  );
}
