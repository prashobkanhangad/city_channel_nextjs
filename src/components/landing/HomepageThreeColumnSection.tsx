import Link from "next/link";
import { NewsThumbItem } from "@/components/landing/NewsThumbItem";
import type { NewsItem } from "@/lib/mock/newsData";

export type HomepageColumn = {
  title: string;
  items: NewsItem[];
  limit?: number;
  href?: string;
};

type HomepageThreeColumnSectionProps = {
  columns: HomepageColumn[];
  className?: string;
};

export function HomepageThreeColumnSection({
  columns,
  className = "mt-10",
}: HomepageThreeColumnSectionProps) {
  return (
    <div className={`grid gap-8 lg:grid-cols-12 ${className}`}>
      {columns.map((column) => (
        <section key={column.title} className="lg:col-span-4">
          {column.href ? (
            <Link
              href={column.href}
              className="mb-3 inline-block text-sm font-extrabold uppercase tracking-wide text-red-600 hover:underline"
            >
              {column.title}
            </Link>
          ) : (
            <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-red-600">
              {column.title}
            </h3>
          )}
          <div className="space-y-1">
            {column.items.length === 0 ? (
              <p className="text-sm text-zinc-500">No stories yet.</p>
            ) : (
              column.items
                .slice(0, column.limit ?? 5)
                .map((item) => <NewsThumbItem key={item.id} item={item} />)
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
