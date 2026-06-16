import Link from "next/link";
import { AdvertisementSlot } from "@/components/landing/AdvertisementSlot";
import { HomeTopStoryCard } from "@/components/landing/HomeTopStoryCard";
import { HomepageThreeColumnSection } from "@/components/landing/HomepageThreeColumnSection";
import { NewsThumbItem } from "@/components/landing/NewsThumbItem";
import { PostFeaturedImage } from "@/components/landing/PostImage";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { VideoGrid } from "@/components/landing/VideoGrid";
import {
  YouTubeChannelLink,
  YouTubePlayer,
} from "@/components/landing/YouTubePlayer";
import { getActiveAdByPlacement } from "@/lib/db/advertisements";
import { getHomepageNewsSections, getHomepageTopicSections } from "@/lib/news/homePosts";
import {
  getPublicCategories,
  getPublicNavLinks,
} from "@/lib/navigation/publicNav";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildOrganizationJsonLd } from "@/lib/seo/jsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME } from "@/lib/seo/site";
import { getPublicHomepageVideos } from "@/lib/videos/publicVideos";
import { getHomepageHeroVideoEmbedUrl } from "@/lib/youtube/homepageVideo";

export const metadata = buildPageMetadata({
  title: "പ്രധാന വാർത്തകൾ",
  path: "/",
});

export default async function LandingPage() {
  const newsSections = await getHomepageNewsSections();
  const topStories = newsSections.topStories;
  const latest = newsSections.latest;
  const trending = newsSections.trending;
  const mustRead = newsSections.mustRead;
  const special = newsSections.special;
  const navLinks = await getPublicNavLinks();
  const dbCategories = await getPublicCategories();
  const [homeSidebarAd, homeMidBannerAd, homepageVideos, topicSections, homepageVideoEmbedUrl] =
    await Promise.all([
      getActiveAdByPlacement("home-sidebar").catch(() => null),
      getActiveAdByPlacement("home-mid-banner").catch(() => null),
      getPublicHomepageVideos(),
      getHomepageTopicSections(),
      getHomepageHeroVideoEmbedUrl(),
    ]);

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-950">
      <JsonLd data={buildOrganizationJsonLd()} />
      <SiteHeader activeHref="/" navLinks={navLinks} />

      <main className="mx-auto w-full max-w-7xl px-4 py-6">
        <h1 className="sr-only">{SITE_NAME} — പ്രധാന വാർത്തകൾ</h1>
        <div className="grid gap-8 lg:grid-cols-12">
          <section className="lg:col-span-8">
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-extrabold uppercase tracking-wide text-red-600">
                  City TV
                </h2>
                <YouTubeChannelLink className="text-xs font-medium text-zinc-600 hover:text-red-700">
                  Watch on YouTube →
                </YouTubeChannelLink>
              </div>

              <YouTubePlayer
                title="City TV - YouTube"
                embedUrl={homepageVideoEmbedUrl}
              />

              {topStories.length > 0 ? (
                <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {topStories.slice(0, 2).map((item, index) => (
                    <HomeTopStoryCard
                      key={item.id}
                      item={item}
                      priority={index === 0}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            <div className="mt-4 space-y-1">
              {topStories.slice(2, 7).map((item) => (
                <NewsThumbItem key={item.id} item={item} />
              ))}
            </div>
          </section>

          <aside className="lg:col-span-4">
            <div>
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-red-600">
                  Latest
                </h3>
                <span className="text-xs text-zinc-500">അവസാനം അപ്ഡേറ്റ്</span>
              </div>

              <div className="mt-3 space-y-1">
                {latest.slice(0, 6).map((item) => (
                  <NewsThumbItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            <AdvertisementSlot
              ad={homeSidebarAd}
              fallbackAspectClass="aspect-[16/10]"
              className="mt-8"
            />
          </aside>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <section className="lg:col-span-4">
            <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-red-600">
              Trending Now
            </h3>
            <div className="space-y-1">
              {trending.slice(0, 5).map((item) => (
                <NewsThumbItem key={item.id} item={item} />
              ))}
            </div>
          </section>

          <section className="lg:col-span-4">
            <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-red-600">
              Must Read
            </h3>
            <div className="space-y-1">
              {mustRead.slice(0, 5).map((item) => (
                <NewsThumbItem key={item.id} item={item} />
              ))}
            </div>
          </section>

          <section className="lg:col-span-4">
            <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-red-600">
              Special
            </h3>

            <PostFeaturedImage
              src={special[0]?.imageUrl ?? topStories[0]?.imageUrl ?? latest[0]?.imageUrl}
              alt={special[0]?.title ?? topStories[0]?.title ?? "Special"}
              aspectClassName="aspect-[16/7]"
              className="mb-4"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />

            <div className="space-y-1">
              {special.slice(0, 3).map((item) => (
                <NewsThumbItem key={item.id} item={item} />
              ))}
            </div>
          </section>
        </div>

        <AdvertisementSlot
          ad={homeMidBannerAd}
          compact
          fallbackAspectClass="aspect-[16/2]"
          className="mt-10"
        />

        <HomepageThreeColumnSection
          columns={[
            {
              title: "Entertainment",
              href: "/entertainment",
              items: topicSections.entertainment,
            },
            {
              title: "Sports",
              href: "/sports",
              items: topicSections.sports,
            },
            {
              title: "Business",
              href: "/business",
              items: topicSections.business,
            },
          ]}
        />

        {homepageVideos.length > 0 ? (
          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-sm font-extrabold uppercase tracking-wide text-red-600">
                Videos
              </h3>
              <Link
                href="/videos"
                className="text-xs font-medium text-zinc-600 hover:text-red-700"
              >
                View all →
              </Link>
            </div>
            <VideoGrid videos={homepageVideos.slice(0, 3)} />
          </section>
        ) : null}

        <section className="mt-10">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-red-600">
            വിഭാഗങ്ങൾ
          </h3>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {dbCategories.length > 0
              ? dbCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/${category.slug}`}
                    className="text-sm font-semibold text-zinc-900 hover:text-red-700"
                  >
                    {category.titleMl}
                  </Link>
                ))
              : newsSections.categories.map((cat) => (
                  <Link
                    key={cat}
                    href="/kerala"
                    className="text-sm font-semibold text-zinc-900 hover:text-red-700"
                  >
                    {cat}
                  </Link>
                ))}
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
