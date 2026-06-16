export const mainNavLinks = [
  { label: "HOME", href: "/" },
  { label: "KASARAGOD", href: "/kasaragod" },
  { label: "KERALA", href: "/kerala" },
  { label: "NATIONAL", href: "/national" },
  { label: "VIDEOS", href: "/videos" },
] as const;

export const contactNavLink = {
  label: "CONTACT US",
  href: "/contact",
} as const;

export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  section: string;
  minutesAgo: number;
  imageUrl?: string | null;
};

export type CategoryPageSlug =
  | "kasaragod"
  | "kerala"
  | "national"
  | "entertainment"
  | "sports"
  | "business";

export type PageSlug = CategoryPageSlug | "videos";

export const pageMeta: Record<
  PageSlug,
  { title: string; titleMl: string; description: string }
> = {
  kasaragod: {
    title: "Kasaragod",
    titleMl: "കാസർഗോഡ്",
    description: "കാസർഗോഡ് ജില്ലാ വാർത്തകളും അപ്ഡേറ്റുകളും",
  },
  kerala: {
    title: "Kerala",
    titleMl: "കേരളം",
    description: "കേരളത്തിലെ പ്രധാന വാർത്തകൾ",
  },
  national: {
    title: "National",
    titleMl: "ദേശീയം",
    description: "ദേശീയ വാർത്തകളും വിശകലനങ്ങളും",
  },
  entertainment: {
    title: "Entertainment",
    titleMl: "വിനോദം",
    description: "വിനോദ ലോകത്തെ വാർത്തകളും അപ്ഡേറ്റുകളും",
  },
  sports: {
    title: "Sports",
    titleMl: "കായികം",
    description: "കായിക വാർത്തകളും റിപ്പോർട്ടുകളും",
  },
  business: {
    title: "Business",
    titleMl: "ബിസിനസ്",
    description: "ബിസിനസ് വാർത്തകളും സാമ്പത്തിക അപ്ഡേറ്റുകളും",
  },
  videos: {
    title: "Videos",
    titleMl: "വീഡിയോ",
    description: "സിറ്റി ചാനൽ വീഡിയോകളും ലൈവ് ടിവി",
  },
};

const pageSections: Record<PageSlug, string[]> = {
  kasaragod: ["കാസർഗോഡ്", "കേരളം"],
  kerala: ["കേരളം", "ആരോഗ്യം", "പ്രാദേശികം"],
  national: ["ദേശീയം", "ക്രൈം", "ബിസിനസ്", "സാങ്കേതികം", "ഫാക്ട് ചെക്ക്", "ഗൾഫ്"],
  entertainment: ["വിനോദം", "Entertainment"],
  sports: ["കായികം", "Sports"],
  business: ["ബിസിനസ്", "Business"],
  videos: ["വിനോദം", "കായികം", "സാങ്കേതികം"],
};

const categories = [
  "കേരളം",
  "പ്രാദേശികം",
  "ദേശീയം",
  "അന്തർദേശീയം",
  "കായികം",
  "സാങ്കേതികം",
  "ബിസിനസ്",
  "ക്രൈം",
  "ആരോഗ്യം",
  "വിനോദം",
];

const minutes = (m: number) => m;

