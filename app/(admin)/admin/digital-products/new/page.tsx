import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DigitalProductForm } from "@/components/admin/digital-product-form";

export const metadata = { title: "Nuevo ebook — Poncho Admin" };

export default function NewDigitalProductPage() {
  return (
    <div className="container-wide py-10 md:py-14 space-y-8 max-w-5xl">
      <div className="space-y-2">
        <Link
          href="/admin/digital-products"
          className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-charcoal-400 hover:text-mustard-600 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> Todos los ebooks
        </Link>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mustard-600">
          Nuevo ebook
        </p>
        <h1 className="font-serif text-3xl md:text-4xl">
          Subí un producto digital
        </h1>
        <p className="text-charcoal-400 max-w-xl">
          Un ebook, una guía PDF, una colección de fichas. Va al catálogo cuando
          lo publiques.
        </p>
      </div>

      <DigitalProductForm mode="create" />
    </div>
  );
}
