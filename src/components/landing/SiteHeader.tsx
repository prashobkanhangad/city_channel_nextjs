import Link from "next/link";
import { LiveTvHeaderLink } from "@/components/landing/LiveTvHeaderLink";
import { SiteLogo } from "@/components/landing/SiteLogo";
import { contactNavLink } from "@/lib/mock/newsData";
import type { PublicNavLink } from "@/lib/navigation/publicNav";

type SiteHeaderProps = {
  activeHref?: string;
  navLinks: PublicNavLink[];
};

export function SiteHeader({ activeHref = "/", navLinks }: SiteHeaderProps) {
  const now = new Date();
  const dayNumber = now.toLocaleDateString("en-GB", { day: "2-digit" });
  const monthYear = now
    .toLocaleDateString("en-GB", { month: "short", year: "numeric" })
    .toUpperCase();
  const weekDay = now.toLocaleDateString("en-GB", { weekday: "long" }).toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl items-stretch justify-between">
        <div className="flex min-w-0 items-center gap-3 px-3 py-2">
          <SiteLogo priority width={170} height={52} />

          <div className="flex items-center gap-2 text-zinc-900">
            <span className="text-5xl font-semibold leading-none">{dayNumber}</span>
            <div className="pt-1 leading-tight">
              <p className="text-lg font-semibold">{monthYear}</p>
              <p className="text-sm font-medium text-zinc-700">{weekDay}</p>
            </div>
          </div>
        </div>

        <div className="flex items-stretch">
          <LiveTvHeaderLink />
        </div>
      </div>

      <nav className="border-t border-zinc-200 bg-[#e8ebf3]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4">
          <div className="flex flex-wrap items-center gap-8 py-3 font-medium tracking-wide text-zinc-900">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm hover:text-red-700 ${
                  activeHref === item.href ? "font-bold text-red-700" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Link
            href={contactNavLink.href}
            className={`text-sm font-medium hover:text-red-700 ${
              activeHref === contactNavLink.href
                ? "font-bold text-red-700"
                : "text-zinc-900"
            }`}
          >
            {contactNavLink.label}
          </Link>
        </div>
      </nav>
    </header>
  );
}
