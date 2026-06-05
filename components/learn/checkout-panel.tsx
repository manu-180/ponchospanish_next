"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { KeyRound, Loader2, LogIn, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { features } from "@/lib/env";

interface CheckoutPanelProps {
  course: {
    id: string;
    slug: string;
    title: string;
    price_gbp: number;
  };
  isAuthenticated: boolean;
}

export function CheckoutPanel({ course, isAuthenticated }: CheckoutPanelProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isPending, startTransition] = useTransition();

  if (!isAuthenticated) {
    return (
      <div className="space-y-3">
        <Button asChild size="lg" className="w-full">
          <Link
            href={`/auth/login?redirect=${encodeURIComponent(`/ondemand/${course.slug}`)}`}
          >
            <LogIn className="h-4 w-4" /> Sign in to enrol
          </Link>
        </Button>
        <p className="text-xs text-charcoal-400 text-center">
          New here?{" "}
          <Link
            href={`/auth/signup?redirect=${encodeURIComponent(`/ondemand/${course.slug}`)}`}
            className="underline-offset-4 underline hover:text-mustard-600"
          >
            Create a free account
          </Link>
        </p>
      </div>
    );
  }

  const redeemCode = () => {
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
          body: JSON.stringify({ code: value, courseId: course.id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message ?? "Failed");
        toast.success("Code redeemed! Lifetime access unlocked.");
        router.push(`/learn/${course.slug}`);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Try again");
      }
    });
  };

  const isFree = course.price_gbp === 0;

  if (isFree) {
    return (
      <Button
        size="lg"
        className="w-full"
        onClick={() => {
          startTransition(async () => {
            try {
              const res = await fetch("/api/enrollments/free", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId: course.id }),
              });
              if (!res.ok) {
                const e = await res.json().catch(() => ({}));
                throw new Error(e.message ?? "Failed");
              }
              toast.success("Enrolled!");
              router.push(`/learn/${course.slug}`);
              router.refresh();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Try again");
            }
          });
        }}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Enrolling...
          </>
        ) : (
          "Enrol for free"
        )}
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      {features.paypal ? (
        <PayPalScriptProvider
          options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
            currency: "GBP",
            intent: "capture",
            components: "buttons",
          }}
        >
          <PayPalButtons
            style={{
              layout: "vertical",
              color: "gold",
              shape: "pill",
              label: "paypal",
              height: 48,
            }}
            createOrder={async () => {
              const res = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId: course.id }),
              });
              const data = await res.json();
              if (!res.ok || !data.orderId) {
                toast.error(data.message ?? "Couldn't start checkout");
                throw new Error(data.message ?? "PayPal create-order failed");
              }
              return data.orderId as string;
            }}
            onApprove={async (data) => {
              try {
                const res = await fetch("/api/paypal/capture-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    orderId: data.orderID,
                    courseId: course.id,
                  }),
                });
                const json = await res.json();
                if (!res.ok) throw new Error(json.message ?? "Capture failed");
                toast.success("Payment confirmed — welcome aboard!");
                router.push(`/learn/${course.slug}`);
                router.refresh();
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Capture failed");
              }
            }}
            onError={() => {
              toast.error("PayPal couldn't complete the order. Please try again.");
            }}
          />
        </PayPalScriptProvider>
      ) : (
        <Button asChild size="lg" className="w-full" variant="soft">
          <a href="mailto:hello@ponchospanish.com?subject=Enrol%20in%20course">
            <Mail className="h-4 w-4" />
            <span>Contact us to enrol</span>
          </a>
        </Button>
      )}

      <div className="relative my-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-charcoal-100" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-cream-50 px-3 text-[10px] uppercase tracking-[0.22em] text-charcoal-400">
            or use a code
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-300" />
          <Input
            placeholder="FREE-ACCESS"
            className="pl-10 font-mono tracking-wider uppercase"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === "Enter") redeemCode();
            }}
          />
        </div>
        <Button
          variant="soft"
          className="w-full"
          onClick={redeemCode}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Redeeming...
            </>
          ) : (
            "Apply access code"
          )}
        </Button>
      </div>
    </div>
  );
}
