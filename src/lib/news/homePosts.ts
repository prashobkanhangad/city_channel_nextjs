import {
  getHomepageSectionMeta,
  HOMEPAGE_SECTIONS,
  HOMEPAGE_TOPIC_SECTIONS,
} from "@/lib/constants/homepageSections";
import {
  getPublishedPosts,
  getPublishedPostsByHomepageSection,
  getTrendingPublishedPosts,
} from "@/lib/db/posts";
import { getAllNewsItems, sections, type NewsItem } from "@/lib/mock/newsData";
import { postToNewsItem } from "@/lib/news/postNewsItem";

export type HomepageNewsSections = {
  categories: string[];
  topStories: NewsItem[];
  latest: NewsItem[];
  trending: NewsItem[];
  mustRead: NewsItem[];
  special: NewsItem[];
};

export type HomepageTopicSections = {
  entertainment: NewsItem[];
  sports: NewsItem[];
  business: NewsItem[];
};

function getMockTopicItems(mockSections: readonly string[], limit: number) {
  return getAllNewsItems()
    .filter((item) => mockSections.includes(item.section))
    .slice(0, limit);
}

async function loadHomepageSectionItems(
  sectionValue: (typeof HOMEPAGE_TOPIC_SECTIONS)[number]["value"],
): Promise<NewsItem[]> {
  const meta = getHomepageSectionMeta(sectionValue);
  if (!meta) return [];

  try {
    const tagged = await getPublishedPostsByHomepageSection(
      sectionValue,
      meta.publicLimit,
    );

    if (tagged.length > 0) {
      return tagged.map(postToNewsItem);
    }
  } catch {
    // Fall back to mock content below.
  }

  return getMockTopicItems(meta.mockSections, meta.publicLimit);
}

export async function getHomepageTopicSections(): Promise<HomepageTopicSections> {
  const [entertainment, sports, business] = await Promise.all([
    loadHomepageSectionItems("entertainment"),
    loadHomepageSectionItems("sports"),
    loadHomepageSectionItems("business"),
  ]);

  return { entertainment, sports, business };
}

export async function getHomepageNewsSections(): Promise<HomepageNewsSections> {
  const primarySections = HOMEPAGE_SECTIONS.filter(
    (section) => section.value !== "entertainment" && section.value !== "sports" && section.value !== "business",
  );

  try {
    const [recentPosts, trendingPosts, ...sectionPosts] = await Promise.all([
      getPublishedPosts(24),
      getTrendingPublishedPosts(10),
      ...primarySections.map((section) =>
        getPublishedPostsByHomepageSection(
          section.value,
          section.publicLimit,
        ),
      ),
    ]);

    if (recentPosts.length === 0) {
      return {
        ...sections,
        special: sections.latest.slice(0, 3),
      };
    }

    const latest = recentPosts.map(postToNewsItem);
    const [trendingTagged, mustReadTagged, specialTagged] = sectionPosts;

    const trending =
      trendingTagged.length > 0
        ? trendingTagged.map(postToNewsItem)
        : trendingPosts.length > 0
          ? trendingPosts.slice(0, 5).map(postToNewsItem)
          : latest.slice(0, 5);

    const mustRead =
      mustReadTagged.length > 0
        ? mustReadTagged.map(postToNewsItem)
        : trendingPosts.length > 1
          ? trendingPosts.slice(1, 6).map(postToNewsItem)
          : latest.slice(3, 8);

    const special =
      specialTagged.length > 0
        ? specialTagged.map(postToNewsItem)
        : latest.slice(0, 3);

    return {
      categories: sections.categories,
      topStories: latest.slice(0, 6),
      latest,
      trending,
      mustRead,
      special,
    };
  } catch {
    return {
      ...sections,
      special: sections.latest.slice(0, 3),
    };
  }
}

export { getHomepageSectionMeta, HOMEPAGE_SECTIONS };
