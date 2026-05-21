import Link from "next/link";
import {
  BookOpen,
  CreditCard,
  GraduationCap,
  KeyRound,
  ShieldCheck,
  Sparkles,
  Upload,
  Users,
  Video,
} from "lucide-react";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { features } from "@/lib/env";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const admin = getSupabaseAdminClient();

  // Gather stats. Failures fall back to 0 so the page never crashes.
  const [
    { count: studentsCount },
    { count: coursesCount },
    { count: publishedCount },
    { count: enrolmentsCount },
    { data: latestEnrolments },
    { data: revenueRows },
  ] = await Promise.all([
    admin.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
    admin.from("courses").select("id", { count: "exact", head: true }),
    admin
      .from("courses")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true),
    admin.from("enrollments").select("id", { count: "exact", head: true }),
    admin
      .from("enrollments")
      .select("id, created_at, source, user:profiles(email, full_name), course:courses(title, slug)")
      .order("created_at", { ascending: false })
      .limit(8),
    admin
      .from("payments")
      .select("amount, currency, created_at")
      .eq("status", "captured")
      .gte(
        "created_at",
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      ),
  ]);

  const revenue30d = (revenueRows ?? []).reduce(
    (acc, p) => acc + Number(p.amount ?? 0),
    0,
  );

  // First-time checklist: which integrations are still missing?
  const checklist = [
    {
      key: "mux",
      label: "Connect Mux for video hosting",
      done: features.mux,
      href: "/admin/settings#mux",
      help: "Add MUX_TOKEN_ID + MUX_TOKEN_SECRET to .env.local",
    },
    {
      key: "whisper",
      label: "Connect OpenAI for auto-subtitles",
      done: features.whisper,
      href: "/admin/settings#whisper",
      help: "Add OPENAI_API_KEY to .env.local",
    },
    {
      key: "resend",
      label: "Connect Resend for transactional emails",
      done: features.resend,
      href: "/admin/settings#resend",
      help: "Add RESEND_API_KEY and verify your sending domain",
    },
    {
      key: "firstCourse",
      label: "Create your first course",
      done: (coursesCount ?? 0) > 0,
      href: "/admin/courses/new",
      help: "Title, level, price — that's it.",
    },
    {
      key: "publish",
      label: "Publish a course",
      done: (publishedCount ?? 0) > 0,
      href: "/admin/courses",
      help: "Toggle 'Published' on a course to make it visible on /ondemand",
    },
  ];

  const allDone = checklist.every((c) => c.done);

  return (
    <div className="container-wide py-10 md:py-14 space-y-10">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mustard-600">
          Welcome back
        </p>
        <h1 className="font-serif text-3xl md:text-4xl">
          Poncho Academy — Admin
        </h1>
        <p className="text-charcoal-400 max-w-2xl">
          Self-serve everything from here. Need help? It&apos;s probably one
          click away.
        </p>
      </header>

      {!allDone && (
        <Card className="border-mustard/40 bg-mustard/5">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-mustard text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <h2 className="font-serif text-xl">Setup checklist</h2>
                <p className="text-sm text-charcoal-400">
                  Finish these to go live.
                </p>
              </div>
            </div>
            <ul className="space-y-2">
              {checklist.map((item) => (
                <li
                  key={item.key}
                  className="flex items-center gap-3 rounded-xl bg-cream p-3 ring-1 ring-charcoal-100/40"
                >
                  <span
                    className={
                      item.done
                        ? "inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold"
                        : "inline-flex h-7 w-7 items-center justify-center rounded-full bg-charcoal-100 text-charcoal-400 text-xs font-bold"
                    }
                  >
                    {item.done ? "✓" : "·"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium leading-tight">{item.label}</p>
                    <p className="text-xs text-charcoal-400 mt-0.5">
                      {item.help}
                    </p>
                  </div>
                  {!item.done && (
                    <Button asChild variant="soft" size="sm">
                      <Link href={item.href}>Go</Link>
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Students"
          value={studentsCount ?? 0}
          href="/admin/students"
        />
        <StatCard
          icon={GraduationCap}
          label="Courses"
          value={`${publishedCount ?? 0} / ${coursesCount ?? 0}`}
          subtitle="published / total"
          href="/admin/courses"
        />
        <StatCard
          icon={CreditCard}
          label="Revenue (30 days)"
          value={`£${revenue30d.toFixed(2)}`}
          href="/admin/orders"
        />
        <StatCard
          icon={BookOpen}
          label="Total enrolments"
          value={enrolmentsCount ?? 0}
          href="/admin/students"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl">Recent enrolments</h3>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/students">View all</Link>
              </Button>
            </div>
            {(latestEnrolments ?? []).length === 0 ? (
              <p className="text-sm text-charcoal-400 py-8 text-center">
                No enrolments yet. They&apos;ll appear here the moment someone
                buys or redeems a code.
              </p>
            ) : (
              <ul className="divide-y divide-charcoal-100/40">
                {(latestEnrolments ?? []).map((e) => {
                  const u = Array.isArray(e.user) ? e.user[0] : e.user;
                  const c = Array.isArray(e.course) ? e.course[0] : e.course;
                  return (
                    <li
                      key={e.id}
                      className="flex items-center gap-3 py-3 text-sm"
                    >
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-mustard/15 text-mustard-600 text-xs font-semibold">
                        {(u?.full_name ?? u?.email ?? "?")
                          .toString()
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {u?.full_name ?? u?.email ?? "Unknown"}
                        </p>
                        <p className="text-xs text-charcoal-400 truncate">
                          {c?.title ?? "Unknown course"}
                        </p>
                      </div>
                      <Badge variant="muted">{e.source}</Badge>
                      <span className="text-xs text-charcoal-400 shrink-0">
                        {new Date(e.created_at).toLocaleDateString()}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-3">
            <h3 className="font-serif text-xl">Quick actions</h3>
            <div className="grid gap-2">
              <Button asChild className="justify-start">
                <Link href="/admin/courses/new">
                  <Sparkles className="h-4 w-4" /> New course
                </Link>
              </Button>
              <Button asChild variant="soft" className="justify-start">
                <Link href="/admin/codes">
                  <KeyRound className="h-4 w-4" /> Generate codes
                </Link>
              </Button>
              <Button asChild variant="soft" className="justify-start">
                <Link href="/admin/courses">
                  <Video className="h-4 w-4" /> Upload a video
                </Link>
              </Button>
              <Button asChild variant="ghost" className="justify-start">
                <Link href="/admin/settings">
                  <ShieldCheck className="h-4 w-4" /> Settings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  subtitle?: string;
  href: string;
}) {
  return (
    <Link href={href} className="group">
      <Card className="hover:shadow-soft-lg transition-all duration-300 group-hover:-translate-y-0.5">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-charcoal-400">
              {label}
            </p>
            <Icon className="h-4 w-4 text-mustard-600" />
          </div>
          <p className="font-serif text-3xl">{value}</p>
          {subtitle && (
            <p className="text-xs text-charcoal-400 mt-1">{subtitle}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
