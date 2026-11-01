import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { posts } from "@/app/data/posts";
import { categories } from "@/app/data/categories";
import { client } from "@/sanity/lib/client";
import { ARTICLES_BY_CATEGORY_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

type CategoryArticle = {
  _id: string;
  title: string;
  slug?: { current?: string };
  excerpt?: string;
  mainImage?: Parameters<typeof urlFor>[0];
};

type CategoryCard = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  image?: string;
};

const isValidSlug = (slug: unknown): slug is string =>
  typeof slug === "string" && /^[a-z0-9][a-z0-9_-]*$/i.test(slug);

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    return { robots: { index: false, follow: false } };
  }

  return {
    title: `${category.label} Skincare Articles`,
    description: `Explore ${category.label.toLowerCase()} skincare articles, practical routines and ingredient guidance on GlowSkin.`,
    alternates: { canonical: `/blog/category/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  // Keep the page aligned with the published Sanity article source of truth.
  const sanityArticles: CategoryArticle[] = await client.fetch(
    ARTICLES_BY_CATEGORY_QUERY,
    { category: category.label }
  );
  const publishedSlugs = new Set<string>();
  const cmsCards: CategoryCard[] = [];
  for (const article of sanityArticles) {
    const articleSlug = article.slug?.current;
    if (!isValidSlug(articleSlug) || publishedSlugs.has(articleSlug)) continue;
    publishedSlugs.add(articleSlug);
    cmsCards.push({
      id: article._id,
      title: article.title,
      slug: articleSlug,
      description: article.excerpt ?? "",
      category: category.label,
      image: article.mainImage ? urlFor(article.mainImage).width(1200).url() : undefined,
    });
  }

  // Preserve links to valid legacy static articles without duplicating CMS cards.
  const legacyCards: CategoryCard[] = posts
    .filter((post) => post.category === category.label && !publishedSlugs.has(post.slug))
    .map((post) => ({
      id: `static-${post.id}`,
      title: post.title,
      slug: post.slug,
      description: post.description,
      category: post.category,
      image: post.image,
    }));
  const filteredPosts = [...cmsCards, ...legacyCards];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F7F1EA] px-5 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/blog"
            className="text-[#82485A] font-semibold hover:underline"
          >
            ← Back to Blog
          </Link>

          <div className="mb-12 mt-8 rounded-[2rem] border border-[#E6D5CA] bg-gradient-to-br from-[#F1E0DA] via-[#FFF9F2] to-[#E9E4DA] px-6 py-14 text-left sm:px-12 sm:py-20">
            <span className="inline-block rounded-full bg-[#EAD7D5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#743D4B]">
              {category.label}
            </span>

            <h1 className="mt-6 font-heading text-4xl font-medium text-[#35262B] sm:text-6xl">
              {category.label}
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#715E5C]">
              {category.intro}
            </p>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm">
              <h2 className="text-2xl font-semibold text-charcoal">
                No articles yet in this category
              </h2>
              <p className="mt-3 text-gray-600">Check back soon.</p>
              <Link
                href="/blog"
                className="mt-6 inline-block rounded-full bg-primary px-6 py-3 font-medium text-white transition hover:bg-primary-dark"
              >
                View all articles
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-t-[7rem] rounded-b-[1.5rem] border border-[#E4D5CE] bg-[#FFFBF6] shadow-[0_8px_28px_rgba(60,40,45,.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(60,40,45,.12)]"
                >
                  {post.image && (
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EADCD4]">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                      {post.category}
                    </span>

                    <h2 className="mt-3 font-heading text-2xl font-medium text-[#342B2B] transition group-hover:text-primary">
                      {post.title}
                    </h2>

                    <p className="mt-4 line-clamp-3 leading-relaxed text-[#6D625C]">
                      {post.description}
                    </p>

                    <p className="mt-6 font-semibold text-primary transition group-hover:translate-x-2">
                      Read More →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
