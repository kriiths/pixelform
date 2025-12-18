import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deployment: Use Vercel (recommended) or see docs/GITHUB_PAGES_DEPLOYMENT.md
  // For static export, uncomment: output: 'export', basePath: '/pixelverk'
  
  experimental: {
    serverActions: {
      // Allow larger uploads for admin image handling
      bodySizeLimit: '10mb',
    },
  },

  images: {
    // For static export, add: unoptimized: true
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },

  // Ensure proper cache invalidation on deployments
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=0, must-revalidate',
        },
      ],
    },
    {
      source: '/products/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
};

export default nextConfig;
