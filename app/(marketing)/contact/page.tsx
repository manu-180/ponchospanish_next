import Link from "next/link";
import { Mail, Instagram, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/marketing/contact-form";
import { AnimatedSection } from "@/components/shared/animated-section";
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { siteConfig, absolute } from "@/lib/seo/config";
import { breadcrumbSchema, graph } from "@/lib/seo/schema";

export const metadata = pageMetadata({
  title: "Contact Poncho Spanish",
  description:
    "Ask Anto about online Spanish lessons for your child, your family or yourself. Message us, email directly or book a free trial — we reply personally within 24 hours.",
  path: "/contact",
});

const channels = [
  {
    icon: CalendarCheck,
    title: "Book a free trial",
    body: "The easiest way to start. Pick a time that suits you and meet Anto — no payment details, no commitment.",
    href: siteConfig.bookingUrl,
    label: "Choose a time",
    external: true,
  },
  {
    icon: Mail,
    title: "Email Anto",
    body: "Prefer writing? Send your question straight to the inbox and you will hear back personally.",
    href: `mailto:${siteConfig.email}`,
    label: siteConfig.email,
    external: false,
  },
  {
    icon: Instagram,
    title: "Instagram",
    body: "See what lessons actually look like — activities, learner work and everyday Spanish.",
    href: siteConfig.instagram,
    label: siteConfig.instagramHandle,
    external: true,
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
          {
            "@type": "ContactPage",
            "@id": `${absolute("/contact")}#contactpage`,
            url: absolute("/contact"),
            name: "Contact Poncho Spanish",
            description:
              "Get in touch with Anto about online Spanish lessons for children, teens and adults in the UK.",
            inLanguage: siteConfig.language,
            isPartOf: { "@id": `${siteConfig.url}/#website` },
            about: { "@id": `${siteConfig.url}/#organization` },
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
              <li aria-current="page">Contact</li>
            </ol>
          </nav>

          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-600">
              We reply within 24 hours
            </p>
            <h1 className="mt-5 font-serif text-display-lg text-balance gradient-text">
              Talk to Anto
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-charcoal-500/85">
              Every message is read and answered by Anto herself — not a chatbot and not a
              call centre. Tell her the learner&apos;s age, where they are with Spanish and what
              you are hoping for, and she will suggest a sensible starting point.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="container-wide grid gap-5 md:grid-cols-3">
          {channels.map(({ icon: Icon, title, body, href, label, external }) => (
            <AnimatedSection key={title}>
              <div className="flex h-full flex-col rounded-3xl bg-white p-6 shadow-soft ring-1 ring-charcoal-100/40">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-mustard/15 text-mustard-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-5 font-serif text-2xl">{title}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal-500">{body}</p>
                <div className="mt-6">
                  <Button asChild variant="soft" className="w-full">
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {label}
                    </a>
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="rounded-3xl bg-white p-6 shadow-soft-lg ring-1 ring-charcoal-100/40 md:p-10">
              <h2 className="mb-2 font-serif text-display-md uppercase leading-tight">
                Send a message
              </h2>
              <p className="mb-8 text-sm text-charcoal-400">
                Lessons run online across the UK, in English and Spanish. There is no cost
                and no obligation in asking.
              </p>
              <ContactForm />
            </div>
          </AnimatedSection>

          <p className="mt-10 text-center text-sm text-charcoal-400">
            Looking for lesson options and prices first?{" "}
            <Link
              href="/spanish-lessons"
              className="underline underline-offset-4 hover:text-charcoal-600"
            >
              Compare Spanish lessons
            </Link>{" "}
            or browse the{" "}
            <Link
              href="/ondemand"
              className="underline underline-offset-4 hover:text-charcoal-600"
            >
              self-paced Academy
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
