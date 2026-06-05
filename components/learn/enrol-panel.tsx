"use client";

/**
 * Client island for the course-detail enrol CTA.
 *
 * This is the ONLY per-user piece of `/ondemand/[slug]`. Keeping it as a
 * client island lets the rest of the page render as STATIC/ISR HTML (great for
 * SEO + cost — anonymous visits no longer trigger a dynamic server render).
 *
 * Flow:
 *  - Read the Supabase session client-side (cookie, no network). Logged-out
 *    visitors — the majority of SEO traffic — resolve instantly with ZERO
 *    extra requests and see the sign-in CTA.
 *  - Logged-in visitors hit the tiny `/api/courses/[id]/access` endpoint to
 *    learn whether they already own the course.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckoutPanel } from "@/components/learn/checkout-panel";

interface EnrolPanelProps {
  course: {
    id: string;
    slug: string;
    title: string;
    price_gbp: number;
  };
}

/** loading → checking · anon → logged out · guest → logged in, no access · owned → enrolled */
type Status = "loading" | "anon" | "guest" | "owned";

export function EnrolPanel({ course }: EnrolPanelProps) {
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        if (!cancelled) setStatus("anon");
        return;
      }

      try {
        const res = await fetch(`/api/courses/${course.id}/access`, {
          cache: "no-store",
        });
        const data = (await res.json()) as { hasAccess?: boolean };
        if (!cancelled) setStatus(data.hasAccess ? "owned" : "guest");
      } catch {
        if (!cancelled) setStatus("guest");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [course.id]);

  if (status === "loading") {
    return (
      <div
        className="h-12 w-full animate-pulse rounded-full bg-charcoal-100/50"
        aria-hidden="true"
      />
    );
  }

  if (status === "owned") {
    return (
      <Button asChild size="lg" className="w-full">
        <Link href={`/learn/${course.slug}`}>Start learning</Link>
      </Button>
    );
  }

  return <CheckoutPanel course={course} isAuthenticated={status === "guest"} />;
}
