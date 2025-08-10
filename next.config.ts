import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/photo-**',
      },
      {
        protocol: 'https',
        hostname: 'videos.pexels.com',
        port: '',
        pathname: '/video-files/**',
      },
    ],
  },
  eslint: {
    // Désactiver ESLint temporairement pour le build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Désactiver les erreurs TypeScript temporairement pour le build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
