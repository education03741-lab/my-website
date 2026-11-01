import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep one canonical host for all skincare pages. This rule only matches
  // www.glowskin.blog and does not affect any tool subdomains.
  // Hostinger must still pass the requested Host header through to Next.js.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host" as const, value: "www.glowskin.blog" }],
        destination: "https://glowskin.blog/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;