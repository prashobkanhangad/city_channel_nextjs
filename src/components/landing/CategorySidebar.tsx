import Link from "next/link";
import { AdvertisementSlot } from "@/components/landing/AdvertisementSlot";
import { getActiveAdByPlacement } from "@/lib/db/advertisements";
import type { NewsItem } from "@/lib/mock/newsData";
import { formatRelativeTime } from "@/lib/utils/time";

export async function CategorySidebar({ latest }: { latest: NewsItem[] }) {
  const [topAd, bottomAd] = await Promise.all([
    getActiveAdByPlacement("category-sidebar-top").catch(() => null),
    getActiveAdByPlacement("category-sidebar-bottom").catch(() => null),
  ]);

  return (
    <aside className="space-y-6">
      <AdvertisementSlot
        ad={topAd}
        fallbackAspectClass="aspect-[4/3]"
        className="mb-2"
      />

      <section>
        <h3 className="border-b-4 border-yellow-400 pb-2 text-lg font-bold text-zinc-900">
          Latest
        </h3>
        <div className="mt-2 divide-y divide-zinc-100">
          {latest.slice(0, 8).map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.id}`}
              className="group block py-3"
            >
              <p className="text-xs text-zinc-500">
                {formatRelativeTime(item.minutesAgo)}
              </p>
              <p className="mt-1 line-clamp-3 text-sm font-bold leading-5 text-zinc-950 group-hover:text-red-700">
                {item.title}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <AdvertisementSlot
        ad={bottomAd}
        fallbackAspectClass="aspect-[4/5]"
      />
    </aside>
  );
}
