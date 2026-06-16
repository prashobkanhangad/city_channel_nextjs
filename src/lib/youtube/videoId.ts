const YOUTUBE_VIDEO_ID_PATTERN = /^[\w-]{6,20}$/;

export function parseYouTubeVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (YOUTUBE_VIDEO_ID_PATTERN.test(trimmed) && !trimmed.includes("/")) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);

    if (parsed.hostname === "youtu.be") {
      const videoId = parsed.pathname.slice(1).split("/")[0];
      return videoId && YOUTUBE_VIDEO_ID_PATTERN.test(videoId) ? videoId : null;
    }

    if (
      parsed.hostname.includes("youtube.com") ||
      parsed.hostname.includes("youtube-nocookie.com")
    ) {
      const queryId = parsed.searchParams.get("v");
      if (queryId && YOUTUBE_VIDEO_ID_PATTERN.test(queryId)) {
        return queryId;
      }

      const embedMatch = parsed.pathname.match(/\/embed\/([^/?]+)/);
      if (embedMatch?.[1] && YOUTUBE_VIDEO_ID_PATTERN.test(embedMatch[1])) {
        return embedMatch[1];
      }

      const shortsMatch = parsed.pathname.match(/\/shorts\/([^/?]+)/);
      if (shortsMatch?.[1] && YOUTUBE_VIDEO_ID_PATTERN.test(shortsMatch[1])) {
        return shortsMatch[1];
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function getYouTubeThumbnailUrl(videoId?: string | null): string | null {
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function getYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
