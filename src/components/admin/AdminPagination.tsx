import Link from "next/link";
import {
  buildPageHref,
  getVisiblePageNumbers,
} from "@/lib/utils/pagination";

type AdminPaginationProps = {
  basePath: string;
  currentPage: number;
  totalPages: number;
};

const buttonClass =
  "inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-medium";
const inactiveClass =
  "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50";
const activeClass = "border-red-200 bg-red-50 text-red-700";

export function AdminPagination({
  basePath,
  currentPage,
  totalPages,
}: AdminPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getVisiblePageNumbers(currentPage, totalPages);

  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 px-5 py-4"
      aria-label="Pagination"
    >
      <p className="text-sm text-zinc-500">
        Page {currentPage} of {totalPages.toLocaleString("en-IN")}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {currentPage > 1 ? (
          <Link
            href={buildPageHref(basePath, currentPage - 1)}
            className={`${buttonClass} ${inactiveClass}`}
          >
            Prev
          </Link>
        ) : null}

        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="px-1 text-sm text-zinc-400">
              ...
            </span>
          ) : (
            <Link
              key={page}
              href={buildPageHref(basePath, page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={`${buttonClass} ${
                page === currentPage ? activeClass : inactiveClass
              }`}
            >
              {page.toLocaleString("en-IN")}
            </Link>
          ),
        )}

        {currentPage < totalPages ? (
          <Link
            href={buildPageHref(basePath, currentPage + 1)}
            className={`${buttonClass} ${inactiveClass}`}
          >
            Next
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
