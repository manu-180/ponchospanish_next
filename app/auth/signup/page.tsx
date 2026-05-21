import Link from "next/link";
import { AuthCard } from "@/components/marketing/auth-card";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata = { title: "Create account" };

interface Props {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function SignupPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <AuthCard
      title="Create your account"
      subtitle="One account. Lifetime access to anything you purchase."
      footer={
        <>
          Already have one?{" "}
          <Link
            href={`/auth/login${params.redirect ? `?redirect=${params.redirect}` : ""}`}
            className="font-semibold text-mustard-600 underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <SignupForm redirect={params.redirect} />
    </AuthCard>
  );
}
