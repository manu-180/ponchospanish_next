# Build prompt — Poncho `/ondemand` Academy (FINAL)

> **Pegá este archivo TAL CUAL en una nueva sesión de Claude Code dentro de `C:\MisProyectos\Family\poncho_next`. La sesión debe ejecutar todo de corrido, sin preguntar nada al usuario.**

---

You are working on **poncho_next**, a Next.js 15 + Supabase project for "Poncho Spanish" — an online Spanish academy run by **Anto** (UK-based, teaches Argentine + UK Spanish to global students).

This is a **single end-to-end build task**. Do NOT pause to ask the human anything. Every decision below is **final**. If something is genuinely ambiguous, pick the most reasonable default and keep going. If a secret/API key is missing, scaffold with `process.env.X ?? ""`, append the key name to `TODO_HUMAN.md` at repo root, and continue. Goal: finish in one session.

---

## 0. Mandatory workflow

1. **Decompose with `team-lead` first.** Spawn parallel sub-agents (frontend, backend, DB, payments, integrations, code review). Coordinate by file ownership — no two agents touching the same file simultaneously.
2. **Use Supabase MCP for the DB.** Project ref is `zrzpmgyafuesmakkoysn`. Probe `list_projects` on each connected Supabase MCP (`supabase-conductor`, `supabase-oficiosapp`, `supabase-virus`, generic) until one returns that ref — that's the one to use. Apply migrations with `apply_migration`, then `generate_typescript_types` → overwrite `types/database.ts`.
3. **Verify before claiming done** (§15).
4. **Don't break existing flows**: free-code redeem, PayPal checkout, lesson progress, workbook viewer, marketing pages, contact form.
5. **Push back on ambiguity by picking defaults — not by asking.** Document calls in `DECISIONS.md` at repo root.

---

## 1. Project facts (don't re-discover)

- **Working dir**: `C:\MisProyectos\Family\poncho_next`
- **Stack**: Next.js 15.1.4 (App Router) + React 19 + TypeScript + Tailwind + Supabase (`@supabase/ssr`, `@supabase/supabase-js`) + PayPal (`@paypal/react-paypal-js`) + shadcn/ui primitives in `components/ui/*`.
- **Package manager**: pnpm.
- **Design tokens**: cream / mustard / charcoal / terracotta. `font-serif` for display headings. Warm, rounded, premium feel. Tailwind config at `tailwind.config.ts`.
- **Existing tables** (`types/database.ts`): `profiles`, `courses`, `modules`, `lessons`, `workbooks`, `enrollments`, `lesson_progress`, `workbook_notes`, `access_codes`, `payments`, `contacts`.
- **Existing storage buckets**: `course-videos`, `course-workbooks`, `course-covers`.
- **Existing routes**:
  - `app/(marketing)/courses/page.tsx` — public browse list
  - `app/(marketing)/courses/[slug]/page.tsx` — course detail + checkout
  - `app/(app)/learn/[slug]/...` — protected player
  - `app/(app)/dashboard/page.tsx` — student "My Academy"
  - `app/(admin)/admin/` — **EMPTY**, you build it
  - `app/api/paypal/{create-order,capture-order}` — works
  - `app/api/codes/redeem`, `app/api/enrollments/free` — works

---

## 2. Reference vs style

- **Functional reference**: Udemy + MasterClass + Domestika. Replicate UX patterns: cinematic trailers, sticky buy box, syllabus tree with durations, "What you'll learn" grid, instructor card, lifetime-access messaging, discount-code field in checkout, premium video player with notes/bookmarks/speed/captions, ratings + reviews, course completion certificates.
- **Visual style**: KEEP the existing Poncho aesthetic — cream/mustard/charcoal/terracotta, serif display, warm radii, soft shadows. **Do NOT import a generic SaaS palette.**
- **Voice/tone**: Anto's brand. Warm, simple, personal. "Pay once, learn forever". "Lifetime access". No hype/clickbait. The brand voice in Manuel's global `CLAUDE.md` (contrarian, no-B.S.) is for HIS marketing — Anto's is the opposite.
- **For Anto (admin UX)**: every screen is self-serve and obvious. Big buttons. Drag-and-drop. Inline edit. Smart defaults. Tooltips on every non-obvious field. She never needs Manuel to touch the DB.

---

## 3. Hard requirements

### 3.1 Rename `/courses` → `/ondemand`

- Move folder `app/(marketing)/courses` → `app/(marketing)/ondemand`. Course detail stays at `app/(marketing)/ondemand/[slug]/page.tsx`.
- Grep the repo for every `/courses` link and update. Leave `/learn/...` untouched.
- In `next.config.mjs`, add permanent `redirects()`: `/courses` → `/ondemand`, `/courses/:slug` → `/ondemand/:slug`.
- Update page metadata to use "On-Demand Spanish courses" framing.

### 3.2 Video pipeline — Mux (decision locked)

#### Setup
- Add deps: `@mux/mux-node`, `@mux/mux-player-react`, `tus-js-client`.
- New env vars in `.env.example`:
  ```
  MUX_TOKEN_ID=
  MUX_TOKEN_SECRET=
  MUX_WEBHOOK_SECRET=
  MUX_SIGNING_KEY_ID=
  MUX_SIGNING_KEY_PRIVATE=
  ```
- Free plan handles ≤10 videos. Code must also work seamlessly on Pay-as-you-go (Anto upgrades from Mux dashboard, no code change needed).

