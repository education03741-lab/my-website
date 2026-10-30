import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { posts, type Post } from "../data/posts";

function StoryCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <article className={featured ? "group lg:row-span-2" : "group"}>
      <Link
        href={`/blog/${post.slug}`}
        className={`gs-story-card block h-full overflow-hidden border border-[#E5DAD0] bg-[#FFFCF8] transition hover:border-[#A66370] hover:shadow-[0_18px_50px_rgba(60,40,45,0.09)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#662F42] ${featured ? "" : "sm:grid sm:grid-cols-[43%_57%] lg:grid-cols-[44%_56%]"}`}
      >
        <div className={`relative overflow-hidden bg-[#EEE7DE] ${featured ? "aspect-[4/3] lg:aspect-[1.5/1]" : "aspect-[4/3] sm:aspect-auto sm:min-h-52"}`}>
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes={featured ? "(max-width: 1024px) 100vw, 55vw" : "(max-width: 1024px) 100vw, 25vw"}
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <div className={`flex flex-col justify-between ${featured ? "p-7 sm:p-9" : "p-6"}`}>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66370]">{post.category}</p>
            <h3 className={`mt-3 font-heading font-medium leading-tight tracking-tight text-[#282521] ${featured ? "text-3xl sm:text-4xl" : "text-2xl"}`}>
              {post.title}
            </h3>
            <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#635D56]">{post.description}</p>
          </div>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#662F42]">
            Read the guide <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true"/>
          </span>
        </div>
      </Link>
    </article>
  );
}

export default function FeaturedArticles() {
  const [lead, ...more] = posts;

  return (
    <section className="bg-[#F7F3EC] py-20 sm:py-28" aria-labelledby="journal-heading">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 border-b border-[#D9CBC0] pb-9 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#A66370]">The journal</p>
            <h2 id="journal-heading" className="font-heading text-4xl font-medium tracking-tight text-[#282521] sm:text-5xl">
              Stories for your <span className="italic text-[#A66370]">skin.</span>
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#635D56]">
              A considered collection of skincare routines, ingredients, and everyday questions.
            </p>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-2 border-b border-[#662F42] pb-2 text-sm font-semibold text-[#662F42] hover:text-[#A66370]">
            Explore all articles <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        {lead ? (
          <div className="grid gap-6 lg:grid-cols-[1.16fr_0.84fr] lg:gap-7">
            <StoryCard post={lead} featured />
            <div className="grid gap-6 lg:grid-rows-2 lg:gap-7">
              {more.map((post) => <StoryCard key={post.id} post={post} />)}
            </div>
          </div>
        ) : (
          <p className="text-[#635D56]">New articles are on the way. Explore the skincare library in the meantime.</p>
        )}
      </div>
    </section>
  );
}
