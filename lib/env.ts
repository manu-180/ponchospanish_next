/**
 * Centralised env access. Keep server-only secrets isolated so we never leak
 * them to the client bundle. Throws early when a required variable is missing
 * in production; soft-warns in dev so the project still boots while wiring
 * secrets.
 *
 * Public (browser) vars live as plain string fields. Server-only secrets are
 * exposed via getters that throw on access if missing in production — this
 * way they're checked LAZILY, only when a route that actually needs them
 * runs.
 */

const isServer = typeof window === "undefined";
const isProd = process.env.NODE_ENV === "production";

function required(name: string, value: string | undefined): string {
  if (!value || value.length === 0) {
    if (isProd) {
      throw new Error(`Missing required env var: ${name}`);
    }
    if (isServer) {
      // eslint-disable-next-line no-console
      console.warn(`[env] Missing ${name} — using placeholder for development.`);
    }
    return "";
  }
  return value;
}

function optional(value: string | undefined, fallback = ""): string {
  return value && value.length > 0 ? value : fallback;
}

export const env = {
  // ---------------- Public (safe to expose) ----------------
  NEXT_PUBLIC_SUPABASE_URL:
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key",
  NEXT_PUBLIC_PAYPAL_CLIENT_ID:
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "test",
  NEXT_PUBLIC_SITE_URL:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ponchospanish.com",

  // Analytics & monitoring (public)
  NEXT_PUBLIC_POSTHOG_KEY: optional(process.env.NEXT_PUBLIC_POSTHOG_KEY),
  NEXT_PUBLIC_POSTHOG_HOST:
    process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",
  NEXT_PUBLIC_SENTRY_DSN: optional(process.env.NEXT_PUBLIC_SENTRY_DSN),

  // ---------------- Static server-only (safe defaults) ------
  PAYPAL_ENVIRONMENT: (process.env.PAYPAL_ENVIRONMENT ?? "sandbox") as
    | "sandbox"
    | "production",
  PAYPAL_WEBHOOK_ID: optional(process.env.PAYPAL_WEBHOOK_ID),
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL ?? "ponchospanish@gmail.com",
  RESEND_FROM_EMAIL:
    process.env.RESEND_FROM_EMAIL ?? "Anto <hello@ponchospanish.com>",
  RESEND_REPLY_TO:
    process.env.RESEND_REPLY_TO ?? "hello@ponchospanish.com",
  SENTRY_ORG: optional(process.env.SENTRY_ORG),
  SENTRY_PROJECT: optional(process.env.SENTRY_PROJECT, "poncho-next"),

  // ---------------- Lazy server-only secrets ----------------
  // Supabase
  get SUPABASE_SERVICE_ROLE_KEY() {
    return required("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY);
  },

  // PayPal
  get PAYPAL_CLIENT_SECRET() {
    return required("PAYPAL_CLIENT_SECRET", process.env.PAYPAL_CLIENT_SECRET);
  },

  // Mux
  get MUX_TOKEN_ID() {
    return required("MUX_TOKEN_ID", process.env.MUX_TOKEN_ID);
  },
  get MUX_TOKEN_SECRET() {
    return required("MUX_TOKEN_SECRET", process.env.MUX_TOKEN_SECRET);
  },
  get MUX_WEBHOOK_SECRET() {
    return required("MUX_WEBHOOK_SECRET", process.env.MUX_WEBHOOK_SECRET);
  },
  get MUX_SIGNING_KEY_ID() {
    return required("MUX_SIGNING_KEY_ID", process.env.MUX_SIGNING_KEY_ID);
  },
  get MUX_SIGNING_KEY_PRIVATE() {
    return required("MUX_SIGNING_KEY_PRIVATE", process.env.MUX_SIGNING_KEY_PRIVATE);
  },

  // OpenAI (Whisper)
  get OPENAI_API_KEY() {
    return required("OPENAI_API_KEY", process.env.OPENAI_API_KEY);
  },

  // Resend (email)
  get RESEND_API_KEY() {
    return required("RESEND_API_KEY", process.env.RESEND_API_KEY);
  },

  // Sentry server token (only needed at build for source maps)
  get SENTRY_AUTH_TOKEN() {
    return optional(process.env.SENTRY_AUTH_TOKEN);
  },
  get SENTRY_DSN() {
    return optional(process.env.SENTRY_DSN);
  },

  // Optional
  get EXCHANGE_RATE_API_KEY() {
    return optional(process.env.EXCHANGE_RATE_API_KEY);
  },
};

/**
 * Feature flags derived from env presence. Use these to gracefully degrade
 * UI when a secret isn't configured yet (e.g. hide subtitle editor button
 * until OPENAI_API_KEY is set).
 */
const PAYPAL_PLACEHOLDERS = new Set([
  "",
  "test",
  "your-paypal-client-id",
  "your_paypal_client_id",
]);

export const features = {
  mux: Boolean(process.env.MUX_TOKEN_ID && process.env.MUX_TOKEN_SECRET),
  whisper: Boolean(process.env.OPENAI_API_KEY),
  resend: Boolean(process.env.RESEND_API_KEY),
  posthog: Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY),
  sentry: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  /** True only when a real PayPal client ID is configured (not a placeholder). */
  paypal: Boolean(
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID &&
      !PAYPAL_PLACEHOLDERS.has(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID),
  ),
};
