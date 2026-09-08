import type { FaqItem } from "@/lib/seo/schema";

export interface LessonPage {
  slug: string;
  title: string;
  description: string;
  heading: string;
  audience: string;
  introduction: string;
  image: string;
  imageAlt: string;
  price: number;
  priceNote: string;
  sections: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>;
  preparation: string[];
  faqs: FaqItem[];
  related: string[];
}

export const lessonPages: LessonPage[] = [
  {
    slug: "children",
    title: "Online Spanish Lessons for Children",
    description: "Online Spanish lessons for children aged 7–18 with Anto, a certified native teacher. Choose private or small group classes in the UK. Book a free trial today.",
    heading: "Online Spanish lessons for children",
    audience: "Children & teens · Ages 7–18",
    introduction: "Give your child a place to try Spanish, ask questions and grow in confidence. Poncho Spanish offers live online Spanish lessons for children and teenagers aged 7–18, with a certified native teacher who gets to know the learner. Choose individual attention or learn alongside a small group of friends, from home anywhere in the UK.",
    image: "/images/foto1.jpeg",
    imageAlt: "One-to-one Spanish learning for children with Poncho Spanish",
    price: 35,
    priceNote: "Private lesson · £40 per session for a group of up to four, shared between learners",
    sections: [
      {
        heading: "A starting point that fits your child",
        paragraphs: ["A child trying their first Spanish words has different needs from a teenager who already studies the language at school. Tell Anto about your child's experience, interests and confidence during the free trial so you can discuss a suitable starting point together.", "Lessons are personalised to the learner's age and stage. Your goal might be an enjoyable introduction to a new language, more confidence speaking aloud, or support alongside school Spanish. Children do not need to be preparing for an exam to take part."],
      },
      {
        heading: "Private tuition or a small group?",
        paragraphs: ["One-to-one lessons cost £35 per session and give your child individual attention. This can be a useful choice when they want time to ask questions, revisit something from school or build confidence at their own pace.", "If your child would enjoy learning with friends, you can start your own group of up to four learners for £40 per session in total. Share the learners' ages and previous Spanish experience with Anto before arranging the group, so you can discuss whether learning together makes sense."],
      },
      {
        heading: "Make Spanish part of an ordinary week",
        paragraphs: ["Live sessions last 50 minutes and take place on Zoom during term time. Discuss available times before choosing an after-school slot or fitting lessons into your home education routine.", "Between lessons, keep practice manageable. Invite your child to teach you a word they remember, name a favourite colour in Spanish or say one sentence about their day. These are simple ideas to try together; you do not need to speak Spanish yourself or turn practice into another test."],
      },
    ],
    preparation: ["Your child's age and any Spanish they have already learnt.", "What they enjoy and what currently feels difficult.", "Whether you prefer one-to-one lessons or have a group of friends in mind.", "Your availability and a device with working Zoom audio and video."],
    faqs: [
      { question: "Can a complete beginner join?", answer: "Yes. Lessons are tailored to each learner's age and stage, including children who are new to Spanish. The free trial is an opportunity to meet Anto and discuss a comfortable starting point before arranging regular sessions." },
      { question: "Do you teach teenagers as well as younger children?", answer: "Yes, children's and teens' lessons cover ages 7–18. General private tuition is £35 per session. If the main goal is GCSE or IGCSE preparation, the dedicated exam support option is £50 per session." },
      { question: "How many children can learn together?", answer: "You can arrange a small group with up to four learners. General group lessons cost £40 per 50-minute session in total, shared between participants. Discuss the group's ages, experience and availability with Anto before booking regular lessons." },
    ],
    related: ["home-education", "gcse"],
  },
  {
    slug: "gcse",
    title: "Online GCSE & IGCSE Spanish Tuition",
    description: "GCSE and IGCSE Spanish tuition online with Anto. Build confidence with focused one-to-one or small group support. £50 per session. Book your free trial today.",
    heading: "GCSE & IGCSE Spanish tuition online",
    audience: "Teens · Exam support",
    introduction: "When Spanish exam preparation feels overwhelming, a clear starting point helps. Poncho Spanish offers online GCSE and IGCSE Spanish tuition with Anto, a certified native teacher. Focused support is available one-to-one or in a small group of up to four learners, with space to work on grammar, speaking and the areas that need attention.",
    image: "/images/foto3.jpeg",
    imageAlt: "Spanish learning materials for GCSE and IGCSE exam preparation",
    price: 50,
    priceNote: "Exam support · One-to-one or shared between participants in a group of up to four",
    sections: [
      {
        heading: "Start with the learner, then the exam",
        paragraphs: ["Some students understand written Spanish but hesitate when speaking. Others know vocabulary but find it difficult to build a sentence with the right tense. Describe what feels hardest and bring any useful school feedback to the trial, so the conversation can focus on a specific need.", "The aim is to make preparation feel more manageable and help the learner approach Spanish with greater confidence. No tutor can promise a particular grade: progress depends on the starting point, available preparation time and practice as well as the lessons themselves."],
      },
      {
        heading: "GCSE and IGCSE: check your exact qualification",
        paragraphs: ["Bring the exam board, qualification name, specification code and exam year. These details matter when choosing revision material: GCSE and International GCSE are separate qualifications, and a resource labelled simply 'GCSE Spanish' may not match the course your child is taking.", "For example, AQA's current GCSE Spanish specification is 8692, and Pearson publishes a separate Edexcel GCSE Spanish qualification introduced for first teaching in 2024. Use the official specification for your child's board to check the required content and assessment resources. Discuss the exact qualification with Anto before arranging support."],
      },
      {
        heading: "Turn a revision problem into something you can practise",
        paragraphs: ["Instead of planning to 'revise all Spanish', identify one task that keeps causing difficulty. For example, try answering a familiar question aloud, then check whether the verb tense and word order say what you intended. Note the point you could not resolve and bring it to the lesson.", "Keep a short list of recurring questions rather than collecting more resources than you can use. A marked school exercise, a difficult sentence or feedback from a speaking task can give a clearer starting point than a broad request to cover everything."],
      },
    ],
    preparation: ["Exam board, qualification code, exam year and tier where applicable.", "Recent teacher feedback or a task the learner found difficult.", "The areas that need attention and any upcoming school deadlines.", "Whether you want individual support or a group of up to four learners."],
    faqs: [
      { question: "How much does GCSE Spanish tuition cost?", answer: "GCSE and IGCSE support costs £50 per 50-minute online session. Choose one-to-one tuition or a group of up to four learners; the session fee is shared between participants in a group. Fees are paid monthly via PayPal." },
      { question: "Can home-educated learners ask about exam support?", answer: "Yes. Home-educating families can discuss GCSE or IGCSE support with Anto. Bring the intended qualification and exam year to the trial. Before making an exam plan, check entry arrangements directly with the exam board or your chosen examination centre." },
      { question: "Does my child need to know their exam board?", answer: "It helps to have the board and specification code before planning exam preparation. Ask the school or examination centre if you are unsure. Share these details with Anto so you can discuss the learner's course and whether the support fits their needs." },
    ],
    related: ["children", "home-education"],
  },
  {
    slug: "home-education",
    title: "Home Education Spanish Lessons Online",
    description: "Home education Spanish lessons for ages 7–18 across the UK. Learn online with Anto, one-to-one or with up to four friends. Discuss your goals in a free trial.",
    heading: "Spanish lessons for home education",
    audience: "Home-educating families · Ages 7–18",
    introduction: "Make Spanish part of a home education routine that works for your family. Poncho Spanish offers online lessons for home-educated children and teenagers aged 7–18, taught by Anto, a certified native Spanish teacher. You can choose individual lessons or organise a small group, whether your child is exploring a new language or building towards a more specific goal.",
    image: "/images/foto2.jpeg",
    imageAlt: "Learning Spanish together in a small group",
    price: 35,
    priceNote: "Private lesson · £40 per session for your own group of up to four, shared between learners",
    sections: [
      {
        heading: "Choose what Spanish is for in your family",
        paragraphs: ["A useful first question is what you want Spanish to add to your child's learning. It might be curiosity about another culture, confidence talking to relatives, a regular shared activity or preparation for later study. You do not need to choose an exam pathway just to start learning.", "Talk about your child's interests and previous experience during the trial. A learner who understands some Spanish at home may need a different starting point from someone meeting the language for the first time, even if they are the same age."],
      },
      {
        heading: "Individual attention or learning with friends",
        paragraphs: ["Private lessons are £35 per 50-minute session. One-to-one time gives your child room to ask questions and work at their own pace with the same teacher.", "For a shared activity, you can form your own group of up to four learners at £40 per session in total. Before arranging a group, compare the children's ages, current Spanish and reasons for learning, then discuss these with Anto. A group is most useful when the learners' needs can work together."],
      },
      {
        heading: "Build a routine around your wider learning",
        paragraphs: ["Sessions take place live on Zoom during term time. Share your family's timetable and ask about current availability; agree a suitable time before planning regular lessons.", "For practice at home, choose a small task connected to something your child already enjoys. A learner interested in animals could label a drawing in Spanish; an older child could write a few sentences about a favourite activity. These are optional practice ideas to adapt to your family, rather than a separate curriculum you need to follow."],
      },
      {
        heading: "When an exam becomes part of the plan",
        paragraphs: ["If your teenager is considering a qualification, start by identifying the exact GCSE or IGCSE course and intended exam year. Poncho Spanish offers a separate exam support option at £50 per session. Discuss the qualification with Anto and check exam entry arrangements directly with the board or your chosen examination centre."],
      },
    ],
    preparation: ["Your child's age, interests and previous experience of Spanish.", "What you want lessons to add to your home education routine.", "Your timetable and whether you are organising a group.", "Any qualification you are considering, including the board and exam year."],
    faqs: [
      { question: "Do parents need to speak Spanish?", answer: "No. Anto teaches the live lessons, so you do not need to teach the language yourself. You can help by sharing your child's interests, setting up Zoom and making room for any practice you agree is useful." },
      { question: "Can we create a group with other home-educating families?", answer: "Yes. You can start your own group of up to four learners. General Spanish group sessions cost £40 in total, shared between participants. Discuss the learners' ages, Spanish experience and shared availability with Anto before arranging a regular slot." },
      { question: "Can we learn Spanish without preparing for an exam?", answer: "Yes. General lessons can be part of your child's wider home education, without an exam goal. If you later want to discuss GCSE or IGCSE preparation, there is a separate exam support option at £50 per session." },
    ],
    related: ["children", "gcse"],
  },
  {
    slug: "adults",
    title: "Private Online Spanish Lessons for Adults",
    description: "Private online Spanish lessons for adults with Anto, a certified native teacher. Learn at your pace in relaxed 50-minute sessions for £35. Book a free trial.",
    heading: "Private online Spanish lessons for adults",
    audience: "Adults · One-to-one",
    introduction: "Learn Spanish for the conversations you want to have. Poncho Spanish offers private online Spanish lessons for adults with Anto, a certified native teacher from Buenos Aires. Your lessons are built around your goals, with individual attention and a relaxed approach, whether you are starting out or returning to a language you learnt years ago.",
    image: "/images/adulta-clases-online.jpg",
    imageAlt: "Adult learner taking an online Spanish lesson from home",
    price: 35,
    priceNote: "Private one-to-one lesson · Built around your goals",
    sections: [
      {
        heading: "Bring a reason to learn, not a perfect starting level",
        paragraphs: ["You might want to feel more comfortable on holiday, speak with Spanish-speaking friends or family, or finally return to a subject you enjoyed at school. Explain what you would like to do in Spanish during the free trial. A real situation gives you and Anto a useful starting point.", "It is also worth saying what you find difficult: remembering words, understanding speech or feeling comfortable making mistakes. One-to-one lessons leave space to ask questions and revisit something without having to keep pace with a larger class."],
      },
      {
        heading: "What private lessons involve",
        paragraphs: ["Adult lessons are live, individual sessions on Zoom with Anto. Each regular session lasts 50 minutes and costs £35. Lessons take place during term time, with fees paid monthly via PayPal in GBP or the equivalent in your local currency.", "Share your availability before choosing a regular time. If you are learning towards a particular trip or event, mention the date and what you hope to feel more comfortable doing, so you can discuss realistic priorities for the time available."],
      },
      {
        heading: "Try a small speaking task between lessons",
        paragraphs: ["Choose one situation you care about and write down three things you would like to say. For a trip, that might be introducing yourself, asking for something or explaining a preference. Try saying the sentences aloud, then note the words or grammar you could not work out.", "Bring those questions to your next lesson. Keeping practice connected to your own life makes it easier to decide what to work on next. You can also explore the Academy's self-paced Spanish courses and ebooks when you want materials to use independently."],
      },
    ],
    preparation: ["Why you want to learn Spanish and any previous experience.", "A conversation or situation you would like to handle more comfortably.", "Any date you are working towards, such as a trip.", "Your availability and a device with working Zoom audio and video."],
    faqs: [
      { question: "Are adult Spanish lessons one-to-one?", answer: "Yes. The adult option is private one-to-one tuition with Anto, built around your goals. Regular sessions are 50 minutes long, take place on Zoom during term time and cost £35 each. Start with a free trial to discuss what you need." },
      { question: "Can I start if I have never learnt Spanish?", answer: "You can discuss beginner lessons with Anto in the free trial. Explain any previous contact with Spanish and what you would like to do with the language. You do not need to arrive with a prepared vocabulary list or a particular level." },
      { question: "What is the difference between live lessons and the Academy?", answer: "Live lessons give you individual time with Anto at an agreed time. The Academy contains self-paced courses and downloadable resources for independent study. Check each resource's description and level to choose material that fits what you want to practise." },
    ],
    related: ["children", "home-education"],
  },
];

export function getLessonPage(slug: string) {
  return lessonPages.find((page) => page.slug === slug);
}
