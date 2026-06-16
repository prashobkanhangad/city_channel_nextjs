import { getAdvertisementsPage } from "@/actions/advertisements";
import { AdminAdCreateForm } from "@/components/admin/AdminAdCreateForm";
import { AdminAdTable } from "@/components/admin/AdminAdTable";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminDatabaseSetupNotice } from "@/components/admin/AdminDatabaseSetupNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AD_PLACEMENTS } from "@/lib/constants/adPlacements";
import { isMissingAdvertisementsTableError } from "@/lib/db/errors";
import { parsePageParam } from "@/lib/utils/pagination";

export const metadata = {
  title: "Advertisements | Admin | City Channel",
};

type AdminAdvertisementsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AdminAdvertisementsPage({
  searchParams,
}: AdminAdvertisementsPageProps) {
  const { page: pageParam } = await searchParams;
  const page = parsePageParam(pageParam);

  let advertisementsPage: Awaited<ReturnType<typeof getAdvertisementsPage>>;

  try {
    advertisementsPage = await getAdvertisementsPage(page);
  } catch (error) {
    if (isMissingAdvertisementsTableError(error)) {
      return (
        <div className="space-y-6">
          <AdminPageHeader
            title="Advertisements"
            description="Manage ad slots on the homepage and sidebars."
            badge="Setup required"
          />
          <AdminDatabaseSetupNotice
            tableName="advertisements"
            migrationFile="supabase/migrations/20260316200000_create_advertisements.sql"
          />
        </div>
      );
    }
    throw error;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Advertisements"
        description="Manage ad slots on the homepage and category/article sidebars."
      />

      <AdminCard
        title="Ad placements"
        description="Each placement shows the highest-priority active ad (lowest sort order)."
      >
        <ul className="grid gap-2 sm:grid-cols-2">
          {AD_PLACEMENTS.map((placement) => (
            <li
              key={placement.value}
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700"
            >
              <p className="font-medium text-zinc-900">{placement.label}</p>
              <p className="mt-1 text-xs text-zinc-500">
                {placement.recommendedSize} · {placement.ratio} · Max{" "}
                {placement.maxFileSize}
              </p>
            </li>
          ))}
        </ul>
      </AdminCard>

      <AdminCard
        title="Add advertisement"
        description="Upload an image directly (auto-compressed to WebP) or paste an image URL."
      >
        <AdminAdCreateForm />
      </AdminCard>

      <AdminCard title={`All advertisements (${advertisementsPage.totalCount})`}>
        <AdminAdTable advertisements={advertisementsPage.items} />
        <AdminPagination
          basePath="/admin/advertisements"
          currentPage={advertisementsPage.currentPage}
          totalPages={advertisementsPage.totalPages}
        />
      </AdminCard>
    </div>
  );
}
