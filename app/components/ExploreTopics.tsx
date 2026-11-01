import Link from "next/link";
import { ArrowUpRight, BookOpen, Droplets, HeartPulse, Leaf, Sparkles, FlaskConical } from "lucide-react";

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
    <section aria-labelledby="explore-topics-heading" className="bg-[#FFFCF8] py-14 sm:py-18">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8C5A55]">THE ATELIER · EXPLORE</p>
          <h2 id="explore-topics-heading" className="font-heading text-4xl font-medium text-[#282521] sm:text-5xl">
            Find your <span className="italic text-[#A66370]">point of view.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#625A53]">Find practical guides and thoughtful answers for your skin goals.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
          {topics.map(({ title, href, Icon }) => (
            <Link key={title} href={href} className="gs-atelier-topic group flex min-h-40 flex-col items-center justify-center rounded-t-[4rem] rounded-b-2xl border border-[#EADDD3] bg-gradient-to-b from-[#F7EAE8] via-[#FFF8F1] to-[#F5EFE8] px-3 py-6 text-center transition hover:-translate-y-1 hover:border-[#BB9C80] hover:shadow-[0_18px_36px_rgba(84,54,45,.1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#662F42]">
              <Icon aria-hidden="true" className="mb-5 h-7 w-7 stroke-[1.3] text-[#956B52]" />
              <span className="font-heading text-lg font-medium text-[#342B27]">{title}</span>
              <ArrowUpRight aria-hidden="true" className="mt-4 h-4 w-4 text-[#956B52] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
