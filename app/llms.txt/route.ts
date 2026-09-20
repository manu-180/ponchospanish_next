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
Every new learner starts with a free trial. Fees are paid monthly via PayPal.

## Live lesson prices (GBP, per 50-minute session)

- Private one-to-one, children and teens aged 7-18: £35
- Small group of up to 4 learners, children and teens: £40 total, shared between families
- GCSE and IGCSE Spanish exam support: £50
- Private one-to-one for adults: £35

## Lesson pages

${lessonPages
  .map((l) => `- [${l.heading}](${absolute(`/spanish-lessons/${l.slug}`)}): ${l.description}`)
  .join("\n")}

## Free guides

${guidePages
  .map((g) => `- [${g.title}](${absolute(`/guides/${g.slug}`)}): ${g.description}`)
  .join("\n")}

## Self-paced Academy

- [Spanish courses and ebooks](${absolute("/ondemand")}): self-paced video courses and downloadable workbooks. Pay once, lifetime access, no subscription.

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
