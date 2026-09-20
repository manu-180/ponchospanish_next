import type { FaqItem } from "@/lib/seo/schema";

export interface GuidePage {
  slug: string;
  title: string;
  description: string;
  heading: string;
  kicker: string;
  /** ISO date. Drives `dateModified` in Article schema and the visible byline. */
  updated: string;
  readingMinutes: number;
  image: string;
  imageAlt: string;
  introduction: string;
  keyFacts?: Array<{ label: string; value: string }>;
  sections: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>;
  faqs: FaqItem[];
  cta: { heading: string; body: string; href: string; label: string };
  relatedLessons: string[];
  relatedGuides: string[];
}

export const guidePages: GuidePage[] = [
  {
    slug: "new-gcse-spanish-2026",
    title: "The New GCSE Spanish (First Exams 2026): A Parent's Guide",
    description:
      "What changed in the new GCSE Spanish specification, how the four papers are assessed, what the dictation and reading aloud tasks involve, and how to support your teenager at home.",
    heading: "The new GCSE Spanish, explained for parents",
    kicker: "GCSE & IGCSE · Exam guide",
    updated: "2026-09-20",
    readingMinutes: 8,
    image: "/images/foto2.jpeg",
    imageAlt: "A teenager preparing for a GCSE Spanish exam at home",
    introduction:
      "Teenagers sitting Spanish in summer 2026 are the first group to take the new GCSE specification, taught from September 2024. If your child mentions a dictation task or reading aloud and you do not remember either from your own school years, you are right: they are new. Here is what the qualification now looks like, described in plain English, so you can follow what your child is being asked to do. The details below follow AQA's specification (8692).",
    keyFacts: [
      { label: "First exams", value: "Summer 2026" },
      { label: "Papers", value: "Listening, Speaking, Reading, Writing" },
      { label: "Weighting", value: "25% each" },
      { label: "Tiers", value: "Foundation or Higher, same tier for all four" },
    ],
    sections: [
      {
        heading: "Four papers, equally weighted",
        paragraphs: [
          "The qualification is assessed across four papers and each one is worth 25% of the final grade. That balance matters more than it sounds. A teenager who reads well but avoids speaking cannot make up the difference elsewhere, because no single skill can carry the grade.",
          "Students are entered at either Foundation or Higher tier, and they must sit the same tier for all four papers. Foundation covers grades 1 to 5 and Higher covers grades 4 to 9. Schools usually decide the tier in Year 11, and it is a reasonable thing to ask a subject teacher about at parents' evening.",
        ],
        bullets: [
          "Listening: 35 minutes at Foundation, 45 at Higher",
          "Speaking: 7 to 9 minutes at Foundation, 10 to 12 at Higher, plus 15 minutes of supervised preparation",
          "Reading: 45 minutes at Foundation, 1 hour at Higher",
          "Writing: 1 hour 10 at Foundation, 1 hour 15 at Higher",
        ],
      },
      {
        heading: "The dictation task is genuinely new",
        paragraphs: [
          "The listening paper now ends with a dictation section: students hear short spoken extracts and write down exactly what they hear, in Spanish. Each sentence is repeated, with pauses to write. Foundation students transcribe a minimum of 20 words and Higher students a minimum of 30.",
          "This rewards something that used to be invisible in revision, which is knowing how Spanish sounds map onto Spanish spelling. A student can understand a sentence perfectly and still lose marks because they are unsure whether they heard a b or a v, whether a word carries an accent, or where one word ends and the next begins.",
          "A small number of words from outside the prescribed vocabulary list are included on purpose. Students are not expected to know them. They are expected to write down the sounds sensibly and keep going rather than freeze.",
        ],
      },
      {
        heading: "Speaking has three parts, and one of them is reading aloud",
        paragraphs: [
          "The speaking exam is made up of a role-play, a reading aloud task and a photo card discussion. In the role-play the instructions are given in English, so the challenge is producing Spanish rather than decoding the prompt.",
          "Reading aloud is the part that surprises families most. The student reads a short prepared text out loud, then answers four compulsory questions linked to it. Pronunciation is assessed directly, which is unusual in UK exams and difficult to revise from a textbook alone.",
          "In the photo card section the student describes two photographs and then moves into an unprepared conversation. The unprepared part is where confidence shows. A student who speaks regularly will keep going through a wobble. A student who has only ever written Spanish tends to stop.",
        ],
      },
      {
        heading: "Reading and writing both include translation",
        paragraphs: [
          "The reading paper ends with translation from Spanish into English, a minimum of 35 words at Foundation and 50 at Higher. The writing paper includes translation in the other direction, alongside structured tasks and extended writing.",
          "Translation is unforgiving in a useful way. It shows exactly which grammar a student has actually absorbed, because there is nowhere to hide an uncertain verb ending behind a well-rehearsed phrase.",
        ],
      },
      {
        heading: "What this means for revision at home",
        paragraphs: [
          "The shape of the exam favours regular contact with spoken Spanish over last-minute vocabulary cramming. Three short sessions a week are worth more than one long one the night before a mock.",
          "None of this requires you to speak Spanish yourself. What helps is protecting the time, keeping the tone low-pressure, and noticing the specific thing your child finds hard, which is usually much narrower than the whole subject.",
        ],
        bullets: [
          "Ask them to read a short Spanish text aloud to you. You do not need to understand it to hear hesitation.",
          "Play a Spanish clip and have them write down one sentence they hear, then check the spelling together.",
          "Ask them to describe a photo on their phone in Spanish for thirty seconds without stopping.",
          "Translate a few sentences in both directions, because each one exposes different gaps.",
        ],
      },
      {
        heading: "When outside support is worth it",
        paragraphs: [
          "A tutor is not automatically the answer. It tends to help when the gap is specific and speaking-related: a student who understands the material but dries up out loud, one who is anxious about reading aloud, or one who has just moved tier and needs to catch up on grammar quickly.",
          "If that sounds familiar, focused GCSE and IGCSE Spanish sessions with Anto run one-to-one or in a small group of up to four, at £50 per 50-minute session. A free trial is a sensible way to find out whether it fits before committing to anything.",
        ],
      },
    ],
    faqs: [
      {
        question: "When are the first exams for the new GCSE Spanish specification?",
        answer:
          "Summer 2026. The new specification was taught from September 2024, so students sitting Spanish in May and June 2026 are the first cohort assessed under it.",
      },
      {
        question: "What is the dictation task in GCSE Spanish?",
        answer:
          "It is a section of the listening paper where students write down exactly what they hear in Spanish. Sentences are repeated with pauses for writing. Foundation tier transcribes a minimum of 20 words and Higher tier a minimum of 30, and a small number of words from outside the prescribed vocabulary list are included deliberately.",
      },
      {
        question: "How long is the GCSE Spanish speaking exam?",
        answer:
          "Between 7 and 9 minutes at Foundation tier and between 10 and 12 minutes at Higher tier, with 15 minutes of supervised preparation beforehand. It contains a role-play, a reading aloud task with four follow-up questions, and a photo card discussion that moves into unprepared conversation.",
      },
      {
        question: "Can my child sit different tiers for different papers?",
        answer:
          "No. Students are entered at either Foundation or Higher tier and must sit that same tier across all four papers. Foundation covers grades 1 to 5 and Higher covers grades 4 to 9.",
      },
      {
        question: "Does any of this apply to IGCSE Spanish?",
        answer:
          "Not directly. IGCSE is a separate qualification with its own specification, and it is what many British and international schools outside the UK teach, including in Spain. The changes in this guide describe the new GCSE. If your child is taking IGCSE, check the exam board and specification with the school.",
      },
      {
        question: "Do you teach IGCSE Spanish as well as GCSE?",
        answer:
          "Yes. Exam support sessions cover both GCSE and IGCSE Spanish, one-to-one or in a small group of up to four learners, at £50 per 50-minute session. Discuss your child's exam board and current tier in the free trial.",
      },
    ],
    cta: {
      heading: "Worried about the speaking paper?",
      body: "Focused GCSE and IGCSE Spanish sessions with Anto, a certified native teacher. Start with a free trial and talk through where your teenager actually needs help.",
      href: "/spanish-lessons/gcse",
      label: "See GCSE Spanish tuition",
    },
    relatedLessons: ["gcse", "children"],
    relatedGuides: ["help-your-child-learn-spanish-at-home"],
  },
  {
    slug: "help-your-child-learn-spanish-at-home",
    title: "How to Help Your Child Learn Spanish at Home (Without Speaking It)",
    description:
      "Practical ways UK parents can support a child learning Spanish at home, even with no Spanish of their own. What actually helps, what to avoid, and how much time it really takes.",
    heading: "Helping your child with Spanish when you do not speak it",
    kicker: "For parents · Ages 7 to 18",
    updated: "2026-09-20",
    readingMinutes: 7,
    image: "/images/foto1.jpeg",
    imageAlt: "A child practising Spanish at home with a parent nearby",
    introduction:
      "Spanish is the language most UK parents say they would encourage their child to learn, and a foreign language has been part of the primary curriculum in England since 2014. The awkward part comes later, when a child brings home something you cannot help with. You do not need Spanish to be useful here. What follows is what tends to work in families where the parent speaks none at all.",
    sections: [
      {
        heading: "Your job is not to teach",
        paragraphs: [
          "A parent who tries to teach a language they do not speak usually ends up correcting pronunciation they are unsure of, which quietly teaches the child that speaking is risky. That is the opposite of what a beginner needs.",
          "The useful roles are different ones: audience, timekeeper, and someone who notices. A child explaining something to you is doing real language work, and they can do it while you understand almost none of it.",
        ],
      },
      {
        heading: "Ask them to teach you one thing",
        paragraphs: [
          "Once or twice a week, ask your child to teach you a single word or phrase from their lesson, then actually use it that evening. Say buenos días at breakfast. Ask ¿cómo estás? in the car.",
          "It works because retrieving something in order to teach it is harder, and more durable, than rereading it. It also flips the usual dynamic. For a child who feels behind at school, being the one who knows is not a small thing.",
        ],
      },
      {
        heading: "Make the input ordinary",
        paragraphs: [
          "Language sticks through repeated contact rather than intensity. A programme your child already knows well, watched in Spanish, is far more useful than an unfamiliar one, because they can follow the story and let the words attach to it.",
          "Ten minutes most days beats an hour on Sunday. The aim is for Spanish to stop feeling like an event.",
        ],
        bullets: [
          "Switch a familiar film or series to Spanish audio with English subtitles, then later Spanish subtitles.",
          "Put Spanish music on in the kitchen. Nobody has to understand it.",
          "Label four or five things around the house and leave them up.",
          "Look for dual-language picture books for younger children.",
        ],
      },
      {
        heading: "Protect the time, not the mood",
        paragraphs: [
          "Most home practice fails on scheduling rather than motivation. Pick a slot that already exists, such as after dinner, the school run or Saturday morning, and keep it short enough that nobody dreads it.",
          "If a session goes badly, end it early and without comment. Ten minutes that finish on a decent note are worth more than forty that end in a row, because tomorrow's willingness is the thing you are actually protecting.",
        ],
      },
      {
        heading: "What to do when they get stuck",
        paragraphs: [
          "When a child says they are rubbish at Spanish, they usually mean something specific: they cannot remember verb endings, they hate speaking in front of the class, or they missed a fortnight and never caught up. Asking what the hardest bit is tends to produce a much narrower answer than the complaint suggested.",
          "That narrower answer is what a lesson can be built around. It is worth passing on to a teacher or tutor directly, because otherwise the first few sessions get spent finding it out.",
        ],
      },
      {
        heading: "Signs it is worth getting help",
        paragraphs: [
          "Lessons outside school are not a default. They make sense when the same gap keeps reappearing, when confidence rather than ability is the blocker, or when an exam is close enough that time matters.",
          "Poncho Spanish runs live online lessons for children and teens aged 7 to 18, one-to-one at £35 or in a small group of up to four friends at £40 per session. Every family starts with a free trial, which is mostly a conversation about where your child actually is.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I help my child with Spanish if I do not speak any?",
        answer:
          "Yes. The most effective things a non-speaking parent can do are asking the child to teach them one word or phrase regularly, keeping a short practice slot in the week, and providing everyday exposure such as familiar programmes in Spanish. None of it requires you to speak the language or correct pronunciation.",
      },
      {
        question: "How much Spanish practice should a child do at home?",
        answer:
          "Short and frequent beats long and occasional. Ten to fifteen minutes on most days gives better results than a single long session at the weekend, because retention depends on repeated contact rather than intensity.",
      },
      {
        question: "What age should a child start learning Spanish?",
        answer:
          "A modern foreign language has been a statutory part of the national curriculum at Key Stage 2 in England since 2014, so most children meet one from age seven. Children can start earlier or later. What matters more is regular contact and a low-pressure start. Poncho Spanish teaches learners aged 7 to 18.",
      },
      {
        question: "Are group or one-to-one lessons better for a child?",
        answer:
          "It depends on the learner. One-to-one lessons at £35 per session suit a child who needs individual attention or feels self-conscious speaking. A small group of up to four at £40 per session suits a child who is more relaxed learning alongside friends. You can discuss which fits in the free trial.",
      },
    ],
    cta: {
      heading: "Not sure where your child is with Spanish?",
      body: "That is exactly what the free trial is for. Anto meets your child, has a proper conversation and suggests a sensible starting point. No payment details needed.",
      href: "/spanish-lessons/children",
      label: "See lessons for children",
    },
    relatedLessons: ["children", "home-education"],
    relatedGuides: ["spanish-for-home-education-uk"],
  },
  {
    slug: "spanish-for-home-education-uk",
    title: "Spanish for Home Education in the UK: A Practical Guide",
    description:
      "How to fit Spanish into a home education routine in the UK, what families need to know about languages and qualifications, and how to choose between apps, small groups and a teacher.",
    heading: "Fitting Spanish into home education",
    kicker: "Home education · Ages 7 to 18",
    updated: "2026-09-20",
    readingMinutes: 7,
    image: "/images/foto3.jpeg",
    imageAlt: "A home-educated child taking an online Spanish lesson",
    introduction:
      "Languages are one of the subjects home-educating families most often put off, usually for a practical reason rather than a philosophical one: it is hard to teach a language you do not speak, and harder to assess. Here is how families in the UK tend to make Spanish work, and the decisions worth making early.",
    sections: [
      {
        heading: "You are not obliged to follow the national curriculum",
        paragraphs: [
          "Home-educating families in England are not required to follow the national curriculum or to teach a modern foreign language at any particular stage. That freedom is genuinely useful with languages, because you can start when a child is interested rather than when a timetable says so.",
          "It also removes an artificial deadline. A child who begins Spanish at eleven because they want to will usually move faster than one who began at seven because they had to.",
        ],
      },
      {
        heading: "Decide early whether an exam is the goal",
        paragraphs: [
          "The decision that shapes everything else is whether you are heading towards a qualification. If GCSE or IGCSE is the destination, the structure works backwards from the specification, and speaking practice needs to start much earlier than most families expect.",
          "If it is not, you are free to build around what the child actually wants to do with Spanish. Both are legitimate. What causes trouble is leaving the question open until Year 10 and then compressing three years of speaking practice into one.",
        ],
        bullets: [
          "Exam route: check which board and tier you are aiming for, and find an exam centre that accepts private candidates early, because places are limited.",
          "Non-exam route: set your own milestones, such as holding a five-minute conversation or reading a short book.",
        ],
      },
      {
        heading: "Apps are a supplement, not a spine",
        paragraphs: [
          "Apps are good at vocabulary and streaks, and poor at the thing that matters most, which is producing unrehearsed speech in front of another person and being understood. A child can hold a long streak and still be unable to answer an unexpected question.",
          "A reasonable split is an app or workbook for daily contact, plus a live lesson for speaking and correction. The live element is the part that is hard to substitute at home.",
        ],
      },
      {
        heading: "Small groups solve the social problem",
        paragraphs: [
          "Home-educated learners often have less incidental practice speaking to people outside the family, which is precisely what a language needs. A small group of up to four gives that without the pace of a class of thirty.",
          "Families often form a group with friends already in their home education circle, which has an underrated advantage: the children trust each other enough to be wrong out loud.",
        ],
      },
      {
        heading: "Keeping a record without turning it into school",
        paragraphs: [
          "If your local authority makes an informal enquiry, a short description of your approach along with some examples of work is usually enough. Language progress is easy to show if you capture it occasionally.",
          "A thirty-second voice note every few weeks is the simplest evidence there is, and it doubles as something the child can hear improving.",
        ],
        bullets: [
          "Keep a few dated voice notes of your child speaking.",
          "Save a couple of pieces of written work each term.",
          "Note what you are using, whether that is a course, a tutor or a workbook.",
        ],
      },
      {
        heading: "How lessons fit a home education week",
        paragraphs: [
          "Live sessions run for 50 minutes on Zoom during term time, and daytime slots are available rather than only after school, which is usually the practical advantage for home-educating families.",
          "Home education Spanish with Anto costs £35 per session one-to-one, or £40 per session for a group of up to four learners shared between families. Start with a free trial and talk through your routine, your child's stage, and whether you are working towards an exam.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do home-educated children have to learn a foreign language in the UK?",
        answer:
          "No. Home-educating families in England are not required to follow the national curriculum, so there is no obligation to teach a modern foreign language at a particular stage. Many families choose Spanish because it is widely spoken and straightforward to start.",
      },
      {
        question: "Can a home-educated child sit GCSE Spanish?",
        answer:
          "Yes, as a private candidate. The practical constraint is finding an exam centre that accepts private candidates, particularly for the speaking paper, so it is worth arranging well in advance rather than in the exam year itself.",
      },
      {
        question: "Can we have Spanish lessons during the school day?",
        answer:
          "Yes. Daytime slots are available during term time, which suits home education routines better than after-school times. Discuss your availability with Anto in the free trial before settling on a regular slot.",
      },
      {
        question: "Can my child learn with other home-educated children?",
        answer:
          "Yes. You can form a small group of up to four learners, which costs £40 per 50-minute session in total, shared between families. Share the children's ages and Spanish experience beforehand so you can discuss whether learning together makes sense.",
      },
    ],
    cta: {
      heading: "Planning Spanish for the year ahead?",
      body: "Talk it through with Anto in a free trial: your routine, your child's stage, and whether an exam is on the horizon.",
      href: "/spanish-lessons/home-education",
      label: "See home education lessons",
    },
    relatedLessons: ["home-education", "children"],
    relatedGuides: ["new-gcse-spanish-2026"],
  },
];

export function getGuidePage(slug: string) {
  return guidePages.find((page) => page.slug === slug);
}
