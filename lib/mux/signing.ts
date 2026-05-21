/**
 * Mux signed playback URLs.
 *
 * Every paywall-gated lesson plays through a JWT-signed playback URL
 * with a short TTL (15 min). The client refreshes the token before
 * expiry via /api/mux/playback-token.
 */

import jwt from "jsonwebtoken";
import { env } from "@/lib/env";

const DEFAULT_TTL_SECONDS = 15 * 60; // 15 minutes
const TRAILER_TTL_SECONDS = 60 * 60; // 1 hour (trailers play unauthenticated)

export type MuxTokenAudience =
  | "video"   // playback URL
  | "thumbnail"
  | "gif"
  | "storyboard";

interface SignOptions {
  playbackId: string;
  audience?: MuxTokenAudience;
  ttlSeconds?: number;
  /**
   * Optional opaque user context. Mux echoes back in analytics so we can
   * filter by user. Do NOT put PII here.
   */
  subject?: string;
}

/**
 * Sign a Mux playback token. Returns the JWT.
 */
export function signMuxPlaybackToken({
  playbackId,
  audience = "video",
  ttlSeconds = DEFAULT_TTL_SECONDS,
  subject,
}: SignOptions): string {
  const privateKey = Buffer.from(env.MUX_SIGNING_KEY_PRIVATE, "base64").toString(
    "utf-8",
  );

  return jwt.sign(
    {
      sub: subject ?? playbackId,
      aud: audience,
      exp: Math.floor(Date.now() / 1000) + ttlSeconds,
      kid: env.MUX_SIGNING_KEY_ID,
    },
    privateKey,
    { algorithm: "RS256" },
  );
}

/**
 * Build a full signed playback URL (HLS .m3u8).
 */
export function buildSignedPlaybackUrl(
  playbackId: string,
  options: Omit<SignOptions, "playbackId" | "audience"> = {},
): { url: string; expiresAt: number } {
  const ttl = options.ttlSeconds ?? DEFAULT_TTL_SECONDS;
  const token = signMuxPlaybackToken({
    playbackId,
    audience: "video",
    ttlSeconds: ttl,
    subject: options.subject,
  });
  return {
    url: `https://stream.mux.com/${playbackId}.m3u8?token=${token}`,
    expiresAt: Date.now() + ttl * 1000,
  };
}

/**
 * Build a signed thumbnail URL (used for protected previews).
 */
export function buildSignedThumbnailUrl(
  playbackId: string,
  timeSeconds = 5,
  ttlSeconds = DEFAULT_TTL_SECONDS,
): string {
  const token = signMuxPlaybackToken({
    playbackId,
    audience: "thumbnail",
    ttlSeconds,
  });
  return `https://image.mux.com/${playbackId}/thumbnail.jpg?time=${timeSeconds}&token=${token}`;
}

export { DEFAULT_TTL_SECONDS, TRAILER_TTL_SECONDS };
