import Link from "next/link";

export function LiveTvHeaderLink() {
  return (
    <Link
      href="/live-tv"
      prefetch={false}
      className="grid min-w-[170px] place-items-center bg-red-700 px-6 text-lg font-semibold tracking-wide text-white hover:bg-red-800"
    >
      LIVE TV
    </Link>
  );
}
