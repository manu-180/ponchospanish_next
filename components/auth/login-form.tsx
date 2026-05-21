"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const Schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});
type FormValues = z.infer<typeof Schema>;

const MagicSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export function LoginForm({
  redirect,
  initialError,
}: {
  redirect?: string;
  initialError?: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [isPending, startTransition] = useTransition();

  const passwordForm = useForm<FormValues>({ resolver: zodResolver(Schema) });
  const magicForm = useForm<{ email: string }>({
    resolver: zodResolver(MagicSchema),
  });

  useEffect(() => {
    if (initialError === "forbidden") {
      toast.error("This account doesn't have admin access.");
    }
  }, [initialError]);

  const handlePassword = (values: FormValues) => {
    startTransition(async () => {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Welcome back!");
      router.replace(redirect ?? "/dashboard");
      router.refresh();
    });
  };

  const handleMagic = ({ email }: { email: string }) => {
    startTransition(async () => {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect ?? "/dashboard")}`
              : undefined,
        },
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Magic link sent — check your inbox.");
    });
  };

  return (
    <div className="space-y-6">
      <div className="inline-flex h-10 w-full items-center rounded-full bg-charcoal-100/40 p-1">
        <button
          type="button"
          onClick={() => setMode("password")}
          className={`flex-1 h-8 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
            mode === "password"
              ? "bg-cream-50 text-charcoal-600 shadow-soft"
              : "text-charcoal-400"
          }`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => setMode("magic")}
          className={`flex-1 h-8 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
            mode === "magic"
              ? "bg-cream-50 text-charcoal-600 shadow-soft"
              : "text-charcoal-400"
          }`}
        >
          Magic link
        </button>
      </div>

      {mode === "password" ? (
        <form
          onSubmit={passwordForm.handleSubmit(handlePassword)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...passwordForm.register("email")}
              invalid={Boolean(passwordForm.formState.errors.email)}
            />
            {passwordForm.formState.errors.email && (
              <p className="text-xs text-destructive">
                {passwordForm.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              {...passwordForm.register("password")}
              invalid={Boolean(passwordForm.formState.errors.password)}
            />
            {passwordForm.formState.errors.password && (
              <p className="text-xs text-destructive">
                {passwordForm.formState.errors.password.message}
              </p>
            )}
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={magicForm.handleSubmit(handleMagic)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="magic-email">Email</Label>
            <Input
              id="magic-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...magicForm.register("email")}
              invalid={Boolean(magicForm.formState.errors.email)}
            />
            {magicForm.formState.errors.email && (
              <p className="text-xs text-destructive">
                {magicForm.formState.errors.email.message}
              </p>
            )}
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Email me a magic link
              </>
            )}
          </Button>
          <p className="text-xs text-charcoal-400 text-center">
            We&rsquo;ll send a one-tap link. No password required.
          </p>
        </form>
      )}
    </div>
  );
}
