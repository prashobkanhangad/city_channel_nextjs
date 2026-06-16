import AdminCreatePostForm from "@/components/admin/AdminCreatePostForm";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminDatabaseSetupNotice } from "@/components/admin/AdminDatabaseSetupNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminPostRow } from "@/components/admin/AdminPostRow";
import { getPostsPage, getTotalPostViews } from "@/actions/posts";
import { isMissingPostsTableError } from "@/lib/db/errors";
import { parsePageParam } from "@/lib/utils/pagination";
import { formatViewCount } from "@/lib/utils/views";

export const metadata = {
  title: "Posts | Admin | City Channel",
};

type AdminPostsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AdminPostsPage({ searchParams }: AdminPostsPageProps) {
  const { page: pageParam } = await searchParams;
  const page = parsePageParam(pageParam);

  let postsPage: Awaited<ReturnType<typeof getPostsPage>>;
  let totalViews = 0;

  try {
    [postsPage, totalViews] = await Promise.all([
      getPostsPage(page),
      getTotalPostViews(),
    ]);
  } catch (error) {
    if (isMissingPostsTableError(error)) {
      return (
        <div className="space-y-6">
          <AdminPageHeader
            title="Posts"
            description="Create, edit, and manage news posts."
            badge="Setup required"
          />
          <AdminDatabaseSetupNotice
            tableName="posts"
            migrationFile="supabase/migrations/20260316180000_create_posts.sql"
          />
        </div>
      );
    }
    throw error;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Posts"
        description="Create, edit, and manage news posts."
      />

      <AdminCard
        title="Create new post"
        description="Set section and status, then publish. Drafts stay hidden on the public site."
      >
        <AdminCreatePostForm />
      </AdminCard>

      <AdminCard
        title={`All posts (${postsPage.totalCount})`}
        description={`${formatViewCount(totalViews)} total views across all posts`}
      >
        {postsPage.items.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-zinc-500">
            No posts yet. Publish your first post above.
          </p>
        ) : (
          <div className="divide-y divide-zinc-100">
            {postsPage.items.map((post) => (
              <AdminPostRow key={post.id} post={post} />
            ))}
          </div>
        )}

        <AdminPagination
          basePath="/admin/posts"
          currentPage={postsPage.currentPage}
          totalPages={postsPage.totalPages}
        />
      </AdminCard>
    </div>
  );
}
