/**
 * Mux SDK client (server-only).
 *
 * Mux usage in Poncho:
 *  - Direct Uploads for resumable lesson video uploads (tus.io protocol).
 *  - Signed playback URLs for paywall-gated lessons.
 *  - Webhook `video.asset.ready` triggers the Whisper subtitle pipeline.
 *  - Static MP4 fallback so Whisper can fetch the audio source by URL.
 *
 * NEVER import this file from a client component.
 */

import Mux from "@mux/mux-node";
import { env } from "@/lib/env";

let _mux: Mux | null = null;

/**
 * Lazy Mux singleton. Throws if credentials are missing in production;
 * returns a non-throwing placeholder in dev so the app boots.
 */
export function getMux(): Mux {
  if (_mux) return _mux;
  _mux = new Mux({
    tokenId: env.MUX_TOKEN_ID,
    tokenSecret: env.MUX_TOKEN_SECRET,
  });
  return _mux;
}

/**
 * Standard settings applied to every new asset created via Direct Upload.
 *  - `signed` playback policy → URLs require JWT signed with our key.
 *  - `audio-only` MP4 → Mux produces a single tiny `audio.m4a` rendition
 *    (instead of the old "standard" low/medium/high trio that cost storage
 *    forever). It's all Whisper needs and always stays under the 25 MB limit.
 *  - `smart` encoding tier → great quality at lower cost.
 *  - `max_resolution_tier: "1080p"` is Mux's MINIMUM cap (720p isn't a valid
 *    encode tier). Delivery cost is capped separately on the player via
 *    `maxResolution="720p"` — that's the lever that actually lowers the
 *    per-minute-delivered bill.
 */
export const DEFAULT_NEW_ASSET_SETTINGS = {
  playback_policy: ["signed"] as const,
  mp4_support: "audio-only" as const,
  max_resolution_tier: "1080p" as const,
  encoding_tier: "smart" as const,
};

/**
 * Build the canonical thumbnail URL for a playback ID.
 * `time` is in seconds (default 5s into the video to skip black frames).
 */
export function muxThumbnailUrl(playbackId: string, timeSeconds = 5): string {
  return `https://image.mux.com/${playbackId}/thumbnail.jpg?time=${timeSeconds}&width=1280&fit_mode=preserve`;
}

/**
 * Build an animated GIF preview URL (handy for hover-thumbnails).
 */
export function muxGifPreviewUrl(playbackId: string): string {
  return `https://image.mux.com/${playbackId}/animated.gif?width=480`;
}

/**
 * Build the static MP4 URL for a playback ID (legacy assets only — new assets
 * use `mp4_support: "audio-only"` and expose `audio.m4a`, see `muxAudioUrl`).
 */
export function muxStaticMp4Url(playbackId: string, quality: "low" | "medium" | "high" = "high"): string {
  return `https://stream.mux.com/${playbackId}/${quality}.mp4`;
}

/**
 * Build the audio-only static rendition URL (`audio.m4a`). This is what
 * `mp4_support: "audio-only"` produces and what Whisper now fetches — tiny,
 * audio-only, and never anywhere near the 25 MB transcription limit.
 */
export function muxAudioUrl(playbackId: string): string {
  return `https://stream.mux.com/${playbackId}/audio.m4a`;
}
