import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import { cache } from "react";
import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ComingSoon from "@/app/components/ComingSoon";
import { posts } from "@/app/data/posts";
import { client } from "@/sanity/lib/client";
import { ARTICLE_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// ✅ Converts markdown-style content to proper HTML with headings
function formatStaticContent(content: string) {
  if (!content) return '';
  
  const lines = content.split('\n');
  let html = '';
  let inList = false;
  let listItems: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (!trimmed) {
      if (inList) {
        html += `<ul style="list-style-type: disc; margin-left: 24px; margin-bottom: 16px;">${listItems.join('')}</ul>`;
        listItems = [];
        inList = false;
      }
      continue;
    }
    
    // Check for ### heading (H3)
    if (trimmed.startsWith('### ')) {
      if (inList) {
        html += `<ul style="list-style-type: disc; margin-left: 24px; margin-bottom: 16px;">${listItems.join('')}</ul>`;
        listItems = [];
        inList = false;
      }
      const headingText = trimmed.substring(4);
      html += `<h3 style="font-size: 24px !important; font-weight: 700 !important; margin-top: 20px !important; margin-bottom: 12px !important; color: #111827 !important;">${headingText}</h3>`;
      continue;
    }
    
    // Check for ## heading (H2)
    if (trimmed.startsWith('## ')) {
      if (inList) {
        html += `<ul style="list-style-type: disc; margin-left: 24px; margin-bottom: 16px;">${listItems.join('')}</ul>`;
        listItems = [];
        inList = false;
      }
      const headingText = trimmed.substring(3);
      html += `<h2 style="font-size: 30px !important; font-weight: 700 !important; margin-top: 24px !important; margin-bottom: 16px !important; color: #111827 !important;">${headingText}</h2>`;
      continue;
    }
    
    // Check for # heading (H1)
    if (trimmed.startsWith('# ')) {
      if (inList) {
        html += `<ul style="list-style-type: disc; margin-left: 24px; margin-bottom: 16px;">${listItems.join('')}</ul>`;
        listItems = [];
        inList = false;
      }
      const headingText = trimmed.substring(2);
      html += `<h1 style="font-size: 36px !important; font-weight: 800 !important; margin-top: 32px !important; margin-bottom: 20px !important; color: #111827 !important;">${headingText}</h1>`;
      continue;
    }
    
    // ✅ Detect headings by pattern (short lines without punctuation)
    const isHeading = (
      trimmed.length < 80 && 
      !trimmed.endsWith('.') && 
      !trimmed.endsWith(':') &&
      !trimmed.endsWith(',') &&
      !trimmed.startsWith('-') &&
      !trimmed.startsWith('•') &&
      !trimmed.startsWith('"') &&
      !trimmed.includes('  ') &&
      !trimmed.includes(' and ') &&
      !trimmed.includes(' of ') &&
      !trimmed.includes(' for ') &&
      (trimmed.length < 50 || trimmed.endsWith('?'))
    );
    
    if (isHeading) {
      if (inList) {
        html += `<ul style="list-style-type: disc; margin-left: 24px; margin-bottom: 16px;">${listItems.join('')}</ul>`;
        listItems = [];
        inList = false;
      }
      html += `<h3 style="font-size: 24px !important; font-weight: 700 !important; margin-top: 20px !important; margin-bottom: 12px !important; color: #111827 !important;">${trimmed}</h3>`;
      continue;
    }
    
    // Bullet points
    if (trimmed.startsWith('- ')) {
      inList = true;
      listItems.push(`<li style="color: #374151; margin-bottom: 4px;">${trimmed.substring(2)}</li>`);
      continue;
    }
    
    // Regular paragraph
    if (inList) {
      html += `<ul style="list-style-type: disc; margin-left: 24px; margin-bottom: 16px;">${listItems.join('')}</ul>`;
      listItems = [];
      inList = false;
    }
    html += `<p style="margin-bottom: 16px; color: #374151; line-height: 1.625;">${trimmed}</p>`;
  }
  
  if (inList) {
    html += `<ul style="list-style-type: disc; margin-left: 24px; margin-bottom: 16px;">${listItems.join('')}</ul>`;
  }
  
  return html;
}

