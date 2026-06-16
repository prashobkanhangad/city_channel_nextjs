import { CategoryRoutePage } from "@/components/landing/CategoryRoutePage";
import { buildCategoryMetadata } from "@/lib/seo/categoryMetadata";

export async function generateMetadata() {
  return buildCategoryMetadata("entertainment");
}

type EntertainmentPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default function EntertainmentPage({ searchParams }: EntertainmentPageProps) {
  return <CategoryRoutePage slug="entertainment" searchParams={searchParams} />;
}
