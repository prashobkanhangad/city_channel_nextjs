import { getActiveCategories } from "@/lib/db/categories";
import { contactNavLink, mainNavLinks } from "@/lib/mock/newsData";
import type { Category } from "@/types/category";

export type PublicNavLink = {
  label: string;
  href: string;
};

const staticNavLinks: PublicNavLink[] = [
  { label: "HOME", href: "/" },
  { label: "VIDEOS", href: "/videos" },
];

function categoriesToNavLinks(categories: Category[]): PublicNavLink[] {
  return categories.map((category) => ({
    label: category.navLabel,
    href: `/${category.slug}`,
  }));
}

export async function getPublicNavLinks(): Promise<PublicNavLink[]> {
  try {
    const categories = await getActiveCategories();

    if (categories.length === 0) {
      return [...mainNavLinks];
    }

    return [staticNavLinks[0], ...categoriesToNavLinks(categories), staticNavLinks[1]];
  } catch {
    return [...mainNavLinks];
  }
}

export async function getPublicCategories(): Promise<Category[]> {
  try {
    return await getActiveCategories();
  } catch {
    return [];
  }
}

export { contactNavLink };
