import { MetadataRoute } from "next";
import { posts } from "./data/posts";

const baseUrl = "https://glowskin.blog";

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages
  const staticRoutes = [
    "",
    "/blog",
    "/ingredients",
    "/skin-concerns",
    "/products",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Blog posts
  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}