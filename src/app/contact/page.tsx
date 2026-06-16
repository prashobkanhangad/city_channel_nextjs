import { SiteLayout } from "@/components/landing/SiteLayout";
import { CategorySidebar } from "@/components/landing/CategorySidebar";
import { sections } from "@/lib/mock/newsData";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "ബന്ധപ്പെടുക",
  description: "സിറ്റി ചാനലുമായി ബന്ധപ്പെടുക",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <SiteLayout activeHref="/contact">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="mb-6 border-b border-zinc-200 pb-4">
            <h1 className="text-2xl font-bold text-zinc-950">ബന്ധപ്പെടുക</h1>
            <p className="mt-1 text-sm text-zinc-500">
              സിറ്റി ചാനലുമായി ബന്ധപ്പെടുക
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">ഇമെയിൽ</h2>
              <p className="mt-1 text-sm text-zinc-600">news@citychannel.com</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">ഫോൺ</h2>
              <p className="mt-1 text-sm text-zinc-600">+91 98765 43210</p>
            </div>
            <div className="sm:col-span-2">
              <h2 className="text-sm font-semibold text-zinc-900">ഓഫീസ്</h2>
              <p className="mt-1 text-sm text-zinc-600">
                City Channel News Desk, Kerala, India
              </p>
            </div>
          </div>

          <form className="mt-8 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-zinc-700">പേര്</span>
              <input
                className="mt-1 h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-red-400"
                name="name"
                type="text"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-zinc-700">ഇമെയിൽ</span>
              <input
                className="mt-1 h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-red-400"
                name="email"
                type="email"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-zinc-700">സന്ദേശം</span>
              <textarea
                className="mt-1 min-h-[120px] w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-red-400"
                name="message"
              />
            </label>
            <button
              type="submit"
              className="h-11 bg-red-700 px-5 text-sm font-semibold text-white hover:bg-red-800"
            >
              അയയ്ക്കുക
            </button>
          </form>
        </div>

        <div className="lg:col-span-4">
          <CategorySidebar latest={sections.latest} />
        </div>
      </div>
    </SiteLayout>
  );
}
