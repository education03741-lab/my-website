import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { JournalReadingMap } from "@/app/components/AtelierMaps";
import { categories } from "@/app/data/categories";
import { client } from "@/sanity/lib/client";
import { ARTICLES_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

type SanityArticle = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  mainImage?: Parameters<typeof urlFor>[0];
  publishedAt: string;
};

export const metadata: Metadata = {
  title: "Skincare Articles & Guides",
  description: "Explore skincare routines, ingredient explainers, skin concerns and practical beauty guides on GlowSkin.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const sanityArticles: SanityArticle[] = await client.fetch(ARTICLES_QUERY);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F7F1EA] px-5 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="relative mb-12 overflow-hidden rounded-[2rem] border border-[#E4D2C7] bg-gradient-to-br from-[#F2DDD6] via-[#FFF9F4] to-[#E6E5D8] px-6 py-9 text-left shadow-[0_25px_75px_rgba(78,43,49,.08)] sm:px-10 sm:py-12">
            <div className="grid items-center gap-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-12"><div>
            <span className="inline-block rounded-full bg-primary-light px-4 py-2 text-sm font-semibold text-primary-dark">
              THE SKIN ATELIER · THE JOURNAL
            </span>

            <h1 className="mt-6 font-heading text-4xl font-medium tracking-tight text-[#342325] sm:text-6xl">
              Stories worth <span className="italic text-[#8E4857]">your time.</span>
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-[#5D514F]">
              Discover considered skincare routines, ingredient guides,
              practical skin education, and beauty advice.
            </p>
            </div><JournalReadingMap /></div>
          </div>

          <nav
            aria-label="Blog categories"
            className="mb-14 flex flex-wrap justify-center gap-3"
          >
            <Link
              href="/blog"
              className="rounded-full border border-primary bg-primary px-5 py-2.5 text-sm font-medium text-white transition"
            >
              All Articles
            </Link>

            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/blog/category/${category.slug}`}
                className="rounded-full border border-primary-light bg-white px-5 py-2.5 text-sm font-medium text-charcoal transition hover:border-primary hover:text-primary"
              >
                {category.label}
              </Link>
            ))}
          </nav>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* ✅ ONLY Sanity articles - NO duplicates */}
            {sanityArticles.map((article) => (
              <Link
                key={article._id}
                href={`/blog/${article.slug.current}`}
                className="group overflow-hidden rounded-t-[7rem] rounded-b-[1.5rem] border border-[#E5D7CD] bg-[#FFF9F4] shadow-[0_8px_30px_rgba(66,45,40,.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(66,45,40,.13)]"
              >
                {article.mainImage && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E5D7CD]">
                    <Image
                      src={urlFor(article.mainImage).width(1200).url()}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="mt-3 font-heading text-2xl font-medium leading-tight text-[#342325] transition group-hover:text-primary">
                    {article.title}
                  </h2>
                  <p className="mt-4 line-clamp-3 leading-relaxed text-[#695C57]">
                    {article.excerpt}
                  </p>
                  <p className="mt-6 font-semibold text-primary transition group-hover:translate-x-2">
                    Read More →
                  </p>
                </div>
              </Link>
            ))}

            {/* ✅ REMOVED: Static posts section - no more duplicates! */}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
