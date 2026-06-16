import { CategoryPageContent } from "@/components/landing/CategoryPageContent";
import { SiteLayout } from "@/components/landing/SiteLayout";
import { getCategoryPageNews } from "@/lib/news/categoryPosts";
import { getHomepageNewsSections } from "@/lib/news/homePosts";
import type { CategoryPageSlug } from "@/lib/mock/newsData";
import { parsePageParam } from "@/lib/utils/pagination";

type CategoryRoutePageProps = {
  slug: CategoryPageSlug;
  searchParams: Promise<{ page?: string }>;
};

export async function CategoryRoutePage({
  slug,
  searchParams,
}: CategoryRoutePageProps) {
  const { page: pageParam } = await searchParams;
  const page = parsePageParam(pageParam);

  const [categoryNews, homepage] = await Promise.all([
    getCategoryPageNews(slug, page),
    getHomepageNewsSections(),
  ]);

  const basePath = `/${slug}`;

  return (
    <SiteLayout activeHref={basePath}>
      <CategoryPageContent
        page={slug}
        items={categoryNews.items}
        latest={homepage.latest}
        currentPage={categoryNews.currentPage}
        totalPages={categoryNews.totalPages}
        basePath={basePath}
      />
    </SiteLayout>
  );
}
