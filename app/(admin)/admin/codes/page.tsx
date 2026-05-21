import { Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Access codes — Poncho Admin",
};

export default function AdminCodesPage() {
  return (
    <div className="container-wide py-10 md:py-14 space-y-8 max-w-3xl">
      <div>
        <h1 className="font-serif text-3xl md:text-4xl">Access codes</h1>
        <p className="text-charcoal-400 mt-1">
          Generate free-access codes (full course unlock) or discount codes
          (% off at checkout).
        </p>
      </div>

      <Card>
        <CardContent className="p-8 text-center space-y-3">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-mustard/15 text-mustard-600">
            <Construction className="h-7 w-7" />
          </div>
          <h2 className="font-serif text-xl">UI coming next iteration</h2>
          <p className="text-charcoal-400 max-w-md mx-auto text-sm">
            The backend (DB tables, validate / redeem APIs, rate limiting)
            is done. The generation UI ships next.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
