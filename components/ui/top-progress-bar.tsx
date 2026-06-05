"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Global navigation progress bar.
 * Starts on link click, completes when the new route pathname commits.
 * Wrapped in <Suspense> in the root layout (required by useSearchParams).
 */
export function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const trickle = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safety = useRef<ReturnType<typeof setTimeout> | null>(null);
  const started = useRef(false);

  const clearTimers = () => {
    if (trickle.current) clearInterval(trickle.current);
    if (safety.current) clearTimeout(safety.current);
    trickle.current = null;
    safety.current = null;
  };

  const start = () => {
    if (started.current) return;
    started.current = true;
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setVisible(true);
    setProgress(8);
    trickle.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p;
        const inc = p < 45 ? 9 : p < 70 ? 4 : 1.5;
        return Math.min(p + inc, 90);
      });
    }, 240);
    // Safety net: auto-complete after 8s in case route never commits.
    safety.current = setTimeout(finish, 8000);
  };

  const finish = () => {
    started.current = false;
    clearTimers();
    setProgress(100);
    hideTimer.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);
  };

  // Route committed → complete the bar.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { finish(); }, [pathname, searchParams]);

  // Detect navigation starts via click on internal links.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      const target = anchor.getAttribute("target");
      if (
        !href ||
        target === "_blank" ||
        anchor.hasAttribute("download") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      )
        return;
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      )
        return;
      start();
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimers();
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]"
    >
      <div
        className="h-full rounded-r-full bg-gradient-to-r from-mustard via-terracotta to-mustard-300 shadow-[0_0_12px_rgba(232,168,76,0.7)] transition-[width,opacity] duration-200 ease-out"
        style={{ width: `${progress}%`, opacity: progress >= 100 ? 0 : 1 }}
      />
    </div>
  );
}
