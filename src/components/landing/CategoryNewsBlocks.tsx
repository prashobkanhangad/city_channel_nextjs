import Link from "next/link";
import type { NewsItem } from "@/lib/mock/newsData";
import { PostFeaturedImage, PostThumbImage } from "@/components/landing/PostImage";
import { formatReadTime, formatRelativeTime } from "@/lib/utils/time";

function MetaLine({ item }: { item: NewsItem }) {
  return (
    <p className="text-xs text-zinc-500">
      City News Desk | {formatRelativeTime(item.minutesAgo)} |{" "}
      {formatReadTime(item.minutesAgo)}
    </p>
  );
}

export function CategoryHeroStory({
  item,
  priority = false,
}: {
  item: NewsItem;
  priority?: boolean;
}) {
  return (
    <Link href={`/news/${item.id}`} className="group block h-full">
      <PostFeaturedImage
        src={item.imageUrl}
        alt={item.title}
        priority={priority}
        aspectClassName="aspect-[16/10]"
        className="rounded-none"
        sizes="(max-width: 1024px) 100vw, 33vw"
      />
      <div className="mt-3">
        <MetaLine item={item} />
        <h2 className="mt-2 line-clamp-2 text-xl font-bold leading-8 text-zinc-950 group-hover:text-red-700">
          {item.title}
        </h2>
        <p className="mt-2 line-clamp-3 text-sm leading-7 text-zinc-600">
          {item.excerpt}
        </p>
      </div>
    </Link>
  );
}

export function CategoryArticleRow({ item }: { item: NewsItem }) {
  return (
    <Link
      href={`/news/${item.id}`}
      className="group flex gap-4 border-b border-zinc-100 py-5 last:border-b-0"
    >
      <PostThumbImage
        src={item.imageUrl}
        alt={item.title}
        className="h-24 w-32 shrink-0 rounded-none"
      />
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-base font-bold leading-6 text-zinc-950 group-hover:text-red-700">
          {item.title}
        </h3>
        <p className="mt-1 text-xs text-zinc-500">
          {formatRelativeTime(item.minutesAgo)}
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">
          {item.excerpt}
        </p>
      </div>
    </Link>
  );
}
