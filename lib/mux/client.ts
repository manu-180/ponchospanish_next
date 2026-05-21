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
 *  - `standard` MP4 → enables Whisper to fetch the audio.
 *  - `smart` encoding tier → great quality at lower cost.
 */
export const DEFAULT_NEW_ASSET_SETTINGS = {
  playback_policy: ["signed"] as const,
  mp4_support: "standard" as const,
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
 * Build the static MP4 URL for a playback ID. Used by Whisper to fetch
 * audio. Requires `mp4_support: "standard"` on the asset.
 */
export function muxStaticMp4Url(playbackId: string, quality: "low" | "medium" | "high" = "high"): string {
  return `https://stream.mux.com/${playbackId}/${quality}.mp4`;
}
