import { Card } from "@/components/ui/card";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden shadow-soft-lg p-8 md:p-10",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-mustard/15 blur-2xl"
      />
      <div className="relative space-y-6">
        <div className="text-center">
          <Logo href={null} imageClassName="h-12 mx-auto" />
          <h1 className="mt-6 font-serif text-2xl md:text-3xl font-semibold leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-charcoal-400">{subtitle}</p>
          )}
        </div>

        {children}

        {footer && (
          <div className="text-center text-sm text-charcoal-400 pt-2">
            {footer}
          </div>
        )}
      </div>
    </Card>
  );
}
