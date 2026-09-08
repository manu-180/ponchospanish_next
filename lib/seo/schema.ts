/**
 * Structured-data (schema.org / JSON-LD) builders.
 *
 * Everything here is server-rendered into the page so search engines and AI
 * answer engines can read it without executing JavaScript. Stable `@id`
 * anchors let nodes reference each other across a `@graph`.
 *
 * Rule of thumb (per Google's guidelines): only describe content that is
 * actually present and true on the page — never fabricate ratings or data.
 */
import { siteConfig, siteUrl, absolute, publicImageUrl } from "@/lib/seo/config";

type JsonLdNode = Record<string, unknown>;

const ORG_ID = `${siteUrl}/#organization`;
const WEBSITE_ID = `${siteUrl}/#website`;
const PERSON_ID = `${siteUrl}/#anto`;

/** The teaching business itself (sitewide). */
export function organizationSchema(): JsonLdNode {
  return {
    "@type": "EducationalOrganization",
    "@id": ORG_ID,
    name: siteConfig.name,
    alternateName: "Poncho Spanish Academy",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: absolute("/images/logo.png"),
    },
    image: absolute("/opengraph-image"),
    description: siteConfig.description,
    email: siteConfig.email,
    foundingDate: siteConfig.foundingYear,
    founder: { "@id": PERSON_ID },
    knowsLanguage: ["en", "es"],
    areaServed: { "@type": "Country", name: siteConfig.areaServed },
    sameAs: [siteConfig.instagram],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: siteConfig.email,
      availableLanguage: ["English", "Spanish"],
      areaServed: siteConfig.countryCode,
    },
  };
}

/** The website entity (sitewide). */
export function websiteSchema(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: siteUrl,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    publisher: { "@id": ORG_ID },
  };
}

/** Anto — the teacher (E-E-A-T author/expert signal). */
export function personSchema(): JsonLdNode {
  const f = siteConfig.founder;
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: f.name,
    jobTitle: f.jobTitle,
    description: f.bio,
    image: absolute(f.image),
    worksFor: { "@id": ORG_ID },
    url: absolute("/#about"),
    nationality: { "@type": "Country", name: "Argentina" },
    knowsLanguage: ["es", "en"],
    knowsAbout: [
      "Spanish language",
      "Spanish as a foreign language",
      "Teaching children and teenagers",
      "GCSE Spanish",
      "IGCSE Spanish",
    ],
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certification",
      name: f.credential,
    },
  };
}

/**
 * The live lesson offerings (homepage). Concrete prices help AI answer
 * "how much are Spanish lessons in the UK" type queries.
 */
export function lessonServicesSchema(): JsonLdNode[] {
  const services: Array<{ name: string; description: string; price: number }> = [
    {
      name: "Private 1-to-1 Spanish lessons",
      description:
        "Personalised one-to-one online Spanish lessons for children and teens aged 7–18.",
      price: 35,
    },
    {
      name: "Small group Spanish lessons",
      description:
        "Online Spanish lessons in a small group of up to 4 learners — social learning with individual attention.",
      price: 40,
    },
    {
      name: "GCSE & IGCSE Spanish exam support",
      description:
        "Focused GCSE and IGCSE Spanish preparation, 1-to-1 or in a small group, built to boost confidence and calm nerves.",
      price: 50,
    },
    {
      name: "Private 1-to-1 Spanish lessons for adults",
      description:
        "Personalised one-to-one online Spanish lessons for adults, with a relaxed, stress-free approach built around your own goals.",
      price: 35,
    },
  ];

  return services.map((s) => ({
    "@type": "Service",
    name: s.name,
    description: s.description,
    serviceType: "Online Spanish lessons",
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: siteConfig.areaServed },
    audience: { "@type": "EducationalAudience", educationalRole: "student" },
    offers: {
      "@type": "Offer",
      price: s.price,
      priceCurrency: "GBP",
      url: siteConfig.bookingUrl,
      availability: "https://schema.org/InStock",
    },
  }));
}

/** FAQ pairs — visible on the page AND emitted as FAQPage. */
export interface FaqItem {
  question: string;
  answer: string;
}

