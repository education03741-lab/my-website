import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { posts } from "@/app/data/posts";
import type { FeaturedSanityArticle } from "@/app/components/FeaturedArticles";
import type { Concern } from "@/app/data/concerns";

// Topic-specific guides reported as poorly connected in the October 2026
// Semrush audit. Only render published CMS documents (or bundled articles)
// that actually exist. Do not manufacture a destination for a missing slug.
const focusSlugs = [
  "5-simple-steps-to-a-healthy-skincare-routine",
  "how-to-get-korean-glass-skin-at-home-naturally-step-by-step-diy-routine",
  "skin-barrier-repair-101-signs-of-damage-what-actually-works-and-how-long-it-takes-to-heal",
  "top-10-natural-skincare-ingredients-that-actually-work-and-how-to-use-them",
  "understanding-skin-barrier",
  "what-is-the-skin-barrier-a-beginner-s-guide-to-your-skin-s-protective-shield",
] as const;

const validSlug = (value: unknown): value is string =>
  typeof value === "string" && /^[a-z0-9][a-z0-9_-]*$/i.test(value);

type Props = {
  articles: FeaturedSanityArticle[];
  concerns: Concern[];
};

export default function ReadingPathways({ articles, concerns }: Props) {
  const available = new Map<string, { title: string; href: string }>();

  for (const article of articles) {
    const slug = article.slug?.current;
    if (!validSlug(slug) || !article.title?.trim()) continue;
    available.set(slug, { title: article.title, href: `/blog/${slug}` });
  }

  for (const post of posts) {
    if (!validSlug(post.slug) || available.has(post.slug)) continue;
    available.set(post.slug, { title: post.title, href: `/blog/${post.slug}` });
  }

  const links = focusSlugs.flatMap((slug) => {
    const guide = available.get(slug);
    return guide ? [guide] : [];
  });

  const combination = concerns.find(
    (concern) => concern.slug === "combination-skin" && concern.title?.trim()
  );
  if (combination) {
    links.push({
      title: combination.title,
      href: "/skin-concerns/combination-skin",
    });
  }

  if (links.length === 0) return null;

  return (
    <section
      aria-labelledby="reading-pathways-heading"
      className="border-y border-[#DCE5D8] bg-[#F8F9F2] py-14 dark:border-[#526A52] dark:bg-[#253128] sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[.23em] text-[#54764D] dark:text-[#C8E0BC]">
          CONTINUE EXPLORING
        </p>
        <h2
          id="reading-pathways-heading"
          className="font-heading text-3xl font-medium tracking-tight !text-[#29372B] dark:!text-[#F7F6EF] sm:text-4xl"
        >
          More questions, useful guides
        </h2>
        <p className="mt-3 max-w-2xl leading-7 text-[#536251] dark:text-[#D5E0D0]">
          Explore routines, barrier care, ingredients and skin concerns through
          our published guides.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((guide) => (
            <li key={guide.href}>
              <Link
                href={guide.href}
                className="group flex min-h-20 h-full items-center gap-3 rounded-2xl border border-[#DCE5D8] bg-white px-5 py-4 text-sm font-semibold leading-6 text-[#304A32] transition hover:border-[#789472] hover:bg-[#EDF3E8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2D5830] dark:border-[#536B55] dark:bg-[#344338] dark:text-[#EFF7EB]"
              >
                <BookOpen className="h-5 w-5 shrink-0 text-[#62845A]" aria-hidden="true" />
                <span>{guide.title}</span>
                <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-[#62845A] transition group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
