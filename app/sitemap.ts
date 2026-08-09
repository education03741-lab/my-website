import { MetadataRoute } from "next";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "3x2g2pvc",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

const siteUrl = "https://glowskin.blog";

type SlugDoc = {
  slug: string;
  publishedAt?: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/ingredients`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/skin-concerns`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Fetch dynamic slugs from Sanity in parallel
  const [articles, concerns, ingredients, products] = await Promise.all([
    client.fetch<SlugDoc[]>(
      `*[_type == "article" && defined(slug.current)]{
        "slug": slug.current,
        publishedAt
      }`
    ),
    client.fetch<SlugDoc[]>(
      `*[_type == "concern" && defined(slug.current)]{
        "slug": slug.current
      }`
    ),
    client.fetch<SlugDoc[]>(
      `*[_type == "ingredient" && defined(slug.current)]{
        "slug": slug.current
      }`
    ),
    client.fetch<SlugDoc[]>(
      `*[_type == "product" && defined(slug.current)]{
        "slug": slug.current
      }`
    ),
  ]);

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${siteUrl}/blog/${a.slug}`,
    lastModified: a.publishedAt ? new Date(a.publishedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const concernRoutes: MetadataRoute.Sitemap = concerns.map((c) => ({
    url: `${siteUrl}/skin-concerns/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const ingredientRoutes: MetadataRoute.Sitemap = ingredients.map((i) => ({
    url: `${siteUrl}/ingredients/${i.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteUrl}/products/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...articleRoutes,
    ...concernRoutes,
    ...ingredientRoutes,
    ...productRoutes,
  ];
}