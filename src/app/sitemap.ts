import type { MetadataRoute } from "next";
import { getActiveCategories } from "@/lib/db/categories";
import { getPublishedPosts } from "@/lib/db/posts";
import { getSiteUrl } from "@/lib/seo/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "hourly", priority: 1 },
    {
      url: `${baseUrl}/videos`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/live-tv`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  let categoryRoutes: MetadataRoute.Sitemap = [];

  try {
    const categories = await getActiveCategories();
    categoryRoutes = categories.map((category) => ({
      url: `${baseUrl}/${category.slug}`,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.9,
    }));
  } catch {
    categoryRoutes = [
      "kasaragod",
      "kerala",
      "national",
      "entertainment",
      "sports",
      "business",
    ].map((slug) => ({
      url: `${baseUrl}/${slug}`,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.9,
    }));
  }

  try {
    const posts = await getPublishedPosts(500);

    const articleRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/news/${post.id}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
  } catch {
    return [...staticRoutes, ...categoryRoutes];
  }
}
