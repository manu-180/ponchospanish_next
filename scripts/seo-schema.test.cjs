const test = require("node:test");
const assert = require("node:assert/strict");
const { createLoader } = require("./seo-test-loader.cjs");

const sample = { title: "Spanish basics", slug: "spanish-basics", price_gbp: 25 };

test("unknown course duration stays absent and short lessons retain their measured seconds", () => {
  const { courseSchema } = createLoader()("lib/seo/schema.ts");
  for (const duration of [undefined, 0, -1, NaN, Infinity]) {
    assert.equal("courseWorkload" in courseSchema({ ...sample, totalDurationSeconds: duration }).hasCourseInstance, false);
  }
  for (const seconds of [1, 29, 61, 3661]) {
    assert.equal(courseSchema({ ...sample, totalDurationSeconds: seconds }).hasCourseInstance.courseWorkload, `PT${seconds}S`);
  }
});

test("organisation represents its service area without fabricating a UK address", () => {
  const { organizationSchema } = createLoader()("lib/seo/schema.ts");
  const organisation = organizationSchema();
  assert.equal(organisation.areaServed.name, "United Kingdom");
  assert.equal("address" in organisation, false);
});

test("invalid or transient images cannot become indexable schema assets", () => {
  const load = createLoader();
  const { publicImageUrl } = load("lib/seo/config.ts");
  const { courseSchema, digitalProductSchema } = load("lib/seo/schema.ts");
  for (const image of ["covers/file.jpg", "javascript:alert(1)", "//other.example/image.jpg", "https://storage.example/img?token=expires", "https://user:pass@example.com/image.jpg"]) {
    assert.equal(publicImageUrl(image), undefined);
    assert.equal("image" in courseSchema({ ...sample, cover_image_path: image }), false);
    assert.equal("image" in digitalProductSchema({ ...sample, cover_image_path: image }), false);
  }
  assert.equal(publicImageUrl("/images/logo.png"), "https://www.ponchospanish.com/images/logo.png");
  assert.equal(publicImageUrl("https://storage.example/cover.png"), "https://storage.example/cover.png");
});

test("unverified or out-of-range ratings do not produce aggregate ratings", () => {
  const { courseSchema } = createLoader()("lib/seo/schema.ts");
  for (const [count, rating] of [[0, 5], [2, NaN], [2, 6], [2, 0], [-1, 5], [1.5, 5]]) {
    assert.equal("aggregateRating" in courseSchema({ ...sample, ratings_count: count, avg_rating: rating }), false);
  }
  assert.equal(courseSchema({ ...sample, ratings_count: 2, avg_rating: 4.5 }).aggregateRating.ratingValue, 4.5);
});

test("preview pages remain noindex while their canonicals point at production", () => {
  for (const deployment of ["preview", "development", "production"]) {
    const load = createLoader({ env: { NODE_ENV: "production", VERCEL_ENV: deployment, NEXT_PUBLIC_SITE_URL: "https://untrusted.vercel.app" } });
    const { pageMetadata } = load("lib/seo/metadata.ts");
    const metadata = pageMetadata({ title: "Spanish for kids", description: "Live lessons", path: "/spanish-lessons/children" });
    assert.equal(metadata.robots.index, deployment === "production");
    assert.equal(metadata.robots.googleBot.index, deployment === "production");
    assert.equal(metadata.alternates.canonical, "https://www.ponchospanish.com/spanish-lessons/children");
    assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
    assert.equal(metadata.openGraph.title, "Spanish for kids · Poncho Spanish");
    assert.equal(metadata.twitter.title, metadata.openGraph.title);
    assert.equal(metadata.openGraph.images[0].url, "https://www.ponchospanish.com/opengraph-image");
  }
});

test("JSON-LD cannot close its script element and preserves the original content", () => {
  const { JsonLd } = createLoader()("components/seo/json-ld.tsx");
  const data = { name: '</script><script>alert("x")</script>', text: "<tag> & café" };
  const element = JsonLd({ data });
  const json = element.props.dangerouslySetInnerHTML.__html;
  assert.equal(json.includes("<"), false);
  assert.deepEqual(JSON.parse(json), data);
});

function catalogLoader({ fail = false } = {}) {
  const calls = [];
  const catalog = Array.from({ length: 501 }, (_, index) => ({ slug: `course-${String(index).padStart(4, "0")}`, updated_at: "2026-01-01T00:00:00Z" }));
  const load = createLoader({
    env: { NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co", NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon" },
    mocks: {
      "server-only": {},
      "next/cache": { unstable_cache: (callback) => callback },
      "@supabase/supabase-js": {
        createClient: (_url, _key, options) => {
          assert.equal(options.auth.persistSession, false);
          return {
            from(table) {
              const request = { table };
              calls.push(request);
              return {
                select(columns) { request.columns = columns; return this; },
                eq(field, value) { request.filter = [field, value]; return this; },
                order(field) { request.order = field; return this; },
                limit(size) { request.limit = size; return this; },
                gt(field, value) { request.cursor = [field, value]; return this; },
                then(resolve) {
                  const data = table === "courses" ? catalog.filter((row) => !request.cursor || row.slug > request.cursor[1]).slice(0, request.limit) : [];
                  return Promise.resolve({ data: fail ? null : data, error: fail ? { code: "XX000", message: "sensitive internal detail" } : null }).then(resolve);
                },
              };
            },
          };
        },
      },
    },
  });
  return { load, calls };
}

test("sitemap catalog includes every published row beyond the first API page", async () => {
  const { load, calls } = catalogLoader();
  const { courses, products } = await load("lib/seo/public-catalog.ts").getSitemapCatalog();
  assert.equal(courses.length, 501);
  assert.equal(new Set(courses.map((row) => row.slug)).size, 501);
  assert.equal(products.length, 0);
  for (const call of calls) {
    assert.equal(call.columns, "slug, updated_at");
    assert.equal(call.filter[0], "is_published");
    assert.equal(call.filter[1], true);
    assert.equal(call.order, "slug");
  }
  assert.equal(calls.filter((call) => call.table === "courses")[1].cursor[1], "course-0499");
});

test("sitemap DB failure rejects instead of returning an empty successful response", async () => {
  const { load } = catalogLoader({ fail: true });
  await assert.rejects(load("lib/seo/public-catalog.ts").getSitemapCatalog(), /Sitemap courses query failed \(XX000\)/);
  const sitemap = createLoader({ mocks: {
    "@/lib/seo/public-catalog": { getSitemapCatalog: async () => { throw new Error("catalog unavailable"); } },
  } })("app/sitemap.ts").default;
  await assert.rejects(sitemap(), /catalog unavailable/);
});
