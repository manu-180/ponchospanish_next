/**
 * Mapa de las URLs del sitio Wix anterior → su equivalente más cercano hoy.
 * Ordenado de específico a genérico: el catch-all de /service-page va último
 * para no tapar los mapeos individuales.
 */
const LEGACY_WIX_REDIRECTS = [
  ["/about", "/#about"],
  ["/classes", "/spanish-lessons"],
  ["/pricing", "/spanish-lessons"],
  ["/plans-pricing", "/spanish-lessons"],
  ["/faqs", "/#faq"],
  ["/faq", "/#faq"],
  ["/book-online", "/spanish-lessons"],
  ["/bookings-checkout", "/spanish-lessons"],
  ["/for-travellers", "/spanish-lessons/adults"],
  ["/forschools", "/spanish-lessons"],
  ["/for-schools", "/spanish-lessons"],
  ["/socialclub", "/spanish-lessons"],
  ["/social-club", "/spanish-lessons"],
  ["/copy-of-adults", "/spanish-lessons/adults"],
  ["/adults", "/spanish-lessons/adults"],
  ["/testimonials", "/#reviews"],
  ["/shop", "/ondemand"],
  ["/service-page/7-11-yrs-beginners-group", "/spanish-lessons/children"],
  ["/service-page/11-14-yrs-beginners-group", "/spanish-lessons/children"],
  ["/service-page/11-14-yrs-pre-intermediate-group", "/spanish-lessons/children"],
  ["/service-page/14-yrs-intermediate-group", "/spanish-lessons/children"],
  ["/service-page/7-18-yrs-all-levels-private", "/spanish-lessons/children"],
  ["/service-page/i-gcse-exam-support-private", "/spanish-lessons/gcse"],
  ["/service-page/:slug*", "/spanish-lessons"],
  ["/_files/:path*", "/ondemand"],
];

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
      // ponchospanish.com corrió sobre Wix hasta mayo 2026. Estas URLs siguen
      // indexadas en Google y llegando desde directorios UK (thefamilygrapevine,
      // clubhubuk); sin estas reglas devuelven 404 y se tira la autoridad de un
      // dominio de 2023. 301 explícito en vez de `permanent: true` (308) porque
      // algunos crawlers y directorios viejos no consolidan señales con 308.
      ...LEGACY_WIX_REDIRECTS.map(([source, destination]) => ({
        source,
        destination,
        statusCode: 301,
      })),
    ];
  },
};

export default nextConfig;
