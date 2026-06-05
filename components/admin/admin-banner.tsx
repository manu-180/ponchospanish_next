/**
 * Shown only to admin users on the student dashboard. Surfaces the admin area
 * front-and-center so Anto sees her "studio" the moment she logs in.
 */

import Link from "next/link";
import { Sparkles, ArrowRight, GraduationCap, Upload } from "lucide-react";

export function AdminBanner() {
  return (
    <section className="rounded-3xl bg-charcoal-600 p-6 md:p-8 text-cream-50 shadow-soft-lg relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-mustard/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -left-8 -bottom-12 h-48 w-48 rounded-full bg-terracotta/30 blur-3xl"
      />
      <div className="relative grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-mustard px-3 text-[11px] font-bold uppercase tracking-wider text-charcoal-700">
              <Sparkles className="h-3 w-3" /><span>Tu estudio</span>
            </span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-cream-50/60">
              solo visible para vos
            </span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl leading-tight">
            Bienvenida.
          </h2>
          <p className="mt-2 text-sm text-cream-50/80 max-w-md">
            Subí videos, ebooks y cursos nuevos. Editá precios, descripciones y
            quién tiene acceso. Todo desde un solo lugar.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 md:flex-col md:items-stretch">
          <Link
            href="/admin"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-mustard px-5 py-2.5 text-sm font-semibold text-charcoal-700 transition-colors hover:bg-mustard-400"
          >
            <GraduationCap className="h-4 w-4" /><span>Ir al panel</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/admin/courses/new"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-cream-50/30 bg-cream-50/10 px-5 py-2.5 text-sm font-semibold text-cream-50 transition-all hover:bg-cream-50/20"
          >
            <Upload className="h-4 w-4" /><span>Subir curso</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
