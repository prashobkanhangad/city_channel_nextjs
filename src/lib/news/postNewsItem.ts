import type { Post } from "@/types";
import type { NewsItem } from "@/lib/mock/newsData";

export function minutesAgoFromDate(iso: string): number {
  const diffMs = Date.now() - new Date(iso).getTime();
  return Math.max(1, Math.floor(diffMs / 60_000));
}

export function postToNewsItem(post: Post): NewsItem {
  return {
    id: post.id,
    title: post.title,
    excerpt: post.content.slice(0, 160),
    section: post.city,
    minutesAgo: minutesAgoFromDate(post.createdAt),
    imageUrl: post.imageUrl,
  };
}

export function getCategoryPathForCity(city?: string) {
  const normalized = city?.trim().toLowerCase();

  if (
    normalized === "kasaragod" ||
    normalized === "kerala" ||
    normalized === "national" ||
    normalized === "entertainment" ||
    normalized === "sports" ||
    normalized === "business"
  ) {
    return `/${normalized}`;
  }

  return null;
}
