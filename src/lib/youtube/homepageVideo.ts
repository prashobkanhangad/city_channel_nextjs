import {
  CITY_TV_CHANNEL_ID,
  CITY_TV_UPLOADS_PLAYLIST_ID,
} from "@/lib/constants/youtube";
import { getHomepageYoutubeVideoUrl } from "@/lib/db/homepageSettings";
import { toYouTubeEmbedUrl } from "@/lib/youtube/embedUrl";

export function getDefaultHomepageVideoEmbedUrl(): string {
  return `https://www.youtube.com/embed/videoseries?list=${CITY_TV_UPLOADS_PLAYLIST_ID}&rel=0`;
}

export async function getHomepageHeroVideoEmbedUrl(): Promise<string> {
  const youtubeVideoUrl = await getHomepageYoutubeVideoUrl();

  if (!youtubeVideoUrl) {
    return getDefaultHomepageVideoEmbedUrl();
  }

  return toYouTubeEmbedUrl(youtubeVideoUrl);
}

export { CITY_TV_CHANNEL_ID };
