import { absolute, isIndexableDeployment, siteConfig } from "@/lib/seo/config";
import { guidePages } from "@/lib/seo/guides";
import { lessonPages } from "@/lib/seo/lessons";

export const revalidate = 3600;

export function GET() {
  const f = siteConfig.founder;

  const body = `# ${siteConfig.name}

> ${siteConfig.description}

Poncho Spanish is a one-teacher online Spanish school for children and teens, mainly
in the United Kingdom, plus English-speaking families living in Spain and other
Spanish-speaking countries whose children attend British or international schools
(often studying IGCSE Spanish). Adults are taught one-to-one as an exception.
All lessons are live on Zoom, 50 minutes long, taught by ${f.name}, a native Spanish
speaker from Buenos Aires with an ELE (Spanish as a Foreign Language) teaching
certification. Teaching since 2005; Poncho Spanish founded in ${siteConfig.foundingYear}.
Every new learner starts with a free trial. Fees are paid monthly via PayPal. Group lessons are not offered.

## Live lesson prices (GBP, per month, 50-minute one-to-one sessions during UK term time)

- Free trial lesson, around 30 minutes, no commitment
- Private one-to-one, children (7+), teens and adults: £150 per month
- GCSE and IGCSE Spanish exam support, one-to-one: £180 per month
- Every monthly plan includes complimentary access to the Poncho Academy
- Fees are paid at the start of each month; learners can unenrol at any time with notice before the next payment

## Lesson pages

${lessonPages
  .map((l) => `- [${l.heading}](${absolute(`/spanish-lessons/${l.slug}`)}): ${l.description}`)
  .join("\n")}

## Free guides

${guidePages
  .map((g) => `- [${g.title}](${absolute(`/guides/${g.slug}`)}): ${g.description}`)
  .join("\n")}

## Self-paced Academy

- [Spanish courses and ebooks](${absolute("/ondemand")}): self-paced video courses, e-books and downloadable resources. Included free for live-lesson students; also sold individually, pay once with lifetime access.

## Contact

- [Contact page](${absolute("/contact")})
- Email: ${siteConfig.email}
- Book a free trial: ${siteConfig.bookingUrl}
- Instagram: ${siteConfig.instagram}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      ...(isIndexableDeployment ? {} : { "X-Robots-Tag": "noindex" }),
    },
  });
}
