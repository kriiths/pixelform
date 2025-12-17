import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // IMPORTANT: Static export is NOT compatible with server components that use 'use server'
  // Since this project uses server-side file system operations for product loading,
  // you have TWO deployment options:
  
  // OPTION 1: Deploy to Vercel (RECOMMENDED - supports all Next.js features)
  // - Push to GitHub
  // - Import to Vercel
  // - Automatic deployments on push
  // - No configuration needed
  
  // OPTION 2: Convert to static data (for GitHub Pages)
  // - Move product data from filesystem to a static JSON file
  // - Remove 'use server' from loader.ts
  // - Uncomment the lines below:
  
  // output: 'export',
  // basePath: '/pixelverk',  // Only if deploying to username.github.io/pixelverk
  // assetPrefix: '/pixelverk/',  // Only if deploying to username.github.io/pixelverk
  
  images: {
    // Uncomment for static export:
    // unoptimized: true,
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
  },
};

export default nextConfig;
