import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://your-domain.com"; // TODO: replace with your real domain

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/studio/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}