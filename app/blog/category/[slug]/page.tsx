import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { posts } from "../../../data/posts";
import { categories } from "../../../data/categories";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const filteredPosts = posts.filter((post) => post.category === category.label);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-cream px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/blog"
            className="text-pink-600 font-semibold hover:underline"
          >
            ← Back to Blog
          </Link>

          <div className="mb-12 mt-8 text-center">
            <span className="inline-block rounded-full bg-primary-light px-4 py-2 text-sm font-semibold text-primary-dark">
              {category.label}
            </span>

            <h1 className="mt-6 text-5xl font-semibold text-charcoal">
              {category.label}
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              {category.intro}
            </p>
          </div>

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
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-6">
                    <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                      {post.category}
                    </span>

                    <h2 className="mt-3 text-2xl font-semibold text-charcoal transition group-hover:text-primary">
                      {post.title}
                    </h2>

                    <p className="mt-4 leading-relaxed text-gray-600">
                      {post.description}
                    </p>

                    <p className="mt-6 font-semibold text-primary transition group-hover:translate-x-2">
                      Read More →
                    </p>
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
