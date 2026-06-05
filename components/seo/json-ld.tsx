/**
 * Renders a JSON-LD <script> tag. Server-rendered so the structured data lands
 * in the initial HTML (readable by crawlers and AI answer engines without JS).
 *
 * This is the framework-standard Next.js pattern for JSON-LD. It is safe here:
 *   1. `data` is always built server-side from our own config / database rows —
 *      never from raw user input.
 *   2. We escape the `<` character to its < unicode escape, which makes it
 *      impossible to break out of the <script> element (the only XSS vector for
 *      JSON embedded in a script tag).
 * React HTML-escapes string *children* of <script>, which would corrupt the
 * JSON, so `dangerouslySetInnerHTML` is the correct (and only reliable) option.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}