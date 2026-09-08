import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig, absolute } from "@/lib/seo/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { getLessonPage, lessonPages } from "@/lib/seo/lessons";
import { breadcrumbSchema, faqPageSchema, graph } from "@/lib/seo/schema";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return lessonPages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const page = getLessonPage((await params).slug);
  if (!page) notFound();
  return pageMetadata({ title: page.title, description: page.description, path: `/spanish-lessons/${page.slug}`, image: page.image });
}

export default async function LessonDetailPage({ params }: PageProps) {
  const page = getLessonPage((await params).slug);
  if (!page) notFound();
  const path = `/spanish-lessons/${page.slug}`;
  const related = lessonPages.filter((lesson) => page.related.includes(lesson.slug));

  return (
    <>
      <JsonLd data={graph(
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Spanish lessons", path: "/spanish-lessons" }, { name: page.heading, path }]),
        faqPageSchema(page.faqs),
        {
          "@type": "Service",
          "@id": `${absolute(path)}#service`,
          name: page.heading,
          description: page.introduction,
          url: absolute(path),
          provider: { "@id": `${siteConfig.url}/#organization` },
          areaServed: { "@type": "Country", name: "United Kingdom" },
          offers: { "@type": "Offer", price: page.price, priceCurrency: "GBP", description: page.priceNote, url: siteConfig.bookingUrl },
        },
      )} />
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-24">
        <div className="container-wide">
          <nav aria-label="Breadcrumb" className="mb-10 text-sm text-charcoal-400">
            <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <li><Link href="/" className="underline underline-offset-4 hover:text-charcoal-600">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/spanish-lessons" className="underline underline-offset-4 hover:text-charcoal-600">Spanish lessons</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{page.audience.split(" · ")[0]}</li>
            </ol>
          </nav>
          <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-600">{page.audience}</p>
              <h1 className="mt-5 font-serif text-display-lg text-balance gradient-text">{page.heading}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-charcoal-500/85">{page.introduction}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg"><a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer">Book a free trial</a></Button>
                <Button asChild size="lg" variant="soft"><Link href="#lesson-details">See lesson details</Link></Button>
              </div>
              <p className="mt-5 text-sm text-charcoal-400">With Anto · Certified ELE teacher · Teaching since 2005</p>
            </div>
            <div className="rounded-[2rem] bg-mustard/10 p-2">
              <div className="relative aspect-[5/4] overflow-hidden rounded-[1.5rem]">
                <Image src={page.image} alt={page.imageAlt} fill priority sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="lesson-details" className="bg-cream-50/60 py-12 md:py-16 scroll-mt-32">
        <div className="container-wide grid gap-8 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <div>
            <h2 className="font-serif text-3xl">Lesson details</h2>
            <p className="mt-4 font-serif text-3xl text-charcoal-600">£{page.price}<span className="ml-2 font-sans text-base text-charcoal-500">per session</span></p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-charcoal-500">{page.priceNote}</p>
          </div>
          <div>
            <dl className="grid gap-5 sm:grid-cols-2">
              {[ ["Format", "Live online lessons via Zoom"], ["Length", "50-minute regular sessions"], ["When", "During term time, by arrangement"], ["Payment", "Monthly via PayPal"] ].map(([label, value]) => <div key={label}><dt className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">{label}</dt><dd className="mt-2 text-charcoal-500">{value}</dd></div>)}
            </dl>
            <p className="mt-6 text-sm text-charcoal-400">Start with a free trial and agree availability with Anto. Read the <Link href="/legal/terms" className="underline underline-offset-4 hover:text-charcoal-600">lesson terms and conditions</Link>.</p>
          </div>
        </div>
      </section>
      <div className="container-wide grid gap-14 py-16 lg:grid-cols-[1.5fr_1fr] lg:gap-20 md:py-24">
        <div className="space-y-12">
          {page.sections.map((section) => <section key={section.heading}>
            <h2 className="font-serif text-3xl md:text-4xl text-balance">{section.heading}</h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-charcoal-500/85">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            {page.slug === "gcse" && section.heading.startsWith("GCSE and IGCSE") && <p className="mt-4 text-sm leading-relaxed text-charcoal-500">Official resources: <a className="underline underline-offset-4 hover:text-charcoal-600" href="https://www.aqa.org.uk/subjects/spanish/gcse/spanish-8692/specification">AQA GCSE Spanish 8692 specification</a> and <a className="underline underline-offset-4 hover:text-charcoal-600" href="https://qualifications.pearson.com/en/qualifications/edexcel-gcses/spanish-2024.html">Pearson Edexcel GCSE Spanish (2024)</a>.</p>}
          </section>)}
          <section>
            <h2 className="font-serif text-3xl">Questions about {page.slug === "gcse" ? "exam support" : "your lessons"}</h2>
            <div className="mt-6 divide-y divide-charcoal-100/60">
              {page.faqs.map((faq) => <details key={faq.question} className="group py-5"><summary className="cursor-pointer font-semibold leading-relaxed text-charcoal-500 marker:text-charcoal-600">{faq.question}</summary><p className="mt-4 text-base leading-relaxed text-charcoal-500/85">{faq.answer}</p></details>)}
            </div>
          </section>
        </div>
        <aside className="space-y-8">
          <section className="rounded-3xl bg-cream-50 p-7 shadow-soft ring-1 ring-charcoal-100/30 md:p-9">
            <h2 className="font-serif text-2xl">What to bring to the free trial</h2>
            <ul className="mt-5 list-disc space-y-4 pl-5 text-base leading-relaxed text-charcoal-500 marker:text-charcoal-600">{page.preparation.map((item) => <li key={item}>{item}</li>)}</ul>
            <Button asChild className="mt-7"><a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer">Find a trial time</a></Button>
          </section>
          <section className="px-2">
            <h2 className="font-serif text-2xl">Meet your Spanish teacher</h2>
            <p className="mt-4 text-base leading-relaxed text-charcoal-500/85">Anto is a native Spanish speaker from Buenos Aires and a certified ELE (Spanish as a Foreign Language) teacher. She has taught since 2005 and founded Poncho Spanish in 2020.</p>
            <Link href="/#about" className="mt-4 inline-block py-2 font-semibold text-charcoal-600 underline underline-offset-4">More about Anto</Link>
          </section>
          <section className="px-2">
            <h2 className="font-serif text-2xl">Explore your options</h2>
            <ul className="mt-4 space-y-2">{related.map((lesson) => <li key={lesson.slug}><Link href={`/spanish-lessons/${lesson.slug}`} className="inline-block py-2 text-charcoal-500 underline underline-offset-4 hover:text-charcoal-600">{lesson.heading}</Link></li>)}<li><Link href="/ondemand" className="inline-block py-2 text-charcoal-500 underline underline-offset-4 hover:text-charcoal-600">Self-paced Spanish courses and ebooks</Link></li></ul>
          </section>
        </aside>
      </div>
    </>
  );
}
