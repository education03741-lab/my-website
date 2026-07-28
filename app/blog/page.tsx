import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { categories } from "../data/categories";
import { client } from "../../sanity/lib/client";
import { ARTICLES_QUERY } from "../../sanity/lib/queries";
import { urlFor } from "../../sanity/lib/image";

export const revalidate = 60;

type SanityArticle = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  mainImage: any;
  publishedAt: string;
};

export default async function BlogPage() {
  const sanityArticles: SanityArticle[] = await client.fetch(ARTICLES_QUERY);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-cream px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full bg-primary-light px-4 py-2 text-sm font-semibold text-primary-dark">
              GlowSkin Blog
            </span>

            <h1 className="mt-6 text-5xl font-semibold text-charcoal">
              Our Blog
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Discover science-backed skincare routines, ingredient guides,
              dermatologist-inspired tips, and beauty advice.
            </p>
          </div>

          <nav
            aria-label="Blog categories"
            className="mb-14 flex flex-wrap justify-center gap-3"
          >
            <Link
              href="/blog"
              className="rounded-full border border-primary bg-primary px-5 py-2.5 text-sm font-medium text-white transition"
            >
              All Articles
            </Link>

            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/blog/category/${category.slug}`}
                className="rounded-full border border-primary-light bg-white px-5 py-2.5 text-sm font-medium text-charcoal transition hover:border-primary hover:text-primary"
              >
                {category.label}
              </Link>
            ))}
          </nav>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* ✅ ONLY Sanity articles - NO duplicates */}
            {sanityArticles.map((article) => (
              <Link
                key={article._id}
                href={`/blog/${article.slug.current}`}
                className="group overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                {article.mainImage && (
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={urlFor(article.mainImage).width(600).height(400).url()}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="mt-3 text-2xl font-semibold text-charcoal transition group-hover:text-primary">
                    {article.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-gray-600">
                    {article.excerpt}
                  </p>
                  <p className="mt-6 font-semibold text-primary transition group-hover:translate-x-2">
                    Read More →
                  </p>
                </div>
              </Link>
            ))}

            {/* ✅ REMOVED: Static posts section - no more duplicates! */}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}