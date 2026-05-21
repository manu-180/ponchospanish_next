# TODO — keys & accounts only Manuel can provide

This file lists every secret / external account that the on-demand Academy
needs but **the AI build couldn't create itself**. Work through it top to
bottom and paste each value into `.env.local`.

> Anything not marked **REQUIRED for launch** is optional and degrades
> gracefully (the app boots without it, feature is hidden / disabled).

---

## 1. Supabase service role key — **REQUIRED for launch**

The project itself is already provisioned (`poncho spanish`, ref
`wdpgkhghigaowtdtjztz`) and the schema is applied. You only need the
service-role key.

1. Open https://supabase.com/dashboard/project/wdpgkhghigaowtdtjztz/settings/api-keys
2. Under **service_role** click "Reveal" → copy the JWT.
3. Paste into `.env.local`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```
4. Never paste this into client code. It bypasses RLS.

---

## 2. PayPal — **REQUIRED for launch (paid checkout)**

The repo already has PayPal scaffolding but with placeholder values.

1. https://developer.paypal.com → log in (use Anto's PayPal Business account).
2. **Apps & Credentials** → toggle to **Sandbox** for testing.
3. **Create App** → name it "Poncho Academy". Get:
   - `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
4. **Webhooks** (sidebar) → Add webhook → URL = `https://YOUR_DOMAIN/api/paypal/capture-order`
   → events: `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.REFUNDED`.
   Copy the webhook ID → `PAYPAL_WEBHOOK_ID`.
5. For production, repeat steps 3-4 in **Live** mode and set
   `PAYPAL_ENVIRONMENT=production`.

---

## 3. Mux — **REQUIRED for launch (video hosting)**

Mux hosts every lesson video, generates thumbnails, and signs playback URLs
so non-enrolled users can't hotlink.

### Why Mux (recap of the decision)
- **Free tier**: up to 10 videos, no card required → perfect for Anto's
  first launch.
- **After 10**: must upgrade to **Pay-as-you-go**. We're talking ~$5/month
  for a tiny academy.
- **Without upgrading**: the 11th upload returns an error in the admin
  panel. No surprise bill ever.

### Steps

1. https://dashboard.mux.com → sign up (no card needed for free tier).
2. **Settings → Access Tokens → Generate new token**:
   - Permissions: **Mux Video — Full Access**, **Mux Data — Read**
   - Name: "Poncho production server"
   - Copy `MUX_TOKEN_ID` + `MUX_TOKEN_SECRET`
3. **Settings → Signing Keys → Create new key** (for signed playback URLs):
   - Copy the **Key ID** → `MUX_SIGNING_KEY_ID`
   - Copy the **Private Key** (base64) → `MUX_SIGNING_KEY_PRIVATE`
4. **Settings → Webhooks → Add a new webhook**:
   - URL: `https://YOUR_DOMAIN/api/mux/webhook`
   - Sign with: generate a secret → `MUX_WEBHOOK_SECRET`
   - Events: leave "All events" checked
5. When Anto is about to upload her 11th video, the admin panel will
   prompt her with a Mux upgrade link. She follows it once and is done.

---

## 4. OpenAI (Whisper transcription) — **REQUIRED for launch (subtitles)**

Used to auto-generate EN + ES subtitles when Mux finishes processing a video.

1. https://platform.openai.com/api-keys → "Create new secret key"
2. Name: "Poncho subtitles". Copy → `OPENAI_API_KEY`.
3. Make sure billing is set up (Whisper is ~$0.006 / minute of audio).
   For Anto's volume that's pennies per course.

---

## 5. Resend (transactional email) — **REQUIRED for launch (purchase emails)**

1. https://resend.com → sign up.
2. **Domains → Add Domain** → `ponchospanish.com`.
   - Add the DNS records they show you (SPF, DKIM, DMARC).
   - Wait for verification (usually <1 hr).
3. **API Keys → Create API Key**:
   - Name: "Poncho production"
   - Permission: **Full access**
   - Copy → `RESEND_API_KEY`
4. Keep `RESEND_FROM_EMAIL=Anto <hello@ponchospanish.com>` as-is, or change
   the friendly name if Anto prefers something else.

---

## 6. PostHog (analytics) — optional but recommended

Tracks what students actually do (which lessons they finish, drop-off
points, etc.). Free tier handles >1M events/month — more than enough.

1. https://eu.posthog.com/signup (use **EU** region for GDPR).
2. Create project "Poncho".
3. **Project Settings → Project API Key** → copy → `NEXT_PUBLIC_POSTHOG_KEY`.
4. Leave `NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com`.

---

## 7. Sentry (error tracking) — optional but recommended

Catches client + server errors in production with stack traces.

1. https://sentry.io → sign up (free tier = 5k events/month).
2. Create project → **Next.js** → name "poncho-next".
3. Copy the DSN → BOTH `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN` (same value).
4. **Settings → Auth Tokens → Create New Token**:
   - Scopes: `project:releases`, `org:read`
   - Copy → `SENTRY_AUTH_TOKEN` (used at build time for source maps).
5. Copy your org slug into `SENTRY_ORG`.

---

## 8. ExchangeRate API — optional (currency hint on storefront)

Shows non-UK visitors an approximate price in their currency next to the
GBP price. Falls back to GBP-only display if missing.

1. https://www.exchangerate-api.com → free tier (1,500 req/month, plenty
   since we cache 24h).
2. Copy your API key → `EXCHANGE_RATE_API_KEY`.

---

## Verification checklist

After pasting everything into `.env.local`:

```bash
pnpm dev
```

- [ ] Homepage loads at http://localhost:3000
- [ ] /ondemand loads (empty state OK)
- [ ] /admin redirects to login if not signed in
- [ ] After signup, you land on dashboard with onboarding modal
- [ ] Manually flip your profile row to `role='admin'` in Supabase
  → SQL editor: `update public.profiles set role='admin' where email='YOUR_EMAIL'`
- [ ] /admin now works — try creating a course
- [ ] Try uploading a video (requires Mux keys)
- [ ] Try paying with PayPal sandbox card → enrolment created

---

## Promoting yourself to admin (one-time)

The first user signs up as a regular `student`. To get admin access:

1. Sign up at http://localhost:3000/auth/signup with your real email.
2. Open https://supabase.com/dashboard/project/wdpgkhghigaowtdtjztz/sql/new
3. Run:
   ```sql
   update public.profiles set role = 'admin' where email = 'YOUR_EMAIL';
   ```
4. Refresh the dashboard. The Admin nav appears.

Do the same for Anto's email when she's ready.
