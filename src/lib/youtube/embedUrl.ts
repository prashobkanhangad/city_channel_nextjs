export function toYouTubeEmbedUrl(url: string): string {
  const trimmed = url.trim();

  try {
    const parsed = new URL(trimmed);

    if (parsed.hostname === "youtu.be") {
      const videoId = parsed.pathname.slice(1);
      return videoId
        ? `https://www.youtube.com/embed/${videoId}`
        : trimmed;
    }

    if (parsed.pathname.startsWith("/embed/")) {
      return trimmed;
    }

    const listId = parsed.searchParams.get("list");
    if (listId) {
      return `https://www.youtube.com/embed/videoseries?list=${listId}&rel=0`;
    }

    const videoId = parsed.searchParams.get("v");
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    const channelMatch = parsed.pathname.match(/^\/channel\/([^/]+)/);
    if (channelMatch?.[1]) {
      return `https://www.youtube.com/embed/live_stream?channel=${channelMatch[1]}`;
    }

    return trimmed;
  } catch {
    return trimmed;
  }
}
