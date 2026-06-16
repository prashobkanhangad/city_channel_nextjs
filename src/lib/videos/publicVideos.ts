import { VIDEOS_PAGE_SIZE } from "@/lib/constants/pagination";
import { getActiveVideosPaginated } from "@/lib/db/videos";
import { videos as mockVideos } from "@/lib/mock/videosData";
import { videoToVideoItem, type VideoItem } from "@/lib/videos/videoItem";
import {
  clampPage,
  getTotalPages,
  parsePageParam,
} from "@/lib/utils/pagination";

export type PublicVideosPage = {
  videos: VideoItem[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
};

function paginateMockVideos(page: number): PublicVideosPage {
  const totalCount = mockVideos.length;
  const totalPages = getTotalPages(totalCount, VIDEOS_PAGE_SIZE);
  const currentPage = clampPage(page, totalPages);
  const start = (currentPage - 1) * VIDEOS_PAGE_SIZE;

  return {
    videos: mockVideos.slice(start, start + VIDEOS_PAGE_SIZE),
    currentPage,
    totalPages,
    totalCount,
  };
}

export async function getPublicVideosPage(page = 1): Promise<PublicVideosPage> {
  const currentPage = parsePageParam(String(page));

  try {
    const { videos, totalCount } = await getActiveVideosPaginated(
      currentPage,
      VIDEOS_PAGE_SIZE,
    );

    if (totalCount > 0) {
      const totalPages = getTotalPages(totalCount, VIDEOS_PAGE_SIZE);

      return {
        videos: videos.map(videoToVideoItem),
        currentPage: clampPage(currentPage, totalPages),
        totalPages,
        totalCount,
      };
    }
  } catch {
    // Fall back to mock content below.
  }

  return paginateMockVideos(currentPage);
}

export async function getPublicVideos(): Promise<VideoItem[]> {
  const page = await getPublicVideosPage(1);
  return page.videos;
}

export async function getPublicHomepageVideos(): Promise<VideoItem[]> {
  try {
    const dbVideos = await getActiveVideosPaginated(1, 6);
    if (dbVideos.totalCount > 0) {
      return dbVideos.videos.map(videoToVideoItem);
    }
  } catch {
    // Fall back to mock content below.
  }

  return mockVideos.slice(0, 3);
}
