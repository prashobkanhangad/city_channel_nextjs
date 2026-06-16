export function formatRelativeTime(minutesAgo: number) {
  if (minutesAgo < 60) {
    return `${minutesAgo} min ago`;
  }
  if (minutesAgo < 1440) {
    const hours = Math.floor(minutesAgo / 60);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  const days = Math.floor(minutesAgo / 1440);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export function formatReadTime(minutesAgo: number) {
  const readMinutes = Math.max(1, Math.min(5, Math.floor(minutesAgo / 10) + 1));
  return `${readMinutes} min read`;
}
