import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deployment: Use Vercel (recommended) or see docs/GITHUB_PAGES_DEPLOYMENT.md
  // For static export, uncomment: output: 'export', basePath: '/pixelverk'
  
  images: {
    // For static export, add: unoptimized: true
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
};

export default nextConfig;