#### Upload flow
1. Admin clicks "Upload video" on a lesson row.
2. Client POSTs to `/api/mux/direct-upload` → server creates Direct Upload with:
   ```ts
   {
     cors_origin: process.env.NEXT_PUBLIC_SITE_URL,
     new_asset_settings: {
       playback_policy: ["signed"],
       mp4_support: "standard",
       max_resolution_tier: "1080p",
       encoding_tier: "smart",
     },
     timeout: 7200,
   }
   ```
3. Server returns upload URL + DB row id.
4. **Resumable uploads via tus.io** (Mux Direct Upload supports it). `tus-js-client` config: `chunkSize: 5_242_880`, `retryDelays: [0, 1000, 3000, 5000, 10000]`. If wifi cuts mid-upload, it resumes.
5. **Progress UI**: percent bar, MB uploaded / MB total, ETA, "You can close this tab — upload resumes automatically" hint.
6. Mux webhook `video.asset.ready` → `app/api/mux/webhook/route.ts`:
   - **Verify signature** with `MUX_WEBHOOK_SECRET`.
   - **Idempotency**: insert into `webhook_events` table with `unique (provider, event_id)`. If row exists, return 200 and skip.
   - Update lesson row: `mux_asset_id`, `mux_playback_id`, `mux_status='ready'`, `mux_duration_seconds`, `mux_static_mp4_url`, `mux_thumbnail_url` (default at 5 sec: `https://image.mux.com/{playbackId}/thumbnail.jpg?time=5`).
   - Enqueue transcription job (§3.3).

#### Playback (signed URLs)
- Mux signing keys → JWT-signed playback URLs server-side.
- `app/api/mux/playback-token/route.ts` returns `{ token, expiresAt }` with TTL = 15 min.
- Client refreshes via `setTimeout(..., expiresAt - 60s)` automatically.
- Gate by `userHasAccessToCourse` OR `lesson.is_free_preview` OR `lesson.is_trailer`.

#### Auto-thumbnail
- Default lesson cover from Mux thumbnail (5 sec mark). Admin can override.
- Course cover: if not set, use the first lesson's Mux thumbnail.

#### DB additions on `lessons`
```sql
alter table lessons
  add column mux_asset_id text,
  add column mux_playback_id text,
  add column mux_upload_id text,
  add column mux_status text default 'idle',
  add column mux_duration_seconds numeric,
  add column mux_static_mp4_url text,
  add column mux_thumbnail_url text,
  add column release_at timestamptz,        -- drip release (§3.13)
  add column is_trailer boolean default false; -- course-level trailer (§3.18.B)
```

#### Webhook events table
```sql
create table webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_id text not null,
  event_type text not null,
  payload jsonb,
  received_at timestamptz default now(),
  unique (provider, event_id)
);
```

### 3.3 Subtitles — auto + per-cue editable

- **Languages**: `en` and `es` (ISO-639-1 — Whisper handles accents transparently). UI labels: "English (UK)" / "Español (AR)".
- **Provider**: OpenAI Whisper (`whisper-1`). Env: `OPENAI_API_KEY`.
- **Pipeline** (triggered by Mux `video.asset.ready`):
  1. Fetch `mux_static_mp4_url`.
  2. Call Whisper twice — `language: "en"` and `language: "es"` — with `response_format: "verbose_json"`.
  3. Insert one row per segment into `subtitle_cues`.
  4. Render WebVTT from cues → upload to bucket `course-subtitles` at `{lessonId}/{lang}.vtt`.
  5. Mark `lesson_subtitles.status = 'auto'`.
- **Idempotency**: never transcribe same asset twice unless admin explicitly clicks "Re-run".
- **Editor UI** at `/admin/courses/[id]/lessons/[lessonId]/subtitles`:
  - Two tabs: "English" / "Español".
  - Cue list: `[mm:ss → mm:ss]  <editable textarea>  [▶ play this cue]`.
  - Edit cue → PATCH `/api/admin/subtitles/cue/[cueId]` → update row → regen VTT → upload → status `'edited'`.
  - "Re-run auto-transcription" button (confirm dialog because it overwrites edits).
  - **Versioning**: every cue edit inserts in `subtitle_cue_history`. Anto can revert.
  - Status badges: Pending / Generating / Auto-generated / Edited / Failed.
- **Player wiring**: `<MuxPlayer textTracks={[{ src, srclang: 'en', label: 'English (UK)' }, ...]} />`.

#### DB
```sql
create table lesson_subtitles (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  language text not null check (language in ('en','es')),
  vtt_path text,
  status text not null default 'pending' check (status in ('pending','generating','auto','edited','failed')),
  error text,
  generated_at timestamptz,
  updated_at timestamptz default now(),
  unique (lesson_id, language)
);

create table subtitle_cues (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  language text not null check (language in ('en','es')),
  position int not null,
  start_seconds numeric not null,
  end_seconds numeric not null,
  text text not null,
  is_edited boolean not null default false,
  edited_at timestamptz,
  created_at timestamptz default now()
);
create index on subtitle_cues (lesson_id, language, position);

create table subtitle_cue_history (
  id uuid primary key default gen_random_uuid(),
  cue_id uuid not null references subtitle_cues(id) on delete cascade,
  previous_text text not null,
  edited_by uuid references profiles(id),
  edited_at timestamptz default now()
);
```

### 3.4 Digital resources

