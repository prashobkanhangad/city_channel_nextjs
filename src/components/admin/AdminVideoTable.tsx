"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  deleteVideo,
  toggleVideoActive,
  toggleVideoHomepage,
} from "@/actions/videos";
import { formatRelativeTime } from "@/lib/utils/time";
import { getYouTubeThumbnailUrl } from "@/lib/youtube/videoId";
import { minutesAgoFromDate } from "@/lib/news/postNewsItem";
import type { Video } from "@/types/video";

type AdminVideoTableProps = {
  videos: Video[];
};

export function AdminVideoTable({ videos }: AdminVideoTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleToggleActive(id: string, isActive: boolean) {
    startTransition(async () => {
      const result = await toggleVideoActive(id, isActive);
      if (!result.success) {
        alert(result.message);
        return;
      }
      router.refresh();
    });
  }

  function handleToggleHomepage(id: string, showOnHomepage: boolean) {
    startTransition(async () => {
      const result = await toggleVideoHomepage(id, showOnHomepage);
      if (!result.success) {
        alert(result.message);
        return;
      }
      router.refresh();
    });
  }

  function handleDelete(id: string, title: string) {
    const confirmed = window.confirm(`Delete video "${title}"?`);
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteVideo(id);
      if (!result.success) {
        alert(result.message);
        return;
      }
      router.refresh();
    });
  }

  if (videos.length === 0) {
    return (
      <p className="border-t border-zinc-100 py-8 text-center text-sm text-zinc-500">
        No videos yet. Add your first video above.
      </p>
    );
  }

  return (
    <div className="space-y-4 border-t border-zinc-100 pt-4">
      {videos.map((video) => {
        const thumbnail =
          video.thumbnailUrl ?? getYouTubeThumbnailUrl(video.youtubeVideoId);

        return (
          <article
            key={video.id}
            className={`rounded-xl border border-zinc-200 p-4 ${!video.isActive ? "opacity-60" : ""}`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="relative h-20 w-36 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                {thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                    No thumbnail
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-semibold text-zinc-900">{video.title}</h4>
                  {video.isActive ? (
                    <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700 ring-1 ring-green-200">
                      Active
                    </span>
                  ) : (
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-600 ring-1 ring-zinc-200">
                      Disabled
                    </span>
                  )}
                  {video.showOnHomepage ? (
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700 ring-1 ring-red-200">
                      Homepage
                    </span>
                  ) : null}
                </div>

                <p className="mt-1 text-xs text-zinc-500">
                  {formatRelativeTime(minutesAgoFromDate(video.createdAt))}
                  {video.youtubeVideoId
                    ? ` · YouTube: ${video.youtubeVideoId}`
                    : " · No YouTube ID"}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleToggleHomepage(video.id, video.showOnHomepage)}
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
                >
                  {video.showOnHomepage ? "Remove from home" : "Show on home"}
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleToggleActive(video.id, video.isActive)}
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
                >
                  {video.isActive ? "Disable" : "Enable"}
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleDelete(video.id, video.title)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
