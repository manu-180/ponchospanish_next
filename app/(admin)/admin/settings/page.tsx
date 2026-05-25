import { features } from "@/lib/env";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  const integrations = [
    {
      key: "supabase",
      label: "Supabase (database + auth)",
      done: true,
      desc: "Connected to project wdpgkhghigaowtdtjztz.",
    },
    {
      key: "mux",
      label: "Mux (video hosting + signed playback)",
      done: features.mux,
      desc: "See TODO_HUMAN.md §3 for setup instructions.",
    },
    {
      key: "whisper",
      label: "OpenAI Whisper (auto-subtitles)",
      done: features.whisper,
      desc: "See TODO_HUMAN.md §4 for setup instructions.",
    },
    {
      key: "resend",
      label: "Resend (transactional emails)",
      done: features.resend,
      desc: "See TODO_HUMAN.md §5 for setup instructions.",
    },
    {
      key: "posthog",
      label: "PostHog (product analytics)",
      done: features.posthog,
      desc: "Optional. See TODO_HUMAN.md §6.",
    },
    {
      key: "sentry",
      label: "Sentry (error tracking)",
      done: features.sentry,
      desc: "Optional. See TODO_HUMAN.md §7.",
    },
  ];

  return (
    <div className="container-wide py-10 md:py-14 space-y-8 max-w-3xl">
      <div>
        <h1 className="font-serif text-3xl md:text-4xl">Settings</h1>
        <p className="text-charcoal-400 mt-1">
          Integration status. Anything red needs an environment variable in
          <code className="mx-1 px-1.5 py-0.5 rounded bg-cream-100 font-mono text-xs">
            .env.local
          </code>
          and a server restart.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 divide-y divide-charcoal-100/40">
          {integrations.map((i) => (
            <div
              key={i.key}
              className="py-4 flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="font-medium">{i.label}</p>
                <p className="text-xs text-charcoal-400 mt-0.5">{i.desc}</p>
              </div>
              {i.done ? (
                <Badge variant="success">Connected</Badge>
              ) : (
                <Badge variant="terracotta">Not configured</Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
