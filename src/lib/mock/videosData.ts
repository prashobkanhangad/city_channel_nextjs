export type VideoItem = {
  id: string;
  title: string;
  minutesAgo: number;
  youtubeVideoId?: string;
};

const minutes = (m: number) => m;

export const videos: VideoItem[] = [
  {
    id: "v1",
    title: "കാസർഗോഡ് ജില്ലാ വാർത്താ അപ്ഡേറ്റ് | City TV",
    minutesAgo: minutes(12),
  },
  {
    id: "v2",
    title: "കേരളം ഇന്ന്: പ്രധാന വാർത്തകൾ",
    minutesAgo: minutes(25),
  },
  {
    id: "v3",
    title: "ദേശീയ വാർത്താ ബുള്ളറ്റിൻ",
    minutesAgo: minutes(38),
  },
  {
    id: "v4",
    title: "സിറ്റി ചാനൽ ലൈവ് റിപ്പോർട്ട്",
    minutesAgo: minutes(45),
  },
  {
    id: "v5",
    title: "കായിക വാർത്തകൾ | ഈ ആഴ്ച",
    minutesAgo: minutes(60),
  },
  {
    id: "v6",
    title: "വിനോദ ലോകം: സിനിമാ അപ്ഡേറ്റ്",
    minutesAgo: minutes(72),
  },
  {
    id: "v7",
    title: "സാങ്കേതിക വാർത്തകൾ | ടെക് ഡെസ്ക്",
    minutesAgo: minutes(90),
  },
  {
    id: "v8",
    title: "പ്രാദേശിക വാർത്താ സംപ്രേഷണം",
    minutesAgo: minutes(110),
  },
  {
    id: "v9",
    title: "ഇന്നത്തെ പ്രധാന ഹെഡ്ലൈൻസ്",
    minutesAgo: minutes(130),
  },
];
