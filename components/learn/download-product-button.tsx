"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DownloadProductButtonProps {
  productId: string;
  label?: string;
  className?: string;
  variant?: "default" | "soft" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

/**
 * Fetches a short-lived signed URL from the server (which verifies ownership)
 * and triggers the download. Never exposes the raw storage path.
 */
export function DownloadProductButton({
  productId,
  label = "Download",
  className,
  variant = "default",
  size = "lg",
}: DownloadProductButtonProps) {
  const [loading, setLoading] = useState(false);

  const download = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/digital-products/${productId}/download`);
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.message ?? "Couldn't get the download link");
      }
      // Create link with download attribute to force browser download
      const link = document.createElement("a");
      link.href = data.url as string;
      link.setAttribute("download", "");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={download}
      disabled={loading}
      variant={variant}
      size={size}
      className={cn("w-full", className)}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {label}
    </Button>
  );
}
