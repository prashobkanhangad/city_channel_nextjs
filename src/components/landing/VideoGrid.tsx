import Link from "next/link";
import { PostFeaturedImage } from "@/components/landing/PostImage";
import { CITY_TV_CHANNEL_URL } from "@/lib/constants/youtube";
import type { VideoItem } from "@/lib/videos/videoItem";
import { formatRelativeTime } from "@/lib/utils/time";

export function VideoGridCard({ video }: { video: VideoItem }) {
  const href = video.youtubeVideoId
    ? `https://www.youtube.com/watch?v=${video.youtubeVideoId}`
    : CITY_TV_CHANNEL_URL;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="relative">
        <PostFeaturedImage
          src={video.thumbnailUrl}
          alt={video.title}
          aspectClassName="aspect-video"
          className="rounded-none"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/25 transition group-hover:bg-black/35">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-red-600 text-lg text-white shadow-lg">
            ▶
          </span>
        </div>
      </div>
      <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-5 text-zinc-950 group-hover:text-red-700">
        {video.title}
      </h3>
      <p className="mt-1 text-xs text-zinc-500">
        {formatRelativeTime(video.minutesAgo)}
      </p>
    </Link>
  );
}

export function VideoGrid({ videos }: { videos: VideoItem[] }) {
  if (videos.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-zinc-500">
        No videos available yet.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <VideoGridCard key={video.id} video={video} />
      ))}
    </div>
  );
}
