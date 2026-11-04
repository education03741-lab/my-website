import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { posts } from "../data/posts";
import { urlFor } from "@/sanity/lib/image";

export type FeaturedSanityArticle = {
  _id: string;
  title: string;
  slug?: { current?: string };
  excerpt?: string;
  category?: string;
  mainImage?: Parameters<typeof urlFor>[0];
};

type Story = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  image?: string;
};

// Prioritize pages that already had Google Search Console impressions.
// The other four slots automatically follow Sanity's publication-date order.
const prioritySlugs = [
  "nighttime-skincare-routine",
  "top-7-ingredients-for-acne-prone-skin",
  "vitamin-c-vs-niacinamide",
];

const isValidSlug = (slug: unknown): slug is string =>
  typeof slug === "string" && /^[a-z0-9][a-z0-9_-]*$/i.test(slug);

function selectStories(articles: FeaturedSanityArticle[]): Story[] {
  const bySlug = new Map<string, Story>();
  for (const article of articles) {
    const slug = article.slug?.current;
    if (!isValidSlug(slug) || bySlug.has(slug) || !article.title?.trim()) continue;
    const legacy = posts.find((post) => post.slug === slug);
    bySlug.set(slug, {
      id: article._id,
      slug,
      title: article.title,
      category: article.category || legacy?.category || "Skincare Guide",
      description: article.excerpt || legacy?.description || "",
      image: article.mainImage
        ? urlFor(article.mainImage).width(1200).url()
        : legacy?.image,
    });
  }

  const selected: Story[] = [];
  const seen = new Set<string>();
  const add = (story: Story | undefined) => {
    if (!story || seen.has(story.slug) || selected.length >= 7) return;
    seen.add(story.slug);
    selected.push(story);
  };

  for (const slug of prioritySlugs) add(bySlug.get(slug));
  for (const story of bySlug.values()) add(story);

  // Legacy cards are a fallback if there are fewer than seven complete CMS articles.
  for (const post of posts) {
    add({
      id: `legacy-${post.id}`,
      slug: post.slug,
      title: post.title,
      category: post.category,
      description: post.description,
      image: post.image,
    });
  }
  return selected;
}

function StoryCard({ post }: { post: Story }) {
  return (
    <article className="min-w-0">
      <Link href={`/blog/${post.slug}`} className="gs-botanical-card group flex h-full flex-col overflow-hidden rounded-[1.3rem] border border-[#DCE3D6] bg-[#FFFEFB] shadow-[0_8px_26px_rgba(44,59,42,.045)] transition hover:-translate-y-1 hover:border-[#8DA784] hover:shadow-[0_20px_46px_rgba(44,59,42,.11)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2D5830]">
        <div className="relative aspect-[16/10] overflow-hidden border-b border-[#E6E9DE] bg-[#EFF1E7]">
          {post.image ? (
            <Image src={post.image} alt={post.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.015]" />
          ) : (
            <div aria-hidden="true" className="flex h-full items-center justify-center font-heading text-5xl italic text-[#728C68]">GlowSkin.</div>
          )}
        </div>
        <div className="flex flex-1 flex-col px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#54764D] dark:text-[#B4D2AA]">{post.category}</p>
          <h3 className="mt-3 font-heading text-[1.45rem] font-medium leading-[1.2] tracking-[-.025em] !text-[#29372B] dark:!text-[#F6F7F0]">{post.title}</h3>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#5B685B] dark:text-[#D4DEC8]">{post.description}</p>
          <span className="mt-auto flex items-center justify-between gap-3 border-t border-[#E3E9DF] pt-5 text-sm font-semibold text-[#2D5830] dark:border-[#566B56] dark:text-[#C7E0BA]">
            Read article <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E6EDD9] text-[#315835] transition group-hover:bg-[#2D5830] group-hover:text-white"><ArrowUpRight className="h-4 w-4" /></span>
          </span>
        </div>
      </Link>
    </article>
  );
}

export default function FeaturedArticles({ articles }: { articles: FeaturedSanityArticle[] }) {
  const stories = selectStories(articles);

  return (
    <section className="gs-botanical-journal bg-[#FBFAF6] py-16 sm:py-20" aria-labelledby="journal-heading">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[.24em] text-[#54764D] dark:text-[#C0D9B4]">THE GLOW SKIN JOURNAL</p>
            <h2 id="journal-heading" className="font-heading text-4xl font-medium tracking-[-.035em] !text-[#29372B] dark:!text-[#F6F7EF] sm:text-5xl">Fresh reads for your skin</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#5B685B] dark:text-[#D5DECF]">A thoughtful collection of routines, ingredients, and answers to everyday skincare questions.</p>
          </div>
          <Link href="/blog" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#2D5830] underline-offset-4 hover:underline dark:text-[#C7DDBB]">
            View all articles <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        {stories.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {stories.slice(0, 6).map((post) => <StoryCard key={post.id} post={post} />)}
          </div>
        ) : (
          <p className="text-[#5B685B] dark:text-[#D5DECF]">New articles are on the way. Explore the skincare library in the meantime.</p>
        )}
      </div>
    </section>
  );
}
