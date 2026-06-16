import { CategoryPageContent } from "@/components/landing/CategoryPageContent";
import { SiteLayout } from "@/components/landing/SiteLayout";
import { getCategoryPageNews } from "@/lib/news/categoryPosts";
import { getHomepageNewsSections } from "@/lib/news/homePosts";
import { buildCategoryMetadata } from "@/lib/seo/categoryMetadata";
import { parsePageParam } from "@/lib/utils/pagination";

export async function generateMetadata() {
  return buildCategoryMetadata("kerala");
}

type KeralaPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function KeralaPage({ searchParams }: KeralaPageProps) {
  const { page: pageParam } = await searchParams;
  const page = parsePageParam(pageParam);

  const [categoryNews, homepage] = await Promise.all([
    getCategoryPageNews("kerala", page),
    getHomepageNewsSections(),
  ]);

  return (
    <SiteLayout activeHref="/kerala">
      <CategoryPageContent
        page="kerala"
        items={categoryNews.items}
        latest={homepage.latest}
        currentPage={categoryNews.currentPage}
        totalPages={categoryNews.totalPages}
        basePath="/kerala"
      />
    </SiteLayout>
  );
}
