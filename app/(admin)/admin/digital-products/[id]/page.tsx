import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { DigitalProductForm } from "@/components/admin/digital-product-form";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDigitalProductPage({ params }: PageProps) {
  const { id } = await params;
  const admin = getSupabaseAdminClient();
  const { data: product } = await admin
    .from("digital_products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!product) notFound();

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
          Editor de ebook
        </p>
        <h1 className="font-serif text-3xl md:text-4xl truncate">
          {product.title}
        </h1>
      </div>

      <DigitalProductForm mode="edit" initial={product} />
    </div>
  );
}
