import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 h-[520px] w-[520px] rounded-full bg-mustard/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-[420px] w-[420px] rounded-full bg-terracotta/15 blur-3xl"
      />

      <header className="relative z-10 py-6">
        <div className="container-wide">
          <Logo priority />
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">{children}</div>
        <p className="mt-8 text-xs text-charcoal-400">
          <Link href="/" className="hover:text-mustard-600 transition-colors">
            ← Back to home
          </Link>
        </p>
      </main>
    </div>
  );
}
