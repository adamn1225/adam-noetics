import type { NextConfig } from "next";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.plugins = config.resolve.plugins || [];
    config.resolve.plugins.push(new TsconfigPathsPlugin());
    return config;
  },
  trailingSlash: true,
  images: {
    domains: ['hvgusjfevfbhfminbmtc.supabase.co'],
  },
};

export default nextConfig;