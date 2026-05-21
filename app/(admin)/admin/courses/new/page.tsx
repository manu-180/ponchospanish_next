import { NewCourseForm } from "@/components/admin/new-course-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "New course — Poncho Admin",
};

export default function NewCoursePage() {
  return (
    <div className="container-wide py-10 md:py-14 max-w-2xl">
      <header className="space-y-2 mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mustard-600">
          New course
        </p>
        <h1 className="font-serif text-3xl md:text-4xl">
          Three fields. The rest later.
        </h1>
        <p className="text-charcoal-400">
          We&apos;ll create the course as a draft. You can fill in modules,
          videos, descriptions, and cover after this.
        </p>
      </header>

      <Card>
        <CardContent className="p-6 md:p-8">
          <NewCourseForm />
        </CardContent>
      </Card>
    </div>
  );
}
