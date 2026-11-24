import type { NextConfig } from "next";

const config: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  async headers() {
    return [{
      source: "/images/products/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=86400" },
        { key: "Vercel-CDN-Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
      ],
    }];
  },
};

export default config;
