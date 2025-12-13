import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
      },
    ],
    // For local development, you can also add specific domains:
    // domains: ['example.com', 'cdn.example.com'],
  },
};

export default nextConfig;
