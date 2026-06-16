export const SITE_NAME = "സിറ്റി ചാനൽ";
export const DEFAULT_DESCRIPTION =
  "മലയാളം വാർത്താ പോർട്ടൽ - നഗര വാർത്തകളും അപ്ഡേറ്റുകളും";

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configured) {
    return configured.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export const DEFAULT_OG_IMAGE = "/logo.png";
