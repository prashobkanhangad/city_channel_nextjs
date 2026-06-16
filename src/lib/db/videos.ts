import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CreateVideoInput, UpdateVideoInput, Video } from "@/types/video";

type VideoRow = {
  id: string;
  title: string;
  youtube_video_id: string | null;
  thumbnail_url: string | null;
  is_active: boolean;
  show_on_homepage: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

function mapVideo(row: VideoRow): Video {
  return {
    id: row.id,
    title: row.title,
    youtubeVideoId: row.youtube_video_id,
    thumbnailUrl: row.thumbnail_url,
    isActive: row.is_active,
    showOnHomepage: row.show_on_homepage,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function queryActiveVideos(
  limit: number,
  homepageOnly: boolean,
): Promise<Video[]> {
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("videos")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (homepageOnly) {
    query = query.eq("show_on_homepage", true);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch videos: ${error.message}`);
  }

  return (data as VideoRow[]).map(mapVideo);
}

export async function getAllVideos(): Promise<Video[]> {
  const result = await getAllVideosPaginated(1, 10_000);
  return result.videos;
}

export async function getAllVideosPaginated(
  page = 1,
  pageSize = 15,
): Promise<{ videos: Video[]; totalCount: number }> {
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = getSupabaseAdmin();
  const { data, error, count } = await supabase
    .from("videos")
    .select("*", { count: "exact" })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch videos: ${error.message}`);
  }

  return {
    videos: (data as VideoRow[]).map(mapVideo),
    totalCount: count ?? 0,
  };
}

export async function getVideosCount(): Promise<number> {
  const supabase = getSupabaseAdmin();
  const { count, error } = await supabase
    .from("videos")
    .select("*", { count: "exact", head: true });

  if (error) {
    throw new Error(`Failed to count videos: ${error.message}`);
  }

  return count ?? 0;
}

export async function getHomepageVideosCount(): Promise<number> {
  const supabase = getSupabaseAdmin();
  const { count, error } = await supabase
    .from("videos")
    .select("*", { count: "exact", head: true })
    .eq("show_on_homepage", true);

  if (error) {
    throw new Error(`Failed to count homepage videos: ${error.message}`);
  }

  return count ?? 0;
}

export async function getActiveVideos(limit = 30): Promise<Video[]> {
  const result = await getActiveVideosPaginated(1, limit);
  return result.videos;
}

export async function getActiveVideosPaginated(
  page = 1,
  pageSize = 12,
): Promise<{ videos: Video[]; totalCount: number }> {
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = await createSupabaseServerClient();

  const { data, error, count } = await supabase
    .from("videos")
    .select("*", { count: "exact" })
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch videos: ${error.message}`);
  }

  return {
    videos: (data as VideoRow[]).map(mapVideo),
    totalCount: count ?? 0,
  };
}

export async function getHomepageVideos(limit = 6): Promise<Video[]> {
  return queryActiveVideos(limit, true);
}

export async function createVideo(input: CreateVideoInput): Promise<Video> {
  const supabase = getSupabaseAdmin();
  const { data: lastVideo } = await supabase
    .from("videos")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const sortOrder =
    lastVideo && typeof lastVideo.sort_order === "number"
      ? lastVideo.sort_order + 1
      : 0;

  const { data, error } = await supabase
    .from("videos")
    .insert({
      title: input.title,
      youtube_video_id: input.youtubeVideoId || null,
      thumbnail_url: input.thumbnailUrl || null,
      show_on_homepage: input.showOnHomepage ?? false,
      sort_order: sortOrder,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create video: ${error.message}`);
  }

  return mapVideo(data as VideoRow);
}

export async function updateVideo(
  id: string,
  input: UpdateVideoInput,
): Promise<Video | null> {
  const supabase = getSupabaseAdmin();
  const payload: Record<string, unknown> = {};

  if (input.title !== undefined) payload.title = input.title;
  if (input.youtubeVideoId !== undefined) {
    payload.youtube_video_id = input.youtubeVideoId || null;
  }
  if (input.thumbnailUrl !== undefined) {
    payload.thumbnail_url = input.thumbnailUrl || null;
  }
  if (input.isActive !== undefined) payload.is_active = input.isActive;
  if (input.showOnHomepage !== undefined) {
    payload.show_on_homepage = input.showOnHomepage;
  }
  if (input.sortOrder !== undefined) payload.sort_order = input.sortOrder;

  const { data, error } = await supabase
    .from("videos")
    .update(payload)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to update video: ${error.message}`);
  }

  return data ? mapVideo(data as VideoRow) : null;
}

export async function deleteVideo(id: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { error, count } = await supabase
    .from("videos")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete video: ${error.message}`);
  }

  return (count ?? 0) > 0;
}