export function faqPageSchema(items: FaqItem[]): JsonLdNode {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Breadcrumbs for nested pages. */
export function breadcrumbSchema(
  crumbs: Array<{ name: string; path: string }>,
): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absolute(c.path),
    })),
  };
}

/** Minimal shape needed to describe a course — matches the `courses` table. */
export interface CourseSchemaInput {
  title: string;
  slug: string;
  description?: string | null;
  subtitle?: string | null;
  level?: string | null;
  price_gbp: number;
  cover_image_path?: string | null;
  avg_rating?: number | null;
  ratings_count?: number | null;
  totalDurationSeconds?: number;
}

/** Course schema for an on-demand Academy course (Google Course rich result). */
export function courseSchema(course: CourseSchemaInput): JsonLdNode {
  const url = absolute(`/ondemand/${encodeURIComponent(course.slug)}`);
  const image = publicImageUrl(course.cover_image_path);
  const duration = workload(course.totalDurationSeconds);
  const node: JsonLdNode = {
    "@type": "Course",
    "@id": `${url}#course`,
    name: course.title,
    description:
      course.description?.slice(0, 280) ??
      course.subtitle ??
      `${course.title} — a self-paced online Spanish course by Poncho Spanish.`,
    url,
    inLanguage: ["es", "en"],
    teaches: "Spanish",
    provider: { "@id": ORG_ID },
    ...(image ? { image } : {}),
    ...(course.level ? { educationalLevel: course.level } : {}),
    offers: {
      "@type": "Offer",
      category: course.price_gbp > 0 ? "Paid" : "Free",
      price: course.price_gbp,
      priceCurrency: "GBP",
      availability: "https://schema.org/InStock",
      url,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      ...(duration ? { courseWorkload: duration } : {}),
      instructor: { "@id": PERSON_ID },
    },
  };

  // Only emit ratings when they are real and visible on the page.
  if (Number.isInteger(course.ratings_count) && (course.ratings_count ?? 0) > 0 &&
      course.avg_rating != null && Number.isFinite(course.avg_rating) &&
      course.avg_rating >= 1 && course.avg_rating <= 5) {
    node.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(course.avg_rating.toFixed(1)),
      ratingCount: course.ratings_count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return node;
}

/** An ordered list of courses (Academy catalogue → course carousel result). */
export function courseListSchema(courses: CourseSchemaInput[]): JsonLdNode {
  return {
    "@type": "ItemList",
    itemListElement: courses.map((course, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: courseSchema(course),
    })),
  };
}

/** Minimal shape to describe a digital product — matches `digital_products`. */
export interface DigitalProductSchemaInput {
  title: string;
  slug: string;
  description?: string | null;
  subtitle?: string | null;
  price_gbp: number;
  cover_image_path?: string | null;
}

/** Product schema for a standalone ebook / downloadable resource. */
export function digitalProductSchema(p: DigitalProductSchemaInput): JsonLdNode {
  const url = absolute(`/ondemand/ebooks/${encodeURIComponent(p.slug)}`);
  const image = publicImageUrl(p.cover_image_path);
  return {
    "@type": ["Product", "Book"],
    "@id": `${url}#product`,
    name: p.title,
    description:
      p.description?.slice(0, 280) ??
      p.subtitle ??
      `${p.title} — a downloadable Spanish ebook by Poncho Spanish.`,
    url,
    bookFormat: "https://schema.org/EBook",
    inLanguage: ["en", "es"],
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
    brand: { "@id": ORG_ID },
    ...(image ? { image } : {}),
    offers: {
      "@type": "Offer",
      price: p.price_gbp,
      priceCurrency: "GBP",
      availability: "https://schema.org/InStock",
      url,
    },
  };
}

/** A list of digital products (Academy resources section). */
export function digitalProductListSchema(
  products: DigitalProductSchemaInput[],
): JsonLdNode {
  return {
    "@type": "ItemList",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: digitalProductSchema(p),
    })),
  };
}

function workload(seconds?: number): string | undefined {
  if (!seconds || !Number.isFinite(seconds) || seconds <= 0) return undefined;
  return `PT${Math.ceil(seconds)}S`;
}

/** Wrap nodes into a single schema.org graph. */
export function graph(...nodes: JsonLdNode[]): JsonLdNode {
  return { "@context": "https://schema.org", "@graph": nodes };
}
