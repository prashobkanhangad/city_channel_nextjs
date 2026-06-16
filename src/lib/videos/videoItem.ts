import { minutesAgoFromDate } from "@/lib/news/postNewsItem";
import { getYouTubeThumbnailUrl } from "@/lib/youtube/videoId";
import type { Video } from "@/types/video";

export type VideoItem = {
  id: string;
  title: string;
  minutesAgo: number;
  youtubeVideoId?: string;
  thumbnailUrl?: string | null;
};

export function videoToVideoItem(video: Video): VideoItem {
  const youtubeVideoId = video.youtubeVideoId ?? undefined;

  return {
    id: video.id,
    title: video.title,
    minutesAgo: minutesAgoFromDate(video.createdAt),
    youtubeVideoId,
    thumbnailUrl:
      video.thumbnailUrl ?? getYouTubeThumbnailUrl(video.youtubeVideoId),
  };
}
