"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LEVELS = ["Beginner", "Intermediate", "Advanced", "All Levels"] as const;

export function NewCourseForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("Beginner");
  const [price, setPrice] = useState("");

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const submit = () => {
    if (!title.trim()) {
      toast.error("Give your course a title");
      return;
    }
    const priceNum = price === "" ? 0 : Number(price);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      toast.error("Price must be a non-negative number");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            slug,
            level,
            price_gbp: priceNum,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? data.message ?? "Failed");
        toast.success("Course created. Add modules & lessons next.");
        router.push(`/admin/courses/${data.id}`);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Try again");
      }
    });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">Course title</Label>
        <Input
          id="title"
          placeholder="e.g. Spanish for Beginners — A1 Foundations"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
        />
        {slug && (
          <p className="text-xs text-charcoal-400">
            URL: <code>/ondemand/{slug}</code>
          </p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <Select
            value={level}
            onValueChange={(v) => setLevel(v as (typeof LEVELS)[number])}
          >
            <SelectTrigger id="level">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEVELS.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (GBP)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400">
              £
            </span>
            <Input
              id="price"
              type="number"
              min={0}
              step={0.01}
              placeholder="49.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="pl-7"
            />
          </div>
          <p className="text-xs text-charcoal-400">
            Leave 0 for a free course. You can change this later.
          </p>
        </div>
      </div>

      <Button onClick={submit} disabled={isPending} size="lg" className="w-full">
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Creating...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" /> Create draft course
          </>
        )}
      </Button>
    </div>
  );
}
