/**
 * Transactional email service (Resend).
 *
 * All emails:
 *  - Go through this single module (never call Resend directly elsewhere)
 *  - Get logged to `public.email_log` for audit
 *  - Have typed `kind` so we can route different templates cleanly
 *  - Fail soft in dev (log instead of throw if RESEND_API_KEY missing)
 *
 * Templates live in `lib/emails/templates/*.tsx` and use React Email
 * (`@react-email/components`). Render to HTML server-side.
 */

import { Resend } from "resend";
import { env, features } from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (_resend) return _resend;
  _resend = new Resend(env.RESEND_API_KEY);
  return _resend;
}

export type EmailKind =
  | "welcome"
  | "purchase_confirmation"
  | "sale_notification" // → Anto
  | "free_code_welcome"
  | "free_enrolment_welcome"
  | "course_completed"
  | "discount_code_created" // → Anto
  | "refund_notice"
  | "abandoned_checkout_1h"
  | "abandoned_checkout_24h"
  | "subtitle_review_ready" // → Anto
  | "test"; // dev / smoke test

export interface SendEmailParams {
  kind: EmailKind;
  to: string;
  toUserId?: string | null;
  subject: string;
  html: string;
  text?: string;
  /** Override the global FROM for this one email (e.g. for system notices). */
  from?: string;
  replyTo?: string;
  /** Any structured data we want kept in the audit log. */
  meta?: Record<string, unknown>;
}

export interface SendEmailResult {
  ok: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send a transactional email. Logs every attempt (success or failure) to
 * `public.email_log`. Returns `ok: false` instead of throwing so callers
 * can decide whether email failures should bubble up.
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const {
    kind,
    to,
    toUserId = null,
    subject,
    html,
    text,
    from = env.RESEND_FROM_EMAIL,
    replyTo = env.RESEND_REPLY_TO,
    meta,
  } = params;

  // Dev: no API key → log & succeed (so flows that send emails still work)
  if (!features.resend) {
    // eslint-disable-next-line no-console
    console.warn(`[email] RESEND_API_KEY missing — would have sent "${kind}" to ${to}`);
    await logEmail({ ...params, status: "failed", error: "missing_api_key" });
    return { ok: false, error: "missing_api_key" };
  }

  try {
    const result = await getResend().emails.send({
      from,
      to,
      subject,
      html,
      text,
      replyTo,
      headers: {
        "X-Poncho-Template": kind,
      },
    });

    if (result.error) {
      await logEmail({
        ...params,
        status: "failed",
        error: result.error.message,
      });
      return { ok: false, error: result.error.message };
    }

    await logEmail({
      ...params,
      status: "sent",
      providerMessageId: result.data?.id,
    });
    return { ok: true, messageId: result.data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await logEmail({ ...params, status: "failed", error: message });
    // eslint-disable-next-line no-console
    console.error(`[email] send failed for ${kind} → ${to}:`, message);
    return { ok: false, error: message };
  }
}

interface LogEmailArgs extends SendEmailParams {
  status: "sent" | "delivered" | "bounced" | "complained" | "failed";
  providerMessageId?: string;
  error?: string;
}

async function logEmail(args: LogEmailArgs): Promise<void> {
  try {
    const admin = getSupabaseAdminClient();
    await admin.from("email_log").insert({
      to_email: args.to,
      to_user_id: args.toUserId ?? null,
      template: args.kind,
      subject: args.subject,
      status: args.status,
      provider_message_id: args.providerMessageId ?? null,
      payload: (args.meta ?? null) as Json | null,
      error: args.error ?? null,
    });
  } catch (err) {
    // Don't let log failures break the email pipeline.
    // eslint-disable-next-line no-console
    console.warn("[email] failed to write email_log:", err);
  }
}
