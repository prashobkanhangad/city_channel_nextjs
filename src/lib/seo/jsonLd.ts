import { getSiteUrl } from "@/lib/seo/site";
import type { Article } from "@/lib/news/getArticle";

export function buildNewsArticleJsonLd(article: Article, id: string) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/news/${id}`;

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "സിറ്റി ചാനൽ",
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
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "സിറ്റി ചാനൽ",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
  };
}
