import type { FaqItem } from "@/lib/seo/schema";

/**
 * Homepage FAQ — written as self-contained, ~40-60 word answers so they're easy
 * for search snippets and AI answer engines to extract, while naturally
 * covering the priority keywords (pricing, GCSE/IGCSE, ages, online,
 * homeschooling, after-school). Rendered visibly AND as FAQPage structured data
 * from the same source, so the two never drift apart.
 */
export const homeFaqs: FaqItem[] = [
  {
    question: "How much do online Spanish lessons cost?",
    answer:
      "Private one-to-one lessons are £35 per 50-minute session, small group lessons are £40, and GCSE or IGCSE exam support is £50 (shared between participants in a group). Every new student starts with a free trial lesson, and fees are paid monthly via PayPal.",
  },
  {
    question: "Do you offer GCSE and IGCSE Spanish support?",
    answer:
      "Yes. Poncho Spanish provides focused GCSE and IGCSE Spanish exam support, available one-to-one or in a small group of up to four learners. Lessons are built to strengthen grammar and speaking, boost confidence and calm exam nerves so teenagers feel genuinely prepared.",
  },
  {
    question: "What ages do you teach?",
    answer:
      "Poncho Spanish specialises in children and teenagers aged 7 to 18. Lessons are tailored to each learner's age and stage, and adults who'd like a relaxed, stress-free way to learn Spanish can arrange sessions on request.",
  },
  {
    question: "Are the Spanish lessons online?",
    answer:
      "Yes, all live lessons take place online over Zoom during term time, so children and teens anywhere in the UK can learn from home. The self-paced Academy courses are also fully online, with instant access on mobile, tablet or desktop.",
  },
  {
    question: "Is Poncho Spanish suitable for homeschooling and after-school learning?",
    answer:
      "Absolutely. The lessons are popular with home-educating families and as an after-school or extra-curricular activity. The relaxed, confidence-first approach fits naturally around home education timetables and busy school weeks.",
  },
  {
    question: "Who teaches the lessons?",
    answer:
      "Lessons are taught by Anto, a certified ELE (Spanish as a Foreign Language) teacher and native speaker from Buenos Aires with nearly 20 years of experience teaching children and teens. She founded Poncho Spanish in 2020.",
  },
  {
    question: "Do I have to commit to a subscription?",
    answer:
      "No. Live lessons are booked during term time and paid monthly via PayPal — cancel whenever you need to. The on-demand Academy courses are pay-once with lifetime access, so there's no subscription to manage.",
  },
];