// Custom renderers for PortableText for Sanity articles
const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <div className="relative my-8 w-full aspect-[5/3] overflow-hidden rounded-2xl">
          <Image
            src={urlFor(value).width(1000).height(600).url()}
            alt={value.alt || " "}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-contain"
          />
        </div>
      );
    },
  },
  block: {
    h1: ({ children }) => (
      <h1 style={{ fontSize: '36px', fontWeight: '800', marginTop: '32px', marginBottom: '20px', color: '#111827' }}>
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 style={{ fontSize: '30px', fontWeight: '700', marginTop: '24px', marginBottom: '16px', color: '#111827' }}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 style={{ fontSize: '24px', fontWeight: '700', marginTop: '20px', marginBottom: '12px', color: '#111827' }}>
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 style={{ fontSize: '20px', fontWeight: '600', marginTop: '16px', marginBottom: '8px', color: '#111827' }}>
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p style={{ marginBottom: '16px', color: '#374151', lineHeight: '1.625' }}>
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote style={{ borderLeftWidth: '4px', borderLeftColor: '#ec4899', paddingLeft: '16px', marginTop: '16px', marginBottom: '16px', fontStyle: 'italic', color: '#4b5563' }}>
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul style={{ listStyleType: 'disc', marginLeft: '24px', marginBottom: '16px' }}>
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol style={{ listStyleType: 'decimal', marginLeft: '24px', marginBottom: '16px' }}>
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li style={{ color: '#374151' }}>{children}</li>
    ),
    number: ({ children }) => (
      <li style={{ color: '#374151' }}>{children}</li>
    ),
  },
  marks: {
    strong: ({ children }) => <strong style={{ fontWeight: '700', color: '#111827' }}>{children}</strong>,
    em: ({ children }) => <em style={{ fontStyle: 'italic', color: '#374151' }}>{children}</em>,
    underline: ({ children }) => <u style={{ textDecoration: 'underline' }}>{children}</u>,
  },
};

type TextBlock = {
  _type?: string;
  children?: Array<{ text?: string }>;
};

function portableTextToPlainText(blocks: TextBlock[] | undefined): string {
  if (!blocks) return "";
  return blocks
    .map((block) =>
      block._type === "block" && block.children
        ? block.children.map((child: { text?: string }) => (child.text ?? "")).join("")
        : ""
    )
    .join(" ");
}

