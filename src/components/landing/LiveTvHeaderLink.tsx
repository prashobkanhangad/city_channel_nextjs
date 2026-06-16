import Link from "next/link";

export function LiveTvHeaderLink() {
  return (
    <Link
      href="/live-tv"
      prefetch={false}
      className="flex min-h-11 shrink-0 items-center justify-center self-stretch bg-red-700 px-3 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-red-800 sm:min-w-[132px] sm:px-5 sm:text-sm md:min-w-[170px] md:px-6 md:text-lg"
    >
      LIVE TV
    </Link>
  );
}
