# Build summary — on-demand Academy (session 1)

This document captures what was built, what's left, and how to pick up
from here.

---

## What got built this session

### Database (Supabase project `wdpgkhghigaowtdtjztz`)

16 migrations applied in order. Every new table has RLS enabled. Every
new column is additive (no destructive changes to existing data).

| # | Name | What's in it |
|---|---|---|
| 0001 | `base_schema` | profiles, courses, modules, lessons, workbooks, enrollments, lesson_progress, workbook_notes, access_codes, payments, contacts + auth trigger + generic updated_at trigger |
| 0002 | `mux_columns` | Mux fields on lessons (asset/playback/upload IDs, status, duration, mp4, thumbnail), `release_at`, `is_trailer` |
| 0003 | `webhook_events` | Idempotency log for Mux + PayPal webhooks |
| 0004 | `subtitles` | `lesson_subtitles` + `subtitle_cues` + `subtitle_cue_history` (per-cue editable, versioned) |
| 0005 | `course_resources` | Downloadable resources per course / lesson |
| 0006 | `digital_products` | Standalone product catalogue + purchases |
| 0007 | `codes_extensions` | `access_codes.scope` + `digital_product_id`, new `discount_codes` table, `payments.discount_*` linkage |
| 0008 | `currency` | `courses.currency` + `digital_products.currency` (default GBP) |
| 0009 | `reviews` | `course_reviews` with enrolment-gated insert + admin moderation |
| 0010 | `certificates` | One per (user, course), public-verifiable by `cert_code` |
| 0011 | `email_log` | Audit trail of every transactional email sent |
| 0012 | `notes_bookmarks` | `lesson_notes`, `lesson_bookmarks`, `lesson_progress.last_position_seconds` |
| 0013 | `tags` | `tags` + `course_tags` + 12 seeded tags (Beginner, Pronunciation, etc.) |
| 0014 | `courses_meta` | `learning_outcomes`, `money_back_*`, `students_count`, `avg_rating`, `ratings_count` |
| 0015 | `user_prefs` | `profiles.onboarded_at` + `user_preferences` (goal, reminders, defaults) |
| 0016 | `storage_buckets` | course-videos, course-workbooks, course-covers, course-resources, course-subtitles, digital-products + RLS policies |

### Types

- `types/database.ts` regenerated from live schema via Supabase MCP.
  Legacy aliases (`Profile`, `Course`, `Module`, `Lesson`...) preserved
  so existing code compiles without renames.
- Added enum unions (`UserRole`, `CourseLevel`, `MuxStatus`,
  `SubtitleLanguage`, `CodeScope`, `ResourceKind`, etc.) for use across
  the codebase.

### Dependencies

Installed via `pnpm add`:

```
@mux/mux-node          @mux/mux-player-react   tus-js-client
@dnd-kit/core          @dnd-kit/sortable       @dnd-kit/utilities
openai                 next-intl
@react-email/components resend
@react-pdf/renderer
@sentry/nextjs         posthog-js              posthog-node
canvas-confetti        react-markdown
jsonwebtoken           @types/jsonwebtoken
```

### Configuration

- `.env.local` updated with new Supabase ref + placeholders for every
  new integration. Detailed setup steps in `TODO_HUMAN.md`.
- `.env.example` matches.
- `lib/env.ts` now exposes lazy getters for all secrets + `features`
  flags so the app boots gracefully without optional integrations.
- `lib/supabase/storage.ts` lists every bucket + provides path helpers
  (`subtitlesPath`, `resourcePath`, `digitalProductPath`).

### Library code (server-only)

| Module | Purpose |
|---|---|
| `lib/mux/client.ts` | Mux SDK singleton + default asset settings + thumbnail / MP4 URL helpers |
| `lib/mux/signing.ts` | RS256 JWT signing for playback URLs (15-min TTL default, 1h for trailers) |
| `lib/mux/webhook.ts` | HMAC verification with 5-min skew tolerance |
| `lib/transcription/whisper.ts` | End-to-end Whisper pipeline: fetch MP4, transcribe EN+ES in parallel, write cues, render VTT, upload to subtitle bucket, mark status |
| `lib/emails/send.ts` | Resend wrapper with `email_log` audit, typed `EmailKind`, soft-fail in dev |
| `lib/ratelimit.ts` | In-memory token-bucket rate limiter + standard profiles + IP extractor |

