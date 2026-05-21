/**
 * Mux webhook signature verification.
 *
 * Mux signs every webhook with HMAC-SHA256 using your webhook secret.
 * The signature is sent in the `mux-signature` header as `t=...,v1=...`.
 *
 * We verify the signature server-side BEFORE acting on the payload.
 * Combined with the (provider, event_id) idempotency table, this gives us
 * both authenticity and exactly-once processing.
 */

import crypto from "crypto";
import { env } from "@/lib/env";

const SIGNATURE_TOLERANCE_SECONDS = 5 * 60; // accept up to 5 min skew

export interface MuxWebhookVerification {
  ok: boolean;
  reason?: string;
  timestamp?: number;
}

/**
 * Verify a Mux webhook signature.
 *
 * @param rawBody - the request body as a string (not parsed JSON)
 * @param signatureHeader - the `mux-signature` header value
 */
export function verifyMuxSignature(
  rawBody: string,
  signatureHeader: string | null | undefined,
): MuxWebhookVerification {
  if (!signatureHeader) return { ok: false, reason: "missing_signature" };

  const parts = signatureHeader.split(",").reduce<Record<string, string>>(
    (acc, part) => {
      const [k, v] = part.split("=");
      if (k && v) acc[k.trim()] = v.trim();
      return acc;
    },
    {},
  );

  const timestamp = Number(parts.t);
  const v1 = parts.v1;
  if (!timestamp || !v1) return { ok: false, reason: "malformed_signature" };

  // Reject if the timestamp is too old (replay attack mitigation)
  const skewSeconds = Math.abs(Date.now() / 1000 - timestamp);
  if (skewSeconds > SIGNATURE_TOLERANCE_SECONDS) {
    return { ok: false, reason: "stale_signature", timestamp };
  }

  const expected = crypto
    .createHmac("sha256", env.MUX_WEBHOOK_SECRET)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  const valid = crypto.timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(v1, "hex"),
  );
  if (!valid) return { ok: false, reason: "invalid_signature", timestamp };
  return { ok: true, timestamp };
}
