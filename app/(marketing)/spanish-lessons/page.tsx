import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/seo/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { lessonPages } from "@/lib/seo/lessons";
import { breadcrumbSchema, graph } from "@/lib/seo/schema";

export const metadata = pageMetadata({
  title: "Online Spanish Lessons: Find Your Class",
  description: "Find online Spanish lessons for children, GCSE students, home-educating families and adults. Compare formats and prices with Poncho Spanish. Try a free lesson.",
  path: "/spanish-lessons",
});

export default function SpanishLessonsPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Spanish lessons", path: "/spanish-lessons" }]))} />
      <section className="py-12 md:py-20">
        <div className="container-wide">
          <nav aria-label="Breadcrumb" className="mb-10 text-sm text-charcoal-400"><Link href="/" className="underline underline-offset-4">Home</Link><span aria-hidden="true" className="mx-3">/</span><span aria-current="page">Spanish lessons</span></nav>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-600">Live online · With Anto</p>
            <h1 className="mt-5 font-serif text-display-lg gradient-text text-balance">Find your online Spanish lessons</h1>
            <p className="mt-6 text-lg leading-relaxed text-charcoal-500/85">Choose Spanish lessons around the person learning. Poncho Spanish offers individual lessons, small groups and focused exam support for learners across the UK, taught by Anto, a certified native teacher from Buenos Aires.</p>
            <p className="mt-4 text-lg leading-relaxed text-charcoal-500/85">Explore the options below to see who each is for, how it works and what to discuss in your free trial. Regular sessions last 50 minutes and take place on Zoom during term time.</p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {lessonPages.map((lesson) => <Link key={lesson.slug} href={`/spanish-lessons/${lesson.slug}`} className="group rounded-3xl bg-cream-50 p-7 shadow-soft ring-1 ring-charcoal-100/30 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-soft-lg motion-reduce:transform-none md:p-9"><p className="text-xs font-semibold uppercase tracking-wider text-charcoal-600">{lesson.audience}</p><h2 className="mt-4 font-serif text-3xl">{lesson.heading}</h2><p className="mt-4 text-base leading-relaxed text-charcoal-500/85">{lesson.slug === "children" ? "Individual attention or a small group of friends for learners aged 7–18, including beginners and children learning alongside school." : lesson.slug === "gcse" ? "Focused GCSE and IGCSE support. Bring your exam board, current challenges and goals to discuss a suitable starting point." : lesson.slug === "home-education" ? "Live Spanish lessons as part of your family's home education routine, with individual and small group options." : "Private lessons built around the conversations you want to have, from starting out to returning to Spanish."}</p><p className="mt-6 font-semibold text-charcoal-600">Explore lessons <span aria-hidden="true">→</span></p></Link>)}
          </div>
          <section className="mt-16 max-w-3xl">
            <h2 className="font-serif text-3xl md:text-4xl">Compare lesson prices</h2>
            <div className="mt-6 overflow-x-auto rounded-2xl bg-cream-50 p-4 ring-1 ring-charcoal-100/30 sm:p-6">
              <table className="w-full text-left text-sm"><caption className="sr-only">Prices per 50-minute live Spanish lesson</caption><thead><tr className="border-b border-charcoal-100/60"><th scope="col" className="pb-3 pr-4">Format</th><th scope="col" className="pb-3">Per session</th></tr></thead><tbody>{[["Private lessons for children, teens or adults", "£35"], ["Your own group, up to four learners", "£40 total, shared"], ["GCSE or IGCSE support, private or up to four learners", "£50 total, shared if in a group"]].map(([format, price]) => <tr key={format} className="border-b border-charcoal-100/40 last:border-0"><th scope="row" className="py-4 pr-4 font-normal leading-relaxed">{format}</th><td className="py-4 leading-relaxed">{price}</td></tr>)}</tbody></table>
            </div>
            <p className="mt-4 text-base leading-relaxed text-charcoal-500/85">The trial is free. Regular lesson fees are paid monthly via PayPal. Discuss your availability with Anto and read the <Link href="/legal/terms" className="underline underline-offset-4 hover:text-charcoal-600">terms and conditions</Link> before arranging lessons.</p>
          </section>
          <section className="mt-14 max-w-3xl">
            <h2 className="font-serif text-3xl">Prefer to learn in your own time?</h2>
            <p className="mt-4 text-base leading-relaxed text-charcoal-500/85">Live lessons give you time with a teacher. For independent study, explore the <Link href="/ondemand" className="underline underline-offset-4 hover:text-charcoal-600">Academy&rsquo;s self-paced Spanish courses and ebooks</Link>. Check each resource&rsquo;s level and description to find a suitable starting point.</p>
            <Button asChild size="lg" className="mt-7"><a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer">Book a free trial with Anto</a></Button>
          </section>
        </div>
      </section>
    </>
  );
}
