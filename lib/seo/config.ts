/**
 * Centralised SEO + brand constants — the single source of truth for page
 * metadata, structured data (JSON-LD), the sitemap, robots and Open Graph
 * images.
 *
 * Keywords and positioning are carried over from the original ponchospanish.com
 * site (UK market: Spanish for kids, homeschooling, after-school, GCSE support)
 * and sharpened for the new premium build.
 */

/** Production canonical origin (no trailing slash). */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ponchospanish.com"
).replace(/\/+$/, "");

export const siteConfig = {
  name: "Poncho Spanish",
  /** Used in <title> templates and structured data. */
  title: "Poncho Spanish — Online Spanish Lessons for Kids & Teens in the UK",
  /** Primary site description (≤ 160 chars sweet spot for SERP). */
  description:
    "Online Spanish lessons for kids, teens and families across the UK. Private 1-to-1 classes, small groups, GCSE & IGCSE support, plus a self-paced on-demand Academy.",
  /** Short variant for OG/Twitter and AI extraction. */
  tagline:
    "Online Spanish lessons for kids & teens in the UK — relaxed, positive and confidence-first.",
  url: siteUrl,
  locale: "en_GB",
  language: "en-GB",

  /** Contact + social — kept in sync with the footer. */
  email: "ponchospanish@gmail.com",
  fromEmail: "hello@ponchospanish.com",
  instagram: "https://instagram.com/poncho.spanish",
  instagramHandle: "@poncho.spanish",
  bookingUrl: "https://calendly.com/ponchospanish/30min",

  /** Market / geo targeting (online business serving the UK). */
  areaServed: "United Kingdom",
  countryCode: "GB",
  foundingYear: "2020",

  /** The teacher behind the brand — powers the Person / author schema. */
  founder: {
    name: "Anto",
    jobTitle: "Spanish Teacher & Founder",
    image: "/images/nuevafotodeanto.jpg",
    nationality: "Argentine",
    homeLocation: "Buenos Aires, Argentina",
    credential:
      "ELE — Español como Lengua Extranjera (Spanish as a Foreign Language) teaching certification",
    bio: "Anto is a certified ELE (Spanish as a Foreign Language) teacher and native speaker from Buenos Aires, Argentina. She has been teaching since 2005 and founded Poncho Spanish in 2020 to make learning feel relaxed, positive and meaningful.",
  },

  /**
   * Target keyword set, ported from the original Flutter site and expanded.
   * Order roughly reflects priority (primary → long-tail).
   */
  keywords: [
    "online Spanish lessons",
    "Spanish lessons for kids",
    "Spanish for kids UK",
    "Spanish lessons for teens",
    "Spanish tutor UK",
    "online Spanish classes for children",
    "GCSE Spanish support",
    "IGCSE Spanish tutor",
    "Spanish for homeschooling",
    "home education Spanish",
    "after school Spanish club",
    "extra curricular Spanish",
    "private Spanish lessons online",
    "learn Spanish online",
    "Spanish classes UK",
  ],
} as const;

/** Build an absolute URL from a site-relative path. */
export function absolute(path = "/"): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
