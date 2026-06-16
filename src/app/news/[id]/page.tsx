import Link from "next/link";
import { notFound } from "next/navigation";
import { CategorySidebar } from "@/components/landing/CategorySidebar";
import { PostFeaturedImage } from "@/components/landing/PostImage";
import { SiteLayout } from "@/components/landing/SiteLayout";
import { sections } from "@/lib/mock/newsData";
import {
  getArticleById,
  getRelatedArticles,
  recordArticleView,
} from "@/lib/news/getArticle";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildNewsArticleJsonLd } from "@/lib/seo/jsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatReadTime, formatRelativeTime } from "@/lib/utils/time";

type NewsArticlePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: NewsArticlePageProps) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    return buildPageMetadata({
      title: "വാർത്ത കണ്ടെത്തിയില്ല",
      description: "ഈ വാർത്ത ലഭ്യമല്ല",
      path: `/news/${id}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/news/${id}`,
    image: article.imageUrl,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
  });
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { id } = await params;
  await recordArticleView(id);
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  const related = getRelatedArticles(id);
  const recent = sections.latest.filter((item) => item.id !== id);
  const timeLabel = article.publishedAt
    ? new Date(article.publishedAt).toLocaleString("en-IN")
    : article.minutesAgo !== undefined
      ? formatRelativeTime(article.minutesAgo)
      : "";

  const readTime =
    article.minutesAgo !== undefined
      ? formatReadTime(article.minutesAgo)
      : "3 min read";

  return (
    <SiteLayout>
      <JsonLd data={buildNewsArticleJsonLd(article, id)} />
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <article>
            <div className="mb-4">
              <span className="text-sm font-semibold text-red-600">
                {article.section}
              </span>
            </div>

            <h1 className="text-2xl font-extrabold leading-9 text-zinc-950 sm:text-3xl">
              {article.title}
            </h1>

            <p className="mt-3 text-sm text-zinc-500">
              {article.author} | {timeLabel} | {readTime}
            </p>

            <PostFeaturedImage
              priority
              src={article.imageUrl}
              alt={article.title}
              aspectClassName="aspect-[16/9]"
              className="mt-6 rounded-none"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />

            <div className="mt-6 space-y-4 text-base leading-8 text-zinc-800">
              {article.content.split("\n\n").map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>

            <dl className="mt-8 grid gap-4 border-t border-zinc-200 pt-6 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-medium text-zinc-500">എഴുതിയത്</dt>
                <dd className="mt-1 font-semibold text-zinc-900">
                  {article.author}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-zinc-500">നഗരം / വിഭാഗം</dt>
                <dd className="mt-1 font-semibold text-zinc-900">
                  {article.city}
                </dd>
              </div>
            </dl>
          </article>

          {related.length > 0 ? (
            <section className="mt-12 border-t border-zinc-200 pt-8">
              <h2 className="mb-4 text-lg font-bold text-zinc-900">
                ബന്ധപ്പെട്ട വാർത്തകൾ
              </h2>
              <div className="space-y-4">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/news/${item.id}`}
                    className="group block"
                  >
                    <p className="text-xs text-zinc-500">
                      {item.minutesAgo !== undefined
                        ? formatRelativeTime(item.minutesAgo)
                        : ""}
                    </p>
                    <p className="mt-1 text-base font-bold leading-6 text-zinc-950 group-hover:text-red-700">
                      {item.title}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <div className="lg:col-span-4">
          <CategorySidebar latest={recent} />
        </div>
      </div>
    </SiteLayout>
  );
}
