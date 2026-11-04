import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { ArrowUpRight, Leaf } from "lucide-react";
import { categories } from "@/app/data/categories";
import { posts } from "@/app/data/posts";
import { client } from "@/sanity/lib/client";
import { ARTICLES_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { getArticleCover } from "@/app/data/approvedCovers";

export const revalidate = 60;

type SanityArticle = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: Parameters<typeof urlFor>[0];
  publishedAt?: string;
};

type ArticleCard = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image?: string;
};

const validSlug = (value: unknown): value is string =>
  typeof value === "string" && /^[a-z0-9][a-z0-9_-]*$/i.test(value);


export const metadata: Metadata = {
  title: "Skincare Blog: Routines, Ingredients & Skin Tips",
  description: "Explore skincare routines, ingredient explainers, skin concerns and practical beauty guides on GlowSkin.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const sanityArticles: SanityArticle[] = await client.fetch(ARTICLES_QUERY);
  // Show complete CMS stories first and published legacy stories as a
  // fallback, without duplicating URLs. This makes older indexable articles
  // discoverable directly from the journal index.
  const cards: ArticleCard[] = [];
  const seen = new Set<string>();
  for (const article of sanityArticles) {
    const slug = article.slug?.current;
    if (!validSlug(slug) || !article.title?.trim() || seen.has(slug)) continue;
    seen.add(slug);
    cards.push({
      id: article._id,
      slug,
      title: article.title,
      description: article.excerpt ?? "",
      image: getArticleCover(slug) ?? (article.mainImage ? urlFor(article.mainImage).width(1200).url() : undefined),
    });
  }
  for (const post of posts) {
    if (!validSlug(post.slug) || seen.has(post.slug)) continue;
    seen.add(post.slug);
    cards.push({
      id: `legacy-${post.id}`,
      slug: post.slug,
      title: post.title,
      description: post.description,
      image: post.image,
    });
  }

  return (
    <>
      <Navbar />

      <main className="gs-botanical-index min-h-screen bg-[#F9F8F2] px-5 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="gs-mineral-surface relative isolate mb-12 overflow-hidden rounded-[2rem] border border-[#DDE2D4] px-6 py-9 text-left shadow-[0_18px_48px_rgba(44,59,42,.06)] sm:px-10 sm:py-12">
            <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.4fr_.6fr] lg:gap-12"><div>
            <span className="inline-block rounded-full bg-primary-light px-4 py-2 text-sm font-semibold text-primary-dark">
              THE GLOW SKIN JOURNAL
            </span>

            <h1 className="mt-6 font-heading text-4xl font-medium tracking-tight text-[#29372B] sm:text-6xl">
              Skincare guides, <span className="italic text-[#436D3E]">beautifully simple.</span>
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-[#4D5B4E]">
              Discover considered skincare routines, ingredient guides,
              practical skin education, and beauty advice.
            </p>
            </div>
              <div className="hidden items-center justify-center lg:flex" aria-hidden="true">
                <div className="flex h-48 w-48 items-center justify-center rounded-full border border-[#C8D5C0] bg-[#E8EFDF]/60 shadow-[0_14px_35px_rgba(44,59,42,.06)]">
                  <Leaf className="h-20 w-20 stroke-[.75] text-[#55774D]" />
                </div>
              </div>
            </div>
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
            {cards.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="gs-botanical-card group flex h-full flex-col overflow-hidden rounded-[1.3rem] border border-[#DCE3D6] bg-[#FFFEFB] shadow-[0_8px_26px_rgba(44,59,42,.045)] transition hover:-translate-y-1 hover:border-[#8DA784] hover:shadow-[0_20px_46px_rgba(44,59,42,.11)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2D5830]"
              >
                {article.image && (
                  <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[#E6E9DE] bg-[#EFF1E7]">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.015]"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="mt-1 font-heading text-2xl font-medium leading-tight !text-[#29372B] transition group-hover:!text-[#356338] dark:!text-[#F3F7F0]">
                    {article.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 leading-relaxed text-[#5B685B] dark:text-[#D4DEC8]">
                    {article.description}
                  </p>
                  <span className="mt-auto flex items-center justify-between gap-3 border-t border-[#E3E9DF] pt-5 text-sm font-semibold text-[#2D5830] dark:border-[#566B56] dark:text-[#C7E0BA]">
                    Read article <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E6EDD9] text-[#315835] transition group-hover:bg-[#2D5830] group-hover:text-white"><ArrowUpRight className="h-4 w-4" /></span>
                  </span>
                </div>
              </Link>
            ))}

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
