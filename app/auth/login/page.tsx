import Link from "next/link";
import { AuthCard } from "@/components/marketing/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = { title: "Sign in" };

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to continue with the Academy."
      footer={
        <>
          New around here?{" "}
          <Link
            href={`/auth/signup${params.redirect ? `?redirect=${params.redirect}` : ""}`}
            className="font-semibold text-mustard-600 underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm redirect={params.redirect} initialError={params.error} />
    </AuthCard>
  );
}
