/**
 * Mux signed playback URLs.
 *
 * Every paywall-gated lesson plays through a JWT-signed playback URL
 * with a short TTL (15 min). The client refreshes the token before
 * expiry via /api/mux/playback-token.
 */

import jwt from "jsonwebtoken";
import { env } from "@/lib/env";

const DEFAULT_TTL_SECONDS = 2 * 60 * 60; // 2 hours — covers a full lesson without a
                                          // mid-playback refresh, and slashes calls
                                          // to /api/mux/playback-token (fewer
                                          // serverless invocations). Token is still
                                          // bound to the user + playback ID.
const TRAILER_TTL_SECONDS = 60 * 60; // 1 hour (trailers play unauthenticated)

export type MuxTokenAudience =
  | "video"   // playback URL → aud "v"
  | "thumbnail" // → aud "t"
  | "gif"     // → aud "g"
  | "storyboard"; // → aud "s"

/**
 * Mux expects single-letter audience codes in the JWT `aud` claim, not the
 * friendly names. Using "thumbnail" instead of "t" makes Mux return
 * 403 "Not Authorized".
 */
const AUDIENCE_CODE: Record<MuxTokenAudience, "v" | "t" | "g" | "s"> = {
  video: "v",
  thumbnail: "t",
  gif: "g",
  storyboard: "s",
};

interface SignOptions {
  playbackId: string;
  audience?: MuxTokenAudience;
  ttlSeconds?: number;
  /**
   * @deprecated Mux requires `sub` to be the playback ID. To filter by user
   * in Mux Data, pass `viewer_user_id` via the player's `metadata` prop
   * instead.
   */
  subject?: string;
}

/**
 * Sign a Mux playback token. Returns the JWT.
 *
 * Mux REQUIRES the `sub` claim to match the playback ID — otherwise the
 * player errors with "Video URL is formatted incorrectly: The video's
 * playback ID does not match the one encoded in the playback-token."
 */
export function signMuxPlaybackToken({
  playbackId,
  audience = "video",
  ttlSeconds = DEFAULT_TTL_SECONDS,
}: SignOptions): string {
  const privateKey = Buffer.from(env.MUX_SIGNING_KEY_PRIVATE, "base64").toString(
    "utf-8",
  );

  return jwt.sign(
    {
      sub: playbackId,
      aud: AUDIENCE_CODE[audience],
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
 * Build a signed static MP4 URL. Static renditions are served under the
 * "video" audience (aud "v"), so a signed-policy asset returns 403 on the
 * bare URL.
 *
 * Used as a LEGACY fallback for the Whisper pipeline: assets created before
 * the `audio-only` switch only have low/medium/high MP4 renditions.
 *
 * Default TTL is 1h — long enough for a transcription job to fetch the bytes.
 */
export function buildSignedStaticMp4Url(
  playbackId: string,
  quality: "low" | "medium" | "high" = "low",
  ttlSeconds = 60 * 60,
): string {
  const token = signMuxPlaybackToken({
    playbackId,
    audience: "video",
    ttlSeconds,
  });
  return `https://stream.mux.com/${playbackId}/${quality}.mp4?token=${token}`;
}

/**
 * Build a signed audio-only rendition URL (`audio.m4a`). This is the PREFERRED
 * source for Whisper: it's audio-only (no video bytes to download or store)
 * and always well under the 25 MB limit. Produced by `mp4_support: "audio-only"`.
 *
 * Served under the "video" audience (aud "v"), same as other static renditions.
 */
export function buildSignedAudioUrl(
  playbackId: string,
  ttlSeconds = 60 * 60,
): string {
  const token = signMuxPlaybackToken({
    playbackId,
    audience: "video",
    ttlSeconds,
  });
  return `https://stream.mux.com/${playbackId}/audio.m4a?token=${token}`;
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
