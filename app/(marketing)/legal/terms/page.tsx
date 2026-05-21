import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Poncho Spanish — terms of service for online lessons and Academy.",
};

export default function TermsPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-narrow">
        <div className="text-center mb-10">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-mustard/15 text-mustard-600 mb-5">
            <FileText className="h-6 w-6" />
          </div>
          <h1 className="font-serif text-display-md">
            Terms &amp; Conditions
          </h1>
          <p className="mt-3 text-charcoal-400 max-w-xl mx-auto">
            The full policy lives in our official PDF. Open it inline, download
            it, or print it — whatever suits you.
          </p>
        </div>

        <div className="rounded-3xl bg-cream-50 ring-1 ring-charcoal-100/40 shadow-soft overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-6 border-b border-charcoal-100/40">
            <div>
              <p className="font-semibold">terms_and_conditions.pdf</p>
              <p className="text-xs text-charcoal-400">Updated 2025</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="soft">
                <a href="/pdf/terms_and_conditions.pdf" download>
                  Download
                </a>
              </Button>
              <Button asChild>
                <a
                  href="/pdf/terms_and_conditions.pdf"
                  target="_blank"
                  rel="noopener"
                >
                  Open in new tab <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          <div className="relative aspect-[1/1] sm:aspect-[4/5] bg-charcoal-100/40">
            <iframe
              src="/pdf/terms_and_conditions.pdf#view=FitH"
              title="Terms & Conditions"
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>

        <p className="mt-8 text-sm text-charcoal-400 text-center">
          Have a question? Just{" "}
          <Link
            href="/contact"
            className="underline-offset-4 underline hover:text-mustard-600"
          >
            send us a message
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
