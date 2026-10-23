import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Increase body size limit for file uploads (50MB)
  api: {
    bodyParser: false,
  },
};

export default nextConfig;
