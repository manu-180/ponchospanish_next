import type { Metadata } from "next";
import { absolute, isIndexableDeployment, publicImageUrl, siteConfig } from "@/lib/seo/config";

export const privateRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

export const publicRobots: Metadata["robots"] = isIndexableDeployment
  ? {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    }
  : privateRobots;

export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
}): Metadata {
  const canonical = absolute(path);
  const socialTitle = title.endsWith(siteConfig.name) ? title : `${title} · ${siteConfig.name}`;
  const cover = publicImageUrl(image);
  const images = cover
    ? [{ url: cover, alt: title }]
    : [{ url: absolute("/opengraph-image"), width: 1200, height: 630, alt: siteConfig.title }];

  return {
    title,
    description,
    alternates: { canonical },
    robots: publicRobots,
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      url: canonical,
      title: socialTitle,
      description,
      images,
    },
    twitter: { card: "summary_large_image", title: socialTitle, description, images },
  };
}
