import Link from "next/link";
import { Instagram, Mail, Sparkles } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-charcoal-600 text-cream/80">
      <div className="container-wide py-16 md:py-20 grid gap-12 md:grid-cols-3">
        <div className="space-y-4">
          <div className="font-serif text-2xl text-white tracking-[0.18em]">
            PONCHO SPANISH
          </div>
          <p className="text-sm leading-relaxed text-cream/60 max-w-xs">
            Made by real people, for real people. Spanish that feels relaxed,
            positive, and meaningful — from Buenos Aires to your living room.
          </p>
          <div className="flex items-center gap-2 text-sm text-mustard-200">
            <Sparkles className="h-4 w-4" />
            <span>British English friendly · Native Spanish teacher</span>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-mustard-200 mb-4">
            Explore
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/" className="hover:text-mustard-200 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/ondemand" className="hover:text-mustard-200 transition-colors">
                Academy
              </Link>
            </li>
            <li>
              <Link href="/#contact" className="hover:text-mustard-200 transition-colors">
                Book a trial
              </Link>
            </li>
            <li>
              <Link href="/auth/login" className="hover:text-mustard-200 transition-colors">
                Sign in
              </Link>
            </li>
            <li>
              <Link
                href="/legal/terms"
                className="hover:text-mustard-200 transition-colors"
              >
                Terms &amp; conditions
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-mustard-200 mb-4">
            Stay in touch
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="mailto:ponchospanish@gmail.com"
                className="flex items-center gap-2 hover:text-mustard-200 transition-colors"
              >
                <Mail className="h-4 w-4" />
                ponchospanish@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/poncho.spanish"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-mustard-200 transition-colors"
              >
                <Instagram className="h-4 w-4" />
                @poncho.spanish
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-3 py-6 text-xs text-cream/40">
          <p>© {new Date().getFullYear()} Poncho Spanish. Made by Real People.</p>
          <p className="text-[11px] tracking-wide">
            Designed &amp; built with curiosity in Buenos Aires.
          </p>
        </div>
      </div>
    </footer>
  );
}
