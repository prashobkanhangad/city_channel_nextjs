import { CategoryPageContent } from "@/components/landing/CategoryPageContent";
import { SiteLayout } from "@/components/landing/SiteLayout";
import { getCategoryPageNews } from "@/lib/news/categoryPosts";
import { getHomepageNewsSections } from "@/lib/news/homePosts";
import { buildCategoryMetadata } from "@/lib/seo/categoryMetadata";
import { parsePageParam } from "@/lib/utils/pagination";

export async function generateMetadata() {
  return buildCategoryMetadata("kasaragod");
}

type KasaragodPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function KasaragodPage({ searchParams }: KasaragodPageProps) {
  const { page: pageParam } = await searchParams;
  const page = parsePageParam(pageParam);

  const [categoryNews, homepage] = await Promise.all([
    getCategoryPageNews("kasaragod", page),
    getHomepageNewsSections(),
  ]);

  return (
    <SiteLayout activeHref="/kasaragod">
      <CategoryPageContent
        page="kasaragod"
        items={categoryNews.items}
        latest={homepage.latest}
        currentPage={categoryNews.currentPage}
        totalPages={categoryNews.totalPages}
        basePath="/kasaragod"
      />
    </SiteLayout>
  );
}
