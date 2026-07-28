import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
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

// ✅ Converts markdown-style content to proper HTML with headings
function formatStaticContent(content: string) {
  if (!content) return '';
  
  const lines = content.split('\n');
  let html = '';
  let headingCount = 0;
  let inList = false;
  let listItems: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let trimmed = line.trim();
    
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
      headingCount++;
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
      headingCount++;
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
      headingCount++;
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
      headingCount++;
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

          <article className="max-w-none mt-12">
            <PortableText 
              value={sanityArticle.body} 
              components={portableTextComponents} 
            />
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
}