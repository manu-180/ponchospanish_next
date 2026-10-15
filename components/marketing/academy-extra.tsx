import Link from "next/link";
import { ArrowUpRight, BookOpen, PlayCircle } from "lucide-react";
import { AnimatedSection } from "@/components/shared/animated-section";

const inclusions = [
  {
    icon: PlayCircle,
    title: "On-demand online courses",
    body: "Explore Spanish at your own pace, whenever it suits you.",
  },
  {
    icon: BookOpen,
    title: "E-books & learning resources",
    body: "Instant downloads to support your progress beyond the live sessions.",
  },
];

export function AcademyExtra() {
  return (
    <AnimatedSection as="div" delay={0.1} className="mx-auto mt-16 max-w-6xl md:mt-20">
      <div className="relative overflow-hidden rounded-3xl bg-charcoal-600 px-7 py-10 text-cream-100 shadow-soft-lg md:px-14 md:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_120%_at_0%_0%,rgb(255_255_255/0.09),transparent_60%)]"
        />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mustard">
              A little extra
            </p>
            <h3 className="mt-3 font-serif text-display-md uppercase leading-tight text-cream-50">
              The Poncho Academy
            </h3>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-cream-200/85 md:text-lg">
              Your learning doesn&rsquo;t have to stop when the lesson ends.
              When you join Poncho Spanish for live lessons, you also receive
              complimentary access to the Poncho Academy, an online learning
              space to practise, explore and keep your curiosity alive between
              lessons.
            </p>
          </div>

          <div className="space-y-4">
            {inclusions.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="flex gap-4 rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mustard text-charcoal-700">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-cream-50">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-cream-200/75">
                    {body}
                  </p>
                </div>
              </div>
            ))}
            <Link
              href="/ondemand"
              className="inline-flex min-h-11 items-center gap-2 pt-2 text-sm font-semibold uppercase tracking-wider text-mustard underline-offset-4 hover:underline"
            >
              Explore the Academy
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
