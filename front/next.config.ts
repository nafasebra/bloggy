import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  fontLoaders: [
    { loader: 'next/font/google', options: { subsets: ['latin'] } }
  ]
};

export default nextConfig;
