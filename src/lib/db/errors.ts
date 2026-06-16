export function isMissingTableError(error: unknown, table: string): boolean {
  if (!(error instanceof Error)) return false;
  return (
    error.message.includes("Could not find the table") &&
    error.message.includes(table)
  );
}

export function isMissingPostsTableError(error: unknown): boolean {
  return isMissingTableError(error, "posts");
}

export function isMissingCategoriesTableError(error: unknown): boolean {
  return isMissingTableError(error, "categories");
}

export function isMissingAdvertisementsTableError(error: unknown): boolean {
  return isMissingTableError(error, "advertisements");
}

export function isMissingVideosTableError(error: unknown): boolean {
  return isMissingTableError(error, "videos");
}

export function isMissingHomepageSettingsTableError(error: unknown): boolean {
  return isMissingTableError(error, "homepage_settings");
}
