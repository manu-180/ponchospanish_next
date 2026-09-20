import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { AnimatedSection } from "@/components/shared/animated-section";
import { pageMetadata } from "@/lib/seo/metadata";
import { absolute, siteConfig } from "@/lib/seo/config";
import { guidePages } from "@/lib/seo/guides";
import { breadcrumbSchema, graph } from "@/lib/seo/schema";

export const metadata = pageMetadata({
  title: "Spanish Learning Guides for UK Families",
  description:
    "Free guides from Anto on GCSE Spanish, helping your child learn Spanish at home, and fitting Spanish into home education in the UK. Written by a certified native teacher.",
  path: "/guides",
});

export default function GuidesIndexPage() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
          ]),
          {
            "@type": "CollectionPage",
            "@id": `${absolute("/guides")}#collection`,
            url: absolute("/guides"),
            name: "Spanish learning guides for UK families",
            description:
              "Practical guides on GCSE Spanish, supporting a child learning Spanish at home, and home education languages in the UK.",
            inLanguage: siteConfig.language,
            isPartOf: { "@id": `${siteConfig.url}/#website` },
            hasPart: guidePages.map((guide) => ({
              "@type": "Article",
              "@id": `${absolute(`/guides/${guide.slug}`)}#article`,
              headline: guide.title,
              url: absolute(`/guides/${guide.slug}`),
            })),
          },
        )}
      />

      <section className="pt-10 pb-12 md:pt-16 md:pb-16">
        <div className="container-wide">
          <nav aria-label="Breadcrumb" className="mb-10 text-sm text-charcoal-400">
            <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <li>
                <Link href="/" className="underline underline-offset-4 hover:text-charcoal-600">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">Guides</li>
            </ol>
          </nav>

          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-600">
              Free to read · No sign-up
            </p>
            <h1 className="mt-5 font-serif text-display-lg text-balance gradient-text">
              Spanish guides for UK families
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-charcoal-500/85">
              Straight answers to the questions parents actually ask, written by Anto, a
              certified ELE teacher who has been teaching Spanish since 2005. No jargon, no
              sales pitch, and nothing you need an account to read.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container-wide grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {guidePages.map((guide) => (
            <AnimatedSection key={guide.slug}>
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-charcoal-100/40 transition-transform duration-300 hover:-translate-y-1">
                <Link href={`/guides/${guide.slug}`} className="flex h-full flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={guide.image}
                      alt={guide.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal-400">
                      {guide.kicker}
                    </p>
                    <h2 className="mt-3 font-serif text-2xl leading-snug">{guide.heading}</h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal-500">
                      {guide.description}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-charcoal-600">
                      Read the guide
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <span className="mt-2 text-xs text-charcoal-400">
                      {guide.readingMinutes} min read
                    </span>
                  </div>
                </Link>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </>
  );
}