// Sanity is the source of truth for published articles. Keep the bundled
// articles intact as a fallback for missing/incomplete CMS documents.
const getArticle = cache(async (slug: string) => {
  const staticPost = posts.find((p) => p.slug === slug);

  try {
    const sanityArticle = await client.fetch(ARTICLE_BY_SLUG_QUERY, { slug });

    // Do not replace a complete legacy article with an empty CMS placeholder.
    if (
      sanityArticle?.title &&
      Array.isArray(sanityArticle.body) &&
      sanityArticle.body.length > 0
    ) {
      return { type: "sanity" as const, data: sanityArticle };
    }
  } catch (error) {
    // For articles that exist only in Sanity, preserve the existing error
    // behavior rather than silently serving a misleading 200 placeholder.
    if (!staticPost) throw error;
    console.error(`Sanity lookup failed for /blog/${slug}; using static fallback`, error);
  }

  if (staticPost) {
    return { type: "static" as const, data: staticPost };
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
  const title = sanityArticle.seoTitle?.trim() || sanityArticle.title;
  const description =
    sanityArticle.seoDescription?.trim() ||
    portableTextToPlainText(sanityArticle.body).slice(0, 155) ||
    sanityArticle.excerpt?.trim() ||
    `Read ${sanityArticle.title} on GlowSkin.`;
  const image = sanityArticle.mainImage
    ? urlFor(sanityArticle.mainImage).width(1200).height(630).url()
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image, width: 1200, height: 630 }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
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

  // ✅ STATIC ARTICLE RENDER
  if (result.type === "static") {
    const post = result.data;
    const relatedPosts = posts.filter((p) => p.id !== post.id).slice(0, 2);

    const formattedContent = formatStaticContent(post.content);

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

            <article className="max-w-none mt-12">
              <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
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

  // ✅ SANITY ARTICLE RENDER
  const sanityArticle = result.data;
  const canonicalUrl = `https://glowskin.blog/blog/${slug}`;
  const description =
    sanityArticle.seoDescription?.trim() ||
    portableTextToPlainText(sanityArticle.body).slice(0, 200) ||
    sanityArticle.excerpt?.trim();
  const directAnswer = sanityArticle.directAnswer?.trim();
  const authorName = sanityArticle.authorName?.trim();
  const authorBio = sanityArticle.authorBio?.trim();
  const reviewerName = sanityArticle.reviewerName?.trim();
  const publishedAt = sanityArticle.publishedAt && !Number.isNaN(Date.parse(sanityArticle.publishedAt))
    ? sanityArticle.publishedAt
    : undefined;
  const modifiedAt = sanityArticle._updatedAt && !Number.isNaN(Date.parse(sanityArticle._updatedAt))
    ? sanityArticle._updatedAt
    : undefined;
  const visibleFaqs: Array<{ question: string; answer: string }> =
    Array.isArray(sanityArticle.faqs)
      ? sanityArticle.faqs.filter(
          (faq: { question?: string; answer?: string }) =>
            typeof faq.question === "string" && faq.question.trim().length > 0 &&
            typeof faq.answer === "string" && faq.answer.trim().length > 0
        )
      : [];
  const sources: Array<{ title: string; url: string }> =
    Array.isArray(sanityArticle.sources)
      ? sanityArticle.sources.filter(
          (source: { title?: string; url?: string }) => {
            if (typeof source.title !== "string" || !source.title.trim() ||
                typeof source.url !== "string") return false;
            try {
              const protocol = new URL(source.url).protocol;
              return protocol === "https:" || protocol === "http:";
            } catch {
              return false;
            }
          }
        )
      : [];

  return (
    <>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "@id": `${canonicalUrl}#article`,
            headline: sanityArticle.title,
            mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
            publisher: {
              "@type": "Organization",
              "@id": "https://glowskin.blog/#organization",
              name: "GlowSkin",
            },
            author: authorName ? { "@type": "Person", name: authorName } : undefined,
            reviewer: reviewerName ? { "@type": "Person", name: reviewerName } : undefined,
            datePublished: publishedAt,
            dateModified: modifiedAt,
            articleSection: sanityArticle.category || undefined,
            image: sanityArticle.mainImage
              ? [urlFor(sanityArticle.mainImage).width(1200).height(630).url()]
              : undefined,
            description,
          }),
        }}
      />

      {visibleFaqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: visibleFaqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            }),
          }}
        />
      )}

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
          {(publishedAt || authorName || reviewerName) && (
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
              {authorName && <span>By {authorName}</span>}
              {publishedAt && (
                <time dateTime={publishedAt}>
                  Published {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(publishedAt))}
                </time>
              )}
              {reviewerName && <span>Reviewed by {reviewerName}</span>}
            </div>
          )}

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

          {directAnswer && (
            <aside aria-labelledby="answer-at-glance" className="mt-10 border-l-4 border-[#A66370] bg-[#F7F3EC] px-6 py-6">
              <h2 id="answer-at-glance" className="text-xl font-semibold text-[#282521]">
                At a glance
              </h2>
              <p className="mt-3 leading-7 text-[#514C47]">{directAnswer}</p>
            </aside>
          )}

          <article className="max-w-none mt-12">
            <PortableText
              value={sanityArticle.body}
              components={portableTextComponents}
            />
          </article>

          {visibleFaqs.length > 0 && (
            <section aria-labelledby="reader-questions" className="mt-14 border-t border-gray-200 pt-10">
              <h2 id="reader-questions" className="text-3xl font-semibold text-gray-900">Questions readers ask</h2>
              <div className="mt-7 space-y-7">
                {visibleFaqs.map((faq, index) => (
                  <div key={`${index}-${faq.question}`}>
                    <h3 className="text-xl font-semibold text-gray-900">{faq.question}</h3>
                    <p className="mt-2 leading-7 text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {sources.length > 0 && (
            <section aria-labelledby="article-references" className="mt-14 border-t border-gray-200 pt-10">
              <h2 id="article-references" className="text-2xl font-semibold text-gray-900">References and further reading</h2>
              <ul className="mt-5 list-disc space-y-2 pl-6">
                {sources.map((source, index) => (
                  <li key={`${index}-${source.url}`}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="break-words text-[#662F42] underline underline-offset-4 hover:text-[#A66370]">
                      {source.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {authorBio && authorName && (
            <section aria-labelledby="about-article-author" className="mt-12 border-t border-gray-200 pt-8">
              <h2 id="about-article-author" className="text-xl font-semibold text-gray-900">About the author</h2>
              <p className="mt-3 font-semibold text-gray-800">{authorName}</p>
              <p className="mt-2 leading-7 text-gray-700">{authorBio}</p>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}