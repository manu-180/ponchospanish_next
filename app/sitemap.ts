import type { MetadataRoute } from 'next'

const BASE = 'https://ponchospanish.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,                      lastModified: new Date('2026-06-01'), changeFrequency: 'weekly',  priority: 1    },
    { url: `${BASE}/ondemand`,        lastModified: new Date('2026-06-01'), changeFrequency: 'weekly',  priority: 0.9  },
    { url: `${BASE}/ondemand/ebooks`, lastModified: new Date('2026-06-01'), changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE}/legal/terms`,     lastModified: new Date('2026-01-01'), changeFrequency: 'yearly',  priority: 0.3  },
  ]
}
