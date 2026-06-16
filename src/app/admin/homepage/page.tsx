import { getHomepageVideoSettings } from "@/actions/homepage";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminDatabaseSetupNotice } from "@/components/admin/AdminDatabaseSetupNotice";
import { AdminHomepageSectionsManager } from "@/components/admin/AdminHomepageSectionsManager";
import { AdminHomepageVideoSettings } from "@/components/admin/AdminHomepageVideoSettings";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  HOMEPAGE_SECTIONS,
  type HomepageSection,
} from "@/lib/constants/homepageSections";
import {
  isMissingHomepageSettingsTableError,
  isMissingPostsTableError,
} from "@/lib/db/errors";
import { getPostsByHomepageSection } from "@/lib/db/posts";
import type { Post } from "@/types";

export const metadata = {
  title: "Homepage | Admin | City Channel",
};

function emptySectionPosts(): Record<HomepageSection, Post[]> {
  return {
    trending: [],
    must_read: [],
    special: [],
    entertainment: [],
    sports: [],
    business: [],
  };
}

export default async function AdminHomepagePage() {
  let sectionPosts = emptySectionPosts();
  let youtubeVideoUrl = "";
  let homepageSettingsReady = true;

  try {
    const settings = await getHomepageVideoSettings();
    youtubeVideoUrl = settings.youtubeVideoUrl;
  } catch (error) {
    if (isMissingHomepageSettingsTableError(error)) {
      homepageSettingsReady = false;
    } else {
      throw error;
    }
  }

  try {
    const results = await Promise.all(
      HOMEPAGE_SECTIONS.map((section) =>
        getPostsByHomepageSection(section.value, 20),
      ),
    );

    sectionPosts = Object.fromEntries(
      HOMEPAGE_SECTIONS.map((section, index) => [
        section.value,
        results[index] ?? [],
      ]),
    ) as Record<HomepageSection, Post[]>;
  } catch (error) {
    if (isMissingPostsTableError(error)) {
      return (
        <div className="space-y-6">
          <AdminPageHeader
            title="Homepage"
            description="Manage the homepage hero video and section placements."
            badge="Setup required"
          />
          <AdminDatabaseSetupNotice
            tableName="posts"
            migrationFile="supabase/migrations/20260316250000_post_homepage_sections.sql"
          />
        </div>
      );
    }

    throw error;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Homepage"
        description="Set the City TV YouTube player and assign posts to homepage columns."
      />

      {homepageSettingsReady ? (
        <AdminCard
          title="City TV video"
          description="YouTube player shown at the top of the homepage, above the main stories."
        >
          <AdminHomepageVideoSettings youtubeVideoUrl={youtubeVideoUrl} />
        </AdminCard>
      ) : (
        <AdminDatabaseSetupNotice
          tableName="homepage_settings"
          migrationFile="supabase/migrations/20260316290000_create_homepage_settings.sql"
        />
      )}

      <AdminCard
        title="Trending, Must Read & Special"
        description="First homepage row below the main stories."
      >
        <AdminHomepageSectionsManager
          sectionPosts={sectionPosts}
          sections={HOMEPAGE_SECTIONS.filter(
            (section) =>
              section.value === "trending" ||
              section.value === "must_read" ||
              section.value === "special",
          )}
        />
      </AdminCard>

      <AdminCard
        title="Entertainment, Sports & Business"
        description="Second homepage row below the middle banner ad."
      >
        <AdminHomepageSectionsManager
          sectionPosts={sectionPosts}
          sections={HOMEPAGE_SECTIONS.filter(
            (section) =>
              section.value === "entertainment" ||
              section.value === "sports" ||
              section.value === "business",
          )}
        />
      </AdminCard>
    </div>
  );
}
