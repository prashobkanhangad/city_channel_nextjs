import { getActiveCategoryBySlug } from "@/lib/db/categories";
import { pageMeta, type CategoryPageSlug } from "@/lib/mock/newsData";
import { buildPageMetadata } from "@/lib/seo/metadata";

const CATEGORY_SLUGS = [
  "kasaragod",
  "kerala",
  "national",
  "entertainment",
  "sports",
  "business",
] as const satisfies readonly CategoryPageSlug[];

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export function isCategorySlug(slug: string): slug is CategorySlug {
  return CATEGORY_SLUGS.includes(slug as CategorySlug);
}

export async function buildCategoryMetadata(slug: CategoryPageSlug) {
  const fallback = pageMeta[slug];

  try {
    const category = await getActiveCategoryBySlug(slug);

    return buildPageMetadata({
      title: category?.titleMl ?? fallback.titleMl,
      description: category?.description || fallback.description,
      path: `/${slug}`,
    });
  } catch {
    return buildPageMetadata({
      title: fallback.titleMl,
      description: fallback.description,
      path: `/${slug}`,
    });
  }
}
