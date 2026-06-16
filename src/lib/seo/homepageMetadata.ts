import type { Metadata } from "next";
import type { NewsItem } from "@/lib/mock/newsData";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  HOME_PAGE_DESCRIPTION,
  HOME_PAGE_KEYWORDS,
  HOME_PAGE_TITLE,
  SITE_NAME,
} from "@/lib/seo/site";

function buildHomeDescription(topStory?: NewsItem | null) {
  if (!topStory?.title) {
    return HOME_PAGE_DESCRIPTION;
  }

  const lead = `${topStory.title.trim()}.`;
  const combined = `${lead} ${HOME_PAGE_DESCRIPTION}`;

  if (combined.length <= 160) {
    return combined;
  }

  return HOME_PAGE_DESCRIPTION;
}

export function buildHomepageMetadata(topStory?: NewsItem | null): Metadata {
  const description = buildHomeDescription(topStory);
  const base = buildPageMetadata({
    title: HOME_PAGE_TITLE,
    description,
    path: "/",
    image: topStory?.imageUrl,
  });

  return {
    ...base,
    title: {
      absolute: HOME_PAGE_TITLE,
    },
    description,
    keywords: [...HOME_PAGE_KEYWORDS],
    openGraph: {
      ...base.openGraph,
      title: HOME_PAGE_TITLE,
      description,
    },
    twitter: {
      ...base.twitter,
      title: HOME_PAGE_TITLE,
      description,
    },
    category: "news",
  };
}

export function buildHomepageHeading() {
  return `${SITE_NAME} — പ്രധാന വാർത്തകൾ`;
}
