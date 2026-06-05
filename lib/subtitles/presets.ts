/**
 * Subtitle design presets.
 *
 * The student player and the admin editor both render captions with a custom
 * overlay (native ::cue styling is too limited / inconsistent across
 * browsers), so each preset is just a set of CSS tokens applied to the caption
 * "bubble".
 *
 * Sizing: `fontScale` is a fraction of the player's width, applied via CSS
 * container query units (`cqi`) by the overlay. Everything else inside
 * `bubble` uses `em` units so padding / radius / outline scale with the font —
 * captions then look correct at any player size.
 *
 * Background presets use `box-decoration-break: clone` so that when text
 * wraps across multiple lines each line gets its own tight background pill
 * (Netflix / Apple TV style) rather than one massive block.
 */

import type { CSSProperties } from "react";

export interface CaptionPreset {
  id: string;
  /** Spanish label shown to Anto in the picker. */
  label: string;
  /** One-line description for the picker. */
  description: string;
  /** Caption font size as a fraction of the player width (via `cqi`). */
  fontScale: number;
  /** Vertical placement of the caption. */
  position: "bottom" | "top";
  /** Inline styles for the text bubble (NOT fontSize — that is computed). */
  bubble: CSSProperties;
}

const SANS = "var(--font-montserrat), ui-sans-serif, system-ui, sans-serif";
const SERIF = "var(--font-baskerville), Georgia, serif";

/** Shared properties for presets that use per-line background highlights. */
const PER_LINE_BG: CSSProperties = {
  WebkitBoxDecorationBreak: "clone",
  boxDecorationBreak: "clone",
} as CSSProperties;

export const CAPTION_PRESETS: CaptionPreset[] = [
  {
    id: "classic",
    label: "Clásico",
    description: "Blanco sobre fondo negro. El estándar, siempre legible.",
    fontScale: 0.034,
    position: "bottom",
    bubble: {
      ...PER_LINE_BG,
      fontFamily: SANS,
      color: "#FFFFFF",
      background: "rgba(0,0,0,0.78)",
      padding: "0.12em 0.45em",
      borderRadius: "0.2em",
      fontWeight: 600,
      lineHeight: 1.35,
    },
  },
  {
    id: "cinema",
    label: "Cine",
    description: "Texto blanco con sombra intensa, sin fondo. Estilo película.",
    fontScale: 0.04,
    position: "bottom",
    bubble: {
      fontFamily: SANS,
      color: "#FFFFFF",
      fontWeight: 700,
      lineHeight: 1.25,
      textShadow:
        "0 0.05em 0.18em rgba(0,0,0,1), 0 0.02em 0.06em rgba(0,0,0,0.95), 0 0 0.4em rgba(0,0,0,0.5)",
    },
  },
  {
    id: "outline",
    label: "Contorno",
    description: "Blanco con borde negro nítido. Se lee sobre cualquier fondo.",
    fontScale: 0.038,
    position: "bottom",
    bubble: {
      fontFamily: SANS,
      color: "#FFFFFF",
      fontWeight: 800,
      lineHeight: 1.25,
      WebkitTextStroke: "0.045em #111111",
      paintOrder: "stroke fill",
      textShadow: "0 0.04em 0.1em rgba(0,0,0,0.4)",
    } as CSSProperties,
  },
  {
    id: "mustard",
    label: "Poncho",
    description: "Resaltador mostaza por línea. Marca propia, muy legible.",
    fontScale: 0.034,
    position: "bottom",
    bubble: {
      ...PER_LINE_BG,
      fontFamily: SANS,
      color: "#1A1A1A",
      background: "#E8A84C",
      padding: "0.1em 0.5em",
      borderRadius: "0.22em",
      fontWeight: 700,
      lineHeight: 1.35,
      boxShadow: "0 0.1em 0.3em rgba(0,0,0,0.2)",
    },
  },
  {
    id: "kids",
    label: "Kids",
    description: "Grande y redondeado, crema sobre pastilla. Ideal para chicos.",
    fontScale: 0.044,
    position: "bottom",
    bubble: {
      ...PER_LINE_BG,
      fontFamily: SANS,
      color: "#FBFAF7",
      background: "rgba(25,25,25,0.88)",
      padding: "0.14em 0.6em",
      borderRadius: "999px",
      fontWeight: 800,
      lineHeight: 1.25,
      letterSpacing: "0.01em",
    },
  },
  {
    id: "card",
    label: "Tarjeta",
    description: "Texto oscuro sobre tarjeta crema. Elegante y editorial.",
    fontScale: 0.032,
    position: "bottom",
    bubble: {
      fontFamily: SERIF,
      color: "#1A1A1A",
      background: "rgba(251,250,247,0.92)",
      padding: "0.22em 0.8em 0.24em",
      borderRadius: "0.35em",
      fontWeight: 600,
      lineHeight: 1.4,
      boxShadow: "0 0.15em 0.5em rgba(0,0,0,0.22), 0 0 0 0.04em rgba(0,0,0,0.06)",
    },
  },
  {
    id: "highlight",
    label: "Amarillo",
    description: "Amarillo brillante con borde negro. Muy visible.",
    fontScale: 0.038,
    position: "bottom",
    bubble: {
      fontFamily: SANS,
      color: "#FFE34D",
      fontWeight: 800,
      lineHeight: 1.25,
      WebkitTextStroke: "0.04em #111111",
      paintOrder: "stroke fill",
      textShadow: "0 0.04em 0.12em rgba(0,0,0,0.6)",
    } as CSSProperties,
  },
  {
    id: "minimal",
    label: "Minimal",
    description: "Chico y limpio, sin fondo. Para no tapar el video.",
    fontScale: 0.028,
    position: "bottom",
    bubble: {
      fontFamily: SANS,
      color: "#FFFFFF",
      fontWeight: 600,
      lineHeight: 1.3,
      textShadow:
        "0 0.04em 0.1em rgba(0,0,0,0.9), 0 0.01em 0.04em rgba(0,0,0,0.7)",
    },
  },
];

export const DEFAULT_PRESET_ID = "classic";

export function getCaptionPreset(id: string | null | undefined): CaptionPreset {
  return (
    CAPTION_PRESETS.find((p) => p.id === id) ??
    CAPTION_PRESETS.find((p) => p.id === DEFAULT_PRESET_ID) ??
    CAPTION_PRESETS[0]
  );
}
