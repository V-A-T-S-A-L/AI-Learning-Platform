import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // ⚡ Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ⚡ Remove deprecated dev indicators
  devIndicators: false,

  // ⚡ Add Webpack alias for @ → src
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
};

export default nextConfig;
