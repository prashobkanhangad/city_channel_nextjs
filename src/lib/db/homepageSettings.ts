import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type HomepageSettingsRow = {
  youtube_video_url: string;
  updated_at: string;
};

export async function getHomepageYoutubeVideoUrl(): Promise<string> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("homepage_settings")
      .select("youtube_video_url")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) {
      return "";
    }

    return (data as HomepageSettingsRow).youtube_video_url.trim();
  } catch {
    return "";
  }
}

export async function updateHomepageYoutubeVideoUrl(
  youtubeVideoUrl: string,
): Promise<string> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("homepage_settings")
    .upsert({ id: 1, youtube_video_url: youtubeVideoUrl })
    .select("youtube_video_url")
    .single();

  if (error) {
    throw new Error(`Failed to save homepage video URL: ${error.message}`);
  }

  return (data as HomepageSettingsRow).youtube_video_url;
}
