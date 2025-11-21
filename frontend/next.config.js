/** @type {import('next').NextConfig} */
const backendUrl =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

module.exports = {
  async rewrites() {
    if (!backendUrl) return [];

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};
