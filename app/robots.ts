import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/', '/account/', '/learn/'],
    },
    sitemap: 'https://www.ponchospanish.com/sitemap.xml',
  }
}
