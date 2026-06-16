import { getCategoriesPage } from "@/actions/categories";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminCategoryCreateForm } from "@/components/admin/AdminCategoryCreateForm";
import { AdminCategoryTable } from "@/components/admin/AdminCategoryTable";
import { AdminDatabaseSetupNotice } from "@/components/admin/AdminDatabaseSetupNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { isMissingCategoriesTableError } from "@/lib/db/errors";
import { parsePageParam } from "@/lib/utils/pagination";

export const metadata = {
  title: "Categories | Admin | City Channel",
};

type AdminCategoriesPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AdminCategoriesPage({
  searchParams,
}: AdminCategoriesPageProps) {
  const { page: pageParam } = await searchParams;
  const page = parsePageParam(pageParam);

  let categoriesPage: Awaited<ReturnType<typeof getCategoriesPage>>;

  try {
    categoriesPage = await getCategoriesPage(page);
  } catch (error) {
    if (isMissingCategoriesTableError(error)) {
      return (
        <div className="space-y-6">
          <AdminPageHeader
            title="Categories"
            description="Manage Kasaragod, Kerala, National, Entertainment, Sports, Business, and other sections."
            badge="Setup required"
          />
          <AdminDatabaseSetupNotice
            tableName="categories"
            migrationFile="supabase/migrations/20260316190000_create_categories.sql"
          />
        </div>
      );
    }
    throw error;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Categories"
        description="Manage category pages shown in the public navigation."
      />

      <AdminCard
        title={`Category manager (${categoriesPage.totalCount})`}
        description="Add, enable, disable, or delete categories."
      >
        <div className="space-y-6">
          <AdminCategoryCreateForm />
          <AdminCategoryTable categories={categoriesPage.items} />
        </div>
        <AdminPagination
          basePath="/admin/categories"
          currentPage={categoriesPage.currentPage}
          totalPages={categoriesPage.totalPages}
        />
      </AdminCard>
    </div>
  );
}
