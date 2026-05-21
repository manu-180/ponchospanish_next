"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Send, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const levels = ["Beginner", "Intermediate", "Advanced"] as const;
const interests = [
  "Private Lessons",
  "Start Your Own Group",
  "GCSE Exam Support",
] as const;

const ContactSchema = z.object({
  name: z.string().min(1, "Please tell us your name"),
  email: z.string().email("Please enter a valid email address"),
  age: z
    .string()
    .min(1, "Required")
    .regex(/^\d+$/, "Numbers only")
    .refine((v) => {
      const n = Number(v);
      return n > 0 && n < 120;
    }, "Please enter a valid age"),
  level: z.enum(levels, { required_error: "Please select a level" }),
  interest: z.enum(interests, { required_error: "Please select an option" }),
  message: z.string().optional(),
});

type ContactInput = z.infer<typeof ContactSchema>;

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm({ defaultInterest }: { defaultInterest?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  const presetInterest = interests.find((i) =>
    i.toLowerCase().includes((defaultInterest ?? "").toLowerCase()),
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(ContactSchema),
    defaultValues: { interest: presetInterest },
  });

  const level = watch("level");
  const interest = watch("interest");

  const onSubmit = (data: ContactInput) => {
    setErrorMsg("");
    setStatus("loading");
    startTransition(async () => {
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message ?? "Something went wrong");
        }
        setStatus("success");
        reset();
        setTimeout(() => setStatus("idle"), 6000);
      } catch (err) {
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "Try again");
        setTimeout(() => setStatus("idle"), 4000);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-6"
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="name">Your name *</Label>
          <Input
            id="name"
            placeholder="Anto"
            autoComplete="name"
            invalid={Boolean(errors.name)}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Your email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <div className="space-y-2">
          <Label htmlFor="age">Learner&rsquo;s age *</Label>
          <Input
            id="age"
            inputMode="numeric"
            placeholder="12"
            invalid={Boolean(errors.age)}
            {...register("age")}
          />
          {errors.age && (
            <p className="text-xs text-destructive">{errors.age.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Level of Spanish? *</Label>
          <Select
            value={level}
            onValueChange={(v) => setValue("level", v as ContactInput["level"], { shouldValidate: true })}
          >
            <SelectTrigger invalid={Boolean(errors.level)}>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.level && (
            <p className="text-xs text-destructive">{errors.level.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>What are you interested in? *</Label>
          <Select
            value={interest}
            onValueChange={(v) =>
              setValue("interest", v as ContactInput["interest"], { shouldValidate: true })
            }
          >
            <SelectTrigger invalid={Boolean(errors.interest)}>
              <SelectValue placeholder="Choose..." />
            </SelectTrigger>
            <SelectContent>
              {interests.map((i) => (
                <SelectItem key={i} value={i}>
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.interest && (
            <p className="text-xs text-destructive">{errors.interest.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Anything you'd like Anto to know?"
          rows={4}
          {...register("message")}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <a
          href="/pdf/terms_and_conditions.pdf"
          target="_blank"
          rel="noopener"
          className="text-sm text-charcoal-400 underline-offset-4 hover:underline hover:text-mustard-600 transition-colors"
        >
          View Terms &amp; Conditions
        </a>

        <Button
          type="submit"
          size="lg"
          disabled={status === "loading" || isPending}
          className={
            status === "success"
              ? "bg-emerald-500 hover:bg-emerald-500"
              : status === "error"
                ? "bg-destructive hover:bg-destructive"
                : ""
          }
        >
          {status === "loading" || isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : status === "success" ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Message sent!
            </>
          ) : status === "error" ? (
            <>
              <XCircle className="h-4 w-4" />
              Try again
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send message
            </>
          )}
        </Button>
      </div>

      <AnimatePresence>
        {status === "success" && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm italic font-medium text-mustard-600 text-right"
          >
            Please check your junk or spam folder — just in case!
          </motion.p>
        )}
        {status === "error" && errorMsg && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-destructive text-right"
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
