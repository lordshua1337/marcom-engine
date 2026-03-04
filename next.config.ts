import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/marcom-engine",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
