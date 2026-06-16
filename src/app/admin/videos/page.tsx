import {
  getAdminHomepageVideosCount,
  getVideosPage,
} from "@/actions/videos";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminDatabaseSetupNotice } from "@/components/admin/AdminDatabaseSetupNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminVideoCreateForm } from "@/components/admin/AdminVideoCreateForm";
import { AdminVideoTable } from "@/components/admin/AdminVideoTable";
import { isMissingVideosTableError } from "@/lib/db/errors";
import { parsePageParam } from "@/lib/utils/pagination";

export const metadata = {
  title: "Videos | Admin | City Channel",
};

type AdminVideosPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AdminVideosPage({
  searchParams,
}: AdminVideosPageProps) {
  const { page: pageParam } = await searchParams;
  const page = parsePageParam(pageParam);

  let videosPage: Awaited<ReturnType<typeof getVideosPage>>;
  let homepageCount = 0;

  try {
    [videosPage, homepageCount] = await Promise.all([
      getVideosPage(page),
      getAdminHomepageVideosCount(),
    ]);
  } catch (error) {
    if (isMissingVideosTableError(error)) {
      return (
        <div className="space-y-6">
          <AdminPageHeader
            title="Videos"
            description="Manage video cards on /videos and the homepage."
            badge="Setup required"
          />
          <AdminDatabaseSetupNotice
            tableName="videos"
            migrationFile="supabase/migrations/20260316260000_create_videos.sql"
          />
        </div>
      );
    }

    throw error;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Videos"
        description="Add YouTube videos for the /videos page. Check “Show on homepage” to feature them on the main page."
      />

      <AdminCard
        title="Add video"
        description="Paste a YouTube link or video ID. Thumbnail is pulled from YouTube automatically."
      >
        <AdminVideoCreateForm />
      </AdminCard>

      <AdminCard
        title={`All videos (${videosPage.totalCount})`}
        description={`${homepageCount} shown on homepage`}
      >
        <AdminVideoTable videos={videosPage.items} />
        <AdminPagination
          basePath="/admin/videos"
          currentPage={videosPage.currentPage}
          totalPages={videosPage.totalPages}
        />
      </AdminCard>
    </div>
  );
}
