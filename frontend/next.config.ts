import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Auto-convert to WebP/AVIF for smaller file sizes on supported browsers
    formats: ['image/avif', 'image/webp'],
    // Limit sizes to avoid generating too many variants
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: '*.railway.app',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
        pathname: '/storage/**',
      },
    ],
  },
  allowedDevOrigins: ['192.168.100.35', 'localhost', '127.0.0.1'],
};

export default nextConfig;