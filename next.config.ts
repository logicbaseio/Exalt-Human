import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project (a stray lockfile exists higher up).
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
