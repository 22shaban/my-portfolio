import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Next doesn't resolve `public/admin/index.html` from `/admin` on its own,
  // so the CMS lives at a clean URL instead of `/admin/index.html`.
  async rewrites() {
    return [
      { source: "/admin", destination: "/admin/index.html" },
      { source: "/admin/", destination: "/admin/index.html" },
    ];
  },

  // Keep the admin panel out of search results.
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
