import type { Article } from "@/lib/news/getArticle";
import type { NewsItem } from "@/lib/mock/newsData";
import {
  DEFAULT_DESCRIPTION,
  getSiteUrl,
  SITE_ALTERNATE_NAME,
  SITE_NAME,
  SITE_SOCIAL_LINKS,
} from "@/lib/seo/site";

const ORGANIZATION_ID_SUFFIX = "#organization";
const WEBSITE_ID_SUFFIX = "#website";

function getOrganizationId(siteUrl: string) {
  return `${siteUrl}/${ORGANIZATION_ID_SUFFIX}`;
}

function getWebsiteId(siteUrl: string) {
  return `${siteUrl}/${WEBSITE_ID_SUFFIX}`;
}

export function buildNewsArticleJsonLd(article: Article, id: string) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/news/${id}`;

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    inLanguage: "ml-IN",
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      "@id": getOrganizationId(siteUrl),
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    ...(article.imageUrl ? { image: [article.imageUrl] } : {}),
    ...(article.publishedAt
      ? { datePublished: article.publishedAt }
      : {}),
    ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
  };
}

export function buildOrganizationJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@type": "NewsMediaOrganization",
    "@id": getOrganizationId(siteUrl),
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAME,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/logo.png`,
    },
    description: DEFAULT_DESCRIPTION,
    sameAs: [...SITE_SOCIAL_LINKS],
  };
}

export function buildWebSiteJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@type": "WebSite",
    "@id": getWebsiteId(siteUrl),
    url: siteUrl,
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAME,
    description: DEFAULT_DESCRIPTION,
    inLanguage: "ml-IN",
    publisher: {
      "@id": getOrganizationId(siteUrl),
    },
  };
}

export function buildHomepageItemListJsonLd(items: NewsItem[]) {
  const siteUrl = getSiteUrl();

  return {
    "@type": "ItemList",
    name: `${SITE_NAME} — പ്രധാന വാർത്തകൾ`,
    itemListElement: items.slice(0, 10).map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}/news/${item.id}`,
      name: item.title,
    })),
  };
}

export function buildHomepageJsonLd(items: NewsItem[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationJsonLd(),
      buildWebSiteJsonLd(),
      buildHomepageItemListJsonLd(items),
    ],
  };
}

// Kept for backwards compatibility where only organization schema is needed.
export function buildOrganizationJsonLdDocument() {
  return {
    "@context": "https://schema.org",
    ...buildOrganizationJsonLd(),
  };
}
