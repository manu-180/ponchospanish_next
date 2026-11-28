import { pageMetadata } from "@/lib/seo/metadata";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "What personal data Poncho Spanish collects, why, who helps us handle it, and how to see or delete yours.",
  path: "/legal/privacy",
});

const CONTACT_EMAIL = "ponchospanish@gmail.com";

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "Who we are",
    body: (
      <p>
        Poncho Spanish is run by Anto, who teaches every lesson. Anto decides
        how your data is used and is the person to contact about it:{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    ),
  },
  {
    title: "What we collect",
    body: (
      <ul>
        <li>
          <strong>When you write to us:</strong> your name, email, and anything
          you tell us in the form (the learner&apos;s age, level, what
          they&apos;re interested in, your message).
        </li>
        <li>
          <strong>When you create an account:</strong> your name, email and,
          if you add one, a profile photo.
        </li>
        <li>
          <strong>While you learn:</strong> the courses you&apos;re enrolled
          in, your progress, bookmarks, notes, certificates, reviews you
          publish, and your settings (subtitle language, playback speed,
          reminders).
        </li>
        <li>
          <strong>When you pay:</strong> what you bought, the amount, and the
          PayPal order reference. We never see or store your card or bank
          details: PayPal handles them.
        </li>
        <li>
          <strong>Emails we send you:</strong> a record of what was sent and
          whether it was delivered.
        </li>
      </ul>
    ),
  },
  {
    title: "Why we use it",
    body: (
      <ul>
        <li>
          To reply to you and arrange lessons (because you asked us to).
        </li>
        <li>
          To give you the lessons, courses and ebooks you paid for, and to
          send the emails that go with them (to fulfil our agreement with you).
        </li>
        <li>
          To keep payment records, as tax law requires.
        </li>
        <li>
          To send study reminders, only if you switch them on. You can switch
          them off at any time in your settings.
        </li>
      </ul>
    ),
  },
  {
    title: "Children",
    body: (
      <p>
        Lessons for children are arranged by a parent or guardian, who gives
        us the child&apos;s details. We only ask for what we need to teach
        well, such as age and level, and never use it for marketing.
      </p>
    ),
  },
  {
    title: "Cookies",
    body: (
      <p>
        We only use the cookies needed to keep you signed in. No advertising
        or tracking cookies.
      </p>
    ),
  },
  {
    title: "Who helps us",
    body: (
      <>
        <p>
          We don&apos;t sell or share your data with anyone for marketing.
          These services handle it on our behalf, only to run Poncho Spanish:
        </p>
        <ul>
          <li>Supabase: accounts and database.</li>
          <li>Vercel: hosts this website.</li>
          <li>PayPal: payments.</li>
          <li>Mux: streams course videos.</li>
          <li>Resend: sends our emails.</li>
          <li>Calendly: booking the free trial lesson.</li>
          <li>Zoom: live lessons.</li>
        </ul>
        <p>
          Some of them store data outside the UK. When they do, they use the
          safeguards UK data protection law requires.
        </p>
      </>
    ),
  },
  {
    title: "How long we keep it",
    body: (
      <p>
        Account and learning data, for as long as your account is open.
        Messages, for as long as we&apos;re in touch. Payment records, for as
        long as tax law requires. When you ask us to delete your account, we
        delete everything else.
      </p>
    ),
  },
  {
    title: "Your rights",
    body: (
      <p>
        You can ask to see, correct, download or delete your data, or object
        to how we use it. Write to{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and Anto will
        reply within one month. If you&apos;re not happy with the answer, you
        can complain to the UK Information Commissioner&apos;s Office at{" "}
        <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">
          ico.org.uk
        </a>
        .
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-narrow">
        <div className="text-center mb-10">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-mustard/15 text-mustard-600 mb-5">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="font-serif text-display-md">Privacy Policy</h1>
          <p className="mt-3 text-sm text-charcoal-400">Updated 28 November 2026</p>
        </div>

        <div className="rounded-3xl bg-cream-50 ring-1 ring-charcoal-100/40 shadow-soft p-6 sm:p-10 space-y-10">
          {sections.map((s) => (
            <div
              key={s.title}
              className="space-y-3 leading-relaxed text-charcoal-500 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-mustard-600 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_strong]:text-charcoal-600"
            >
              <h2 className="font-serif text-2xl text-charcoal-600">{s.title}</h2>
              {s.body}
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-charcoal-400 text-center">
          Questions?{" "}
          <Link
            href="/contact"
            className="underline-offset-4 underline hover:text-mustard-600"
          >
            Send us a message
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
