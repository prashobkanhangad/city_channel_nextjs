import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CITY_TV_CHANNEL_URL } from "@/lib/constants/youtube";

type LiveTvSettingsRow = {
  stream_url: string;
  updated_at: string;
};

const DEFAULT_STREAM_URL = CITY_TV_CHANNEL_URL;

export async function getLiveTvStreamUrl(): Promise<string> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("live_tv_settings")
      .select("stream_url")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) {
      return DEFAULT_STREAM_URL;
    }

    return (data as LiveTvSettingsRow).stream_url || DEFAULT_STREAM_URL;
  } catch {
    return DEFAULT_STREAM_URL;
  }
}

export async function updateLiveTvStreamUrl(streamUrl: string): Promise<string> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("live_tv_settings")
    .upsert({ id: 1, stream_url: streamUrl })
    .select("stream_url")
    .single();

  if (error) {
    throw new Error(`Failed to save Live TV URL: ${error.message}`);
  }

  return (data as LiveTvSettingsRow).stream_url;
}
