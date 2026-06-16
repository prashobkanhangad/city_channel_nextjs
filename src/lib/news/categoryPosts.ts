import { CATEGORY_PAGE_SIZE } from "@/lib/constants/pagination";
import { getActiveCategoryBySlug } from "@/lib/db/categories";
import { getPublishedPostsByCityPaginated } from "@/lib/db/posts";
import {
  getNewsForPage,
  pageMeta,
  type CategoryPageSlug,
  type NewsItem,
} from "@/lib/mock/newsData";
import { postToNewsItem } from "@/lib/news/postNewsItem";
import {
  clampPage,
  getTotalPages,
  parsePageParam,
} from "@/lib/utils/pagination";

export type CategoryPageNews = {
  items: NewsItem[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
};

function paginateMockCategoryNews(
  slug: CategoryPageSlug,
  page: number,
): CategoryPageNews {
  const allItems = getNewsForPage(slug);
  const totalCount = allItems.length;
  const totalPages = getTotalPages(totalCount, CATEGORY_PAGE_SIZE);
  const currentPage = clampPage(page, totalPages);
  const start = (currentPage - 1) * CATEGORY_PAGE_SIZE;

  return {
    items: allItems.slice(start, start + CATEGORY_PAGE_SIZE),
    currentPage,
    totalPages,
    totalCount,
  };
}

export async function getCategoryPageNews(
  slug: CategoryPageSlug,
  page = 1,
): Promise<CategoryPageNews> {
  const currentPage = parsePageParam(String(page));

  try {
    const category = await getActiveCategoryBySlug(slug);
    const city = category?.title ?? pageMeta[slug].title;
    const { posts, totalCount } = await getPublishedPostsByCityPaginated(
      city,
      currentPage,
      CATEGORY_PAGE_SIZE,
    );

    if (totalCount > 0) {
      const totalPages = getTotalPages(totalCount, CATEGORY_PAGE_SIZE);

      return {
        items: posts.map(postToNewsItem),
        currentPage: clampPage(currentPage, totalPages),
        totalPages,
        totalCount,
      };
    }
  } catch {
    // Fall back to mock content below.
  }

  return paginateMockCategoryNews(slug, currentPage);
}

export { CATEGORY_PAGE_SIZE };
