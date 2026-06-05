import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/config";

/**
 * Private areas that must never be indexed (auth-gated app, admin, APIs).
 * Everything else (marketing pages, the Academy catalogue) is crawlable.
 */
const disallow = [
  "/admin",
  "/api/",
  "/auth/",
  "/account",
  "/dashboard",
  "/learn",
];

/**
 * AI answer-engine crawlers. We allow these explicitly so Poncho Spanish can be
 * *cited* in ChatGPT, Perplexity, Google AI Overviews, Gemini, Claude and
 * Copilot answers — blocking them would remove the site from those results.
 */
const aiCrawlers = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "DuckDuckBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...aiCrawlers.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
