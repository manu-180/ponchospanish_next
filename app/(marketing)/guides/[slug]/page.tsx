import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { AnimatedSection } from "@/components/shared/animated-section";
import { pageMetadata } from "@/lib/seo/metadata";
import { absolute, siteConfig } from "@/lib/seo/config";
import { getGuidePage, guidePages } from "@/lib/seo/guides";
import { lessonPages } from "@/lib/seo/lessons";
import { articleSchema, breadcrumbSchema, faqPageSchema, graph } from "@/lib/seo/schema";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return guidePages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const guide = getGuidePage((await params).slug);
  if (!guide) notFound();
  return pageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    image: guide.image,
  });
}

function wordCount(guide: NonNullable<ReturnType<typeof getGuidePage>>) {
  const text = [
    guide.introduction,
    ...guide.sections.flatMap((s) => [...s.paragraphs, ...(s.bullets ?? [])]),
    ...guide.faqs.flatMap((f) => [f.question, f.answer]),
  ].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}

export default async function GuideDetailPage({ params }: PageProps) {
  const guide = getGuidePage((await params).slug);
  if (!guide) notFound();

  const path = `/guides/${guide.slug}`;
  const lessons = lessonPages.filter((lesson) => guide.relatedLessons.includes(lesson.slug));
  const guides = guidePages.filter((other) => guide.relatedGuides.includes(other.slug));
  const updated = new Date(guide.updated).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: guide.heading, path },
          ]),
          articleSchema({
            headline: guide.title,
            description: guide.description,
            path,
            image: guide.image,
            datePublished: guide.updated,
            wordCount: wordCount(guide),
          }),
          faqPageSchema(guide.faqs),
        )}
      />

      <article>
        <section className="pt-8 pb-12 md:pt-12 md:pb-16">
          <div className="container-wide">
            <nav aria-label="Breadcrumb" className="mb-10 text-sm text-charcoal-400">
              <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <li>
                  <Link href="/" className="underline underline-offset-4 hover:text-charcoal-600">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href="/guides"
                    className="underline underline-offset-4 hover:text-charcoal-600"
                  >
                    Guides
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page">{guide.kicker.split(" · ")[0]}</li>
              </ol>
            </nav>

            <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-600">
                  {guide.kicker}
                </p>
                <h1 className="mt-5 font-serif text-display-lg text-balance gradient-text">
                  {guide.heading}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-charcoal-500/85">
                  {guide.introduction}
                </p>
                <p className="mt-6 text-sm text-charcoal-400">
                  By {siteConfig.founder.name} · Certified ELE teacher · Updated {updated} ·{" "}
                  {guide.readingMinutes} min read
                </p>
              </div>
              <div className="rounded-[2rem] bg-mustard/10 p-2">
                <div className="relative aspect-[5/4] overflow-hidden rounded-[1.5rem]">
                  <Image
                    src={guide.image}
                    alt={guide.imageAlt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 42vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {guide.keyFacts && (
          <section className="pb-12 md:pb-16">
            <div className="container-wide">
              <dl className="grid gap-5 rounded-3xl bg-cream-50 p-6 ring-1 ring-charcoal-100/40 sm:grid-cols-2 lg:grid-cols-4 md:p-8">
                {guide.keyFacts.map(({ label, value }) => (
                  <div key={label}>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">
                      {label}
                    </dt>
                    <dd className="mt-2 text-charcoal-600">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}

        <section className="pb-16 md:pb-20">
          <div className="container-narrow">
            {guide.sections.map((section) => (
              <AnimatedSection key={section.heading}>
                <div className="mb-12 md:mb-16">
                  <h2 className="font-serif text-3xl leading-snug md:text-4xl">
                    {section.heading}
                  </h2>
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 40)}
                      className="mt-5 leading-relaxed text-charcoal-500"
                    >
                      {paragraph}
                    </p>
                  ))}
                  {section.bullets && (
                    <ul className="mt-6 space-y-3">
                      {section.bullets.map((bullet) => (
                        <li
                          key={bullet.slice(0, 40)}
                          className="flex gap-3 text-charcoal-500"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mustard"
                          />
                          <span className="leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        <section className="pb-16 md:pb-20">
          <div className="container-narrow">
            <AnimatedSection>
              <div className="rounded-3xl bg-charcoal-600 p-8 text-cream-50 md:p-10">
                <h2 className="font-serif text-3xl leading-snug">{guide.cta.heading}</h2>
                <p className="mt-4 max-w-xl leading-relaxed text-cream-50/80">
                  {guide.cta.body}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Button asChild size="lg">
                    <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer">
                      Book a free trial
                    </a>
                  </Button>
                  <Link
                    href={guide.cta.href}
                    className="font-semibold text-cream-50 underline underline-offset-4 transition-colors hover:text-mustard-200"
                  >
                    {guide.cta.label}
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="pb-16 md:pb-20">
          <div className="container-narrow">
            <h2 className="font-serif text-3xl">Common questions</h2>
            <dl className="mt-8 divide-y divide-charcoal-100/60 border-y border-charcoal-100/60">
              {guide.faqs.map((faq) => (
                <div key={faq.question} className="py-6">
                  <dt className="font-semibold text-charcoal-600">{faq.question}</dt>
                  <dd className="mt-3 leading-relaxed text-charcoal-500">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="pb-24 md:pb-32">
          <div className="container-wide">
            <h2 className="font-serif text-3xl">Keep reading</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {lessons.map((lesson) => (
                <Link
                  key={lesson.slug}
                  href={`/spanish-lessons/${lesson.slug}`}
                  className="group flex items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-charcoal-100/40 transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-charcoal-400">
                      {lesson.audience}
                    </span>
                    <span className="mt-2 block font-serif text-xl">{lesson.heading}</span>
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-charcoal-400 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              ))}
              {guides.map((other) => (
                <Link
                  key={other.slug}
                  href={`/guides/${other.slug}`}
                  className="group flex items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-charcoal-100/40 transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-charcoal-400">
                      {other.kicker}
                    </span>
                    <span className="mt-2 block font-serif text-xl">{other.heading}</span>
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-charcoal-400 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
