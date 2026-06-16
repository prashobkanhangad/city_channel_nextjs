import type { Metadata } from "next";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  HOME_PAGE_TITLE,
  SITE_NAME,
  getSiteUrl,
} from "@/lib/seo/site";

type BuildPageMetadataOptions = {
  title: string;
  description?: string;
  path?: string;
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
};

function resolveImageUrl(image?: string | null) {
  const siteUrl = getSiteUrl();

  if (!image) {
    return `${siteUrl}${DEFAULT_OG_IMAGE}`;
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${siteUrl}${image.startsWith("/") ? image : `/${image}`}`;
}

export function buildPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  noIndex = false,
}: BuildPageMetadataOptions): Metadata {
  const siteUrl = getSiteUrl();
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const canonical = `${siteUrl}${canonicalPath === "/" ? "" : canonicalPath}`;
  const imageUrl = resolveImageUrl(image);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type,
      locale: "ml_IN",
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: imageUrl,
          alt: title,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function buildRootMetadata(): Metadata {
  const siteUrl = getSiteUrl();
  const imageUrl = `${siteUrl}${DEFAULT_OG_IMAGE}`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: HOME_PAGE_TITLE,
      template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    openGraph: {
      type: "website",
      locale: "ml_IN",
      siteName: SITE_NAME,
      title: HOME_PAGE_TITLE,
      description: DEFAULT_DESCRIPTION,
      images: [{ url: imageUrl, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: HOME_PAGE_TITLE,
      description: DEFAULT_DESCRIPTION,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
