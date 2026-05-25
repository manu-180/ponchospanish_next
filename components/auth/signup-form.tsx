"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const Schema = z
  .object({
    fullName: z.string().min(2, "Please tell us your name"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Use at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof Schema>;

export function SignupForm({ redirect }: { redirect?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({ resolver: zodResolver(Schema) });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { full_name: values.fullName },
        },
      });
      if (error) {
        toast.error(error.message);
        return;
      }

      // If email confirmations are disabled in Supabase (Auth → Providers →
      // Email → "Confirm email" = OFF), signUp returns a session and the user
      // is logged in immediately.
      if (data.session) {
        toast.success("Account created — welcome!");
        router.replace(redirect ?? "/dashboard");
        router.refresh();
        return;
      }

      // Fallback: try to sign in directly. This covers the rare case where the
      // signUp call didn't return a session but the user actually exists.
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (!signInError) {
        toast.success("Account created — welcome!");
        router.replace(redirect ?? "/dashboard");
        router.refresh();
        return;
      }

      // If we still can't sign in, email confirmation is enabled in Supabase.
      toast.error(
        "Account created, but couldn't log you in. Disable email confirmation in Supabase or check your inbox.",
      );
      router.replace("/auth/login");
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-name">Your name</Label>
        <Input
          id="signup-name"
          autoComplete="name"
          {...form.register("fullName")}
          invalid={Boolean(form.formState.errors.fullName)}
        />
        {form.formState.errors.fullName && (
          <p className="text-xs text-destructive">
            {form.formState.errors.fullName.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          autoComplete="email"
          {...form.register("email")}
          invalid={Boolean(form.formState.errors.email)}
        />
        {form.formState.errors.email && (
          <p className="text-xs text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          {...form.register("password")}
          invalid={Boolean(form.formState.errors.password)}
        />
        {form.formState.errors.password && (
          <p className="text-xs text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-confirm">Confirm password</Label>
        <Input
          id="signup-confirm"
          type="password"
          autoComplete="new-password"
          {...form.register("confirmPassword")}
          invalid={Boolean(form.formState.errors.confirmPassword)}
        />
        {form.formState.errors.confirmPassword && (
          <p className="text-xs text-destructive">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>
      <p className="text-xs text-charcoal-400 text-center">
        By signing up, you agree to our{" "}
        <a
          href="/pdf/terms_and_conditions.pdf"
          target="_blank"
          rel="noopener"
          className="underline-offset-4 underline hover:text-mustard-600"
        >
          terms &amp; conditions
        </a>
        .
      </p>
    </form>
  );
}
