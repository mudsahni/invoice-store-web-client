import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    output: 'standalone',
    eslint: {
        // Disable ESLint during Next.js build steps
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