- **Inside-course resources**: `course_resources` table (id, course_id, lesson_id nullable, title, description, file_path, file_size_bytes, kind enum, position, is_free_preview, created_at). Bucket `course-resources`.
- **Standalone digital products** (ebooks etc.): `digital_products` + `digital_product_purchases` tables. Bucket `digital-products`.
- Storefront: `/ondemand/recursos` (list) + `/ondemand/recursos/[slug]` (detail + buy via PayPal).
- Student dashboard adds "My resources" section.
- Reusable `<FileUpload>` component with drag-and-drop, progress, resumable for >50MB.

### 3.5 Pricing
- All prices in **GBP**. `formatCurrency` from `lib/utils.ts`.
- Add `currency text not null default 'GBP'` on `courses` and `digital_products`.
- **Currency conversion hint on storefront**: detect visitor country (`request.geo` from Vercel) → show small "≈ AR$ 12,000 / ≈ USD 13" under GBP price. Use `https://api.exchangerate-api.com/v4/latest/GBP`, cache 24h. Billing stays in GBP.

### 3.6 Codes — free access AND % discount

- Extend `access_codes`:
  ```sql
  alter table access_codes
    add column scope text not null default 'course' check (scope in ('course','digital_product','any')),
    add column digital_product_id uuid references digital_products(id) on delete cascade;
  ```
- NEW table `discount_codes`:
  ```sql
  create table discount_codes (
    id uuid primary key default gen_random_uuid(),
    code text not null unique,
    scope text not null check (scope in ('course','digital_product','any')),
    course_id uuid references courses(id) on delete cascade,
    digital_product_id uuid references digital_products(id) on delete cascade,
    percent_off int not null check (percent_off between 1 and 100),
    max_uses int,
    uses_count int not null default 0,
    expires_at timestamptz,
    created_by uuid references profiles(id),
    notes text,
    created_at timestamptz default now()
  );
  ```
- Extend `payments`: `discount_code_id uuid references discount_codes(id)`, `discount_percent int`.
- `POST /api/codes/validate` with `{ code, courseId? | digitalProductId? }` → `{ kind: 'free'|'discount', percentOff?: number }`.
- PayPal `create-order` accepts and validates `discountCode` server-side (NEVER trust client).
- **Rate limit** `/api/codes/validate` at 10 req/min/IP, `/api/codes/redeem` at 5 req/min/IP.
- Admin UI `/admin/codes`:
  - Tabs "Free access" / "Discount".
  - Single or bulk-generate (CSV download).
  - **Templates**: "Black Friday 50%", "Influencer (single use, 30%)", "Beta tester (free, 30d)".
  - Filters by course/product/status. Usage tracking.

### 3.7 Admin panel

Build under `app/(admin)/admin/`. Middleware redirects non-admin (`profile.role !== 'admin'`) to `/dashboard`.

#### Routes
- `/admin` — onboarding-aware overview. First-time admin sees 4-step checklist (Mux credentials, first course, first video, first publish). After completion, dashboard with: this-month revenue, active students, latest 10 enrolments, subtitle review queue, top course by views, drop-off red flags.
- `/admin/courses` — table, search, status filter, "New course" button, bulk actions (publish/unpublish/delete with confirm).
- `/admin/courses/new` — 3-field wizard: title (auto-slug), level, price GBP.
- `/admin/courses/[id]` — tabs:
  - **Overview** — title, subtitle, description (Markdown supported via `react-markdown`), cover, level, learning outcomes list, "What you'll learn" bullets, tags (§3.20).
  - **Curriculum** — drag-and-drop modules + lessons (`@dnd-kit/core` + `@dnd-kit/sortable`). Lessons reorderable ACROSS modules (drag from one to another). Inline add/rename/delete. Per lesson: upload video, subtitle editor link, workbook upload, duration, drip release date, free preview toggle, mark-as-trailer toggle.
  - **Resources** — manage `course_resources`.
  - **Pricing** — price + free toggle + money-back guarantee toggle.
  - **SEO** — `<title>`, meta description, OG image override.
  - **Publish** — toggle `is_published`, show public URL, "Preview as student" button (opens course detail in new tab with `?preview=admin` — admin paywall bypass + footer banner "You're viewing as admin · [exit preview]").
  - **Analytics** — student count, completion rate, avg rating, per-lesson drop-off (% who watched ≥75%).
- `/admin/digital-products` — CRUD list.
- `/admin/digital-products/[id]` — edit.
- `/admin/codes` — see §3.6.
- `/admin/students` — searchable table (email, name, enrolments, total spend, joined). Click → student detail + manual grant.
- `/admin/orders` — payments table. Refund links out to PayPal (no auto-refund v1).
- `/admin/reviews` — moderate (hide/unhide/pin).
- `/admin/settings` — site-wide: default subtitle language, money-back default (on/off, day count), social links, instructor bio, branded email "from" name.

#### Admin UX baseline (apply to every screen)
- **Auto-save** every 5s + on blur. "Last saved 2s ago" indicator next to title.
- **Confirmation modals** for destructive actions (delete, unpublish, re-run transcription, refund).
- **"Clone this course"** button — duplicates everything (modules, lessons, resources) as a draft with `(Copy)` suffix.
- **Smart defaults**: slug auto from title, "Module 1 / Module 2" suggestions, default cover from first lesson's Mux thumbnail.
- **Inline help**: `?` tooltip on every non-obvious form field.
- **Optimistic UI**: drag reorders, inline edits, toggles update immediately, rollback + toast on error.
- **Toast notifications** on every save/delete (use existing `sonner`).
- **Empty states with CTAs**: "No courses yet. [Create your first course]".
- **Keyboard shortcuts** in curriculum: Enter to add, Esc to cancel, ↑/↓ to move, Cmd+S to save.
- **"View as student"** mode everywhere relevant.
- Layout: existing `AppHeader` with `variant="admin"`. New nav: `/admin/digital-products`, `/admin/orders`, `/admin/reviews`, `/admin/settings`.

