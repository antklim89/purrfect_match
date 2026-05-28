import type { NextConfig } from 'next';

import { env } from './src/shared/lib/env';

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
      destination: `${env.API_URL}/api/:path*`,
      source: '/api/:path*',
    },
  ],
};

export default nextConfig;
