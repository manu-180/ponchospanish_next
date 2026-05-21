# Future / out-of-scope features

Explicitly **NOT** built in the on-demand Academy launch. Listed here
so v2 has a starting point and nothing falls through the cracks.

---

## Marketing / growth (defer until product-market fit)

- **Affiliate / referral codes** — students refer friends, get credit.
  Trivial schema (`referrals` table linking referrer to new enrolment),
  hard UX (dashboard widget, conversion attribution, payout policy).
- **Course bundles** ("buy 3, get 20% off") — needs cart concept; today
  every checkout is single-item.
- **Marketing newsletter / email opt-in** — separate consent flow + ESP
  list integration.
- **Press / featured-in row** is a placeholder slot Anto can fill from
  admin settings — populate when there's real press to show.
- **Inactivity nudge emails beyond abandoned checkout** — easy to over-spam,
  needs careful copy + cadence design.

## Pedagogy / engagement

- **Lesson quizzes** — multi-question, multi-format, scored, retake-able.
  Significant schema (questions, options, attempts) + UI. Defer until
  Anto requests it specifically.
- **Pronunciation practice with mic** — would use Whisper to score user
  audio against reference. Niche, high-effort, low-launch-value.
- **Flashcards / vocab review** — Anki-style spaced repetition. Cool but
  a whole separate product.
- **Q&A threads or comments per lesson** — moderation overhead, spam risk.
  Better to direct questions to email / live lessons.
- **Live cohort sessions / Zoom** — out of scope for on-demand.
- **AI chatbot tutor** — interesting but expensive (OpenAI tokens × every
  message) and risky for a teacher brand. Defer.
- **Course discussion forums** — community moderation is a full-time job.
- **Multi-instructor marketplace** — Poncho is Anto's brand. If a second
  teacher joins, redesign then.

## Gamification (intentionally avoided)

- **Streaks / badges / leaderboards** — easy to overdo for a premium
  warm brand. Duolingo-ification would clash with Anto's voice.

## Platform features

- **Native mobile apps** — PWA shell ships in this build; native iOS /
  Android only if usage data justifies it.
- **Stripe checkout** — PayPal-only by Anto's preference. Stripe would
  add complexity (KYC, dispute handling) for marginal coverage.
- **Bulk video upload from a folder** — Anto's first courses are <50
  lessons, manual upload is fine. Build when she crosses 200+ lessons.
- **Per-user dynamic video watermark** — Mux supports this (PII tag in
  player overlay), but it's a fingerprinting cost for marginal piracy
  deterrence.

## Internal tooling

- **Audit log of admin actions** — every admin change writes to an
  immutable log. Nice-to-have for trust but adds query overhead.
- **Full PWA offline mode** — would need video download support, which
  fights with Mux's signed-URL model. Shell-only offline ships.

## Email / observability

- **Cron-based abandoned-checkout emails (1h, 24h)** — route is stubbed
  at `app/api/cron/abandoned-checkout/route.ts`. Vercel Cron job
  configuration deferred until Resend domain is verified and Manuel
  is happy with first-batch deliverability.

---

## When something here is requested

1. Check if it still belongs in "future" or if conditions changed.
2. Move from this file → a real spec + brainstorm.
3. Decompose with `team-lead` like the original on-demand build did.