### 3.8 Transactional emails

**Provider**: Resend (`resend` package). Env: `RESEND_API_KEY`. From: `Anto <hello@ponchospanish.com>` (editable in admin settings).

| Event | To student | To Anto |
|---|---|---|
| Signup | Welcome | — |
| Purchase | Confirmation + access link | Sale notification |
| Free code redeemed | Welcome to course | New student |
| Free enrolment | Welcome | — |
| Course 100% complete | Congrats + certificate | — |
| Discount code created | — | Confirmation |
| Refund | Refund notice | — |
| Abandoned checkout (after 1h, 24h) | Reminder + optional 10% off code | — |

**Implementation**:
- React Email templates in `lib/emails/templates/` (use `@react-email/components`). **Branded**: cream BG, mustard accents, serif heading, Poncho logo, footer with social links — match the site aesthetic, not Resend default. Mobile-responsive.
- Service module `lib/emails/send.ts` with typed senders.
- Fire-and-forget from server actions / API routes.
- Log every send in `email_log` table.

### 3.9 Internationalization (EN + ES storefront)

- `next-intl` v3 (App Router compatible).
- Routes: `/en/ondemand`, `/es/ondemand`. `localePrefix: 'as-needed'` (English has no prefix).
- Translate: marketing, storefront, checkout, dashboard, emails. **NOT the admin panel** (Anto is fluent in English).
- `messages/en.json`, `messages/es.json` grouped by route.
- Auto-detect via `Accept-Language`; persist in cookie.
- Language switcher in header (text or flag, designer's call).

### 3.10 SEO & social sharing

- Every course page emits:
  - `<title>` ≤ 60 chars
  - `<meta name="description">` ≤ 155 chars
  - OG + Twitter card with cover (1200x630 — fall back to Mux thumbnail if no custom)
  - JSON-LD `Course` schema (name, description, provider, instructor, offers, hasCourseInstance, aggregateRating from reviews)
- `/sitemap.xml` — auto from published courses + products + locales.
- `/robots.txt` — disallow `/admin`, `/api`, `/dashboard`, `/learn`.
- Canonical URLs everywhere.
- Course list page uses `ItemList` JSON-LD.

### 3.11 Ratings & reviews

```sql
create table course_reviews (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  title text,
  body text,
  is_visible boolean not null default true,
  is_pinned boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (course_id, user_id)
);
create index on course_reviews (course_id, is_visible, created_at desc);
```

- Only enrolled students with ≥30% completion can review.
- One per student per course; editable.
- Admin moderates from `/admin/reviews`.
- Course detail: avg rating + count, 1-5 star distribution histogram, top reviews + load more.
- Course cards: stars + count.

### 3.12 Certificates of completion

- `@react-pdf/renderer` for PDF generation (Edge Function preferred).
- Template: cream BG, mustard border, serif heading, student name, course title, completion date, Anto's signature placeholder, unique cert ID.
- Verification: public `/ondemand/certificados/[certId]`.
- Trigger: when `lesson_progress` count == total lessons for that course.
- Email + dashboard download.
- "Share to LinkedIn" button on cert detail (one-click via LinkedIn share API).

```sql
create table certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  cert_code text not null unique,
  issued_at timestamptz default now(),
  unique (user_id, course_id)
);
```

### 3.13 Drip release (optional per lesson)

`release_at timestamptz` on `lessons` (already in §3.2). If set and `release_at > now()`, lesson shows as 🔒 with countdown in the curriculum tree.

### 3.14 Security baseline

- **MFA for admin role**: Supabase Auth TOTP. Force-enable for `role='admin'`. Block admin routes if MFA missing; redirect to `/account/security`.
- **Rate limiting** via Vercel KV or in-memory bucket: `/api/codes/validate` 10/min/IP, `/api/codes/redeem` 5/min/IP, `/api/auth/*` 10/min/IP.
- **HMAC verification** for Mux + PayPal webhooks.
- **RLS** on every new table.
- **CSRF**: App Router defaults are fine; verify form submits use server actions, not raw POST.
- **No admin emails in public JSON-LD or `<meta>`**.

### 3.15 Observability

- **Sentry** (`@sentry/nextjs`). Env: `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`. Wrap server actions, API routes, client error boundaries.
- **PostHog** (`posthog-js` + `posthog-node`). Env: `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`. Track: page view, course detail viewed, video play, video 25/50/75/100% milestone, lesson completed, course completed, checkout started, checkout completed, code applied, review submitted, certificate issued, dashboard returned.
- **Mux Data** included in Mux plan — use for video engagement.

### 3.16 Legal pages

- `/legal/terms`, `/legal/privacy`, `/legal/refunds`.
- Use `legal-advisor` agent to draft. GDPR-compliant. List processors: Mux, OpenAI, Supabase, Resend, PayPal, PostHog, Sentry.
- Default refund policy: 14-day money-back for EU consumers (GDPR cooling-off), final-sale otherwise. Editable via admin settings.
- Footer links to all three. Checkout requires "I agree to Terms and Refund Policy" checkbox.

### 3.17 Out of scope — DO NOT BUILD (write to `FUTURE.md`)

- Affiliate / referral codes
- Course bundles ("buy 3, get 20% off")
- Audit log of admin actions
- Per-user dynamic video watermark
- Marketing newsletter / email opt-in
- Q&A threads or comments per lesson
- Live cohort sessions / Zoom
- Native mobile apps
- AI chatbot tutor
- Course discussion forums
- Multi-instructor marketplace
- Stripe (PayPal-only by decision)
- **Lesson quizzes** (defer, complex)
- **Pronunciation practice with mic** (defer, niche)
- **PWA full offline mode** (shell only — see §3.21)
- **Gamification / streaks / badges** (defer, easy to overdo)
- **Bulk video upload from folder** (defer, Anto's volume doesn't need it yet)
- **Inactivity nudge emails beyond abandoned checkout** (defer)
- **Flashcards / vocab review** (defer)

### 3.18 Premium video experience

This is where the platform earns its premium price. Apply maximalist polish here.

#### A. Player features (extend `MuxPlayer` defaults)
- **Playback speed**: 0.5 / 0.75 / 1 / 1.25 / 1.5 / 1.75 / 2x. Persist user's preference per device (localStorage).
- **Resume from last position**: auto-save current time every 5s to `lesson_progress.last_position_seconds`. On reopen, prompt "Resume from 12:34?" with Resume / Restart buttons.
- **Keyboard shortcuts**: `Space` play/pause, `← / →` seek 10s, `J / L` seek 10s, `K` play/pause (YouTube parity), `F` fullscreen, `M` mute, `C` captions toggle, `0-9` seek to %, `+/-` speed up/down.
- **Auto-advance**: when lesson ends, show "Next: {title}" overlay with 10s countdown + Cancel. Skipped if last lesson.
- **Mini-player on scroll**: when user scrolls past the main video, dock a small player (192x108px) to bottom-right. Click to expand. Close button. Desktop only.
- **Picture-in-picture**: enabled on iOS Safari + Chrome (`playsInline`, expose PiP button).
- **Caption styling controls**: in player settings, allow user to set font size (S/M/L/XL), text color, background opacity. Persist per device.
- **Auto-pause when tab is hidden** (no playing in background unless PiP).

#### B. Notes panel (synced to timestamp)
- Side panel beside the video player on lesson page (desktop), bottom sheet on mobile.
- Each note has a timestamp captured at the moment of creation. Click the timestamp → video jumps there.
- Inline edit, delete. Auto-save.
- Notes are per-user, per-lesson, private.
- "Export all notes" → markdown download per course.

```sql
create table lesson_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  timestamp_seconds numeric not null,
  body text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index on lesson_notes (user_id, lesson_id, timestamp_seconds);
```

#### C. Bookmarks within video
- "Bookmark this moment" button in the player. Adds a marker on the timeline.
- Markers visible on the progress bar (small dots).
- List of bookmarks below the player.

```sql
create table lesson_bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  timestamp_seconds numeric not null,
  label text,
  created_at timestamptz default now()
);
```

#### D. Transcript download
- From the VTT, generate a clean `.txt` (or `.pdf` via @react-pdf/renderer) transcript per lesson, per language.
- Available from the lesson page when student has access.

#### E. Free trailer per course
- One lesson per course can be marked `is_trailer = true`.
- Trailer plays on the course detail page **without signup or payment** (use signed URL with longer TTL — 1 hour — and CORS gate to the course detail page only).
- Trailer button is prominent: large "▶ Watch trailer" CTA in the hero.

#### F. last_position_seconds field
```sql
alter table lesson_progress
  add column last_position_seconds numeric default 0;
```

### 3.19 Course detail page — conversion polish

The course detail page is where the sale happens. Treat it like a landing page.

- **Hero**: course title, subtitle, cover (or trailer poster), rating stars + count, "X students enrolled" counter, level badge, total duration. Big "▶ Watch trailer" CTA if trailer exists.
- **Sticky buy box** on the right (desktop), bottom on mobile. Sticks on scroll. Contains: price (with currency conversion hint), discount code field, "Buy with PayPal" button, lifetime access badge, money-back badge (if enabled), "Includes" checklist.
- **"What you'll learn"** grid: 6-8 bullet points pulled from `courses.learning_outcomes text[]`.
- **"This course includes"** checklist: `Y hours of on-demand video`, `Z downloadable resources`, `Subtitles in English & Spanish`, `Lifetime access`, `Certificate of completion`, `Access on mobile, tablet, and TV` (if applicable).
- **Curriculum tree** with module/lesson durations. Free-preview and trailer lessons are clickable from the public page.
- **Instructor card** (Anto): photo, name, bio, total students, average rating. Pull from a settings JSON until a richer instructor profile is built.
- **Reviews section**: avg rating, distribution, top reviews, load more.
- **"Frequently bought together"** (when ≥2 published courses): show 2-3 related courses.
- **FAQ accordion**: 5-8 common Qs (lifetime access? refunds? subtitles? mobile? what level?).
- **"Last updated"** date (`courses.updated_at` or latest lesson update — whichever later).
- **Money-back guarantee** badge (if enabled) — link to refund policy.
- **Trust strip near bottom**: "✓ Secure checkout via PayPal · ✓ Lifetime access · ✓ Money-back guarantee · ✓ Real human teacher".

#### DB
```sql
alter table courses
  add column learning_outcomes text[],
  add column money_back_days int default 14,
  add column money_back_enabled boolean default true;
```

### 3.20 Discovery — search + tags + filters

#### Tags / categories
```sql
create table tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  display_order int default 0
);

create table course_tags (
  course_id uuid references courses(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (course_id, tag_id)
);
```

Seed tags: `Beginner`, `Intermediate`, `Advanced`, `Pronunciation`, `Grammar`, `Conversation`, `Business Spanish`, `Travel Spanish`, `Culture`, `Subjunctive`, `Verbs`, `Vocabulary`.

#### Search
- Postgres `tsvector` full-text search across course title + subtitle + description + lesson titles + tags.
- `GET /api/search?q=...` → top 10 results with snippet.
- Header search bar (always visible on storefront).

#### Filter sidebar on `/ondemand`
- Filter by: tag(s), level, duration (≤1h / 1-3h / 3h+), price range, has-trailer.
- Sort: most popular (enrolment count) / newest / shortest / lowest price / highest rated.

### 3.21 Student onboarding (first-time experience)

On first dashboard visit (no `profiles.onboarded_at`), show a modal:

1. **"Welcome to Poncho Spanish, {name}!"** with Anto's photo.
2. **Set learning goal**: 5 min/day / 15 min/day / 30 min/day / Just exploring.
3. **Set reminder day & time** (optional): mon/wed/fri at 7pm, etc. → saved to `user_preferences.reminder_*`. (Reminder emails: defer to v2, but capture the preference now.)
4. **Quick tour**: 3 tooltips guiding through dashboard sections.
5. **"Start learning"** CTA → continues to dashboard.

Mark `profiles.onboarded_at = now()` after completion.

#### Dashboard polish
- **"Continue where you left off"** hero card with course thumbnail + lesson title + progress bar + Resume button. Top of page.
- **Progress rings** per enrolled course (% of lessons complete).
- **This week's activity**: minutes studied, lessons completed.
- **My resources** section: purchased standalone products.
- **My certificates** section.
- **Recommended next**: 2-3 published courses the student hasn't bought yet.

#### PWA shell (lightweight, no full offline)
- `manifest.json` with name, icons, theme color (mustard), background (cream).
- Service worker that caches the app shell + brand assets. Videos and dynamic data NOT cached (paid content control).
- Custom install prompt in dashboard ("Install Poncho on your phone").

### 3.22 Microinteractions / motion

- `framer-motion` (already in deps): page transitions, modal enter/exit, list reorder.
- **Confetti on course completion**: use `canvas-confetti` (add to deps). Trigger when 100% reached.
- **Skeleton loaders** for every data-heavy page (course list, dashboard, lesson player).
- **Smooth scroll** on anchor links.
- **Number counter animation** for "X students enrolled" on load.
- **Subtle hover lift** on course cards (translateY -2px + shadow).

### 3.23 Trust signals on `/` (homepage)

- **Hero**: existing copy + a "Watch Anto teach" thumbnail that plays a 60-second mashup trailer (set up later by Anto; placeholder for now linking to any trailer-marked lesson).
- **Real "X students enrolled, Y countries reached" counter** (compute from `enrollments` aggregated, fall back to "Hundreds of students" if <50).
- **Testimonial carousel** — pull top-rated public reviews. If <3 reviews exist, hide the section.
- **Press / featured-in row** — placeholder slot Anto can fill (logos array in admin settings).
- **"Made by a real teacher" badge** with Anto's photo + qualifications.

---

## 4. Database migrations — apply in order

1. `ondemand_001_mux_columns` — alter `lessons`, add `is_trailer`, `release_at`.
2. `ondemand_002_webhook_events`.
3. `ondemand_003_subtitles` — `lesson_subtitles`, `subtitle_cues`, `subtitle_cue_history`.
4. `ondemand_004_course_resources`.
5. `ondemand_005_digital_products` — `digital_products`, `digital_product_purchases`.
6. `ondemand_006_codes` — alter `access_codes`, create `discount_codes`, alter `payments`.
7. `ondemand_007_currency` — alter `courses` + `digital_products`.
8. `ondemand_008_reviews`.
9. `ondemand_009_certificates`.
10. `ondemand_010_emails` — `email_log`.
11. `ondemand_011_notes_bookmarks` — `lesson_notes`, `lesson_bookmarks`, alter `lesson_progress` add `last_position_seconds`.
12. `ondemand_012_tags` — `tags`, `course_tags`. Seed standard tags.
13. `ondemand_013_courses_meta` — alter `courses` add `learning_outcomes`, `money_back_*`.
14. `ondemand_014_user_prefs` — alter `profiles` add `onboarded_at`, create `user_preferences` (reminder day/time/freq).
15. `ondemand_015_buckets` — create buckets `course-resources`, `course-subtitles`, `digital-products` with private policies + RLS.

**RLS pattern** for every new table:
- `select`: public-readable (`is_published`/`is_visible`) OR user owns OR admin.
- `insert/update/delete`: admin-only via authenticated routes, OR users on own rows via server actions with service role.
- Mirror existing `access_codes` / `enrollments`.

---

## 5. API routes to add / modify

```
# Mux
app/api/mux/direct-upload/route.ts           POST  (admin) creates Mux upload
app/api/mux/webhook/route.ts                 POST  (HMAC-verified)
app/api/mux/playback-token/route.ts          GET   short-lived signed JWT

# Subtitles
app/api/admin/lessons/[id]/transcribe/route.ts  POST  re-trigger Whisper
app/api/admin/subtitles/cue/[cueId]/route.ts    PATCH update + regen VTT

# Codes
app/api/codes/validate/route.ts              POST  rate-limited

# PayPal (UPDATE existing)
app/api/paypal/create-order/route.ts         accept discountCode
app/api/paypal/capture-order/route.ts        store discount info + send email

# Digital products
app/api/products/purchase-free/route.ts      POST  free product (price=0)
app/api/admin/digital-products/route.ts      GET/POST
app/api/admin/digital-products/[id]/route.ts GET/PATCH/DELETE

# Reviews
app/api/reviews/route.ts                     GET/POST
app/api/admin/reviews/[id]/route.ts          PATCH (hide/pin)

# Certificates
app/api/certificates/[id]/route.ts           GET (serve PDF)
app/api/certificates/[id]/verify/route.ts    GET (public)

# Notes / bookmarks
app/api/lessons/[id]/notes/route.ts          GET/POST
app/api/lessons/[id]/notes/[noteId]/route.ts PATCH/DELETE
app/api/lessons/[id]/bookmarks/route.ts      GET/POST
app/api/lessons/[id]/bookmarks/[bookmarkId]/route.ts DELETE

# Progress
app/api/lessons/[id]/progress/route.ts       PATCH (save last_position_seconds, throttled)

# Search
app/api/search/route.ts                      GET (Postgres FTS)

# Onboarding
app/api/user/onboarding/route.ts             POST (set onboarded_at + preferences)

# Webhooks for emails (cart abandonment via cron — defer setup, just stub the route)
app/api/cron/abandoned-checkout/route.ts     POST (Vercel cron, optional)
```

Use Supabase Edge Functions for: Whisper transcription, PDF certificate generation.

---

## 6. Dependencies to add

```bash
pnpm add @mux/mux-node @mux/mux-player-react tus-js-client \
         @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities \
         openai next-intl \
         @react-email/components resend \
         @react-pdf/renderer \
         @sentry/nextjs posthog-js posthog-node \
         canvas-confetti react-markdown
```

---

## 7. Env vars (add to `.env.example`, document in `TODO_HUMAN.md`)

```
# Mux
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
MUX_WEBHOOK_SECRET=
MUX_SIGNING_KEY_ID=
MUX_SIGNING_KEY_PRIVATE=

# OpenAI
OPENAI_API_KEY=

# Email
RESEND_API_KEY=

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com

# Sentry
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=

# Optional
EXCHANGE_RATE_API_KEY=
```

`TODO_HUMAN.md` must have step-by-step links + screenshots-where-possible explaining how Manuel creates each.

---

## 8. Sub-agent decomposition (RUN IN PARALLEL)

Spawn in one message via the Task tool:

| Agent | Workstream | File ownership |
|---|---|---|
| `database-optimizer` | Migrations 001-015 + RLS + type gen + tag seed | `supabase/migrations/*`, `types/database.ts` |
| `backend-architect` (#1) | Mux integration + Whisper pipeline + signed JWTs | `app/api/mux/*`, `lib/mux/*`, `lib/transcription/*` |
| `backend-architect` (#2) | Codes + PayPal updates + rate limiting + search API | `app/api/codes/*`, `app/api/paypal/*`, `app/api/search/*`, `lib/ratelimit.ts` |
| `frontend-developer` (#1) | Admin UI: courses, curriculum DnD, subtitle editor, codes, products, reviews, settings, analytics | `app/(admin)/admin/*`, `components/admin/*` |
| `frontend-developer` (#2) | Storefront: route rename, course detail polish, dashboard, lesson player extensions, notes/bookmarks UI, search, tags, trust signals | `app/(marketing)/*`, `app/(app)/*`, `components/learn/*`, `components/marketing/*`, `components/player/*` |
| `backend-architect` (#3) | Emails (Resend + branded React Email) + observability (Sentry + PostHog) + i18n setup | `lib/emails/*`, `messages/*`, `sentry.*.config.ts`, `instrumentation.ts` |
| `legal-advisor` | Terms / Privacy / Refunds drafts | `app/(marketing)/legal/*` |
| `code-reviewer` | Final review pass | (read-only) |
| `security-auditor` | RLS, rate limits, webhook verification, secret handling, MFA gate | (read-only) |

Orchestrate via `team-lead`. Sync points: after migrations + types, after each major workstream completes.

---

## 9. Execution rules — NO QUESTIONS, NO PAUSING

1. **Don't ask Manuel anything.** Every decision is final. Log uncertainties in `DECISIONS.md`.
2. Missing secret/key → stub with `process.env.X ?? ""`, add to `TODO_HUMAN.md`, continue.
3. **One Supabase migration per logical area.**
4. **All new code is TypeScript strict** — no `any` unless commented why.
5. **Style consistency**: existing patterns in `components/learn/*` + `components/ui/*`. shadcn primitives.
6. **No regressions**: re-test free-code redeem, PayPal happy path, mark-complete, workbook viewer, contact form before declaring done.

---

## 10. Things you must NOT do

- Don't change visual design tokens.
- Don't replace PayPal / don't add Stripe.
- Don't host new video on Supabase Storage — Mux only.
- Don't substitute Whisper.
- Don't use regional language codes in Whisper (`en` / `es` only).
- Don't skip RLS.
- Don't commit `.env.local`.
- Don't run destructive migrations on existing tables. Additive only.
- Don't build anything in §3.17.
- Don't stop to ask. Push through with defaults.
- Don't translate the admin panel. English only.
- Don't add gamification (streaks, badges, leaderboards) — not premium for this brand.

---

## 11. Anto's first-session journey (the moment of truth)

She logs in fresh after Manuel hands her credentials. She must be able to:

1. Land on `/admin`, see 4-step onboarding.
2. Click "Connect Mux" → paste Mux credentials → see ✅.
3. Click "Create your first course" → 3-field wizard → course in draft.
4. Click "Upload first lesson" → name lesson → drag `.mov` → see progress bar → "Processing... generating subtitles".
5. Open subtitle editor → see auto EN + ES cues → fix one → save.
6. Add cover (or accept Mux auto-thumbnail).
7. Mark first lesson as **trailer** → see free preview enabled.
8. Publish course → visit public URL → confirm it looks premium.
9. Generate a free-access code for a friend.
10. Friend redeems → friend signs up → walks through onboarding modal → watches trailer → enrolls → completes course → gets certificate by email.
11. See sale arrive at `/admin/orders` (if friend paid).
12. See first review come in at `/admin/reviews`.

If ANY step requires Manuel's help, the build failed at "self-serve for Anto". Manually verify all 12 before declaring done.

---

## 12. Student journey (verify all)

1. Visitor lands on `/` → sees hero + "Watch Anto teach" trailer.
2. Clicks "Browse the Academy" → `/ondemand`.
3. Filters by "Beginner" tag → sees filtered list.
4. Clicks a course → sees premium detail page → watches trailer (no signup).
5. Clicks "Get lifetime access" → redirected to signup.
6. Signs up → goes through onboarding modal (goal + reminder) → lands on dashboard.
7. Goes back to course → applies discount code → sees discounted price → pays via PayPal → enrolled.
8. Watches lesson 1 → uses playback speed → bookmarks a moment → takes a note → marks complete.
9. Leaves tab → returns 30 min later → "Resume from 4:23?" prompt → continues.
10. Completes 30% → review CTA appears → submits 5-star review.
11. Completes 100% → confetti → certificate emailed + dashboard link.
12. Shares cert to LinkedIn.

---

## 13. Performance & quality baselines

- Lighthouse on `/`, `/ondemand`, course detail: **95+** on Performance, Accessibility, SEO, Best Practices.
- LCP < 2.0s, CLS < 0.05, INP < 200ms.
- Course list page: ISR with `revalidate: 60`.
- Course detail: on-demand revalidation when admin publishes/edits.
- `<Image>` from `next/image` for every image. No raw `<img>`.
- Suspense boundaries with skeleton loaders on every data-heavy page.
- Code-split admin route group (handled by App Router groups).
- WCAG 2.2 AA compliance verified on storefront + dashboard + player.

---

## 14. Files / docs to produce at repo root

- `TODO_HUMAN.md` — every secret/key needed + step-by-step setup links.
- `DECISIONS.md` — every judgment call made.
- `FUTURE.md` — §3.17 list, ready for v2.
- `BUILD_SUMMARY.md` — what got built (tables, routes, components, deps).

---

## 15. Acceptance criteria — ALL must pass

- [ ] `pnpm type-check` clean.
- [ ] `pnpm lint` clean.
- [ ] `pnpm dev` starts. These URLs return 200 (admin user):
  - `/`, `/ondemand`, `/ondemand/[slug]`, `/ondemand/recursos`, `/ondemand/recursos/[slug]`
  - `/learn/[slug]/[lessonSlug]` (with enrolment)
  - `/admin`, `/admin/courses`, `/admin/courses/new`, `/admin/courses/[id]`, `/admin/codes`, `/admin/digital-products`, `/admin/students`, `/admin/orders`, `/admin/reviews`, `/admin/settings`
  - `/legal/terms`, `/legal/privacy`, `/legal/refunds`
  - `/es/ondemand`
- [ ] `/courses` → 301 → `/ondemand`. `/courses/foo` → `/ondemand/foo`.
- [ ] Anto completes all 12 steps in §11 with zero developer help.
- [ ] Student completes all 12 steps in §12.
- [ ] Mux webhook verified, idempotent.
- [ ] Subtitle pipeline auto-generates, exposes editor, regens VTT on save.
- [ ] Resumable upload works — interrupt and resume.
- [ ] Notes panel saves and links to timestamps.
- [ ] Bookmarks appear on player timeline.
- [ ] Search returns relevant results.
- [ ] Tag filters work.
- [ ] Trailer plays without signup on course detail.
- [ ] Sticky buy box stays on scroll.
- [ ] Currency conversion hint appears for non-UK visitors.
- [ ] Confetti fires on course completion.
- [ ] Certificate PDF downloads cleanly.
- [ ] All new tables have RLS.
- [ ] Rate-limited endpoints reject 11+ req/min.
- [ ] MFA gate blocks non-MFA admin → redirect to setup.
- [ ] `TODO_HUMAN.md`, `DECISIONS.md`, `FUTURE.md`, `BUILD_SUMMARY.md` all exist.
- [ ] Sentry catches a deliberate test error.
- [ ] PostHog captures `course_detail_viewed`.
- [ ] Lighthouse ≥ 95 on storefront pages.

---

## 16. When done

Write a chat summary covering:
1. What was built (tables, routes, components, integrations, dependencies).
2. Sub-agents used and outputs.
3. `TODO_HUMAN.md` contents — what Manuel must provide (Mux keys, OpenAI, Resend domain verification, Sentry/PostHog project, etc.).
4. `DECISIONS.md` highlights.
5. End-to-end test instructions.
6. Known gotchas (e.g. "Anto must upgrade Mux to Pay-as-you-go before her 11th video — Mux returns an error and prompts for a card on the 11th upload; no surprise bill").

That's it. Build it.
