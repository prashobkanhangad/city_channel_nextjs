import { ListPagination } from "@/components/landing/ListPagination";
import { SiteLayout } from "@/components/landing/SiteLayout";
import { VideoGrid } from "@/components/landing/VideoGrid";
import { YouTubeChannelLink } from "@/components/landing/YouTubePlayer";
import { pageMeta } from "@/lib/mock/newsData";
import { getPublicVideosPage } from "@/lib/videos/publicVideos";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { parsePageParam } from "@/lib/utils/pagination";

const meta = pageMeta.videos;

export const metadata = buildPageMetadata({
  title: meta.titleMl,
  description: meta.description,
  path: "/videos",
});

type VideosPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function VideosPage({ searchParams }: VideosPageProps) {
  const { page: pageParam } = await searchParams;
  const page = parsePageParam(pageParam);
  const videosPage = await getPublicVideosPage(page);

  return (
    <SiteLayout activeHref="/videos">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-zinc-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950">{meta.titleMl}</h1>
          <p className="mt-1 text-sm text-zinc-500">{meta.description}</p>
        </div>
        <YouTubeChannelLink className="text-sm font-medium text-red-700 hover:underline">
          City TV YouTube →
        </YouTubeChannelLink>
      </div>

      <VideoGrid videos={videosPage.videos} />

      <ListPagination
        basePath="/videos"
        currentPage={videosPage.currentPage}
        totalPages={videosPage.totalPages}
      />
    </SiteLayout>
  );
}
