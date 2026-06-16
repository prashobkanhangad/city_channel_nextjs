import { SiteHeaderClient } from "@/components/landing/SiteHeaderClient";
import { contactNavLink } from "@/lib/mock/newsData";
import type { PublicNavLink } from "@/lib/navigation/publicNav";

type SiteHeaderProps = {
  activeHref?: string;
  navLinks: PublicNavLink[];
};

function useHeaderDateParts() {
  const now = new Date();

  return {
    dayNumber: now.toLocaleDateString("en-GB", { day: "2-digit" }),
    monthYear: now
      .toLocaleDateString("en-GB", { month: "short", year: "numeric" })
      .toUpperCase(),
    weekDay: now
      .toLocaleDateString("en-GB", { weekday: "long" })
      .toUpperCase(),
  };
}

function HeaderDateMobile() {
  const { dayNumber, monthYear, weekDay } = useHeaderDateParts();

  return (
    <div className="min-w-0 leading-tight">
      <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-zinc-900">
        {dayNumber} {monthYear}
      </p>
      <p className="truncate text-[10px] font-medium uppercase tracking-wide text-zinc-600">
        {weekDay}
      </p>
    </div>
  );
}

function HeaderDateInline() {
  const { dayNumber, monthYear, weekDay } = useHeaderDateParts();

  return (
    <>
      <div className="hidden shrink-0 md:block lg:hidden">
        <div className="flex items-center gap-2 whitespace-nowrap border-l border-zinc-200 pl-3">
          <span className="text-2xl font-semibold leading-none text-zinc-900">
            {dayNumber}
          </span>
          <div className="leading-tight">
            <p className="text-[11px] font-semibold tracking-wide">{monthYear}</p>
            <p className="text-[10px] font-medium text-zinc-600">{weekDay}</p>
          </div>
        </div>
      </div>

      <div className="hidden shrink-0 items-center gap-2 lg:flex">
        <span className="text-5xl font-semibold leading-none text-zinc-900">
          {dayNumber}
        </span>
        <div className="leading-tight">
          <p className="text-lg font-semibold text-zinc-900">{monthYear}</p>
          <p className="text-sm font-medium text-zinc-700">{weekDay}</p>
        </div>
      </div>
    </>
  );
}

export function SiteHeader({ activeHref = "/", navLinks }: SiteHeaderProps) {
  return (
    <SiteHeaderClient
      activeHref={activeHref}
      navLinks={navLinks}
      contactLink={contactNavLink}
      dateSlot={<HeaderDateInline />}
      mobileDateSlot={<HeaderDateMobile />}
    />
  );
}
