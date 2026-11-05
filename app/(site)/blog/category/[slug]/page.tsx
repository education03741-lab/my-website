import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { CategoryCoverPhoto } from "@/app/components/EditorialPhotoCollection";
import Footer from "@/app/components/Footer";
import { posts } from "@/app/data/posts";
import { categories } from "@/app/data/categories";
import { client } from "@/sanity/lib/client";
import { ARTICLES_BY_CATEGORY_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { getArticleCover } from "@/app/data/approvedCovers";

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

type EducationalGuide = {
  heading: string;
  introduction: string;
  questions: { heading: string; answer: string }[];
  related: { label: string; href: string }[];
  source: { label: string; href: string };
};

// Original explanatory material grounded in published AAD guidance.
// These are useful standalone answers even when a category has few articles.
const educationalGuides: Record<string, EducationalGuide> = {
  "beginner-guide": {
    heading: "Start with a manageable skincare routine",
    introduction:
      "A basic routine doesn't require a crowded shelf. Begin by learning how to cleanse gently, moisturize and protect exposed skin from the sun. Once those essentials suit your skin, you can decide whether you need another product. Choosing products that you tolerate is more useful than copying a lengthy routine built for someone else.",
    questions: [
      {
        heading: "What order should a beginner apply skincare?",
        answer:
          "Dermatologists generally recommend cleansing first, then applying any suitable treatment, followed by moisturizer and daytime sunscreen. Follow the instructions on your particular products. If you are introducing a new active ingredient, start cautiously rather than using several unfamiliar products at once.",
      },
      {
        heading: "Do you need a separate morning and evening routine?",
        answer:
          "The routines can share a gentle cleanser and moisturizer. Sun protection is especially important when you will be outdoors during the day, while evening care is a practical time to remove sunscreen and makeup. There is no universal number of steps that works for every skin type.",
      },
    ],
    related: [
      { label: "Beginner skincare routine", href: "/blog/beginners-skincare-routine" },
      { label: "Nighttime skincare routine", href: "/blog/nighttime-skincare-routine" },
      { label: "Explore ingredient guides", href: "/ingredients" },
    ],
    source: {
      label: "American Academy of Dermatology: applying skincare in order",
      href: "https://www.aad.org/public/everyday-care/skin-care-basics/care/apply-skin-care-certain-order",
    },
  },
  "sun-protection": {
    heading: "Understand the essentials of sun protection",
    introduction:
      "Sun protection is more than choosing a high number on a bottle. Look for broad-spectrum coverage, an SPF appropriate for everyday use and a formula you can apply comfortably and correctly. Shade, clothing and sensible reapplication also matter. These guides explain the terminology and help you make sense of sunscreen instructions.",
    questions: [
      {
        heading: "What should you look for on a sunscreen label?",
        answer:
          "The American Academy of Dermatology recommends broad-spectrum protection, SPF 30 or higher and water resistance. Broad-spectrum means protection against UVA and UVB radiation. Read the label's directions for how much to use, whether the formula is water resistant and when it should be reapplied.",
      },
      {
        heading: "When should sunscreen be reapplied?",
        answer:
          "When you are outdoors, reapply about every two hours and after swimming or sweating, following the product label. No sunscreen is waterproof. Shade and protective clothing provide additional protection, especially during extended time outside. Be sure not to miss exposed areas such as ears and neck.",
      },
    ],
    related: [
      { label: "How to choose the right sunscreen", href: "/blog/how-to-choose-the-right-sunscreen" },
      { label: "Understanding pigmentation", href: "/skin-concerns/pigmentation" },
      { label: "Build a simple skincare routine", href: "/blog/beginners-skincare-routine" },
    ],
    source: {
      label: "American Academy of Dermatology: how to apply sunscreen",
      href: "https://www.aad.org/public/everyday-care/sun-protection/shade-clothing-sunscreen/how-to-apply-sunscreen",
    },
  },
};

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
      image: getArticleCover(articleSlug) ?? (article.mainImage ? urlFor(article.mainImage).width(1200).url() : undefined),
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
  const educationalGuide = educationalGuides[slug];

  return (
    <>
      <Navbar />

      <main className="gs-botanical-index min-h-screen bg-[#F9F8F2] px-5 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/blog"
            className="font-semibold text-[#2D5830] hover:underline"
          >
            ← Back to Blog
          </Link>

          <div className="gs-mineral-surface relative isolate mb-12 mt-8 overflow-hidden rounded-[2rem] border border-[#DDE2D4] px-6 py-9 text-left sm:px-10 sm:py-12">
            <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-12"><div>
            <span className="inline-block rounded-full bg-[#E4EDD9] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#28502E]">
              {category.label}
            </span>

            <h1 className="mt-6 font-heading text-4xl font-medium text-[#29372B] sm:text-6xl">
              {category.label}
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#4D5B4E]">
              {category.intro}
            </p>
            </div>
            <CategoryCoverPhoto slug={slug} />
            </div>
          </div>

          {educationalGuide && (
            <section
              aria-labelledby="category-learning-heading"
              className="mb-12 rounded-[1.5rem] border border-[#DCE4D6] bg-[#FFFEFB] px-6 py-9 dark:border-[#546C55] dark:bg-[#303D33] sm:px-9 sm:py-11"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[.2em] text-[#54764D] dark:text-[#C6DBBD]">
                Helpful starting points
              </p>
              <h2
                id="category-learning-heading"
                className="mt-3 font-heading text-3xl font-medium !text-[#29372B] dark:!text-[#F6F7EF]"
              >
                {educationalGuide.heading}
              </h2>
              <p className="mt-4 max-w-3xl leading-8 text-[#526052] dark:text-[#D9E4D5]">
                {educationalGuide.introduction}
              </p>
              <div className="mt-8 grid gap-7 md:grid-cols-2">
                {educationalGuide.questions.map((item) => (
                  <div key={item.heading}>
                    <h3 className="font-heading text-xl font-medium !text-[#29372B] dark:!text-[#F6F7EF]">
                      {item.heading}
                    </h3>
                    <p className="mt-3 leading-7 text-[#526052] dark:text-[#D9E4D5]">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-8 border-t border-[#E3E9DE] pt-6 dark:border-[#536B55]">
                <h3 className="text-sm font-semibold text-[#304A32] dark:text-[#EDF5E7]">
                  Continue exploring
                </h3>
                <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                  {educationalGuide.related.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-9 items-center gap-1 text-sm font-semibold text-[#2D5830] underline underline-offset-4 dark:text-[#C7DDBB]"
                      >
                        {link.label} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-xs leading-6 text-[#637262] dark:text-[#CCDBCA]">
                  Reference:{" "}
                  <a
                    href={educationalGuide.source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4"
                  >
                    {educationalGuide.source.label}
                  </a>
                </p>
              </div>
            </section>
          )}

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
                  className="gs-botanical-card group flex h-full flex-col overflow-hidden rounded-[1.3rem] border border-[#DCE3D6] bg-[#FFFEFB] shadow-[0_8px_26px_rgba(44,59,42,.045)] transition hover:-translate-y-1 hover:border-[#8DA784] hover:shadow-[0_20px_46px_rgba(44,59,42,.11)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2D5830]"
                >
                  {post.image && (
                    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[#E6E9DE] bg-[#EFF1E7]">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.015]"
                      />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                      {post.category}
                    </span>

                    <h2 className="mt-3 font-heading text-2xl font-medium !text-[#29372B] transition group-hover:!text-[#356338] dark:!text-[#F3F7F0]">
                      {post.title}
                    </h2>

                    <p className="mt-3 line-clamp-3 leading-relaxed text-[#5B685B] dark:text-[#D4DEC8]">
                      {post.description}
                    </p>

                    <span className="mt-auto flex items-center justify-between gap-3 border-t border-[#E3E9DF] pt-5 text-sm font-semibold text-[#2D5830] dark:border-[#566B56] dark:text-[#C7E0BA]">
                      Read article <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E6EDD9] text-[#315835] transition group-hover:bg-[#2D5830] group-hover:text-white"><ArrowUpRight className="h-4 w-4" /></span>
                    </span>
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
