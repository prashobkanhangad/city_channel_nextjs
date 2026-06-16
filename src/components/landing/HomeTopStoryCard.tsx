import Link from "next/link";
import { PostFeaturedImage } from "@/components/landing/PostImage";
import type { NewsItem } from "@/lib/mock/newsData";
import { formatRelativeTime } from "@/lib/utils/time";

type HomeTopStoryCardProps = {
  item: NewsItem;
  priority?: boolean;
};

export function HomeTopStoryCard({ item, priority = false }: HomeTopStoryCardProps) {
  return (
    <Link href={`/news/${item.id}`} className="group block h-full">
      <PostFeaturedImage
        src={item.imageUrl}
        alt={item.title}
        priority={priority}
        aspectClassName="aspect-[16/10]"
        className="mb-3"
        sizes="(max-width: 1024px) 100vw, 33vw"
      />
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-red-600">
          {item.section}
        </span>
        <span className="text-[11px] text-zinc-500">
          {formatRelativeTime(item.minutesAgo)}
        </span>
      </div>
      <h2 className="mt-2 line-clamp-2 text-lg font-extrabold leading-7 text-zinc-950 group-hover:text-red-700 sm:text-xl">
        {item.title}
      </h2>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">
        {item.excerpt}
      </p>
    </Link>
  );
}