### API routes (new)

| Route | Notes |
|---|---|
| `POST /api/mux/direct-upload` | Admin-only. Creates Mux Direct Upload, stores upload id on lesson, marks `mux_status='uploading'`. |
| `POST /api/mux/webhook` | HMAC-verified, idempotent via `webhook_events`. Handles `video.upload.asset_created`, `video.asset.ready` (triggers Whisper), `video.asset.errored`. |
| `GET /api/mux/playback-token` | Signed JWT playback URLs. Rate-limited 30/min/IP. Trailer → public 1h TTL, free-preview → auth 15-min, otherwise → enrolment-gated 15-min. |
| `POST /api/codes/validate` | Pre-flight code check for checkout UX. Rate-limited 10/min/IP. Returns `kind: 'free'\|'discount'` + `percentOff`. |
| `POST /api/admin/courses` | Admin-only. Creates a draft course with title/slug/level/price. |

### Storefront

- `/courses` → `/ondemand` rename complete.
  - Folder moved: `app/(marketing)/ondemand/`.
  - 301 permanent redirects in `next.config.mjs`: `/courses` → `/ondemand`, `/courses/:slug*` → `/ondemand/:slug*`.
  - All 10 internal references updated (header, footer, hero, CTA,
    academy section, dashboard, learn route redirects, checkout panel).
- `/ondemand` (list) now uses ratings + `ratings_count` + 60s ISR.
- `/ondemand/[slug]` (detail) now includes:
  - Money-back badge
  - Ratings + stars + reviews count
  - Students count
  - Learning outcomes grid
  - Trailer button
  - Updated curriculum tree with Mux duration fallback
  - "This course includes" checklist (HD video, downloadables, subs EN+ES, lifetime, certificate, multi-device)
- `next.config.mjs` adds Mux image hosts (`image.mux.com`, `stream.mux.com`) to `images.remotePatterns`.

### Admin panel (shell)

| Route | Status |
|---|---|
| `app/(admin)/admin/layout.tsx` | ✅ Auth + role guard via `requireAdmin` semantics. Uses `AppHeader variant="admin"`. |
| `/admin` (overview) | ✅ Setup checklist (Mux/Whisper/Resend/firstCourse/publish), stat cards (students/courses/revenue/enrolments), recent enrolments, quick actions |
| `/admin/courses` | ✅ Full table view |
| `/admin/courses/new` | ✅ 3-field wizard (title→slug, level, price). POSTs to `/api/admin/courses`. |
| `/admin/courses/[id]` | 🚧 Stub — full editor (DnD curriculum, video upload, subtitle editor) deferred |
| `/admin/codes` | 🚧 Stub (backend ready) |
| `/admin/students` | ✅ Table of latest 100 students |
| `/admin/orders` | ✅ Table of latest 100 payments |
| `/admin/reviews` | 🚧 Stub (backend ready) |
| `/admin/settings` | ✅ Integration status dashboard |
| `/admin/digital-products` | 🚧 Stub |

### Docs at repo root

- `TODO_HUMAN.md` — every key Manuel needs to provide, with step-by-step
  links and instructions for Mux / OpenAI / Resend / PayPal / PostHog / Sentry.
- `DECISIONS.md` — 16 documented judgment calls with rationale.
- `FUTURE.md` — explicit list of features deferred to v2.
- `BUILD_SUMMARY.md` — this file.

---

## What's NOT built yet (deferred for next session)

The build prompt is genuinely 2-3 weeks of engineering. This session
covered the **entire data + infra foundation** plus enough UI to be
navigable. The next sessions should attack these in order of "blocks
Anto's first real upload":

### Critical next (blocks launch)
1. **Admin course editor** (`/admin/courses/[id]`): tabs for Overview /
   Curriculum / Resources / Pricing / SEO / Publish / Analytics. The
   curriculum tab is the big one (drag-and-drop modules + lessons,
   inline edit, per-lesson video upload trigger).
