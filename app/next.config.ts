import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* existing config options here */

  // ⚡ Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ⚡ Remove the deprecated option and disable the dev indicator
  devIndicators: false,
};

export default nextConfig;
