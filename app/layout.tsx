import type { Metadata, Viewport } from "next";
import { Libre_Baskerville, Montserrat } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Poncho Spanish — Online Spanish lessons for curious minds",
    template: "%s · Poncho Spanish",
  },
  description:
    "Online Spanish classes for kids, teens & families who want to speak Spanish without the panic or the perfectionism. Private lessons, group classes, GCSE support & a streaming Academy.",
  applicationName: "Poncho Spanish",
  authors: [{ name: "Anto · Poncho Spanish" }],
  keywords: [
    "Spanish lessons online",
    "Spanish for kids",
    "Spanish for teens",
    "GCSE Spanish",
    "Spanish tutor UK",
    "learn Spanish online",
  ],
  openGraph: {
    title: "Poncho Spanish — Online Spanish lessons for curious minds",
    description:
      "Online Spanish classes & a streaming Academy. Relaxed, positive, meaningful.",
    url: siteUrl,
    siteName: "Poncho Spanish",
    type: "website",
    images: ["/images/foto1.jpeg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Poncho Spanish",
    description:
      "Online Spanish classes & a streaming Academy. Relaxed, positive, meaningful.",
    images: ["/images/foto1.jpeg"],
  },
  icons: { icon: "/images/logo.png" },
  robots: { index: true, follow: true },
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
      lang="en"
      className={`${baskerville.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh font-sans antialiased" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
