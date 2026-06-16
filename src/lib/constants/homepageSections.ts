export const HOMEPAGE_SECTIONS = [
  {
    value: "trending",
    label: "Trending Now",
    fieldName: "homepage_trending",
    description: "Bottom homepage row — trending stories",
    publicLimit: 5,
    mockSections: [] as const,
  },
  {
    value: "must_read",
    label: "Must Read",
    fieldName: "homepage_must_read",
    description: "Bottom homepage row — must read list",
    publicLimit: 5,
    mockSections: [] as const,
  },
  {
    value: "special",
    label: "Special",
    fieldName: "homepage_special",
    description: "Bottom homepage row — featured image + list",
    publicLimit: 3,
    mockSections: [] as const,
  },
  {
    value: "entertainment",
    label: "Entertainment",
    fieldName: "homepage_entertainment",
    description: "Second homepage row — entertainment column",
    publicLimit: 5,
    mockSections: ["വിനോദം", "Entertainment"] as const,
    categoryHref: "/entertainment",
  },
  {
    value: "sports",
    label: "Sports",
    fieldName: "homepage_sports",
    description: "Second homepage row — sports column",
    publicLimit: 5,
    mockSections: ["കായികം", "Sports"] as const,
    categoryHref: "/sports",
  },
  {
    value: "business",
    label: "Business",
    fieldName: "homepage_business",
    description: "Second homepage row — business column",
    publicLimit: 5,
    mockSections: ["ബിസിനസ്", "Business"] as const,
    categoryHref: "/business",
  },
] as const;

export type HomepageSection = (typeof HOMEPAGE_SECTIONS)[number]["value"];

export const HOMEPAGE_SECTION_VALUES = HOMEPAGE_SECTIONS.map(
  (section) => section.value,
) as [HomepageSection, ...HomepageSection[]];

export const HOMEPAGE_TOPIC_SECTIONS = HOMEPAGE_SECTIONS.filter((section) =>
  ["entertainment", "sports", "business"].includes(section.value),
);

export function getHomepageSectionMeta(section: HomepageSection) {
  return HOMEPAGE_SECTIONS.find((item) => item.value === section);
}

export function parseHomepageSections(formData: FormData): HomepageSection[] {
  const sections: HomepageSection[] = [];

  for (const section of HOMEPAGE_SECTIONS) {
    if (formData.get(section.fieldName) === "on") {
      sections.push(section.value);
    }
  }

  return sections;
}

export function normalizeHomepageSections(
  values: string[] | null | undefined,
): HomepageSection[] {
  if (!values?.length) {
    return [];
  }

  const allowed = new Set<string>(HOMEPAGE_SECTION_VALUES);
  return values.filter((value): value is HomepageSection => allowed.has(value));
}
