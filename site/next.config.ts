import type { NextConfig } from "next";

// On GitHub Pages this is a project page served under /<repo>, so the CI sets
// PAGES_BASE_PATH=/imaddi47. Locally it's empty (served at root).
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
