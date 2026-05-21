/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Supabase Storage signed URLs (course covers, workbooks, resources)
      { protocol: "https", hostname: "**.supabase.co" },
      // Mux video thumbnails (`https://image.mux.com/{playbackId}/thumbnail.jpg`)
      { protocol: "https", hostname: "image.mux.com" },
      // Mux still / animated GIF previews
      { protocol: "https", hostname: "stream.mux.com" },
    ],
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@mux/mux-player-react",
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Legacy /courses → /ondemand (permanent, preserves SEO)
      {
        source: "/courses",
        destination: "/ondemand",
        permanent: true,
      },
      {
        source: "/courses/:slug*",
        destination: "/ondemand/:slug*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
