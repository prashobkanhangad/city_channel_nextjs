import { CITY_TV_CHANNEL_URL } from "@/lib/constants/youtube";

export const SITE_NAME = "സിറ്റി ചാനൽ";
export const SITE_ALTERNATE_NAME = "City Channel";

export const DEFAULT_DESCRIPTION =
  "മലയാളം വാർത്താ പോർട്ടൽ - നഗര വാർത്തകളും അപ്ഡേറ്റുകളും";

export const HOME_PAGE_TITLE = `${SITE_NAME} | കാസർഗോഡ്, കേരള, ദേശീയ വാർത്തകൾ`;

export const HOME_PAGE_DESCRIPTION =
  "സിറ്റി ചാനൽ മലയാളം വാർത്താ പോർട്ടൽ. കാസർഗോഡ്, കേരള, ദേശീയ വാർത്തകൾ, ക്രീഡ, വിനോദം, ബിസിനസ്, വീഡിയോകൾ, സിറ്റി ടിവി ലൈവ് എന്നിവ ഒരിടത്ത്.";

export const HOME_PAGE_KEYWORDS = [
  "സിറ്റി ചാനൽ",
  "City Channel",
  "മലയാളം വാർത്ത",
  "കാസർഗോഡ് വാർത്ത",
  "കേരള വാർത്ത",
  "ദേശീയ വാർത്ത",
  "Malayalam news",
  "Kasaragod news",
  "Kerala news",
  "City TV",
] as const;

export const SITE_SOCIAL_LINKS = [CITY_TV_CHANNEL_URL] as const;

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
