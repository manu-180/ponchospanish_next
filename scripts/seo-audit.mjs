import { parseArgs } from "node:util";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const { values } = parseArgs({
  options: {
    base: { type: "string", default: "http://localhost:3000" },
    canonical: { type: "string", default: "https://www.ponchospanish.com" },
    output: { type: "string" },
  },
});
const base = new URL(values.base);
const canonicalOrigin = new URL(values.canonical).origin;
const failures = [];
const warnings = [];
const pages = [];
const cache = new Map();
const decode = (value = "") => value.replace(/&(?:amp|quot|apos|lt|gt|#39|#x27);/g, (entity) => ({
  "&amp;": "&", "&quot;": '"', "&apos;": "'", "&lt;": "<", "&gt;": ">", "&#39;": "'", "&#x27;": "'",
})[entity]);
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map((match) => [match[1].toLowerCase(), decode(match[2] ?? match[3])]));
const clean = (html) => decode(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
const documentOnly = (html) => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
const normal = (url) => new URL(url).href.replace(/\/$/, "");
const check = (condition, message) => { if (!condition) failures.push(message); };

async function read(path, redirect = "follow") {
  const key = `${redirect}:${path}`;
  if (cache.has(key)) return cache.get(key);
  const start = performance.now();
  const response = await fetch(new URL(path, base), { redirect, signal: AbortSignal.timeout(45000), headers: { "User-Agent": "PonchoSEOAudit/1.0" } });
  const html = await response.text();
  const result = { status: response.status, headers: response.headers, html, milliseconds: Math.round(performance.now() - start) };
  cache.set(key, result);
  return result;
}

try {
  const robots = await read("/robots.txt");
  check(robots.status === 200, `robots.txt returned ${robots.status}`);
  check(robots.html.includes(`${canonicalOrigin}/sitemap.xml`), "robots.txt must declare the canonical sitemap");
  check(!/^Disallow:\s*\/\s*$/im.test(robots.html), "robots.txt blocks the entire site");
  const sitemap = await read("/sitemap.xml");
  check(sitemap.status === 200, `sitemap.xml returned ${sitemap.status}`);
  const urls = [...sitemap.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decode(match[1]));
  check(urls.length > 0, "sitemap contains no URLs");
  check(new Set(urls).size === urls.length, "sitemap contains duplicate URLs");
  const seenTitles = new Map();
  const seenDescriptions = new Map();
  for (const url of urls) {
    const target = new URL(url);
    check(target.origin === canonicalOrigin, `${url}: incorrect sitemap origin`);
    check(!/^\/(admin|account|auth|dashboard|learn|api)(\/|$)/.test(target.pathname), `${url}: private URL in sitemap`);
    const result = await read(target.pathname);
    check(result.status === 200, `${target.pathname}: returned ${result.status}`);
    const html = documentOnly(result.html);
    const tags = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => attrs(match[0]));
    const meta = (name) => tags.find((tag) => tag.name === name || tag.property === name)?.content;
    const canonicals = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => attrs(match[0])).filter((tag) => tag.rel === "canonical");
    const title = clean(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "");
    const description = meta("description");
    const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => clean(match[1]));
    check(Boolean(title), `${target.pathname}: missing title`);
    check(Boolean(description), `${target.pathname}: missing description`);
    check(headings.length === 1 && Boolean(headings[0]), `${target.pathname}: expected one meaningful H1, got ${headings.length}`);
    check(canonicals.length === 1 && normal(canonicals[0].href) === normal(url), `${target.pathname}: canonical does not match sitemap URL`);
    check(!tags.some((tag) => ["robots", "googlebot"].includes(tag.name) && /noindex|none/.test(tag.content)), `${target.pathname}: public page has noindex`);
    check(!/noindex|none/i.test(result.headers.get("x-robots-tag") ?? ""), `${target.pathname}: public response has noindex header`);
    check(meta("og:title") === title, `${target.pathname}: og:title differs from page title`);
    check(Boolean(meta("og:description")), `${target.pathname}: missing og:description`);
    check(meta("og:url") && normal(meta("og:url")) === normal(url), `${target.pathname}: incorrect og:url`);
    check(Boolean(meta("og:image")), `${target.pathname}: missing og:image`);
    check(Boolean(meta("twitter:title")), `${target.pathname}: missing Twitter title`);
    check(/<html[^>]*\blang="en-GB"/i.test(html), `${target.pathname}: expected en-GB language`);
    for (const [value, seen, name] of [[title, seenTitles, "title"], [description, seenDescriptions, "description"]]) {
      if (value && seen.has(value)) failures.push(`${target.pathname}: duplicate ${name} with ${seen.get(value)}`);
      seen.set(value, target.pathname);
    }
    if (title.length > 65) warnings.push(`${target.pathname}: title is ${title.length} characters`);
    if (description?.length > 165) warnings.push(`${target.pathname}: description is ${description.length} characters`);
    const schemas = [...result.html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
    check(schemas.length > 0, `${target.pathname}: missing JSON-LD`);
    for (const [, json] of schemas) {
      try { JSON.parse(json); } catch { failures.push(`${target.pathname}: invalid JSON-LD`); }
    }
    for (const [image] of html.matchAll(/<img\b[^>]*>/gi)) {
      check("alt" in attrs(image), `${target.pathname}: image lacks alt attribute`);
    }
    pages.push({ path: target.pathname, status: result.status, title, description, h1: headings, canonical: canonicals[0]?.href, schemaBlocks: schemas.length, bytes: Buffer.byteLength(result.html), milliseconds: result.milliseconds });
  }
  for (const page of pages) {
    const { html } = await read(page.path);
    for (const [tag] of documentOnly(html).matchAll(/<a\b[^>]*>/gi)) {
      const href = attrs(tag).href;
      if (!href) continue;
      const target = new URL(href, new URL(page.path, base));
      if (![base.origin, canonicalOrigin].includes(target.origin)) continue;
      if (/^\/(api|auth|account|admin|dashboard|learn)(\/|$)/.test(target.pathname)) continue;
      const linked = await read(target.pathname);
      check(linked.status === 200, `${page.path}: broken internal link ${href} (${linked.status})`);
      if (target.hash) {
        const id = decodeURIComponent(target.hash.slice(1));
        const ids = [...documentOnly(linked.html).matchAll(/\bid="([^"]+)"/g)].map((match) => decode(match[1]));
        check(ids.includes(id), `${page.path}: missing anchor ${href}`);
      }
    }
  }
  for (const path of ["/auth/login", "/auth/signup"]) {
    const result = await read(path);
    check(result.status === 200, `${path}: returned ${result.status}`);
    const tags = [...documentOnly(result.html).matchAll(/<meta\b[^>]*>/gi)].map((match) => attrs(match[0]));
    check(tags.some((tag) => tag.name === "robots" && /noindex/.test(tag.content)), `${path}: missing noindex`);
    check(!tags.some((tag) => tag.name === "googlebot" && /(^|,)\s*index\s*(,|$)/.test(tag.content)), `${path}: googlebot index overrides private robots`);
  }
  const legacy = await read("/courses", "manual");
  check([301, 308].includes(legacy.status) && new URL(legacy.headers.get("location"), base).pathname === "/ondemand", "legacy /courses must permanently redirect to /ondemand");
  for (const path of ["/admin", "/dashboard", "/account", "/learn/seo-audit-course"]) {
    const result = await read(path, "manual");
    check([302, 303, 307].includes(result.status) && new URL(result.headers.get("location"), base).pathname === "/auth/login", `${path}: anonymous request must redirect to login`);
  }
  for (const path of ["/icon.png", "/icon-512.png", "/opengraph-image", "/manifest.webmanifest"]) {
    const result = await read(path);
    check(result.status === 200, `${path}: missing public metadata asset (${result.status})`);
  }
  const missing = await read("/seo-audit-missing-page");
  check(missing.status === 404, `unknown URL must return 404, got ${missing.status}`);
} catch (error) {
  failures.push(error.message);
}

const report = { date: new Date().toISOString(), base: base.origin, canonicalOrigin, pages, failures: [...new Set(failures)], warnings: [...new Set(warnings)] };
if (values.output) {
  await mkdir(dirname(values.output), { recursive: true });
  await writeFile(values.output, `${JSON.stringify(report, null, 2)}\n`);
}
console.log(JSON.stringify(report, null, 2));
process.exitCode = report.failures.length ? 1 : 0;
