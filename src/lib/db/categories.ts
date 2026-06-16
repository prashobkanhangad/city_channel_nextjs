import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/types/category";

type CategoryRow = {
  id: string;
  slug: string;
  title: string;
  title_ml: string;
  nav_label: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    titleMl: row.title_ml,
    navLabel: row.nav_label,
    description: row.description,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAllCategories(): Promise<Category[]> {
  const result = await getAllCategoriesPaginated(1, 10_000);
  return result.categories;
}

export async function getAllCategoriesPaginated(
  page = 1,
  pageSize = 15,
): Promise<{ categories: Category[]; totalCount: number }> {
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = getSupabaseAdmin();
  const { data, error, count } = await supabase
    .from("categories")
    .select("*", { count: "exact" })
    .order("sort_order", { ascending: true })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  return {
    categories: (data as CategoryRow[]).map(mapCategory),
    totalCount: count ?? 0,
  };
}

export async function getCategoriesCount(): Promise<number> {
  const supabase = getSupabaseAdmin();
  const { count, error } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true });

  if (error) {
    throw new Error(`Failed to count categories: ${error.message}`);
  }

  return count ?? 0;
}

export async function getActiveCategories(): Promise<Category[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  return (data as CategoryRow[]).map(mapCategory);
}

export async function getActiveCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch category: ${error.message}`);
  }

  return data ? mapCategory(data as CategoryRow) : null;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch category: ${error.message}`);
  }

  return data ? mapCategory(data as CategoryRow) : null;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch category: ${error.message}`);
  }

  return data ? mapCategory(data as CategoryRow) : null;
}

export async function createCategory(input: CreateCategoryInput): Promise<Category> {
  const supabase = getSupabaseAdmin();
  const { data: lastCategory } = await supabase
    .from("categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const sortOrder =
    lastCategory && typeof lastCategory.sort_order === "number"
      ? lastCategory.sort_order + 1
      : 0;

  const { data, error } = await supabase
    .from("categories")
    .insert({
      title: input.title,
      title_ml: input.titleMl,
      slug: input.slug,
      nav_label: input.navLabel,
      description: input.description ?? "",
      sort_order: sortOrder,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create category: ${error.message}`);
  }

  return mapCategory(data as CategoryRow);
}

export async function updateCategory(
  id: string,
  input: UpdateCategoryInput,
): Promise<Category | null> {
  const supabase = getSupabaseAdmin();
  const payload: Record<string, unknown> = {};

  if (input.title !== undefined) payload.title = input.title;
  if (input.titleMl !== undefined) payload.title_ml = input.titleMl;
  if (input.slug !== undefined) payload.slug = input.slug;
  if (input.navLabel !== undefined) payload.nav_label = input.navLabel;
  if (input.description !== undefined) payload.description = input.description;
  if (input.isActive !== undefined) payload.is_active = input.isActive;
  if (input.sortOrder !== undefined) payload.sort_order = input.sortOrder;

  const { data, error } = await supabase
    .from("categories")
    .update(payload)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to update category: ${error.message}`);
  }

  return data ? mapCategory(data as CategoryRow) : null;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { error, count } = await supabase
    .from("categories")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete category: ${error.message}`);
  }

  return (count ?? 0) > 0;
}
