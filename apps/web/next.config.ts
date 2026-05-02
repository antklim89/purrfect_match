import type { NextConfig } from 'next';

import { env } from './src/shared/lib/env.ts';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  output: 'standalone',
  cacheComponents: true,
  typedRoutes: true,
  turbopack: {},
  allowedDevOrigins: ['127.0.0.1'],
  env,
  rewrites: () => [
    {
      destination: 'http://192.168.90.20:8000/api/:path*',
      source: '/api/:path*',
    },
  ],
};

export default nextConfig;
