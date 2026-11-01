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
    <article className="group min-w-0">
      <Link
        href={`/blog/${post.slug}`}
        className={`gs-story-card gs-atelier-feature-card block h-full overflow-hidden rounded-[1.25rem] border border-[#E5DAD0] bg-[#FFFCF8] transition hover:-translate-y-1 hover:border-[#A66370] hover:shadow-[0_18px_50px_rgba(60,40,45,0.09)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#662F42] `}
      >
        <div className={`relative overflow-hidden bg-[#EEE7DE] aspect-[4/3]`}>
          {post.image && (
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          )}
        </div>
        <div className={`flex flex-col justify-between p-5 sm:p-6`}>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66370]">{post.category}</p>
            <h3 className={`mt-3 font-heading font-medium leading-tight tracking-tight text-[#282521] text-xl sm:text-2xl`}>
              {post.title}
            </h3>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#635D56]">{post.description}</p>
          </div>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#662F42]">
            Read the guide <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true"/>
          </span>
        </div>
      </Link>
    </article>
  );
}

export default function FeaturedArticles({ articles }: { articles: FeaturedSanityArticle[] }) {
  const stories = selectStories(articles);

  return (
    <section className="bg-[#F7F3EC] py-16 sm:py-20" aria-labelledby="journal-heading">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 border-b border-[#D9CBC0] pb-9 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#A66370]">THE ATELIER · JOURNAL</p>
            <h2 id="journal-heading" className="font-heading text-4xl font-medium tracking-tight text-[#282521] sm:text-5xl">
              Stories worth <span className="italic text-[#A66370]">staying for.</span>
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#635D56]">
              A considered collection of skincare routines, ingredients, and everyday questions.
            </p>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-2 border-b border-[#662F42] pb-2 text-sm font-semibold text-[#662F42] hover:text-[#A66370]">
            Explore all articles <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        {stories.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
            {stories.slice(0, 4).map((post) => <StoryCard key={post.id} post={post} />)}
          </div>
        ) : (
          <p className="text-[#635D56]">New articles are on the way. Explore the skincare library in the meantime.</p>
        )}
      </div>
    </section>
  );
}
