import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  getSupabaseServerClient,
  getCurrentUser,
} from "@/lib/supabase/server";
import {
  getDigitalProductBySlug,
  userHasPurchasedProduct,
} from "@/lib/supabase/queries";
import { resolveStorageUrl, STORAGE_BUCKETS } from "@/lib/supabase/storage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatBytes } from "@/lib/utils";
import { DigitalProductCheckoutPanel } from "@/components/learn/digital-product-checkout-panel";
import { DownloadProductButton } from "@/components/learn/download-product-button";
import { JsonLd } from "@/components/seo/json-ld";
import { graph, digitalProductSchema, breadcrumbSchema } from "@/lib/seo/schema";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await getSupabaseServerClient();
  try {
    const product = await getDigitalProductBySlug(supabase, slug);
    if (!product) return { title: "Ebook not found" };
    return {
      title: `${product.title} — Poncho Academy`,
      description:
        product.description?.slice(0, 155) ??
        product.subtitle ??
        `${product.title} — a downloadable Spanish resource by Anto.`,
      alternates: { canonical: `/ondemand/ebooks/${product.slug}` },
      openGraph: {
        title: product.title,
        description: product.subtitle ?? undefined,
        images: product.cover_image_path
          ? [product.cover_image_path]
          : undefined,
      },
    };
  } catch {
    return { title: "Ebook" };
  }
}

export default async function EbookDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await getSupabaseServerClient();

  let product;
  try {
    product = await getDigitalProductBySlug(supabase, slug);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[ebook-detail] failed:", err);
  }
  if (!product || !product.is_published) notFound();

  const user = await getCurrentUser();
  let hasAccess = false;
  if (user) {
    try {
      hasAccess = await userHasPurchasedProduct(supabase, user.id, product.id);
    } catch {
      hasAccess = false;
    }
  }

  const isFree = product.price_gbp === 0;
  const previewUrl = product.preview_path
    ? await resolveStorageUrl(
        STORAGE_BUCKETS.digitalProducts,
        product.preview_path,
        60 * 10,
      )
    : null;

  const includes = [
    "Instant download after purchase",
    "Yours forever — no subscription",
    product.file_size_bytes
      ? `PDF file · ${formatBytes(product.file_size_bytes)}`
      : "Downloadable PDF",
    "Read on phone, tablet, e-reader or print it",
  ];

  return (
    <>
      <JsonLd
        data={graph(
          digitalProductSchema({
            title: product.title,
            slug: product.slug,
            description: product.description,
            subtitle: product.subtitle,
            price_gbp: product.price_gbp,
            cover_image_path: product.cover_image_path,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Academy", path: "/ondemand" },
            { name: product.title, path: `/ondemand/ebooks/${product.slug}` },
          ]),
        )}
      />

      <section className="relative pt-8 pb-12 md:pt-12 md:pb-16 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-32 h-[460px] w-[460px] rounded-full bg-mustard/15 blur-3xl"
        />
        <div className="container-wide relative">
          <Link
            href="/ondemand"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-charcoal-400 hover:text-mustard-600 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Academy
          </Link>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            {/* Cover */}
            <div className="order-1 lg:order-none">
              <div className="relative mx-auto w-full max-w-[300px]">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl rounded-l-md shadow-soft-lg ring-1 ring-charcoal-100/40 bg-gradient-to-br from-mustard/25 via-cream-100 to-terracotta/25">
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 z-10 w-4 bg-black/10 mix-blend-multiply"
                  />
                  {product.cover_image_path ? (
                    <Image
                      src={product.cover_image_path}
                      alt={product.title}
                      fill
                      sizes="(min-width: 1024px) 300px, 70vw"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileText className="h-20 w-20 text-mustard/60" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info + buy */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="terracotta">
                  <BookOpen className="h-3 w-3 mr-1" /> Ebook
                </Badge>
                {isFree && <Badge variant="free">Free</Badge>}
                {product.file_size_bytes && (
                  <Badge variant="muted">
                    PDF · {formatBytes(product.file_size_bytes)}
                  </Badge>
                )}
              </div>

              <h1 className="font-serif text-display-xl text-balance leading-[1.05]">
                {product.title}
              </h1>
              {product.subtitle && (
                <p className="text-xl text-charcoal-500/80">{product.subtitle}</p>
              )}
              {product.description && (
                <p className="text-base leading-relaxed text-charcoal-500/80 whitespace-pre-line">
                  {product.description}
                </p>
              )}

              {/* Buy / download card */}
              <Card className="overflow-hidden">
                <CardContent className="p-6 md:p-7 space-y-5">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-charcoal-400">
                      One payment · Yours forever
                    </p>
                    <p className="font-serif text-4xl">
                      {isFree ? "Free" : formatCurrency(product.price_gbp, product.currency)}
                    </p>
                  </div>

                  {hasAccess ? (
                    <div className="space-y-2">
                      <Badge variant="success" className="mb-1">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> You own this
                      </Badge>
                      <DownloadProductButton
                        productId={product.id}
                        label="Download ebook"
                      />
                    </div>
                  ) : (
                    <DigitalProductCheckoutPanel
                      product={{
                        id: product.id,
                        slug: product.slug,
                        title: product.title,
                        price_gbp: product.price_gbp,
                      }}
                      isAuthenticated={Boolean(user)}
                    />
                  )}

                  {previewUrl && (
                    <Button asChild variant="outline" className="w-full">
                      <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Eye className="h-4 w-4" /> Read a free sample
                      </a>
                    </Button>
                  )}

                  <ul className="space-y-2 text-sm text-charcoal-500 pt-2 border-t border-charcoal-100/40">
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      Secure PayPal checkout
                    </li>
                    <li className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-emerald-500" />
                      Instant download, lifetime access
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-500" />
                      Made by a real Spanish teacher
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What's inside */}
      <section className="pb-16 md:pb-20">
        <div className="container-wide">
          <Card className="max-w-3xl">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-serif text-2xl flex items-center gap-2">
                <FileText className="h-5 w-5 text-mustard-600" /> What you get
              </h2>
              <ul className="grid sm:grid-cols-2 gap-3 text-sm text-charcoal-500">
                {includes.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-mustard-600 mt-0.5 shrink-0" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
