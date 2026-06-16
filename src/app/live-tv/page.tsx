import { CategorySidebar } from "@/components/landing/CategorySidebar";
import { SiteLayout } from "@/components/landing/SiteLayout";
import { YouTubeEmbedPlayer } from "@/components/landing/YouTubePlayer";
import { getLiveTvStreamUrl } from "@/lib/db/liveTv";
import { sections } from "@/lib/mock/newsData";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { toYouTubeEmbedUrl } from "@/lib/youtube/embedUrl";

export const metadata = buildPageMetadata({
  title: "ലൈവ് ടിവി",
  description: "സിറ്റി ചാനൽ ലൈവ് ടിവി കാണുക",
  path: "/live-tv",
});

export default async function LiveTvPage() {
  const streamUrl = await getLiveTvStreamUrl();
  const embedUrl = toYouTubeEmbedUrl(streamUrl);

  return (
    <SiteLayout activeHref="/live-tv">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="mb-6 border-b border-zinc-200 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-zinc-950">ലൈവ് ടിവി</h1>
              <p className="mt-1 text-sm text-zinc-500">
                സിറ്റി ചാനൽ നേരിട്ട് കാണുക
              </p>
            </div>
          </div>

          <YouTubeEmbedPlayer embedUrl={embedUrl} title="City TV - Live" />

          <p className="mt-4 text-sm leading-6 text-zinc-600">
            ലൈവ് സ്ട്രീം ലഭ്യമല്ലാത്ത സമയങ്ങളിൽ ഏറ്റവും പുതിയ വീഡിയോകൾ
            പ്രദർശിപ്പിച്ചേക്കാം. പൂർണ്ണ അനുഭവത്തിന് YouTube ചാനലിൽ നേരിട്ട്
            കാണാം.
          </p>
        </div>

        <div className="lg:col-span-4">
          <CategorySidebar latest={sections.latest} />
        </div>
      </div>
    </SiteLayout>
  );
}
