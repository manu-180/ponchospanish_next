import Link from "next/link";
import { Plus, FileText, Eye, EyeOff } from "lucide-react";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "Ebooks — Poncho Admin" };

export default async function AdminDigitalProductsPage() {
  const admin = getSupabaseAdminClient();
  const { data: products } = await admin
    .from("digital_products")
    .select(
      "id, slug, title, subtitle, price_gbp, currency, is_published, cover_image_path, created_at",
    )
    .order("created_at", { ascending: false });

  return (
    <div className="container-wide py-10 md:py-14 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl">Ebooks & extras</h1>
          <p className="text-charcoal-400 mt-1">
            Productos sueltos que se venden por fuera de los cursos. Cliccá uno
            para editarlo.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/admin/digital-products/new">
            <Plus className="h-4 w-4" /> Nuevo ebook
          </Link>
        </Button>
      </div>

      {!products || products.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center space-y-4">
            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-mustard/15 text-mustard-600">
              <FileText className="h-7 w-7" />
            </div>
            <h2 className="font-serif text-2xl">Todavía no hay ebooks</h2>
            <p className="text-charcoal-400 max-w-md mx-auto">
              Subí un PDF, ponele precio y descripción. Listo: aparece en el
              catálogo público.
            </p>
            <Button asChild size="lg">
              <Link href="/admin/digital-products/new">
                <Plus className="h-4 w-4" /> Subir mi primer ebook
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/admin/digital-products/${p.id}`}
              className="group"
            >
              <Card className="overflow-hidden h-full hover:shadow-soft-lg transition-all group-hover:-translate-y-0.5">
                <div className="relative aspect-[4/3] bg-gradient-to-br from-mustard/15 via-cream-100 to-terracotta/15">
                  {p.cover_image_path ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.cover_image_path}
                      alt={p.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileText className="h-12 w-12 text-mustard/60" />
                    </div>
                  )}
                  <span className="absolute top-2 left-2">
                    {p.is_published ? (
                      <Badge variant="success">
                        <Eye className="h-3 w-3 mr-1" /> Publicado
                      </Badge>
                    ) : (
                      <Badge variant="muted">
                        <EyeOff className="h-3 w-3 mr-1" /> Borrador
                      </Badge>
                    )}
                  </span>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-serif text-lg leading-tight line-clamp-2">
                    {p.title}
                  </h3>
                  {p.subtitle && (
                    <p className="mt-1 text-xs text-charcoal-400 line-clamp-2">
                      {p.subtitle}
                    </p>
                  )}
                  <p className="mt-3 font-semibold text-charcoal-600">
                    {p.price_gbp > 0
                      ? formatCurrency(p.price_gbp, p.currency)
                      : "Gratis"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
