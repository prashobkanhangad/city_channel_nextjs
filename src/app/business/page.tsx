import { CategoryRoutePage } from "@/components/landing/CategoryRoutePage";
import { buildCategoryMetadata } from "@/lib/seo/categoryMetadata";

export async function generateMetadata() {
  return buildCategoryMetadata("business");
}

type BusinessPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default function BusinessPage({ searchParams }: BusinessPageProps) {
  return <CategoryRoutePage slug="business" searchParams={searchParams} />;
}