export const sections: {
  categories: string[];
  topStories: NewsItem[];
  latest: NewsItem[];
  trending: NewsItem[];
  mustRead: NewsItem[];
} = {
  categories,
  topStories: [
    {
      id: "s1",
      title: "ടെലിഗ്രാം ഇനി പ്ലേ സ്റ്റോറിൽ ലഭ്യമല്ല; ഗൂഗിൾ പ്ലേ സ്റ്റോറിൽ നിന്ന് നീക്കം ചെയ്തു",
      excerpt:
        "ഗൂഗിൾ പ്ലേ സ്റ്റോറിൽ നിന്ന് ടെലിഗ്രാം നീക്കം ചെയ്തു. പുതിയതായി ഡൗൺലോഡ് ചെയ്യാൻ കഴിയില്ല.",
      section: "സാങ്കേതികം",
      minutesAgo: minutes(8),
    },
    {
      id: "s2",
      title: "കാഫിർ സ്ക്രീൻ ഷോട്ട് കേസിൽ ആദ്യ അറസ്റ്റ്; DYFI നേതാവ് ജിതിൻ ഭാസ്കർ അറസ്റ്റിൽ",
      excerpt:
        "സോഷ്യൽ മീഡിയ പോസ്റ്റുമായി ബന്ധപ്പെട്ട കേസിൽ ആദ്യ അറസ്റ്റ് രേഖപ്പെടുത്തി.",
      section: "ക്രൈം",
      minutesAgo: minutes(22),
    },
    {
      id: "s3",
      title: "നീറ്റ് പരീക്ഷയ്ക്ക് മുന്നോടിയായി ഇന്ത്യയിൽ ടെലിഗ്രാം നിരോധിച്ചു",
      excerpt:
        "പരീക്ഷാ സമയത്ത് വ്യാജ വാർത്തകൾ തടയുന്നതിനായി ടെലിഗ്രാം താൽക്കാലികമായി നിരോധിച്ചു.",
      section: "ദേശീയം",
      minutesAgo: minutes(35),
    },
    {
      id: "s4",
      title: "കോഴിക്കോട് 9 വയസുകാരന് ഷിഗെല്ല സ്ഥിരീകരിച്ചു",
      excerpt:
        "ജില്ലാ ആരോഗ്യ വകുപ്പ് നിരീക്ഷണം ശക്തമാക്കി. പൊതുജനങ്ങൾക്ക് മുൻകരുതലുകൾ പാലിക്കാൻ നിർദേശം.",
      section: "ആരോഗ്യം",
      minutesAgo: minutes(47),
    },
    {
      id: "s5",
      title: "മുഖ്യമന്ത്രി നൽകിയ ഉറപ്പ് പാലിച്ചു; വിനോദിനിക്ക് മൂന്ന് മാസത്തെയും കുടിശിക തുക ലഭിച്ചു",
      excerpt:
        "ജൂൺ മാസത്തെ ധനസഹായം ഉടൻ ലഭ്യമാക്കുമെന്ന് ഉറപ്പ് നൽകി.",
      section: "കേരളം",
      minutesAgo: minutes(60),
    },
    {
      id: "kg1",
      title: "കാസർഗോഡ് നഗരസഭാ ബജറ്റ് അവതീർണം; വികസന പദ്ധതികൾക്ക് പ്രാധാന്യം",
      excerpt:
        "നഗരസഭാ ബജറ്റിൽ റോഡ്, ആരോഗ്യം, വിദ്യാഭ്യാസ മേഖലകൾക്ക് കൂടുതൽ നീക്കിയിരിക്കുന്നു.",
      section: "കാസർഗോഡ്",
      minutesAgo: minutes(15),
    },
    {
      id: "kg2",
      title: "കാസർഗോഡ് ജില്ലയിൽ മഴക്കെടുതി മുന്നറിയിപ്പ്; തയ്യാറെടുപ്പ് ശക്തമാക്കി",
      excerpt:
        "ജില്ലാ ഭരണകൂടം അപകട മേഖലകളിൽ മുന്നൊരുക്കം നടത്തുന്നു.",
      section: "കാസർഗോഡ്",
      minutesAgo: minutes(28),
    },
  ],
  latest: [
    {
      id: "l1",
      title: "ഫേസ്ബുക്കിൽ വരുന്നു പുതിയ എഐ ഫീച്ചേഴ്സ്",
      excerpt:
        "പബ്ലിക് പോസ്റ്റുകളിൽ നിന്നുള്ള വിവരങ്ങൾ എഐ കണ്ടെത്തി പറഞ്ഞുതരും.",
      section: "സാങ്കേതികം",
      minutesAgo: minutes(12),
    },
    {
      id: "l2",
      title: "ഇൻഡിഗോ വിമാനത്തിലെ പ്രതിഷേധം; ഇ പി ജയരാജനെതിരെ അന്വേഷണം",
      excerpt:
        "കോടതി കേസ് എഴുതി തള്ളാനാവില്ലെന്ന് വ്യക്തമാക്കി.",
      section: "ദേശീയം",
      minutesAgo: minutes(18),
    },
    {
      id: "l3",
      title: "നിപ വൈറസ് ഉറവിടം കണ്ടെത്താൻ കഴിഞ്ഞിട്ടില്ല",
      excerpt:
        "കോഴിക്കോട് ജില്ലാ കളക്ടർ എം എസ് മാധവിക്കുട്ടി വാർത്താസമ്മേളനത്തിൽ വിവരം.",
      section: "കേരളം",
      minutesAgo: minutes(26),
    },
    {
      id: "l4",
      title: "എല്ലാ ക്യാരവാനും പരിശോധിക്കും; ഓപ്പറേഷൻ തൂഫാനിൽ 10 കോടിയുടെ ലഹരി മരുന്ന് പിടിച്ചു",
      excerpt:
        "സംസ്ഥാന പോലീസ് കർശന നടപടി ഊർജിതമാക്കി.",
      section: "ക്രൈം",
      minutesAgo: minutes(41),
    },
    {
      id: "l5",
      title: "സൗദിയിലെ സ്വകാര്യ മേഖലയിലെ തൊഴിലാളികൾക്ക് ആശ്വാസം",
      excerpt:
        "ഉച്ചസമയത്തെ ജോലി വിലക്ക് നിലവിൽ വന്നു.",
      section: "ഗൾഫ്",
      minutesAgo: minutes(55),
    },
    {
      id: "l6",
      title: "കാസർഗോഡ് തീരദേശ റോഡിൽ ഗതാഗത നിയന്ത്രണം",
      excerpt:
        "നിർമാണ പ്രവർത്തനങ്ങൾക്കായി വാഹനങ്ങൾക്ക് വഴിതിരിച്ചുവിടൽ.",
      section: "കാസർഗോഡ്",
      minutesAgo: minutes(32),
    },
  ],
  trending: [
    {
      id: "t1",
      title: "ബന്ധുവായ ആളെ സ്ഥാനാർഥിയാക്കുന്നത് പാർട്ടിയെ കടന്നാക്രമിക്കാനുള്ള അവസരമാകുമെന്ന് എം എ ബേബി",
      excerpt:
        "രാഷ്ട്രീയ വിവാദവിഷയത്തിൽ പുതിയ പ്രതികരണം.",
      section: "ദേശീയം",
      minutesAgo: minutes(6),
    },
    {
      id: "t2",
      title: "ദൃഢം സിനിമ എന്റെ ചെറുകഥ മോഷ്ടിച്ചതെന്ന് ആര്‍ ശ്രീലേഖ",
      excerpt:
        "ഭൂതകാലം സിനിമയുടെ കഥ മോഷണമാണെന്ന് ആരോപണം.",
      section: "വിനോദം",
      minutesAgo: minutes(14),
    },
    {
      id: "t3",
      title: "എല്ലാ കണ്ണുകളും കിലിയൻ എംബാപ്പെയിൽ; ഫ്രഞ്ച് പട ഇറങ്ങുന്നു",
      excerpt:
        "കൈവിട്ട കിരീടം തിരിച്ചു പിടിക്കാൻ ഫ്രാൻസ് തയ്യാറായി.",
      section: "കായികം",
      minutesAgo: minutes(19),
    },
    {
      id: "t4",
      title: "രാഹുൽ ഗാന്ധി ചതിയനും സത്യസന്ധയില്ലാത്ത നേതാവുമെന്ന് ഡിഎംകെ മുഖപത്രം",
      excerpt:
        "തമിഴ്നാട്ടിലെ രാഷ്ട്രീയ വിവാദം തീവ്രമാകുന്നു.",
      section: "ദേശീയം",
      minutesAgo: minutes(27),
    },
    {
      id: "t5",
      title: "അഹമ്മദാബാദ് വിമാനാപകടത്തിന് ഇന്നേയ്ക്ക് ഒരു വർഷം",
      excerpt:
        "ദുരൂഹത തുടരുന്നതായി ബന്ധപ്പെട്ടവർ.",
      section: "ദേശീയം",
      minutesAgo: minutes(33),
    },
    {
      id: "t6",
      title: "ലക്ഷ്മി പ്രിയയ്ക്കെതിരെ കോടതിയെ സമീപിച്ച് നടി അൻസിബ",
      excerpt:
        "കേസെടുക്കണമെന്ന് ആവശ്യപ്പെട്ട് ഹർജി നൽകി.",
      section: "വിനോദം",
      minutesAgo: minutes(39),
    },
    {
      id: "t7",
      title: "സംസ്ഥാനത്ത് വീണ്ടും ഷിഗെല്ല മരണം; ഏഴ് വയസുകാരൻ മരിച്ചു",
      excerpt:
        "ചികിത്സയിലായിരുന്ന കുട്ടി മരണമടഞ്ഞു.",
      section: "ആരോഗ്യം",
      minutesAgo: minutes(52),
    },
  ],
  mustRead: [
    {
      id: "m1",
      title: "വന്ദേമാതരവുമായി ബന്ധപ്പെട്ട ചർച്ചകൾ: പൂർണമായി ആലപിച്ചാല്‍ എന്താണ് തെറ്റ്?",
      excerpt:
        "വിവാദ വിഷയത്തെക്കുറിച്ച് വിശദമായി അറിയാം.",
      section: "ഫാക്ട് ചെക്ക്",
      minutesAgo: minutes(16),
    },
    {
      id: "m2",
      title: "അത്യാവശ്യമില്ലാതെ ഒരു വർഷത്തേക്ക് സ്വർണം വാങ്ങേണ്ടെന്ന് പ്രധാനമന്ത്രി പറഞ്ഞതിന് പിന്നിലെന്ത്?",
      excerpt:
        "താരിഫ് വർധന എന്തിനായിരുന്നു എന്ന് വിശദീകരിക്കുന്നു.",
      section: "ബിസിനസ്",
      minutesAgo: minutes(24),
    },
    {
      id: "m3",
      title: "ബംഗാളിലെ ബിജെപി ജയം: ബംഗ്ലാദേശില്‍ നിന്നുള്ള അനധികൃത കുടിയേറ്റക്കാർ നാടുവിടുന്നുവെന്നത് സത്യമോ?",
      excerpt:
        "വൈറൽ വിഡിയോയ്ക്ക് പിന്നിലെന്ത് എന്ന് പരിശോധിക്കുന്നു.",
      section: "ഫാക്ട് ചെക്ക്",
      minutesAgo: minutes(31),
    },
    {
      id: "m4",
      title: "ഇക്കളി പോരായെന്ന് ബ്രസീൽ ആരാധകർ; മൊറോക്കോ ഇന്ന് വരച്ചുകാട്ടിത്തന്നത് ബ്രസീലിയൻ നിരയിലെ പഴുതുകൾ",
      excerpt:
        "നെയ്മർ അവതരിക്കേണ്ടത് അത്യാവശ്യമെന്ന് ആരാധകർ.",
      section: "കായികം",
      minutesAgo: minutes(46),
    },
    {
      id: "m5",
      title: "ഡൽഹി പൊലീസിന്റെ സമീപനം മുതൽ ഇടത് സംഘടനകൾക്ക് മൈക്ക് നൽകാത്തത് വരെ",
      excerpt:
        "പാറ്റ വിപ്ലവം അവശേഷിപ്പിക്കുന്ന സംശയങ്ങൾ.",
      section: "ദേശീയം",
      minutesAgo: minutes(59),
    },
    {
      id: "m6",
      title: "ജാതി തിരിച്ചറിയാത്ത ഒരു പേര് വേണമെന്ന അച്ഛന്റെ ആഗ്രഹം; ജീവിതത്തിലും വെള്ളിത്തിരയിലും വ്യത്യസ്തനായ സലിംകുമാർ",
      excerpt:
        "മലയാള സിനിമയിലെ അപൂർവ കലാകാരന്റെ ജീവിതകഥ.",
      section: "വിനോദം",
      minutesAgo: minutes(73),
    },
  ],
};

export function getAllNewsItems(): NewsItem[] {
  const items = new Map<string, NewsItem>();

  for (const item of [
    ...sections.topStories,
    ...sections.latest,
    ...sections.trending,
    ...sections.mustRead,
  ]) {
    items.set(item.id, item);
  }

  return Array.from(items.values()).sort(
    (a, b) => a.minutesAgo - b.minutesAgo,
  );
}

export function getNewsForPage(page: PageSlug): NewsItem[] {
  if (page === "videos") {
    return [];
  }

  const allowed = pageSections[page];
  return getAllNewsItems().filter((item) => allowed.includes(item.section));
}
