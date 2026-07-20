import Image from "next/image";
import Link from "next/link";
import { posts, type Post } from "../data/posts";

export default function FeaturedArticles() {
  return (
    <section className="bg-linear-to-b from-white to-primary-light/20 py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Section Heading */}
        <div className="mb-16 text-center">
          <span className="rounded-full bg-primary-light px-4 py-2 text-sm font-semibold text-primary-dark">
            Latest Articles
          </span>

          <h2 className="mt-6 text-5xl font-bold text-charcoal">
            Featured Skincare Guides
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
            Evidence-based skincare advice, ingredient deep dives, and
            dermatologist-inspired routines to help you build healthier skin.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-10 md:grid-cols-3">

          {posts.map((post: Post) => (

            <article
              key={post.id}
              className="group overflow-hidden rounded-4xl bg-white shadow-[0_2px_20px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(196,112,122,0.25)]"
            >

              {/* Blog Image */}
              <div className="relative h-64 overflow-hidden">

                <div className="absolute left-5 top-5 z-10 rounded-full bg-white/95 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-primary shadow-md">
                  {post.category}
                </div>

                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              </div>

              {/* Content */}
              <div className="p-8">

                <div className="mb-4 flex items-center gap-3 text-sm font-medium text-primary">
                  <span>6 min read</span>
                  <span className="h-1 w-1 rounded-full bg-primary-light" />
                  <span>GlowSkin Editorial</span>
                </div>

                <h3 className="text-2xl font-bold text-charcoal transition group-hover:text-primary">
                  {post.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-600">
                  {post.description}
                </p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-8 inline-flex items-center gap-2 font-semibold text-primary transition group-hover:gap-4"
                >
                  Read Article
                  <span>→</span>
                </Link>

              </div>

            </article>

          ))}

        </div>

        <div className="mt-16 text-center">
          <Link
            href="/blog"
            className="inline-flex rounded-full bg-linear-to-r from-primary-dark to-primary px-8 py-4 font-semibold text-white shadow-lg shadow-primary/30 transition hover:shadow-xl hover:shadow-primary/50"
          >
            View All Articles
          </Link>
        </div>

      </div>
    </section>
  );
}