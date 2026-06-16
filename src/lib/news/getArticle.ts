import {
  getPublishedPostById,
  incrementPostViewCount,
} from "@/lib/db/posts";
import {
  getAllNewsItems,
  type NewsItem,
} from "@/lib/mock/newsData";
import { isUuid } from "@/lib/utils/uuid";

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  section: string;
  author: string;
  city: string;
  imageUrl?: string | null;
  minutesAgo?: number;
  publishedAt?: string;
  updatedAt?: string;
};

function mockToArticle(item: NewsItem): Article {
  return {
    id: item.id,
    title: item.title,
    excerpt: item.excerpt,
    content: `${item.excerpt}\n\nവിശദവിവരങ്ങൾ ഉടൻ ലഭ്യമാകും. സിറ്റി ചാനൽ വാർത്താ ഡെസ്ക് നടത്തുന്ന തുടർ പരിശോധനയിൽ കൂടുതൽ അപ്ഡേറ്റുകൾ നൽകും. പ്രാദേശിക അധികാരികളും ബന്ധപ്പെട്ട വകുപ്പുകളും വിഷയത്തിൽ പ്രതികരണം നൽകുന്നതിനായി നിരീക്ഷണം തുടരുന്നു.`,
    section: item.section,
    author: "City News Desk",
    city: item.section,
    minutesAgo: item.minutesAgo,
  };
}

export async function recordArticleView(id: string): Promise<void> {
  const isMock = getAllNewsItems().some((item) => item.id === id);
  if (isMock || !isUuid(id)) return;

  const post = await getPublishedPostById(id);
  if (!post) return;

  try {
    await incrementPostViewCount(id);
  } catch {
    // View tracking should not block article rendering.
  }
}

export async function getArticleById(id: string): Promise<Article | null> {
  const mockItem = getAllNewsItems().find((item) => item.id === id);
  if (mockItem) {
    return mockToArticle(mockItem);
  }

  if (!isUuid(id)) {
    return null;
  }

  const post = await getPublishedPostById(id);
  if (post) {
    return {
      id: post.id,
      title: post.title,
      excerpt: post.content.slice(0, 160),
      content: post.content,
      section: post.city,
      author: post.author,
      city: post.city,
      imageUrl: post.imageUrl,
      publishedAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  return null;
}

export function getRelatedArticles(id: string, limit = 5): Article[] {
  const mockItem = getAllNewsItems().find((item) => item.id === id);
  const currentSection = mockItem?.section;

  const pool = getAllNewsItems().filter((item) => item.id !== id);
  const sameSection = currentSection
    ? pool.filter((item) => item.section === currentSection)
    : [];
  const related = (sameSection.length > 0 ? sameSection : pool).slice(0, limit);

  return related.map(mockToArticle);
}
