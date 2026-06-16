import Link from "next/link";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminDatabaseSetupNotice } from "@/components/admin/AdminDatabaseSetupNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { adminNavItems } from "@/components/admin/adminNavItems";
import { PostThumbImage } from "@/components/landing/PostImage";
import { getAdminCategoriesCount } from "@/actions/categories";
import {
  getAdminPostsCount,
  getRecentPostsForAdmin,
  getTotalPostViews,
} from "@/actions/posts";
import { getAdminVideosCount } from "@/actions/videos";
import {
  isMissingCategoriesTableError,
  isMissingPostsTableError,
  isMissingVideosTableError,
} from "@/lib/db/errors";
import { formatViewCount } from "@/lib/utils/views";

export default async function AdminDashboardPage() {
  let recentPosts: Awaited<ReturnType<typeof getRecentPostsForAdmin>> = [];
  let postCount = 0;
  let totalViews = 0;

  try {
    [recentPosts, postCount, totalViews] = await Promise.all([
      getRecentPostsForAdmin(5),
      getAdminPostsCount(),
      getTotalPostViews(),
    ]);
  } catch (error) {
    if (isMissingPostsTableError(error)) {
      return (
        <div className="space-y-6">
          <AdminPageHeader
            title="Dashboard"
            description="Overview of your news portal content and quick links."
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

  const contentSections = adminNavItems.filter((item) => item.href !== "/admin");

  let categoryCount = 0;
  let videoCount = 0;
  try {
    categoryCount = await getAdminCategoriesCount();
  } catch (error) {
    if (!isMissingCategoriesTableError(error)) {
      throw error;
    }
  }

  try {
    videoCount = await getAdminVideosCount();
  } catch (error) {
    if (!isMissingVideosTableError(error)) {
      throw error;
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your news portal content and quick links."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-zinc-500">Total posts</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">{postCount}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-zinc-500">Categories</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">{categoryCount}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-zinc-500">Videos</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">{videoCount}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-zinc-500">Total views</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">
            {formatViewCount(totalViews)}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-zinc-500">API status</p>
          <p className="mt-2 text-lg font-semibold text-green-700">Online</p>
        </div>
      </div>

      <AdminCard title="Content sections">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {contentSections.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg border border-zinc-200 px-4 py-3 hover:border-red-200 hover:bg-red-50/40"
            >
              <p className="font-semibold text-zinc-900">{item.label}</p>
              <p className="mt-1 text-xs text-zinc-500">Manage {item.label.toLowerCase()}</p>
            </Link>
          ))}
        </div>
      </AdminCard>

      <AdminCard title="Recent posts">
        <div className="mb-4 flex justify-end">
          <Link
            href="/admin/posts"
            className="text-sm font-medium text-red-700 hover:underline"
          >
            View all
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <p className="py-4 text-center text-sm text-zinc-500">
            No posts yet. Create your first post from the Posts page.
          </p>
        ) : (
          <div className="divide-y divide-zinc-100">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-start gap-4 py-4">
                <PostThumbImage
                  src={post.imageUrl}
                  alt={post.title}
                  className="h-16 w-24"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-zinc-900">{post.title}</p>
                  <p className="mt-1 line-clamp-1 text-sm text-zinc-600">
                    {post.content}
                  </p>
                  <p className="mt-2 text-xs text-zinc-500">
                    {post.author} · {post.city} · {formatViewCount(post.viewCount)} views
                  </p>
                </div>
                <time className="shrink-0 text-xs text-zinc-500">
                  {new Date(post.createdAt).toLocaleDateString("en-IN")}
                </time>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
