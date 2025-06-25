import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        hostname: "picsum.photos",
      },
    ],
  },
  reactStrictMode: false, // Disable React Strict Mode
};

export default nextConfig;
