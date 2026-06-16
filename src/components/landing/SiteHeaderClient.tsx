"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { LiveTvHeaderLink } from "@/components/landing/LiveTvHeaderLink";
import { SiteLogo } from "@/components/landing/SiteLogo";
import type { PublicNavLink } from "@/lib/navigation/publicNav";

type SiteHeaderClientProps = {
  activeHref: string;
  navLinks: PublicNavLink[];
  contactLink: PublicNavLink;
  dateSlot: ReactNode;
  mobileDateSlot: ReactNode;
};

function NavLink({
  item,
  isActive,
  onNavigate,
  mobile = false,
}: {
  item: PublicNavLink;
  isActive: boolean;
  onNavigate?: () => void;
  mobile?: boolean;
}) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`block tracking-wide transition-colors ${
        mobile
          ? "rounded-lg px-3 py-2.5 text-sm font-medium"
          : "whitespace-nowrap py-1 text-xs font-medium sm:text-sm"
      } ${
        isActive
          ? "font-bold text-red-700"
          : "text-zinc-900 hover:text-red-700"
      } ${mobile && isActive ? "bg-white" : ""} ${
        mobile && !isActive ? "hover:bg-white/70" : ""
      }`}
    >
      {item.label}
    </Link>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      {open ? (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6 6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

export function SiteHeaderClient({
  activeHref,
  navLinks,
  contactLink,
  dateSlot,
  mobileDateSlot,
}: SiteHeaderClientProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuId = "site-header-mobile-menu";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);
  const mobileNavLinks = [...navLinks, contactLink];

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white shadow-sm">
      <div className="relative mx-auto w-full max-w-7xl">
        <div className="flex items-stretch justify-between gap-2 px-3 py-2 sm:gap-3 sm:px-4">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <SiteLogo
              priority
              width={170}
              height={52}
              className="max-h-9 w-auto shrink-0 sm:max-h-11 lg:max-h-[52px]"
            />
            <div className="min-w-0 md:hidden">{mobileDateSlot}</div>
            {dateSlot}
          </div>

          <div className="flex items-stretch">
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center text-zinc-900 transition-colors hover:bg-zinc-100 hover:text-red-700 md:hidden"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((current) => !current)}
            >
              <MenuIcon open={open} />
            </button>
            <LiveTvHeaderLink />
          </div>
        </div>

        {open ? (
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={closeMenu}
          />
        ) : null}

        <nav
          id={menuId}
          aria-label="Main navigation"
          className={`border-t border-zinc-200 bg-[#e8ebf3] ${
            open
              ? "absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto shadow-lg"
              : "hidden md:block"
          }`}
        >
          <div className="mx-auto w-full max-w-7xl">
            <ul className="flex flex-col gap-1 px-3 py-3 md:hidden">
              {mobileNavLinks.map((item) => (
                <li key={item.href}>
                  <NavLink
                    item={item}
                    isActive={activeHref === item.href}
                    onNavigate={closeMenu}
                    mobile
                  />
                </li>
              ))}
            </ul>

            <div className="hidden items-center justify-between gap-4 px-4 py-3 md:flex">
              <ul className="flex min-w-0 flex-wrap items-center justify-start gap-x-5 gap-y-2 lg:gap-x-6 xl:gap-x-8">
                {navLinks.map((item) => (
                  <li key={item.href} className="shrink-0">
                    <NavLink
                      item={item}
                      isActive={activeHref === item.href}
                    />
                  </li>
                ))}
              </ul>

              <ul className="shrink-0">
                <li>
                  <NavLink
                    item={contactLink}
                    isActive={activeHref === contactLink.href}
                  />
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
