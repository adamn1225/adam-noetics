import type { NextConfig } from "next";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.plugins = config.resolve.plugins || [];
    config.resolve.plugins.push(new TsconfigPathsPlugin());
    return config;
  },
  trailingSlash: true,
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
      '/signup': { page: '/signup' },
      '/dashboard': { page: '/dashboard' },
      // Add other pages here
    }
  },
  experimental: {
    turbo: {
      // Add valid ExperimentalTurboOptions properties here
    },
  },
};

export default nextConfig;