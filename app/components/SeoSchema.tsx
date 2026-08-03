type SeoSchemaProps = {
  type?: "website" | "article";
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
};

const SITE = {
  name: "GlowSkin",
  url: "https://glowskin.blog",
  description:
    "Science-backed skincare guides, ingredient education, and skincare routines.",
  logo: "https://glowskin.blog/logo.png",
  pinterest: "https://www.pinterest.com/glowskin_official/",
};

export default function SeoSchema({
  type = "website",
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
}: SeoSchemaProps) {
  const organization = {
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    logo: {
      "@type": "ImageObject",
      url: SITE.logo,
    },
    sameAs: [SITE.pinterest],
    description: SITE.description,
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    publisher: {
      "@id": `${SITE.url}/#organization`,
    },
    inLanguage: "en",
  };

  const article =
    type === "article"
      ? {
          "@type": "BlogPosting",
          headline: title,
          description,
          url,
          image,
          datePublished,
          dateModified,
          publisher: {
            "@id": `${SITE.url}/#organization`,
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": url,
          },
        }
      : null;

  const schema = {
    "@context": "https://schema.org",
    "@graph": article
      ? [organization, website, article]
      : [organization, website],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}