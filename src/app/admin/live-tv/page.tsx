import { getLiveTvSettings } from "@/actions/liveTv";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminDatabaseSetupNotice } from "@/components/admin/AdminDatabaseSetupNotice";
import { AdminLiveTvSettings } from "@/components/admin/AdminLiveTvSettings";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { isMissingTableError } from "@/lib/db/errors";

export const metadata = {
  title: "Live TV | Admin | City Channel",
};

export default async function AdminLiveTvPage() {
  try {
    const { streamUrl } = await getLiveTvSettings();

    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Live TV"
          description="Set the YouTube URL used on the public /live-tv page."
        />

        <AdminCard
          title="Live TV URL"
          description="Paste a YouTube channel URL, video URL, or embed link."
        >
          <AdminLiveTvSettings streamUrl={streamUrl} />
        </AdminCard>
      </div>
    );
  } catch (error) {
    if (isMissingTableError(error, "live_tv_settings")) {
      return (
        <div className="space-y-6">
          <AdminPageHeader
            title="Live TV"
            description="Set the YouTube URL used on the public /live-tv page."
            badge="Setup required"
          />
          <AdminDatabaseSetupNotice
            tableName="live_tv_settings"
            migrationFile="supabase/migrations/20260316220000_create_live_tv_settings.sql"
          />
        </div>
      );
    }

    throw error;
  }
}
