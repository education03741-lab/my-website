import type { Metadata } from "next";
import { cache } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, BookOpen, Leaf } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { posts } from "@/app/data/posts";
import {
  articleTopics,
  getArticleTopic,
  getLegacySlugsForTopic,
  getImplicitTopicSlugs,
  type ArticleTopic,
} from "@/app/data/articleTopics";
import { getConcernCover, getIngredientCover, getArticleCover } from "@/app/data/approvedCovers";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { ARTICLES_BY_TOPIC_QUERY } from "@/sanity/lib/queries";

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };
type CmsArticle = {
  _id: string;
  title: string;
  slug?: { current?: string };
  excerpt?: string;
  mainImage?: Parameters<typeof urlFor>[0];
  category?: string;
  publishedAt?: string;
};
type TopicCard = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  image?: string;
};

const validSlug = (slug: unknown): slug is string =>
  typeof slug === "string" && /^[a-z0-9][a-z0-9_-]*$/i.test(slug);

export function generateStaticParams() {
  return articleTopics.map((topic) => ({ slug: topic.slug }));
}

const loadTopicCards = cache(async (topicSlug: string): Promise<TopicCard[]> => {
  const topic = getArticleTopic(topicSlug);
  if (!topic) return [];

  const cmsArticles = await client.fetch<CmsArticle[]>(ARTICLES_BY_TOPIC_QUERY, {
    topic: topic.slug,
    legacySlugs: getLegacySlugsForTopic(topic.slug),
  });
  const cards: TopicCard[] = [];
  const seen = new Set<string>();

  for (const article of cmsArticles) {
    const slug = article.slug?.current;
    if (!validSlug(slug) || seen.has(slug) || !article.title?.trim()) continue;
    seen.add(slug);
    cards.push({
      id: article._id,
      title: article.title,
      slug,
      description: article.excerpt?.trim() ?? "",
      category: article.category?.trim() || "Skincare Guide",
      image: getArticleCover(slug) ??
        (article.mainImage ? urlFor(article.mainImage).width(1200).url() : undefined),
    });
  }

  // A few complete articles are still served by the bundled legacy data.
  // Show them only when no published Sanity version of the slug is present.
  const legacySlugs = new Set(getLegacySlugsForTopic(topic.slug));
  for (const post of posts) {
    if ((!legacySlugs.has(post.slug) && !getImplicitTopicSlugs(post.category).includes(topic.slug)) || seen.has(post.slug)) continue;
    seen.add(post.slug);
    cards.push({
      id: `legacy-${post.id}`,
      title: post.title,
      slug: post.slug,
      description: post.description,
      category: post.category,
      image: getArticleCover(post.slug) ?? post.image,
    });
  }
  return cards;
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = getArticleTopic(slug);
  if (!topic) return { title: "Topic not found", robots: { index: false, follow: false } };

  const cards = await loadTopicCards(slug);
  const title = `${topic.label}: Skincare Articles & Guides`;
  const description = `Explore ${topic.label.toLowerCase()} skincare articles on GlowSkin. ${topic.description}`;

  return {
    title,
    description,
    alternates: { canonical: `/blog/topic/${topic.slug}` },
    robots: cards.length > 0 ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: { title, description, type: "website" },
  };
}

function GuideLink({ topic }: { topic: ArticleTopic }) {
  const image = topic.group === "concern" ? getConcernCover(topic.slug) : getIngredientCover(topic.slug);
  return (
    <Link
      href={topic.guideHref}
      className="group flex flex-col overflow-hidden rounded-[1.35rem] border border-[#DCE4D6] bg-[#FFFEFB] shadow-[0_10px_30px_rgba(44,59,42,.05)] transition hover:border-[#8BA684] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2D5830] sm:flex-row"
    >
      <div className="relative aspect-[16/10] w-full shrink-0 bg-[#EDF2E8] sm:aspect-auto sm:w-56">
        {image ? (
          <Image
            src={image}
            alt={`Illustrated ${topic.label} skincare guide cover`}
            fill
            sizes="(max-width: 640px) 100vw, 224px"
            className="object-contain p-2"
          />
        ) : (
          <span className="flex h-full min-h-36 items-center justify-center text-[#54764D]">
            <Leaf className="h-12 w-12" aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-center p-6">
        <p className="text-[11px] font-bold uppercase tracking-[.19em] text-[#54764D]">
          Start here · Essential guide
        </p>
        <h2 className="mt-2 font-heading text-2xl font-medium !text-[#29372B] dark:!text-[#F5F6EF]">
          Understanding {topic.label}
        </h2>
        <p className="mt-2 text-sm leading-7 text-[#536352] dark:text-[#CFDACB]">
          Read the dedicated {topic.group === "concern" ? "skin concern" : "ingredient"} guide before exploring the articles below.
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#2D5830] dark:text-[#C6DDBC]">
          Read guide <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

export default async function ArticleTopicPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = getArticleTopic(slug);
  if (!topic) notFound();
  const cards = await loadTopicCards(slug);

  const canonical = `https://glowskin.blog/blog/topic/${topic.slug}`;
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Journal", item: "https://glowskin.blog/blog" },
      { "@type": "ListItem", position: 2, name: topic.label, item: canonical },
    ],
  };

  return (
    <>
      <Navbar />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c") }}
      />
      <main className="gs-botanical-index min-h-screen bg-[#F9F8F2] px-5 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="mb-7 text-sm text-[#51674F] dark:text-[#D0DECA]">
            <Link href="/blog" className="underline underline-offset-4">Journal</Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{topic.label}</span>
          </nav>
          <header className="gs-mineral-surface rounded-[1.75rem] border border-[#DCE4D6] px-6 py-9 sm:px-10 sm:py-12">
            <p className="text-[11px] font-bold uppercase tracking-[.22em] text-[#54764D] dark:text-[#D0E0C7]">
              {topic.group === "concern" ? "SKIN CONCERN ARTICLES" : "INGREDIENT ARTICLES"}
            </p>
            <h1 className="mt-4 font-heading text-4xl font-medium tracking-[-.035em] !text-[#29372B] dark:!text-[#F7F7EF] sm:text-6xl">
              {topic.label} <span className="italic text-[#467442]">articles & guides</span>
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#536352] dark:text-[#D8E4D2]">
              {topic.description} Browse our published articles, comparisons and practical explainers in one place.
            </p>
          </header>
          <section aria-label={`${topic.label} essential guide`} className="mt-10">
            <GuideLink topic={topic} />
          </section>
          <section aria-labelledby="topic-articles-title" className="mt-14">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#54764D] dark:text-[#D0E0C7]">
                  KEEP READING
                </p>
                <h2 id="topic-articles-title" className="mt-2 font-heading text-3xl font-medium !text-[#29372B] dark:!text-[#F7F7EF] sm:text-4xl">
                  Articles about {topic.label}
                </h2>
              </div>
              <p className="text-sm text-[#536352] dark:text-[#D5E1CF]">
                {cards.length} {cards.length === 1 ? "article" : "articles"}
              </p>
            </div>
            {cards.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((article) => (
                  <Link
                    href={`/blog/${article.slug}`}
                    key={article.id}
                    className="gs-botanical-card group flex h-full flex-col overflow-hidden rounded-[1.3rem] border border-[#DCE3D6] bg-[#FFFEFB] transition hover:-translate-y-1 hover:border-[#8DA784] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2D5830]"
                  >
                    <div className="relative aspect-[16/10] border-b border-[#E6E9DE] bg-[#EFF1E7]">
                      {article.image ? (
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-contain p-2"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[#62845A]">
                          <BookOpen className="h-12 w-12" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-[11px] font-semibold uppercase tracking-[.15em] text-[#54764D]">
                        {article.category}
                      </p>
                      <h3 className="mt-3 font-heading text-2xl font-medium leading-tight !text-[#29372B] dark:!text-[#F7F7EF]">
                        {article.title}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#586957] dark:text-[#D5E1CF]">
                        {article.description}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-2 border-t border-[#E3E9DF] pt-5 text-sm font-semibold text-[#2D5830] dark:text-[#C7DDBB]">
                        Read article <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-[#DCE4D6] bg-white px-7 py-10 text-[#536352]">
                More {topic.label.toLowerCase()} articles are being prepared. The essential guide above is available now.
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
