import type { ReactNode } from "react";
import {
  CITY_TV_CHANNEL_ID,
  CITY_TV_CHANNEL_URL,
  CITY_TV_UPLOADS_PLAYLIST_ID,
} from "@/lib/constants/youtube";

type YouTubePlayerProps = {
  title?: string;
  playlistId?: string;
  mode?: "playlist" | "live";
  embedUrl?: string;
};

export function YouTubePlayer({
  title = "City TV",
  playlistId = CITY_TV_UPLOADS_PLAYLIST_ID,
  mode = "playlist",
  embedUrl,
}: YouTubePlayerProps) {
  const resolvedEmbedUrl =
    embedUrl ??
    (mode === "live"
      ? `https://www.youtube.com/embed/live_stream?channel=${CITY_TV_CHANNEL_ID}`
      : `https://www.youtube.com/embed/videoseries?list=${playlistId}&rel=0`);

  return <YouTubeEmbedPlayer embedUrl={resolvedEmbedUrl} title={title} />;
}

export function YouTubeEmbedPlayer({
  embedUrl,
  title = "City TV",
}: {
  embedUrl: string;
  title?: string;
}) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

export function YouTubeChannelLink({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={CITY_TV_CHANNEL_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
