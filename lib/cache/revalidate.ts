import "server-only";
import { revalidatePath } from "next/cache";

/**
 * Purge the ISR cache of every public page that renders a course.
 *
 * Both `/ondemand` and `/ondemand/[slug]` are ISR pages. Next caches the
 * `notFound()` of a course that is still a draft exactly like a successful
 * render — the entry is stored as an empty value carrying the route's
 * revalidate — so a single visit to the public URL while the course is
 * unpublished pins a 404 on that URL, and stale-while-revalidate serves it
 * once more on the first request after the window expires. The admin's "Vista previa" button links straight at that URL, so
 * previewing a draft is enough to poison it: publishing the course changed
 * the database but the browser kept getting "Course not found" (2026-10-28).
 *
 * Every admin write that changes whether (or how) a course shows publicly
 * calls this, so publishing is visible on the next request. Pass the old slug
 * too when a rename or a delete leaves the previous URL behind.
 */
export function revalidateCoursePublicPages(
  ...slugs: (string | null | undefined)[]
) {
  // The Academy listing — it only shows published courses.
  revalidatePath("/ondemand");
  for (const slug of new Set(slugs.filter(Boolean) as string[])) {
    revalidatePath(`/ondemand/${slug}`);
  }
}
