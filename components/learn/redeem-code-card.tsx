"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function RedeemCodeCard() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isPending, startTransition] = useTransition();

  const redeem = () => {
    const value = code.trim();
    if (!value) {
      toast.error("Enter a code first");
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch("/api/codes/redeem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: value }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message ?? "Code redemption failed");
        toast.success("Code redeemed — happy learning!");
        setCode("");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  };

  return (
    <Card className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-terracotta/20 blur-2xl"
      />
      <CardContent className="relative p-6 md:p-8">
        <div className="flex items-start gap-4 mb-5">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-terracotta/15 text-terracotta-400">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-semibold leading-tight">
              Got a free-access code?
            </h3>
            <p className="text-sm text-charcoal-400">
              Redeem it here for instant lifetime access.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="e.g. FREE-ACCESS"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="font-mono tracking-wider"
            onKeyDown={(e) => {
              if (e.key === "Enter") redeem();
            }}
          />
          <Button onClick={redeem} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Redeeming...
              </>
            ) : (
              "Redeem code"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
