import { Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminReviewsPage() {
  return (
    <div className="container-wide py-10 md:py-14 space-y-8 max-w-3xl">
      <div>
        <h1 className="font-serif text-3xl md:text-4xl">Reviews</h1>
        <p className="text-charcoal-400 mt-1">
          Moderate course reviews (hide / pin / delete).
        </p>
      </div>
      <Card>
        <CardContent className="p-8 text-center space-y-3">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-mustard/15 text-mustard-600">
            <Construction className="h-7 w-7" />
          </div>
          <h2 className="font-serif text-xl">Moderation UI coming next iteration</h2>
          <p className="text-charcoal-400 max-w-md mx-auto text-sm">
            Backend ready (RLS, hide/pin policies, students-only-after-30%
            constraint). UI ships in the next round.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
