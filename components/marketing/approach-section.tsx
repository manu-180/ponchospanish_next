import { AnimatedSection } from "@/components/shared/animated-section";

const pillars = [
  "Exclusive",
  "Personalised",
  "Human-centred",
  "Holistic",
  "Nordic-inspired",
];

export function ApproachSection() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="container-wide">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <AnimatedSection
            as="div"
            className="lg:sticky lg:top-32 lg:self-start"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-charcoal-400">
              How lessons feel
            </p>
            <h2 className="mt-4 font-serif text-display-lg uppercase leading-[0.95] text-balance gradient-text">
              The Poncho approach
            </h2>
            <div className="mt-6 h-[2px] w-12 bg-mustard" />
          </AnimatedSection>

          <AnimatedSection as="div" delay={0.1}>
            <ol className="divide-y divide-charcoal-100/70 border-y border-charcoal-100/70">
              {pillars.map((title, i) => (
                <li
                  key={title}
                  className="grid grid-cols-[3rem_1fr] items-baseline gap-x-4 py-7 md:grid-cols-[4rem_1fr] md:gap-x-6"
                >
                  <span
                    aria-hidden="true"
                    className="font-serif text-lg italic text-mustard-600"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif text-2xl uppercase leading-tight text-charcoal-600 md:text-3xl">
                    {title}
                  </h3>
                </li>
              ))}
            </ol>
          </AnimatedSection>
        </div>

        <AnimatedSection
          as="div"
          className="mx-auto mt-24 max-w-4xl text-center md:mt-32"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta-500">
            More than a language
          </p>
          <p className="mt-6 font-serif text-3xl leading-snug text-charcoal-600 text-balance md:text-[2.75rem] md:leading-[1.15]">
            The vision behind Poncho Spanish is to empower{" "}
            <em className="text-mustard-600">compassionate, confident</em> and{" "}
            <em className="text-mustard-600">globally minded</em> individuals.
          </p>
          <div className="mx-auto mt-10 grid max-w-3xl gap-6 text-left text-base leading-relaxed text-charcoal-500/85 md:grid-cols-2 md:gap-10">
            <p>
              To create an environment where every student feels valued,
              appropriately challenged and prepared to take their next step.
            </p>
            <p>
              To make Spanish meaningful through genuine connections with the
              world around us.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
