"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, FileText, PlayCircle, Sparkles, ShieldCheck, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const perks = [
  {
    icon: PlayCircle,
    title: "Bite-size video lessons",
    desc: "Lessons grouped into modules. Watch at your own pace, anywhere.",
  },
  {
    icon: FileText,
    title: "Interactive workbooks",
    desc: "Complete online, download or print. Your notes stay synced.",
  },
  {
    icon: CheckCircle2,
    title: "Track your progress",
    desc: "Every mini-lesson ticked off as you finish — momentum guaranteed.",
  },
  {
    icon: ShieldCheck,
    title: "One payment, lifetime access",
    desc: "Pay once with PayPal. Come back whenever you want, forever.",
  },
  {
    icon: KeyRound,
    title: "Free Access Codes",
    desc: "Got a code from Anto? Redeem it in seconds — full access unlocked.",
  },
  {
    icon: Sparkles,
    title: "Free preview modules",
    desc: "Curious? Some modules are free — try before you commit.",
  },
];

export function AcademySection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="container-wide">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20 items-center">
          <div>
            <Badge variant="terracotta" className="mb-5">
              New · Poncho Academy
            </Badge>
            <h2 className="font-serif text-display-lg text-balance">
              <span className="text-charcoal-500">Self-paced Spanish, </span>
              <span className="gradient-text">streaming in your living room.</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-charcoal-500/80 max-w-xl">
              All the warmth of Anto&rsquo;s classes, on-demand. Watch the videos,
              do the workbook, tick off each mini-lesson. Pay once, learn forever.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild size="pill-lg">
                <Link href="/ondemand">Browse courses</Link>
              </Button>
              <Button asChild variant="soft" size="pill-lg">
                <Link href="/auth/signup">Create free account</Link>
              </Button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {perks.map((perk, i) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className="group relative overflow-hidden rounded-2xl bg-cream-50 ring-1 ring-charcoal-100/40 p-5 hover:ring-mustard/40 hover:shadow-soft transition-all duration-300"
              >
                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-mustard/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-mustard/15 text-mustard-600 mb-3">
                    <perk.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-lg leading-tight mb-1.5">
                    {perk.title}
                  </h3>
                  <p className="text-sm text-charcoal-400 leading-relaxed">
                    {perk.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
