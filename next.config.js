/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['icon-library'],
    webpackMemoryOptimizations: true,
  },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          pathname: '/**',
        },
      ],
    },
  };

  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
    
  })
  
  module.exports = withBundleAnalyzer(nextConfig);
  