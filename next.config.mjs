/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOWALL", // Enables embedding
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *;", // Loosens embedding policy
          },
        ],
      },
    ];
  },
}

export default nextConfig
