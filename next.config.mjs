/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
    optimizePackageImports: ['lucide-react'],
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Bundle analyzer (optional - comment out for production)
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
  //     config.plugins.push(
  //       new BundleAnalyzerPlugin({
  //         analyzerMode: 'static',
  //         openAnalyzer: false,
  //       })
  //     )
  //   }
  //   return config
  // },
};

export default nextConfig;
