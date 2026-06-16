"use server";

import { revalidatePath } from "next/cache";
import {
  createVideo as createVideoInDb,
  deleteVideo as deleteVideoInDb,
  getAllVideosPaginated,
  getHomepageVideosCount,
  getVideosCount as getVideosCountFromDb,
  updateVideo,
} from "@/lib/db/videos";
import { ADMIN_PAGE_SIZE } from "@/lib/constants/pagination";
import {
  buildPaginatedResult,
  parsePageParam,
  type PaginatedResult,
} from "@/lib/utils/pagination";
import { createVideoSchema } from "@/lib/validations/video";
import type { Video } from "@/types/video";

export type VideoActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

function revalidateVideoPaths() {
  revalidatePath("/");
  revalidatePath("/videos");
  revalidatePath("/admin");
  revalidatePath("/admin/videos");
}

function parseShowOnHomepage(formData: FormData): boolean {
  return formData.get("showOnHomepage") === "on";
}

export async function getVideos(): Promise<Video[]> {
  const page = await getVideosPage(1);
  return page.items;
}

export async function getVideosPage(page = 1): Promise<PaginatedResult<Video>> {
  const currentPage = parsePageParam(String(page));
  const { videos, totalCount } = await getAllVideosPaginated(
    currentPage,
    ADMIN_PAGE_SIZE,
  );

  return buildPaginatedResult(videos, totalCount, currentPage, ADMIN_PAGE_SIZE);
}

export async function getAdminVideosCount(): Promise<number> {
  return getVideosCountFromDb();
}

export async function getAdminHomepageVideosCount(): Promise<number> {
  return getHomepageVideosCount();
}

export async function createVideo(
  _prevState: VideoActionState,
  formData: FormData,
): Promise<VideoActionState> {
  const youtubeInput = String(formData.get("youtubeVideoId") ?? "").trim();

  const parsed = createVideoSchema.safeParse({
    title: formData.get("title"),
    youtubeVideoId: youtubeInput,
    showOnHomepage: parseShowOnHomepage(formData),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  if (youtubeInput && !parsed.data.youtubeVideoId) {
    return {
      success: false,
      message: "Enter a valid YouTube video ID or URL.",
      errors: {
        youtubeVideoId: ["Enter a valid YouTube video ID or URL."],
      },
    };
  }

  try {
    await createVideoInDb(parsed.data);
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create video.",
    };
  }

  revalidateVideoPaths();

  return {
    success: true,
    message: "Video added successfully.",
  };
}

export async function toggleVideoActive(
  id: string,
  isActive: boolean,
): Promise<VideoActionState> {
  try {
    const video = await updateVideo(id, { isActive: !isActive });

    if (!video) {
      return { success: false, message: "Video not found." };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update video.",
    };
  }

  revalidateVideoPaths();

  return {
    success: true,
    message: isActive ? "Video disabled." : "Video enabled.",
  };
}

export async function toggleVideoHomepage(
  id: string,
  showOnHomepage: boolean,
): Promise<VideoActionState> {
  try {
    const video = await updateVideo(id, { showOnHomepage: !showOnHomepage });

    if (!video) {
      return { success: false, message: "Video not found." };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update video.",
    };
  }

  revalidateVideoPaths();

  return {
    success: true,
    message: showOnHomepage
      ? "Removed from homepage."
      : "Added to homepage.",
  };
}

export async function deleteVideo(id: string): Promise<VideoActionState> {
  try {
    const deleted = await deleteVideoInDb(id);

    if (!deleted) {
      return { success: false, message: "Video not found." };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete video.",
    };
  }

  revalidateVideoPaths();

  return { success: true, message: "Video deleted." };
}
