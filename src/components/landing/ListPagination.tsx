import Link from "next/link";
import {
  buildPageHref,
  getVisiblePageNumbers,
} from "@/lib/utils/pagination";

type ListPaginationProps = {
  basePath: string;
  currentPage: number;
  totalPages: number;
};

const buttonClass =
  "inline-flex min-w-[40px] items-center justify-center px-3 py-2 text-sm font-semibold";
const inactiveClass = "bg-zinc-100 text-zinc-700 hover:bg-yellow-100";
const activeClass = "bg-yellow-400 text-zinc-900";

export function ListPagination({
  basePath,
  currentPage,
  totalPages,
}: ListPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getVisiblePageNumbers(currentPage, totalPages);

  return (
    <nav
      className="mt-8 flex flex-wrap items-center gap-2"
      aria-label="Pagination"
    >
      <span className="mr-2 bg-yellow-400 px-3 py-2 text-sm font-semibold text-zinc-900">
        Page {currentPage} of {totalPages.toLocaleString("en-IN")}
      </span>

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
          <span key={`ellipsis-${index}`} className="px-2 text-sm text-zinc-500">
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
    </nav>
  );
}
