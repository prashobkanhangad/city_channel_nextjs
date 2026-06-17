import Link from "next/link";
import type { NewsItem } from "@/lib/mock/newsData";
import { PostFeaturedImage, PostThumbImage, POST_IMAGE_ASPECT_CLASS } from "@/components/landing/PostImage";
import { formatRelativeTime } from "@/lib/utils/time";

export function NewsCard({
  item,
  variant,
}: {
  item: NewsItem;
  variant: "hero" | "compact" | "row";
}) {
  const href = `/news/${item.id}`;

  if (variant === "hero") {
    return (
      <Link href={href} className="group block rounded-lg p-3 hover:bg-zinc-50">
        <PostFeaturedImage className="mb-3" />
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-red-600 px-2 py-0.5 text-[11px] font-semibold text-white">
            {item.section}
          </span>
          <span className="text-[11px] text-zinc-500">
            {formatRelativeTime(item.minutesAgo)}
          </span>
        </div>
        <h4 className="mt-2 line-clamp-2 text-lg font-semibold tracking-tight text-zinc-950">
          {item.title}
        </h4>
        <p className="mt-2 line-clamp-2 text-sm leading-7 text-zinc-700">
          {item.excerpt}
        </p>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={href}
        className="group block rounded-lg p-3 transition hover:bg-zinc-50"
      >
        <PostThumbImage className={`mb-2 w-full rounded-md ${POST_IMAGE_ASPECT_CLASS}`} />
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-800">
            {item.section}
          </span>
          <span className="text-[11px] text-zinc-500">
            {formatRelativeTime(item.minutesAgo)}
          </span>
        </div>
        <h5 className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-zinc-950">
          {item.title}
        </h5>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-lg p-2 hover:bg-zinc-50"
    >
      <PostThumbImage />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-red-600">
            {item.section}
          </span>
          <span className="text-xs text-zinc-500">
            {formatRelativeTime(item.minutesAgo)}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm font-semibold leading-6 text-zinc-950">
          {item.title}
        </p>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-600">
          {item.excerpt}
        </p>
      </div>
    </Link>
  );
}
