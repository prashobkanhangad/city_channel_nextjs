import Link from "next/link";
import type { NewsItem } from "@/lib/mock/newsData";
import { PostThumbImage } from "@/components/landing/PostImage";
import { formatRelativeTime } from "@/lib/utils/time";

export function NewsThumbItem({ item }: { item: NewsItem }) {
  return (
    <Link
      href={`/news/${item.id}`}
      className="flex items-start gap-3 rounded-lg p-2 hover:bg-zinc-50"
    >
      <PostThumbImage src={item.imageUrl} alt={item.title} />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[11px] font-semibold text-zinc-700">
            {item.section}
          </span>
          <span className="text-[11px] text-zinc-500">{formatRelativeTime(item.minutesAgo)}</span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm font-bold leading-5 text-zinc-950">
          {item.title}
        </p>
      </div>
    </Link>
  );
}

