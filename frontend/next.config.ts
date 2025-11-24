import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Proxy all /api requests to the FastAPI backend running on localhost:8000
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/:path*",
      },
    ];
  },
};

export default nextConfig;
