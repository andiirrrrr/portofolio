import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
    ],
  },
  // Untuk mengizinkan akses dari network (opsional)
  allowedDevOrigins: ['192.168.100.35', 'localhost', '127.0.0.1'],
};

export default nextConfig;