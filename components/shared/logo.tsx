import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  imageClassName?: string;
  href?: string | null;
  priority?: boolean;
}

export function Logo({
  className,
  imageClassName,
  href = "/",
  priority = false,
}: LogoProps) {
  const img = (
    <Image
      src="/images/logo.png"
      alt="Poncho Spanish"
      width={220}
      height={70}
      priority={priority}
      className={cn("h-14 w-auto object-contain md:h-[70px]", imageClassName)}
    />
  );

  if (!href) return <div className={className}>{img}</div>;

  return (
    <Link
      href={href}
      className={cn("inline-flex items-center", className)}
      aria-label="Poncho Spanish — Home"
    >
      {img}
    </Link>
  );
}
