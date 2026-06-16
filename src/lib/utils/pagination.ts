export function parsePageParam(value: string | undefined, fallback = 1): number {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  return parsed;
}

export function getTotalPages(totalCount: number, pageSize: number): number {
  if (totalCount <= 0) {
    return 1;
  }
  return Math.ceil(totalCount / pageSize);
}

export function clampPage(page: number, totalPages: number): number {
  return Math.min(Math.max(1, page), Math.max(1, totalPages));
}

export type PaginationPageItem = number | "ellipsis";

export function getVisiblePageNumbers(
  currentPage: number,
  totalPages: number,
): PaginationPageItem[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ];
}

export function buildPageHref(basePath: string, page: number): string {
  if (page <= 1) {
    return basePath;
  }
  return `${basePath}?page=${page}`;
}

export type PaginatedResult<T> = {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
};

export function buildPaginatedResult<T>(
  items: T[],
  totalCount: number,
  page: number,
  pageSize: number,
): PaginatedResult<T> {
  const totalPages = getTotalPages(totalCount, pageSize);

  return {
    items,
    currentPage: clampPage(page, totalPages),
    totalPages,
    totalCount,
  };
}
