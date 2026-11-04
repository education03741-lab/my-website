import Link from "next/link";
import { BookOpen, Droplets, HeartPulse, Leaf, Sparkles, FlaskConical, ArrowUpRight } from "lucide-react";

const topics = [
  { title: "Routines", href: "/blog/category/beginner-guide", Icon: BookOpen },
  { title: "Ingredients", href: "/ingredients", Icon: FlaskConical },
  { title: "Skin concerns", href: "/skin-concerns", Icon: HeartPulse },
  { title: "Skin types", href: "/skin-concerns/dry-skin", Icon: Droplets },
  { title: "Product guides", href: "/products", Icon: Leaf },
  { title: "Beauty tips", href: "/blog", Icon: Sparkles },
];

export default function ExploreTopics() {
  return (
    <section aria-labelledby="explore-topics-heading" className="gs-botanical-topics border-b border-[#E5E8DD] bg-[#F9F9F3] py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[.23em] text-[#4D6B4E] dark:text-[#B8CEAC]">FIND YOUR STARTING POINT</p>
            <h2 id="explore-topics-heading" className="font-heading text-3xl font-medium tracking-[-.035em] !text-[#26382A] dark:!text-[#F4F6EE] sm:text-4xl">Explore by topic</h2>
          </div>
          <Link href="/blog" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#2D5830] underline-offset-4 hover:underline dark:text-[#C5DDB9]">All guides <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {topics.map(({ title, href, Icon }) => (
            <Link key={title} href={href} className="gs-botanical-chip group flex min-h-20 items-center justify-center gap-3 rounded-2xl border border-[#DDE5D8] bg-[#FFFEFA] px-3 py-4 text-center text-sm font-semibold text-[#2E4931] transition hover:-translate-y-0.5 hover:border-[#7B9776] hover:bg-[#EFF4E8] hover:shadow-[0_9px_24px_rgba(35,62,37,.07)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2D5830] dark:border-[#536A54] dark:bg-[#344238] dark:text-[#F4F7F1]">
              <Icon aria-hidden="true" className="h-5 w-5 shrink-0 stroke-[1.6] text-[#5E7C57] dark:text-[#B7D1AA]" />
              <span>{title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
