import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["node:sqlite"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/about", destination: "/", permanent: false },
      { source: "/contact", destination: "/", permanent: false },
      { source: "/collection", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
