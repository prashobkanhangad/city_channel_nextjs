import {
  CategoryArticleRow,
  CategoryHeroStory,
} from "@/components/landing/CategoryNewsBlocks";
import { ListPagination } from "@/components/landing/ListPagination";
import { CategorySidebar } from "@/components/landing/CategorySidebar";
import type { CategoryPageSlug, NewsItem } from "@/lib/mock/newsData";
import { pageMeta } from "@/lib/mock/newsData";

type CategoryPageContentProps = {
  page: CategoryPageSlug;
  items: NewsItem[];
  latest?: NewsItem[];
  currentPage?: number;
  totalPages?: number;
  basePath: string;
};

export function CategoryPageContent({
  page,
  items,
  latest = [],
  currentPage = 1,
  totalPages = 1,
  basePath,
}: CategoryPageContentProps) {
  const meta = pageMeta[page];
  const showHero = currentPage === 1;
  const hero = showHero ? items[0] : undefined;
  const sideStory = showHero ? items[1] : undefined;
  const listItems = showHero
    ? items.length > 2
      ? items.slice(2)
      : items.slice(1, 7)
    : items;
  const sidebarLatest = latest.length > 0 ? latest : items.slice(0, 6);

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <div className="mb-6 border-b border-zinc-200 pb-4">
          <h1 className="text-2xl font-bold text-zinc-950">{meta.titleMl}</h1>
          <p className="mt-1 text-sm text-zinc-500">{meta.description}</p>
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-zinc-500">ഈ വിഭാഗത്തിൽ വാർത്തകൾ ലഭ്യമല്ല.</p>
        ) : (
          <>
            {showHero ? (
              <div className="grid gap-6 lg:grid-cols-2">
                {hero ? (
                  <div>
                    <CategoryHeroStory item={hero} priority />
                  </div>
                ) : null}

                {sideStory ? (
                  <div>
                    <CategoryHeroStory item={sideStory} />
                  </div>
                ) : null}
              </div>
            ) : null}

            <section className={showHero ? "mt-4" : ""}>
              {listItems.map((item) => (
                <CategoryArticleRow key={item.id} item={item} />
              ))}
            </section>

            <ListPagination
              basePath={basePath}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </>
        )}
      </div>

      <div className="lg:col-span-4">
        <CategorySidebar latest={sidebarLatest} />
      </div>
    </div>
  );
}
