import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { getPublicNavLinks } from "@/lib/navigation/publicNav";

export async function SiteLayout({
  children,
  activeHref,
}: {
  children: React.ReactNode;
  activeHref?: string;
}) {
  const navLinks = await getPublicNavLinks();

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-zinc-950">
      <SiteHeader activeHref={activeHref} navLinks={navLinks} />
      <main className="mx-auto w-full max-w-7xl px-4 py-6">{children}</main>
      <div className="mx-auto w-full max-w-7xl px-4">
        <SiteFooter />
      </div>
    </div>
  );
}
