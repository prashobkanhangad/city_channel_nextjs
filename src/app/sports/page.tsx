import { CategoryRoutePage } from "@/components/landing/CategoryRoutePage";
import { buildCategoryMetadata } from "@/lib/seo/categoryMetadata";

export async function generateMetadata() {
  return buildCategoryMetadata("sports");
}

type SportsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default function SportsPage({ searchParams }: SportsPageProps) {
  return <CategoryRoutePage slug="sports" searchParams={searchParams} />;
}
