# Decisions log — on-demand Academy build

Every judgment call made during the autonomous build, with rationale.
Future-you (or another engineer) can challenge any of these — they're
written down so they're visible, not hidden.

---

## D1 — Supabase project: created brand-new, did not reuse the legacy ref

**Context**: The prompt named `zrzpmgyafuesmakkoysn` as the project ref,
but that ref turned out to belong to a completely different app (a
marketplace of "oficios" / professionals — tables like `jobs`, `leads`,
`professionals`, `products`, `disputes`, `loyalty`). The Poncho codebase
had a hand-written `types/database.ts` but no migrations had ever been
applied to that ref.

**Decision**: Create a new dedicated project `wdpgkhghigaowtdtjztz`
("poncho spanish") in a separate org so Poncho's schema can't collide
with the marketplace.

**Trade-off**: Manuel had to manually create the new project and paste
the service-role key into `.env.local` (one extra step). Worth it to
avoid mixing schemas / RLS rules / quotas.

---

## D2 — Storage buckets: kept `course-videos` even though Mux is primary

**Decision**: Provision `course-videos` bucket anyway (5 GB file cap)
even though all new uploads go through Mux.

**Rationale**: Legacy lessons reference `lessons.video_path` (Supabase
Storage). Keeping the bucket means old code paths keep working until
the legacy field is fully retired.

---

## D3 — Subtitle languages locked to `en` / `es` (ISO-639-1, no regional codes)

**Decision**: Whisper is called with `language: "en"` and `language: "es"`.
The UI labels them "English (UK)" / "Español (AR)" but the data
itself doesn't carry regional accent codes.

**Rationale**: Whisper handles accents transparently. Storing `en-GB`
vs `en-US` would be over-modeling — they're the same captions.

---

## D4 — Currency stored as `numeric(10,2)`, default GBP, conversion is display-only

**Decision**: All prices in DB are GBP. The currency conversion to USD /
AR$ / EUR happens client-side (or via geo header) for display purposes
only. PayPal always charges in GBP.

**Rationale**: Single source of truth, no FX risk, no accounting
nightmare. The visual hint is just for the buyer's psychology.

---

## D5 — Free-access codes and discount codes are SEPARATE tables

**Decision**: Two tables — `access_codes` (existing, free) and
`discount_codes` (new, percentage off). Both have `scope` enum so they
can point at a course, a digital product, or `any`.

**Rationale**: They have different semantics (one grants enrolment, the
other reduces price) and different validation paths. Forcing them into
one table would require lots of nullable fields and a `kind` discriminator
that always feels gross.

---

## D6 — Webhook idempotency via `(provider, event_id)` unique constraint

**Decision**: Every incoming webhook (Mux, PayPal) writes to
`public.webhook_events` BEFORE processing. If the unique constraint
fails, return 200 OK and skip.

**Rationale**: Mux and PayPal both retry on non-2xx, so duplicates are
guaranteed. Constraint-based idempotency is simpler than distributed
locks and handles the race.

---

## D7 — RLS: enrolment-gated reads via subqueries (not via roles)

**Decision**: Policies like `lessons_public_select_published` use
`exists (select 1 from courses c where c.is_published)` rather than
relying on Supabase Auth roles.

**Rationale**: We have one auth role (`authenticated`), and access is
data-driven (per-course enrolment, per-lesson preview flag). Encoding
that into Postgres roles would explode the role table.

---

## D8 — Admin moderation paths use service role, NOT direct RLS

**Decision**: Admin actions that touch sensitive tables (reviews
moderation, enrolment grants, refunds) go through server actions that
use the service-role client, with the admin role checked in app code.

**Rationale**: RLS policies that check `role='admin'` work, but
combining them with complex business logic in the same query gets
unwieldy. App-layer authorization keeps the SQL simple and readable.

---

## D9 — Drip release & trailer flag live on `lessons`, not new tables

**Decision**: `lessons.release_at` (nullable timestamptz) for drip,
`lessons.is_trailer` (boolean) for the public trailer.

**Rationale**: Both are 0-or-1 attributes of a lesson, not separate
entities. Side tables would add joins for no semantic gain.

---

## D10 — Tags seeded automatically with 12 standard categories

**Decision**: Migration 0013 inserts the initial tag set
(Beginner, Intermediate, Advanced, Pronunciation, Grammar,
Conversation, Business Spanish, Travel Spanish, Culture, Subjunctive,
Verbs, Vocabulary).

**Rationale**: Anto shouldn't have to tag-engineer from a blank screen
on day one. Admin can edit / add later.

---

## D11 — `last_position_seconds` is on `lesson_progress`, not a new table

**Decision**: Add `last_position_seconds numeric default 0` to the
existing `lesson_progress` table.

**Rationale**: The "resume" position and the "completed" timestamp are
two facets of the same user-lesson relationship. Splitting them just
to keep `lesson_progress` "completed-only" would create FK joins for
every "where did I leave off?" query.

---

## D12 — `user_preferences` is one row per user (PK = user_id)

**Decision**: `user_preferences.user_id` is the PK with `references
profiles(id)`. One row per user, no `id` UUID.

**Rationale**: Each user has exactly one prefs blob. Saves an index
and lookup.

---

## D13 — `email_log` keeps the full payload as JSONB

**Decision**: Store the original Resend payload + final subject /
template in `email_log`. Never delete (kept forever for audit).

**Rationale**: Customer support disputes ("I never got that email")
need replay-able evidence. Storage cost is trivial.

---

## D14 — Course aggregates (`students_count`, `avg_rating`,
`ratings_count`) are denormalized columns

**Decision**: Added to `courses` table in migration 0014. Will be
maintained by triggers or by post-insert hooks in server code.

**Rationale**: Listing pages and SEO snippets need these on every
render. Computing on the fly with counts of enrolments / reviews would
N+1 across the storefront.

---

## D15 — Postgres functions kept minimal — most logic in server actions

**Decision**: Only two helper functions in the DB:
`public.handle_new_user()` (profile creation trigger) and
`public.set_updated_at()` (generic timestamp trigger). Everything
else runs in Next.js server code with the service-role client.

**Rationale**: Anto / Manuel can read TypeScript. Plpgsql is a
write-once-debug-forever language. Keep the DB simple, push logic to
the app.

---

## D16 — Storage policies: signed URLs are the public path

**Decision**: All buckets (except `course-covers`) deny anonymous
reads via RLS. Public access goes through server-created signed URLs
with short TTLs (1 hour for resources, 15 min for video playback).

**Rationale**: A leaked signed URL only works for an hour. Direct
bucket reads would let anyone with a path string download paid content
forever.
