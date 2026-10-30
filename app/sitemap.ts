import { MetadataRoute } from "next";
import { createClient } from "@sanity/client";
import { categories } from "@/app/data/categories";
import { posts } from "@/app/data/posts";
import { concerns as staticConcerns } from "@/app/data/concerns";
import { products as staticProducts } from "@/app/data/products";

const client = createClient({
  projectId: "3x2g2pvc",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

const siteUrl = "https://glowskin.blog";

type SitemapDocument = {
  slug: string;
  updatedAt?: string;
};

// A slug must be a single URL path segment, not an absolute or external URL.
const isValidSlug = (slug: unknown): slug is string =>
  typeof slug === "string" && /^[a-z0-9][a-z0-9_-]*$/i.test(slug);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const seenUrls = new Set<string>();

  const addUrl = (path: string, priority: number, updatedAt?: string) => {
    const url = `${siteUrl}${path}`;
    if (seenUrls.has(url)) return;

    seenUrls.add(url);
    const entry: MetadataRoute.Sitemap[number] = { url, priority };
    if (updatedAt) {
      const date = new Date(updatedAt);
      if (!Number.isNaN(date.getTime())) {
        entry.lastModified = date;
      }
    }
    entries.push(entry);
  };

  // These are actual indexable page routes. Do not generate a new
  // lastModified timestamp for unchanged static content on every request.
  const staticRoutes: Array<[string, number]> = [
    ["/", 1],
    ["/blog", 0.9],
    ["/ingredients", 0.8],
    ["/skin-concerns", 0.8],
    ["/products", 0.7],
    ["/about", 0.5],
    ["/contact", 0.5],
    ["/privacy-policy", 0.3],
    ["/terms", 0.3],
  ];

  for (const [path, priority] of staticRoutes) addUrl(path, priority);

  // Category routes and hardcoded articles are served by the application,
  // but previously were absent from the Sanity-only dynamic sitemap.
  for (const category of categories) {
    if (isValidSlug(category.slug)) {
      addUrl(`/blog/category/${category.slug}`, 0.7);
    }
  }

  for (const post of posts) {
    if (isValidSlug(post.slug)) {
      addUrl(`/blog/${post.slug}`, 0.8);
    }
  }

  // Concern and product detail routes serve these static records first.
  // Add them before Sanity records so duplicate slugs occur only once.
  for (const concern of staticConcerns) {
    if (isValidSlug(concern.slug)) {
      addUrl(`/skin-concerns/${concern.slug}`, 0.7);
    }
  }

  for (const product of staticProducts) {
    if (isValidSlug(product.slug)) {
      addUrl(`/products/${product.slug}`, 0.6);
    }
  }

  // Ingredient detail pages are Sanity-only; do not include static
  // ingredient records unless the application actually serves them.
  const [articles, cmsConcerns, ingredients, cmsProducts] = await Promise.all([
    client.fetch<SitemapDocument[]>(
      `*[_type == "article" && defined(slug.current) && !(_id in path("drafts.**"))]{
        "slug": slug.current,
        "updatedAt": _updatedAt
      }`
    ),
    client.fetch<SitemapDocument[]>(
      `*[_type == "concern" && defined(slug.current) && !(_id in path("drafts.**"))]{
        "slug": slug.current,
        "updatedAt": _updatedAt
      }`
    ),
    client.fetch<SitemapDocument[]>(
      `*[_type == "ingredient" && defined(slug.current) && !(_id in path("drafts.**"))]{
        "slug": slug.current,
        "updatedAt": _updatedAt
      }`
    ),
    client.fetch<SitemapDocument[]>(
      `*[_type == "product" && defined(slug.current) && !(_id in path("drafts.**"))]{
        "slug": slug.current,
        "updatedAt": _updatedAt
      }`
    ),
  ]);

  for (const article of articles) {
    if (isValidSlug(article.slug)) {
      addUrl(`/blog/${article.slug}`, 0.8, article.updatedAt);
    }
  }

  for (const concern of cmsConcerns) {
    if (isValidSlug(concern.slug)) {
      addUrl(`/skin-concerns/${concern.slug}`, 0.7, concern.updatedAt);
    }
  }

  for (const ingredient of ingredients) {
    if (isValidSlug(ingredient.slug)) {
      addUrl(`/ingredients/${ingredient.slug}`, 0.7, ingredient.updatedAt);
    }
  }

  for (const product of cmsProducts) {
    if (isValidSlug(product.slug)) {
      addUrl(`/products/${product.slug}`, 0.6, product.updatedAt);
    }
  }

  return entries;
}
