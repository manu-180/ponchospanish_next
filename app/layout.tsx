import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Libre_Baskerville, Montserrat } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { TopProgressBar } from "@/components/ui/top-progress-bar";
import { JsonLd } from "@/components/seo/json-ld";
import {
  graph,
  organizationSchema,
  websiteSchema,
  personSchema,
} from "@/lib/seo/schema";
import { siteConfig, siteUrl } from "@/lib/seo/config";
import "./globals.css";

const baskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-baskerville",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.title,
    template: "%s · Poncho Spanish",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: "Anto · Poncho Spanish", url: siteUrl }],
  creator: "Poncho Spanish",
  publisher: "Poncho Spanish",
  keywords: [...siteConfig.keywords],
  category: "education",
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteUrl,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.tagline,
    // OG/Twitter images come from app/opengraph-image.tsx (file convention).
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.tagline,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false, address: false, email: false },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
  },
};

export const viewport: Viewport = {
  themeColor: "#F2F0E9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-GB"
      className={`${baskerville.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh font-sans antialiased" suppressHydrationWarning>
        <Suspense fallback={null}>
          <TopProgressBar />
        </Suspense>
        {children}
        <Toaster />
        <JsonLd
          data={graph(
            organizationSchema(),
            websiteSchema(),
            personSchema(),
          )}
        />
      </body>
    </html>
  );
}
