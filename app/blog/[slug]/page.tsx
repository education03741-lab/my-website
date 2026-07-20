import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { cache } from "react";
import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ComingSoon from "../../components/ComingSoon";
import { posts } from "../../data/posts";
import { client } from "../../../sanity/lib/client";
import { ARTICLE_BY_SLUG_QUERY } from "../../../sanity/lib/queries";
import { urlFor } from "../../../sanity/lib/image";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Pulls plain text out of Sanity's portable text blocks, used for meta
// descriptions and JSON-LD (which both need plain strings, not rich blocks)
function portableTextToPlainText(blocks: any[]): string {
  if (!blocks) return "";
  return blocks
    .map((block) =>
      block._type === "block" && block.children
        ? block.children.map((child: any) => child.text).join("")
        : ""
    )
    .join(" ");
}

// cache() dedupes this so generateMetadata() and the page component
// share one Sanity fetch instead of two per page load
const getArticle = cache(async (slug: string) => {
  const staticPost = posts.find((p) => p.slug === slug);
  if (staticPost) {
    return { type: "static" as const, data: staticPost };
  }

  const sanityArticle = await client.fetch(ARTICLE_BY_SLUG_QUERY, { slug });
  if (sanityArticle) {
    return { type: "sanity" as const, data: sanityArticle };
  }

  return null;
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getArticle(slug);

  if (!result) {
    return {
      title: "Article Coming Soon",
      robots: { index: false, follow: true },
    };
  }

  if (result.type === "static") {
    const post = result.data;
    const description =
      post.description?.slice(0, 155) ||
      post.content?.slice(0, 155) ||
      `Read ${post.title} on GlowSkin.`;

    return {
      title: post.title,
      description,
      openGraph: {
        title: post.title,
        description,
        images: post.image ? [{ url: post.image, width: 1200, height: 630 }] : [],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description,
        images: post.image ? [post.image] : [],
      },
      alternates: { canonical: `/blog/${post.slug}` },
    };
  }

  const sanityArticle = result.data;
  const description =
    portableTextToPlainText(sanityArticle.body).slice(0, 155) ||
    `Read ${sanityArticle.title} on GlowSkin.`;
  const image = sanityArticle.mainImage
    ? urlFor(sanityArticle.mainImage).width(1200).height(630).url()
    : undefined;

  return {
    title: sanityArticle.title,
    description,
    openGraph: {
      title: sanityArticle.title,
      description,
      images: image ? [{ url: image, width: 1200, height: 630 }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: sanityArticle.title,
      description,
      images: image ? [image] : [],
    },
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  const result = await getArticle(slug);

  if (!result) {
    return (
      <>
        <Navbar />
        <ComingSoon
          backHref="/blog"
          backLabel="Back to Blog"
          itemLabel="article"
        />
        <Footer />
      </>
    );
  }

  if (result.type === "static") {
    const post = result.data;
    const relatedPosts = posts.filter((p) => p.id !== post.id).slice(0, 2);

    return (
      <>
        <Navbar />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title,
              image: post.image ? [post.image] : undefined,
              description: post.description,
              articleSection: post.category,
            }),
          }}
        />

        <main className="max-w-4xl mx-auto px-6 py-20">
          <Link
            href="/blog"
            className="text-pink-600 font-semibold hover:underline"
          >
            ← Back to Blog
          </Link>

          <div className="mt-8">
            <span className="inline-block rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-600">
              {post.category}
            </span>

            <h1 className="mt-6 text-5xl font-extrabold text-gray-900 leading-tight">
              {post.title}
            </h1>

            <p className="mt-4 text-gray-500">
              5 min read • GlowSkin Editorial
            </p>

            <div className="relative mt-10 h-80 w-full overflow-hidden rounded-3xl">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>

            <article className="prose prose-lg max-w-none mt-12">
              <p className="whitespace-pre-line">{post.content}</p>
            </article>
          </div>

          <section className="mt-24">
            <h2 className="text-3xl font-bold mb-8">Related Articles</h2>

            <div className="grid md:grid-cols-2 gap-8">
              {relatedPosts.map((item) => (
                <Link
                  key={item.id}
                  href={`/blog/${item.slug}`}
                  className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-56 w-full">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <span className="text-sm text-pink-600 font-semibold uppercase">
                      {item.category}
                    </span>

                    <h3 className="mt-3 text-2xl font-bold">{item.title}</h3>

                    <p className="mt-3 text-gray-600">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  const sanityArticle = result.data;

  return (
    <>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: sanityArticle.title,
            image: sanityArticle.mainImage
              ? [urlFor(sanityArticle.mainImage).width(1200).height(630).url()]
              : undefined,
            description: portableTextToPlainText(sanityArticle.body).slice(0, 200),
          }),
        }}
      />

      <main className="max-w-4xl mx-auto px-6 py-20">
        <Link
          href="/blog"
          className="text-pink-600 font-semibold hover:underline"
        >
          ← Back to Blog
        </Link>

        <div className="mt-8">
          <h1 className="mt-6 text-5xl font-extrabold text-gray-900 leading-tight">
            {sanityArticle.title}
          </h1>

          {sanityArticle.mainImage && (
            <div className="relative mt-10 h-80 w-full overflow-hidden rounded-3xl">
              <Image
                src={urlFor(sanityArticle.mainImage).width(1200).height(700).url()}
                alt={sanityArticle.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          )}

          <article className="prose prose-lg max-w-none mt-12">
            <PortableText value={sanityArticle.body} />
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
}
