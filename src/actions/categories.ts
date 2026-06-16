"use server";

import { revalidatePath } from "next/cache";
import {
  createCategory as createCategoryInDb,
  deleteCategory as deleteCategoryInDb,
  getAllCategoriesPaginated,
  getCategoriesCount as getCategoriesCountFromDb,
  getCategoryById,
  updateCategory,
} from "@/lib/db/categories";
import { ADMIN_PAGE_SIZE } from "@/lib/constants/pagination";
import {
  buildPaginatedResult,
  parsePageParam,
  type PaginatedResult,
} from "@/lib/utils/pagination";
import { createCategorySchema } from "@/lib/validations/category";
import type { Category } from "@/types/category";

export type CategoryActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function getCategories(): Promise<Category[]> {
  const page = await getCategoriesPage(1);
  return page.items;
}

export async function getCategoriesPage(
  page = 1,
): Promise<PaginatedResult<Category>> {
  const currentPage = parsePageParam(String(page));
  const { categories, totalCount } = await getAllCategoriesPaginated(
    currentPage,
    ADMIN_PAGE_SIZE,
  );

  return buildPaginatedResult(
    categories,
    totalCount,
    currentPage,
    ADMIN_PAGE_SIZE,
  );
}

export async function getAdminCategoriesCount(): Promise<number> {
  return getCategoriesCountFromDb();
}

function revalidateCategoryPublicPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/admin/categories");

  if (slug) {
    revalidatePath(`/${slug}`);
  }
}

export async function createCategory(
  _prevState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const parsed = createCategorySchema.safeParse({
    title: formData.get("title"),
    titleMl: formData.get("titleMl"),
    slug: String(formData.get("slug") ?? "")
      .trim()
      .toLowerCase(),
    navLabel: formData.get("navLabel"),
    description: formData.get("description") || "",
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createCategoryInDb(parsed.data);
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create category.",
    };
  }

  revalidatePath("/admin");
  revalidateCategoryPublicPaths(parsed.data.slug);

  return {
    success: true,
    message: "Category created successfully.",
  };
}

export async function toggleCategoryActive(
  id: string,
  isActive: boolean,
): Promise<CategoryActionState> {
  try {
    const category = await updateCategory(id, { isActive });

    if (!category) {
      return { success: false, message: "Category not found." };
    }

    revalidatePath("/admin");
    revalidateCategoryPublicPaths(category.slug);
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update category.",
    };
  }

  revalidatePath("/admin");
  revalidateCategoryPublicPaths();

  return {
    success: true,
    message: isActive ? "Category enabled." : "Category disabled.",
  };
}

export async function deleteCategory(id: string): Promise<CategoryActionState> {
  let slug: string | undefined;

  try {
    const existing = await getCategoryById(id);
    slug = existing?.slug;
  } catch {
    // Continue with delete even if lookup fails.
  }

  try {
    const deleted = await deleteCategoryInDb(id);

    if (!deleted) {
      return { success: false, message: "Category not found." };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete category.",
    };
  }

  revalidatePath("/admin");
  revalidateCategoryPublicPaths(slug);

  return { success: true, message: "Category deleted." };
}