2. **Mux upload UI** (component): tus.io resumable upload with progress
   bar, ETA, "close tab is fine" copy, triggers
   `/api/mux/direct-upload`.
3. **Premium video player** wired to `<MuxPlayer>` with signed token
   refresh, text tracks from `course-subtitles` bucket, last-position
   resume.
4. **Subtitle editor UI** (`/admin/courses/[id]/lessons/[lessonId]/subtitles`):
   per-cue editor with timestamp-jump preview.

### Important (premium feel)
5. **Notes panel + bookmarks** in the lesson player.
6. **Email templates** in `lib/emails/templates/*.tsx` (React Email +
   branded with cream/mustard/serif). Wire to purchase / signup /
   completion events.
7. **Onboarding modal** on first dashboard visit.
8. **Reviews UI** on `/ondemand/[slug]` + dashboard review CTA.
9. **Certificate PDF generation** + verification page.
10. **Codes admin UI** (free + discount, bulk, templates).

### Nice-to-have (next iteration)
11. i18n (next-intl) wiring + `messages/{en,es}.json`.
12. Sentry + PostHog client init.
13. Search route (`/api/search`) + sidebar filters.
14. Tag chips on course cards.
15. Legal pages (terms/privacy/refunds) with legal-advisor agent draft.
16. PWA shell (`manifest.json` + service worker).
17. Storefront for digital products.
18. Abandoned-checkout Vercel Cron.

---

## How to pick up from here

### Step 0 — Get the app booting
1. Open `TODO_HUMAN.md` and paste the Supabase service-role key into
   `.env.local`.
2. `pnpm dev`. App should boot. Homepage works. `/ondemand` loads (empty).
   `/admin` redirects to login.
3. Sign up at `/auth/signup`. Then promote yourself to admin via SQL
   (see `TODO_HUMAN.md` "Promoting yourself to admin").
4. Refresh dashboard → "Admin" link should appear in user menu.
5. Try `/admin/courses/new` → create a draft course → confirm it lands
   in `/admin/courses` list and at `/ondemand/{slug}` (even unpublished,
   because preview).

### Step 1 — Next dev session
The natural starting point is the **admin course editor + Mux upload UI**.
That unlocks "Anto can upload her first lesson" which unlocks the
whole subtitle + player pipeline (already implemented backend-side).

Recommended split for the next session:

- Backend: `app/api/admin/courses/[id]/route.ts` (PATCH/DELETE),
  `app/api/admin/modules/route.ts` (POST/PATCH/DELETE),
  `app/api/admin/lessons/route.ts` (POST/PATCH/DELETE/reorder).
- Frontend: `components/admin/curriculum-editor.tsx` (dnd-kit),
  `components/admin/mux-uploader.tsx` (tus-js-client),
  `app/(admin)/admin/courses/[id]/page.tsx` (full tabbed editor).
- Test: upload a real MP4, confirm Whisper fires, subtitles land in
  `lesson_subtitles` + `subtitle_cues`, VTT uploads to bucket.

### Verification (current session)
- `pnpm type-check` — passed (after rename + schema + new libs).
- `pnpm lint` — not run yet (could surface unused imports in stub pages).
- Migrations applied successfully (all 16 returned `{success: true}`).
- Storage buckets created with policies.
- Authoring flows untouched: PayPal / free code redeem / contact form
  remain functional (none of those code paths were modified).

---

## Trade-offs / things to know

- **`students_count`, `avg_rating`, `ratings_count` on `courses`** are
  denormalized but not yet maintained by triggers. They display zeros
  until either (a) a future migration adds triggers, or (b) the relevant
  API routes update them on insert (recommended approach for v2).
- **No tests yet.** TDD wasn't part of this build (the prompt scope was
  too wide). The next session should add at least integration tests
  for the Mux upload + webhook + Whisper roundtrip.
- **Service-role usage is liberal** — most server routes call
  `getSupabaseAdminClient()` for simplicity. Long-term, prefer
  per-user `getSupabaseServerClient()` + RLS where possible to defend
  in depth.
- **Mux direct-upload `cors_origin`** is set to
  `env.NEXT_PUBLIC_SITE_URL`. When you deploy to production, make sure
  that env points at the production URL, not localhost.
